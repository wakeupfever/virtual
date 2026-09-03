#!/usr/bin/env node
/**
 * scripts/check-layer2.mjs · 第二层 token 约束与覆盖度（R-047 / R-048）
 *
 * ① 约束：ui/**\/*.vue 的 <style> 与 skins/*.css 里，视觉属性的值必须来自第一层语义 token。
 *    - 裸色（#hex / rgb / hsl）、裸长度（px / rem / em，0 除外）→ 错误
 *    - 引用原始刻度（--palette-* / --space-N）→ 错误
 *    - 在第二层定义语义名（--color-* / --space-* / --layout-* / --font-* / --radius-* / --shadow-* / --border-*）→ 错误（只能提议进第一层）
 *    - 引用 tokens.css 里不存在的 token → 错误
 * ② 覆盖度：统计每个文件消费的 token（.vue 全文含 :style / script；模板用到的 .l-* 类所消费的 token 记为间接消费；第一层 layout.css / base.css 也计入）、每个 token 被谁消费；
 *    既无第二层消费、也未被 tokens.css 的 --el-* 映射引用的语义 token 列为「死 token」（警告）；
 *    复合组件至少覆盖 bg / text / border / space 四类中的三类（纯文字组件除外，警告）。
 *    结果写入 dist/token-coverage.json 与 dist/token-coverage.js（window.DS_COVERAGE，展示页配置卡据此列出消费的 token）。
 *
 * 用法：node scripts/check-layer2.mjs [--strict]   （--strict 下警告也视为失败）
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, dirname, relative, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const PKG = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const strict = process.argv.includes('--strict')
const rel = p => relative(PKG, p).replace(/\\/g, '/')

/* ---------- 第一层真值 ---------- */
const tokensCss = readFileSync(resolve(PKG, 'tokens.css'), 'utf8')
const defined = new Set([...tokensCss.matchAll(/(--[\w-]+)\s*:/g)].map(m => m[1]))
const SEMANTIC_PREFIX = /^--(color|space-(page|module|component|inline)|layout|grid|breakpoint|z|font|line-height|radius|shadow|border|density)\b/
const RAW = /^--(palette-|space-\d+$)/
const semanticTokens = [...defined].filter(n => SEMANTIC_PREFIX.test(n) && !RAW.test(n) && !n.startsWith('--el-'))
/** 被 tokens.css ③ 段 --el-* 映射引用的 token：由 Element Plus 消费 */
const elMapped = new Set([...tokensCss.matchAll(/--el-[\w-]+\s*:\s*([^;]+);/g)].flatMap(m => [...m[1].matchAll(/var\((--[\w-]+)/g)].map(x => x[1])))

/* ---------- 需要 token 驱动的属性 ---------- */
const VISUAL_PROPS = /^(color|background(-color)?|border(-(top|right|bottom|left))?(-color|-width)?|outline(-color)?|box-shadow|text-shadow|padding(-(top|right|bottom|left|inline|block))?|margin(-(top|right|bottom|left|inline|block))?|gap|row-gap|column-gap|border(-(top|bottom)-(left|right))?-radius|font-size|font-family|font-weight|line-height|width|min-width|max-width|height|min-height|max-height|inset|top|right|bottom|left|z-index|fill|stroke)$/
/** 允许的非 token 值（关键字 / 无量纲 / 百分比 / 结构性值） */
const ALLOWED_VALUE = /^(none|auto|inherit|initial|unset|transparent|currentcolor|0|100%|100d?vh|100s?vw|\d+(\.\d+)?%|fit-content|max-content|min-content|normal|nowrap|hidden|visible|1|-?\d+(\.\d+)?(?![a-z%])|(calc|min|max|clamp|color-mix)\(.*\))$/i
const BARE_COLOR = /#[0-9a-f]{3,8}\b|\b(rgb|rgba|hsl|hsla|oklch)\(/i
const BARE_LENGTH = /(?<![\w.-])(?!0(?:px|rem|em)?(?![\d.]))\d*\.?\d+(px|rem|em|vh|vw)\b/i

/* ---------- 收集第二层样式源 ---------- */
function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else if (/\.(vue|css)$/.test(e.name)) out.push(p)
  }
  return out
}
const files = [...walk(resolve(PKG, 'ui')), ...walk(resolve(PKG, 'skins')), resolve(PKG, 'layout.css'), resolve(PKG, 'base.css')]

function styleOf(file, src) {
  if (file.endsWith('.css')) return src
  return [...src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n')
}

/* ---------- 第一层 .l-* 类 → 它消费的 token（组件模板里用到 .l-* 类即间接消费） ---------- */
const layoutCss = readFileSync(resolve(PKG, 'layout.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
const layoutClassTokens = {}
for (const m of layoutCss.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
  const toks = [...m[2].matchAll(/var\((--[\w-]+)/g)].map(x => x[1]).filter(t => !t.startsWith('--el-'))
  for (const cls of m[1].matchAll(/\.(l-[\w-]+)/g)) (layoutClassTokens[cls[1]] ||= new Set()); 
  for (const cls of m[1].matchAll(/\.(l-[\w-]+)/g)) toks.forEach(t => layoutClassTokens[cls[1]].add(t))
}

/* ---------- ① 约束 ---------- */
const errors = [], warnings = []
const usage = {}          // file → Set(token)
const consumers = {}      // token → Set(file)
for (const file of files) {
  const src = readFileSync(file, 'utf8')
  const css = styleOf(file, src).replace(/\/\*[\s\S]*?\*\//g, '')
  const name = rel(file)
  usage[name] = new Set()
  const isLayer1 = name === 'layout.css' || name === 'base.css'
  // 引用（.vue 全文：<style> 之外的 :style / script 里的 var(--x) 也算消费）
  for (const m of src.matchAll(/var\(\s*(--[\w-]+)/g)) {
    const t = m[1]
    if (t.startsWith('--el-')) continue
    if (RAW.test(t)) { if (!isLayer1) errors.push(`${name}: 引用原始刻度 ${t}`) }
    else if (!defined.has(t)) errors.push(`${name}: 引用不存在的 token ${t}`)
    else { usage[name].add(t); (consumers[t] ||= new Set()).add(name) }
  }
  if (isLayer1) continue
  // 模板里用到的 .l-* 类：其 token 记为间接消费（记入覆盖度，标 via）
  for (const m of src.matchAll(/\b(l-[\w-]+)\b/g)) for (const t of layoutClassTokens[m[1]] || []) { usage[name].add(t); (consumers[t] ||= new Set()).add(name + ' (via .' + m[1] + ')') }
  // 在第二层定义语义名
  for (const m of css.matchAll(/^\s*(--[\w-]+)\s*:/gm)) {
    const t = m[1]
    if (t.startsWith('--el-')) continue
    if (SEMANTIC_PREFIX.test(t) || RAW.test(t)) errors.push(`${name}: 第二层不得定义语义 token ${t}（请提议进第一层）`)
  }
  // 逐条声明检查
  const lines = css.split('\n')
  lines.forEach((line, i) => {
    for (const d of line.matchAll(/([a-z-]+)\s*:\s*([^;{}]+);/g)) {
      const prop = d[1], value = d[2].trim()
      if (prop.startsWith('--') ? !prop.startsWith('--el-') : !VISUAL_PROPS.test(prop)) continue
      if (/var\(--el-/.test(value) && !BARE_COLOR.test(value) && !BARE_LENGTH.test(value)) continue
      // 拆成空格分隔的片段，逐段判断
      const parts = value.replace(/var\([^)]*\)/g, 'VAR').split(/\s+/)
      for (const part of parts) {
        if (part === 'VAR' || part === 'solid' || part === 'dashed' || part === 'inset' || ALLOWED_VALUE.test(part)) continue
        if (BARE_COLOR.test(part)) errors.push(`${name}:${i + 1}: ${prop} 使用裸色 ${part}`)
        else if (BARE_LENGTH.test(part)) errors.push(`${name}:${i + 1}: ${prop} 使用裸长度 ${part}`)
      }
    }
  })
}

/* ---------- ② 覆盖度 ---------- */
/** 纯文字复合组件：不要求覆盖 bg / border */
const TEXT_ONLY = new Set(['UiModuleHeader'])
const categoryOf = t => t.startsWith('--color-bg') ? 'bg' : t.startsWith('--color-text') ? 'text' : t.startsWith('--color-border') ? 'border' : /^--space-/.test(t) ? 'space' : null
const components = {}
for (const [file, set] of Object.entries(usage)) {
  const m = file.match(/^ui\/(?:composites\/)?(Ui\w+)\.vue$/)
  if (!m) continue
  components[m[1]] = [...set].sort()
  if (file.includes('composites/') && !TEXT_ONLY.has(m[1])) {
    const cats = new Set([...set].map(categoryOf).filter(Boolean))
    if (cats.size < 3) warnings.push(`${file}: 只覆盖了 ${[...cats].join('/') || '无'}，复合组件至少应消费 bg / text / border / space 中的三类`)
  }
}
const elOnly = semanticTokens.filter(t => !consumers[t] && elMapped.has(t))
const dead = semanticTokens.filter(t => !consumers[t] && !elMapped.has(t) && !/^--(z-|breakpoint|density)/.test(t))
if (dead.length) warnings.push(`第二层与 Element Plus 映射都未消费的语义 token（${dead.length}）：${dead.join(', ')}`)

/* ---------- 输出 ---------- */
const report = {
  generatedAt: new Date().toISOString(),
  files: Object.fromEntries(Object.entries(usage).map(([f, s]) => [f, [...s].sort()])),
  components,
  tokens: Object.fromEntries(semanticTokens.map(t => [t, [...(consumers[t] || [])].sort()])),
  elOnly,
  dead,
}
mkdirSync(resolve(PKG, 'dist'), { recursive: true })
writeFileSync(resolve(PKG, 'dist/token-coverage.json'), JSON.stringify(report, null, 2) + '\n')
writeFileSync(resolve(PKG, 'dist/token-coverage.js'), `/* 由 scripts/check-layer2.mjs 自动生成，勿手改 */\nwindow.DS_COVERAGE = ${JSON.stringify(report, null, 2)};\n`)

for (const e of errors) console.log('✖ ' + e)
for (const w of warnings) console.log('⚠ ' + w)
console.log(`layer2: ${files.length} 个文件 · ${errors.length} 错误 · ${warnings.length} 警告 · 语义 token：第二层消费 ${semanticTokens.filter(t => consumers[t]).length} · 仅 Element Plus 映射消费 ${elOnly.length} · 未消费 ${dead.length} / 共 ${semanticTokens.length}`)
process.exit(errors.length || (strict && warnings.length) ? 1 : 0)
