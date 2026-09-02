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
| 颜色 bg | `--color-bg-{page\|surface\|subtle\|muted\|accent\|overlay\|mask}` | 页面底、卡片表面、斑马纹/hover、禁用/次级填充、主色柔和底（选中行/强调面板）、浮层、遮罩 |
| 颜色 text | `--color-text-{default\|secondary\|muted\|placeholder\|inverse}` | |
| 颜色 border | `--color-border-{default\|muted}` | |
| 颜色 icon | `--color-icon-{default\|muted}` | |
| 功能色 | `--color-{primary\|success\|warning\|danger\|info}`，`--color-primary-hover`，`--color-danger-hover` | |
| 间距 page | `--space-page-{gap\|pad-x\|pad-y\|title}` | 页面区块之间 / 内容区内边距 / 页头到正文 |
| 间距 module | `--space-module-{gap\|pad\|title}` | 卡片之间 / 卡片内边距 / 卡片标题到内容 |
| 间距 component | `--space-component-{gap\|pad-x\|pad-y\|title}` | 按钮组、表单项之间 / 组件内边距 / label 到控件 |
| 间距 inline | `--space-inline-{gap\|pad}` | 图标与文字 / tag 内边距 |
| 布局尺寸 | `--layout-{sidebar-w\|sidebar-w-collapsed\|header-h\|content-max\|content-pad\|form-label-w\|control-w\|control-w-sm}`，`--grid-cols`，`--grid-gap` | |
| 层级 | `--z-{header\|sidebar\|drawer\|dialog\|toast}` | |
| 字体 | `--font-family`，`--font-size-{page-title\|module-title\|body\|caption}`，`--line-height-{tight\|body}`，`--font-weight-{regular\|medium\|bold}` | |
| 圆角 | `--radius-{sm\|md\|lg\|full}` | |
| 阴影 | `--shadow-{sm\|md\|lg}` | |
| 边框 | `--border-w`，`--border-w-thick` | |

**第三层实际可用的间距**只有 `page`、`module` 两行与 `--space-component-gap`；组件内部间距由第二层固定。

默认配色「科技青」：主色 `#0076a3`、强调 `#00486a`、柔和底 `#e8f4f7`，中性灰带青灰色相（参考 HY Compiler Studio technology-cyan 主题）。展示页右上角「配色」可切换 Element 蓝 / 靛蓝 / 靛紫 预览，只影响预览，不改文件。

主题开关（挂在 `<html>` 上）：`data-theme="dark"` 深色；`data-density="compact" | "loose"` 密度。Element Plus 的 `--el-*` 变量已由 tokens.css 映射，**禁止**在第三层直接改 `--el-*`。

## 第一层 · 布局类（`layout.css`）

第三层禁止手写 `display: flex / grid`，只能组合以下类：

| 类 | 用途 | 变体 |
|---|---|---|
| `.l-page` | 内容区容器（最大宽 + 页面内边距），直接子元素之间自动 page-gap | — |
| `.l-page-header` | 页头（一般由 `UiPageHeader` 内部使用） | — |
| `.l-module` | 卡片 / 面板容器 | — |
| `.l-module-header` | 模块标题行 | — |
| `.l-stack` | 纵向堆叠 | `--tight`、`--loose` |
| `.l-grid` | 栅格，默认 12 列 | `--cols-2/3/4`、`--tight`；子项 `.l-span-2/3/4/6/8/12` |
| `.l-split` | 侧栏 + 主区两栏 | `--reverse` |
| `.l-cluster` | 横向可换行（按钮组、筛选条） | `--end`、`--between` |
| `.l-toolbar` | 表格上方工具条 | — |
| `.l-form` | 表单区块，label 宽度取 token | — |
| `.l-inline` | 图标 + 文字 | — |
| `.l-state` | loading / empty / error 占位容器（一般由 `UiState` 内部使用） | — |

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
| `ElPagination` | 分页 |
| `ElDialog`、`ElDrawer` | 弹层 |
| `ElMessage`、`ElMessageBox`、`ElNotification` | 反馈（命令式） |
| `ElTabs` / `ElTabPane` | 页签 |
| `ElTag`、`ElBadge` | 标记 |
| `ElSkeleton`、`ElEmpty` | 状态（一般通过 `UiState` 使用） |
| `ElMenu` / `ElMenuItem` | 仅 `UiShell` 内部使用，第三层不直接用 |

## 第二层 · 皮肤层（`skins/`）

样式级偏差的唯一落点：结构与行为不变、只是长得不一样时，在 `skins/<component>.css` 用 `--el-<component>-*` 变量或 Element Plus BEM 类覆盖，值只引用 token。`skins/index.css` 负责 `@import`。当前：`table.css`（表头次级底、行更松、hover 用 accent）、`input.css`（圆角与聚焦描边跟随 token）。第三层禁止出现任何皮肤写法。

## 原型 UI 不满足物料时（三级偏差）

| 级别 | 含义 | 落点 | 消费时 AI 的动作 |
|---|---|---|---|
| 样式级 | 结构行为不变，长相不同 | `skins/` | 占位 + 需求单 |
| 结构级 | 由白名单原语 + `.l-*` 拼出的新形态 | `ui/composites/` | **就地拼装**，外层打 `data-composite="<候选名>"`；同一候选出现 ≥2 次下沉为复合组件 |
| 行为级 | Element Plus 没有的交互 | 封装外部库或自研进 `ui/` | 最接近的白名单组件占位，打 `data-placeholder="<需求名>"`，写 `requests/` 需求单 |

`node scripts/check-prototype.js` 统计候选结构与占位；`--strict` 下占位即失败（promote 前必跑）。判断标准只有一条：**拼不出来 = 词汇表缺词，缺词只能加在第一、二层，第三层不造词。**

## 第二层 · 自研组件（`ui/`）

全局注册，模板中直接使用；类型从 `@virtual/design-system` 导入。外壳与页面级组件在 `ui/`，结构级下沉的复合组件在 `ui/composites/`。

### `UiShell`

页面外壳：顶栏 + 可折叠侧栏（小屏自动变抽屉）。尺寸全部来自 `--layout-*`。外壳固定为视口高，侧栏与主内容区各自在 `ElScrollbar` 内滚动，window 不滚动。

| prop / event | 类型 | 说明 |
|---|---|---|
| `title` | `string` | 产品名 |
| `menu` | `{ key, label, disabled? }[]` | 侧栏菜单 |
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
| slot `actions` | 右侧按钮组 |

```html
<UiPageHeader title="订单列表" subtitle="共 128 条">
  <template #actions><ElButton type="primary">新建</ElButton></template>
</UiPageHeader>
```

### `UiState`

| prop / event | 类型 | 说明 |
|---|---|---|
| `state` | `'ready' \| 'loading' \| 'empty' \| 'error'` | ready 时渲染默认插槽 |
| `emptyText` / `errorText` | `string?` | |
| `rows` | `number?` | 骨架行数 |
| `@retry` | | error 态点击重试 |

```html
<UiState :state="state.view" @retry="load">
  <ElTable :data="rows" />
</UiState>
```

### `UiListItem`（composites）

列表项：头像 / 标题 / 副标题 …… 状态 + 操作。由 `.l-cluster` + `.l-inline` + `.l-stack--tight` + ElAvatar + ElTag 拼成。

| prop / slot / event | 类型 | 说明 |
|---|---|---|
| `title` / `subtitle` | `string` | |
| `avatar` | `string?` | 取首字；给 `leading` 插槽时忽略 |
| `status` | `{ label, type? }` | 右侧标签 |
| `clickable` / `@click` | `boolean` | hover 高亮 |
| slot `leading` / `trailing` | | 左侧自定义 / 右侧操作 |

### `UiFilterBar`（composites）

表格上方工具条：默认插槽放筛选控件，`actions` 插槽放右侧按钮，`resettable`（默认 true）显示重置并 `@reset`。控件宽度取 `--layout-control-w`。

### `UiStatCard`（composites）

| prop | 类型 | 说明 |
|---|---|---|
| `label` / `value` / `unit` | | 数值为 number 时自动千分位 |
| `trend` | `number?` | 百分比，正为上升 |
| `upIsGood` | `boolean` | 上升是否为好（决定颜色），默认 true |
| `hint` | `string?` | 说明 |

## 组件需求单（`requests/`）

原型阶段做不出来的 UI，复制 `requests/_template.md` 为 `<日期>-<name>.md`，由第二层负责人判定级别后实施。流程见 `requests/README.md`。

## 展示页 `showcase.html`

预览：仓库根目录 `pnpm dev`（自动打开 `http://localhost:5173/packages/design-system/showcase.html`），或直接双击打开文件（需能访问 jsdelivr CDN）。文档站式排版：顶栏路由页签 + 左侧分组锚点 + 内容限宽 + 右侧本页目录；右上角实时切换主色 / 密度 / 深色。

| 路由 | 内容 |
|---|---|
| `#/tokens` 设计变量 | 功能色色卡、bg / text / border / icon 分列、间距作用域×关系阶梯尺（条宽即真实值）、字体样张、圆角 / 阴影 / 边框、布局尺寸；原始刻度与 `--el-*` 映射默认折叠 |
| `#/materials` 组件物料 | **Element Plus 全部组件**按官方分类逐一渲染 + 自研复合组件；每张卡片：舞台区、白名单 / 需提议标记、驱动 token 注脚（点击复制）、复制用法 |
| `#/layout` 布局范式 | `.l-*` 布局类逐一示意 |

数据来源：`scripts/build-tokens.mjs` 解析 `tokens.css` + `whitelist.json` 生成 `dist/tokens.js`（file:// 下无法读样式表规则，故预抽取）；组件清单与演示模板在 `showcase.data.js`。**改了 tokens.css 或 whitelist.json 后必须重新 `pnpm build`**，否则展示页的变量清单 / 白名单标记会过期（解析值仍是实时的）。新增第二层组件时同步在 `showcase.data.js` 的 `CUSTOM` 登记。

## 构建

```bash
pnpm --filter @virtual/design-system build   # ① vite → dist/ui.iife.js + ui.css（会清空 dist）② build-tokens → dist/tokens.js(.json)；产物需提交
```
