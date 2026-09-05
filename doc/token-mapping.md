# token 对照表与缺口清单（virtual → backend_system_template）

本文件是**迁移期的查阅表**，不是真值。token 真值在脚手架 `src/assets/css/theme/`（`R-003`）。

用途有两个：① 把布局层 `.l-*` 搬进脚手架时，知道它依赖哪些变量、哪些还不存在；② 把上一代 85 个语义 token 承载的设计意图，翻译成脚手架的命名。

> ⚠️ 脚手架仍在开发中：`src/assets/css/theme/tokens.css` 在 2026-09-05 的两次读取之间已经变过一次（`--el-spacing-*` → `--space-*`）。下表按当时实际内容记录，接入前需重新核对。

---

## 一、布局层的最小依赖集（26 个，实测）

`packages/design-system/layout.css` 里 `var()` 的全部引用，按出现次数排序。**这是搬迁的硬依赖**——少一个，布局层就有规则失效。

| 变量 | 用了几次 | 脚手架现状 | 建议落点 |
|---|---|---|---|
| `--space-component-gap` | 9 | ❌ 无 | 新增语义间距层，取 12px |
| `--space-module-pad` | 4 | ❌ 无 | 新增，取 20px |
| `--radius-md` | 4 | ⚠️ 只有单个 `--radius: 0.5rem` | 按 shadcn 惯例补 `--radius-sm/md/lg` = `calc(var(--radius) ± 4px)` |
| `--space-page-gap` | 3 | ❌ 无 | 新增，取 24px |
| `--space-module-title` | 2 | ❌ 无 | 新增，取 8px |
| `--space-module-gap` | 2 | ❌ 无 | 新增，取 16px |
| `--space-inline-gap` | 2 | ⚠️ 有 `--space-xs: 8px`（尺度，非语义） | 新增语义别名或直接复用 |
| `--layout-sidebar-w` | 2 | ❌ 无（`hyStructure` 内部写死） | 提到 token 层 |
| `--layout-aside-w` | 2 | ❌ 无 | 新增，取 320px |
| `--color-bg-subtle` | 2 | ✅ 近似 `--muted` / `--secondary` | 映射到 `--muted` |
| `--space-page-title` | 1 | ❌ 无 | 新增，取 12px |
| `--space-page-pad-x` | 1 | ❌ 无 | 新增，取 8px |
| `--space-page-pad-y` | 1 | ❌ 无 | 新增，取 8px |
| `--space-10` | 1 | ❌ 无（原始刻度，柱宽上限） | 就地改成具体档位或语义名 |
| `--radius-lg` | 1 | ⚠️ 同上 | 同上 |
| `--layout-form-label-w` | 1 | ❌ 无 | 新增（表单标签列宽） |
| `--layout-control-w` | 1 | ❌ 无 | 新增，取 200px |
| `--layout-control-w-sm` | 1 | ❌ 无 | 新增，取 120px |
| `--layout-content-max` | 1 | ❌ 无 | 新增，默认 `none`（业务后台铺满） |
| `--grid-gap` / `--grid-cols` | 各 1 | — | 布局层内部变量，不需宿主提供 |
| `--color-text-muted` | 1 | ✅ `--muted-foreground` | 直接映射 |
| `--color-primary` | 1 | ✅ `--primary` | 直接映射 |
| `--color-border-muted` | 1 | ✅ `--border-muted` | 直接映射 |
| `--color-bg-surface` | 1 | ✅ `--card` / `--background` | 映射到 `--card` |
| `--border-w` | 1 | ❌ 无 | 新增，取 1px |

**小结：26 个依赖里 5 个能直接映射到脚手架现有变量，2 个是布局层内部变量，其余 19 个需要脚手架 token 层新增。**

另有 3 处规则按 Element Plus 选择器写（`R-005`），迁移时必须改写：

```css
.l-form { --el-form-label-width: var(--layout-form-label-w); }
.l-cluster > .el-input, .l-cluster > .el-select, .l-cluster > .el-date-editor,
.l-toolbar > .el-input, .l-toolbar > .el-select { width: var(--layout-control-w); flex: none; }
.l-inline > .el-select, .l-inline > .el-input { width: var(--layout-control-w-sm); }
```

shadcn 组件没有稳定的类名约定，建议改为 `[data-slot="control"]` 之类的属性选择器，由复合组件统一打标。

---

## 二、语义对照（上一代 85 个 → 脚手架）

### 颜色

| virtual | 脚手架 | 说明 |
|---|---|---|
| `--color-bg-page` | `--background` | 内容区底 |
| `--color-bg-surface` | `--card` | 卡片 / 模块底 |
| `--color-bg-canvas` | `--surface` | 应用外框底（头部 / 侧栏所在的壳） |
| `--color-bg-subtle` | `--muted` | 表头、hover、次级底 |
| `--color-bg-muted` | `--secondary` | 更淡一档 |
| `--color-bg-accent` | `--accent` | 选中态浅底 |
| `--color-text-default` | `--foreground` | 正文 |
| `--color-text-secondary` | `--muted-foreground` | 次要文字（菜单项、标签） |
| `--color-text-muted` | `--muted-foreground` | 与上一档合并，脚手架未区分 |
| `--color-text-placeholder` | ⚠️ 无 | 需新增或复用 `--muted-foreground` 降透明度 |
| `--color-text-inverse` | `--primary-foreground` | 深底上的文字 |
| `--color-border-default` | `--border` | |
| `--color-border-muted` | `--border-muted` | |
| `--color-icon-default` / `--color-icon-muted` | ⚠️ 无独立图标色 | 建议新增，或统一走 `--muted-foreground` |
| `--color-primary` | `--primary` | |
| `--color-danger` / `--color-success` / `--color-warning` | `--destructive` / `--success` / `--warning` | 语义一致，命名不同 |
| `--color-info` | ⚠️ 无 | 用 `--muted-foreground` 或新增 |

### 间距

virtual 是「作用域 × 关系」的 13 个语义（`--space-{page,module,component,inline}-{gap,pad,title}`）；脚手架是 6 档尺度（`--space-3xs/2xs/xs/md/sm/xl`，注意 `md: 10px < sm: 12px`，命名顺序当前是乱的）。

**两者不是一回事**：尺度回答"多大"，语义回答"用在哪"。布局层依赖的是语义层。建议在脚手架 `tokens.css` 里按 virtual 的语义补一层，取值引用现有尺度。

### 字号

| virtual | 脚手架 | 说明 |
|---|---|---|
| `--font-size-display` | `--fs-3xl` (22px) | 统计卡数值 |
| `--font-size-page-title` | `--fs-2xl` (20px) | |
| `--font-size-module-title` | `--fs-lg` (16px) | |
| `--font-size-body` | `--fs-md` (14px) | |
| `--font-size-caption` | `--fs-sm` (12px) | |
| `--font-size-micro` (10px) | ⚠️ 无 | 需新增 |

### 圆角 / 边框 / 阴影 / 层级 / 密度

| virtual | 脚手架 | 缺口 |
|---|---|---|
| `--radius-sm/md/lg/full` | 单个 `--radius` | 补三档 + `--radius-full` |
| `--border-w` / `--border-w-thick` | 无 | 新增 |
| `--shadow-sm/md/lg` | 单个 `--shadow-light` | 补三档 |
| `--z-*`（5 级） | 无 | 新增（浮窗、抽屉、弹层的层级要可控） |
| `--density`（紧凑模式系数） | 无 | 视是否保留紧凑模式决定 |

### 布局尺寸

virtual 有 12 个 `--layout-*`（侧栏宽 / 折叠宽 / 顶栏高 / 行高 / 表头高 / 控件高 / 菜单项高 / 图标三档 / 面板宽 / 控件宽两档 / 内容区最大宽）。脚手架**一个都没有**——这些值现在写死在 `hyStructure` 与组件内部。

这是缺口最大的一块，也是布局层能否搬迁的关键：`.l-split--aside`、`.l-toolbar`、`.l-form` 都直接依赖它们。

---

## 三、结论

1. **能直接复用的**：颜色语义（大部分可一对一映射）、字号（差一个 micro）。
2. **必须在脚手架新增的**：语义间距层（13 个）、布局尺寸（12 个）、圆角三档、阴影三档、边框宽两档、层级 5 级。合计约 **35 个变量**。
3. **要重新决定的**：密度系数是否保留；图标色是否独立；`--color-text-muted` 与 `--color-text-placeholder` 是否合并。

在这 35 个变量补齐之前，布局层搬过去会有大量规则失效——所以 P2 的第一步不是搬组件，是**先补 token 层**。
