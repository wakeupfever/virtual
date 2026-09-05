---
rai-schema-version: 2
task: "前端分层设计需求基线（shadcn-vue 宿主对齐）"
task-key: "frontend-layered-design"
primary-target: "doc/frontend-layered-design.md"
requirement-version: "RV-001"
iteration: "IT-001"
current-changes:
  - "C-001"
status: "active"
updated: "2026-09-05"
---

# 前端分层设计需求基线 · 需求台账

## 快速摘要

- 当前需求版本：`RV-001`
- 当前工作迭代：`IT-001`
- 当前变更：`C-001` 重新基线化——Element Plus 体系整体退役，改为与 `backend_system_template`（shadcn-vue + reka-ui + Tailwind 4）宿主对齐
- 本轮目标：把「提示词 → 可交互原型 → 正式页面」这条流水线迁到脚手架技术栈上，且**原型保持可交互**
- 当前结论：**基线已建立，实施未开始**。24 条需求中 3 条 verified（沿用且已在本分支实测的检查脚本）、21 条 ready；脚手架 `D:\hy-project\backend_system_template` 正在开发中，P2（脚手架内落地）挂起等待
- 上一代基线（Element Plus，RV-023 / 56 条需求 / 29 条变更）已归档至 `doc/archive/frontend-layered-design.element-plus.rai.md`，只作历史查阅，不再作为实施依据

## 当前需求清单

### 第一层：布局层与 token 契约

- [ ] `R-001` `.l-*` 布局类是页面骨架的唯一语汇：`.l-page`（含 `--fill`）、`.l-module`、`.l-stack`（`--tight` / `--loose`）、`.l-grid`（`--cols-N` / `--tight` / `--main-aside`）、`.l-cluster`（`--end` / `--between` / `--center`）、`.l-inline`、`.l-toolbar`、`.l-split`、`.l-tile`、`.l-bars` / `.l-bar`、`.l-form`、`.l-fill`。纯 CSS 无 JS，页面层不手写 flex / grid。搬进脚手架后作为 `src/assets/css/` 的一部分。`category: ux` `status: ready`
- [ ] `R-002` 布局层依赖的变量必须由宿主 token 层提供，实测最小依赖集 26 个：`--space-page-{gap,pad-x,pad-y,title}`、`--space-module-{gap,pad,title}`、`--space-component-gap`、`--space-inline-gap`、`--layout-{sidebar-w,aside-w,content-max,control-w,control-w-sm,form-label-w}`、`--radius-{md,lg}`、`--border-w`、`--color-{primary,bg-surface,bg-subtle,border-muted,text-muted}`、`--space-10`（柱宽上限）。脚手架当前缺其中的布局尺寸与语义间距，须先补齐再迁移（见 `doc/token-mapping.md`）。`category: maintainability` `status: ready`
- [ ] `R-003` **token 真值在脚手架** `src/assets/css/theme/`（shadcn 标准层 + 项目扩展层）。virtual 不再维护第二套语义层；原 85 个语义 token 退役为对照表，仅供迁移期查阅。`category: maintainability` `status: ready`
- [ ] `R-004` 换肤沿用脚手架的 `:root.theme-<name>` 机制（并列配色风格，不是亮 / 暗模式），页面层不覆盖任何颜色变量。`category: ux` `status: ready`
- [ ] `R-005` 布局层里 3 处按 Element Plus 选择器写的控件宽度规则（`.el-input` / `.el-select` / `.el-date-editor` 与 `--el-form-label-width`，共 8 行）必须改写为 shadcn 组件的选择器或 `data-slot` 约定。`category: quality` `status: ready`

### 第二层：组件

- [ ] `R-006` 组件库为 shadcn-vue（reka-ui 无头原语 + Tailwind），组件源码归项目所有，位于脚手架 `src/components/ui/<name>/`。不再自研通用组件库，不再维护 Element Plus 白名单与皮肤层。`category: functional` `status: ready`
- [ ] `R-007` 页面外壳复用脚手架的 `hyStructure`（侧边菜单 / 递归子菜单 / 面包屑 / 换肤 / 语言 / 用户信息 / 页面内 Tab），不再自研 `UiShell`。`category: functional` `status: ready`
- [ ] `R-008` 六个业务复合组件用 shadcn 原语 + Tailwind 重写并落在脚手架 `src/components/`：状态容器（`ready | loading | empty | error`，填充态下空 / 错误态在剩余高度居中）、页头、筛选条（高级搜索为浮窗，不改变页面高度）、统计卡、列表项、模块头。`category: ux` `status: ready`
- [ ] `R-009` 图标统一 `lucide-vue-next`，页面内具名导入；不再内置自绘 SVG 图标集。`category: ux` `status: ready`
- [ ] `R-010` 页面层可用组件白名单：shadcn-vue 组件 + 项目复合组件 + 基础 HTML 标签，机械可校验。脚手架当前只装了 11 个 shadcn 组件，缺 table / select / tabs / pagination / form / date-picker 等，须先补齐。`category: quality` `status: ready`

### 第三层：原型与正式页面

- [ ] `R-011` **原型在脚手架内以页面形式存在**（`src/pages/<模块>/`），走 dev server；不再是 CDN 单文件 HTML——reka-ui 只发 ESM、shadcn 组件是项目内 `.vue` 源码，浏览器无构建跑不起来。`category: functional` `status: ready`
- [ ] `R-012` **原型必须保持可交互**，五条缺一不可：① 四区块结构保留（mock 数据 / 响应式 state / 模板 / 方法）；② mock 含常规、长文本、大数据量三套样本；③ `ready | loading | empty | error` 四态可手动切换（原型专用控件，转正式时删除）；④ 菜单每一项都能真的切换页面，未覆盖的渲染明确占位；⑤ 零后端依赖，不调真实接口，`pnpm dev` 起来即可点，或构建成静态包分发。`category: functional` `status: ready`
- [ ] `R-013` 需求文档（PRD）里有菜单或路由时，原型必须有可切换的路由：一级导航原样搬进菜单（含对应需求章节号），未实现的菜单项渲染占位并写清章节，不允许点了没反应或停在同一页面。`category: functional` `status: ready`
- [ ] `R-014` 表格页用高度填充写法：`.l-page--fill` + 承载模块 `.l-fill` + 表格 `.l-fill`，表格由父级剩余高度决定高度、表体内滚、分页贴底，不给表格传死高度。统计、表单等自然流页面不加 `--fill`。`category: ux` `status: ready`
- [ ] `R-015` 表格操作列：行内动作最多 2 个（「详情 / 查看」+ 一个状态相关动作），其余放进详情抽屉或弹窗；单元格不换行、间距统一，行高不被撑开。`category: ux` `status: ready`
- [ ] `R-016` 原型 → 正式页面的差异收敛为三类：mock 换真实接口、删除原型专用控件（三态与数据集切换）、外壳与路由交给应用层。同仓同栈后不再有跨栈重写，转换必须是机械的。`category: functional` `status: ready`
- [ ] `R-017` 正式功能目录固定四件套：`<模块>/index.vue`（或 `Page.vue`）、`api.js`、`composables/`、`components/`，外加差异清单；菜单条目与页面目录双向一致。`category: maintainability` `status: ready`

### 样式边界

- [ ] `R-018` **页面层用 `.l-*` 与语义 token，组件内部用 Tailwind**。页面层禁止 inline style、裸色值 / 裸像素、Tailwind 布局与任意值类（`flex` `grid` `p-4` `w-[..]`）；shadcn 组件源码内部按官方写法用 Tailwind，不改写成 `.l-*`（否则与上游永久分叉）。`category: maintainability` `status: ready`
- [x] `R-019` 页面层引用的 `.l-*` 类必须在布局层真实定义；写错或凭空发明类名时浏览器不报错、样式静默失效，只能靠机械检查发现。`category: quality` `status: verified`

### 门禁

- [ ] `R-020` 页面合规检查：禁 inline style / 裸值 / 非白名单组件 / Tailwind 布局类 / 不存在的 `.l-*` 类 / 自闭合自定义标签（若仍有 in-DOM 模板场景）；原型必备结构（四区块、三样本、四态）缺失即失败。`category: quality` `status: ready`
- [ ] `R-021` 结构检查：页面目录四件套齐全、菜单条目 ↔ 页面目录双向一致、差异清单非空、视觉回归用例存在。`category: quality` `status: ready`
- [x] `R-022` 台账一致性由脚本机械校验：头部与摘要一致、当前变更与迭代在正文有条目、勾选框与 status 一致、编号不重复、每条需求挂到功能、每条变更进历史索引、变更条目字段齐全。接入 lint-staged 与 CI。`category: quality` `status: verified`
- [ ] `R-023` 视觉回归：原型页与正式页同栈对比，截取内容区做像素比对，差异 ≤ 1% 才算转换完成。基线随本次换栈全部作废，须重建。`category: quality` `status: ready`
- [x] `R-024` 规则只要能机械判定就必须落成检查，不能只写进文档。上一代基线里四条只写在文档中的规则全部被违反过（自闭合标签、骨架含 inline style、按钮类型不一致、发明不存在的布局类），而加了检查的规则再未复发。`category: quality` `status: verified`

## 需求追踪

| ID | 验收标准 | 来源 | 依赖 | 引入版本 | 最近变更 | 影响功能 |
|---|---|---|---|---|---|---|
| R-001 | 布局类清单在脚手架内可用；页面骨架不出现手写 flex / grid | 上一代基线沿用 | R-002 | RV-001 | C-001 | F-001 |
| R-002 | 26 个依赖变量在脚手架 token 层全部有定义，布局层无未解析变量 | 实测依赖集 | R-003 | RV-001 | C-001 | F-001, F-002 |
| R-003 | virtual 内不再存在第二套语义 token；对照表可查 | 用户决策（token 真值归脚手架） | — | RV-001 | C-001 | F-002 |
| R-004 | 切换 `theme-default` / `theme-dark` 时页面层无颜色覆盖，DOM 与逻辑不变 | 脚手架 AGENTS.md | R-003 | RV-001 | C-001 | F-002 |
| R-005 | 布局层 grep 无 `.el-` 选择器与 `--el-*` 变量 | 实测 8 行 | R-001 | RV-001 | C-001 | F-001 |
| R-006 | 页面与复合组件只引用 `src/components/ui/*` 与项目组件，无 Element Plus 引用 | 用户决策（换栈） | — | RV-001 | C-001 | F-003 |
| R-007 | 原型页与正式页共用 `hyStructure`，virtual 内不再有外壳组件 | 脚手架现状 | R-006 | RV-001 | C-001 | F-003, F-004 |
| R-008 | 六个复合组件在脚手架内可用；筛选条高级搜索前后页面高度不变；填充态空态上下留白对称 | 上一代基线沿用 | R-006, R-018 | RV-001 | C-001 | F-003 |
| R-009 | 页面无自绘图标集；图标均来自 lucide 具名导入 | 脚手架 AGENTS.md | R-006 | RV-001 | C-001 | F-003 |
| R-010 | 白名单文件存在且被检查脚本消费；缺失组件清单明确列出 | 对话结论 | R-006 | RV-001 | C-001 | F-003, F-006 |
| R-011 | 原型以 dev server 页面形式打开并可交互；无 CDN 单文件依赖 | 用户决策（原型搬进脚手架） | R-006 | RV-001 | C-001 | F-004 |
| R-012 | 五条逐条实测：四区块存在、三套样本可切、四态可切、菜单每项有响应、断网可点 | 用户输入（原型依然要保持可交互） | R-011 | RV-001 | C-001 | F-004 |
| R-013 | 菜单每一项点击后内容真的变化；未覆盖项显示占位与章节号 | 上一代基线沿用 | R-012 | RV-001 | C-001 | F-004 |
| R-014 | 表格页高度 = 父级剩余高度，表体内滚、分页贴底、无外层滚动；非填充页行为不变 | 上一代基线沿用 | R-001 | RV-001 | C-001 | F-001, F-004 |
| R-015 | 操作列单元格单行、行高恒定；按钮多于 2 个即报错 | 上一代基线沿用 | R-020 | RV-001 | C-001 | F-003, F-006 |
| R-016 | 差异清单只出现三类差异；无跨栈重写 | 对话结论 | R-011 | RV-001 | C-001 | F-005 |
| R-017 | 目录四件套齐全；菜单 ↔ 目录双向一致 | 用户输入（同步实际工程目录结构） | R-016 | RV-001 | C-001 | F-005, F-006 |
| R-018 | 页面层 grep 无 Tailwind 布局类与 inline style；组件内部保留官方 Tailwind 写法 | 用户决策（样式边界） | R-001, R-006 | RV-001 | C-001 | F-001, F-003 |
| R-019 | 把某个 `.l-*` 类改成不存在的名字后检查报错并非零退出 | 上一代基线沿用（已实测） | R-001 | RV-001 | C-001 | F-006 |
| R-020 | 违规样例逐条报错并非零退出 | 上一代基线沿用 | R-018, R-010 | RV-001 | C-001 | F-006 |
| R-021 | 缺文件、菜单与目录不一致、缺视觉用例三种情况各自报错 | 用户输入（约束应落在产物上） | R-017 | RV-001 | C-001 | F-006 |
| R-022 | 当前台账 0 错误；注入故障逐条命中并非零退出 | 上一代基线沿用（已实测） | — | RV-001 | C-001 | F-006 |
| R-023 | 原型页与正式页差异 ≤ 1%；基线重建后三个方向用例可跑 | 上一代基线沿用 | R-016 | RV-001 | C-001 | F-007 |
| R-024 | 新增规则时同步给出检查手段或明确记录为何不可机械化 | 上一代基线的经验教训 | — | RV-001 | C-001 | F-006 |

## 不变量

- `I-001` 分层：第一层 = 布局类 + 宿主 token 契约；第二层 = shadcn-vue 组件与项目复合组件；第三层 = 页面（原型页与正式页）。依赖方向单向 `第三层 → 第二层 → 第一层`。约束 `R-001`、`R-006`、`R-011`。
- `I-002` 原型与正式页面**同仓同栈、共用第二层**。这是机械转换与视觉回归成立的前提；一旦分栈，两者都退化为人工重写。约束 `R-011`、`R-016`、`R-023`。
- `I-003` token 真值唯一，且在脚手架。任何"再维护一套语义层"的做法都会让"改一处两端生效"失效。约束 `R-003`、`R-004`。
- `I-004` 样式边界：页面层 `.l-*` + 语义 token，组件内部 Tailwind。shadcn 组件源码不改写成 `.l-*`，避免与上游永久分叉。约束 `R-018`。
- `I-005` 原型的价值在于可交互与可点穿，不是静态稿。约束 `R-012`、`R-013`。
- `I-006` 插件技能中不复制规则原文，只写"去哪读、怎么用"，规则真值唯一。约束 `R-024`。
- `I-007` 能机械判定的规则必须落成检查；不能机械判定的要在台账里写明为何不能。约束 `R-024`、`R-019`～`R-023`。

## 功能清单

| 功能 | 名称 | 当前状态 | 对应需求 |
|---|---|---|---|
| F-001 | 布局层（`.l-*`，随迁至脚手架） | planned | R-001, R-002, R-005, R-014, R-018 |
| F-002 | token 契约（宿主为脚手架 theme/） | planned | R-002～R-004 |
| F-003 | 组件层（shadcn-vue + 项目复合组件） | planned | R-006～R-010, R-015, R-018 |
| F-004 | 原型工作流（脚手架内可交互原型） | planned | R-007, R-011～R-014 |
| F-005 | 原型 → 正式转换 | planned | R-016, R-017 |
| F-006 | 机械门禁（页面合规 / 结构 / 台账 / 类名） | active | R-010, R-015, R-017, R-019～R-022, R-024 |
| F-007 | 视觉回归 | planned | R-023 |

## 当前迭代

### IT-001 · 重新基线化与迁移准备

- 目标：把需求基线从 Element Plus 体系切换到 shadcn-vue 宿主对齐形态，并备好脚手架接入所需的输入（token 对照表、布局层依赖集）
- 范围：归档上一代台账；新建本基线；`doc/token-mapping.md`；后续 P1 对第一层的清理
- 包含变更：`C-001`
- 对应需求版本：`RV-001`
- 退出条件：新基线通过 `check:ledger`；对照表列出全部缺口；脚手架接入所需输入齐备
- 说明：P2（脚手架内落地）与 P3（门禁重建）挂起——脚手架 `backend_system_template` 仍在开发中，其 token 文件在本轮两次读取之间已经变过一次（`--el-spacing-*` → `--space-*`），此时照着写等于猜

## 当前变更

### C-001 · 重新基线化：Element Plus 体系退役，改为 shadcn-vue 宿主对齐

- 类型：`add`
- 原因：正式工程确定为 `backend_system_template`（shadcn-vue + reka-ui + Tailwind 4），其 `AGENTS.md` 明确「Element Plus 已删除，不得引用」。上一代基线的第二层（Element Plus 白名单 + 自研组件 + 皮肤层）整体失去落点
- 之前：RV-023 / 56 条需求 / 29 条变更，围绕 Element Plus 构建的三层体系；第一层 85 个语义 token + 57 条 `--el-*` 映射；第二层 8 个自研组件 + 6 个皮肤文件 + 26 个 EP 标签白名单；第三层 CDN 单文件原型 + 独立 `apps/web`
- 之后：本基线 24 条需求。四项关键决策——① 路线取「宿主对齐」：virtual 不再自建组件库，第二层由脚手架承载；② 原型搬进脚手架跑（reka-ui 只发 ESM、shadcn 组件是项目内 `.vue` 源码，单文件零构建形态不可能成立），但**必须保持可交互**；③ token 真值归脚手架，virtual 语义层退役为对照表；④ 样式边界为「页面 `.l-*`、组件内 Tailwind」
- 保留下来的（与 UI 库无关，仍然成立）：布局层 `.l-*`、高度填充写法、高级搜索浮窗、操作列约束、原型可交互与真路由、四件套目录、台账一致性检查、类名真实性检查、"能机械判定就必须落成检查"这条经验
- 作废的：Element Plus 白名单与皮肤层方法论（shadcn 无 BEM 类可覆盖）、`--el-*` 映射、自研外壳与组件库、CDN 单文件原型形态、跨栈机械转换、全部视觉回归与变异测试基线
- 关联需求：`R-001`～`R-024`
- 覆盖关系：`override` 上一代基线全部需求（已归档至 `doc/archive/frontend-layered-design.element-plus.rai.md`）
- 影响功能：`F-001 direct`、`F-002 direct`、`F-003 direct`、`F-004 direct`、`F-005 direct`、`F-006 direct`、`F-007 direct`

## 功能影响

| 变更 | 功能 | 级别 | 影响说明 | 验证要求 |
|---|---|---|---|---|
| C-001 | F-001 | direct | 布局层保留但需去 Element Plus 选择器并改由宿主 token 供给 | 布局层无 `.el-` / `--el-*`；依赖变量全部可解析 |
| C-001 | F-002 | direct | token 真值转移到脚手架 | virtual 内无第二套语义层；对照表可查 |
| C-001 | F-003 | direct | 组件层整体更换 | 页面无 Element Plus 引用 |
| C-001 | F-004 | direct | 原型形态由单文件改为脚手架内页面 | 可交互五条逐条实测 |
| C-001 | F-005 | direct | 转换差异收敛为三类 | 差异清单只含三类 |
| C-001 | F-006 | direct | 门禁规则随白名单与样式边界重写 | 违规样例逐条报错 |
| C-001 | F-007 | direct | 视觉回归基线作废 | 基线重建后可跑 |

## 实现映射

| 需求 | 位置 | 状态 | 证据 |
|---|---|---|---|
| R-001, R-002, R-005 | `packages/design-system/layout.css`（待迁移至脚手架 `src/assets/css/`） | ready | E-001 |
| R-003 | `doc/token-mapping.md` | ready | E-001 |
| R-019 | `scripts/check-prototype.js`（`LAYOUT_CLASSES` / `unknown-layout-class`） | verified | E-002 |
| R-022 | `scripts/check-ledger.mjs`、根 `package.json`、`.github/workflows/ci.yml` | verified | E-002 |
| R-024 | 上一代基线的四次实证（见归档台账 C-052 / C-053 / C-055 / C-056） | verified | E-003 |
| R-006～R-018, R-020, R-021, R-023 | 待脚手架就绪后落地 | ready | — |

## 决策与假设

- `D-001` 路线取「宿主对齐」而非「就地替换」：脚手架已自带 token 体系、外壳、图标与规则体系，virtual 再造一套组件库等于与它抢定义权，且每加一个 shadcn 组件要同步两遍。
- `D-002` 原型放弃「单文件零构建」：`reka-ui` 只发 ESM 与 CJS（实测 `package.json` 无 `unpkg` / `jsdelivr` 字段、`dist` 无 UMD），shadcn 组件是项目内 `.vue` 源码，浏览器无构建无法运行。保住「共用第二层」比保住「双击即开」更重要。
- `D-003` 样式边界选「页面 `.l-*` + 组件内 Tailwind」：把 shadcn 组件源码改写成 `.l-*` 会与上游永久分叉，每次取新组件都要手改一遍。
- `H-001` 假设脚手架愿意接受布局层（`.l-*`）与其 token 层的扩充（布局尺寸、语义间距、圆角与阴影分档、层级、密度）。若不接受，`R-001` / `R-002` 需要改为「布局能力由 Tailwind 表达」，届时重新评估。
- `H-002` 假设脚手架保持 shadcn-vue + Tailwind 4 + JS（非 TS）形态。其 `components.json` 为 `"typescript": false`，因此迁移产物按 JS 编写。

## 待确认与阻塞

- `B-001` **脚手架仍在开发中**（挂起）：`src/assets/css/theme/tokens.css` 在本轮两次读取之间已发生变化（`--el-spacing-*` → `--space-*`），且 `src/components/ui/` 只装了 11 个组件（alert-dialog / avatar / breadcrumb / button / checkbox / dialog / input / label / popover / sonner / tooltip）。P2 需等其形态稳定。
- `B-002` **组件缺口**：table / select / tabs / pagination / form / date-picker / 树 / skeleton / 空态 / tag 均未安装，需按 shadcn-vue 取用或自行实现，其中「表格 + 分页 + 筛选」是业务后台的主干。
- `B-003` **token 缺口**：脚手架 token 层缺布局尺寸（侧栏宽 / 顶栏高 / 行高 / 表头高 / 控件高与宽）、语义间距（page / module / component / inline × gap / pad / title）、圆角与阴影分档、层级 `--z-*`、密度系数。清单见 `doc/token-mapping.md`。
- `B-004` **两仓关系未定**：virtual 作为上游（只留布局层 + 规则 + 检查脚本，经 git subtree / 复制同步），还是并入脚手架后退休。影响检查脚本的落点与 CI 归属。
- `B-005` **本仓遗留物待处置**：`packages/design-system/{ui,skins,whitelist.json,showcase*}`、`apps/prototypes/*.html`、`apps/web`、`tests/visual`、`tests/mutation` 均基于 Element Plus。在新栈落地前保持可运行（作为对照与历史），落地后统一归档或删除。

## 验收证据

| ID | 需求 | 内容 | 结论 | 日期 |
|---|---|---|---|---|
| E-001 | R-001, R-002, R-003, R-005 | 布局层依赖实测：`layout.css` 消费 26 个变量（9 次 `--space-component-gap`、4 次 `--space-module-pad`、4 次 `--radius-md` 等），其中布局尺寸与语义间距在脚手架 token 层无对应定义；另有 8 行按 Element Plus 选择器写的控件宽度规则（`.el-input` / `.el-select` / `.el-date-editor` / `--el-form-label-width`）需改写。脚手架 token 实测：主题层 shadcn 标准 14 项 + 项目扩展约 40 项（`--surface` / `--menu-*` / `--user-center-*` 等）×2 套主题，主题无关层只有 6 档间距与 5 档字号 | pass | 2026-09-05 |
| E-002 | R-019, R-022 | 本分支实测：`node scripts/check-prototype.js` 三个原型通过，把 `.l-cluster--center` 改成不存在的 `l-cluster--middle` 后报 `unknown-layout-class (line 145)` 并退出 1；`node scripts/check-ledger.mjs` 对上一代台账输出 `✔ 56 条需求 · 29 条变更`，注入四类故障后逐条命中并退出 1 | pass | 2026-09-05 |
| E-003 | R-024 | 上一代基线的四次实证：仅写在文档里的规则（自定义标签必须显式闭合、从骨架起步、按钮用 link、只用第一层布局类）全部被违反过；加了机械检查的规则（token 裸值、操作列动作数、类名真实性、台账一致性）在其后未再复发 | pass | 2026-09-05 |

## 历史索引

| RV | IT | 变更 | 类型 | 需求 | 前后摘要 | 影响功能 |
|---|---|---|---|---|---|---|
| RV-001 | IT-001 | C-001 | add | R-001～R-024 | Element Plus 体系 → shadcn-vue 宿主对齐；上一代基线归档 | F-001～F-007 |

## 归档需求

上一代基线（Element Plus 体系）完整保留在 `doc/archive/frontend-layered-design.element-plus.rai.md`：RV-023 / IT-023，56 条需求、29 条变更、40 条证据。查历史演进（为什么某条规则存在、某个坑怎么踩的）去那里，**不要**把它当作实施依据。
