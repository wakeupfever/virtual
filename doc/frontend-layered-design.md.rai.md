---
rai-schema-version: 2
task: "前端三层分层设计需求基线"
task-key: "frontend-layered-design"
primary-target: "doc/frontend-layered-design.md"
requirement-version: "RV-022"
iteration: "IT-022"
current-changes:
  - "C-055"
status: "active"
updated: "2026-09-05"
---

# 前端三层分层设计需求基线 · 需求台账

## 快速摘要

- 当前需求版本：`RV-022`
- 当前工作迭代：`IT-022`
- 当前变更：`C-055` 重新生成验证：新增 `incidents.html`、修复骨架不可粘贴（add R-057）
- 本轮目标：用一次真正的**重新生成**验证「修的是规则还是原型」——从模板起步造一个全新原型，看此前的修复是自动继承还是要重来一遍
- 上一轮结论：**IT-018 完成**（R-053 / R-054 verified；R-005 / R-007 / R-012 / R-042 / R-048 重新 verified）。**分步进度：第一步、第二步 A / B / C / D 全部交付**；52 条需求现为 51 verified / 1 implemented，唯一未闭环的是 `R-034`——`promote` 技能已就位，`apps/prototypes/alarms.html` 这个真实业务原型也已存在，缺的是**拿它跑一次 promote**。历史迭代结论见「当前迭代」与「历史索引」两节
- 上一轮结论：**IT-019 完成**（`R-055` verified）。`pnpm check:ledger` 已进 lint-staged 与 CI（第五步），CI 由八步扩为九步
- 上一轮结论：**IT-020 完成**（`R-012` 澄清后重新 verified）
- 上一轮结论：**IT-021 完成**（`R-056` verified）
- 当前结论：**IT-022 完成**（`R-057` verified）。55 条需求 = 54 verified + 1 implemented。重新生成实验结论见 `C-055`：第一、二层的修复全部自动继承，规则类靠 check 拦住，而**生成源自身有缺陷**（骨架含 13 处 inline style / 7 处非白名单标签 / 大量自闭合，照抄必被拦），已修复并加机械门禁

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

- [x] `R-050` 高度填充布局：表格页可让页面撑满外壳内容区、表格由父级剩余高度决定自身高度、表头固定、表体在 Element Plus 自带 `ElScrollbar` 内滚（承 `R-043`）、分页贴底，**不给 `el-table` 传 `height` / `max-height`**。第一层加 `.l-page--fill` / `.l-fill` / `.l-module.l-fill`（见 `R-009`）；第二层配套：`UiShell` 的 `ElScrollbar` 用 `view-class="ui-shell__view"` 置为**确定高度**的纵向 flex（百分比 `min-height` 需要父级确定高度才生效，这是链路成立的前提），`UiState` 加 `.ui-state.l-fill` 纵向排布（否则填充链断在它的包裹 div），`skins/table.css` 加 `.el-table.l-fill` 让表格填充并保底一行 `--layout-row-h`。不加 `--fill` 的页面行为不变：`.l-page` 的 `min-height` 为 auto 不会被压缩，内容更高照常由外壳内滚。第三层写法 `.l-page--fill` + 承载模块 `.l-fill` + `<el-table class="l-fill">`。填充态下 `UiState` 的空 / 错误态在剩余高度里**垂直居中**（`margin-block: auto`），loading 的骨架屏保持顶对齐（它模拟的是内容）。`category: ux` `status: verified`
- [x] `R-051` 高级搜索用浮窗承载：`UiFilterBar` 新增 `#advanced` 插槽，内部用 `ElPopover`（`popper-class="ui-filter-bar__adv"`，值只引用 token）弹出，展开**不改变**筛选条与页面高度，下方表格不被推下去；`@toggle(open)` 带出展开状态；不给 `#advanced` 插槽时退化为纯文字链接并只 `emit('toggle')`，向后兼容。`ElPopover` 只在第二层内部使用，不进第三层白名单。`category: ux` `status: verified`

### 第二层：基础组件与外壳

- [x] `R-011` 第二层由两部分构成：Element Plus 允许使用的组件白名单（初始：ElButton、ElInput、ElSelect、ElCheckbox、ElSwitch、ElForm/ElFormItem、ElTable、ElDialog、ElDrawer、ElMessage/ElNotification、ElTabs、ElPagination），以及自研复合组件清单（仅限 Element Plus 未覆盖的外壳与页面级组件）；两份清单均写入 README。`category: maintainability` `status: verified`
- [x] `R-012` 外壳组件 `UiShell` 实现侧边栏折叠、路由高亮、响应式抽屉，所有尺寸取自 `--layout-*`，自身不写数值；外壳固定为视口高，侧栏与主内容区各自在 `ElScrollbar` 内滚动，页面（window）不滚动；顶栏带品牌色块。侧栏菜单经 `skins/menu.css` 呈现：顶层选中为浅灰底 + 主色竖线；**内置图标画在同一光学网格上**（可见范围 x/y ∈ [4, 20]、中心 (12, 12)），分组标题、菜单图标字形与顶栏汉堡图标字形左边缘同列（菜单图标中线与顶栏汉堡图标中线同列）；折叠态图标中线落在轨道中线；**子菜单层级用竖导轨表达**（第一条导轨对齐顶层图标中线，一级子项文字落在父项标签起点，更深层每级只多缩进一个 `--space-component-gap`，层数不限），子项行高 `--layout-control-h`，选中时点亮该行那截导轨；折叠态飞出的子菜单经 `popper-class="ui-shell__popper"` 接管，与展开态同一套观感。徽标（`badge`）保留为可选能力，默认不用。`category: functional` `status: verified`
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
- [x] `R-024` ESLint（`eslint-plugin-vue` flat config）：`features/**` 禁止原生表单/表格元素（`vue/no-restricted-html-elements`）、inline style（`vue/no-static-inline-styles`）、Tailwind 任意值与布局类、非白名单 `El*` 组件；`ui/**` 禁止 import `features/*`。落地：根目录 `eslint.config.js` 一份配置覆盖 `apps/web/src` 与 `packages/design-system/ui`，白名单从 `whitelist.json` 读取（`vue/restricted-component-names`），另禁 `<style>` 块（`vue/no-restricted-block`）与 Tailwind 布局 / 间距 / 尺寸 / 定位 / 响应式前缀 / 任意值类（`vue/no-restricted-class`）。`category: quality` `status: verified`
- [x] `R-025` 使用 `eslint-plugin-boundaries`（v7 `boundaries/dependencies`，`checkAllOrigins` + `checkUnknownLocals`）强制单向依赖：feature → 自身 / vue / vue-router / element-plus / `@virtual/design-system`；app → feature / app；ui → ui / vue / element-plus；其余（跨 feature、feature → app、ui → feature、未登记的外部包）一律报错。`category: quality` `status: verified`
- [x] `R-026` `.husky/pre-commit` 跑 lint-staged：改动的 `apps/web/src` / `design-system/ui` 文件跑 ESLint（0 警告），改动第一、二层样式跑 `check-layer2`，改动原型跑 `check-prototype`；CI（GitHub Actions，Node 22 + pnpm）依次 lint → typecheck → build:ds 并校验 `dist/` 无 diff → check:prototype → check:ledger → build:web → 视觉回归 → 变异验证（九步），失败时上传 `tests/visual/__output__`。`category: delivery` `status: verified`
- [x] `R-055` 台账一致性由脚本机械校验（`scripts/check-ledger.mjs`）：头部 `requirement-version` / `iteration` 与摘要一致、`current-changes` 每条在正文有 `### C-xxx` 条目、`iteration` 在正文有小节、勾选框与 `status` 一致（仅 verified 打勾）、`status` 取值在允许集合内、R / E / C 编号不重复、每条需求至少被「功能清单」某个 F 覆盖、每个变更条目都进「历史索引」、变更条目字段（类型 / 关联需求 / 影响功能）齐全。校验只判定能机械判定的结构，不判断需求内容对错；接入 lint-staged（改台账即跑）与 CI 第五步。`category: quality` `status: verified`
- [x] `R-027` `tests/visual/compare.mjs`：自动起原型与正式页面两个 dev server（jsdelivr 依赖用本地 node_modules 顶替，离线可跑），对 `CASES` 里每个用例喂同一份 mock（`?dataset=`）、同一视口，只截 `.l-page` 内容区做 pixelmatch，差异 > 1%（`--threshold` 可调）即失败并输出 `__output__/<name>-{proto,web,diff}.png` 与差异清单；`PROTO_URL` / `WEB_URL` 可复用已起的服务；纳入 CI。`category: quality` `status: verified`
- [x] `R-031` 工具链：Vite 8.x（Rolldown 打包）+ Tailwind CSS 4.x 通过 `@tailwindcss/vite` 插件接入，入口 CSS `@import "tailwindcss"`，Tailwind `@theme` 只引用 `tokens.css` 变量；关闭或隔离 Tailwind preflight 以免覆盖 Element Plus 样式；Node ≥ 20.19。落地：`tailwind.css` 只引 `theme.css` + `utilities.css`，`@theme` 先清空默认再映射 token（颜色 / 字号 / 字重 / 圆角 / 阴影）；根 `pnpm build:web` = vue-tsc + vite build。`category: delivery` `status: verified`

### Claude 插件

- [x] `R-032` 提供可安装的 Claude 插件包（`packages/claude-plugin/`，含 `.claude-plugin/plugin.json` manifest 与 `skills/`），供产品与开发在 Claude Code / Cowork 中使用；仓库根放 `.claude-plugin/marketplace.json`，本仓库自身即插件市场，`/plugin marketplace add <仓库路径>` 后安装。**澄清**：当前 Claude Code 里技能本身就是 slash 命令（`/virtual:<skill>`），不再另建 `commands/` 目录，避免同一入口维护两份定义。`category: delivery` `status: verified`
- [x] `R-033` 插件技能 `prototype`：输入自然语言需求，读取 `design-system/README.md` 与 `_template.html`，生成符合 R-016～R-018 的原型 HTML 到 `prototypes/`，并运行 `check-prototype.js` 自检。`category: functional` `status: verified`
- [ ] `R-034` 插件技能 `promote`：读取指定原型，把 DATA 转 `api.ts` 接口定义与 mock、state 转 composable、template 逐一映射为 features 页面，输出到 `apps/web/src/features/<名>/` 并生成"原型与实现差异清单"。`category: functional` `status: implemented`
- [x] `R-035` 插件技能 `layer-rules`：向 AI 注入三层规范（分层定义、硬性规则、白名单、冻结流程），作为 `prototype` 与 `promote` 的前置约束，也可单独调用检阅。`category: delivery` `status: verified`

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

- [x] `R-053` 需求文档里有菜单或路由时，原型必须有可切换的路由：一级导航原样搬进 `DATA.menu`（含对应需求章节号），按 `state.route` 分支渲染，本轮未实现的菜单渲染明确占位（`ui-state` empty + 章节号），不允许点了没反应或所有菜单停在同一页面。`category: functional` `status: verified`
- [x] `R-056` 表格操作列规范：列上写 `class-name="is-actions"`，`skins/table.css` 让单元格按不换行的一行排布、间距取 `--space-component-gap`；**行内动作最多 2 个**（「详情 / 查看」+ 一个状态相关动作），其余动作放进详情抽屉或弹窗；按钮用 `link type="primary" size="small"`。`check-prototype.js` 新增 `actions-column` 规则：缺 `is-actions` 或按钮多于 2 个即报错（`v-else` / `v-else-if` 是同一位置的分支，不重复计数）。原型模板、五套页面模板与 `apps/web` 正式页同步。`category: ux` `status: verified`
- [x] `R-057` 展示页「布局配置」的五套骨架必须是**可直接粘进原型的合法内容**：显式闭合自定义标签、无 inline style、只用白名单标签——CLAUDE.md §3 让原型从「复制页面骨架」起步，骨架自己违规就等于规则骗人。`check-prototype.js` 默认扫描时一并校验骨架（沙箱执行 `showcase.data.js` 取 `TEMPLATES[].skeleton`，套用与原型完全相同的 RULES 与白名单）；`el-progress` / `el-tree` 属已登记的白名单缺口，按 PENDING 显式提示而不是静默放行。`category: quality` `status: verified`
- [x] `R-054` 调参面板下沉为第二层组件 `UiTuner`：原型（第三层）禁止 `<style>` 与 inline style，调参面板必须有自己的样式，只能住在允许写样式的第二层；展示页与任意原型均以 `<ui-tuner>` 接入，token 清单由 `dist/tokens.js` 驱动（页面需引入该脚本）。`category: ux` `status: verified`

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
| R-012 | UiShell 尺寸全部为 `var(--layout-*)`；折叠/高亮/抽屉可操作；菜单图标 `getBBox()` 均为 cx≈12 / x≈4；一级子项文字 x 与父项标签 x 相同、每深一级只多缩进 `--space-component-gap`；折叠态飞出层行高与展开态子项一致 | 用户输入 | R-005 | RV-001 | C-052 | F-004 |
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
| R-057 | 骨架扫描 0 错误；人为把某套骨架改回自闭合或加 inline style 后 `check:prototype` 报 `skeleton [编号 名称] …` 并非零退出；PENDING 白名单缺口以警告列出且指向台账阻塞项 | 用户输入（是否构成重新生成、修的是原型还是规则） | R-019, R-044, R-053 | RV-022 | C-055 | F-005, F-007, F-011 |
| R-056 | 三个文字按钮的操作列在 176px 列宽下折成两行（改前实测单元格高 > 行高）；改后单元格单行、行高恒为 `--layout-row-h`；`check-prototype.js` 对 3 个按钮或缺 `is-actions` 的操作列报错并非零退出 | 用户输入（操作按钮这里需要修改下） | R-019, R-042, R-044 | RV-021 | C-053 | F-003, F-005, F-007 |
| R-055 | `node scripts/check-ledger.mjs` 对当前台账 0 错误、退出码 0；注入人为故障（把 verified 需求取消勾选、头部 iteration 改成正文没有的编号、从功能清单删掉一条需求编号）后逐条命中并退出码非零 | 用户输入（当前会话任何修改都需要同步到台账） | R-023, R-026 | RV-019 | C-051 | F-007 |
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
| F-001 | 设计 token 层（tokens.css，含 Element Plus 主题映射） | active | R-001～R-008, R-030, R-039, R-045, R-046 |
| F-002 | 布局与基础样式层（layout.css、base.css） | active | R-009, R-010, R-050 |
| F-003 | 基础组件层（Element Plus 白名单 + 自研组件 + 皮肤层） | active | R-011, R-014, R-015, R-029, R-040～R-043, R-047, R-048, R-051, R-054 |
| F-004 | 页面外壳组件（UiShell / UiShellMenu） | active | R-012, R-043, R-050 |
| F-005 | 原型工作流（prototypes/、模板、检查脚本） | active | R-016～R-019, R-053, R-056, R-057 |
| F-006 | 正式功能开发层（Vue 3 + Vite 8 + Tailwind 4） | active | R-020～R-022, R-031 |
| F-007 | AI 约束机制（CLAUDE.md、ESLint、依赖检查、hooks/CI、台账一致性检查） | active | R-023～R-026, R-055 |
| F-008 | 原型→正式转换视觉回归与第二层变异验证 | active | R-027, R-049 |
| F-009 | 项目文档（doc/） | active | R-028 |
| F-010 | Claude 插件（prototype / promote / layer-rules 技能） | active | R-032～R-035 |
| F-011 | 设计系统展示页（变量 + 物料 + 整页模板 + 调参） | active | R-037, R-038, R-044, R-052 |

## 当前迭代

### IT-022 · 重新生成验证：修的是规则还是原型

- 目标：用户问「现在是否构成重新生成，验证以上问题是你修复的还是修复规则」——不靠嘴说，从 `_template.html` 起步按文档造一个全新原型（PRD §8.5 事件指挥），逐条量它是否自动继承
- 范围：新增 `apps/prototypes/incidents.html`；`showcase.data.js`（五套骨架去 inline style / 去非白名单标签 / 显式闭合）；`scripts/check-prototype.js`（骨架校验段）；`_template.html` 与 `orders/Page.vue`（行内动作按钮 `text` → `link`，与 CLAUDE.md §2 对齐）；本台账
- 包含变更：`C-055`
- 对应需求版本：`RV-022`
- 退出条件：新原型一次通过 `check:prototype`；量到的对齐 / 层级 / 操作列 / 填充高度与 `alarms.html` 一致；骨架校验并入门禁；门禁全绿
- 说明：这一轮的价值不在新原型本身，而在于**证伪**——发现「复制页面骨架」这条官方路径产出的内容根本过不了检查

### IT-021 · 把操作列问题修在规则层（已完成）

- 目标：用户问「你是直接改原型还是改生成原型的规则，这代表我二次生成时是否还会遇到」——本轮的操作列问题必须落在规则与门禁上，改单个原型不算完
- 范围：`skins/table.css`（`.is-actions`）、`scripts/check-prototype.js`（`actions-column` 规则）、`CLAUDE.md` §2、README 皮肤层、`showcase.data.js`（TABLE_MODULE）、`apps/prototypes/{_template,alarms}.html`、`apps/web/src/features/orders/Page.vue`；本台账
- 包含变更：`C-053`、`C-054`
- 对应需求版本：`RV-021`
- 退出条件：R-056 verified（注入 3 个按钮的操作列必须被 check 拦下）；原型模板、五套模板、正式页同步；门禁全绿
- 说明：本轮同时复盘了此前各条反馈的落点——凡是能落在第一、二层或 check 脚本上的都已落下（见 `C-053` 的「落点复盘」）

### IT-020 · 菜单图标对齐与二三级菜单重做（已完成）

- 目标：按评审截图修三处——图标看着没对齐、徽标去掉、二三级菜单观感差
- 范围：`ui/UiShellMenu.vue`（图标集重画 + `popper-class`）、`skins/menu.css`（分组标题对齐、竖导轨、飞出层、嵌套选中态）、`apps/prototypes/alarms.html`（去掉 badge）、README（菜单层级与图标网格两行）；本台账
- 包含变更：`C-052`
- 对应需求版本：`RV-020`
- 退出条件：图标 bbox 复核一致；一级子项与父项标签左对齐、层级缩进收敛；折叠飞出层观感与展开态一致；门禁全绿
- 说明：图标「没对齐」不是布局问题——所有 `.el-icon` 的几何左边缘都在同一 x，是字形没画在同一网格上，只能改 path

### IT-019 · 台账一致性从人工自觉变成机械门禁（已完成）

- 目标：上一轮审计一次查出七处不一致，其中四处是脚本发现的、人眼通读没看出来——把这套对账固化成可重复执行的门禁，让「台账与实现同步」不再依赖记性
- 范围：新增 `scripts/check-ledger.mjs`；根 `package.json`（`check:ledger` 脚本 + lint-staged 的 `doc/*.rai.md` 规则）；`.github/workflows/ci.yml`（第五步）；`CLAUDE.md` §6 命令表与门禁句；本台账（R-055 与本轮记录）
- 包含变更：`C-050`、`C-051`
- 对应需求版本：`RV-019`
- 退出条件：R-055 verified（当前台账 0 错误，且注入故障能被逐条命中）；lint-staged 与 CI 均已接入；本轮改动自身已回填台账
- 说明：`C-050` 是对台账本身的实现修正（上一轮已提交但未记录），`C-051` 是把该修正的成因固化为约束——先有病例，再有疫苗

### IT-018 · 首个业务原型、风格升级与菜单重做（已完成）

- 目标：用一份真实 PRD（《巴中新环保系统》）检验这套三层底层能否正确还原需求；按评审意见把模板整体风格升级为「克制轻量」，并把侧栏菜单做成可用的信息架构
- 范围：`tokens.css`（圆角 / 阴影 / 边框 / 灰阶 / 间距值）、`skins/{menu,table}.css`、`ui/{UiShell,UiShellMenu,UiState,UiTuner}.vue`、`ui/index.ts`、`whitelist.json`、`scripts/check-layer2.mjs`、`apps/prototypes/{_template,alarms}.html`、`tests/visual/mutate.mjs`、`CLAUDE.md` §3、插件 `prototype` 技能、README；git commit
- 包含变更：`C-047`、`C-048`、`C-049`
- 对应需求版本：`RV-018`
- 退出条件：R-053 / R-054 verified；`alarms.html` 通过 `check-prototype`；八项门禁全绿；代码已提交
- 说明：本轮新增两条规则型需求——`R-053`（需求文档有菜单就必须有可切换路由）来自评审反馈，`R-054`（调参面板下沉第二层）来自「原型禁止 `<style>`」这条既有约束的必然推论

### IT-017 · 第二步 B：Claude 插件（已完成）

- 目标：把三层策略封装成可安装的 Claude 插件，让「提示词 → 原型 → 正式页面」这条路不依赖某一次对话里的口头约定
- 范围：仓库根 `.claude-plugin/marketplace.json`（新）、`packages/claude-plugin/**`（新：manifest + README + 三个技能）、`doc/` 说明文档插件一节；git commit
- 包含变更：`C-046`
- 对应需求版本：`RV-017`
- 退出条件：R-032 / R-033 / R-035 verified；R-034 至少 implemented（需要一个真实原型才能端到端验收）；`claude plugin validate` 通过；代码已提交
- 关键约束：`I-006` —— 技能内容不得复制 `CLAUDE.md` 的规则文本，只能引用；规则真值永远只有仓库里那一份

### IT-016 · 展示页整页化与高度填充布局（已完成）

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

### C-055 · 重新生成验证与骨架可粘贴性修复

- 类型：`add`
- 原因：用户问「现在是否构成重新生成，验证以上问题是你修复的，还是修复规则」
- 做法：只依据 `_template.html` + `CLAUDE.md` + `README.md` + 展示页骨架，按 PRD §8.5（事件指挥 FR-INC-001/002/003/005/006）新建 `apps/prototypes/incidents.html`，全程不参考 `alarms.html`；建完立刻量四项此前手修过的问题
- 结论一 · **自动继承（零改动）**：菜单图标中线 32 = 顶栏汉堡中线 32；分组标签 x=24；一级子项文字 x=49 与父项标签同列、三级 61；操作列 `white-space: nowrap`、单元格高 17～18 而行高恒 44；`.l-page` 高 800 = 外壳视图高 800（填充链）；占位页空态上下留白各 229 对称——全部来自第一、二层，新原型一行样式都没写
- 结论二 · **机械拦截**：操作列写法由 `actions-column` 保证；路由必须可切换由 R-053 + 占位约定保证；新原型一次通过 `check:prototype`
- 结论三 · **证伪：生成源自身违规**。展示页「复制页面骨架」的产物实测含 **13 处 inline style、7 处非白名单标签（`el-icon` / `Plus` / `HomeFilled`）、大量自闭合自定义标签**——照 CLAUDE.md §3 粘进原型必被 `check-prototype` 拦下。这是规则链条上真正的断点：文档说「从骨架起步」，骨架却过不了自己的检查
- 修复：五套骨架改为可直接粘贴（`CRUMB` 去色改语义标签、`STAT_ROW` / `TABLE_MODULE` 全部显式闭合、去掉 `el-icon`、01 的 tile / stack 内联 gap 与字号改用 `.l-stack--tight` 等既有类）；`check-prototype.js` 默认扫描时沙箱执行 `showcase.data.js` 校验 `TEMPLATES[].skeleton`（`R-057`）；`showcase.data.js` 头注释区分 demo 与 skeleton 两类字符串
- 顺带修正：`_template.html` 与 `orders/Page.vue` 的行内动作按钮由 `text` 改 `link`，与 CLAUDE.md §2 的写法一致（此前模板与规则各说各的）
- 仍未机械化（如实记录）：菜单是否挂徽标、菜单文案与分组、mock 数据仍是逐个原型的判断；`el-progress` / `el-tree` 白名单缺口未解决，骨架 01 / 04 仍带 PENDING 警告（阻塞项见「待确认与阻塞」）
- 关联需求：`R-057`、`R-019`、`R-044`、`R-053`、`R-016`
- 覆盖关系：—
- 影响功能：`F-005 direct`、`F-007 direct`、`F-011 direct`、`F-006 indirect`

### C-054 · 填充态空 / 错误态在剩余高度居中

- 类型：`modify`
- 原因：用户截图——占位页的空态贴在一张撑满整页的白卡顶部，下方一大片空白
- 之前：`.ui-state.l-fill` 是纵向 flex，子项从顶部开始排；ready 态的表格靠 `.l-fill` 吃掉余量，空 / 错误态没有余量消费者，于是全部堆在顶部
- 之后：`.ui-state.l-fill > .el-empty` 与 `> .ui-state__error` 加 `margin-block: auto`（实测上下留白各 229px，完全对称）；loading 的骨架屏**不居中**——它模拟的是即将出现的内容，顶对齐才不会跳
- 关联需求：`R-050`、`R-018`
- 覆盖关系：`clarify R-050`（补空 / 错误态的垂直居中）
- 影响功能：`F-003 direct`、`F-005 indirect`、`F-006 indirect`

### C-053 · 表格操作列规范与机械检查

- 类型：`add`
- 原因：用户截图——操作列三个文字按钮在 176px 列宽里折成两行，行与行的按钮位置还对不齐；并追问「改的是原型还是生成原型的规则」
- 之前：操作列没有任何约束，宽度与按钮数全凭写原型时随手定；Element Plus 默认让单元格内容跟着列宽换行，固定行高装不下就露馅
- 之后：`R-056`。第二层 `skins/table.css` 加 `.el-table .is-actions .cell`（不换行的一行排布 + `--space-component-gap` 间距，并清掉 EP 的 `.el-button + .el-button` 左边距）；`check-prototype.js` 加 `actions-column` 规则（缺 `is-actions` 或按钮 > 2 即报错，`v-else` 分支不重复计数）；CLAUDE.md §2 与 README 各加一条；`showcase.data.js` 的 TABLE_MODULE、`_template.html`、`orders/Page.vue` 同步打上 `is-actions`
- 原型侧：`alarms.html` 行内动作由「详情 + 确认/派发 + 关联事件」减为「详情 + 确认/派发」，关联事件走详情抽屉底部已有的「关联 / 升级事件」入口（本来就在），列宽 176 → 120
- 落点复盘（回答「二次生成还会不会再遇到」）：**会自动继承的**——菜单图标网格 / 对齐 / 竖导轨 / 折叠飞出层（第二层皮肤与组件）、高度填充三件套（第一层 `.l-page--fill`）、高级搜索浮窗（`UiFilterBar`）、操作列排布（本变更）；**靠规则 + 机械检查兜住的**——原型必须有可切换路由（`R-053`，CLAUDE.md §3 + prototype 技能）、操作列动作数（本变更的 `actions-column`）、第三层禁止写样式 / 裸值 / 非白名单标签（`check-prototype.js` 既有规则）；**仍属逐个原型的数据选择**——菜单是否挂徽标、菜单文案与分组、mock 数据（README 注明徽标默认不用，但不做机械限制）
- 关联需求：`R-056`、`R-019`、`R-042`、`R-044`
- 覆盖关系：—
- 影响功能：`F-003 direct`、`F-005 direct`、`F-007 direct`、`F-006 indirect`、`F-011 indirect`

### C-052 · 菜单图标统一光学网格、子菜单竖导轨与折叠飞出层接管

- 类型：`modify`
- 原因：用户截图三点——「icon 需要同步对齐」「徽标可以去掉」「优化下二级菜单和三级菜单的 UI」
- 图标：先把「没对齐」证伪成布局问题——十个 `.el-icon` 的 left 实测全是 28px。真因是字形没画在同一网格：`getBBox()` 显示 事件指挥 x2..22、企业监管 cx=11、数据质量 cx=13.5 / cy=13.5、设备接入 x5..19。十二个 path 全部重画到 x/y ∈ [4, 20]、中心 (12, 12)；`settings` 的齿轮改为滑杆造型（齿轮很难在这个网格里保持匀称），`default` 由一条横线改为圆点
- 分组标题：padding-inline 由 `--space-component-pad-x`(16) 改为 `--space-module-pad`(20)，与图标列（28px）对齐
- 二三级菜单：弃用 Element Plus 逐级 +20px 的行内 padding（三级已缩进到 89px，一级子项还落在父项标签左边），改为每层一条竖导轨——第一条对齐顶层图标中线（`module-pad + component-gap`），子项 padding 收回 `--space-component-pad-x`，一级子项文字 x=57 与父项标签**完全对齐**，更深层每级只多缩进 12px（三级由 89 → 70）；子项行高 `--layout-control-h`(32) 比顶层 40 矮一档；选中态由整块 accent 底改为「点亮该行那截导轨 + 浅底 + 主色文字」（整块底会把导轨打断）
- 折叠飞出层：Element Plus 把弹出菜单挂到 body，此前完全没接管——48px 的默认行、方角、无阴影层次。`ElSubMenu` 挂 `popper-class="ui-shell__popper"` 后收回样式，行高 / 圆角 / 悬停 / 选中与展开态一致
- 徽标：从原型菜单数据去掉（告警中心与告警列表两处）；`UiShellMenu` 的 `badge` 与 `sumBadge` 保留为可选能力，README 注明默认不用
- 第二轮反馈（「一级不应该有间距、跟顶部对不齐」「收起来时 icon 没居中」）：① 顶层菜单项左内边距由 EP 默认 20px 收到 `--space-component-gap`(12)——图标中线由 x=40 移到 32，与顶栏汉堡图标同一列；分组标题同步改 `--space-component-pad-x`(16)，于是分组标签、菜单图标字形、汉堡字形左边缘一起落在 x=24；导轨随之由 32 收到 `calc(var(--space-component-gap) * 2)`=24，一级子项文字仍与父项标签同 x（49），三级 61。② 折叠态图标偏右 8px：EP 在折叠时给菜单项保留左右 20px 内边距，**且给普通菜单项外面再包一层 `.el-menu-tooltip__trigger`，那 20px 实际来自这一层**——只清菜单项自己的 padding 时，只有含子菜单的项居中了、普通项仍偏右，两种项一半一半。清掉两层内边距 + `.el-icon` 的右外边距后，10 个图标中线全部落在轨道中线
- 关联需求：`R-012`、`R-042`
- 覆盖关系：`clarify R-012`（补菜单视觉规则：图标网格、导轨层级、飞出层；原文「圆角胶囊高亮」在 C-048 已被浅灰底 + 主色竖线取代）
- 影响功能：`F-004 direct`、`F-003 direct`、`F-005 indirect`

### C-051 · 台账一致性检查进门禁

- 类型：`add`
- 原因：用户提出「当前会话任何修改，都需要同步到台账才对」。这条规则此前只写在 CLAUDE.md 开头靠自觉执行，而 `C-050` 证明自觉不够用
- 之前：台账是纯 Markdown，唯一的校验是人通读；实际漏了功能清单十二条未挂、两处勾选与状态不符、三条变更未进历史索引
- 之后：`R-055`；`scripts/check-ledger.mjs` 九项机械检查（缺省扫 `doc/*.rai.md` 与 `.rai/*.md`，也可指定路径）；根 `package.json` 加 `check:ledger` 与 lint-staged 规则 `"doc/*.rai.md"`；CI 在 `check:prototype` 之后插入第五步，八步扩为九步（`R-026` 同步修订）；CLAUDE.md §6 命令表与门禁句同步
- 边界：只校验结构，不校验内容——需求写得对不对、证据是否真实，脚本判断不了，仍靠 `/rai:rai` 流程与人工验收
- 关联需求：`R-055`、`R-026`、`R-023`
- 覆盖关系：—
- 影响功能：`F-007 direct`、`F-009 indirect`

### C-050 · 修复台账七处不一致

- 类型：`implementation_correction`
- 原因：用户要求「修复台账里面的有问题的地方」。审计（含脚本对账）查出七处
- 之前 → 之后：① 头部声明 IT-018 但正文无该小节、IT-017 未标完成 → 补 IT-018 小节并标记 IT-017 完成；② 摘要「本轮目标」仍停在 IT-017 的插件目标 → 改为本轮目标；③ 摘要结论与计数错（写 50 条 / 49 verified，实为 52 条 / 51 verified + 1 implemented）→ 更正；④ 当前变更混入属于 IT-017 的 `C-046` → 删去；⑤ `C-048` / `C-049` 无验收证据 → 补 `E-34`；⑥ 待确认与阻塞过时且有缺漏 → `R-034` 前提改为「拿 alarms.html 跑一次 promote」、`compiler-30` 改为「当前无法复现」，补登三条实际存在的阻塞（el-tree 等不在白名单、PRD §14 单文件离线要求与工作区规范冲突）；⑦ 功能清单自 `R-043` 起未维护、`R-024` / `R-031` 状态 verified 却未勾选、`C-028` / `C-029` / `C-030` 有正文条目但不在历史索引 → 全部补齐
- 关联需求：`R-023`、`R-026`、`R-034`
- 覆盖关系：—
- 影响功能：`F-007 direct`、`F-009 direct`

### C-049 · 无限层级菜单、折叠态优化与两处间距修正

- 类型：`modify`
- 原因：用户四点反馈——徽标要优化、分页上下间距要优化、折叠态要优化、菜单要有动画且支持至少三级
- 徽标：实测 22×**40**——高度被菜单项 `line-height: 40px` 撑成大红椭圆。显式给定 `height` / `line-height` 为 `--layout-icon-sm` 后成 22×22 正圆
- 分页：实测**上 0 / 下 20px**，分页紧贴表格底边。原因是分页在 `ui-state` 内部，而 `.l-stack--tight` 的间距只作用于模块的直接子元素。给 `.ui-state.l-fill` 补 `gap: var(--space-component-gap)`，所有用该写法的页面一起修好
- 无限层级：新增第二层内部组件 `ui/UiShellMenu.vue` 自引用递归（`ElSubMenu` + `ElMenuItem`），`UiShellMenuItem` 增加 `children`；父项徽标由 `sumBadge` 汇总子级。原型菜单落地三级（告警中心 → 规则与推送 → 阈值规则 / 推送渠道 / 审批流配置），`currentMenu` 改递归查找
- 折叠态：分组标题收成 1px 分隔线保住节奏；当前项落在子菜单里时折叠轨道上高亮的是父级 `el-sub-menu__title`，补上该选择器
- 动画：**走了一次弯路**——为加动画去掉了 `:collapse-transition="false"`，结果 Element Plus 自带的横向折叠过渡与侧栏宽度过渡打架，侧栏 class 与内联宽度都已是折叠值、实测宽度却仍是 230px。改回关闭 EP 过渡，动画只由 `.ui-shell__sidebar` 的 `transition: width` 负责。原代码那行注释是有原因的
- 菜单细节返工（用户两轮截图反馈）：① 子项没给 `icon` 时会渲染默认图标——那是一条横线，看着像多余的横杠；改为按 `depth` 判定，只有顶层才回退默认图标（折叠态要靠它辨认）。② 折叠态子菜单图标不显示：Element Plus 用 `.el-menu--collapse … span { width: 0; visibility: hidden }` 隐藏文字，而我的图标用的是 `<span class="el-icon">` 一并被藏；EP 自己的 `<el-icon>` 渲染成 `<i>` 所以不受影响——图标标签改 `<i>` 后恢复。③ 折叠态分组分隔线实测只有 16px 宽，像一截碎线；去掉横向留白。④ 选中的嵌套项竖线画在侧栏最左边（`2px × 34px at left: 0`），离缩进后的文字很远；嵌套层改用底色 + 主色文字
- 连带修正：`check-layer2` 的组件清单改为只收 `ui/index.ts` 中公开注册的组件——`UiShellMenu` 是内部组件，否则展示页与变异测试会去找一张本不该存在的配置卡
- 关联需求：`R-012`、`R-042`、`R-048`
- 覆盖关系：—
- 影响功能：`F-004 direct`、`F-003 direct`、`F-005 indirect`

### C-048 · 克制轻量风格升级与菜单重做

- 类型：`modify`
- 原因：用户「把模板整体风格变得更现代化」，方向选定「克制轻量（Linear / Vercel 路子）」；菜单选「图标 + 分组 + 徽标」
- 先发现的缺陷：侧栏折叠后是 **10 行空白**——菜单项只渲染 `<span>{{ label }}</span>`，Element Plus 折叠态隐藏文字只留图标位，而 `UiShellMenuItem` 没有图标字段（实测 `innerText` 为空）
- 第一层（只改值，一处生效）：卡片圆角 12 → 8；阴影三档整体减淡（卡片改为靠边框分层）；边框与灰阶调浅（gray-200 #e6e8e8 → #e8eaec 等）；模块内边距 16 → 20；**页面内边距 20 → 8**（用户指定）
- 第二层：`skins/menu.css` 由圆角胶囊改为「浅灰底 + 2px 主色竖线」并补图标/分组/徽标样式；`skins/table.css` 的 hover 由 accent 改浅灰；`UiShell` 的 `UiShellMenuItem` 增加 `icon` / `group` / `badge`，图标用**组件内置的 12 个线性 SVG**（放第二层是为了让原型不必再引图标 CDN，也不用改白名单）
- 第三层：原型菜单按「态势 / 处置 / 基础」分组并挂图标，告警中心带徽标；表格去掉 `stripe`
- 徽标一处返工：初版放在默认插槽，渲染成了图标与文字之间；移进 `#title` 插槽后靠 `margin-left: auto` 右对齐
- 关联需求：`R-005`、`R-007`、`R-012`、`R-042`
- 覆盖关系：—
- 影响功能：`F-001 direct`、`F-003 direct`、`F-004 direct`、`F-005 indirect`

### C-047 · 首个业务原型与两条新规则

- 类型：`add`
- 原因：用户给出《巴中新环保系统 PRD》要求构建可交互原型，并在评审中提出四点：路由点了不变、页头多余、页签条难看、调参面板要开放到原型
- 之前：`apps/prototypes/` 只有 `_template.html`；原型无多路由概念；调参面板写死在 `showcase.html` 里
- 之后：R-053 / R-054；`apps/prototypes/alarms.html` 落地告警中心（PRD §8.4），覆盖 10 项一级导航的路由与占位、FR-ALM-001 六类告警、FR-ALM-003 处置阶段页签、FR-ALM-004 企业上报快照、**FR-ALM-005 显式关联事件**（候选只限同企业在办事件，关联类型 / 理由 / 已核对证据未填全则提交禁用，推荐分不代选）
- 评审四点的处理：① 按 R-053 补路由分支与占位；② 删掉 `UiPageHeader`，操作移入 `UiFilterBar` 的 `actions`；③ 页签移进模块当卡片头并去掉 `is-tabbar` 胶囊样式——问题不在皮肤而在「页头 + 悬空页签条 + 表格」三块白板叠加，收成一张卡后无需改第二层；④ 调参面板下沉为 `UiTuner`
- 实施中被门禁挡下并修正：`check-layer2` 报 7 处（自造 token 名 `--ui-tuner-max`、`calc(100vw - …)` 被空格切断成裸长度、`--el-slider-height: 3px` 等），改为复用 `--layout-aside-w`、面板封顶 `100vh` 由 flex 收缩滚动区、滑块尺寸交还 Element Plus 默认；变异测试报 18 项未消费，加 `PREP` 展开面板后降到 2 项，最后发现是 `PROPS` 缺 `top/right/bottom/left`——浮层类组件用 token 定默认位置会被误判，补进属性清单后 29 项全过
- 关联需求：`R-053`、`R-054`、`R-016`、`R-018`、`R-038`、`R-041`、`R-011`
- 覆盖关系：—
- 影响功能：`F-005 direct`、`F-003 direct`、`F-011 direct`、`F-008 direct`、`F-010 indirect`

### C-046 · 第二步 B：Claude 插件

- 类型：`implement`
- 原因：用户授权开工第二步 B（并默认接受 `H-003` 的插件形态）
- 之前：`R-032`～`R-035` 停在 `ready`，`packages/claude-plugin/` 只是实现映射里的一个预留路径，目录并不存在
- 之后：仓库根 `.claude-plugin/marketplace.json` 让本仓库自身成为插件市场；`packages/claude-plugin/` 含 manifest、README 与三个技能。`claude plugin validate` 对插件与市场两个 manifest 均通过；`claude plugin marketplace add` + `claude plugin install virtual@virtual` 实测安装成功，缓存目录下三个 `SKILL.md` 的 frontmatter 被正确读入
- **`R-032` 澄清**：当前 Claude Code 里技能本身就是 slash 命令（`/virtual:<skill>`），原文里的 `commands` 不再单独建目录——同一入口维护两份定义违背 `I-006` 的精神。`prototype` / `promote` 设 `disable-model-invocation: true`（会成批写文件，只在显式调用时执行），`layer-rules` 允许模型自动触发（只读不写）
- **`I-006` 的落实方式**：三个 `SKILL.md` 不含任何规则原文，只写「去哪读、怎么用」，并明确要求每次执行都实际读取 `CLAUDE.md` / `README.md` / `whitelist.json` / 台账，读不到就停下而不是按通用最佳实践继续。代价是插件只对本工作区有意义，已写进 README
- `R-034` 留在 `implemented`：`promote` 技能已就位，但端到端验收需要一个**真实业务原型**跑一遍，当前 `apps/prototypes/` 只有 `_template.html`
- 关联需求：`R-032`、`R-033`、`R-034`、`R-035`、`R-023`
- 覆盖关系：—
- 影响功能：`F-010 direct`、`F-005 indirect`、`F-008 indirect`

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
| C-050 | F-007, F-009 | direct | 台账自身七处不一致修正，恢复为可信实施依据 | 脚本对账 0 错误 |
| C-051 | F-007 | direct | 新增台账一致性门禁，CI 八步扩为九步 | 当前台账通过；注入故障必失败 |
| C-051 | F-009 | indirect | 台账是文档层的真值来源 | 摘要与正文计数一致 |
| C-052 | F-004 | direct | 菜单图标网格、层级表达与折叠飞出层观感改变 | 图标 bbox 一致；层级缩进收敛；飞出层与展开态一致 |
| C-052 | F-003 | direct | `skins/menu.css` 改写 | check-layer2 0 错误；变异验证 UiShell 通过 |
| C-052 | F-005 | indirect | 原型菜单数据去掉徽标 | check-prototype 通过 |
| C-053 | F-003 | direct | `skins/table.css` 新增 `.is-actions` | 单元格单行、行高恒定 |
| C-053 | F-005 | direct | 操作列写法进入模板与检查脚本 | 注入 3 个按钮必失败 |
| C-053 | F-007 | direct | check-prototype 新增 actions-column 规则 | 故障注入退出码非零 |
| C-053 | F-006 | indirect | 正式页同步 `is-actions` | 视觉回归 0.00% |
| C-054 | F-003 | direct | UiState 填充态空 / 错误态居中 | 上下留白对称；骨架屏仍顶对齐 |
| C-055 | F-005 | direct | 新增第二个业务原型；骨架成为可粘贴内容 | 新原型一次通过 check |
| C-055 | F-007 | direct | check-prototype 增加骨架校验段 | 注入违规骨架必失败 |
| C-055 | F-011 | direct | 五套骨架去 inline style / 非白名单标签 | 展示页 01～05 仍正常渲染 |
| C-055 | F-006 | indirect | 正式页按钮改 link 与规则对齐 | 视觉回归 0.00% |
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
| C-049 | F-004, F-003 | direct | 菜单层级与折叠交互 | 三级菜单可展开；折叠后分隔线与高亮就位；八项门禁全绿 |
| C-048 | F-001, F-003, F-004 | direct | 全局 token 值与外壳菜单改版 | 折叠后 10 项均有图标；八项门禁全绿 |
| C-047 | F-005, F-003, F-011 | direct | 首个业务原型、第二层新增组件、原型路由规则 | check-prototype 通过；八组件变异全过；lint / typecheck 0 错误 |
| C-046 | F-010 | direct | 新增可安装插件与三个技能 | validate 通过；实测安装并列出技能 |
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
| R-032, R-033, R-035 | 仓库根 `.claude-plugin/marketplace.json`、`packages/claude-plugin/{.claude-plugin/plugin.json,README.md,skills/{layer-rules,prototype,promote}/SKILL.md}` | verified | E-32 |
| R-034 | 同上（`skills/promote/SKILL.md`） | implemented | E-32（端到端待真实原型） |
| R-037 | `packages/design-system/showcase.html`、`scripts/build-tokens.mjs`、`dist/tokens.js`(.json)、`package.json` build 脚本 | verified | E-09, E-26 |
| R-053 | `CLAUDE.md` §3、`packages/claude-plugin/skills/prototype/SKILL.md`、`apps/prototypes/alarms.html`（路由分支 + 占位） | verified | E-33 |
| R-054 | `ui/UiTuner.vue`、`ui/index.ts`、`whitelist.json`（custom）、`README.md`、`showcase.data.js`（CUSTOM）、`apps/prototypes/{_template,alarms}.html`（引入 dist/tokens.js + `<ui-tuner>`）、`tests/visual/mutate.mjs`（PREP + PROPS 补定位属性） | verified | E-33 |
| R-052 | `showcase.html`（TUNER_GROUPS / kindOf / rangeOf / onSlide / setOverride 等 + 调参抽屉 + 顶栏与 FAB 入口） | verified | E-31 |
| R-050（空态居中） | `ui/UiState.vue`（`.ui-state.l-fill > .el-empty` / `> .ui-state__error` 的 `margin-block: auto`） | verified | E-38 |
| R-050 | `layout.css`（`.l-page--fill` / `.l-fill` / `.l-module.l-fill`）、`ui/UiShell.vue`（`view-class="ui-shell__view"` + `height: 100%` 纵向 flex）、`ui/UiState.vue`（`.ui-state.l-fill`）、`skins/table.css`（`.el-table.l-fill`）、`showcase.data.js`（`TABLE_MODULE` / `pageClass`）、`apps/prototypes/_template.html`、`apps/web/src/features/orders/Page.vue`、README「高度填充」、CLAUDE.md §2 | verified | E-28 |
| R-051 | `ui/composites/UiFilterBar.vue`（`ElPopover` + `#advanced` 插槽 + `.ui-filter-bar__adv`）、`showcase.data.js`（CUSTOM 与 `TABLE_MODULE`）、README UiFilterBar 节、CLAUDE.md §2 | verified | E-28 |
| R-038（两段式） | `showcase.html`（`parseHash` / `go(key, sub)` / `defaultSub` / `syncAnchor`） | verified | E-26 |
| R-057 | `scripts/check-prototype.js`（`checkSkeletons` / `PENDING_WHITELIST`）、`packages/design-system/showcase.data.js`（CRUMB / STAT_ROW / TABLE_MODULE 与五套 skeleton） | verified | E-39 |
| R-016（第二个业务原型） | `apps/prototypes/incidents.html` | verified | E-39 |
| R-056 | `skins/table.css`（`.is-actions`）、`scripts/check-prototype.js`（`actions-column`）、`CLAUDE.md` §2、README 皮肤层、`showcase.data.js`（TABLE_MODULE）、`apps/prototypes/{_template,alarms}.html`、`apps/web/src/features/orders/Page.vue` | verified | E-37 |
| R-012（菜单视觉） | `ui/UiShellMenu.vue`（ICONS 重画 + `popper-class`）、`skins/menu.css`（分组对齐 / 竖导轨 / 飞出层 / 嵌套选中）、`apps/prototypes/alarms.html`（去 badge）、README | verified | E-36 |
| R-055 | `scripts/check-ledger.mjs`、根 `package.json`（`check:ledger` + lint-staged `doc/*.rai.md`）、`.github/workflows/ci.yml`（第五步）、`CLAUDE.md` §6 | verified | E-35 |
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
| 原型 CDN 是否需要离线副本（H-004） | R-016 | 模板依赖引入方式 |
| 拿 `alarms.html` 跑一次 `promote`，把「原型 → 正式页面」端到端走通 | R-034 | R-034 转 verified 的唯一前提（原型本身已就绪） |
| `el-tree` / `el-icon` / `el-progress` 不在白名单 | R-011, R-016 | 挡住 PRD §14 要求的「在线监测设备树」原型；也使展示页模板 04 / 05 的骨架**无法复制进原型**（会被 check-prototype 拦下），与 README「可预览并复制骨架」的说法不符 |
| PRD §14 要求「单个离线 HTML、CSS/JS 全内嵌、不依赖网络」，与本工作区「共用第一二层 + CDN」冲突 | R-016, R-029 | 后者是原型与正式页面一比一转换的前提；若必须满足 PRD，需要另做一套导出 |
| 展示页控制台曾出现的 `compiler-30` 报错当前**无法复现** | R-037 | `HEAD~2`（本会话前）自闭合标签数为 0 却同样报错，与本会话在 `C-047` 修掉的那条（自闭合自定义标签）不是同一原因；最近多次新标签页检查均无任何控制台输出，暂按「不可复现」挂起 |
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
| E-32 | R-032, R-033, R-034, R-035 | `claude plugin validate packages/claude-plugin` 与 `claude plugin validate .`（市场）均 `Validation passed`（首轮有 author 缺失警告，补 author / homepage / keywords 后归零）；`claude plugin marketplace add D:git-projectirtual` → `Successfully added marketplace: virtual`；`claude plugin install virtual@virtual` → `Successfully installed`，`installed_plugins.json` 记录 installPath 与 gitCommitSha；缓存目录 `skills/{layer-rules,prototype,promote}/SKILL.md` 三个技能齐备，frontmatter 的 name / description / disable-model-invocation 均被正确读入。`I-006` 核对：三个 SKILL.md 均无规则原文，只引用 `CLAUDE.md` / `README.md` / `whitelist.json` / 台账 | pass | 2026-09-05 |
| E-33 | R-053, R-054, R-016, R-018 | `node scripts/check-prototype.js` 两个原型全过；浏览器实测：点「在线监测」→ hash 变 `#/monitor`、内容切为占位并显示「对应 PRD §8.3」、点回告警中心表格恢复；`FR-ALM-005` 关联对话框候选只列同企业在办事件（3 个事件里排除了另一家企业的），四项未填全时「确认关联」禁用并提示「推荐分不代表自动关联，必须人工判定」；`UiTuner` 在原型内 82 行控件 / 8 分组，改 `--radius-lg` 12→24px 模块圆角实时联动；筛选条由两行 100px 收回一行 56px；`pnpm lint` / `typecheck` 0 错误、`check-layer2` 0 错误、`test:visual` 三用例 0.00%、`test:mutation` 8 组件全过（UiTuner 29 项无例外） | pass | 2026-09-05 |
| E-34 | R-005, R-007, R-012, R-042 | 风格升级与菜单重做实测：卡片 `border-radius: 8px` / `box-shadow: none`（改为靠边框分层）；`.l-page` padding 8px；折叠侧栏 66px 下 10 项**全部有图标**（修复前 `innerText` 为空、10 行空白）；三级菜单可逐层展开（告警中心 → 规则与推送 → 阈值规则 / 推送渠道 / 审批流配置），父级徽标由 `sumBadge` 汇总为 6；徽标由 22×40 的椭圆修正为 22×22 正圆；分页与表格间距由「上 0 / 下 20」修正为对称。四处返工：子项默认图标渲染成横杠（改按 depth 判定）、折叠态子菜单图标被 EP 的 `.el-menu--collapse … span` 规则隐藏（图标标签改 `<i>`）、折叠分组分隔线实测仅 16px 宽（去横向留白）、嵌套选中项竖线画在侧栏最左边离文字很远（改底色 + 主色文字）。加动画时误删 `:collapse-transition="false"` 导致 EP 过渡与侧栏宽度过渡打架（侧栏 class 与内联宽度已是折叠值、实测宽度仍 230px），已改回。八项门禁全绿，视觉回归 0.00%，变异测试 8 组件全过 | pass | 2026-09-05 |
| E-35 | R-055, R-026, R-023 | `node scripts/check-ledger.mjs` 对当前台账：`✔ doc/frontend-layered-design.md.rai.md · 53 条需求 · 24 条变更`，退出码 0。故障注入复核（证明脚本不是空过）：把 `R-001` 的勾选去掉、头部 iteration 改成正文没有的 `IT-099`、从功能清单 F-003 删掉 `R-054`，脚本报出四条——「头部 iteration IT-099 与摘要 IT-019 不一致」「iteration IT-099 在正文没有对应小节」「R-001 是 verified 但勾选框未打勾」「以下需求未挂到任何功能：R-054」，退出码 1；还原后恢复 0。lint-staged 规则 `doc/*.rai.md` 与 CI 第五步（`check:prototype` 之后、`build:web` 之前）已就位 | pass | 2026-09-05 |
| E-36 | R-012, R-042 | 改前实测（`getBBox()`）：事件指挥 x2 w20、企业监管 x4 w14 cx11、数据质量 cx13.5 cy13.5、设备接入 x5 w14、地图 x3 w18——而十个 `.el-icon` 的 left 全是 28px，说明是字形网格问题不是布局问题。改后十二个图标 cx 全为 12.0、x∈[4, 4.5]、w∈[15, 16]、cy∈[11.5, 12.5]。层级：一级子项文字 x=57（与父项标签同一 x）、行高 32；三级子项 x 由 89 → 70（每级 +13）；三级路由 `#/rule-threshold` 下 阈值规则 为 bg subtle + 主色文字 + 导轨点亮。折叠态飞出层由默认 48px 行改为 32px 行 + `--radius-lg` + `--shadow-md`，与展开态一致；折叠轨道上父级仍为 accent 底 + 主色图标。深色模式下菜单与导轨对比正常。第二轮（对齐）实测：展开态 10 个顶层图标中线由 40 → **32**，与顶栏汉堡图标中线 32 一致；分组标签 x=24 与汉堡图标字形左边缘 24 一致；一级子项文字 x=49 = 父项标签 x，三级 61（每级 +12）；折叠态（侧栏 66，轨道中线 33）10 个图标中线由「普通项 40 / 子菜单项 32 各一半」统一为 32（内容区中线，右侧 1px 边框之内）。门禁：`lint` / `typecheck` 0 错误、`build:ds`（check-layer2）0 错误 1 条既有警告、`check:prototype` 2 个原型通过、`check:ledger` 通过、`test:visual` 三用例 0.00%、`test:mutation` 8 组件全过（UiShell 21 通过 + 2 已核实例外） | pass | 2026-09-05 |
| E-37 | R-056, R-019, R-042 | 改前：`alarms.html` 操作列 3 个文字按钮 / 列宽 176，截图可见折成两行且行与行按钮位置不齐。改后实测：`.is-actions .cell` 为 `display: flex` / `gap: 12px` / `white-space: nowrap`，六行单元格高 17～18px、表格行高恒为 44px，按钮数分别为 [详情, 确认] / [详情] / [详情, 派发]。机械检查：`node scripts/check-prototype.js` 两个原型通过；注入第三个按钮（关联事件）后报 `actions-column (line 126): 操作列有 3 个按钮，行内动作最多 2 个…` 且退出码 1，还原后恢复通过。门禁：`lint` / `typecheck` 0 错误、`build:ds` 0 错误 1 条既有警告、`check:ledger` 通过、`test:visual` 三用例 0.00%（原型模板与正式页同步改动）、`test:mutation` 8 组件全过 | pass | 2026-09-05 |
| E-38 | R-050, R-018 | `#/monitor-realtime` 占位页 1440×860：改前空态贴容器顶部；改后容器高 742、空态高 284，上方留白 229 / 下方留白 229（对称居中）。loading 态骨架屏仍从顶部开始。门禁：`lint` / `check:prototype` / `build:ds`（check-layer2 0 错误）通过，`test:visual` 三用例 0.00%，`test:mutation` 8 组件全过（UiState 12 项） | pass | 2026-09-05 |
| E-39 | R-057, R-016, R-012, R-050, R-056 | 重新生成实验：按 PRD §8.5 从 `_template.html` 起步新建 `incidents.html`（不参考 `alarms.html`），`check:prototype` **一次通过**。1440×860 实测继承情况：菜单图标中线 32（顶栏汉堡 32）、分组标签 x=24、一级子项 x=49 = 父项标签、三级 x=61、操作列 cell `nowrap` / 高 17～18 / 行高 44、`.l-page` 800 = 外壳视图 800、占位页空态上下留白 229/229、控制台无报错。骨架体检：改前 `TEMPLATES` 骨架含 13 处 `style="…"`、7 处非白名单标签（`el-icon` / `Plus` / `HomeFilled`）及大量自闭合；改后 `check:prototype` 输出「✔ 布局配置骨架 5 套（可直接粘进原型）」，并对 `el-progress`（01）/ `el-tree`（04）给出 PENDING 警告。展示页 `#/page/stat` 与 `#/page/tree-table` 改后渲染正常、无控制台报错。门禁：`lint` / `typecheck` 0 错误、`check:ledger` 通过、`test:visual` 三用例 0.00%（`_template` 与 `orders` 同步改 `link`） | pass | 2026-09-05 |
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
| RV-022 | IT-022 | C-055 | add | R-057, R-019, R-044, R-053, R-016 | 无 → 第二个业务原型 + 骨架可粘贴性修复与校验 | F-005, F-007, F-011 |
| RV-021 | IT-021 | C-054 | modify | R-050, R-018 | 填充态空 / 错误态贴顶 → 在剩余高度居中 | F-003 |
| RV-021 | IT-021 | C-053 | add | R-056, R-019, R-042, R-044 | 无 → 操作列 is-actions 皮肤 + 行内动作 ≤ 2 + actions-column 检查 | F-003, F-005, F-007 |
| RV-020 | IT-020 | C-052 | modify | R-012, R-042 | 图标统一光学网格；二三级菜单改竖导轨；折叠飞出层接管；原型去徽标 | F-004, F-003 |
| RV-019 | IT-019 | C-051 | add | R-055, R-026, R-023 | 无 → 台账一致性门禁；CI 八步 → 九步 | F-007, F-009 |
| RV-019 | IT-019 | C-050 | implementation_correction | R-023, R-026, R-034 | 台账七处不一致修正（迭代小节 / 摘要 / 证据 / 阻塞 / 功能清单 / 勾选 / 历史索引） | F-007, F-009 |
| RV-018 | IT-018 | C-049 | modify | R-012, R-042, R-048 | 无限层级菜单 + 折叠态 + 动画；徽标与分页间距 | F-004, F-003 |
| RV-018 | IT-018 | C-048 | modify | R-005, R-007, R-012, R-042 | 克制轻量风格；菜单加图标/分组/徽标，修折叠空白 | F-001, F-003, F-004 |
| RV-018 | IT-018 | C-047 | add | R-053, R-054, R-016, R-041 | 无 → 首个业务原型 + 原型路由规则 + UiTuner | F-003, F-005, F-011 |
| RV-017 | IT-017 | C-046 | implement | R-032, R-033, R-034, R-035 | ready → 插件可安装；R-032 澄清 commands | F-010 |
| RV-016 | IT-016 | C-045 | implement | R-004, R-009, R-010, R-011, R-017, R-029 | implemented → verified（用户验收 + 第二步阻塞已清） | F-001, F-002, F-003, F-005 |
| RV-016 | IT-016 | C-044 | implementation_correction | R-052, R-044 | 值格可输入、控件不变形、控制条可拖 | F-011 |
| RV-016 | IT-016 | C-043 | add | R-052, R-037 | 四个开关 → 覆盖 82 个 token 的调参面板 | F-011 |
| RV-016 | IT-016 | C-042 | implementation_correction | R-050, R-005, R-012 | 外壳视图改回块级，修复填充链把页面收成 max-content 宽 | F-002, F-004 |
| RV-015 | IT-015 | C-036 | implement | R-026, R-027, R-049, R-037, R-012 | ready → verified；两处缺陷修复 | F-007, F-008 |
| RV-014 | IT-014 | C-035 | implement | R-020, R-021, R-024, R-025, R-031 | ready → verified；R-021 / R-024 澄清 | F-006, F-007 |
| RV-013 | IT-013 | C-034 | add | R-047, R-048, R-049, R-005, R-037 | 无 → 第二层约束 / 覆盖度 / 变异验证 | F-001, F-003, F-011 |
| RV-012 | IT-012 | C-033 | add | R-046, R-037 | 无 → [data-palette] 变体段 | F-001, F-011 |
| RV-010 | IT-010 | C-028 | add | R-045 | 无 → 第一层默认值对齐参考站 | F-001, F-002, F-004 |
| RV-010 | IT-010 | C-029 | modify | R-041 | UiModuleHeader / UiStatCard 按精修稿重构 | F-003 |
| RV-010 | IT-010 | C-030 | modify | R-044, R-040 | 五套模板按精修稿重排 | F-011 |
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
