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
  { id: 'no-overflow-scroll', re: /overflow(-[xy])?\s*:\s*(auto|scroll)/i, msg: '禁止原生滚动，滚动区域必须用 <el-scrollbar>（R-043）' },
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

/** 第一层真实存在的 .l-* 类：写错或凭空发明一个类名时，浏览器不会报错、检查也曾放行，
 *  页面只是安静地不对齐（.l-cluster--center 就这么混进过原型）。这里按 layout.css / base.css 的实际定义校验。 */
const LAYOUT_CLASSES = new Set(
  ['layout.css', 'base.css']
    .flatMap(f => [...readFileSync(join(ROOT, 'packages/design-system', f), 'utf8').matchAll(/\.(l-[a-z0-9-]+)/g)].map(m => m[1])),
)

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

  // .l-* 类必须在第一层真实定义（R-058）
  const unknownClasses = new Map()
  for (const m of markup.matchAll(/class="([^"]*)"/g)) {
    for (const cls of m[1].split(/\s+/)) {
      if (!cls.startsWith('l-') || LAYOUT_CLASSES.has(cls)) continue
      if (!unknownClasses.has(cls)) unknownClasses.set(cls, markup.slice(0, m.index).split('\n').length)
    }
  }
  for (const [cls, line] of unknownClasses) {
    errors.push(`unknown-layout-class (line ${line}): .${cls} 在第一层不存在（layout.css / base.css），写错类名浏览器不会报错，页面只会安静地不对齐`)
  }

  // 操作列（R-056）：行内动作最多两个、必须打 is-actions，否则窄列里会折行、间距也不齐
  for (const m of markup.matchAll(/<(?:el-table-column|ElTableColumn)\b[^>]*label="操作"[^>]*>([\s\S]*?)<\/(?:el-table-column|ElTableColumn)>/g)) {
    const line = markup.slice(0, m.index).split('\n').length
    const head = m[0].slice(0, m[0].indexOf('>') + 1)
    // v-else / v-else-if 的按钮是同一个位置的分支，不重复计数
    const buttons = (m[1].match(/<el-button\b[^>]*>/gi) || []).filter(tag => !/\sv-else/i.test(tag)).length
    if (!/class-name="[^"]*\bis-actions\b/.test(head)) {
      errors.push(`actions-column (line ${line}): 操作列必须写 class-name="is-actions"（由 skins/table.css 负责不换行与间距）`)
    }
    if (buttons > 2) {
      errors.push(`actions-column (line ${line}): 操作列有 ${buttons} 个按钮，行内动作最多 2 个，其余放进详情抽屉 / 弹窗（CLAUDE.md §2）`)
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
/**
 * 展示页「布局配置」的五套骨架（R-057）：CLAUDE.md §3 让原型从「复制页面骨架」起步，
 * 那这些字符串本身就必须是能直接粘进 in-DOM 原型的合法内容——显式闭合、无 inline style、只用白名单标签。
 * 曾经不是：13 处 inline style、7 处非白名单标签、大量自闭合，照抄必被本脚本拦下。
 * el-progress / el-tree 是台账里已登记的白名单缺口（阻塞项），这里按 PENDING 单独提示，不静默放行。
 */
const PENDING_WHITELIST = new Set(['el-progress', 'el-tree'])

function checkSkeletons() {
  const src = readFileSync(join(ROOT, 'packages/design-system/showcase.data.js'), 'utf8')
  const sandbox = { DS_COVERAGE: { components: {} } }
  new Function('window', src)(sandbox)
  const templates = sandbox.DS_SHOWCASE?.TEMPLATES ?? []
  const errors = []
  const pending = new Map()
  for (const tpl of templates) {
    const markup = tpl.skeleton ?? ''
    const where = `${tpl.no} ${tpl.label}`
    for (const rule of RULES) {
      const m = markup.match(rule.re)
      if (m) errors.push(`skeleton [${where}] ${rule.id}: ${rule.msg} → ${m[0].slice(0, 60)}`)
    }
    for (const m of markup.matchAll(/<([a-z][a-z0-9-]*)\b/gi)) {
      const tag = m[1].toLowerCase()
      if (ALLOWED_TAGS.has(tag)) continue
      if (PENDING_WHITELIST.has(tag)) { pending.set(tag, (pending.get(tag) || new Set()).add(where)); continue }
      errors.push(`skeleton [${where}] tag-not-allowed: <${tag}> 不在白名单，骨架必须可直接粘进原型`)
    }
  }
  return { count: templates.length, errors, pending }
}

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
// 骨架：只在默认扫描（未指定文件）时校验，避免 lint-staged 单文件模式下重复跑
const skel = targets.length ? null : checkSkeletons()
if (skel) {
  if (skel.errors.length) {
    failed++
    console.error('✖ packages/design-system/showcase.data.js（布局配置骨架）')
    for (const e of skel.errors) console.error(`   ${e}`)
  } else {
    console.log(`✔ 布局配置骨架 ${skel.count} 套（可直接粘进原型）`)
  }
  for (const [tag, where] of skel.pending) {
    console.warn(`  ! <${tag}> 尚未进白名单（台账阻塞项），影响骨架：${[...where].join('、')}`)
  }
}

if (failed) {
  console.error(`\n${failed} 处不合规`)
  process.exit(1)
}
console.log(`\n${files.length} 个原型全部通过`)
