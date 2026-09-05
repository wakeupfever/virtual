# design-system · 第一层 + 第二层

> 原型（`apps/prototypes/`）与正式项目（`apps/web/`）共用本包。AI 开发任何第三层内容前必须先读本文件。
> 本包已冻结：新增或修改组件、布局类、token 语义，须先在对话中提议并获确认，单独提交，并同步更新本文件。

## 引入方式

**正式项目（Vite）**

```ts
// main.ts —— 顺序固定：element-plus 样式 → tokens → skins（皮肤）→ layout → base → 第二层组件
import 'element-plus/dist/index.css'
import '@virtual/design-system/tokens.css'
import '@virtual/design-system/skins/index.css'
import '@virtual/design-system/layout.css'
import '@virtual/design-system/base.css'
import DesignSystemUI from '@virtual/design-system'
app.use(ElementPlus).use(DesignSystemUI)
```

**原型（单文件 HTML，CDN）** —— 直接复制 `apps/prototypes/_template.html`，版本必须与 `package.json` 中 element-plus / vue 一致。

## 第一层 · token（`tokens.css`）

只允许引用**语义 token**；原始刻度（`--space-N`、`--palette-*`）禁止在第二、三层出现。

| 类别 | 命名 | 可用值 |
|---|---|---|
| 颜色 bg | `--color-bg-{page\|surface\|subtle\|muted\|canvas\|accent\|overlay\|mask}` | 页面底（文档 / 原型外壳外）、卡片表面、斑马纹/hover/次级填充块、禁用、**应用壳内容区底（模块白卡浮于其上）**、主色柔和底、浮层、遮罩 |
| 颜色 text | `--color-text-{default\|secondary\|muted\|placeholder\|inverse}` | |
| 颜色 border | `--color-border-{default\|muted}` | |
| 颜色 icon | `--color-icon-{default\|muted}` | |
| 功能色 | `--color-{primary\|success\|warning\|danger\|info}`，`--color-primary-hover`，`--color-danger-hover` | |
| 间距 page | `--space-page-{gap\|pad-x\|pad-y\|title}` | 页面区块之间 24 / 内容区内边距 20 / 页头到正文 16 |
| 间距 module | `--space-module-{gap\|pad\|title}` | 卡片之间 16 / 卡片内边距 16 / 卡片标题到内容 16 |
| 间距 component | `--space-component-{gap\|pad-x\|pad-y\|title}` | 按钮组、表单项之间 / 组件内边距 / label 到控件 |
| 间距 inline | `--space-inline-{gap\|pad}` | 图标与文字 / tag 内边距 |
| 布局尺寸 | `--layout-{sidebar-w\|sidebar-w-collapsed\|header-h\|aside-w\|row-h\|thead-h\|control-h\|menu-item-h\|icon-sm\|icon-md\|icon-lg\|content-max\|content-pad\|form-label-w\|control-w\|control-w-sm}`，`--grid-cols`，`--grid-gap` | 默认 230 / 66 / 60 / 320（对齐参考站 park-mgt-web） |
| 层级 | `--z-{header\|sidebar\|drawer\|dialog\|toast}` | |
| 字体 | `--font-family`，`--font-size-{display\|page-title\|module-title\|body\|caption\|micro}`（24 / 20 / 16 / 14 / 12 / 10），`--line-height-{tight\|body}`，`--font-weight-{regular\|medium\|bold}` | |
| 圆角 | `--radius-{sm\|md\|lg\|full}` | |
| 阴影 | `--shadow-{sm\|md\|lg}` | |
| 边框 | `--border-w`，`--border-w-thick` | |

**第三层实际可用的间距**只有 `page`、`module` 两行与 `--space-component-gap`；组件内部间距由第二层固定。

默认配色「科技青」：主色 `#0076a3`、强调 `#00486a`、柔和底 `#e8f4f7`，中性灰带青灰色相（参考 HY Compiler Studio technology-cyan 主题）。展示页右上角「配色」可切换 Element 蓝 / 靛蓝 / 靛紫 预览，只影响预览，不改文件。

主题开关（挂在 `<html>` 上）：`data-theme="dark"` 深色；`data-density="compact" | "loose"` 密度；`data-palette="element" | "indigo" | "violet"` 整套配色变体（真值在 `tokens.css` ⑤ 段，默认科技青不加属性；变体的品牌 / 功能色在深浅两种模式都生效，中性色只作用于浅色）。展示页右上角的「配色预设」切换的就是这个属性；新增一套配色 = 在 ⑤ 段加一个 `[data-palette="<key>"]` 块并在 `showcase.data.js` `PRESETS` 登记 key / label。Element Plus 的 `--el-*` 变量已由 tokens.css 映射，**禁止**在第三层直接改 `--el-*`。

## 第一层 · 布局类（`layout.css`）

第三层禁止手写 `display: flex / grid`，只能组合以下类：

| 类 | 用途 | 变体 |
|---|---|---|
| `.l-page` | 内容区容器（最大宽 + 页面内边距），直接子元素之间自动 page-gap | `--fill`（撑满外壳内容区并纵向排布，见下） |
| `.l-fill` | 「占满剩余高度」标记，作用于任意 flex 容器的子项 | — |
| `.l-page-header` | 页头（一般由 `UiPageHeader` 内部使用） | — |
| `.l-module` | 卡片 / 面板容器 | — |
| `.l-module-header` | 模块标题行 | — |
| `.l-stack` | 纵向堆叠 | `--tight`、`--loose` |
| `.l-grid` | 栅格，默认 12 列 | `--cols-2/3/4`、`--tight`；子项 `.l-span-2/3/4/6/8/12` |
| `.l-split` | 侧栏 + 主区两栏（侧栏宽 `--layout-sidebar-w`） | `--reverse`、`--aside`（侧栏宽 `--layout-aside-w`，左树右表） |
| `.l-grid--main-aside` | 主区 1.3fr + 侧面板 0.7fr（分析区 2×2） | — |
| `.l-tile` | 模块内的次级填充小格（概况项） | — |
| `.l-bars` / `.l-bar` | 柱状条容器 / 柱；柱高由数据 `:style="{ height }"` 绑定 | — |
| `.l-cluster` | 横向可换行（按钮组、筛选条） | `--end`、`--between` |
| `.l-toolbar` | 表格上方工具条 | — |
| `.l-form` | 表单区块，label 宽度取 token | — |
| `.l-inline` | 图标 + 文字 | — |
| `.l-state` | loading / empty / error 占位容器（一般由 `UiState` 内部使用） | — |

### 高度填充（表格页）

表格页通常希望页面撑满外壳内容区、表格吃掉剩余高度、表头固定、表体内滚、分页贴底。写法是两个类，**不给表格传 `height`**：

```html
<div class="l-page l-page--fill">
  <!-- 面包屑、统计卡行等：自然高度 -->
  <section class="l-module l-stack l-stack--tight l-fill">
    <ui-filter-bar advanced>…</ui-filter-bar>
    <el-table class="l-fill" :data="rows">…</el-table>
    <div class="l-cluster l-cluster--end"><el-pagination … /></div>
  </section>
</div>
```

- `.l-page--fill` 让页面恰好等于外壳内容区高度（`UiShell` 的滚动视图已置为确定高度的纵向 flex）
- `.l-fill` 标记吃掉剩余高度的那一项；`.el-table.l-fill` 由 `skins/table.css` 接管，表体在 Element Plus 自带的 `ElScrollbar` 内滚（R-043），表体最矮保留一行 `--layout-row-h`
- 不加 `--fill` 的页面（统计 / 表单页）行为不变：内容多高就多高，超出由外壳内滚
- 视口过矮时表体先收缩内滚，收到一行仍放不下才由外壳整体滚动

## 第二层 · Element Plus 白名单

第三层只能使用下表组件（含其子组件）。需要白名单外的组件时，先提议。

| 组件 | 说明 |
|---|---|
| `ElButton` | 操作 |
| `ElScrollbar` | **所有滚动区域**（列表容器、横向条、抽屉内容）；禁止原生 overflow 滚动 |
| `ElInput`、`ElInputNumber` | 文本 / 数字输入 |
| `ElSelect` / `ElOption` | 下拉 |
| `ElCheckbox` / `ElCheckboxGroup`、`ElRadio` / `ElRadioGroup`、`ElSwitch` | 选择 |
| `ElDatePicker` | 日期 |
| `ElForm` / `ElFormItem` | 表单与校验（外层加 `.l-form`） |
| `ElTable` / `ElTableColumn` | 表格 |
| `ElPagination` | 分页；layout 含 `sizes` 时必须 `v-model:page-size`（否则 Element Plus 直接不渲染） |
| `ElDialog`、`ElDrawer` | 弹层 |
| `ElMessage`、`ElMessageBox`、`ElNotification` | 反馈（命令式） |
| `ElTabs` / `ElTabPane` | 页签 |
| `ElTag`、`ElBadge` | 标记 |
| `ElSkeleton`、`ElEmpty` | 状态（一般通过 `UiState` 使用） |
| `ElMenu` / `ElMenuItem` | 仅 `UiShell` 内部使用，第三层不直接用 |

## 第二层 · 皮肤层（`skins/`）

样式级偏差的唯一落点：结构与行为不变、只是长得不一样时，在 `skins/<component>.css` 用 `--el-<component>-*` 变量或 Element Plus BEM 类覆盖，值只引用 token。`skins/index.css` 负责 `@import`。当前：`table.css`（表头 `--layout-thead-h` 40 / 行 `--layout-row-h` 44、表头 subtle 底 12/500、外框圆角、hover 用 accent）、`input.css`（圆角与聚焦描边跟随 token）、`menu.css`（UiShell 侧栏菜单圆角胶囊高亮）、`tabs.css`（`<el-tabs class="is-tabbar">` 胶囊页签条：白卡内 pill，active 用 accent，仅做页面级线性导航，不渲染面板内容）、`tree.css`（节点行高 32、圆角，`highlight-current` 当前节点 accent）。第三层禁止出现任何皮肤写法。

## 原型 UI 不满足物料时（三级偏差）

| 级别 | 含义 | 落点 | 消费时 AI 的动作 |
|---|---|---|---|
| 样式级 | 结构行为不变，长相不同 | `skins/` | 占位 + 需求单 |
| 结构级 | 由白名单原语 + `.l-*` 拼出的新形态 | `ui/composites/` | **就地拼装**，外层打 `data-composite="<候选名>"`；同一候选出现 ≥2 次下沉为复合组件 |
| 行为级 | Element Plus 没有的交互 | 封装外部库或自研进 `ui/` | 最接近的白名单组件占位，打 `data-placeholder="<需求名>"`，写 `requests/` 需求单 |

`node scripts/check-prototype.js` 统计候选结构与占位；`--strict` 下占位即失败（promote 前必跑）。判断标准只有一条：**拼不出来 = 词汇表缺词，缺词只能加在第一、二层，第三层不造词。**

## 第二层 · token 约束与覆盖度（`scripts/check-layer2.mjs`）

第二层可以写样式，但**值必须来自第一层**。`pnpm build` 末尾自动跑 `check-layer2`（也可单独 `pnpm check:layer2`，`--strict` 下警告即失败）：

- 约束（错误）：`ui/**/*.vue` 的 `<style>` 与 `skins/*.css` 中，颜色 / 背景 / 边框 / 内外边距 / gap / 圆角 / 阴影 / 字号 / 宽高等视觉属性（含 `--el-*` 变量的赋值）不得出现裸色、裸长度（0 与视口单位除外）；不得引用 `--palette-*` / `--space-N`；不得在第二层定义 `--color-*` 等语义名（缺词只能提议进第一层）；不得引用 tokens.css 里不存在的名字
- 覆盖度（警告）：按文件统计消费的 token（`:style` / script 里的 `var()`、模板用到的 `.l-*` 类所消费的 token 都算），输出到 `dist/token-coverage.json` 与 `dist/token-coverage.js`——展示页「自研组件」配置卡的「脱胎第一层」面板就读这份数据，不再手工登记；既无第二层消费也未被 `--el-*` 映射引用的语义 token 列为「未消费」；复合组件至少消费 bg / text / border / space 中的三类（纯文字组件 `UiModuleHeader` 除外）

需要一个新尺寸 / 字号档位时，先看 token 表能否复用（例如 13px 一律用 `--font-size-caption`），复用不了再在 tokens.css 加语义名，并在台账登记。

## 第二层 · 自研组件（`ui/`）

全局注册，模板中直接使用；类型从 `@virtual/design-system` 导入。外壳与页面级组件在 `ui/`，结构级下沉的复合组件在 `ui/composites/`。

### `UiShell`

页面外壳：顶栏 + 可折叠侧栏（小屏自动变抽屉）。尺寸全部来自 `--layout-*`。外壳固定为视口高，侧栏与主内容区各自在 `ElScrollbar` 内滚动，window 不滚动。

| prop / event | 类型 | 说明 |
|---|---|---|
| `title` | `string` | 产品名 |
| `menu` | `{ key, label, icon?, group?, badge?, children?, disabled? }[]` | 侧栏菜单，**层级不限**（`children` 递归，内部由 `UiShellMenu.vue` 渲染；父项徽标自动汇总子级）。`icon` 取内置图标名（dashboard / map / monitor / alarm / incident / enterprise / emergency / device / quality / stats / settings），**折叠态只剩图标，不给 icon 折叠后就是空白行**；`group` 在该项前插一条分组标题（折叠时隐藏）；`badge` 为数字徽标（如告警待办数） |
| `activeKey` | `string` | 当前高亮；正式项目由路由驱动，原型由 state 驱动 |
| `v-model:collapsed` | `boolean` | 侧栏折叠 |
| `@select` | `(key) => void` | 点击菜单 |
| slot `default` | | 内容区，**第三层需用 `.l-page` 包裹** |
| slot `header-actions` / `logo` | | 顶栏右侧 / 左侧自定义 |

```html
<UiShell title="示例系统" :menu="menu" :active-key="state.route" v-model:collapsed="state.collapsed" @select="k => state.route = k">
  <div class="l-page"> … </div>
</UiShell>
```

### `UiPageHeader`

| prop | 类型 |
|---|---|
| `title` | `string` |
| `subtitle` | `string?` |
| slot `breadcrumb` / `actions` | 标题上方面包屑（用 `.ui-page-header__sep` 作分隔）/ 右侧按钮组 |

```html
<UiPageHeader title="订单列表" subtitle="共 128 条">
  <template #actions><ElButton type="primary">新建</ElButton></template>
</UiPageHeader>
```

### `UiState`

| prop / event | 类型 | 说明 |
|---|---|---|
| `state` | `'ready' \| 'loading' \| 'empty' \| 'error'` | ready 时渲染默认插槽 |
| `emptyText` / `errorText` / `errorHint` | `string?` | |
| slot `action` | | empty 态的操作按钮 |
| `rows` | `number?` | 骨架行数 |
| `@retry` | | error 态点击重试 |

```html
<UiState :state="state.view" @retry="load">
  <ElTable :data="rows" />
</UiState>
```

### `UiTuner`

调参浮窗：把第一层语义 token 变成实时可调的控件，改动写在 `:root` 的 inline style 上，整站联动（Element Plus 组件的圆角 / 边框经 `--el-*` 映射自第一层，不需要单独配）。

| prop / 行为 | 说明 |
|---|---|
| `title` | 浮窗标题，默认「调参 · 第一层」 |
| 渲染 | 一个「调参」入口按钮 + 打开后的浮窗；按标题栏拖动、可收起、可关闭 |
| 数据源 | `window.DS_TOKENS`（`dist/tokens.js`），清单不手工维护；页面必须引入该脚本，否则面板为空 |
| 控件 | 颜色→取色器、纯 px→滑块、其余→文本框；形态由**首次覆盖时冻结的基线值**决定，调整过程中不变形 |
| 值格 | 可直接打字改精确值，清空即恢复默认；「全部重置」「复制为 tokens.css」在底部 |

**之所以是第二层组件而不是页面里的一段代码**：原型（第三层）禁止 `<style>` 与 inline style，调参面板必须有自己的样式，只能住在允许写样式的第二层。展示页与任意原型都用 `<ui-tuner></ui-tuner>` 接入。

### `UiModuleHeader`（composites）

模块标题行：`title`（14 / 600）+ `desc`（12 / muted）+ `meta` 插槽（右侧，主色 12 / 500）。五套页面模板每个模块都用它。

### `UiListItem`（composites）

列表项：头像 / 标题 / 副标题 …… 状态胶囊 + 操作 + 箭头。由 `.l-cluster` + `.l-inline` + `.l-stack--tight` + ElAvatar + ElTag 拼成。`active` 用 `--color-bg-accent` 高亮当前项，`divided` 加分割线。

| prop / slot / event | 类型 | 说明 |
|---|---|---|
| `title` / `subtitle` | `string` | |
| `avatar` | `string?` | 取首字；给 `leading` 插槽时忽略 |
| `status` | `{ label, type? }` | 右侧标签 |
| `clickable` / `@click` | `boolean` | hover 高亮 + 右侧箭头 |
| `active` / `divided` | `boolean` | 当前项高亮 / 底部分割线 |
| slot `leading` / `trailing` | | 左侧自定义 / 右侧操作 |

### `UiFilterBar`（composites）

表格上方筛选条（对齐参考 PuiSearch），整条包在 `--color-bg-subtle` 圆角容器里：默认插槽放「label + 控件」对——`<span class="l-inline"><small>企业名称</small><el-input/></span>`，控件宽度取 `--layout-control-w`；紧跟其后依次是 `searchable`（默认 true，primary「搜索」，`@search`）、`resettable`（默认 true，「重置」，`@reset`）、`advanced`（「高级搜索」）；`summary` 插槽放摘要，`actions` 插槽放右侧主操作（导出 / 新增）。窄屏时筛选项先换行，右侧操作区落到下一行右对齐。

高级搜索用**浮窗**承载：把展开项放进 `#advanced` 插槽（同样是「label + 控件」对），组件内部用 `ElPopover` 弹出，展开不改变筛选条高度，下方表格不会被推下去；`@toggle(open)` 带出展开状态。不给 `#advanced` 插槽时退化为纯文字链接，只 `emit('toggle')`，展开区由第三层自理。

### `UiStatCard`（composites）

| prop | 类型 | 说明 |
|---|---|---|
| `label` / `value` / `unit` | | 数值为 number 时自动千分位；数值字号 `--font-size-display` |
| slot `icon` | | 右上角图标（accent 圆角底） |
| `trend` | `number?` | 百分比；0 显示「持平」；胶囊在右上角（给 `icon` 插槽时下移到数值行） |
| `upIsGood` | `boolean?` | 不传 → 主色胶囊（参考站风格）；传了 → 按好坏用语义色 |
| `hint` | `string?` | 说明 |

## 页面排版模板（布局配置）

原型开发第一步是**选模板**，五套骨架覆盖后台绝大多数页面：

| 编号 | 模板 | 结构 |
|---|---|---|
| 01 | 统计模板 | UiPageHeader → `.l-grid--cols-4` × UiStatCard → `.l-grid--cols-2` 分析模块 → 概况模块 → 进度模块 |
| 02 | 纯表格页 | 面包屑 → `.l-module.l-fill`（UiFilterBar + `#advanced` 浮窗 → `ElTable.l-fill` → ElPagination 右对齐） |
| 03 | 统计 + 表格 | 01 的统计行 + 02 的表格模块上下组合 |
| 04 | 左树 + 表格 | UiPageHeader → `.l-split`（左 `.l-module` ElTree，右 02 的表格模块） |
| 05 | TabBar + 表格 | UiPageHeader → ElTabs → 02 的表格模块 |

骨架定义在 `showcase.data.js` 的 `TEMPLATES`（单一来源），展示页「布局配置」可预览并复制。模板内只有 `.l-*` 与白名单 / 自研组件，间距全部来自 token：page 用 `--space-page-pad-*`，模块之间 `--space-module-gap`，模块内标题到内容 `--space-module-title`。

## 组件需求单（`requests/`）

原型阶段做不出来的 UI，复制 `requests/_template.md` 为 `<日期>-<name>.md`，由第二层负责人判定级别后实施。流程见 `requests/README.md`。

## 展示页 `showcase.html`

预览：仓库根目录 `pnpm dev`（自动打开 `http://localhost:5173/packages/design-system/showcase.html`），或直接双击打开文件（需能访问 jsdelivr CDN）。文档站式排版：顶栏路由页签 + 左侧分组锚点 + 内容限宽 + 右侧本页目录；右上角实时切换主色 / 密度 / 深色。

| 路由 | 内容 |
|---|---|
| `#/tokens` 设计变量 | 功能色色卡、bg / text / border / icon 分列、间距作用域×关系阶梯尺（条宽即真实值）、字体样张、圆角 / 阴影 / 边框、布局尺寸；原始刻度与 `--el-*` 映射默认折叠 |
| `#/materials` 组件物料 | **Element Plus 全部组件**按官方分类逐一渲染；每张卡片：舞台区、白名单 / 需提议标记、驱动 token 注脚（点击复制）、复制用法 |
| `#/layout` 布局范式 | `.l-*` 布局类逐一示意 |
| `#/custom` 自研组件 | 自研组件（外壳 / 页面级 / 复合组件）的**配置卡**：舞台 + 结构标签 + 「脱胎第一层」面板（可临时调整该组件消费的 token 验证联动）+ Props / Slots / Events + 用法 |
| `#/templates` 布局配置 | **五套页面排版模板**（参考 HY Compiler Studio 页面排版模板）：01 统计 / 02 纯表格 / 03 统计 + 表格 / 04 左树 + 表格 / 05 TabBar + 表格，在同一个 UiShell 应用壳内切换预览；右上角芯片显示 page / module / header / sidebar 当前值；「复制页面骨架」得到可直接放进原型 `.l-page` 的内容 |

数据来源：`scripts/build-tokens.mjs` 解析 `tokens.css` + `whitelist.json` 生成 `dist/tokens.js`（file:// 下无法读样式表规则，故预抽取）；组件清单与演示模板在 `showcase.data.js`。**改了 tokens.css 或 whitelist.json 后必须重新 `pnpm build`**，否则展示页的变量清单 / 白名单标记会过期（解析值仍是实时的）。新增第二层组件时同步在 `showcase.data.js` 的 `CUSTOM` 登记。

## 构建

```bash
pnpm --filter @virtual/design-system build   # ① vite → dist/ui.iife.js + ui.css（会清空 dist）② build-tokens → dist/tokens.js(.json) ③ check-layer2 → dist/token-coverage.js(.json)；产物需提交
```
