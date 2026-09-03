#!/usr/bin/env node
/**
 * tests/visual/mutate.mjs · 第二层变异验证（R-049）
 *
 * 对展示页「自研组件」里的每个组件，按 dist/token-coverage.json 声明的 token 逐个改成一个显著值，
 * 断言组件内至少一个元素的 computed style 发生变化。没有变化 = 声明了但没消费，或被别处硬编码盖住。
 * 变异前先用 PREP 把舞台切到 error / hover 等状态；仍观察不到但已核实的例外列在 KNOWN 里（必须写原因）。
 *
 * 用法：node tests/visual/mutate.mjs   （环境变量 SHOWCASE_URL 可指定已启动的服务）
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { ROOT, startVite, launch } from './_lib.mjs'

const coverage = JSON.parse(readFileSync(resolve(ROOT, 'packages/design-system/dist/token-coverage.json'), 'utf8'))

/** 变异前把舞台切到能暴露更多 token 的状态（error 态、hover…） */
const PREP = {
  UiState: async (page, card) => { await card.locator('.el-radio-button', { hasText: 'error' }).click(); await page.waitForTimeout(200) },
  UiStatCard: async (page, card) => { await card.locator('.ui-stat-card').first().hover(); await page.waitForTimeout(200) },
}

/** 已核实的例外：静态舞台上无法观察到，但源码确实按该 token 工作。每条必须写原因 */
const KNOWN = {
  UiShell: {
    '--layout-header-h': '展示页 demo 外层用 inline --layout-header-h: 44px 缩小舞台，根上的变异被它挡住；原型 / 正式页面无此覆盖',
    '--layout-sidebar-w-collapsed': '只在 collapsed 状态生效',
  },
  UiFilterBar: { '--space-module-title': '来自 .l-toolbar 的下边距，组件有意置 0（筛选条由外层 .l-stack 控制间距）' },
  UiListItem: {
    '--space-inline-gap': '来自 .l-inline，组件把主体 gap 改为 --space-component-gap',
    '--space-module-gap': '来自 .l-stack 基类，组件用 .l-stack--tight 覆盖为 --space-component-title',
  },
  UiStatCard: { '--color-success': '仅 up-is-good 且上升（is-good）时使用，demo 未含该组合' },
}

/** 变异值：按 token 前缀给一个肯定看得出来的值 */
function mutant(token) {
  if (/^--color-/.test(token)) return '#ff00ff'
  if (/^--shadow-/.test(token)) return '0 0 0 9px #ff00ff'
  if (/^--font-family/.test(token)) return 'monospace'
  if (/^--font-weight/.test(token)) return '100'
  if (/^--font-size/.test(token)) return '31px'
  if (/^--line-height/.test(token)) return '2.7'
  if (/^--radius-/.test(token)) return '17px'
  if (/^--border-w/.test(token)) return '5px'
  if (/^--z-/.test(token)) return '999'
  if (/^--(space|layout|grid)-/.test(token)) return '37px'
  return '37px'
}

const PROPS = ['color', 'backgroundColor', 'borderTopColor', 'borderBottomColor', 'borderLeftColor', 'borderTopWidth', 'borderBottomWidth', 'borderRadius', 'boxShadow', 'paddingTop', 'paddingLeft', 'marginTop', 'marginBottom', 'gap', 'rowGap', 'columnGap', 'width', 'height', 'minWidth', 'minHeight', 'fontSize', 'fontWeight', 'fontFamily', 'lineHeight', 'zIndex']

const servers = []
const base = process.env.SHOWCASE_URL || (servers.push(await startVite({ cwd: ROOT, port: 5199, readyPath: '/packages/design-system/showcase.html' })), servers.at(-1).url)
const b = await launch({ width: 1680, height: 1100 })
const rows = []
try {
  const page = await b.newPage()
  await page.goto(`${base}/packages/design-system/showcase.html#/custom`, { waitUntil: 'networkidle' })
  await page.waitForSelector('.ds-cfg')
  await page.waitForTimeout(800)

  for (const [comp, tokens] of Object.entries(coverage.components)) {
    const card = page.locator('.ds-cfg').filter({ has: page.locator('.ds-cfg__head, .ds-comp__head', { hasText: comp }) }).first()
    if (!(await card.count())) { rows.push({ comp, token: '*', result: 'nocard' }); continue }
    const stage = card.locator('.ds-cfg__stage').first()
    const snapshot = () => stage.evaluate((el, props) => {
      const out = []
      for (const n of el.querySelectorAll('*')) { const cs = getComputedStyle(n); out.push(props.map(p => cs[p]).join('|')) }
      return out
    }, PROPS)
    if (PREP[comp]) await PREP[comp](page, card)
    const before = await snapshot()
    for (const token of tokens) {
      if (KNOWN[comp]?.[token]) { rows.push({ comp, token, result: 'known' }); continue }
      await page.evaluate(([t, v]) => document.documentElement.style.setProperty(t, v), [token, mutant(token)])
      await page.waitForTimeout(30)
      const after = await snapshot()
      await page.evaluate(t => document.documentElement.style.removeProperty(t), token)
      const changed = before.length !== after.length || before.some((s, i) => s !== after[i])
      rows.push({ comp, token, result: changed ? 'ok' : 'unconsumed' })
    }
  }
} finally {
  await b.close()
  servers.forEach(s => s.stop())
}

const by = r => rows.filter(x => x.result === r)
for (const comp of Object.keys(coverage.components)) {
  const mine = rows.filter(r => r.comp === comp)
  const bad = mine.filter(r => r.result === 'unconsumed').map(r => r.token)
  const known = mine.filter(r => r.result === 'known').map(r => r.token)
  console.log(`${bad.length ? '✖' : '✔'} ${comp.padEnd(16)} 通过 ${mine.filter(r => r.result === 'ok').length}${known.length ? ' · 已核实例外 ' + known.length : ''}${bad.length ? ' · 未消费 ' + bad.join(', ') : ''}`)
}
if (by('nocard').length) console.log('展示页缺少配置卡：', by('nocard').map(r => r.comp).join(', '))
if (b.errors.length) console.log('页面错误：', b.errors)
const failed = by('unconsumed').length + by('nocard').length
if (failed) console.log(`\n${failed} 项声明未消费：要么组件没用这个 token（从源码删掉引用），要么被 Element Plus 内部变量或更高优先级样式盖住（改皮肤）；确属状态相关或有意覆盖的，加进 KNOWN 并写明原因。`)
process.exit(failed || b.errors.length ? 1 : 0)
