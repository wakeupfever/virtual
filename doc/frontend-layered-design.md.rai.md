---
rai-schema-version: 2
task: "前端三层分层设计需求基线"
task-key: "frontend-layered-design"
primary-target: "doc/frontend-layered-design.md"
requirement-version: "RV-016"
iteration: "IT-016"
current-changes:
  - "C-037"
  - "C-038"
  - "C-039"
  - "C-040"
  - "C-041"
  - "C-042"
  - "C-043"
  - "C-044"
  - "C-045"
status: "active"
updated: "2026-09-05"
---

# 前端三层分层设计需求基线 · 需求台账

## 快速摘要

- 当前需求版本：`RV-016`
- 当前工作迭代：`IT-016`
- 当前变更：`C-037` 展示页三页视觉重排、`C-038` 去重叠：自研组件单组件详情 + 布局配置整页路由、`C-039` 内容区取消限宽、`C-040` 高度填充布局与高级搜索浮窗（add R-050 / R-051）、`C-041` dist 产物可复现、`C-042` 修复填充链把页面收成 max-content 宽、`C-043` 展示页全局调参面板、`C-044` 调参值格可输入 / 控件不变形 / 控制条可拖动、`C-045` 第一层与模板用户验收
- 本轮目标：展示页从「文档里的缩略预览」变成「能整屏打开的真实页面」，并补上表格页最缺的一块能力——页面撑满、表格随父级高度流动、表体内滚、分页贴底
- 当前结论：**IT-016 完成**（R-050 / R-051 verified；R-005 / R-009 / R-037 / R-038 / R-041 / R-042 / R-044 / R-048 / R-049 重新 verified）；IT-015 完成（R-026 / R-027 / R-049 verified）；IT-014 完成（R-020 / R-021 / R-024 / R-025 / R-031 verified）；IT-013 完成（R-047 / R-048 verified，R-049 ready；R-005 / R-037 重新 verified）；IT-012 完成（R-046 verified，R-037 重新 verified）；IT-011 完成（R-042 / R-045 / R-044 / R-041 重新 verified）；IT-010 完成（R-045 verified；R-041 / R-044 重新 verified）；IT-009 完成（R-044 verified，R-037 重新 verified，代码已提交）；IT-008 完成（R-037 / R-041 / R-012 / R-007 / R-042 重新 verified，代码已提交）；展示页按方向 A 重做并验证（R-037），hash 路由落地并验证（R-038）。**分步进度：第一步（第一、二层 + 原型模板 + CLAUDE.md）已交付并验收；第二步 A（apps/web 工具链与 ESLint 三层约束）、C（pre-commit / CI 门禁）、D（视觉回归与变异验证）已完成；第二步 B（Claude 插件 R-032～R-035）尚未开工，等授权。** 2026-09-05 用户验收第一层配置与五套模板（C-045），六条 `implemented` 转 `verified`；50 条需求现为 46 verified / 4 ready，4 条 ready 即第二步 B

## 当前需求清单

### 第一层：token 与布局

- [x] `R-001` `tokens.css` 采用两级结构：原始刻度（`--space-N`、`--palette-*`）与语义 token；第二、三层只允许引用语义 token。`category: maintainability` `status: verified`
- [x] `R-002` 语义颜色按 作用域（bg / text / border / icon）× 语义（page / surface / muted / default / secondary / primary / danger / success / warning）命名，映射到原始色。`category: ux` `status: verified`
- [x] `R-003` 语义间距按 作用域（page / module / component / inline）× 关系（gap / pad / title）[× 轴 x / y] 命名为 `--space-{scope}-{relation}[-{axis}]`，初始 13 个。`category: ux` `status: verified`
- [x] `R-004` 组件内部间距由第二层组件写死引用 token，第三层不设置组件内部间距。`category: maintainability` `status: verified`
- [x] `R-005` 布局尺寸以 `--layout-*` 命名（侧边栏宽/折叠宽、顶栏高、内容区最大宽与内边距、栅格列数与间隙）并提供 `--z-*` 层级，与 `--space-*` 分开。`--layout-content-max` 默认 `none`：业务后台内容区铺满，不在超宽屏居中留白；要恢复限宽改成具体值即可（一处生效，原型与正式页面同步）。`category: ux` `status: verified`
- [x] `R-006` 提供密度系数 `--density`，通过 `[data-density="compact"]` 整体缩放语义间距。`category: functional` `status: verified`
- [x] `R-007` 字号/行高、圆角、阴影、边框宽纳入第一层语义 token；字号五级：display / page-title / module-title / body / caption。`category: ux` `status: verified`
- [x] `R-008` 语义颜色预留 `[data-theme="dark"]` 重映射入口（含 Element Plus dark 变量同步），第二层不写死白色背景等固定色。`category: ux` `status: verified`
- [x] `R-009` `layout.css` 提供无 JS 行为的布局类 `.l-page / .l-section / .l-stack / .l-grid` 及常用变体，只引用语义 token，原型与正式项目引用同一文件。含高度填充三件套：`.l-page--fill`（撑满外壳内容区并纵向排布）、`.l-fill`（任意 flex 容器子项占满剩余高度，`flex: 1 1 auto; min-height: 0`）、`.l-module.l-fill`（被标记的模块自身纵向排布，才能把余量交给内部 `.l-fill`）。详见 `R-050`。`category: maintainability` `status: verified`
- [x] `R-010` `base.css` 统一 reset 与字体加载，原型与正式项目引用同一文件。`category: quality` `status: verified`
- [x] `R-030` `tokens.css` 将语义 token 映射到 Element Plus 主题变量（`--el-color-primary`、`--el-border-color`、`--el-bg-color`、`--el-border-radius-base` 等），Element Plus 外观只由第一层驱动，不单独维护 SCSS 主题。`category: maintainability` `status: verified`

- [x] `R-047` 第二层 token 约束：`ui/**/*.vue` 的 `<style>` 与 `skins/*.css` 中视觉属性（颜色 / 背景 / 边框 / 内外边距 / gap / 圆角 / 阴影 / 字号 / 宽高，含 `--el-*` 变量赋值）的值必须是第一层语义 token；裸色、裸长度（0 与视口单位除外）、引用 `--palette-*` / `--space-N`、在第二层定义语义名、引用不存在的 token 均为错误；由 `scripts/check-layer2.mjs` 检查并内置于 `pnpm build`。新增尺寸 token：`--layout-control-h` 32 / `--layout-menu-item-h` 40 / `--layout-icon-{sm,md,lg}` 22 / 28 / 40；13px 档位不新增，统一用 `--font-size-caption`。`category: quality` `status: verified`
- [x] `R-048` 第二层覆盖度报告：按文件统计消费的 token（`<style>`、`:style` / script 的 `var()`、模板用到的 `.l-*` 类间接消费；第一层 layout.css / base.css 计入），输出 `dist/token-coverage.json` 与 `dist/token-coverage.js`（`window.DS_COVERAGE`），**输出对象的键按名字排序**（目录遍历顺序不稳定，不排序会产生纯乱序 diff，令 CI 的「`dist/` 无 diff」校验误报）；展示页自研组件配置卡的 token 列表改由该数据驱动（`showcase.data.js` 不再手填）；既无第二层消费也未被 `--el-*` 映射引用的语义 token 列为「未消费」警告；复合组件至少消费 bg / text / border / space 中的三类（纯文字组件除外）。`category: maintainability` `status: verified`
- [x] `R-049` 第二层变异验证：`tests/visual/mutate.mjs` 在展示页「自研组件」舞台上，按 `token-coverage.json` 对每个自研组件声明的 token 逐个改成显著值，断言组件内至少一个元素的 computed style 变化；展示页改为单组件详情后，靶场按 `keyOf(组件名)`（`UiStatCard → ui-stat-card`）逐个切到 `#/custom/<key>` 再取该页唯一的配置卡；变异前用 `PREP` 把舞台切到 error / hover 态；观察不到但已核实的例外列在 `KNOWN`（必须写原因，当前 6 条）；纳入 CI。`category: quality` `status: verified`
- [x] `R-046` 调色板变体：整套配色以 `[data-palette="<key>"]` 块放在 `tokens.css` ⑤ 段（当前 element / indigo / violet，默认科技青不加属性）；品牌 / 功能色（及圆角）在深浅两种模式都生效，中性色（bg / border / text / icon / canvas）只作用于浅色（`:not([data-theme="dark"])`），深色仍由 ④ 段统一重映射；`build-tokens.mjs` 抽取为 `palettes`（key / label / vars）；展示页 `PRESETS` 只登记 key / label，切换即设 `html[data-palette]`；第三层换肤只能切该属性。`category: ux` `status: verified`
- [x] `R-045` 第一层默认值对齐参考站 `D:\hy-project\hy-compiler\apps\playground\src\style.css`（`--hy-space-*`）与 LayoutTemplateShowcase：间距 page-gap 24 / page-pad 20 / module-gap 16 / module-pad 16 / component-gap 12 / inline 8；布局 header 60 / sidebar 230 / collapsed 66 / 新增 `--layout-aside-w` 320；圆角 4 / 6 / 12；字号新增 `--font-size-micro` 10，display 改 24；新增 `--color-bg-canvas`（应用壳内容区底 #f0f3f4，UiShell 使用）、subtle 改 #f3f5f5；布局新增 `--layout-row-h` 44（表格行高）与 `--layout-thead-h` 40（表头高），经 `skins/table.css` 生效；`layout.css` 新增 `.l-grid--main-aside`、`.l-split--aside`、`.l-tile`、`.l-bars` / `.l-bar`。`category: ux` `status: verified`

- [x] `R-050` 高度填充布局：表格页可让页面撑满外壳内容区、表格由父级剩余高度决定自身高度、表头固定、表体在 Element Plus 自带 `ElScrollbar` 内滚（承 `R-043`）、分页贴底，**不给 `el-table` 传 `height` / `max-height`**。第一层加 `.l-page--fill` / `.l-fill` / `.l-module.l-fill`（见 `R-009`）；第二层配套：`UiShell` 的 `ElScrollbar` 用 `view-class="ui-shell__view"` 置为**确定高度**的纵向 flex（百分比 `min-height` 需要父级确定高度才生效，这是链路成立的前提），`UiState` 加 `.ui-state.l-fill` 纵向排布（否则填充链断在它的包裹 div），`skins/table.css` 加 `.el-table.l-fill` 让表格填充并保底一行 `--layout-row-h`。不加 `--fill` 的页面行为不变：`.l-page` 的 `min-height` 为 auto 不会被压缩，内容更高照常由外壳内滚。第三层写法 `.l-page--fill` + 承载模块 `.l-fill` + `<el-table class="l-fill">`。`category: ux` `status: verified`
- [x] `R-051` 高级搜索用浮窗承载：`UiFilterBar` 新增 `#advanced` 插槽，内部用 `ElPopover`（`popper-class="ui-filter-bar__adv"`，值只引用 token）弹出，展开**不改变**筛选条与页面高度，下方表格不被推下去；`@toggle(open)` 带出展开状态；不给 `#advanced` 插槽时退化为纯文字链接并只 `emit('toggle')`，向后兼容。`ElPopover` 只在第二层内部使用，不进第三层白名单。`category: ux` `status: verified`

### 第二层：基础组件与外壳

- [x] `R-011` 第二层由两部分构成：Element Plus 允许使用的组件白名单（初始：ElButton、ElInput、ElSelect、ElCheckbox、ElSwitch、ElForm/ElFormItem、ElTable、ElDialog、ElDrawer、ElMessage/ElNotification、ElTabs、ElPagination），以及自研复合组件清单（仅限 Element Plus 未覆盖的外壳与页面级组件）；两份清单均写入 README。`category: maintainability` `status: verified`
- [x] `R-012` 外壳组件 `UiShell` 实现侧边栏折叠、路由高亮、响应式抽屉，所有尺寸取自 `--layout-*`，自身不写数值；外壳固定为视口高，侧栏与主内容区各自在 `ElScrollbar` 内滚动，页面（window）不滚动；顶栏带品牌色块，侧栏菜单经 `skins/menu.css` 呈现圆角胶囊高亮。`category: functional` `status: verified`
- [x] `R-029` 第二层技术形态：正式项目通过 npm 引入 Element Plus 2.14.x；原型通过 CDN 引入 Vue 3 全局构建与**同一版本** Element Plus；自研复合组件用 Vite 库模式打包为 `dist/ui.iife.js`（Vue、ElementPlus 设为 external 全局），原型与正式项目共用同一份源码。`category: maintainability` `status: verified`
- [x] `R-014` `design-system/README.md` 作为组件索引，列出白名单组件、自研组件、props 与用法示例；AI 开发第三层前必须先读。`category: delivery` `status: verified`
- [x] `R-015` 第二层建成后冻结；新增或修改须经"提议 → 判定通用/业务 → 单独提交 + 更新 README"流程。`category: maintainability` `status: verified`

### 第三层：原型

- [x] `R-016` `prototypes/` 每个功能一个单文件 HTML，从 `_template.html` 起步；模板引入 Vue 3 全局构建、Element Plus CDN（与 R-029 同版本）、`tokens.css / layout.css / base.css / dist/ui.iife.js`，固定 DATA / state / template / methods 四区块，`state` 为 Vue `reactive` 对象。`category: functional` `status: verified`
- [x] `R-017` 原型模板默认套用 `UiShell`，内容区宽度与正式页面一致。`category: ux` `status: verified`
- [x] `R-018` 原型 `DATA` 必须包含长文本、空列表、大数据量样本，并可切换 loading / empty / error 状态。`category: quality` `status: verified`
- [x] `R-019` `scripts/check-prototype.js` 扫描 `prototypes/*.html`，发现原生表单/表格元素、`style="`、裸色值、非白名单 `el-*` 组件即报错退出。`category: quality` `status: verified`
- [x] `R-039` 第一层默认配色改为「科技青」（参考用户本机 HY Compiler Studio `themeVariant=technology-cyan`）：主色 `#0076a3` / 强调 `#00486a` / 柔和底 `#e8f4f7`，中性灰带青灰色相（文字 `#304853` / `#4e6d7b`，边框 `#d5dcdf` / `#e6e8e8`，浅色页面底为纯白 `#ffffff`，靠卡片边框与轻阴影分层），功能色 成功 `#0cc778` / 警告 `#f7ba2a` / 危险 `#e0464b`，圆角 3 / 6 / 10，阴影带色相；新增 `--color-bg-accent`；深色重映射改为青灰底并提亮主色 `#2f9fcf`。Element 蓝 / 靛蓝 / 靛紫 保留为展示页预设。`category: ux` `status: verified`
- [x] `R-038` 路由：原型与展示页使用 hash 路由 `#/<key>`，`<key>` 与 `UiShell` / 顶栏菜单 key 一致，直达、前进后退、刷新保留；正式项目同一批 key 映射为 vue-router 路径 `/<key>`，promote 时机械转换。展示页扩展为两段式 `#/<route>/<sub>`：`#/custom/<组件 key>` 单组件详情、`#/page/<模板 key>` 整页模板；`page` 不进顶栏导航；`<sub>` 缺省时落到该路由的第一项并 `replaceState` 补全。`category: functional` `status: verified`

### 第三层：正式功能与约束

- [x] `R-020` 正式项目技术栈为 Vue 3（Composition API + `<script setup>` + TypeScript）+ vue-router 5（`createWebHistory`）。`category: delivery` `status: verified`
- [x] `R-021` `apps/web/src/features/<模块>/` 按 components / api / composables / Page.vue 组织，只能 import 第一、二层与自身；外壳与路由在应用层（`App.vue`、`router/index.ts`：`MENU` 即路由表，`import.meta.glob` 自动对上 `features/<key>/Page.vue`）；feature 之间禁止互相 import，`@/` 别名只给应用层；每个由原型转换的模块附 `DIFF.md` 差异清单。`category: maintainability` `status: verified`
- [x] `R-022` 同一 UI 模式在 features 内出现第二次时下沉为该模块业务组件，不复制。`category: maintainability` `status: verified`
- [x] `R-023` 项目根 `CLAUDE.md` 包含分层说明、硬性规则、原型规则、开发流程四节。`category: delivery` `status: verified`
- [ ] `R-024` ESLint（`eslint-plugin-vue` flat config）：`features/**` 禁止原生表单/表格元素（`vue/no-restricted-html-elements`）、inline style（`vue/no-static-inline-styles`）、Tailwind 任意值与布局类、非白名单 `El*` 组件；`ui/**` 禁止 import `features/*`。落地：根目录 `eslint.config.js` 一份配置覆盖 `apps/web/src` 与 `packages/design-system/ui`，白名单从 `whitelist.json` 读取（`vue/restricted-component-names`），另禁 `<style>` 块（`vue/no-restricted-block`）与 Tailwind 布局 / 间距 / 尺寸 / 定位 / 响应式前缀 / 任意值类（`vue/no-restricted-class`）。`category: quality` `status: verified`
- [x] `R-025` 使用 `eslint-plugin-boundaries`（v7 `boundaries/dependencies`，`checkAllOrigins` + `checkUnknownLocals`）强制单向依赖：feature → 自身 / vue / vue-router / element-plus / `@virtual/design-system`；app → feature / app；ui → ui / vue / element-plus；其余（跨 feature、feature → app、ui → feature、未登记的外部包）一律报错。`category: quality` `status: verified`
- [x] `R-026` `.husky/pre-commit` 跑 lint-staged：改动的 `apps/web/src` / `design-system/ui` 文件跑 ESLint（0 警告），改动第一、二层样式跑 `check-layer2`，改动原型跑 `check-prototype`；CI（GitHub Actions，Node 22 + pnpm）依次 lint → typecheck → build:ds 并校验 `dist/` 无 diff → check:prototype → build:web → 视觉回归 → 变异验证，失败时上传 `tests/visual/__output__`。`category: delivery` `status: verified`
- [x] `R-027` `tests/visual/compare.mjs`：自动起原型与正式页面两个 dev server（jsdelivr 依赖用本地 node_modules 顶替，离线可跑），对 `CASES` 里每个用例喂同一份 mock（`?dataset=`）、同一视口，只截 `.l-page` 内容区做 pixelmatch，差异 > 1%（`--threshold` 可调）即失败并输出 `__output__/<name>-{proto,web,diff}.png` 与差异清单；`PROTO_URL` / `WEB_URL` 可复用已起的服务；纳入 CI。`category: quality` `status: verified`
- [ ] `R-031` 工具链：Vite 8.x（Rolldown 打包）+ Tailwind CSS 4.x 通过 `@tailwindcss/vite` 插件接入，入口 CSS `@import "tailwindcss"`，Tailwind `@theme` 只引用 `tokens.css` 变量；关闭或隔离 Tailwind preflight 以免覆盖 Element Plus 样式；Node ≥ 20.19。落地：`tailwind.css` 只引 `theme.css` + `utilities.css`，`@theme` 先清空默认再映射 token（颜色 / 字号 / 字重 / 圆角 / 阴影）；根 `pnpm build:web` = vue-tsc + vite build。`category: delivery` `status: verified`

### Claude 插件

- [ ] `R-032` 提供可安装的 Claude 插件包（`plugin/`，含 `plugin.json` manifest、skills、commands），供产品与开发在 Claude Code / Cowork 中使用。`category: delivery` `status: ready`
- [ ] `R-033` 插件技能 `prototype`：输入自然语言需求，读取 `design-system/README.md` 与 `_template.html`，生成符合 R-016～R-018 的原型 HTML 到 `prototypes/`，并运行 `check-prototype.js` 自检。`category: functional` `status: ready`
- [ ] `R-034` 插件技能 `promote`：读取指定原型，把 DATA 转 `api.ts` 接口定义与 mock、state 转 composable、template 逐一映射为 features 页面，输出到 `apps/web/src/features/<名>/` 并生成"原型与实现差异清单"。`category: functional` `status: ready`
- [ ] `R-035` 插件技能 `layer-rules`：向 AI 注入三层规范（分层定义、硬性规则、白名单、冻结流程），作为 `prototype` 与 `promote` 的前置约束，也可单独调用检阅。`category: delivery` `status: ready`

### 第二层演进机制

- [x] `R-040` 三级偏差处理规则：原型或正式页面需要 Element Plus 默认之外的 UI 时，按 样式级（第二层皮肤 `skins/`）/ 结构级（第二层复合组件 `ui/composites/`）/ 行为级（第二层封装外部库或自研）归类处理，第三层永不写样式。消费时：优先复合组件；未命中但能用白名单原语 + `.l-*` 拼出的，就地拼装并在外层打 `data-composite="<候选名>"`；拼不出的用最接近的白名单组件占位并打 `data-placeholder="<需求名>"` 且写需求单。`check-prototype.js` 统计候选出现次数（≥2 提示下沉）、对占位发出警告，`--strict` 模式（promote 前）下占位为错误。`category: maintainability` `status: verified`
- [x] `R-041` 首批复合组件（结构级下沉范例）：`UiListItem`（头像 / 标题 / 副标题 / 状态与操作插槽）、`UiFilterBar`（筛选区 + 操作区 + 可选重置）、`UiStatCard`（标签 / 数值 / 单位 / 趋势 / 说明），位于 `ui/composites/`，只用白名单原语 + `.l-*` + token，登记白名单、README、展示页。精修（按画板「自研组件精修稿」）：UiStatCard 数值用 `--font-size-display`、趋势胶囊带箭头、右上角 `icon` 插槽、hover 抬升；UiListItem 头像 36、`active` 高亮、`divided` 分割线、clickable 箭头、状态胶囊；UiFilterBar 包在 subtle 圆角容器、默认插槽为「label + 控件」对（`.l-inline` + `<small>`），搜索（primary）/ 重置 / 高级搜索（`advanced`，浮窗见 `R-051`）按钮紧随其后，`summary` 与 `actions` 插槽在右，窄屏时先换行筛选项再把操作区落到下一行；UiPageHeader `breadcrumb` 插槽；UiState error 态图标 + 标题 + 描述、empty 态 `action` 插槽。`category: functional` `status: verified`
- [x] `R-043` 滚动统一：任何需要滚动的区域（外壳主区、侧栏、抽屉内容、列表容器、横向条）必须使用 Element Plus `ElScrollbar`，禁止在第二、三层写 `overflow: auto | scroll`（表格 / 虚拟列表 / 下拉等 Element Plus 内部已自带 ElScrollbar 的组件除外）；`el-scrollbar` 加入白名单；`check-prototype.js` 新增 `no-overflow-scroll` 规则；展示页侧栏、主区、无限滚动演示与 UiShell 全部改为 ElScrollbar。`category: ux` `status: verified`
- [x] `R-042` 皮肤层与需求单：`skins/` 目录存放按组件划分的样式级覆盖（只允许 `--el-<component>-*` 变量与 Element Plus BEM 类，值只引用 token），加载顺序固定为 element-plus → tokens → skins → layout → base（当前皮肤：table（表头 subtle 底 12/500、行 44 / 表头 40、外框圆角、hover accent、`.l-fill` 填充规则见 `R-050`）/ input / menu / tabs（`.is-tabbar` 胶囊页签条）/ tree（行高 32、当前节点 accent））；`requests/` 目录存放组件需求单（模板含：效果描述、偏差级别、涉及 token、建议组件名与 props、来源原型），由第二层治理者判定后实施。`category: maintainability` `status: verified`

### 页面排版模板

- [x] `R-044` 五套页面排版模板（参考用户本机 HY Compiler Studio「页面排版模板 · 五种多菜单业务布局效果」）：01 统计模板（统计卡行 → 趋势 / 分布 → 概况 → 进度）、02 纯表格页（面包屑 → 筛选条「label + 控件」含高级搜索展开区 → 表格（表头 40 / 行 44、状态圆胶囊、操作列固定右）→ 分页右对齐）、03 统计 + 表格、04 左树 + 表格（`.l-split--aside` 320：UiModuleHeader + 搜索 + ElTree `highlight-current`）、05 TabBar + 表格（`<el-tabs class="is-tabbar">` 胶囊页签条）。骨架只用 `.l-*` + 白名单 / 自研组件，间距全部来自 token；单一来源 `showcase.data.js` `TEMPLATES`；02～05 表格模板采用高度填充写法（`R-050`），01 统计模板保持自然流。展示页「布局配置」`#/templates` 是**索引页**：五张模板卡（编号 / 名称 / 说明 / 结构 pills / 复制骨架 / 复制完整模板 / 打开整页），hero 芯片显示 page / module / header / sidebar / collapsed 实时值；点「打开整页」进 `#/page/<key>`，**没有展示页外壳**，UiShell 撑满视口、尺寸全为真实值，浮动控制条提供 返回 / 上下一套 / 深浅 / 密度 / 调参 / 复制骨架，可按把手拖动到任意位置。原型开发第一步为选模板（CLAUDE.md §3）。`category: functional` `status: verified`

### 展示页面

- [x] `R-037` 展示页面从 `packages/design-system/` 目录直接产出（`showcase.html`，零构建，CDN + `dist/ui.iife.js` + `dist/tokens.js`），采用「方向 A · 文档站式」排版：顶栏路由页签（设计变量 / 组件物料 / 布局范式）+ 左侧分组锚点 + 内容限宽 + 右侧本页目录。设计变量页：功能色色卡网格、bg/text/border/icon 分列、间距作用域×关系阶梯尺（条宽取真实解析值）、字体样张、圆角/阴影/边框实物、布局尺寸；原始刻度与 `--el-*` 映射默认折叠。组件物料页：**Element Plus 全部组件**按官方分类（Basic / Form / Data / Navigation / Feedback / Others）逐一渲染，每张卡片含舞台区、白名单/需提议标记、驱动 token 注脚、复制用法；主题 / 密度 / 主色实时切换。**响应式**：内容流式限宽（设计变量 ≤1200、组件物料 ≤1560），卡片按 `auto-fill(minmax(440px, 1fr))` 自动分栏；≤1400 隐藏右目录，≤960 左锚点变为顶部横向滚动条，≤720 色卡/表格降列，≤560 顶栏精简；任何宽度无横向滚动。**自研组件页**（`#/custom/<组件 key>`，位于组件物料之后）：侧栏按 外壳 / 页面级 / 复合组件 分组列出全部组件，主区**一次只渲染选中的那一个**——舞台（真实渲染 + 结构标签，内容垂直居中）、「脱胎第一层」面板（该组件消费的 token 以「名称 | 控件 | 值」单行三列排布，外套 `ElScrollbar` 限高，滑块 / 取色只作用于本页舞台，可恢复默认）、Props / Slots / Events、用法与源码链接；窄屏面板落到舞台下方时 token 行自动多列。**布局范式页**示意块用中性槽位（surface 底 + `--color-border-default` 虚线），整卡统一灰画布、token 脚注并入同一块底。**布局配置页**见 `R-044`。`category: ux` `status: verified`

- [x] `R-052` 展示页全局调参面板：顶栏与整页控制条均可打开「调参」**浮窗**——按标题栏拖动、可收起为一条标题栏、可关闭，位置按浮窗实际高度钳在视口内，整体高度不超过视口（做成浮窗而不是抽屉，是为了调参时能看见被调的页面）；内容区用 `ElScrollbar` 承载，把第一层语义 token 全部变成可实时调整的控件——分组与条目由 `dist/tokens.json` 驱动，不手工维护清单；控件类型按**解析出来的值**判定（颜色→取色器、纯 px→滑块、其余→文本框），滑块区间必须包住当前值，远超常规区间的哨兵值（`--radius-full` 9999px）降级为文本框，避免 `el-slider` 钳值回吐造成无声改写；改动写在 `:root` 的 inline style 上，整站（含所有 Element Plus 组件，其圆角 / 边框经 `--el-*` 映射自 `--radius-*` / `--border-w` / `--color-border-*`）实时联动；支持关键词筛选、单项点值恢复、全部重置、「复制为 tokens.css」输出改动过的 `:root` 片段；顶栏主色取色器并入同一套覆盖机制；断点类 token 不进清单（媒体查询无法响应变量）。`category: ux` `status: verified`

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
| R-020 | `apps/web/package.json` 依赖 vue@3 / vue-router@5；源码为 `<script setup lang="ts">`；`vue-tsc` 通过 | 用户输入（Element Plus 隐含 Vue） | — | RV-001 | C-002 | F-006 |
| R-021 | `features/orders/{Page.vue,api.ts,composables/,components/,DIFF.md}` 存在；跨 feature / feature → app import 被 ESLint 拦截；`/orders` 路由由 MENU 自动生成 | 对话结论 | R-020 | RV-001 | C-002 | F-006 |
| R-022 | CLAUDE.md 含该规则 | 对话结论 | — | RV-001 | C-001 | F-006, F-007 |
| R-023 | CLAUDE.md 四节齐全 | 对话结论 | — | RV-001 | C-001 | F-007 |
| R-024 | 违规样例 `.vue`（裸 button / table、style=、`<style>`、`flex p-4 w-[200px]`、`<ElCarousel>`）lint 报 10 条错误；现有源码 0 错误 | 对话结论 | R-020 | RV-001 | C-010 | F-007 |
| R-025 | 样例：feature → 其他 feature、feature → app（相对与 `@/`）、ui → feature、feature → 未登记包（axios）全部报错 | 待确认提案 | R-021 | RV-001 | C-001 | F-007 |
| R-026 | lint-staged 配置覆盖四类文件；CI 工作流含 lint / typecheck / build:ds / dist 一致性 / check:prototype / build:web / test:visual / test:mutation 八步 | 对话结论 | R-024 | RV-001 | C-001 | F-007 |
| R-027 | `pnpm test:visual` 三个用例通过并生成截图；人工核对 pixelmatch 对 normal vs long 截图报 1.75%（阈值机制有效） | 对话结论 | R-016, R-034 | RV-001 | C-008 | F-008 |
| R-028 | 文档与 RV-002 基线逐节一致 | 用户输入 | — | RV-001 | C-011 | F-009 |
| R-029 | `dist/ui.iife.js` 可在原型 HTML 中直接注册组件；正式项目 import 同一源码 | 用户输入（Element Plus） | R-020 | RV-002 | C-003 | F-003, F-005 |
| R-030 | 修改 `--color-primary` 后 Element Plus 按钮主色随之变化 | 对话结论 | R-002 | RV-002 | C-005 | F-001, F-003 |
| R-031 | `vite@8`、`tailwindcss@4`、`@tailwindcss/vite` 安装；`pnpm build:web` 成功；Element Plus 组件样式未被 preflight 破坏 | 用户输入（最新 Vite/Tailwind） | R-020 | RV-002 | C-007 | F-006 |
| R-032 | 插件目录含合法 manifest；可通过 Claude Code 插件机制安装并列出技能 | 用户输入（Claude 插件） | — | RV-002 | C-008 | F-010 |
| R-033 | 对示例需求运行技能后生成原型且 check 脚本通过 | 用户输入 | R-016, R-019, R-032 | RV-002 | C-008 | F-010, F-005 |
| R-034 | 对示例原型运行后生成 features 模块与差异清单 | 用户输入 | R-021, R-032 | RV-002 | C-008 | F-010, F-008 |
| R-035 | 技能内容与 CLAUDE.md 规则一致（同源或引用） | 用户输入 | R-023, R-032 | RV-002 | C-008 | F-010, F-007 |
| R-037 | 双击打开即渲染；页面结构与画板「方向 A」一致（顶栏页签、左锚点、限宽、右目录）；设计变量数量 = tokens.json 语义计数；组件物料覆盖 Element Plus 官方组件清单且白名单标记与 whitelist.json 一致；切换 dark / compact / 主色后全部组件同步变化 | 用户输入（方向 A、全量 Element Plus） | R-011, R-029, R-030, R-038 | RV-003 | C-013 | F-011 |
| R-039 | tokens.css 默认加载 `--el-color-primary` = `#0076a3`；展示页与原型模板无需改动即呈现新配色；dark 模式下主按钮 / 文字对比可读 | 用户输入（参考 technology-cyan） | R-001, R-002, R-007 | RV-005 | C-016 | F-001 |
| R-043 | grep 第二层源码与展示页无 `overflow: auto/scroll`（Element Plus 内部除外）；展示页与原型页面 `document.scrollingElement.scrollHeight === clientHeight`（window 不滚）而 `.el-scrollbar__wrap` 可滚；check 脚本对含 `overflow:auto` 的原型报错 | 用户输入（滚动套用 Element Plus 滚动组件） | R-011, R-012 | RV-007 | C-021 | F-003, F-004, F-005, F-011 |
| R-047 | `node scripts/check-layer2.mjs` 对当前第二层 0 错误；人工在 UiStatCard 加 `padding: 2px` 后报错并退出码非零 | 用户输入（怎么保证第二层充分调动第一层） | R-001, R-003, R-042 | RV-013 | C-034 | F-003 |
| R-048 | `dist/token-coverage.json` 含 7 个自研组件的 token 列表；展示页配置卡 token 面板与该文件一致（UiStatCard 含 `--space-module-pad` via `.l-module`）；报告的「未消费」列表 ≤ 2 且逐项有说明 | 同上 | R-047, R-037 | RV-013 | C-034 | F-003, F-011 |
| R-049 | `pnpm test:mutation` 7 个组件全部通过（100 项 ok，6 项 KNOWN 例外各有原因）；首次运行抓到 2 个真问题并已修复 | 同上 | R-048, R-027 | RV-013 | C-034 | F-008 |
| R-046 | tokens.json `palettes` 长度 3；展示页切换预设后 `html[data-palette]` 变化、`--color-primary` 解析值随之变化且无 inline style；`data-palette` + `data-theme="dark"` 同时存在时主色取变体、中性色取深色 | 用户输入（半成品意图，选 2-A） | R-002, R-005, R-037 | RV-012 | C-033 | F-001, F-011 |
| R-045 | tokens.json 语义计数 78；展示页布局配置芯片显示 page 20 / module 16 / header 60 / sidebar 230 / collapsed 66；01 统计模板与画板「布局配置精修稿」结构一致 | 用户输入（参考 hy-compiler MaterialCenterPage） | R-003, R-005, R-007 | RV-011 | C-028, C-031 | F-001, F-002, F-004, F-011 |
| R-040 | CLAUDE.md 含四句消费规则；check 脚本对含 `data-composite` 的原型输出候选统计、对 `data-placeholder` 输出警告、`--strict` 下退出码非零 | 用户输入（原型 UI 不满足时怎么办） | R-015, R-019 | RV-006 | C-018 | F-003, F-005, F-007 |
| R-041 | 三个组件 `vue-tsc` 通过、IIFE 可注册、展示页「自研复合组件」渲染；源码无裸数值 / 裸色 / 手写 flex | 对话结论（范例） | R-040, R-029 | RV-006 | C-019 | F-003, F-011 |
| R-042 | `skins/index.css` 被原型模板、展示页与 README 引入顺序一致；`requests/_template.md` 存在并含全部字段 | 对话结论 | R-040 | RV-011 | C-020, C-031 | F-003, F-005 |
| R-044 | 五个页签各自渲染：01 含 4 张 UiStatCard，02～05 含表格与分页，04 含 ElTree，05 含 ElTabs；侧栏高亮与面包屑随模板切换；芯片值与 tokens 一致；`复制页面骨架` 得到的内容可放入 `_template.html` 的 `.l-page` 并通过 check | 用户输入（127.0.0.1:5173/#/materials/layout 五个菜单） | R-012, R-041, R-009 | RV-011 | C-026, C-030, C-032 | F-011, F-005 |
| R-038 | 直达 `#/<key>` 高亮对应菜单；点击菜单改 hash；后退恢复；原型模板 `#/reports` 高亮「报表」；十条路由（含 `#/custom/<key>`、`#/page/<key>`）循环无运行时报错，空 `<sub>` 落到首项并补全 hash | 用户输入（补充路由概念） | R-012, R-016 | RV-004 | C-014, C-038 | F-005, F-011, F-008 |
| R-050 | 1440×1200 下 `#/page/stat-table`：页面高 = 外壳内容区高，模块 / 表格逐层吃满，分页贴底且无外层滚动；压到 420 高时表体 `clientHeight < scrollHeight`（内滚生效）且仍无外层滚动；不加 `--fill` 的 01 统计页仍为外层滚动；`el-table` 全程不传 `height`；**且 1920 宽下 `.l-page` 宽度必须等于外壳内容区宽度**（填充链不得反过来压缩宽度，见 C-042） | 用户输入（表格高度应受父级限制、默认占满） | R-009, R-012, R-042, R-043 | RV-016 | C-040 | F-001, F-002, F-003, F-004, F-005, F-006 |
| R-052 | 打开抽屉不碰任何控件时 `:root` 的 inline style 必须为空、「已改」计数为 0（钳值回写会当场暴露）；浮窗可按标题栏拖动、收起为 183×34 的标题栏、展开复原 420×735，拖到底部仍整体在视口内；82 行控件（85 语义 token 去掉 3 个断点 / 密度）含 41 滑块 / 24 取色器 / 17 文本框；改 `--radius-lg` 与 `--border-w` 后模块圆角 12→13、边框 1→2，改 `--radius-md` 后 Element Plus 输入框圆角 6→18；滑块推到上限后控件形态与区间**不得变化**（形态与区间只由首次覆盖时冻结的基线值决定）；值格可直接打字改精确值、清空即恢复默认；复制得到只含改动项的 `:root` 片段；全部重置后 inline 清空且视觉复原 | 用户输入（控制项应更丰富） | R-037, R-030 | RV-016 | C-043 | F-011 |
| R-051 | 点开高级搜索前后，筛选条 / 表格 / 页面高度三项数值完全相同；浮窗渲染在 body（teleport）且含全部展开项；无 `#advanced` 插槽时仍只触发 `toggle` | 用户输入（高级搜索激活应该是浮窗 不影响高度） | R-041 | RV-016 | C-040 | F-003, F-005, F-011 |

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
| F-002 | 布局与基础样式层（layout.css、base.css） | active | R-009, R-010, R-050 |
| F-003 | 基础组件层（Element Plus 白名单 + 自研组件 + 皮肤层） | active | R-011, R-014, R-015, R-029, R-040～R-042 |
| F-004 | 页面外壳组件（UiShell） | active | R-012 |
| F-005 | 原型工作流（prototypes/、模板、检查脚本） | active | R-016～R-019 |
| F-006 | 正式功能开发层（Vue 3 + Vite 8 + Tailwind 4） | active | R-020～R-022, R-031 |
| F-007 | AI 约束机制（CLAUDE.md、ESLint、依赖检查、hooks/CI） | active | R-023～R-026 |
| F-008 | 原型→正式转换视觉回归与第二层变异验证 | active | R-027, R-049 |
| F-009 | 项目文档（doc/） | active | R-028 |
| F-010 | Claude 插件（prototype / promote / layer-rules 技能） | planned | R-032～R-035 |
| F-011 | 设计系统展示页（变量 + 物料） | active | R-037 |

## 当前迭代

### IT-016 · 展示页整页化与高度填充布局

- 目标：展示页从「文档里的缩略预览」变成「能整屏打开的真实页面」；补上表格页最缺的能力——页面撑满、表格随父级高度流动、表体内滚、分页贴底；高级搜索不再挤压表格
- 范围：`tokens.css`（content-max）、`layout.css`（填充三件套）、`ui/UiShell.vue`、`ui/UiState.vue`、`ui/composites/UiFilterBar.vue`、`skins/table.css`、`scripts/check-layer2.mjs`、`showcase.html`、`showcase.data.js`、`apps/prototypes/_template.html`、`apps/web/src/features/orders/Page.vue`、`tests/visual/mutate.mjs`、README / CLAUDE.md §2；git commit（第一二层与第三层回填分两次提交）
- 包含变更：`C-037`、`C-038`、`C-039`、`C-040`、`C-041`、`C-042`、`C-043`、`C-044`、`C-045`
- 对应需求版本：`RV-016`
- 退出条件：R-050 / R-051 verified；R-005 / R-009 / R-037 / R-038 / R-041 / R-042 / R-044 / R-048 / R-049 重新 verified；八项门禁全绿；代码已提交

### IT-015 · 第二步 C + D：门禁、视觉回归、变异验证（已完成）

- 目标：提交与 CI 自动拦截违规；原型 → 正式一比一有像素差数字；第二层声明的 token 有变异测试证明真在用
- 范围：`.husky/pre-commit`、`.github/workflows/ci.yml`、根 `package.json`（husky / lint-staged / playwright / pixelmatch / pngjs、test:* 脚本）、`tests/visual/{_lib,compare,mutate}.mjs`、`.gitignore`；顺带修 `showcase.html` 滑块钳值、`UiShell.vue` 折叠按钮色、`check-layer2.mjs` `.l-*` 归因收窄；CLAUDE.md §5 §6、设计说明 §3 §8 §10；git commit
- 包含变更：`C-036`
- 对应需求版本：`RV-015`
- 退出条件：R-026 / R-027 / R-049 verified；代码已提交

### IT-014 · 第二步 A：apps/web 与 ESLint 三层约束（已完成）

- 目标：正式项目工具链落地；ESLint 把 CLAUDE.md §2 与依赖方向变成硬约束；用 `_template.html` → `features/orders` 跑通一次原型转正式
- 范围：`apps/web/**`（新）、根 `eslint.config.js`（新）、根 `package.json`、`packages/design-system/package.json`（exports 加 `./skins/*`）、CLAUDE.md §4 §6、设计说明 §3 §7 §10；git commit
- 包含变更：`C-035`
- 对应需求版本：`RV-014`
- 退出条件：R-020 / R-021 / R-024 / R-025 / R-031 verified；代码已提交

### IT-013 · 第二层 token 约束与覆盖度（已完成）

- 目标：第二层"充分消费第一层"从约定变成检查；修掉现有 15 处裸值；配置卡 token 列表改为扫描生成
- 范围：`scripts/check-layer2.mjs`（新）、`tokens.css`、`skins/{menu,tree,tabs}.css`、`ui/UiShell.vue`、`ui/UiState.vue`、`ui/composites/{UiFilterBar,UiStatCard,UiListItem}.vue`、`showcase.data.js`、`showcase.html`、`package.json`、README / CLAUDE.md / 说明文档；git commit
- 包含变更：`C-034`
- 对应需求版本：`RV-013`
- 退出条件：R-047 / R-048 verified；R-049 ready；代码已提交

### IT-012 · 调色板变体进第一层（已完成）

- 目标：配色预设成为第一层真值（⑤ 段），展示页改为切换 `data-palette`；清理仓库杂项（`Claude outputs/` 入 .gitignore）
- 范围：`tokens.css`、`scripts/build-tokens.mjs`、`showcase.html`、`showcase.data.js`、`.gitignore`、README / CLAUDE.md / 说明文档；git commit
- 包含变更：`C-033`
- 对应需求版本：`RV-012`
- 退出条件：R-046 verified；R-037 重新 verified；代码已提交

### IT-011 · 02～05 模板精修与皮肤补齐（已完成）

- 目标：五套模板中 02～05 按画板精修稿落地；第一层补表格行高 / 表头高 token；皮肤层补 tabs / tree；UiFilterBar 改为 label + 控件写法
- 范围：`tokens.css`、`skins/{table,tabs,tree,index}.css`、`ui/composites/UiFilterBar.vue`、`showcase.data.js`、README / CLAUDE.md / 说明文档；git commit
- 包含变更：`C-031`、`C-032`
- 对应需求版本：`RV-011`
- 退出条件：R-042 / R-045 / R-044 / R-041 重新 verified；代码已提交

### IT-010 · 布局配置精修与第一层调校（已完成）

- 目标：布局配置五套模板达到参考站审美；第一层间距 / 尺寸 / 圆角 / 字号 / canvas 底色对齐参考；新增 UiModuleHeader
- 范围：`tokens.css`、`layout.css`、`ui/UiShell.vue`、`ui/composites/UiStatCard.vue`、`ui/composites/UiModuleHeader.vue`、`showcase.data.js`、README / CLAUDE.md / 说明文档；git commit
- 包含变更：`C-028`、`C-029`、`C-030`
- 对应需求版本：`RV-010`
- 退出条件：R-045 verified；R-041 / R-044 重新 verified；代码已提交

## 当前变更

### C-037 · 展示页三页视觉重排

- 类型：`modify`
- 原因：用户「自研组件、布局范式、布局配置呈现效果太丑」
- 之前：配置卡高度被右侧 token 滑块列表绑架（`UiStatCard` 卡片 1661px 而组件本身仅 130px，`UiState` 组件 22px / 面板 669px，七张卡累计约 7800px）；布局范式示意块用 accent 蓝虚线，语义上像「选中态」，每卡三条等权横带；布局配置外围是手搓的 `.ds-tpl__tabs` 灰底方块页签（`skins/tabs.css` 的 `.is-tabbar` 反而没用上）、mono 小 chips 像调试输出、底部三条不相干带子堆叠
- 之后：token 面板改「名称 | 控件 | 值」单行三列并套 `ElScrollbar` 限高（累计 7800px → 4946px，−36%），舞台内容垂直居中；示意块换中性槽位、整卡统一灰画布；页签换成自带的 `is-tabbar` 皮肤，chips 去药丸底，脚注去卡片壳
- 关联需求：`R-037`
- 覆盖关系：—
- 影响功能：`F-011 direct`

### C-038 · 去重叠：自研组件单组件详情 + 布局配置整页路由

- 类型：`modify`
- 原因：用户认为「自研组件和布局配置有点重叠」，提出去掉自研组件；确认变异靶场耦合后改为保留并重构，并选定模板以「独立整页路由」呈现
- 之前：自研组件七张大卡纵向堆叠在 `#/custom` 一页；布局配置把模板塞进 720px 高的预览框，是「缩略图」不是页面；hash 路由只有一段
- 之后：hash 路由扩展为 `#/<route>/<sub>`；自研组件改 `#/custom/<组件 key>` 单组件详情（侧栏分组选择）；布局配置 `#/templates` 变五张索引卡，`#/page/<模板 key>` 整页渲染且无展示页外壳，浮动控制条承载 返回 / 切换 / 深浅 / 密度 / 复制骨架；`mutate.mjs` 靶场随之改为逐组件切路由（新增 `keyOf`）。职责分清：自研组件 = 单组件形态与接口，布局配置 = 整页排版
- 关联需求：`R-037`、`R-038`、`R-044`、`R-049`
- 覆盖关系：—
- 影响功能：`F-011 direct`、`F-008 direct`、`F-005 indirect`

### C-039 · 内容区取消限宽

- 类型：`modify`
- 原因：整页渲染后用户发现主体伸展不开；实测 1920 视口下内容区 1690px 而 `.l-page` 被 `--layout-content-max` 卡在 1440px 居中，左右各空 125px。旧预览框只有约 980px 宽，从未顶到上限，问题一直被掩盖
- 之前：`--layout-content-max: 1440px`
- 之后：`none`（用户在 取消上限 / 提高上限 / 新增 fluid 变体 三选一中选取消）。token 保留，改回具体值即可恢复限宽
- 关联需求：`R-005`
- 覆盖关系：—
- 影响功能：`F-001 direct`、`F-002 direct`、`F-005 / F-006 / F-011 indirect`

### C-040 · 高度填充布局与高级搜索浮窗

- 类型：`add`
- 原因：用户「页面应该是被表格撑满才对，表格的高度是流动的」「表格应该是受限于父级最终的高度，在不声明高度的情况下应该是默认占满，这个应该是改下布局，新增变体类」「高级搜索激活应该是浮窗 不影响高度」
- 之前：第一层没有任何「填满高度」的能力，`.l-page` 是普通流式容器（1440×1200 下页面仅 543px，下方约 600px 空画布）；高级搜索由第三层用 `v-if` + `.l-cluster` 在筛选条下方展开，会把表格推下去
- 之后：R-050 / R-051。实施中发现两处链路缺口并补齐：百分比 `min-height` 需父级**确定高度**才生效（`UiShell` 滚动视图从 `min-height: 100%` 改为 `height: 100%` 的纵向 flex，「能否被压缩」交给 `min-height` 区分），以及 `UiState` 的包裹 div 会断开填充链（加 `.ui-state.l-fill`）；表体保底一行 `--layout-row-h`。原型模板与 `features/orders` 同步切到填充写法（两边同改，视觉回归仍 0.00%）；副作用：四态下页面高度不再跳动
- 关联需求：`R-050`、`R-051`、`R-009`、`R-012`、`R-041`、`R-042`
- 覆盖关系：—
- 影响功能：`F-001 direct`、`F-002 direct`、`F-003 direct`、`F-004 direct`、`F-005 direct`、`F-006 direct`

### C-045 · 第一层与模板用户验收，六条 implemented 转 verified

- 类型：`implement`
- 原因：用户「我对现在的第一层配置和模板都能接受」
- 之前：`R-004` / `R-009` / `R-010` / `R-011` / `R-017` / `R-029` 停在 `implemented`，各自的验收备注都是「待第二步」——第三层 lint、apps/web 引用第一层、ESLint 读白名单、与正式页面等宽比对、正式项目 import 第二层
- 之后：六条全部 `verified`。阻塞条件已被第二步 A / C / D 消除并有证据：`apps/web/src/main.ts` 依次引入 tokens / skins / layout / base 与 `@virtual/design-system`（E-24）；`eslint.config.js` 从 `whitelist.json` 生成白名单并拦截第三层 inline style 与 `<style>`（E-24）；原型与正式页面同视口像素差 0.00%（E-25）。至此 50 条需求中 46 条 verified，仅剩第二步 B 的 4 条 `ready`
- 关联需求：`R-004`、`R-009`、`R-010`、`R-011`、`R-017`、`R-029`
- 覆盖关系：—
- 影响功能：`F-001 verification_only`、`F-002 verification_only`、`F-003 verification_only`、`F-005 verification_only`

### C-044 · 调参面板值格可输入、控件不再变形；控制条可拖动

- 类型：`implementation_correction`
- 原因：用户反馈「滑块拉满之后变成输入框了，但是我又不能直接修改它」「五个模板左下角那个固定返回和统计模板我又无法拖动」
- 之前：① `rangeOf` 用**当前值**算上限（`max(hi, cur × 1.5)`），拖近上限时区间跟着长，越过 `hi × 3` 阈值后 `kindOf` 把滑块换成输入框；② 那个输入框是 `el-input` 单向 `:model-value`，Element Plus 每次重渲染都把 `props.modelValue` 写回原生 input，打字立刻被弹回，等于只读；③ 整页控制条 `.ds-fab` 固定在左下角，不可移动
- 之后：① 新增**基线值**概念——首次覆盖时冻结该 token 的原值，`kindOf` 与 `rangeOf` 只看基线，控件形态与滑块区间在调整过程中恒定不变（圆角上限同时由 32 放宽到 48）；② 值格统一换成可输入的 `el-input` 并引入本地草稿（`draft` + `commitDraft`），滑块 / 取色器降为快捷方式，精确值直接打字、清空即恢复默认，颜色值经 `shortColor` 归一为 `#rrggbb`；③ 拖动逻辑抽成 `DRAG` 配置 + `dragStart(e, key)`，浮窗与控制条共用，控制条加把手图标、按下控件不触发拖动、按实际尺寸钳在视口内
- 关联需求：`R-052`、`R-044`
- 覆盖关系：修正 `C-043` 的实现，不改变 `R-052` 的语义
- 影响功能：`F-011 direct`

### C-043 · 展示页全局调参面板

- 类型：`add`
- 原因：用户「控制深浅、密度、主题色这块应该更加丰富，模块的圆角 / 边框 / 阴影、模块之间的间距、所有 Element Plus 组件的圆角和边框都应该可以自由控制」
- 之前：顶栏只有 深浅 / 密度三档 / 配色预设 / 主色取色器四个开关；能改单个 token 的地方只有自研组件配置卡，且只作用于那一张卡的舞台
- 之后：R-052。实施中复现了 `C-036` 记录过的同一类缺陷并做了通用修复——抽屉一渲染，`el-slider` 就把越界的 `model-value` 钳住回吐，`@input` 当成用户编辑写进覆盖表，**未经任何操作就无声改写了 4 个 token**（`--radius-full` 9999→32、`--layout-control-w` 200→120、`--breakpoint-md` 768→480、`--breakpoint-lg` 1200→480）。修法不再是单点排除，而是：区间恒包住当前值、哨兵值降级文本框、写入前比对同值。另外核实 small 尺寸的 Element Plus 组件走 `--radius-sm` 而非 `--radius-md`，面板提示文案据此改写
- 面板形态：初版做成 `ElDrawer`，用户指出「变成可以缩小的那种拖动浮窗」后改为可拖动 / 可收起的浮窗——抽屉会遮住正在被调的页面
- 顺带修复：浮窗里给图标写了自闭合的自定义标签（`<Rank />` 等 9 处），in-DOM 模板下整个 `#app` 编译失败、Vue 未挂载（CLAUDE.md §3 已有此规则，是我违反）。全部显式闭合后控制台归零。注意这与之前记在「待确认」里的 `compiler-30` 不是一回事：`HEAD~2` 版本自闭合标签数为 0 却同样报错，那条仍未定位
- 关联需求：`R-052`、`R-037`、`R-030`、`R-046`
- 覆盖关系：—
- 影响功能：`F-011 direct`、`F-001 indirect`

### C-042 · 修复填充链把页面收成 max-content 宽

- 类型：`implementation_correction`
- 原因：C-040 把 `UiShell` 滚动视图改成 `display: flex` 以承载填充链，结果 1920 视口下 `.l-page` 只有 1075px 并居中（内容区 1690px），`--layout-content-max: none` 形同虚设——**弹性布局中交叉轴的 auto 外边距会压过 `align-items: stretch`**，`.l-page` 的 `margin-inline: auto`（原本只在 max-width 生效时才居中）把页面收缩成 max-content 宽。C-039 的效果被自己后一条变更抵消
- 之前：`.ui-shell__view { height: 100%; display: flex; flex-direction: column }` + `.l-page--fill { flex: 1 1 auto; min-height: 0 }`
- 之后：视图保持**块级**只给确定高度 `height: 100%`；`.l-page--fill` 改用 `height: 100%` 自己建立纵向 flex 上下文。确定高度同样能让表格收缩内滚，且不再干扰任何 `.l-page` 的宽度
- 关联需求：`R-050`、`R-005`、`R-012`
- 覆盖关系：修正 `C-040` 的实现，不改变 `R-050` 的语义
- 影响功能：`F-002 direct`、`F-004 direct`、`F-005 / F-006 / F-011 indirect`

### C-041 · dist 产物可复现（键排序 + 去掉生成时间）

- 类型：`implementation_correction`
- 原因：重建 dist 时 `token-coverage.json` 产生 194 行纯乱序 diff（内容逐项相同、仅键序不同）；提交时又发现两个生成脚本都写入 `generatedAt: new Date().toISOString()`，意味着 CI 第四步 `git diff --exit-code -- packages/design-system/dist` **每次构建都必然失败**——该门禁自 C-036 加入以来实际从未真正通过
- 之前：`files` / `components` 键序来自目录遍历（跨运行、跨平台不稳定）；`dist/tokens.json(.js)`、`dist/token-coverage.json(.js)` 每次构建都带新时间戳
- 之后：写出前按名字排序；两个脚本均不再写 `generatedAt`。验证：连续两次 `build:ds` 后 `git diff --exit-code -- packages/design-system/dist` 返回 0。本次提交内 coverage 文件的大 diff 是一次性重排
- 关联需求：`R-048`、`R-026`
- 覆盖关系：—
- 影响功能：`F-003 direct`、`F-007 direct`

### C-036 · 第二步 C + D：门禁、视觉回归、变异验证

- 类型：`implement`
- 原因：用户「继续」，按 C → D → B 顺序推进
- 之前：R-026 / R-027 / R-049 为 ready；`.l-*` 间接归因把后代规则（`.l-cluster > .el-input`）的 token 也算给组件，导致变异测试大量误报
- 之后：R-026 / R-027 / R-049；`check-layer2` 只认选择器即类本身的规则；变异测试暴露并修复两个真问题——展示页 el-slider 把 `--radius-full` 9999px 钳成 32 回写为 tweak 无声覆盖舞台（`tokenKind` 不再给它滑块）、UiShell 折叠按钮 `--color-icon-default` 被 `.el-button` 文字色盖住（改为同时设 `--el-button-text-color`）
- 关联需求：`R-026`、`R-027`、`R-049`、`R-037`、`R-012`
- 覆盖关系：—
- 影响功能：`F-007 direct`、`F-008 direct`、`F-011 indirect`、`F-004 indirect`

### C-035 · 第二步 A：apps/web 工具链、ESLint 三层约束、首个正式页面

- 类型：`implement`
- 原因：用户确认第一步验收通过，授权第二步 A（目录结构与依赖清单已确认；默认：路由从菜单生成、不引 Pinia）
- 之前：R-020 / R-021 / R-024 / R-025 / R-031 为 ready；ESLint 规则只有文字描述
- 之后：`apps/web` 可 dev / build；根 `eslint.config.js` 一份覆盖第二、三层；`features/orders` 由原型转换并附 DIFF.md；同视口截图与原型像素差 0.17%（差异均为原型专有元素）；R-021 澄清应用层 / 模块隔离 / `@/` 用法；R-024 澄清规则清单与白名单来源
- 关联需求：`R-020`、`R-021`、`R-024`、`R-025`、`R-031`
- 覆盖关系：—
- 影响功能：`F-006 direct`、`F-007 direct`、`F-003 indirect`（design-system exports 加 `./skins/*`）

### C-034 · 第二层 token 约束与覆盖度

- 类型：`add`
- 原因：用户提问"第二层自由伸展时怎么保证充分调动第一层"；扫描发现现有第二层 15 处裸值 / 原始刻度，配置卡手填的 token 列表全部与源码不符
- 之前：第二层只靠 README 约定；`CUSTOM[].tokens` 手写
- 之后：R-047 / R-048 / R-049；新增 5 个尺寸 token；`--el-color-danger-dark-2` 映射到 `--color-danger-hover`；UiListItem 箭头用 `--color-icon-muted`；剩余未消费 `--layout-content-pad`（`--space-page-pad-x` 的别名，无人用）与 `--border-w-thick`（预留粗边框）保留待定
- 关联需求：`R-047`、`R-048`、`R-049`、`R-005`、`R-037`
- 覆盖关系：—
- 影响功能：`F-003 direct`、`F-001 direct`、`F-011 direct`

### C-033 · 调色板变体进第一层

- 类型：`add`
- 原因：仓库中存在未提交的半成品（展示页切 `data-palette`、build-tokens 识别旋钮），其依赖的 tokens.css 段落缺失；用户选择 2-A（变体段，不做 oklch 旋钮派生）
- 之前：`PRESETS.vars` 在展示页运行时用 inline style 覆盖语义 token，仅预览、原型不可用
- 之后：R-046；`PRESETS` 只留 key / label；`build-tokens.mjs` 不做旋钮分组，改为抽取 `palettes`；变体补 `--color-bg-canvas`（原预览缺该值）
- 关联需求：`R-046`、`R-037`
- 覆盖关系：—
- 影响功能：`F-001 direct`、`F-011 direct`、`F-005 indirect`

### C-031 · 表格 / 页签 / 树皮肤与行高 token

- 类型：`modify`
- 原因：画板「布局配置精修稿 · 02～05」批注：表格行高 44 / 表头 40、状态胶囊、TabBar 胶囊页签条、树当前节点 accent
- 之前：表格行高沿用 Element Plus 默认；皮肤只有 table / input / menu；页签用 Element Plus 默认下划线样式
- 之后：`--layout-row-h` 44 / `--layout-thead-h` 40 进第一层；`skins/table.css` 重写（表头 subtle 底 12/500、外框圆角、hover accent）；新增 `skins/tabs.css`（`.is-tabbar`）、`skins/tree.css`
- 关联需求：`R-042`、`R-045`
- 覆盖关系：—
- 影响功能：`F-001 direct`、`F-003 direct`、`F-011 / F-005 indirect`

### C-032 · 02～05 模板重排与 UiFilterBar 改版

- 类型：`modify`
- 原因：同上画板；参考站 PuiSearch 筛选条为「标签 + 控件」+ 搜索 / 重置 / 高级搜索
- 之前：UiFilterBar 只有控件与文字链接重置；02～05 表格模块无操作列、分页居左；05 用默认 ElTabs
- 之后：UiFilterBar 新增 `searchable` / `advanced` 与 `search` / `toggle` 事件、label + 控件写法、窄屏换行策略；`TABLE_MODULE` 加高级搜索展开区、序号 / 操作列、分页右对齐；04 左树面板 UiModuleHeader + 搜索 + `highlight-current`；05 页签加 `is-tabbar`
- 关联需求：`R-044`、`R-041`
- 覆盖关系：—
- 影响功能：`F-003 direct`、`F-011 direct`、`F-005 indirect`

### C-028 · 第一层默认值对齐参考站

- 类型：`add`
- 原因：用户认为布局配置间距不符合审美，指定参考 hy-compiler MaterialCenterPage；读取其 `style.css` 的 `--hy-space-*` 与 LayoutTemplateShowcase 的模块结构
- 之前：page-pad 32/24、module 24/24、header 56、sidebar 240/64、radius 3/6/10、display 28，无 canvas 底
- 之后：R-045
- 关联需求：`R-045`
- 覆盖关系：—
- 影响功能：`F-001 direct`、`F-002 direct`、`F-004 direct`（UiShell 用 canvas 底）、`F-005 / F-011 indirect`

### C-029 · UiModuleHeader 与 UiStatCard 重构

- 类型：`modify`
- 原因：五套模板每个模块共用"标题 + 描述 + meta"结构（结构级下沉）；统计卡按参考站改为右上趋势胶囊
- 之前：模板内手写 `.l-module-header`；StatCard 趋势在数值下方、带箭头、icon 在右上
- 之后：新增 `UiModuleHeader`；StatCard 趋势胶囊置右上（不传 upIsGood 用主色，传了用语义色；给 icon 插槽时趋势下移），数值 display 24、说明 micro 10
- 关联需求：`R-041`
- 覆盖关系：—
- 影响功能：`F-003 direct`、`F-011 indirect`

### C-030 · 五套模板按精修稿重排

- 类型：`modify`
- 原因：画板「布局配置精修稿（01 统计模板）」已确认
- 之前：模板用 UiPageHeader 大标题、`.l-grid--cols-2` 均分、进度条模拟柱图
- 之后：面包屑行（无大标题）、分析区 `.l-grid--main-aside` 1.3fr / 0.7fr、柱图用 `.l-bars`、概况项用 `.l-tile`、左树用 `.l-split--aside`；R-040 澄清：`:style` 仅允许绑定数据驱动尺寸
- 关联需求：`R-044`、`R-040`
- 覆盖关系：—
- 影响功能：`F-011 direct`、`F-005 indirect`

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
| C-023 | F-011 | direct | 新路由与配置卡 | 路由、配置面板联动、恢复默认 |
| C-024 | F-003, F-004 | direct | 组件外观精修 | typecheck / build / 展示页渲染 |
| C-024 | F-005 | indirect | 原型模板外观随之变化 | 模板渲染 |
| C-025 | F-001, F-003 | direct | 新 token 与皮肤 | tokens.json 计数 75；菜单高亮 |
| C-026 | F-011, F-005 | direct | 新页面与原型起步方式 | 五模板渲染；骨架可复制 |
| C-028 | F-001, F-002, F-004 | direct | 默认值与新类 | tokens 计数、UiShell 底色 |
| C-029 | F-003 | direct | 新组件与重构 | typecheck / build / 展示页 |
| C-030 | F-011 | direct | 模板重排 | 五套渲染、与画板核对 |
| C-031 | F-001, F-003 | direct | 新 token 与皮肤 | tokens 计数 80；表格行高 / 页签 / 树渲染 |
| C-032 | F-003, F-011 | direct | 组件 API 与模板 | typecheck / build / 五套渲染 |
| C-033 | F-001, F-011 | direct | 新段落与预设机制 | palettes 3；切换验证 |
| C-034 | F-001, F-003, F-011 | direct | 检查脚本、新 token、配置卡数据源 | check-layer2 0 错误；build 通过；配置卡联动 |
| C-035 | F-006, F-007 | direct | 新工程与 lint 约束 | lint / typecheck / build；违规样例被拦；截图对比 |
| C-036 | F-007, F-008 | direct | 门禁与测试基建 | test:visual 0.00%；test:mutation 全过；CI 工作流 |
| C-037 | F-011 | direct | 展示页三页排版重排 | 卡片高度实测；浅深 / 紧凑 / 1024 窄屏核对 |
| C-038 | F-011, F-008 | direct | 路由形态与页面结构改变 | 十条路由循环无报错；深链与后退；靶场逐组件切换后变异全过 |
| C-039 | F-001, F-002 | direct | 第一层 token 值改变 | 1920 下 `.l-page` 宽 = 内容区宽；无横向滚动 |
| C-040 | F-001, F-002, F-003, F-004, F-005, F-006 | direct | 新增布局能力与组件行为 | 逐层高度实测；矮视口内滚；浮窗前后高度不变；视觉回归 0.00% |
| C-041 | F-003, F-007 | direct | 构建产物确定性 | 连续两次生成一致；`git diff --exit-code -- dist` 返回 0 |
| C-045 | F-001, F-002, F-003, F-005 | verification_only | 六条需求转 verified | main.ts 引入链、ESLint 白名单、像素差 0.00% |
| C-044 | F-011 | direct | 调参控件形态与浮层交互 | 拉满不变形；打字不被弹回；控制条可拖 |
| C-043 | F-011 | direct | 展示页新增全局调参能力 | 空开抽屉零写入；三类控件联动；复制与重置闭环 |
| C-042 | F-002, F-004 | direct | 外壳滚动视图的格式化上下文 | 1920 下 `.l-page` 宽 = 内容区宽；矮视口表体仍内滚；非填充页仍外滚 |
| C-027 | F-011 | direct | 页签顺序与命名 | 路由 |

## 实现映射

| 需求 | 文件/符号/配置/测试 | 状态 | 证据 |
|---|---|---|---|
| R-001～R-008, R-030, R-039 | `packages/design-system/tokens.css`（① 原始刻度 ② 语义 ③ `html:root` Element Plus 映射 ④ `[data-theme="dark"]`） | verified | E-01, E-02, E-13 |
| R-009 | `packages/design-system/layout.css` | verified | E-01, E-24（apps/web main.ts 已引入） |
| R-010 | `packages/design-system/base.css` | verified | 同上 |
| R-011, R-014 | `packages/design-system/README.md`、`whitelist.json` | verified | E-03, E-24（eslint.config.js 读 whitelist.json） |
| R-012, R-029 | `packages/design-system/ui/UiShell.vue`、`ui/index.ts`、`vite.lib.config.ts` → `dist/ui.iife.js` + `dist/ui.css` | verified | E-02, E-04, E-24（apps/web import @virtual/design-system） |
| R-043 | `CLAUDE.md` §2 滚动规则、`whitelist.json`（el-scrollbar）、`scripts/check-prototype.js`（no-overflow-scroll）、`ui/UiShell.vue`（侧栏 / 主区 ElScrollbar，expose scrollTo / wrapEl）、`showcase.html`（.ds-side / .ds-scroll）、`showcase.data.js`（Affix / Backtop / InfiniteScroll / Scrollbar 演示） | verified | E-17 |
| R-040 | `CLAUDE.md` §2.1、`scripts/check-prototype.js`（composites / placeholders / --strict）、`README.md` 三级偏差表 | verified | E-14 |
| R-041 | `ui/composites/UiListItem.vue`、`UiFilterBar.vue`、`UiStatCard.vue`、`ui/index.ts`、`whitelist.json` custom、`showcase.data.js` CUSTOM | verified | E-15, E-21 |
| R-042 | `skins/index.css`、`skins/{table,input,menu,tabs,tree}.css`、`requests/_template.md`、`requests/README.md`；模板与展示页加载顺序 | verified | E-16, E-21 |
| R-047, R-048 | `scripts/check-layer2.mjs`、`dist/token-coverage.js(.json)`、`tokens.css`（5 个尺寸 token）、`skins/*`、`ui/*`、`showcase.data.js`（CUSTOM.tokens 由 DS_COVERAGE 注入）、`package.json` | verified | E-23 |
| R-049 | `tests/visual/mutate.mjs`、`tests/visual/_lib.mjs` | verified | E-25 |
| R-046 | `tokens.css` ⑤ 段、`scripts/build-tokens.mjs`（palettes）、`showcase.html`（applyPreset）、`showcase.data.js`（PRESETS） | verified | E-22 |
| R-004 | `ui/UiShell.vue`、`ui/UiPageHeader.vue`、`ui/UiState.vue` 内边距全部引用 token | verified | E-03, E-24（第三层 lint 已拦 inline style / `<style>`） |
| R-015, R-022, R-023 | `CLAUDE.md` §1～§6 | verified | E-05 |
| R-016～R-018 | `apps/prototypes/_template.html` | verified | E-02, E-06, E-25（与正式页面像素差 0.00%） |
| R-019 | `scripts/check-prototype.js` | verified | E-07 |
| R-028 | `doc/frontend-layered-design.md`（RV-002 版本，§1～§10） | verified | E-08 |
| R-020, R-021, R-031 | `apps/web/{package.json,vite.config.ts,tsconfig.json,index.html}`、`src/{main.ts,App.vue,tailwind.css,router/index.ts}`、`src/features/orders/*`；根 `package.json`（dev:web / build:web / lint / typecheck） | verified | E-24 |
| R-024, R-025 | 根 `eslint.config.js`（vue 规则 + boundaries/dependencies） | verified | E-24 |
| R-026 | `.husky/pre-commit`、根 `package.json`（lint-staged / prepare / test:*）、`.github/workflows/ci.yml` | verified | E-25 |
| R-027 | `tests/visual/compare.mjs`、`tests/visual/_lib.mjs`、`.gitignore`（`__output__`） | verified | E-25 |
| R-032～R-035 | `packages/claude-plugin/.claude-plugin/plugin.json`、`skills/{prototype,promote,layer-rules}/SKILL.md` | planned（第二步） | — |
| R-037 | `packages/design-system/showcase.html`、`scripts/build-tokens.mjs`、`dist/tokens.js`(.json)、`package.json` build 脚本 | verified | E-09, E-26 |
| R-052 | `showcase.html`（TUNER_GROUPS / kindOf / rangeOf / onSlide / setOverride 等 + 调参抽屉 + 顶栏与 FAB 入口） | verified | E-31 |
| R-050 | `layout.css`（`.l-page--fill` / `.l-fill` / `.l-module.l-fill`）、`ui/UiShell.vue`（`view-class="ui-shell__view"` + `height: 100%` 纵向 flex）、`ui/UiState.vue`（`.ui-state.l-fill`）、`skins/table.css`（`.el-table.l-fill`）、`showcase.data.js`（`TABLE_MODULE` / `pageClass`）、`apps/prototypes/_template.html`、`apps/web/src/features/orders/Page.vue`、README「高度填充」、CLAUDE.md §2 | verified | E-28 |
| R-051 | `ui/composites/UiFilterBar.vue`（`ElPopover` + `#advanced` 插槽 + `.ui-filter-bar__adv`）、`showcase.data.js`（CUSTOM 与 `TABLE_MODULE`）、README UiFilterBar 节、CLAUDE.md §2 | verified | E-28 |
| R-038（两段式） | `showcase.html`（`parseHash` / `go(key, sub)` / `defaultSub` / `syncAnchor`） | verified | E-26 |
| R-048（键排序） | `scripts/check-layer2.mjs`（`sortedEntries`） | verified | E-29 |

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
- `D-016` 「布局配置」= 五套页面排版模板（参考 HY Compiler Studio `#/materials/layout` 五个菜单），自研组件配置卡改为「自研组件」页签，顺序 设计变量 / 组件物料 / 自研组件 / 布局范式 / 布局配置（用户要求，2026-09-03）。
- `D-017` 展示页「自研组件」与「布局配置」职责分开：前者是**单组件**的形态与接口（一次只渲染一个，`#/custom/<key>`），后者是**整页排版**（`#/page/<key>` 无外壳整屏渲染）。用户原本提出删掉自研组件页，确认它是变异测试（R-049）唯一靶场后改为保留并重构（用户决定，2026-09-05）。
- `D-018` 业务后台内容区默认铺满，不设最大宽（`--layout-content-max: none`）。备选方案「提高上限到 1760」与「新增 `.l-page--fill` 之外的 fluid 变体」被否决（用户选定，2026-09-05）。代价：超宽屏上纯文本页面行长偏长，需要时改回具体值。
- `D-019` 高度填充做成**变体类**而非 `.l-page` 默认行为：表格页显式加 `--fill`，统计 / 表单等多模块页面保持自然流，避免「页面滚」被强制变成「表内滚」后难以退回（用户选定，2026-09-05）。
- `D-015` 自研组件配置卡（原「布局配置」页签，后由 D-016 改名为「自研组件」）；配置卡设计与组件精修以画板「方向 A · 自研组件（配置卡）」「自研组件精修稿」为准（用户确认，2026-09-03）。
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
| 第二步 B 实施授权：Claude 插件（唯一未开工项） | R-032～R-035 | 是否进入下一迭代 |
| 展示页控制台既有 `compiler-30` 报错与两条 404 未定位（`git show HEAD` 版本同样存在，105 个字符串模板逐个 `Vue.compile` 均通过，非本轮引入） | R-037 | 不影响渲染与门禁，待单独排查 |
| 超宽屏（24 寸以上）纯文本页面行长偏长（`--layout-content-max: none` 的代价） | R-005 | 需要时改回具体值 |

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
| E-18 | R-037（布局配置）, R-041, R-012, R-007, R-042 | `vue-tsc` 通过、`pnpm build` 产出（tokens 75 语义）；Playwright `#/custom`：页签顺序 设计变量 / 组件物料 / 布局范式 / 布局配置，6 张配置卡、25 个滑块、13 个取色器，锚点 外壳 1 / 页面级 2 / 复合组件 3；UiStatCard 卡片调 `--space-module-pad` 滑块后舞台内 padding 24→32px、数值高亮，恢复默认后回 24px；组件物料页自研一节改为跳转卡；无 JS 错误。截图 `doc/showcase-config.png`。画板新增「自研组件（配置卡）」与「自研组件精修稿」两块 | pass | 2026-09-03 |
| E-19 | R-044, R-037 | Playwright `#/templates`：页签 设计变量 / 组件物料 / 自研组件 / 布局范式 / 布局配置；五个模板按钮与左锚点一致；01 → 4 张 UiStatCard + 4 个分析 / 概况 / 进度模块；02 表格 3 行 + 分页；03 统计 4 + 表格；04 ElTree 7 节点 + 表格；05 ElTabs 4 项（环境监测激活）+ 表格；侧栏高亮与面包屑随模板切换（企业档案 / 运行监测 / 组织与片区 / 环境监测）；芯片 page 32px / module 24px / header 56px / sidebar 240px / collapsed 64px；无 JS 错误。顺带修复：ElPagination layout 含 sizes 时须 v-model:page-size 否则不渲染（README 已注明）。截图 `doc/showcase-templates-01.png`、`showcase-templates-04.png` | pass | 2026-09-03 |
| E-20 | R-045, R-041, R-044 | 读取参考 `style.css`（`--hy-space-control 8 / content 12 / module-inner 16 / module 16 / page 20 / section 24`、`--hy-surface-muted #f3f5f5`）与 LayoutTemplateShowcase 模板结构；`vue-tsc` 通过、`pnpm build` 78 语义 token；Playwright `#/templates`：芯片 page 20px / module 16px / header 60px / sidebar 230px / collapsed 66px，01 统计模板渲染 4 张统计卡 + 2×2 分析区（柱图 7 柱、分布 4 条、概况 4 格、进度 4 条），02～05 表格 / 树 / 页签渲染正常，无 JS 错误；与画板「布局配置精修稿」逐块对照一致。截图 `doc/showcase-templates-01.png`、`-04.png` | pass | 2026-09-03 |
| E-21 | R-042, R-045, R-044, R-041 | `vue-tsc` 通过、`pnpm build` 80 语义 token；Playwright `#/templates`：02～05 表格 3 行 + 分页、04 ElTree 7 节点（当前节点 accent）、05 `.is-tabbar` 4 项；筛选条「label + 控件」+ 搜索 / 重置 / 高级搜索渲染，窄栏（04）下筛选项先换行、操作区落到下一行；无 JS 错误；与画板「布局配置精修稿 · 02～05」逐块对照一致。截图 `doc/showcase-templates-02.png`、`-04.png`、`-05.png` | pass | 2026-09-03 |
| E-22 | R-046, R-037 | `pnpm build` 输出 palettes 3；Playwright 通过右上角下拉依次切换 Element 蓝 / 靛蓝 / 靛紫 / 科技青：`html[data-palette]` 与 `--color-primary` 解析值（#409eff / #4c6fff / #6d5dfc / #0076a3）、`--color-bg-canvas`、`--color-text-default` 均随之变化，html 无 inline style；靛蓝 + 深色：主色 #4c6fff、canvas #131f25、文字 #e3edf0；无 JS 错误 | pass | 2026-09-03 |
| E-25 | R-026, R-027, R-049, R-037, R-012 | `pnpm test:visual`：orders-normal / orders-long / orders-narrow 差异均 0.00%（截 `.l-page`，1440 与 1024 宽）；pixelmatch 灵敏度核对：normal vs long 截图 1.75%；`pnpm test:mutation`：7 组件 100 项 ok、6 项 KNOWN（各有原因）、0 未消费——首次运行 22 项未消费，经收窄 `.l-*` 归因（后代规则不归因）、PREP 切 error / hover 态、修复滑块钳值与折叠按钮色后归零；`pnpm build:ds` check-layer2 0 错误；lint-staged / CI 配置就绪（容器内无 git，pre-commit 钩子待用户本机首次 `pnpm install` 后由 `prepare` 安装） | pass | 2026-09-03 |
| E-24 | R-020, R-021, R-024, R-025, R-031 | `pnpm install` 后 `pnpm lint`（0 错误 0 警告）、`pnpm typecheck`、`pnpm build:web`（vue-tsc + vite build 通过，单 chunk 1.0 MB 为全量 Element Plus，待按需引入）；违规样例 Page.vue 报 10 条 vue 规则错误，boundaries 样例报 4 条（跨 feature、feature → app 相对 / `@/`、未登记包 axios）+ ui → feature 1 条；Playwright 1440×900：`/orders` 3 行 / 标题 / 分页 / 侧栏高亮与原型 `_template.html#/orders` 一致，`?dataset=long` 1 行，筛选无结果进 empty 态，新建对话框可开，window 不滚动；与原型截图像素差 0.17%（仅顶栏三态选择器与禁用菜单）；截图 `doc/web-orders.png`、`doc/web-vs-prototype.png` | pass | 2026-09-03 |
| E-23 | R-047, R-048, R-037 | 首次扫描：14 错误（13px×2、22/28/40px 图标、32px 树、40px 菜单项、2px×2、`--space-3/2`）+ 登记不符 7 条；修复后 `check-layer2` 0 错误 1 警告（未消费 2：`--layout-content-pad`、`--border-w-thick`），语义 token 85 个中第二层消费 69、仅 EP 映射 9；`vue-tsc` / `pnpm build` 通过；Playwright `#/custom`：7 张配置卡、36 滑块 / 35 取色器（数量由扫描结果决定），UiStatCard 调 `--space-module-pad` 16→24 舞台联动、恢复后回 16；`#/templates` 五套无 JS 错误 | pass | 2026-09-03 |
| E-26 | R-037, R-038, R-044 | 配置卡高度实测：七张卡 7783px → 4946px（−36%），`UiStatCard` 1661 → 796，106 个 token 名仅 1 个截断（带 title 提示）；浅色 / 深色 / 紧凑 / 1024 窄屏（面板落下方自动多列）逐一核对；新标签页十条路由（`#/tokens`、`#/materials`、`#/custom`、`#/layout`、`#/templates`、`#/page/{stat,table,stat-table,tree-table,tabs-table}`）循环无运行时报错；`#/custom` 空 sub 落到 UiShell、`#/page` 空 sub 落到 01、`#/custom/ui-filter-bar` 深链命中、`history.back()` 恢复；整页视图侧栏 230 / 顶栏 60 为真实值，window 不滚；控制条上下一套切换 `#/page/table` 与返回 `#/templates`（5 张卡）均正常。附带确认：控制台 `compiler-30` 与两条 404 在 `git show HEAD` 版本上同样存在，为既有问题 | pass | 2026-09-05 |
| E-27 | R-005 | 1920 视口 `#/page/stat`：外壳 1920 → 侧栏 230 → 内容区 1690px，改前 `.l-page` 被 max-width 卡在 1440 居中（左右各空 125px），改后 x=230 / w=1690 铺满、`max-width: none`、无横向滚动；原型模板同样生效（同一份 `layout.css`） | pass | 2026-09-05 |
| E-28 | R-050, R-051, R-009, R-041, R-042 | 1440×1200 `#/page/stat-table`：视图 1140 → 页面 1140 → 模块 920 → 表格 774 → 表体 732，表头 40 固定、分页 32 贴底、无外层滚动；1280×420 `#/page/table`：页面恰好 360、无外层滚动、表体 client 45 / scroll 132（**内滚生效**）、分页仍在视野内；1280×500 `#/page/stat`（不加 `--fill`）：视图 440 / 页面 817 / 外层可滚、滚动条存在——两种模式并存；04 左树穿过 `.l-split` 栅格：split 757、树面板与表格模块同为 757、表格 567；原型模板 1440×900：视图 840 → 页面 840 → 模块 707 → UiState 625 → 表格 593，且 loading / empty / error / ready 四态高度恒定（825→840 不再跳动）。浮窗：点开前后 筛选条 56 / 表格 611 / 页面 840 三项**完全相同**，浮窗 289×109、白底 + 边框 + 阴影、z-index 2011、含 2 个展开项；`el-table` 全程未传 `height` | pass | 2026-09-05 |
| E-29 | R-048, R-049, R-026, R-027 | `check-layer2` 输出键排序后与改前内容逐项等价（脚本比对 `equal: true`）；再去掉两个生成脚本的 `generatedAt` 后，连续两次 `build:ds` 之间 `git diff --exit-code -- packages/design-system/dist` 返回 0——CI 第四步此前因时间戳每次必失败，现已可过；八项门禁全绿——`lint` / `typecheck` 0 错误，`build:ds` 0 错误 1 条既有警告（未消费 2），`check:prototype` 通过，`test:visual` 三用例均 0.00%，`test:mutation` 7 组件全过。变异测试抓到真信号：新增的 `--space-module-pad` / `--space-module-gap` 在 UiFilterBar 上观察不到，核实为 `ElPopover` teleport 到 body 不在快照范围 + `.l-stack` 基类被 `--tight` 覆盖（与 UiListItem 已有例外同因），写入 `KNOWN` 并注明原因，未放宽断言 | pass | 2026-09-05 |
| E-30 | R-050, R-005, R-012 | 用户发现宽屏两侧又出现留白。复现：1920×1000 `#/page/stat-table` 下 `--layout-content-max` 与 `max-width` 均解析为 `none`，但 `.l-page` 仅 x=538 / w=1075（内容区 1690）——`.ui-shell__view` 的 `display: flex` 让 `.l-page` 的 `margin-inline: auto` 在交叉轴压过 `stretch`，收缩成 max-content 宽。视图改回块级 + `.l-page--fill` 自带 `height: 100%` 后三种情形同时成立：1920×1000 填充页 `.l-page` x=230 / w=1690 / h=940 = 视图，模块 720 / 表格 574 / 分页贴底 / 无外层滚动；1280×420 表体 client 45 vs scroll 132（内滚生效）、分页仍在视野；1920×500 非填充页 `.l-page` w=1690 / h=817、视图 440、外层可滚且滚动条存在；原型模板 1920 下同样 w=1690、表格 1616 | pass | 2026-09-05 |
| E-31 | R-052, R-037 | 新标签页打开抽屉、不做任何操作：`:root` inline style 为空、计数 0（修复前会被 el-slider 钳值回写成 4 项）；分组 颜色24 / 间距13 / 圆角4 / 边框2 / 阴影3 / 字体13 / 布局尺寸20 / 层级5，共 82 行 = 41 滑块 + 24 取色器 + 17 文本框，`--radius-full` 为文本框；`#/page/table` 整页视图经 FAB 打开抽屉同样可用，键盘步进 `--radius-lg` / `--border-w` 后模块 borderRadius 12→13px、borderTopWidth 1→2px、计数 2；`--radius-md` 6→18px 时 Element Plus 输入框圆角同步 6→18px（small 按钮走 `--radius-sm`，已在提示文案中写明）；复制输出 `:root {  --radius-lg: 13px;  --border-w: 2px; }`；全部重置后 inline 清空、模块复原 12px/1px、计数归零；新标签页无控制台报错。二轮修正后复验：`--radius-lg` 打字 30px 全程不被弹回、提交后模块圆角 30px 且控件仍是滑块（上限稳定在 48）；`--radius-full` 设为 20px 后仍是文本框（基线冻结在 9999px）；清空输入框即恢复默认（inline 移除、圆角回 12px）；`--space-module-gap` 用 End 推到上限 64px 控件不变形；`--color-primary` 打字 `#c2410c` 后截图确认搜索按钮 / 高级搜索链接 / 侧栏选中项 / 面板按钮全部转为橙色（注：自动化的 getComputedStyle 读数会滞后，以截图为准）；整页控制条按把手从 (20,893) 拖到 (440,333) | pass | 2026-09-05 |
| E-08 | R-028 | `doc/frontend-layered-design.md` §1～§10 与 RV-002 逐节核对；IT-003 同步 §3 目录树与 §9 展示页（RV-003）；IT-004 同步 §6 路由与 §9 方向 A（RV-004）：Vue 3 + Element Plus、Vite 8 + Tailwind 4、monorepo 目录、CDN 原型形态、插件三技能、展示页面、实施状态 | pass | 2026-09-02 |

## 历史索引

| RV | IT | 变更 | 类型 | 需求 | 前后摘要 | 影响功能 |
|---|---|---|---|---|---|---|
| RV-008 | IT-008 | C-023 | modify | R-037 | 自研组件独立页签 + 配置卡 | F-011 |
| RV-016 | IT-016 | C-037 | modify | R-037 | 三页排版重排；配置卡累计高度 −36% | F-011 |
| RV-016 | IT-016 | C-038 | modify | R-037, R-038, R-044, R-049 | 缩略预览 → 单组件详情 + 整页路由；hash 扩展为两段式 | F-011, F-008 |
| RV-016 | IT-016 | C-039 | modify | R-005 | `--layout-content-max` 1440px → none | F-001, F-002 |
| RV-016 | IT-016 | C-040 | add | R-050, R-051, R-009, R-041, R-042 | 无 → 高度填充布局与高级搜索浮窗 | F-001～F-006 |
| RV-016 | IT-016 | C-041 | implementation_correction | R-048, R-026 | dist 可复现：键排序 + 去掉生成时间 | F-003, F-007 |
| RV-016 | IT-016 | C-045 | implement | R-004, R-009, R-010, R-011, R-017, R-029 | implemented → verified（用户验收 + 第二步阻塞已清） | F-001, F-002, F-003, F-005 |
| RV-016 | IT-016 | C-044 | implementation_correction | R-052, R-044 | 值格可输入、控件不变形、控制条可拖 | F-011 |
| RV-016 | IT-016 | C-043 | add | R-052, R-037 | 四个开关 → 覆盖 82 个 token 的调参面板 | F-011 |
| RV-016 | IT-016 | C-042 | implementation_correction | R-050, R-005, R-012 | 外壳视图改回块级，修复填充链把页面收成 max-content 宽 | F-002, F-004 |
| RV-015 | IT-015 | C-036 | implement | R-026, R-027, R-049, R-037, R-012 | ready → verified；两处缺陷修复 | F-007, F-008 |
| RV-014 | IT-014 | C-035 | implement | R-020, R-021, R-024, R-025, R-031 | ready → verified；R-021 / R-024 澄清 | F-006, F-007 |
| RV-013 | IT-013 | C-034 | add | R-047, R-048, R-049, R-005, R-037 | 无 → 第二层约束 / 覆盖度 / 变异验证 | F-001, F-003, F-011 |
| RV-012 | IT-012 | C-033 | add | R-046, R-037 | 无 → [data-palette] 变体段 | F-001, F-011 |
| RV-011 | IT-011 | C-031 | modify | R-042, R-045 | 行高 token；tabs / tree 皮肤 | F-001, F-003 |
| RV-011 | IT-011 | C-032 | modify | R-044, R-041 | 02～05 模板与 UiFilterBar 改版 | F-003, F-011 |
| RV-008 | IT-008 | C-024 | modify | R-041, R-012 | 组件按精修稿美化 | F-003, F-004 |
| RV-008 | IT-008 | C-025 | modify | R-007, R-042 | +display 字号、menu 皮肤 | F-001, F-003 |
| RV-007 | IT-007 | C-021 | add | R-043 | 无 → 滚动统一 ElScrollbar | F-003, F-005, F-007, F-011 |
| RV-007 | IT-007 | C-022 | modify | R-012 | window 滚动 → UiShell 内滚 | F-004 |
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
