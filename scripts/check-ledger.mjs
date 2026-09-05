#!/usr/bin/env node
/**
 * scripts/check-ledger.mjs · 需求台账一致性检查（R-055）
 *
 * 台账是纯 Markdown，靠人眼对账扫不出问题——一次审计里七处不一致有四处是脚本发现的。
 * 本脚本只做「能机械判定」的一致性，不判断需求内容对不对：
 *
 *   1. 头部 requirement-version / iteration 与「快速摘要」里的声明一致
 *   2. 头部 current-changes 的每条变更在正文有 `### C-xxx` 条目
 *   3. 头部 iteration 在正文有 `### IT-xxx` 小节
 *   4. 需求勾选框与 status 一致：verified 必须 [x]，其余必须 [ ]
 *   5. status 取值在允许集合内
 *   6. 需求编号、证据编号、变更编号均不重复
 *   7. 每条需求至少被「功能清单」的某个 F 覆盖
 *   8. 每个正文 `### C-xxx` 条目在「历史索引」里有对应行
 *   9. 变更条目必备字段齐全（类型 / 关联需求 / 影响功能）
 *
 * 用法：node scripts/check-ledger.mjs [台账路径...]（缺省扫 doc/*.rai.md 与 .rai/*.md）
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { resolve, relative } from 'node:path'

const ROOT = process.cwd()
const STATUSES = new Set([
  'ready', 'in_progress', 'implemented', 'verified',
  'overridden', 'cancelled', 'planned', 'pending_confirmation',
])

function discover() {
  const out = []
  const doc = resolve(ROOT, 'doc')
  if (existsSync(doc)) out.push(...readdirSync(doc).filter(f => f.endsWith('.rai.md')).map(f => resolve(doc, f)))
  const rai = resolve(ROOT, '.rai')
  if (existsSync(rai)) out.push(...readdirSync(rai).filter(f => f.endsWith('.md')).map(f => resolve(rai, f)))
  return out
}

/** 展开「R-043～R-054」这类区间，功能清单里大量使用 */
function expandRange(text) {
  const set = new Set()
  for (const m of text.matchAll(/R-(\d{3})(?:\s*[～~-]\s*R-(\d{3}))?/g)) {
    const a = Number(m[1])
    const b = m[2] ? Number(m[2]) : a
    for (let i = a; i <= b; i++) set.add('R-' + String(i).padStart(3, '0'))
  }
  return set
}

function checkOne(file) {
  const rel = relative(ROOT, file).replace(/\\/g, '/')
  const t = readFileSync(file, 'utf8')
  const errors = []
  const push = msg => errors.push(`${rel}: ${msg}`)

  const fm = t.split('---')[1] ?? ''
  const rv = (fm.match(/requirement-version:\s*"([^"]+)"/) || [])[1]
  const it = (fm.match(/iteration:\s*"([^"]+)"/) || [])[1]
  const current = [...fm.matchAll(/-\s*"(C-\d+)"/g)].map(m => m[1])

  if (!rv) push('头部缺 requirement-version')
  if (!it) push('头部缺 iteration')

  // 1. 头部与摘要一致
  const sumRv = (t.match(/当前需求版本：`([^`]+)`/) || [])[1]
  const sumIt = (t.match(/当前工作迭代：`([^`]+)`/) || [])[1]
  if (rv && sumRv && rv !== sumRv) push(`头部 requirement-version ${rv} 与摘要 ${sumRv} 不一致`)
  if (it && sumIt && it !== sumIt) push(`头部 iteration ${it} 与摘要 ${sumIt} 不一致`)

  // 2 / 3. 当前变更与迭代在正文有条目
  const changeHeads = [...t.matchAll(/^### (C-\d+) /gm)].map(m => m[1])
  for (const c of current) if (!changeHeads.includes(c)) push(`current-changes 的 ${c} 在正文没有 \`### ${c}\` 条目`)
  if (it && !new RegExp(`^### ${it} `, 'm').test(t)) push(`iteration ${it} 在正文没有对应小节`)

  // 4 / 5 / 6. 需求勾选框、状态取值、编号唯一
  const reqs = [...t.matchAll(/^- \[([ x])\] `(R-\d{3})`[^\n]*?`status: ([a-z_]+)`/gm)]
  const seen = new Set()
  for (const [, box, id, status] of reqs) {
    if (seen.has(id)) push(`需求 ${id} 重复出现`)
    seen.add(id)
    if (!STATUSES.has(status)) push(`${id} 的 status "${status}" 不在允许集合内`)
    const shouldTick = status === 'verified'
    if (shouldTick && box !== 'x') push(`${id} 是 verified 但勾选框未打勾`)
    if (!shouldTick && box === 'x') push(`${id} 状态为 ${status} 却已勾选`)
  }
  if (!reqs.length) push('没有解析到任何需求条目，格式可能已偏离规范')

  const dupe = (list, label) => {
    const c = {}
    for (const x of list) c[x] = (c[x] || 0) + 1
    for (const [k, n] of Object.entries(c)) if (n > 1) push(`${label} ${k} 重复 ${n} 次`)
  }
  dupe([...t.matchAll(/^\| (E-\d+) \|/gm)].map(m => m[1]), '证据编号')
  dupe(changeHeads, '变更条目')

  // 7. 每条需求至少挂到一个功能
  const invBlock = t.split('## 功能清单')[1]?.split('\n## ')[0] ?? ''
  if (!invBlock) push('缺少「功能清单」小节')
  else {
    const covered = expandRange(invBlock)
    const missing = [...seen].filter(id => !covered.has(id))
    if (missing.length) push(`以下需求未挂到任何功能：${missing.join(' ')}`)
  }

  // 8. 变更条目都进历史索引
  const histBlock = t.split('## 历史索引')[1]?.split('\n## ')[0] ?? ''
  if (!histBlock) push('缺少「历史索引」小节')
  else {
    const inHist = new Set([...histBlock.matchAll(/\| (C-\d+) \|/g)].map(m => m[1]))
    const missing = changeHeads.filter(c => !inHist.has(c))
    if (missing.length) push(`以下变更有正文条目但不在历史索引：${missing.join(' ')}`)
  }

  // 9. 变更条目必备字段
  const sections = t.split(/^### (?=C-\d+ )/m).slice(1)
  for (const sec of sections) {
    const id = sec.match(/^(C-\d+)/)[1]
    for (const field of ['类型', '关联需求', '影响功能']) {
      if (!new RegExp(`^- ${field}：`, 'm').test(sec.split(/^### /m)[0])) push(`${id} 缺字段「${field}」`)
    }
  }

  return { rel, errors, counts: { reqs: reqs.length, changes: changeHeads.length } }
}

const files = process.argv.slice(2).length
  ? process.argv.slice(2).map(f => resolve(ROOT, f))
  : discover()

if (!files.length) {
  console.log('未找到台账文件（doc/*.rai.md 或 .rai/*.md），跳过')
  process.exit(0)
}

let failed = 0
for (const f of files) {
  const { rel, errors, counts } = checkOne(f)
  if (errors.length) {
    failed += errors.length
    console.log(`✖ ${rel}`)
    for (const e of errors) console.log(`  ${e.slice(rel.length + 2)}`)
  } else {
    console.log(`✔ ${rel} · ${counts.reqs} 条需求 · ${counts.changes} 条变更`)
  }
}
if (failed) console.log(`\n${failed} 处不一致。台账是实施依据，与实现不一致时先修台账再改代码（CLAUDE.md 开头）。`)
process.exit(failed ? 1 : 0)
