# 前端三层分层设计说明

> 本文档描述 `virtual` 项目前端的三层分层模型：每一层包含什么、由谁修改、如何约束 AI 在各层的行为，以及"提示词 → 可交互原型 → 正式页面"的流转方式。
> 对应需求台账见 `doc/frontend-layered-design.md.rai.md`（当前 RV-014）；需求 ID、状态与验收标准以台账为准。
> 技术栈：Vue 3 + Element Plus 2.14 + Vite 8 + Tailwind CSS 4，pnpm monorepo。

## 1. 目标与问题

项目最终目标是让产品与开发都能通过 AI 完成"提示词 → 可交互原型 → 正式页面"的流程。若让 AI 每次从零开发，会出现样式多套、封装重复、间距各写各的等一致性问题；若把一切封成组件只允许调用，前期成本高且组件库成为瓶颈。因此采用分层：**底层固定给 AI 使用，上层由 AI 自由开发**，并让原型与正式项目共用底层，使原型到正式页面的转换在组件级达到一比一。三层策略最终封装为 Claude 插件分发。

## 2. 三层总览

| 层 | 内容 | 本质 | 变更方式 | 原型 / 正式是否共用 |
|---|---|---|---|---|
| 第一层 | 设计 token、布局 token、无行为布局类、全局基础样式 | **只有值和纯 CSS，没有 JS 行为** | token 值可改，改一处两端同时生效；语义名与 `layout.css` 与第二层同级冻结 | 共用同一文件 |
| 第二层 | Element Plus 白名单 + 自研复合组件（外壳、页头、状态容器） | **有行为的组件代码** | 冻结；新增或修改须先提议确认，单独提交 | 共用同一源码：正式项目 npm 引入，原型 CDN 同版本 + IIFE 打包产物 |
| 第三层 | 原型（单文件可交互 HTML）、正式功能页面、展示页面 | **业务产物** | AI 自由开发，仅能引用第一、二层 | 不共用；原型经 promote 流程转为正式页面 |

依赖方向单向：`第三层 → 第二层 → 第一层`，反向禁止。

## 3. 目录结构（monorepo）

```
virtual/
├── apps/
│   ├── prototypes/               # 第三层·原型（无构建，单文件 HTML）
│   │   ├── _template.html
│   │   └── <功能>.html
│   └── web/                      # 第三层·正式项目（Vue 3 + Vite 8 + Tailwind 4 + vue-router）
│       ├── vite.config.ts  tsconfig.json  index.html
│       └── src/
│           ├── main.ts  App.vue  tailwind.css   # 入口：样式顺序 / UiShell 外壳 / @theme 别名
│           ├── router/index.ts              # MENU 即路由表：/<key> ↔ features/<key>/Page.vue
│           └── features/<模块>/  Page.vue · components/ · api.ts · composables/ · DIFF.md
├── packages/
│   ├── design-system/            # 第一、二层
│   │   ├── tokens.css  layout.css  base.css
│   │   ├── ui/  UiShell.vue · UiPageHeader.vue · UiState.vue · index.ts
│   │   │   └── composites/  UiListItem · UiFilterBar · UiStatCard   # 结构级下沉
│   │   ├── skins/  index.css · table · input · menu · tabs · tree   # 样式级皮肤
│   │   ├── requests/  _template.md   # 组件需求单
│   │   ├── whitelist.json        # 第三层可用标签白名单（check 脚本与 ESLint 共用）
│   │   ├── showcase.html         # 展示页：模块一变量 · 模块二物料（零构建，双击打开）
│   │   ├── scripts/build-tokens.mjs   # tokens.css → dist/tokens.js
│   │   ├── dist/ui.iife.js · ui.css · tokens.js   # 打包产物，原型与展示页直接引用，需提交
│   │   ├── vite.lib.config.ts
│   │   └── README.md             # 组件索引，AI 开发前必读
│   └── claude-plugin/            # Claude 插件：prototype / promote / layer-rules 技能
├── scripts/check-prototype.js
├── eslint.config.js              # 三层约束：vue 规则 + boundaries 单向依赖（覆盖 apps/web 与 design-system/ui）
├── doc/
├── CLAUDE.md
├── package.json  pnpm-workspace.yaml
```

## 4. 第一层：token 与布局

### 4.1 两级结构

`tokens.css` 分为**原始刻度**与**语义 token**两级：原始刻度（`--space-1..16`、`--palette-*`）只作为语义层的取值来源，第二、三层禁止直接引用；语义 token 是第二、三层唯一允许引用的层。

### 4.2 颜色

语义颜色按 **作用域 × 语义** 两维组织。作用域：`bg` / `text` / `border` / `icon`；语义：`page` `surface` `subtle` `muted` `overlay` `mask`（bg）、`default` `secondary` `muted` `placeholder` `inverse`（text）等。功能色 `--color-{primary|success|warning|danger|info}` 省略作用域。

默认配色为「科技青」（参考 HY Compiler Studio technology-cyan：主色 `#0076a3`、强调 `#00486a`、柔和底 `#e8f4f7`，中性灰带青灰色相，浅色页面底为纯白），另有 `--color-bg-accent` 作为主色柔和底。深色模式通过 `[data-theme="dark"]` 重映射语义层实现（深色下主色提亮为 `#2f9fcf` 保证对比度），组件代码不感知主题。整套配色变体（Element 蓝 / 靛蓝 / 靛紫）以 `[data-palette="<key>"]` 块放在 tokens.css ⑤ 段：品牌 / 功能色（及圆角）在深浅两种模式都生效，中性色只在浅色生效（深色仍由 ④ 段统一重映射）；展示页的配色预设切换的就是这个属性，不再运行时覆盖 token。

### 4.3 间距

间距按 **作用域 × 关系 [× 轴]** 两维矩阵组织，命名 `--space-{作用域}-{关系}[-{轴}]`：

| | gap（同级之间） | pad（容器内边距） | title（标题到内容） |
|---|---|---|---|
| page | `--space-page-gap` | `--space-page-pad-x` / `-y` | `--space-page-title` |
| module | `--space-module-gap` | `--space-module-pad` | `--space-module-title` |
| component | `--space-component-gap` | `--space-component-pad-x` / `-y` | `--space-component-title` |
| inline | `--space-inline-gap` | `--space-inline-pad` | — |

默认值对齐参考站 park-mgt-web（page 20 / module 16 / content 12 / control 8）：page-gap 24、page-pad 20、module-gap 16、module-pad 16、component-gap 12。共 13 个。防膨胀规则：新场景不新增 token，而是判断"哪个作用域的哪种关系"后落入矩阵；组件内部间距由第二层写死引用 token，第三层不设置，因此第三层实际可用的只有 `page`、`module` 两行与 `--space-component-gap`；两个 token 在所有场景下值相同则合并。

密度系数 `--density` 乘入 page / module / component 三级间距，`[data-density="compact" | "loose"]` 整体切换松紧。

### 4.4 布局尺寸与其他 token

尺寸不是间距，单独以 `--layout-*` 命名（侧边栏宽 230 / 折叠宽 66、顶栏高 60、侧面板宽 320、内容区最大宽与内边距、表单标签列宽、控件默认宽、栅格列数与间隙），`--z-*` 层级，`--font-*`（字体族、四级字号、行高、字重）、`--radius-*`、`--shadow-*`、`--border-w`。

### 4.5 Element Plus 主题映射

`tokens.css` 用 `html:root` 选择器把 `--el-*` 变量全部映射到语义 token（主色及其 light-3/5/7/8/9 通过 `color-mix` 派生，背景、文字、边框、填充、圆角、字号、阴影、层级各一组）。Element Plus 的外观只由第一层驱动：改 `--color-primary` 一处，按钮、链接、菜单高亮同时变化；深色模式不需要引入 Element Plus 的 dark 样式文件。第三层禁止直接改 `--el-*`。

### 4.6 无行为布局类 `layout.css`

`.l-page`、`.l-page-header`、`.l-module`、`.l-module-header`、`.l-stack`、`.l-grid`（+ `.l-span-*`）、`.l-split`、`.l-cluster`、`.l-toolbar`、`.l-form`、`.l-inline`、`.l-state` 及其变体，全部只引用语义 token，不含 JS，768px 以下自动降为单列。原型与正式项目引用**同一个文件**，布局一致性是文件级别的，因此其冻结级别与第二层相同。

### 4.7 `base.css`

reset、字体、页面底色。正式项目关闭 Tailwind preflight，全局 reset 只以本文件为准。

## 5. 第二层：Element Plus 白名单与自研复合组件

### 5.1 白名单

第三层只能使用 `whitelist.json` 列出的 Element Plus 组件（Button、Input、Select、Checkbox、Radio、Switch、DatePicker、Form、Table、Pagination、Dialog、Drawer、Tabs、Tag、Badge、Skeleton、Empty 及其子组件；Message / MessageBox / Notification 为命令式调用）。需要白名单外的组件时先提议。

### 5.2 自研复合组件

只做 Element Plus 未覆盖的外壳与页面级组件：`UiShell`（顶栏 + 可折叠侧栏，小屏变抽屉，尺寸全取 `--layout-*`；外壳固定视口高，侧栏与主区各自在 `ElScrollbar` 内滚动，window 不滚）、`UiPageHeader`（标题、副标题、操作区）、`UiState`（`ready | loading | empty | error` 四态容器）。每个组件"定义完成"的条件：props 有 TypeScript 类型且导出；不含业务词汇；README 有用法示例。

### 5.3 共用方式

正式项目：`import DesignSystemUI from '@virtual/design-system'`，`app.use(ElementPlus).use(DesignSystemUI)`。原型：Vite 库模式把 `ui/` 打包为 `dist/ui.iife.js`（Vue 与 Element Plus 设为 external，运行时用 CDN 全局对象），原型一行 `<script>` 引入，`app.use(DesignSystemUI)`。原型 CDN 版本必须与 `packages/design-system/package.json` 一致。

### 5.3a 第二层如何保证充分消费第一层

第二层允许写样式，风险是"能引用 token 不等于必然引用"。三道机制：`check-layer2.mjs` 静态约束（视觉属性的值必须是语义 token，裸值 / 原始刻度 / 在第二层定义语义名 / 引用不存在的名字都报错，`pnpm build` 内置）；覆盖度报告（按文件扫描 `var()` 与模板用到的 `.l-*` 类，生成 `dist/token-coverage.json`，展示页配置卡据此列出组件消费的 token，未被第二层与 `--el-*` 映射消费的 token 单列）；变异验证（计划中：Playwright 对每个组件声明的 token 逐个改值并断言 computed style 变化，见 R-049）。

### 5.3b 皮肤层

`skins/<component>.css` 是样式级偏差的唯一落点：只允许 `--el-<component>-*` 变量与 Element Plus BEM 类，值只引用 token。加载顺序固定为 element-plus → tokens → skins → layout → base，原型与正式项目一致。当前皮肤：`table`（表头 `--layout-thead-h` 40 / 行 `--layout-row-h` 44、表头 subtle 底、外框圆角、hover accent）、`input`、`menu`（侧栏胶囊高亮）、`tabs`（`<el-tabs class="is-tabbar">` 页面级胶囊页签条）、`tree`（当前节点 accent）。表格行高这类「看起来是组件属性」的值放在第一层 token，由皮肤消费，第三层不设 `row-style`。

### 5.4 冻结与演进：三级偏差

第二层建成后冻结，但会随原型需求生长。原型需要 Element Plus 默认之外的 UI 时按三级归类，全部落在第二层，第三层永不写样式：

| 级别 | 含义 | 落点 | 消费时 AI 的动作 |
|---|---|---|---|
| 样式级 | 结构行为不变，长相不同 | `skins/` | 占位 + 需求单 |
| 结构级 | 由白名单原语 + `.l-*` 拼出的新形态 | `ui/composites/` | 就地拼装并打 `data-composite`；同一候选出现 ≥2 次下沉为复合组件 |
| 行为级 | Element Plus 没有的交互 | 封装外部库或自研进 `ui/` | 白名单组件占位并打 `data-placeholder`，写 `requests/` 需求单 |

闭环：原型阶段发现缺口 → 需求单 → 第二层负责人判定 → 单独实施并 `pnpm build:ds`、登记 README / whitelist / showcase → 回填原型占位 → promote。`check-prototype.js` 统计候选结构与占位，`--strict` 下占位即失败。首批复合组件 `UiListItem` / `UiFilterBar` / `UiStatCard` 即结构级下沉的范例。若设计稿的视觉语言与 Element Plus 差距很大，要么把皮肤层做厚，要么让设计稿服从设计系统；不允许第三条路——每个原型各自 hack 样式。

## 6. 第三层·原型

`apps/prototypes/` 下每个功能一个 HTML，先从五套页面排版模板中选一套骨架，再从 `_template.html` 复制起步，单文件可独立打开（依赖 CDN 与 `../../packages/design-system/`）。模板固定四个区块：① `DATA`（mock 数据，必须含常规、长文本、大数据量三类样本）② `state`（`Vue.reactive`，含 `view: ready | loading | empty | error`）③ `<div id="app">` 模板（只能用白名单标签与 `.l-*` 类，必须套 `<ui-shell>`）④ `methods`（`setup()` 内，只读 `DATA`、改 `state`）。

规则：禁止 `<style>`、inline style、裸数值、裸色值、原生表单/表格元素、手写 flex/grid、原生 overflow 滚动（滚动区域一律 `el-scrollbar`）、非白名单标签；in-DOM 模板中自定义标签必须显式闭合。路由：hash 路由 `#/<key>`，`<key>` 与 `UiShell` 菜单 key 一致，直达、前进后退、刷新保留；正式项目同一批 key 映射为 vue-router `/<key>`，promote 时机械转换。`scripts/check-prototype.js` 在提交前扫描并对违规返回非零。

## 7. 第三层·正式功能

`apps/web/src/features/<模块>/` 按 `Page.vue`、`components/`、`api.ts`、`composables/` 组织，只能 import 第一、二层；同一 UI 模式出现第二次时下沉为该模块业务组件。外壳与路由属于应用层（`App.vue` + `router/index.ts`）：`MENU` 即路由表，`/<key>` 由 `import.meta.glob('../features/*/Page.vue')` 自动对上 `features/<key>/Page.vue`，新增功能只加一项菜单 + 一个目录。功能模块之间禁止互相 import，`@/` 别名只给应用层，feature 内一律相对路径——跨模块共享的东西只能下沉到第二层。

约束机制（由软到硬）：`CLAUDE.md`（分层说明、硬性规则、原型规则、开发流程）→ 根目录 `eslint.config.js`（`eslint-plugin-vue`：`features/**` 禁原生表单 / 表格元素、inline style、`<style>` 块、Tailwind 布局 / 间距 / 尺寸 / 任意值类、非白名单组件——白名单直接读 `whitelist.json`；`eslint-plugin-boundaries`：feature 只能引用自身与 vue / vue-router / element-plus / `@virtual/design-system`，app 可引用 feature，`ui/**` 只能引用自身与 vue / element-plus，反向与跨 feature 一律报错）→ pre-commit 与 CI（待做）。

工具链：Vite 8（Rolldown）+ `@vitejs/plugin-vue` + `@tailwindcss/vite`。入口顺序 `element-plus/dist/index.css → tokens.css → skins/index.css → layout.css → base.css → tailwind.css`；`tailwind.css` 只引 `theme.css` 与 `utilities.css`（不引 preflight，reset 只来自 `base.css`），`@theme` 先 `--color-*: initial` 等清空 Tailwind 默认值，再把颜色 / 字号 / 字重 / 圆角 / 阴影逐个映射为 `var(--token)`，因此 Tailwind 原子类只是 token 的别名，不存在第二套值。

原型 → 正式的第一次实证：`_template.html` → `features/orders/`（`api.ts` 承接 DATA 并给出接口签名 + mock，`useOrders.ts` 承接 state 且 view 随请求自动流转，`Page.vue` 模板逐标签映射），同视口截图像素差 0.17%，差异全部来自原型专有的顶栏三态选择器与未实现菜单的禁用态，见 `features/orders/DIFF.md` 与 `doc/web-vs-prototype.png`。

## 8. 提示词 → 原型 → 正式页面

三步都由 Claude 插件（`packages/claude-plugin/`）中的技能驱动，规则与 `CLAUDE.md` 同源：

1. **`prototype`**：输入自然语言需求 → 读取 `design-system/README.md` 与 `_template.html` → 生成原型到 `apps/prototypes/` → 运行 `check-prototype.js` 自检。
2. **`promote`**：读取指定原型 → `DATA` 转 `api.ts` 接口定义与 mock → `state` 转 composable → 模板逐一映射为 `Page.vue`（`<el-*>` → `<El*>`，`<ui-*>` → `<Ui*>`）→ 输出到 `features/<名>/` → 生成"原型与实现差异清单"。
3. **`layer-rules`**：向 AI 注入三层规范，作为前两步的前置约束，也可单独调用检阅。

一比一的验收是测量而非假设：Playwright 对原型与正式页面喂同一份 mock 数据截图对比，像素差异阈值 1%（初始值），超出即列出差异。底层共用保证**组件级与布局级**一致；页面级差异只剩真实数据形态、异步状态与真实 API 接入，由原型的三类样本与四态要求、以及视觉回归覆盖。

## 9. 展示页面

`packages/design-system/showcase.html`（数据在 `showcase.data.js`），从第一、二层所在目录直接产出，零构建、双击打开，与原型同一套 CDN 依赖。排版采用画板确认的「方向 A · 文档站式」：顶栏路由页签（`#/tokens` 设计变量 / `#/materials` 组件物料 / `#/custom` 自研组件 / `#/layout` 布局范式 / `#/templates` 布局配置）+ 左侧分组锚点 + 内容限宽 + 右侧本页目录。设计变量页：功能色色卡网格、bg / text / border / icon 分列、间距作用域×关系阶梯尺（条宽即真实解析值，随密度变化）、字体样张、圆角 / 阴影 / 边框实物、布局尺寸与层级；原始刻度与 `--el-*` 映射默认折叠并标注禁止直接引用。组件物料页：Element Plus 全部组件按官方分类（Basic / Config / Form / Data / Navigation / Feedback / Others）逐一渲染；自研组件页：自研组件（外壳 / 页面级 / 复合组件）的配置卡——舞台 + 结构标签 + 「脱胎第一层」面板（临时调整该组件消费的 token，只作用于本卡舞台，验证组件确实随第一层变化）+ Props / Slots / Events + 用法；布局配置页：五套页面排版模板（统计 / 纯表格 / 统计 + 表格 / 左树 + 表格 / TabBar + 表格，参考 HY Compiler Studio 页面排版模板）在同一 UiShell 应用壳内切换预览，芯片显示 page / module / header / sidebar 当前值，可复制骨架进原型；每张卡片含舞台区、白名单 / 需提议标记（来自 `whitelist.json`）、驱动 token 注脚与复制用法。右上角实时切换主色 / 密度 / 深色 / 配色预设，三页同步变化；内容流式限宽并带四级响应式断点。本页属于设计系统内部工具，允许 `<style>` 与 `:style` 绑定，但所有值仍只引用 token。

## 10. 实施状态

| 阶段 | 内容 | 状态 |
|---|---|---|
| 第一步 | design-system（第一、二层）、原型模板、检查脚本、`CLAUDE.md`、本文档 | 已完成，见台账验收证据 |
| 展示页 | `packages/design-system/showcase.html`（设计变量 / 组件物料 / 布局范式，方向 A） | 已完成（IT-004） |
| 第二步 · A | `apps/web` 工具链（Vite 8 + Tailwind 4 + vue-router）、根 `eslint.config.js`（vue 规则 + boundaries）、首个正式页面 `features/orders` | 已完成（IT-014） |
| 第二步 · B | Claude 插件（prototype / promote / layer-rules） | 待排期 |
| 后续 | husky/CI、Playwright 视觉回归（含第二层变异验证） | 待排期 |
