# virtual · 前端开发规范（AI 必读）

目标：**提示词 → 可交互原型（单文件 HTML）→ 正式页面（Vue 3）**。原型与正式页面共用第一、二层，转换在组件级一比一。
需求真值见 `doc/frontend-layered-design.md.rai.md`（RAI 台账）；设计说明见 `doc/frontend-layered-design.md`。改需求走 `/rai:rai`，不要静默改文档。

## 1. 分层

| 层 | 位置 | 内容 | 谁能改 |
|---|---|---|---|
| 第一层 | `packages/design-system/{tokens,layout,base}.css` | 只有值与纯 CSS：颜色 / 间距 / 布局尺寸 / 字体 / 圆角 / 阴影 token，`.l-*` 布局类，reset | **冻结**。改 token 值可以（改一处两端生效），改语义名、加类需先提议 |
| 第二层 | `packages/design-system/ui/`、`whitelist.json`、`README.md` | Element Plus 白名单 + 自研复合组件（`UiShell` `UiPageHeader` `UiState`） | **冻结**。缺组件先停下来提议：判定"通用能力"进本层，"业务组件"留第三层；单独提交并更新 README |
| 第三层 | `apps/prototypes/*.html`、`apps/web/src/features/` | 原型与正式功能，AI 主要工作区 | 自由开发，只能引用第一、二层 |

依赖方向单向：第三层 → 第二层 → 第一层。反向禁止。

## 2. 硬性规则（三层通用）

- 禁止裸写 `<button> <input> <select> <textarea> <table> <form> <dialog>`，用白名单组件（`packages/design-system/whitelist.json`）
- 禁止 inline style、`<style>`（原型内）、裸色值（`#xxx` / `rgb()`）、裸像素值；只用 `--color-*` `--space-*` `--layout-*` `--font-*` `--radius-*` `--shadow-*` 语义 token
- 禁止引用原始刻度 `--space-N` `--palette-*`；禁止改 `--el-*` 变量
- 禁止手写 `display: flex / grid` 和 Tailwind 布局 / 任意值类（`flex` `grid` `w-[..]` `p-4` …），只用 `.l-*` 布局类
- 白名单外的 Element Plus 组件不能用；需要时先提议
- 组件内部间距不在第三层设置；第三层可用的间距只有 `--space-page-*`、`--space-module-*`、`--space-component-gap`
- 同一 UI 模式在 features 内出现第二次 → 下沉为该模块 `components/` 下的业务组件，不复制

## 3. 原型（`apps/prototypes/`）

- 从 `_template.html` 复制起步，**保留四个区块**及其注释：① `DATA`（mock 数据）② `state`（`Vue.reactive`）③ `<div id="app">` 模板 ④ `methods`（`setup()` 内）
- 一个功能一个 HTML，单文件可直接打开；依赖只有 CDN Vue / Element Plus（版本与 `packages/design-system/package.json` 一致）和 `../../packages/design-system/` 下的文件
- 模板必须套 `<ui-shell>`，内容区用 `.l-page` 包裹
- 路由：hash 路由 `#/<key>`，`<key>` 即 `UiShell` 菜单 key；`onSelect` 只改 `location.hash`，`state.route` 由 `hashchange` 同步（模板已内置）。转正式页面时 `#/<key>` → vue-router `/<key>`
- in-DOM 模板：自定义标签**必须显式闭合**（`<el-table-column ...></el-table-column>`），props 用 kebab-case（`:active-key`）
- `DATA` 必须含：常规样本、长文本样本、大数据量样本；`state.view` 必须能切换 `ready | loading | empty | error`，通过 `<ui-state>` 呈现
- 交互只读 `DATA`、改 `state`；禁止操作 DOM 样式
- 完成后运行 `node scripts/check-prototype.js`，通过后再汇报

## 4. 正式功能（`apps/web/src/features/<模块>/`）

- 结构：`Page.vue`、`components/`、`api.ts`、`composables/`
- 入口引入顺序固定：`element-plus/dist/index.css` → `tokens.css` → `layout.css` → `base.css` → `app.use(ElementPlus).use(DesignSystemUI)`
- Tailwind 4 仅用于非布局的原子类且只能引用 `@theme` 中来自 token 的值；preflight 已关闭，reset 只来自 `base.css`
- 完成后运行 `pnpm lint && pnpm typecheck`，通过后再汇报

## 5. 开发流程

1. 开发第三层任何内容前，先读 `packages/design-system/README.md`
2. 原型：需求 → 复制模板 → 填 DATA/state/模板/方法 → `check-prototype.js` → 交付
3. 原型 → 正式：`DATA` → `api.ts`（接口定义 + mock），`state` → `composables/useXxx.ts`，hash 路由 → vue-router 路由表，模板逐一映射为 `Page.vue`（`<el-*>` → `<El*>`，`<ui-*>` → `<Ui*>`），输出"原型与实现差异清单"
4. 第二层改动：单独一次对话、单独一次提交，先改 `ui/` 或 `whitelist.json`，再 `pnpm build:ds`，再更新 README 与 `showcase.data.js`（自研组件登记在 `CUSTOM`）
5. 改第一层 token 值后无需改组件；改语义名视为第二层级别的变更

## 6. 命令

```bash
pnpm install
pnpm dev                 # 本地预览：自动打开 design-system 展示页（http://localhost:5173/packages/design-system/showcase.html）
pnpm dev:prototype       # 本地预览：打开原型模板；其他原型改 URL 路径即可
pnpm build:ds            # 抽取 token + 打包第二层 → dist/tokens.js · ui.iife.js · ui.css（原型与展示页引用，需提交）
pnpm check:prototype     # 原型合规检查
```

展示页与原型都是静态单文件，也可以直接双击打开（需能访问 jsdelivr CDN）；`pnpm dev` 只是起一个静态服务器方便预览与热刷新。
