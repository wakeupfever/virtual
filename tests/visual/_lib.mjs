/**
 * tests/visual/_lib.mjs · 视觉回归与变异验证共用：起 dev server、拦截 CDN、截图工具
 */
import { spawn } from 'node:child_process'
import { readFileSync, globSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
export const OUT = resolve(ROOT, 'tests/visual/__output__')
mkdirSync(OUT, { recursive: true })

/** 原型 / 展示页依赖 jsdelivr CDN；测试时一律用本地 node_modules 顶替，离线可跑且版本与 package.json 一致 */
const NM = resolve(ROOT, 'node_modules/.pnpm')
const find = p => globSync(`${NM}/${p.replace('/', '+')}@*/node_modules/${p}`)[0]
const CDN_DIRS = { vue: find('vue'), 'element-plus': find('element-plus'), '@element-plus/icons-vue': find('@element-plus/icons-vue') }

export async function routeCdn(page) {
  await page.route('https://cdn.jsdelivr.net/**', r => {
    const m = r.request().url().match(/npm\/(@element-plus\/icons-vue|vue|element-plus)@[^/]+\/(.+)$/)
    if (!m || !CDN_DIRS[m[1]]) return r.abort()
    r.fulfill({ body: readFileSync(`${CDN_DIRS[m[1]]}/${m[2]}`), contentType: m[2].endsWith('.css') ? 'text/css' : 'application/javascript' })
  })
}

async function waitHttp(url, ms = 30000) {
  const t0 = Date.now()
  while (Date.now() - t0 < ms) {
    try { const r = await fetch(url); if (r.ok) return } catch { /* retry */ }
    await new Promise(r => setTimeout(r, 300))
  }
  throw new Error(`server not ready: ${url}`)
}

/** 起一个 vite dev server，返回 { url, stop } */
export async function startVite({ cwd, port, readyPath = '/' }) {
  const child = spawn('pnpm', ['exec', 'vite', '--port', String(port), '--strictPort', '--host', '127.0.0.1'], { cwd, stdio: 'ignore' })
  const url = `http://127.0.0.1:${port}`
  await waitHttp(url + readyPath)
  return { url, stop: () => child.kill() }
}

export async function launch(viewport = { width: 1440, height: 900 }) {
  // 本地已有 Chromium 时可用 PW_CHROMIUM 指定可执行文件，免下载（CI 走 playwright install）
  const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {})
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 })
  const errors = []
  const newPage = async () => {
    const page = await context.newPage()
    page.on('pageerror', e => errors.push(e.message.slice(0, 200)))
    await routeCdn(page)
    return page
  }
  return { browser, newPage, errors, close: () => browser.close() }
}
