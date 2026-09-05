# virtual · 前端开发规范（AI 必读）

目标：**提示词 → 可交互原型（单文件 HTML）→ 正式页面（Vue 3）**。原型与正式页面共用第一、二层，转换在组件级一比一。
需求真值见 `doc/frontend-layered-design.md.rai.md`（RAI 台账）；设计说明见 `doc/frontend-layered-design.md`。改需求走 `/rai:rai`，不要静默改文档。

## 1. 分层

| 层 | 位置 | 内容 | 谁能改 |
|---|---|---|---|
| 第一层 | `packages/design-system/{tokens,layout,base}.css` | 只有值与纯 CSS：颜色 / 间距 / 布局尺寸 / 字体 / 圆角 / 阴影 token，`.l-*` 布局类，reset | **冻结**。改 token 值可以（改一处两端生效），改语义名、加类需先提议 |
| 第二层 | `packages/design-system/ui/`（外壳）、`ui/composites/`（复合组件）、`skins/`（皮肤）、`whitelist.json`、`README.md` | Element Plus 白名单 + 自研组件（`UiShell` `UiPageHeader` `UiState` `UiListItem` `UiFilterBar` `UiStatCard`）+ 样式级皮肤 | **冻结**。缺什么走 §2.1 三级偏差流程，单独提交并更新 README / whitelist / showcase.data.js |
| 第三层 | `apps/prototypes/*.html`、`apps/web/src/features/` | 原型与正式功能，AI 主要工作区 | 自由开发，只能引用第一、二层 |

依赖方向单向：第三层 → 第二层 → 第一层。反向禁止。

## 2. 硬性规则（三层通用）

- 禁止裸写 `<button> <input> <select> <textarea> <table> <form> <dialog>`，用白名单组件（`packages/design-system/whitelist.json`）
- 禁止 inline style、`<style>`（原型内）、裸色值（`#xxx` / `rgb()`）、裸像素值；只用 `--color-*` `--space-*` `--layout-*` `--font-*` `--radius-*` `--shadow-*` 语义 token。唯一例外：`:style` 绑定**数据驱动的尺寸**（柱高、进度宽等百分比），且只能配合 `.l-bars` / `.l-bar` 这类第一层容器使用
- 禁止引用原始刻度 `--space-N` `--palette-*`；禁止改 `--el-*` 变量；换肤只能在 `<html>` 上切 `data-theme` / `data-density` / `data-palette`，不在第三层覆盖 `--color-*`
- 禁止手写 `display: flex / grid` 和 Tailwind 布局 / 任意值类（`flex` `grid` `w-[..]` `p-4` …），只用 `.l-*` 布局类
- 白名单外的 Element Plus 组件不能用；需要时先提议
- **滚动只用 `<el-scrollbar>`**：任何会滚动的区域（列表容器、侧栏、抽屉内容、横向条）都包在 `el-scrollbar` 里，禁止 `overflow: auto/scroll`；外壳主区与侧栏由 `UiShell` 内部的 `ElScrollbar` 负责，页面本身（window）不滚动。表格、虚拟列表、下拉等 Element Plus 自带滚动的组件除外
- 组件内部间距不在第三层设置；第三层可用的间距只有 `--space-page-*`、`--space-module-*`、`--space-component-gap`
- **表格页用高度填充写法**：`<div class="l-page l-page--fill">` + 承载表格的模块加 `.l-fill` + `<el-table class="l-fill">`，表格由父级剩余高度决定高度、表体内滚、分页贴底；**不要给 `el-table` 传 `height` / `max-height`**。统计、表单等自然流页面不加 `--fill`
- 高级搜索放 `UiFilterBar` 的 `#advanced` 插槽（组件内部弹浮窗），不要在筛选条下方用 `v-if` 写展开区——那会改变高度、把表格推下去
- 表格行高 / 表头高由第一层 `--layout-row-h` `--layout-thead-h` 经 `skins/table.css` 生效，第三层不设 `row-style` / `header-row-style`；页面级线性页签用 `<el-tabs class="is-tabbar">`（`skins/tabs.css`），筛选条用 `UiFilterBar` 的「label + 控件」写法
- 同一 UI 模式在 features 内出现第二次 → 下沉为该模块 `components/` 下的业务组件，不复制

### 2.1 原型 UI 不满足物料时（三级偏差，R-040）

四句话，按顺序执行：

1. **优先复合组件**：先查 README 的 `ui/` 与 `ui/composites/`，命中直接用。
2. **没有就拼**：能用白名单原语 + `.l-*` 拼出来的结构，就地拼装，外层打 `data-composite="<候选名>"`（kebab-case，如 `list-item`）。拼装过程不写任何样式。
3. **拼不出就占位**：需要写样式才能成立（叠放、连接线、横向滚动列…）或 Element Plus 没有该交互的，用最接近的白名单组件占位，打 `data-placeholder="<需求名>"`，并复制 `packages/design-system/requests/_template.md` 写需求单，标明级别：样式级 → `skins/`，结构级 → `ui/composites/`，行为级 → 封装外部库进 `ui/`。
4. **第三层永不写样式**：任何情况下不加 `<style>`、inline style、`--el-*` 覆盖或 flex/grid；缺词只能加在第一、二层。

`check-prototype.js` 会统计候选结构（≥2 次提示下沉）与占位；promote 前跑 `--strict`，有占位即失败。

## 3. 原型（`apps/prototypes/`）

- **先选页面模板**：01 统计 / 02 纯表格 / 03 统计 + 表格 / 04 左树 + 表格 / 05 TabBar + 表格（展示页「布局配置」可预览并复制骨架；定义在 `packages/design-system/showcase.data.js` 的 `TEMPLATES`），把骨架放进 `.l-page` 再填业务内容；组合不了的再走 §2.1
- 从 `_template.html` 复制起步，**保留四个区块**及其注释：① `DATA`（mock 数据）② `state`（`Vue.reactive`）③ `<div id="app">` 模板 ④ `methods`（`setup()` 内）
- 一个功能一个 HTML，单文件可直接打开；依赖只有 CDN Vue / Element Plus（版本与 `packages/design-system/package.json` 一致）和 `../../packages/design-system/` 下的文件
- 模板必须套 `<ui-shell>`，内容区用 `.l-page` 包裹
- 路由：hash 路由 `#/<key>`，`<key>` 即 `UiShell` 菜单 key；`onSelect` 只改 `location.hash`，`state.route` 由 `hashchange` 同步（模板已内置）。转正式页面时 `#/<key>` → vue-router `/<key>`
- **需求文档里有菜单或路由，原型就必须有可切换的路由**：菜单每一项都要有对应页面，点击后内容真的变化。本轮未实现的菜单项渲染明确占位（`<ui-state state="empty">` 写清「原型尚未覆盖」+ 对应需求章节），**不允许点了没反应或停在同一个页面**——菜单是信息架构的一部分，只做一个页面等于没有验证架构
- in-DOM 模板：自定义标签**必须显式闭合**（`<el-table-column ...></el-table-column>`），props 用 kebab-case（`:active-key`）
- `DATA` 必须含：常规样本、长文本样本、大数据量样本；`state.view` 必须能切换 `ready | loading | empty | error`，通过 `<ui-state>` 呈现
- 交互只读 `DATA`、改 `state`；禁止操作 DOM 样式
- 完成后运行 `node scripts/check-prototype.js`，通过后再汇报；转正式页面前运行 `--strict`

## 4. 正式功能（`apps/web/src/features/<模块>/`）

- 结构：`Page.vue`、`components/`、`api.ts`、`composables/`；外壳与路由在应用层（`src/App.vue`、`src/router/index.ts`），feature 只渲染 `.l-page`
- 新增功能 = `router/index.ts` 的 `MENU` 加一项 `{ key, label }` + 建 `features/<key>/Page.vue`，路由自动对上；feature 之间禁止互相 import，`@/` 别名只给应用层用，feature 内一律相对路径；跨模块共享只能下沉到第二层
- 入口引入顺序固定（`src/main.ts` 已写好）：`element-plus/dist/index.css` → `tokens.css` → `skins/index.css` → `layout.css` → `base.css` → `tailwind.css` → `app.use(ElementPlus).use(DesignSystemUI).use(router)`
- Tailwind 4 仅用于非布局的原子类（`text-primary` `rounded-md` 之类），`@theme` 里全是 token 别名；布局 / 间距 / 尺寸 / 任意值类被 ESLint 拦截；preflight 未引入，reset 只来自 `base.css`
- 模板写 `<ElButton>` / `<UiShell>` PascalCase，`ElMessage` 等命令式 API 从 `element-plus` import
- 完成后运行 `pnpm lint && pnpm typecheck`（根目录），通过后再汇报；ESLint 会拦截原生表单表格、inline style、`<style>`、Tailwind 布局类、非白名单组件、跨层 / 跨模块 import

## 5. 开发流程

1. 开发第三层任何内容前，先读 `packages/design-system/README.md`
2. 原型：需求 → 复制模板 → 填 DATA/state/模板/方法 → `check-prototype.js` → 交付
3. 原型 → 正式：`DATA` → `api.ts`（接口定义 + mock），`state` → `composables/useXxx.ts`，hash 路由 → vue-router 路由表，模板逐一映射为 `Page.vue`（`<el-*>` → `<El*>`，`<ui-*>` → `<Ui*>`），输出"原型与实现差异清单"（`features/<名>/DIFF.md`），再把用例加进 `tests/visual/compare.mjs` 跑 `pnpm test:visual`，差异 ≤ 1% 才算转换完成
4. 第二层改动（含需求单落地）：单独一次对话、单独一次提交，先改 `ui/` / `ui/composites/` / `skins/` / `whitelist.json`，再 `pnpm build:ds`（末尾自动跑 `check-layer2`：第二层样式值必须来自 token，有裸值即失败；消费的 token 由脚本扫描生成，不手填），再更新 README 与 `showcase.data.js`（自研组件登记在 `CUSTOM`），最后回填原型中的占位
5. 改第一层 token 值后无需改组件；改语义名视为第二层级别的变更

## 6. 命令

```bash
pnpm install
pnpm dev                 # 本地预览：自动打开 design-system 展示页（#/tokens 设计变量 · #/materials 组件物料 · #/custom 自研组件 · #/layout 布局范式 · #/templates 布局配置）
pnpm dev:prototype       # 本地预览：打开原型模板；其他原型改 URL 路径即可
pnpm dev:web             # 正式项目 dev server（http://localhost:5174）
pnpm build:web           # 正式项目 typecheck + build
pnpm lint                # 根目录 ESLint：apps/web/src 与 packages/design-system/ui（三层约束）
pnpm typecheck           # 所有包 vue-tsc
pnpm build:ds            # 抽取 token + 打包第二层 → dist/tokens.js · ui.iife.js · ui.css（原型与展示页引用，需提交）
pnpm check:prototype     # 原型合规检查
pnpm check:ledger        # 需求台账一致性（编号 / 状态 / 勾选 / 功能覆盖 / 历史索引）
pnpm check:layer2        # 第二层 token 约束 + 覆盖度报告（build:ds 已包含）
pnpm test:visual         # 原型 vs 正式页面 视觉回归（自动起两个 dev server；本机已有 Chromium 可设 PW_CHROMIUM=<路径> 免下载，否则先 pnpm exec playwright install chromium）
pnpm test:mutation       # 第二层变异验证：逐个 token 改值断言组件真的变了
```

展示页与原型都是静态单文件，也可以直接双击打开（需能访问 jsdelivr CDN）；`pnpm dev` 只是起一个静态服务器方便预览与热刷新。

门禁：`git commit` 时 lint-staged 对改动文件跑 ESLint / check-layer2 / check-prototype / check-ledger（`.husky/pre-commit`）；CI（`.github/workflows/ci.yml`）依次 lint → typecheck → build:ds（并校验 `dist/` 已提交）→ check:prototype → check:ledger → build:web → 视觉回归 → 变异验证。新增正式页面时把用例加进 `tests/visual/compare.mjs` 的 `CASES`。
