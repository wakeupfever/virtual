#!/usr/bin/env node
/**
 * scripts/check-prototype.js · 原型合规检查（R-019）
 * 扫描 apps/prototypes/*.html，违反第三层规则即报错并以非零退出。
 * 用法：node scripts/check-prototype.js [--strict] [文件或目录...]   默认扫描 apps/prototypes
 *   --strict：promote 前使用；存在 data-placeholder 占位即失败
 * 另外统计 data-composite 候选结构（出现 ≥2 次提示下沉为复合组件）。
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const whitelist = JSON.parse(readFileSync(join(ROOT, 'packages/design-system/whitelist.json'), 'utf8'))
const ALLOWED_TAGS = new Set([...whitelist.elementPlus, ...whitelist.custom, ...whitelist.html])

const RULES = [
  { id: 'no-style-tag', re: /<style\b/i, msg: '禁止 <style>：外观只能来自第一、二层' },
  { id: 'no-inline-style', re: /\sstyle\s*=/i, msg: '禁止 inline style' },
  { id: 'no-raw-hex', re: /#[0-9a-fA-F]{3,8}(?![0-9a-zA-Z_-])/, msg: '禁止裸色值，使用 --color-* token' },
  { id: 'no-raw-rgb', re: /\b(rgba?|hsla?)\(/i, msg: '禁止裸色值，使用 --color-* token' },
  { id: 'no-flex-grid', re: /display\s*:\s*(flex|grid)/i, msg: '禁止手写 flex/grid，使用 .l-* 布局类' },
  { id: 'no-arbitrary-class', re: /class\s*=\s*"[^"]*\[[^"]*"/, msg: '禁止任意值 class（如 w-[137px]）' },
  { id: 'no-el-var-override', re: /--el-[a-z-]+\s*:/, msg: '禁止直接改 --el-* 变量，改 tokens.css 语义 token' },
  { id: 'no-self-closing-custom', re: /<(el-[a-z-]+|ui-[a-z-]+)\b[^>]*\/>/i, msg: 'in-DOM 模板中自定义标签不能自闭合，必须显式 </标签>' },
]

/** 去掉 HTML 注释与 JS 注释后再检查，避免注释里的说明文字触发规则（保留行数） */
function stripComments(src) {
  const keepLines = s => s.replace(/[^\n]/g, '')
  return src
    .replace(/<!--[\s\S]*?-->/g, keepLines)
    .replace(/\/\*[\s\S]*?\*\//g, keepLines)
    .replace(/(^|[^:'"])\/\/[^\n]*/g, '$1')
}

function stripScripts(html) {
  return html.replace(/<script\b[\s\S]*?<\/script>/gi, keep => keep.replace(/[^\n]/g, ''))
}

const composites = new Map()   // 候选结构名 → [文件...]
const placeholders = []        // { file, name, line }

function checkFile(file, strict) {
  const raw = stripComments(readFileSync(file, 'utf8'))
  const markup = stripScripts(raw)
  const errors = []

  // 候选结构与占位标记（R-040）
  for (const m of markup.matchAll(/data-composite="([^"]+)"/g)) { const arr = composites.get(m[1]) || []; arr.push(file); composites.set(m[1], arr) }
  for (const m of markup.matchAll(/data-placeholder="([^"]+)"/g)) {
    const line = markup.slice(0, m.index).split('\n').length
    placeholders.push({ file, name: m[1], line })
    if (strict) errors.push(`placeholder (line ${line}): 占位组件 "${m[1]}" 未消除，promote 前必须先在第二层实现（见 requests/）`)
  }

  for (const rule of RULES) {
    const target = rule.id === 'no-raw-hex' || rule.id === 'no-raw-rgb' || rule.id === 'no-el-var-override' ? raw : markup
    const m = target.match(rule.re)
    if (m) {
      const line = target.slice(0, m.index).split('\n').length
      errors.push(`${rule.id} (line ${line}): ${rule.msg} → ${m[0].slice(0, 60)}`)
    }
  }

  const tagRe = /<([a-z][a-z0-9-]*)\b/gi
  const seen = new Set()
  let m
  while ((m = tagRe.exec(markup))) {
    const tag = m[1].toLowerCase()
    if (['html', 'head', 'body', 'meta', 'link', 'title', 'script'].includes(tag)) continue
    if (!ALLOWED_TAGS.has(tag) && !seen.has(tag)) {
      seen.add(tag)
      const line = markup.slice(0, m.index).split('\n').length
      const hint = tag.startsWith('el-') ? '不在 Element Plus 白名单，先提议' : '原生元素被禁止或未登记，用白名单组件替代'
      errors.push(`tag-not-allowed (line ${line}): <${tag}> ${hint}`)
    }
  }

  if (!/const DATA\s*=/.test(raw)) errors.push('structure: 缺少 ① DATA 区块')
  if (!/const state\s*=\s*Vue\.reactive/.test(raw)) errors.push('structure: 缺少 ② state 区块（Vue.reactive）')
  if (!/id="app"/.test(markup)) errors.push('structure: 缺少 ③ 模板 <div id="app">')
  if (!/<ui-shell\b/i.test(markup)) errors.push('structure: 原型必须套用 <ui-shell>（R-017）')
  for (const s of ['loading', 'empty', 'error']) {
    if (!raw.includes(`'${s}'`) && !raw.includes(`"${s}"`)) errors.push(`state: 缺少 ${s} 状态样本（R-018）`)
  }

  return errors
}

function collect(paths) {
  const files = []
  for (const p of paths) {
    const abs = resolve(p)
    if (statSync(abs).isDirectory()) {
      for (const f of readdirSync(abs)) if (f.endsWith('.html')) files.push(join(abs, f))
    } else files.push(abs)
  }
  return files
}

const argv = process.argv.slice(2)
const strict = argv.includes('--strict')
const targets = argv.filter(a => a !== '--strict')
const files = collect(targets.length ? targets : [join(ROOT, 'apps/prototypes')])
let failed = 0
for (const f of files) {
  const errs = checkFile(f, strict)
  if (errs.length) {
    failed++
    console.error(`✖ ${f}`)
    for (const e of errs) console.error(`   ${e}`)
  } else {
    console.log(`✔ ${f}`)
  }
}
// 候选结构统计
if (composites.size) {
  console.log('\n候选结构（data-composite）：')
  for (const [name, list] of [...composites.entries()].sort((a, b) => b[1].length - a[1].length)) {
    const uniq = [...new Set(list)]
    console.log(`  ${list.length >= 2 ? '↓' : ' '} ${name} × ${list.length}（${uniq.length} 个文件）${list.length >= 2 ? '  → 出现 ≥2 次，建议下沉为 ui/composites/ 复合组件' : ''}`)
  }
}
if (placeholders.length) {
  console[strict ? 'error' : 'warn'](`\n占位组件（data-placeholder）${strict ? '' : '，promote 前需消除'}：`)
  for (const p of placeholders) console[strict ? 'error' : 'warn'](`  ${strict ? '✖' : '!'} ${p.name}  ${p.file}:${p.line}`)
}
if (failed) {
  console.error(`\n${failed} 个原型不合规`)
  process.exit(1)
}
console.log(`\n${files.length} 个原型全部通过`)
