#!/usr/bin/env node
/**
 * scripts/build-tokens.mjs · 从 tokens.css 抽取变量 → dist/tokens.js
 * 展示页（showcase.html）在 file:// 下无法读取样式表规则，因此把 token 结构预先抽成
 * `window.DS_TOKENS`。tokens.css 仍是唯一真值；本文件只是它的只读投影。
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const PKG = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const css = readFileSync(resolve(PKG, 'tokens.css'), 'utf8')
const whitelist = JSON.parse(readFileSync(resolve(PKG, 'whitelist.json'), 'utf8'))

/** 分组规则：按变量名前缀归类，顺序即展示顺序 */
const GROUPS = [
  { id: 'color', title: '颜色 · 语义', kind: 'color', layer: 'semantic', test: n => /^--color-/.test(n) },
  { id: 'space', title: '间距 · 作用域 × 关系', kind: 'length', layer: 'semantic', test: n => /^--space-(page|module|component|inline)-/.test(n) },
  { id: 'layout', title: '布局尺寸', kind: 'length', layer: 'semantic', test: n => /^--(layout|grid|breakpoint)-/.test(n) },
  { id: 'z', title: '层级', kind: 'number', layer: 'semantic', test: n => /^--z-/.test(n) },
  { id: 'font', title: '字体', kind: 'font', layer: 'semantic', test: n => /^--(font|line-height)-/.test(n) },
  { id: 'radius', title: '圆角', kind: 'radius', layer: 'semantic', test: n => /^--radius-/.test(n) },
  { id: 'shadow', title: '阴影', kind: 'shadow', layer: 'semantic', test: n => /^--shadow-/.test(n) },
  { id: 'border', title: '边框', kind: 'length', layer: 'semantic', test: n => /^--border-/.test(n) },
  { id: 'density', title: '密度系数', kind: 'number', layer: 'semantic', test: n => n === '--density' },
  { id: 'raw-space', title: '原始刻度 · 间距（禁止直接引用）', kind: 'length', layer: 'raw', test: n => /^--space-\d+$/.test(n) },
  { id: 'raw-palette', title: '原始刻度 · 色板（禁止直接引用）', kind: 'color', layer: 'raw', test: n => /^--palette-/.test(n) },
  { id: 'el', title: 'Element Plus 变量映射（由第一层驱动，禁止在第三层修改）', kind: 'mapping', layer: 'mapping', test: n => /^--el-/.test(n) },
]

/** 解析 `selector { --name: value; (可选行尾注释) }` 块 */
function parseBlocks(src) {
  const blocks = []
  const re = /([^{}]+)\{([^{}]*)\}/g
  let m
  while ((m = re.exec(src))) {
    const selector = m[1].replace(/\/\*[\s\S]*?\*\//g, '').trim().split('\n').pop().trim()
    const body = m[2]
    const decls = []
    const dre = /(--[\w-]+)\s*:\s*([^;]+);[ \t]*(?:\/\*[ \t]*([^*\n]*?)[ \t]*\*\/)?/g
    let d
    while ((d = dre.exec(body))) decls.push({ name: d[1], value: d[2].trim(), comment: d[3] ? d[3].trim() : '' })
    if (decls.length) blocks.push({ selector, decls })
  }
  return blocks
}

const blocks = parseBlocks(css)
const base = new Map()      // :root / html:root 默认值
const overrides = {}        // 选择器 → { name: value }
for (const b of blocks) {
  if (b.selector === ':root' || b.selector === 'html:root') {
    for (const d of b.decls) base.set(d.name, d)
  } else {
    overrides[b.selector] = overrides[b.selector] || {}
    for (const d of b.decls) overrides[b.selector][d.name] = d.value
  }
}

const groups = GROUPS.map(g => ({ id: g.id, title: g.title, kind: g.kind, layer: g.layer, tokens: [] }))
const unassigned = []
for (const d of base.values()) {
  const g = GROUPS.findIndex(x => x.test(d.name))
  const entry = { name: d.name, value: d.value, comment: d.comment, dark: overrides['[data-theme="dark"]']?.[d.name] ?? null }
  if (g === -1) unassigned.push(entry)
  else groups[g].tokens.push(entry)
}

const out = {
  generatedAt: new Date().toISOString(),
  source: 'tokens.css',
  groups: groups.filter(g => g.tokens.length),
  whitelist,
  unassigned,
  overrides,
  counts: {
    semantic: groups.filter(g => g.layer === 'semantic').reduce((n, g) => n + g.tokens.length, 0),
    raw: groups.filter(g => g.layer === 'raw').reduce((n, g) => n + g.tokens.length, 0),
    mapping: groups.filter(g => g.layer === 'mapping').reduce((n, g) => n + g.tokens.length, 0),
  },
}

mkdirSync(resolve(PKG, 'dist'), { recursive: true })
writeFileSync(resolve(PKG, 'dist/tokens.js'), `/* 由 scripts/build-tokens.mjs 自动生成，勿手改；真值在 tokens.css */\nwindow.DS_TOKENS = ${JSON.stringify(out, null, 2)};\n`)
writeFileSync(resolve(PKG, 'dist/tokens.json'), JSON.stringify(out, null, 2) + '\n')
console.log(`tokens: semantic ${out.counts.semantic} · raw ${out.counts.raw} · el-mapping ${out.counts.mapping}${unassigned.length ? ` · 未归组 ${unassigned.map(u => u.name).join(', ')}` : ''}`)
