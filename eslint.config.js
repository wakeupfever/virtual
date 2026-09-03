// eslint.config.js · 三层约束的机械执行（R-024 / R-025）
// 覆盖：apps/web/src/**（第三层）与 packages/design-system/ui/**（第二层）。
// 原型 HTML 由 scripts/check-prototype.js 检查；第二层样式值由 packages/design-system/scripts/check-layer2.mjs 检查。
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import boundaries from 'eslint-plugin-boundaries'
import globals from 'globals'

const whitelist = JSON.parse(readFileSync(fileURLToPath(new URL('./packages/design-system/whitelist.json', import.meta.url)), 'utf8'))
const pascal = s => s.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase())
/** 第三层可用的组件名：白名单 Element Plus（PascalCase）+ 自研 + 路由组件 */
const allowedComponents = [
  ...whitelist.elementPlus.map(pascal),
  ...whitelist.custom.map(pascal),
  'RouterView', 'RouterLink', 'Transition', 'KeepAlive', 'Teleport', 'Suspense', 'component', 'slot',
]

/** Tailwind 布局 / 间距 / 尺寸 / 任意值类：第三层禁止（布局只用第一层 .l-*） */
const restrictedClasses = [
  '/^(flex|inline-flex|grid|inline-grid|block|inline-block|hidden|contents)$/',
  '/^(flex|grid|justify|items|content|self|place|gap|space|col|row|order|basis|grow|shrink)-/',
  '/^-?(p|px|py|pt|pr|pb|pl|ps|pe|m|mx|my|mt|mr|mb|ml|ms|me)-/',
  '/^(w|h|min-w|min-h|max-w|max-h|size)-/',
  '/^(absolute|relative|fixed|sticky|static|top|right|bottom|left|inset|z)-?/',
  '/\\[.+\\]/',
  '/^(sm|md|lg|xl|2xl):/',
]

export default tseslint.config(
  { ignores: ['**/dist/**', '**/node_modules/**', 'apps/prototypes/**', 'packages/design-system/showcase*', '**/*.d.ts'] },

  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: tseslint.parser, extraFileExtensions: ['.vue'] } },
  },
  {
    files: ['**/*.{ts,vue}'],
    languageOptions: { globals: { ...globals.browser } },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-self-closing': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },

  /* ---------- 第三层：apps/web/src/features/** ---------- */
  {
    files: ['apps/web/src/features/**/*.vue'],
    rules: {
      // 禁止裸写原生表单 / 表格元素（CLAUDE.md §2）
      'vue/no-restricted-html-elements': ['error',
        ...['button', 'input', 'select', 'textarea', 'table', 'form', 'dialog', 'thead', 'tbody', 'tr', 'td', 'th'].map(element => ({ element, message: `禁止裸写 <${element}>，用白名单组件（packages/design-system/whitelist.json）` })),
      ],
      // 禁止 inline style（数据驱动尺寸的 :style 例外由 no-restricted-v-bind 之外的人工评审把关）
      'vue/no-static-inline-styles': ['error', { allowBinding: true }],
      // 只允许白名单组件
      'vue/restricted-component-names': ['error', { allow: allowedComponents.map(n => `/^${n}$/`) }],
      // 禁止 Tailwind 布局 / 间距 / 尺寸 / 任意值类
      'vue/no-restricted-class': ['error', ...restrictedClasses],
      // 禁止 <style>：第三层永不写样式
      'vue/no-restricted-block': ['error', { element: 'style', message: '第三层不写样式：缺词只能加在第一、二层（CLAUDE.md §2.1）' }],
    },
  },

  /* ---------- 依赖方向：features → ui → tokens 单向（R-025） ---------- */
  {
    files: ['apps/web/src/**/*.{ts,vue}', 'packages/design-system/ui/**/*.{ts,vue}'],
    plugins: { boundaries },
    settings: {
      'boundaries/elements': [
        { type: 'feature', pattern: 'apps/web/src/features/*', capture: ['name'] },
        { type: 'app', pattern: 'apps/web/src' },
        { type: 'ui', pattern: 'packages/design-system/ui' },
      ],
      'import/resolver': { node: { extensions: ['.js', '.mjs', '.ts', '.vue'] } },
      'boundaries/ignore': ['**/*.d.ts'],
      'boundaries/dependency-nodes': ['import', 'dynamic-import'],
    },
    rules: {
      'boundaries/no-unknown-files': 'off',
      'boundaries/dependencies': ['error', {
        default: 'disallow',
        checkAllOrigins: true,
        checkUnknownLocals: true,
        policies: [
          // 功能模块只能引用自身与允许的外部包；跨模块共享请下沉到第二层。@/ 别名只给应用层用，feature 内一律相对路径
          { from: { element: { type: 'feature' } }, allow: [
            { to: { element: { type: 'feature', captured: { name: '{{from.captured.name}}' } } } },
            { to: { module: { origin: 'external', source: ['vue', 'vue-router', 'element-plus', '@element-plus/icons-vue', '@virtual/design-system', '@virtual/design-system/*'] } } },
          ] },
          { from: { element: { type: 'app' } }, allow: [
            { to: { element: { types: { anyOf: ['feature', 'app'] } } } },
            { to: { module: { origin: 'external', source: ['vue', 'vue-router', 'element-plus', 'element-plus/*', '@element-plus/icons-vue', '@virtual/design-system', '@virtual/design-system/*', '@/*'] } } },
          ] },
          // 第二层只能引用第二层自身与 vue / element-plus，永远不能反向引用第三层
          { from: { element: { type: 'ui' } }, allow: [
            { to: { element: { type: 'ui' } } },
            { to: { module: { origin: 'external', source: ['vue', 'element-plus', '@element-plus/icons-vue'] } } },
          ] },
        ],
      }],
    },
  },
)
