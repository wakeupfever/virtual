#!/usr/bin/env node
/**
 * tests/visual/compare.mjs · 原型 → 正式页面 视觉回归（R-027）
 *
 * 对每个 CASE：原型（apps/prototypes/*.html，hash 路由）与正式页面（apps/web，vue-router）喂同一份 mock、
 * 同一视口，截取 `.l-page` 内容区（外壳由 UiShell 统一，不参与对比）做像素对比。
 * 差异比例超过阈值（默认 1%）即失败，并输出 __output__/<name>-{proto,web,diff}.png 与差异清单。
 *
 * 用法：node tests/visual/compare.mjs [--threshold 0.01] [--update]
 *   环境变量 PROTO_URL / WEB_URL 可指定已启动的服务；否则自动起两个 vite dev server。
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { ROOT, OUT, startVite, launch } from './_lib.mjs'

const args = process.argv.slice(2)
const THRESHOLD = Number(args[args.indexOf('--threshold') + 1]) || 0.01

/** 对比用例：原型路径 ↔ 正式路由；dataset 同时作用于两端（原型经 hash 参数、正式经 query） */
const CASES = [
  { name: 'orders-normal', proto: '/apps/prototypes/_template.html#/orders', web: '/orders', width: 1440 },
  { name: 'orders-long', proto: '/apps/prototypes/_template.html#/orders?dataset=long', web: '/orders?dataset=long', width: 1440 },
  { name: 'orders-narrow', proto: '/apps/prototypes/_template.html#/orders', web: '/orders', width: 1024 },
]

/** 原型在 hash 上带的 dataset：模板里 state.dataset 只能手动切，这里通过注入脚本对齐 */
const PROTO_INIT = `
  const q = new URLSearchParams(location.hash.split('?')[1] || '')
  const ds = q.get('dataset'); if (ds) window.__PROTO_DATASET = ds
`
const PROTO_APPLY = () => {
  // 原型的 state 是模块内变量，通过 Vue devtools 钩子拿不到；退而求其次：模拟顶栏选择器切换
  const ds = window.__PROTO_DATASET
  if (!ds) return
  const app = document.querySelector('#app')?.__vue_app__
  const state = app?._container?._vnode?.component?.setupState?.state
  if (state) state.dataset = ds
}

async function shot(page, url, width, path) {
  await page.setViewportSize({ width, height: 900 })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.evaluate(PROTO_APPLY)
  await page.waitForSelector('.l-page')
  await page.waitForFunction(() => !document.querySelector('.el-loading-mask, .el-skeleton'))
  await page.waitForTimeout(600)
  const box = await page.locator('.l-page').boundingBox()
  await page.screenshot({ path, clip: { x: box.x, y: box.y, width: Math.round(box.width), height: Math.min(Math.round(box.height), 900 - box.y) } })
  return PNG.sync.read(readFileSync(path))
}

const servers = []
const protoBase = process.env.PROTO_URL || (servers.push(await startVite({ cwd: ROOT, port: 5199, readyPath: '/apps/prototypes/_template.html' })), servers.at(-1).url)
const webBase = process.env.WEB_URL || (servers.push(await startVite({ cwd: resolve(ROOT, 'apps/web'), port: 5174 })), servers.at(-1).url)
const b = await launch()
const results = []
try {
  for (const c of CASES) {
    const page = await b.newPage()
    await page.addInitScript(PROTO_INIT)
    const a = await shot(page, protoBase + c.proto, c.width, resolve(OUT, `${c.name}-proto.png`))
    const w = await shot(page, webBase + c.web, c.width, resolve(OUT, `${c.name}-web.png`))
    await page.close()
    const width = Math.min(a.width, w.width), height = Math.min(a.height, w.height)
    const crop = (png) => { const o = new PNG({ width, height }); PNG.bitblt(png, o, 0, 0, width, height, 0, 0); return o }
    const A = crop(a), W = crop(w), diff = new PNG({ width, height })
    const bad = pixelmatch(A.data, W.data, diff.data, width, height, { threshold: 0.1 })
    writeFileSync(resolve(OUT, `${c.name}-diff.png`), PNG.sync.write(diff))
    const ratio = bad / (width * height)
    const sizeNote = a.width !== w.width || a.height !== w.height ? `尺寸不同 原型 ${a.width}×${a.height} / 正式 ${w.width}×${w.height}` : ''
    results.push({ name: c.name, ratio, pass: ratio <= THRESHOLD && !sizeNote, sizeNote })
  }
} finally {
  await b.close()
  servers.forEach(s => s.stop())
}

for (const r of results) console.log(`${r.pass ? '✔' : '✖'} ${r.name.padEnd(16)} 差异 ${(r.ratio * 100).toFixed(2)}%${r.sizeNote ? ' · ' + r.sizeNote : ''}`)
if (b.errors.length) console.log('页面错误：', b.errors)
const failed = results.filter(r => !r.pass)
if (failed.length) {
  console.log(`\n${failed.length} 个用例超过阈值 ${THRESHOLD * 100}%，差异图见 tests/visual/__output__/<name>-diff.png（红色为差异像素）`)
  console.log('差异清单：请对照 features/<模块>/DIFF.md，确认是有意差异（补进 DIFF.md 并调整用例遮罩）还是转换遗漏')
}
process.exit(failed.length || b.errors.length ? 1 : 0)
