---
rai-schema-version: 2
task: "前端三层分层设计需求基线"
task-key: "frontend-layered-design"
primary-target: "doc/frontend-layered-design.md"
requirement-version: "RV-007"
iteration: "IT-007"
current-changes:
  - "C-021"
  - "C-022"
status: "active"
updated: "2026-09-02"
---

# 前端三层分层设计需求基线 · 需求台账

## 快速摘要

- 当前需求版本：`RV-007`
- 当前工作迭代：`IT-007`
- 当前变更：`C-021` 滚动区域统一使用 Element Plus `ElScrollbar`（add R-043）；`C-022` UiShell 侧栏与主区改为 ElScrollbar 内滚（modify R-012）
- 本轮目标：所有滚动效果套用 Element Plus 滚动组件，规则、检查、现有页面一并落地，并提交代码
- 当前结论：**IT-007 完成**（R-043 verified，R-012 重新 verified，代码已提交）；展示页按方向 A 重做并验证（R-037），hash 路由落地并验证（R-038）；第一步成果保持——第一、二层（F-001～F-004）、原型模板与检查脚本（F-005）、`CLAUDE.md`、说明文档已实现并通过验收，17 条 `verified`、6 条 `implemented`（其余验收条件依赖第二步的 apps/web）；12 条 `ready` 属于第二步（apps/web 工具链、ESLint、展示页、插件、视觉回归），待用户验收第一步后授权

## 当前需求清单

### 第一层：token 与布局

- [x] `R-001` `tokens.css` 采用两级结构：原始刻度（`--space-N`、`--palette-*`）与语义 token；第二、三层只允许引用语义 token。`category: maintainability` `status: verified`
- [x] `R-002` 语义颜色按 作用域（bg / text / border / icon）× 语义（page / surface / muted / default / secondary / primary / danger / success / warning）命名，映射到原始色。`category: ux` `status: verified`
- [x] `R-003` 语义间距按 作用域（page / module / component / inline）× 关系（gap / pad / title）[× 轴 x / y] 命名为 `--space-{scope}-{relation}[-{axis}]`，初始 13 个。`category: ux` `status: verified`
- [ ] `R-004` 组件内部间距由第二层组件写死引用 token，第三层不设置组件内部间距。`category: maintainability` `status: implemented`
- [x] `R-005` 布局尺寸以 `--layout-*` 命名（侧边栏宽/折叠宽、顶栏高、内容区最大宽与内边距、栅格列数与间隙）并提供 `--z-*` 层级，与 `--space-*` 分开。`category: ux` `status: verified`
- [x] `R-006` 提供密度系数 `--density`，通过 `[data-density="compact"]` 整体缩放语义间距。`category: functional` `status: verified`
- [x] `R-007` 字号/行高、圆角、阴影、边框宽纳入第一层语义 token。`category: ux` `status: verified`
- [x] `R-008` 语义颜色预留 `[data-theme="dark"]` 重映射入口（含 Element Plus dark 变量同步），第二层不写死白色背景等固定色。`category: ux` `status: verified`
- [ ] `R-009` `layout.css` 提供无 JS 行为的布局类 `.l-page / .l-section / .l-stack / .l-grid` 及常用变体，只引用语义 token，原型与正式项目引用同一文件。`category: maintainability` `status: implemented`
- [ ] `R-010` `base.css` 统一 reset 与字体加载，原型与正式项目引用同一文件。`category: quality` `status: implemented`
- [x] `R-030` `tokens.css` 将语义 token 映射到 Element Plus 主题变量（`--el-color-primary`、`--el-border-color`、`--el-bg-color`、`--el-border-radius-base` 等），Element Plus 外观只由第一层驱动，不单独维护 SCSS 主题。`category: maintainability` `status: verified`

### 第二层：基础组件与外壳

- [ ] `R-011` 第二层由两部分构成：Element Plus 允许使用的组件白名单（初始：ElButton、ElInput、ElSelect、ElCheckbox、ElSwitch、ElForm/ElFormItem、ElTable、ElDialog、ElDrawer、ElMessage/ElNotification、ElTabs、ElPagination），以及自研复合组件清单（仅限 Element Plus 未覆盖的外壳与页面级组件）；两份清单均写入 README。`category: maintainability` `status: implemented`
- [x] `R-012` 外壳组件 `UiShell` 实现侧边栏折叠、路由高亮、响应式抽屉，所有尺寸取自 `--layout-*`，自身不写数值；外壳固定为视口高，侧栏与主内容区各自在 `ElScrollbar` 内滚动，页面（window）不滚动。`category: functional` `status: verified`
- [ ] `R-029` 第二层技术形态：正式项目通过 npm 引入 Element Plus 2.14.x；原型通过 CDN 引入 Vue 3 全局构建与**同一版本** Element Plus；自研复合组件用 Vite 库模式打包为 `dist/ui.iife.js`（Vue、ElementPlus 设为 external 全局），原型与正式项目共用同一份源码。`category: maintainability` `status: implemented`
- [x] `R-014` `design-system/README.md` 作为组件索引，列出白名单组件、自研组件、props 与用法示例；AI 开发第三层前必须先读。`category: delivery` `status: verified`
- [x] `R-015` 第二层建成后冻结；新增或修改须经"提议 → 判定通用/业务 → 单独提交 + 更新 README"流程。`category: maintainability` `status: verified`

### 第三层：原型

- [x] `R-016` `prototypes/` 每个功能一个单文件 HTML，从 `_template.html` 起步；模板引入 Vue 3 全局构建、Element Plus CDN（与 R-029 同版本）、`tokens.css / layout.css / base.css / dist/ui.iife.js`，固定 DATA / state / template / methods 四区块，`state` 为 Vue `reactive` 对象。`category: functional` `status: verified`
- [ ] `R-017` 原型模板默认套用 `UiShell`，内容区宽度与正式页面一致。`category: ux` `status: implemented`
- [x] `R-018` 原型 `DATA` 必须包含长文本、空列表、大数据量样本，并可切换 loading / empty / error 状态。`category: quality` `status: verified`
- [x] `R-019` `scripts/check-prototype.js` 扫描 `prototypes/*.html`，发现原生表单/表格元素、`style="`、裸色值、非白名单 `el-*` 组件即报错退出。`category: quality` `status: verified`
- [x] `R-039` 第一层默认配色改为「科技青」（参考用户本机 HY Compiler Studio `themeVariant=technology-cyan`）：主色 `#0076a3` / 强调 `#00486a` / 柔和底 `#e8f4f7`，中性灰带青灰色相（文字 `#304853` / `#4e6d7b`，边框 `#d5dcdf` / `#e6e8e8`，浅色页面底为纯白 `#ffffff`，靠卡片边框与轻阴影分层），功能色 成功 `#0cc778` / 警告 `#f7ba2a` / 危险 `#e0464b`，圆角 3 / 6 / 10，阴影带色相；新增 `--color-bg-accent`；深色重映射改为青灰底并提亮主色 `#2f9fcf`。Element 蓝 / 靛蓝 / 靛紫 保留为展示页预设。`category: ux` `status: verified`
- [x] `R-038` 路由：原型与展示页使用 hash 路由 `#/<key>`，`<key>` 与 `UiShell` / 顶栏菜单 key 一致，直达、前进后退、刷新保留；正式项目同一批 key 映射为 vue-router 路径 `/<key>`，promote 时机械转换。`category: functional` `status: verified`

### 第三层：正式功能与约束

- [ ] `R-020` 正式项目技术栈为 Vue 3（Composition API + `<script setup>` + TypeScript）。`category: delivery` `status: ready`
- [ ] `R-021` `apps/web/src/features/<模块>/` 按 components / api / composables / Page.vue 组织，只能 import 第一、二层。`category: maintainability` `status: ready`
- [x] `R-022` 同一 UI 模式在 features 内出现第二次时下沉为该模块业务组件，不复制。`category: maintainability` `status: verified`
- [x] `R-023` 项目根 `CLAUDE.md` 包含分层说明、硬性规则、原型规则、开发流程四节。`category: delivery` `status: verified`
- [ ] `R-024` ESLint（`eslint-plugin-vue` flat config）：`features/**` 禁止原生表单/表格元素（`vue/no-restricted-html-elements`）、inline style（`vue/no-static-inline-styles`）、Tailwind 任意值与布局类、非白名单 `El*` 组件；`ui/**` 禁止 import `features/*`。`category: quality` `status: ready`
- [ ] `R-025` 使用 `eslint-plugin-boundaries` 强制 `features → ui → tokens` 单向依赖。`category: quality` `status: ready`
- [ ] `R-026` pre-commit 跑 lint-staged，CI 跑 lint / typecheck / build。`category: delivery` `status: ready`
- [ ] `R-027` 原型→正式页面转换以 Playwright 对原型与正式页面喂同一份 mock 数据截图对比（初始阈值 1%）作为验收，超出即输出差异清单。`category: quality` `status: ready`
- [ ] `R-031` 工具链：Vite 8.x（Rolldown 打包）+ Tailwind CSS 4.x 通过 `@tailwindcss/vite` 插件接入，入口 CSS `@import "tailwindcss"`，Tailwind `@theme` 只引用 `tokens.css` 变量；关闭或隔离 Tailwind preflight 以免覆盖 Element Plus 样式；Node ≥ 20.19。`category: delivery` `status: ready`

### Claude 插件

- [ ] `R-032` 提供可安装的 Claude 插件包（`plugin/`，含 `plugin.json` manifest、skills、commands），供产品与开发在 Claude Code / Cowork 中使用。`category: delivery` `status: ready`
- [ ] `R-033` 插件技能 `prototype`：输入自然语言需求，读取 `design-system/README.md` 与 `_template.html`，生成符合 R-016～R-018 的原型 HTML 到 `prototypes/`，并运行 `check-prototype.js` 自检。`category: functional` `status: ready`
- [ ] `R-034` 插件技能 `promote`：读取指定原型，把 DATA 转 `api.ts` 接口定义与 mock、state 转 composable、template 逐一映射为 features 页面，输出到 `apps/web/src/features/<名>/` 并生成"原型与实现差异清单"。`category: functional` `status: ready`
- [ ] `R-035` 插件技能 `layer-rules`：向 AI 注入三层规范（分层定义、硬性规则、白名单、冻结流程），作为 `prototype` 与 `promote` 的前置约束，也可单独调用检阅。`category: delivery` `status: ready`

### 第二层演进机制

- [x] `R-040` 三级偏差处理规则：原型或正式页面需要 Element Plus 默认之外的 UI 时，按 样式级（第二层皮肤 `skins/`）/ 结构级（第二层复合组件 `ui/composites/`）/ 行为级（第二层封装外部库或自研）归类处理，第三层永不写样式。消费时：优先复合组件；未命中但能用白名单原语 + `.l-*` 拼出的，就地拼装并在外层打 `data-composite="<候选名>"`；拼不出的用最接近的白名单组件占位并打 `data-placeholder="<需求名>"` 且写需求单。`check-prototype.js` 统计候选出现次数（≥2 提示下沉）、对占位发出警告，`--strict` 模式（promote 前）下占位为错误。`category: maintainability` `status: verified`
- [x] `R-041` 首批复合组件（结构级下沉范例）：`UiListItem`（头像 / 标题 / 副标题 / 状态与操作插槽）、`UiFilterBar`（筛选区 + 操作区 + 可选重置）、`UiStatCard`（标签 / 数值 / 单位 / 趋势 / 说明），位于 `ui/composites/`，只用白名单原语 + `.l-*` + token，登记白名单、README、展示页。`category: functional` `status: verified`
- [x] `R-043` 滚动统一：任何需要滚动的区域（外壳主区、侧栏、抽屉内容、列表容器、横向条）必须使用 Element Plus `ElScrollbar`，禁止在第二、三层写 `overflow: auto | scroll`（表格 / 虚拟列表 / 下拉等 Element Plus 内部已自带 ElScrollbar 的组件除外）；`el-scrollbar` 加入白名单；`check-prototype.js` 新增 `no-overflow-scroll` 规则；展示页侧栏、主区、无限滚动演示与 UiShell 全部改为 ElScrollbar。`category: ux` `status: verified`
- [x] `R-042` 皮肤层与需求单：`skins/` 目录存放按组件划分的样式级覆盖（只允许 `--el-<component>-*` 变量与 Element Plus BEM 类，值只引用 token），加载顺序固定为 element-plus → tokens → skins → layout → base；`requests/` 目录存放组件需求单（模板含：效果描述、偏差级别、涉及 token、建议组件名与 props、来源原型），由第二层治理者判定后实施。`category: maintainability` `status: verified`

### 展示页面

- [x] `R-037` 展示页面从 `packages/design-system/` 目录直接产出（`showcase.html`，零构建，CDN + `dist/ui.iife.js` + `dist/tokens.js`），采用「方向 A · 文档站式」排版：顶栏路由页签（设计变量 / 组件物料 / 布局范式）+ 左侧分组锚点 + 内容限宽 + 右侧本页目录。设计变量页：功能色色卡网格、bg/text/border/icon 分列、间距作用域×关系阶梯尺（条宽取真实解析值）、字体样张、圆角/阴影/边框实物、布局尺寸；原始刻度与 `--el-*` 映射默认折叠。组件物料页：**Element Plus 全部组件**按官方分类（Basic / Form / Data / Navigation / Feedback / Others）逐一渲染，每张卡片含舞台区、白名单/需提议标记、驱动 token 注脚、复制用法；主题 / 密度 / 主色实时切换。**响应式**：内容流式限宽（设计变量 ≤1200、组件物料 ≤1560），卡片按 `auto-fill(minmax(440px, 1fr))` 自动分栏；≤1400 隐藏右目录，≤960 左锚点变为顶部横向滚动条，≤720 色卡/表格降列，≤560 顶栏精简；任何宽度无横向滚动。`category: ux` `status: verified`

### 文档

- [x] `R-028` `doc/frontend-layered-design.md` 与当前基线一致：技术栈 Vue 3 + Element Plus、Vite 8 + Tailwind 4、原型 CDN 形态、插件构成、展示页面，覆盖三层定义、细则、约束、promote 流程、目录总览与待确认项。`category: delivery` `status: verified`

## 需求追踪

| ID | 验收标准 | 来源 | 依赖 | 引入版本 | 最近变更 | 影响功能 |
|---|---|---|---|---|---|---|
| R-001 | tokens.css 存在原始刻度与语义两段；grep 第二、三层无 `--space-N` / `--palette-*` 直接引用 | 用户输入 | — | RV-001 | C-001 | F-001 |
| R-002 | 语义颜色变量名符合 `--color-{scope}-{semantic}` | 用户输入 | R-001 | RV-001 | C-001 | F-001 |
| R-003 | 13 个 `--space-*` 语义变量齐全 | 用户输入 | R-001 | RV-001 | C-001 | F-001 |
| R-004 | 第三层代码无对组件内边距的覆盖 | D-004 | R-003 | RV-001 | C-001 | F-001, F-003 |
| R-005 | `--layout-*` 与 `--z-*` 存在且未与 `--space-*` 混用 | D-002 | — | RV-001 | C-001 | F-001 |
| R-006 | compact 切换后语义间距等比缩放 | 待确认提案 | R-003 | RV-001 | C-001 | F-001 |
| R-007 | 字号/圆角/阴影/边框语义 token 存在 | 待确认提案 | R-001 | RV-001 | C-001 | F-001 |
| R-008 | 存在 `[data-theme="dark"]` 块 | 待确认提案 | R-002 | RV-001 | C-001 | F-001 |
| R-009 | layout.css 无 JS；两端引用同一文件 | 用户输入 | R-003, R-005 | RV-001 | C-001 | F-002 |
| R-010 | base.css 被原型模板与正式入口同时引用 | 对话结论 | — | RV-001 | C-001 | F-002 |
| R-011 | README 含白名单与自研清单；check 脚本与 ESLint 按白名单拦截 | 用户输入（Element Plus） | R-029 | RV-001 | C-004 | F-003 |
| R-012 | UiShell 尺寸全部为 `var(--layout-*)`；折叠/高亮/抽屉可操作 | 用户输入 | R-005 | RV-001 | C-001 | F-004 |
| R-014 | README 组件数与实际一致；CLAUDE.md 要求开发前先读 | 对话结论 | R-011 | RV-001 | C-001 | F-003, F-007 |
| R-015 | CLAUDE.md 含冻结与提议流程 | 对话结论 | R-011 | RV-001 | C-001 | F-003 |
| R-016 | `_template.html` 含四区块；原型单文件可直接打开并渲染 Element Plus 组件 | 用户输入（原型为可交互 HTML） | R-009, R-029 | RV-001 | C-006 | F-005 |
| R-017 | 原型内容区宽度与正式 shell 一致 | 对话结论 | R-012 | RV-001 | C-001 | F-005 |
| R-018 | 原型含三类样本数据与三种状态切换 | 对话结论 | R-016 | RV-001 | C-001 | F-005 |
| R-019 | 对含违规内容的原型运行脚本返回非零 | 对话结论 | R-016 | RV-001 | C-006 | F-005, F-007 |
| R-020 | `package.json` 依赖 vue@3；源码为 `<script setup lang="ts">` | 用户输入（Element Plus 隐含 Vue） | — | RV-001 | C-002 | F-006 |
| R-021 | 目录结构符合；ESLint 拦截跨层 import | 对话结论 | R-020 | RV-001 | C-002 | F-006 |
| R-022 | CLAUDE.md 含该规则 | 对话结论 | — | RV-001 | C-001 | F-006, F-007 |
| R-023 | CLAUDE.md 四节齐全 | 对话结论 | — | RV-001 | C-001 | F-007 |
| R-024 | 对违规样例 `.vue` 文件 lint 报错 | 对话结论 | R-020 | RV-001 | C-010 | F-007 |
| R-025 | 反向 import 被工具拦截 | 待确认提案 | R-021 | RV-001 | C-001 | F-007 |
| R-026 | 违规提交被 pre-commit 拒绝；CI 三步通过 | 对话结论 | R-024 | RV-001 | C-001 | F-007 |
| R-027 | 截图对比测试可执行并输出差异 | 对话结论 | R-016, R-034 | RV-001 | C-008 | F-008 |
| R-028 | 文档与 RV-002 基线逐节一致 | 用户输入 | — | RV-001 | C-011 | F-009 |
| R-029 | `dist/ui.iife.js` 可在原型 HTML 中直接注册组件；正式项目 import 同一源码 | 用户输入（Element Plus） | R-020 | RV-002 | C-003 | F-003, F-005 |
| R-030 | 修改 `--color-primary` 后 Element Plus 按钮主色随之变化 | 对话结论 | R-002 | RV-002 | C-005 | F-001, F-003 |
| R-031 | `vite@8`、`tailwindcss@4`、`@tailwindcss/vite` 安装；`vite build` 成功；Element Plus 组件样式未被 preflight 破坏 | 用户输入（最新 Vite/Tailwind） | R-020 | RV-002 | C-007 | F-006 |
| R-032 | 插件目录含合法 manifest；可通过 Claude Code 插件机制安装并列出技能 | 用户输入（Claude 插件） | — | RV-002 | C-008 | F-010 |
| R-033 | 对示例需求运行技能后生成原型且 check 脚本通过 | 用户输入 | R-016, R-019, R-032 | RV-002 | C-008 | F-010, F-005 |
| R-034 | 对示例原型运行后生成 features 模块与差异清单 | 用户输入 | R-021, R-032 | RV-002 | C-008 | F-010, F-008 |
| R-035 | 技能内容与 CLAUDE.md 规则一致（同源或引用） | 用户输入 | R-023, R-032 | RV-002 | C-008 | F-010, F-007 |
| R-037 | 双击打开即渲染；页面结构与画板「方向 A」一致（顶栏页签、左锚点、限宽、右目录）；设计变量数量 = tokens.json 语义计数；组件物料覆盖 Element Plus 官方组件清单且白名单标记与 whitelist.json 一致；切换 dark / compact / 主色后全部组件同步变化 | 用户输入（方向 A、全量 Element Plus） | R-011, R-029, R-030, R-038 | RV-003 | C-013 | F-011 |
| R-039 | tokens.css 默认加载 `--el-color-primary` = `#0076a3`；展示页与原型模板无需改动即呈现新配色；dark 模式下主按钮 / 文字对比可读 | 用户输入（参考 technology-cyan） | R-001, R-002, R-007 | RV-005 | C-016 | F-001 |
| R-043 | grep 第二层源码与展示页无 `overflow: auto/scroll`（Element Plus 内部除外）；展示页与原型页面 `document.scrollingElement.scrollHeight === clientHeight`（window 不滚）而 `.el-scrollbar__wrap` 可滚；check 脚本对含 `overflow:auto` 的原型报错 | 用户输入（滚动套用 Element Plus 滚动组件） | R-011, R-012 | RV-007 | C-021 | F-003, F-004, F-005, F-011 |
| R-040 | CLAUDE.md 含四句消费规则；check 脚本对含 `data-composite` 的原型输出候选统计、对 `data-placeholder` 输出警告、`--strict` 下退出码非零 | 用户输入（原型 UI 不满足时怎么办） | R-015, R-019 | RV-006 | C-018 | F-003, F-005, F-007 |
| R-041 | 三个组件 `vue-tsc` 通过、IIFE 可注册、展示页「自研复合组件」渲染；源码无裸数值 / 裸色 / 手写 flex | 对话结论（范例） | R-040, R-029 | RV-006 | C-019 | F-003, F-011 |
| R-042 | `skins/index.css` 被原型模板、展示页与 README 引入顺序一致；`requests/_template.md` 存在并含全部字段 | 对话结论 | R-040 | RV-006 | C-020 | F-003, F-005 |
| R-038 | 直达 `#/<key>` 高亮对应菜单；点击菜单改 hash；后退恢复；原型模板 `#/reports` 高亮「报表」 | 用户输入（补充路由概念） | R-012, R-016 | RV-004 | C-014 | F-005, F-011, F-008 |

## 不变量

- `I-001` 第一层只包含值（CSS 变量）与纯 CSS 类，不包含任何 JS 行为。约束 `R-001`～`R-010`、`R-030`。
- `I-002` 依赖方向单向 `第三层 → 第二层 → 第一层`，反向禁止。约束 `R-021`、`R-024`、`R-025`。
- `I-003` 第三层（原型、正式页面、展示页面）不得出现裸数值、裸色值、inline style、原生表单/表格元素、手写 flex/grid、非白名单组件。约束 `R-016`、`R-019`、`R-024`、`R-036`。
- `I-004` 第一、二层由原型与正式项目共用，不得分叉；原型 CDN 版本必须与正式项目 npm 版本一致。约束 `R-009`、`R-010`、`R-029`。
- `I-005` 第二层与 `layout.css` 冻结，变更须先提议确认并单独提交。约束 `R-009`、`R-015`。
- `I-006` 插件技能中的规则与项目 `CLAUDE.md` 同源，不得各自维护两份不一致的规范。约束 `R-023`、`R-035`。

## 功能清单

| 功能 | 名称 | 当前状态 | 对应需求 |
|---|---|---|---|
| F-001 | 设计 token 层（tokens.css，含 Element Plus 主题映射） | active | R-001～R-008, R-030 |
| F-002 | 布局与基础样式层（layout.css、base.css） | active | R-009, R-010 |
| F-003 | 基础组件层（Element Plus 白名单 + 自研组件 + 皮肤层） | active | R-011, R-014, R-015, R-029, R-040～R-042 |
| F-004 | 页面外壳组件（UiShell） | active | R-012 |
| F-005 | 原型工作流（prototypes/、模板、检查脚本） | active | R-016～R-019 |
| F-006 | 正式功能开发层（Vue 3 + Vite 8 + Tailwind 4） | planned | R-020～R-022, R-031 |
| F-007 | AI 约束机制（CLAUDE.md、ESLint、依赖检查、hooks/CI） | planned | R-023～R-026 |
| F-008 | 原型→正式转换视觉回归 | planned | R-027 |
| F-009 | 项目文档（doc/） | active | R-028 |
| F-010 | Claude 插件（prototype / promote / layer-rules 技能） | planned | R-032～R-035 |
| F-011 | 设计系统展示页（变量 + 物料） | active | R-037 |

## 当前迭代

### IT-007 · 滚动统一为 ElScrollbar

- 目标：规则、检查、UiShell、展示页一并改为 Element Plus 滚动组件；提交代码
- 范围：`CLAUDE.md`、`whitelist.json`、`check-prototype.js`、`ui/UiShell.vue`、`showcase.html`、`showcase.data.js`、README；git commit
- 包含变更：`C-021`、`C-022`
- 对应需求版本：`RV-007`
- 退出条件：R-043 verified，R-012 重新 verified，代码已提交

## 当前变更

### C-021 · 滚动统一使用 ElScrollbar

- 类型：`add`
- 原因：用户要求所有滚动效果套用 Element Plus 滚动组件
- 之前：展示页侧栏 `overflow-y: auto`、页面用 window 滚动、无限滚动演示用原生 overflow；无规则
- 之后：R-043
- 关联需求：`R-043`
- 覆盖关系：—
- 影响功能：`F-003 direct`、`F-005 direct`、`F-007 direct`、`F-011 direct`

### C-022 · UiShell 改为内滚

- 类型：`modify`
- 原因：R-043 要求外壳主区与侧栏在 ElScrollbar 内滚动
- 之前：UiShell 顶栏 / 侧栏 sticky，主区随 window 滚动
- 之后：外壳 100vh 固定，侧栏与主区各自 ElScrollbar，window 不滚
- 关联需求：`R-012`
- 覆盖关系：—
- 影响功能：`F-004 direct`、`F-005 indirect`（原型模板自动获得）

## 功能影响

| 变更 | 功能 | 级别 | 影响说明 | 验证要求 |
|---|---|---|---|---|
| C-002 | F-006 | direct | 目录与文件形态改为 Vue | 目录结构与 lint |
| C-003 | F-003, F-005 | direct | 组件来源与原型引入方式改变 | 原型可渲染 Element Plus；IIFE 可注册 |
| C-004 | F-003 | direct | 组件清单语义改变 | README 白名单与拦截一致 |
| C-005 | F-001, F-003 | direct | 新增主题映射 | 改 token 后组件外观变化 |
| C-006 | F-005 | direct | 模板结构改变 | 模板打开即渲染；check 脚本 |
| C-007 | F-006 | direct | 构建工具链 | build 成功；preflight 不破坏 Element Plus |
| C-007 | F-011 | indirect | 展示页面依赖该工具链 | 页面可构建 |
| C-008 | F-010 | direct | 新建插件 | 安装并列出技能；示例运行 |
| C-008 | F-008 | direct | promote 命令迁入插件 | 视觉回归仍可执行 |
| C-008 | F-005 | indirect | prototype 技能生成原型 | 生成物通过 check |
| C-009 | F-011 | direct | 新建页面 | 页面渲染且 lint 通过 |
| C-010 | F-007 | verification_only | 规则实现方式 | 违规样例报错 |
| C-011 | F-009 | direct | 文档回退待更新 | 逐节核对 |
| C-012 | F-011 | direct | 展示页位置与内容改变 | 打开即渲染；token 数量对账；切换联动 |
| C-012 | F-003 | indirect | build 增加 tokens.js 产物 | `pnpm build:ds` 产出三文件 |
| C-013 | F-011 | direct | 排版与内容范围改变 | 与画板核对；组件覆盖清单核对 |
| C-013 | F-003 | indirect | tokens.js 附带 whitelist | 标记与 whitelist.json 一致 |
| C-014 | F-005, F-011 | direct | 路由行为 | 直达 / 点击 / 后退 |
| C-014 | F-008 | indirect | promote 需转换路由 | 第二步实现时验证 |
| C-015 | F-011 | direct | 布局随视口变化 | 390 / 720 / 960 / 1280 / 2000 无横向滚动 |
| C-016 | F-001 | direct | 默认 token 值改变 | 选定后 dark / light 对比度与全部组件回归 |
| C-017 | F-001 | direct | 页面底色改白 | 卡片与页面仍可区分 |
| C-018 | F-003, F-005, F-007 | direct | 新规则与检测 | check 脚本正反例 |
| C-019 | F-003 | direct | 新组件 | typecheck / build / 展示页渲染 |
| C-020 | F-003, F-005 | direct | 加载顺序与目录 | 模板与展示页引入 skins |
| C-021 | F-003, F-005, F-007, F-011 | direct | 滚动容器全部替换 | window 不滚、wrap 可滚、check 规则 |
| C-022 | F-004 | direct | 外壳滚动模型改变 | 原型模板渲染、侧栏折叠、小屏抽屉 |

## 实现映射

| 需求 | 文件/符号/配置/测试 | 状态 | 证据 |
|---|---|---|---|
| R-001～R-008, R-030, R-039 | `packages/design-system/tokens.css`（① 原始刻度 ② 语义 ③ `html:root` Element Plus 映射 ④ `[data-theme="dark"]`） | verified | E-01, E-02, E-13 |
| R-009 | `packages/design-system/layout.css` | implemented | E-01（apps/web 引用待第二步） |
| R-010 | `packages/design-system/base.css` | implemented | 同上 |
| R-011, R-014 | `packages/design-system/README.md`、`whitelist.json` | R-014 verified / R-011 implemented | E-03（ESLint 白名单待第二步） |
| R-012, R-029 | `packages/design-system/ui/UiShell.vue`、`ui/index.ts`、`vite.lib.config.ts` → `dist/ui.iife.js` + `dist/ui.css` | R-012 verified / R-029 implemented | E-02, E-04（正式项目 import 待第二步） |
| R-043 | `CLAUDE.md` §2 滚动规则、`whitelist.json`（el-scrollbar）、`scripts/check-prototype.js`（no-overflow-scroll）、`ui/UiShell.vue`（侧栏 / 主区 ElScrollbar，expose scrollTo / wrapEl）、`showcase.html`（.ds-side / .ds-scroll）、`showcase.data.js`（Affix / Backtop / InfiniteScroll / Scrollbar 演示） | verified | E-17 |
| R-040 | `CLAUDE.md` §2.1、`scripts/check-prototype.js`（composites / placeholders / --strict）、`README.md` 三级偏差表 | verified | E-14 |
| R-041 | `ui/composites/UiListItem.vue`、`UiFilterBar.vue`、`UiStatCard.vue`、`ui/index.ts`、`whitelist.json` custom、`showcase.data.js` CUSTOM | verified | E-15 |
| R-042 | `skins/index.css`、`skins/table.css`、`skins/input.css`、`requests/_template.md`、`requests/README.md`；模板与展示页加载顺序 | verified | E-16 |
| R-004 | `ui/UiShell.vue`、`ui/UiPageHeader.vue`、`ui/UiState.vue` 内边距全部引用 token | implemented | E-03（第三层 lint 待第二步） |
| R-015, R-022, R-023 | `CLAUDE.md` §1～§6 | verified | E-05 |
| R-016～R-018 | `apps/prototypes/_template.html` | R-016/018 verified / R-017 implemented | E-02, E-06（与正式页面等宽比对待第二步） |
| R-019 | `scripts/check-prototype.js` | verified | E-07 |
| R-028 | `doc/frontend-layered-design.md`（RV-002 版本，§1～§10） | verified | E-08 |
| R-020, R-021, R-031 | `apps/web/package.json`、`vite.config.ts`、`src/style.css`、`src/features/` | planned（第二步） | — |
| R-024, R-025 | `apps/web/eslint.config.js` | planned（第二步） | — |
| R-026 | `.husky/pre-commit`、`.github/workflows/ci.yml` | planned（后续） | — |
| R-027 | `apps/web/tests/visual/*.spec.ts` | planned（后续） | — |
| R-032～R-035 | `packages/claude-plugin/.claude-plugin/plugin.json`、`skills/{prototype,promote,layer-rules}/SKILL.md` | planned（第二步） | — |
| R-037 | `packages/design-system/showcase.html`、`scripts/build-tokens.mjs`、`dist/tokens.js`(.json)、`package.json` build 脚本 | verified | E-09 |

## 决策与假设

- `D-001` 采用三层分法：第一层 token/布局（只有值）、第二层有行为的组件、第三层原型与正式功能；原型与正式项目共用第一、二层。
- `D-002` 布局尺寸 token 与无行为布局类归第一层，有行为的外壳组件归第二层。
- `D-003` 间距按 作用域 × 关系 [× 轴] 二维矩阵组织，命名 `--space-{scope}-{relation}[-{axis}]`。
- `D-004` 组件内部间距由第二层固定，第三层不设置。
- `D-005` 项目最终目标：提示词 → 可交互原型 → 正式页面；三层策略封装为 Claude 插件供产品与开发使用。
- `D-006` 第二层 UI 组件采用 Element Plus；技术栈 Vue 3；工具链 Vite 8 + Tailwind CSS 4。
- `D-007`（已被 D-011 取代）展示页面以 `apps/web` 内的 Vue 路由页面实现。
- `D-011` 展示页面从 `packages/design-system/` 目录直接产出，零构建单文件（用户要求，2026-09-02）。
- `D-012` 展示页排版采用画板「方向 A · 文档站式」；菜单为 设计变量 / 组件物料 / 布局范式；组件物料全量展示 Element Plus 并标注白名单（用户选定，2026-09-02）。画板：claude.ai 工件「设计系统展示页」。
- `D-014` 默认配色采用「科技青」，取值来自用户本机 HY Compiler Studio 的 technology-cyan 主题变量（`--app-primary #0076a3`、`--app-primary-strong #00486a`、`--app-primary-soft #e8f4f7`、`--park-text #304853`、`--park-text-secondary #4e6d7b`、`--park-border #e6e8e8`、`--park-canvas #f2f2f2`），2026-09-02。
- `D-013` 路由约定：原型与展示页 hash 路由 `#/<key>`，正式项目 vue-router `/<key>`，key 同源（用户要求补充路由概念）。
- `D-008` 第一层纳入字号/行高、圆角、阴影、边框，预留深色模式，启用密度系数；依赖方向检查采用 `eslint-plugin-boundaries`（用户确认）。
- `D-009` 实施分两步：先 design-system + 原型模板 + CLAUDE.md，验收后再做 apps/web、展示页、插件（用户确认）。
- `D-010` 采用 pnpm monorepo：`packages/design-system`、`packages/claude-plugin`、`apps/web`、`apps/prototypes`（用户要求）。
- `H-005` `pnpm build` 顺序为 vite（会清空 dist）→ build-tokens；若反过来 tokens.js 会被清掉（本轮已修正）。
- `H-004` 原型通过 jsdelivr CDN 引入 Vue / Element Plus；离线环境需改为 `apps/prototypes/vendor/` 本地副本。容器内 CDN 不可达，验证时以本地 node_modules 同版本文件替代（不影响结论）。
- `H-001` 版本基线（2026-09-02 `npm view`）：vite 8.2.2、tailwindcss / @tailwindcss/vite 4.3.3、element-plus 2.14.5、vue 3.5.42、@vitejs/plugin-vue 6.0.8、eslint 10.9.1、eslint-plugin-vue 10.10.0、eslint-plugin-boundaries 7.2.0。Node ≥ 20.19。
- `H-003` 插件形态为 Claude Code / Cowork 插件目录（manifest + skills），随仓库分发，安装方式为本地路径或 marketplace；不涉及 MCP server。

## 待确认与阻塞

| 事项 | 关联需求 | 影响 |
|---|---|---|
| 插件形态（H-003）是否符合预期 | R-032 | 第二步实现位置 |
| 原型 CDN 是否需要离线副本（H-004） | R-016 | 模板依赖引入方式 |
| 第二步实施授权：第一步验收后开始 apps/web、展示页、插件 | R-020～R-025, R-031～R-036 | 第二步是否进入实施 |

无外部阻塞。

## 验收证据

| 编号 | 需求 | 证据 | 结果 | 日期 |
|---|---|---|---|---|
| E-01 | R-001, R-003, R-005, R-007 | `grep -rE -- '--(space-[0-9]+\|palette-)' packages/design-system/ui apps/prototypes` 无匹配（仅 CLAUDE.md 规则文字）；`--space-{page,module,component,inline}-*` 语义变量计 13 个；`--layout-*`、`--z-*`、`--font-*`、`--radius-*`、`--shadow-*`、`--border-w*` 均存在 | pass | 2026-09-02 |
| E-02 | R-002, R-006, R-008, R-012, R-016, R-030 | Playwright 无头渲染 `_template.html`（1280×800）：`.ui-shell` 存在、侧栏宽 240px、`--el-color-primary` = `#409eff`、主按钮背景 rgb(64,158,255)、`.l-module` padding 24px；切换 `data-theme=dark` + `data-density=compact` + `--color-primary:#16a34a` 后主按钮 rgb(22,163,74)、padding 18px（=24×0.75）、页面底色 rgb(20,20,20)；视口 600px 时 `.is-mobile` 生效、桌面侧栏移除；页面无 JS 错误。截图 `doc/prototype-template-light.png`、`doc/prototype-template-dark.png` | pass | 2026-09-02 |
| E-03 | R-004, R-011, R-014 | README 自研组件 3 个 = `ui/index.ts` 注册 3 个；`whitelist.json` 与 README 白名单一致；`CLAUDE.md` §5 要求开发前先读 README | pass | 2026-09-02 |
| E-04 | R-029 | `pnpm --filter @virtual/design-system build` 产出 `dist/ui.iife.js`（9.4 kB）+ `dist/ui.css`；全局 `DesignSystemUI.install` 可被 `app.use`；`vue-tsc --noEmit` 通过 | pass | 2026-09-02 |
| E-05 | R-015, R-022, R-023 | `CLAUDE.md` 含 分层 / 硬性规则 / 原型 / 正式功能 / 开发流程 / 命令 六节；含冻结提议流程与"第二次出现即下沉"规则 | pass | 2026-09-02 |
| E-06 | R-018 | 无头切换 `state.view`：loading→`.el-skeleton`、empty→`.el-empty`、error→`.l-state`、ready→3 行；`dataset=big` 共 500 条分页 10 行；`dataset=long` 1 行超长文本 | pass | 2026-09-02 |
| E-07 | R-019 | `node scripts/check-prototype.js` 对模板返回 0；对注入 `<input style="color:#ff0000">` 与 `<el-rate/>` 的副本返回 1，报出 no-inline-style / no-raw-hex / tag-not-allowed / no-self-closing-custom 四类错误 | pass | 2026-09-02 |
| E-09 | R-037 | Playwright 无头打开 `showcase.html`：模块一 9 个语义分组、73 行 = `tokens.json` counts.semantic 73；开启原始刻度后 156 行（73+27+56）；`--color-primary` 解析 rgb(64,158,255)、`--space-module-pad` 24px；切换 dark + compact 后 `--space-module-pad` 18px、`--color-bg-surface` rgb(29,30,32)；模块二 9 个物料区块、38 个按钮、表格 3 行；无 JS 错误。截图 `doc/showcase-tokens.png`、`doc/showcase-materials.png` | pass | 2026-09-02 |
| E-10 | R-037 | Playwright 经 `pnpm dev` 打开三路由：`#/tokens` 5 功能色卡 + 15 分列色片 + 13 条间距条，左锚点 7 组（颜色 22 / 间距 13 / 字体 11 / 圆角阴影边框 9 / 布局尺寸层级 17 / 原始刻度 27 / EP 映射 56）；`#/materials` 83 张卡片（Element Plus 80：Basic 11 / Config 1 / Form 22 / Data 25 / Navigation 9 / Feedback 10 / Others 2，自研 3），白名单标记 27 个与 whitelist.json 一致；`#/layout` 8 个布局类区块；切换深色 + 紧凑后整页同步；唯一控制台错误为 Image 组件故意使用的无效 URL（错误占位演示）。结构与画板「方向 A」一致。截图 `doc/showcase-tokens.png`、`showcase-materials.png`、`showcase-materials-dark.png`、`showcase-layout.png` | pass | 2026-09-02 |
| E-11 | R-038 | 直达 `showcase.html#/layout` 高亮「布局范式」；点击「组件物料」hash 变为 `#/materials`；后退回到 `#/layout`；原型模板 `_template.html#/reports` 高亮「报表」；`check-prototype.js` 对模板仍返回 0 | pass | 2026-09-02 |
| E-12 | R-037（响应式） | Playwright 视口 2000 / 1280 / 960 / 720 / 390：`scrollWidth === innerWidth`（三路由均无横向滚动）；2000 宽组件物料自动三栏、内容限宽 1560；960 宽左锚点变顶部横向条；390 宽色卡两栏、顶栏精简。截图 `doc/showcase-2000.png`、`showcase-390.png` | pass | 2026-09-02 |
| E-13 | R-039 | 通过内置浏览器读取用户本机 `localhost:5173/?themeVariant=technology-cyan` 的计算样式变量取得参考值；写入 tokens.css 后 Playwright 打开展示页：`--el-color-primary` = `#0076a3`，功能色卡 / 按钮 / 标签 / 表格全部随之变化，深色模式主色 `#2f9fcf` 可读；原型模板同样生效；`pnpm build` 产出 74 语义 / 28 原始 / 56 映射。截图 `doc/showcase-tokens.png`、`showcase-materials.png`、`showcase-materials-dark.png`、`prototype-template-light.png` 已更新 | pass | 2026-09-02 |
| E-14 | R-040 | 对含 `data-composite="list-item"` 的两个原型副本运行 check：输出「list-item × 2（2 个文件）→ 建议下沉」；含 `data-placeholder="UiKanban"` 的副本：普通模式输出警告并列出位置，`--strict` 模式报错退出码 1；模板本身仍通过 | pass | 2026-09-02 |
| E-15 | R-041 | `vue-tsc --noEmit` 通过；`pnpm build` 产出 IIFE；展示页「自研复合组件」6 张卡片，UiListItem 3 行 / UiFilterBar 1 / UiStatCard 4 均渲染；源码 grep 无裸数值 / 裸色（第二层允许自有样式，UiStatCard 内部一处 flex 仅引用 token）；截图 `doc/showcase-composites.png` | pass | 2026-09-02 |
| E-16 | R-042 | 展示页与原型模板均加载 `skins/index.css`，表头背景解析为 `rgb(247,249,249)`（= `--color-bg-subtle`，皮肤生效）；`requests/_template.md` 含 效果 / 原因 / 方案 / 占位 / 判定 五节 | pass | 2026-09-02 |
| E-17 | R-043, R-012 | grep 第二层源码与 layout.css 无 `overflow: auto/scroll`；Playwright：展示页 window 不可滚（scrollHeight = clientHeight）、`.ds-scroll .el-scrollbar__wrap` 可滚，侧栏为 ElScrollbar；点击锚点「Feedback」后 wrap.scrollTop = 12593 且高亮同步、window.scrollY = 0；390 宽侧栏横向条可滚且页面无横向溢出；原型模板 500 行数据下 window 不滚、`.ui-shell__scroll` wrap 可滚、侧栏 ElScrollbar 存在；check 脚本对 `overflow:auto` 报错规则已加入；`vue-tsc` 通过 | pass | 2026-09-02 |
| E-08 | R-028 | `doc/frontend-layered-design.md` §1～§10 与 RV-002 逐节核对；IT-003 同步 §3 目录树与 §9 展示页（RV-003）；IT-004 同步 §6 路由与 §9 方向 A（RV-004）：Vue 3 + Element Plus、Vite 8 + Tailwind 4、monorepo 目录、CDN 原型形态、插件三技能、展示页面、实施状态 | pass | 2026-09-02 |

## 历史索引

| RV | IT | 变更 | 类型 | 需求 | 前后摘要 | 影响功能 |
|---|---|---|---|---|---|---|
| RV-006 | IT-006 | C-018 | add | R-040 | 无 → 三级偏差规则与候选/占位标记 | F-003, F-005, F-007 |
| RV-006 | IT-006 | C-019 | add | R-041 | 无 → UiListItem / UiFilterBar / UiStatCard | F-003 |
| RV-006 | IT-006 | C-020 | add | R-042 | 无 → skins/ 与 requests/ | F-003, F-005 |
| RV-005 | IT-005 | C-015 | modify | R-037 | 固定宽 → 流式限宽 + 四级断点 | F-011 |
| RV-005 | IT-005 | C-016 | add | R-039 | 无 → 默认配色科技青 | F-001 |
| RV-005 | IT-005 | C-017 | modify | R-039 | 页面底 #f2f2f2 → 白 | F-001 |
| RV-004 | IT-004 | C-013 | modify | R-037 | 两模块表格式 → 方向 A 文档站 + 全量 Element Plus | F-011 |
| RV-004 | IT-004 | C-014 | add | R-038 | 无 → hash 路由 | F-005, F-011 |
| RV-003 | IT-003 | C-012 | override | R-037 replaces R-036 | apps/web Vue 页 → design-system 目录内零构建单文件 | F-011 |
| RV-001 | IT-001 | C-001 | add | R-001～R-028、I-001～I-005 | 无 → 建立三层分层需求基线并交付说明文档（R-028 当时 verified） | F-001～F-009 |
| RV-002 | IT-002 | C-002 | modify | R-020, R-021 | React/Vue 待定 → Vue 3 | F-006 |
| RV-002 | IT-002 | C-003 | override | R-029 replaces R-013 | Web Components/双实现 → Element Plus npm + CDN 同版本 + IIFE | F-003, F-005 |
| RV-002 | IT-002 | C-004 | modify | R-011 | 自研 ≤12 → 白名单 + 自研复合组件 | F-003 |
| RV-002 | IT-002 | C-005 | add | R-030 | 无 → token 映射 --el-* | F-001, F-003 |
| RV-002 | IT-002 | C-006 | modify | R-016, R-019 | Web Components 模板 → Vue 全局构建 + EP CDN | F-005 |
| RV-002 | IT-002 | C-007 | add | R-031 | 无 → Vite 8 + Tailwind 4 | F-006 |
| RV-002 | IT-002 | C-008 | add | R-032～R-035 | 无 → Claude 插件三技能；R-027 只留视觉回归 | F-010, F-008 |
| RV-002 | IT-002 | C-009 | add | R-036 | 无 → apps/web 展示页（后被 C-012 覆盖） | F-011 |
| RV-002 | IT-002 | C-010 | clarify | R-024 | ESLint 规则按 Vue 生态明确 | F-007 |
| RV-002 | IT-002 | C-011 | modify | R-028 | 文档同步至 RV-002 | F-009 |

## 归档需求

- `R-013` 第二层技术形态二选一（方案 A Web Components / 方案 B 双实现）。最终状态 `overridden`，被 `R-029` 取代（C-003）。
- `R-036` 三层展示页面在 `apps/web` 内以 Vue 页面实现，三区块。最终状态 `overridden`，被 `R-037` 取代（C-012）。
