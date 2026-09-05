---
name: promote
description: "Mechanically convert a single-file HTML prototype from the virtual workspace's apps/prototypes/ into a production Vue 3 feature under apps/web/src/features/, producing api.ts, composables, Page.vue and a DIFF.md, then gate it with lint, typecheck and pixel-level visual regression."
argument-hint: "[原型文件名，如 orders.html]"
disable-model-invocation: true
---

# promote · 原型 → 正式页面

把 `apps/prototypes/<名>.html` 机械转换为 `apps/web/src/features/<名>/`。**机械**是关键词：这一步不做设计决策，逐块映射，差异全部记进 `DIFF.md`。

## 0. 先注入规范并确认原型达标

执行 `layer-rules` 的读取步骤，然后：

```bash
node scripts/check-prototype.js --strict
```

`--strict` 下**占位即失败**。有 `data-placeholder` 说明该原型依赖尚未落地的第二层能力——此时**停下**，先按需求单把第二层补齐（单独一次对话、单独一次提交），不要在正式页面里临时写样式绕过去。

## 1. 四块逐一映射

| 原型 | 正式项目 | 怎么转 |
|---|---|---|
| `DATA` | `features/<名>/api.ts` | 导出 TypeScript 接口定义 + 同名 mock；真实接口接入前先返回 mock |
| `state`（`Vue.reactive`） | `features/<名>/composables/useXxx.ts` | 状态与方法搬进 composable，返回 `ref` / `computed`；组件里只做渲染 |
| `<div id="app">` 模板 | `features/<名>/Page.vue` | `<el-*>` → `<El*>`，`<ui-*>` → `<Ui*>`，PascalCase；只渲染 `.l-page`，外壳不进 feature |
| hash 路由 `#/<key>` | `src/router/index.ts` 的 `MENU` | 加一项 `{ key, label }`，路由由 `import.meta.glob` 自动对上 `features/<key>/Page.vue` |

同一 UI 模式在 features 内出现第二次 → 下沉为该模块 `components/` 下的业务组件，不要复制粘贴。

## 2. 结构与依赖约束

`features/<名>/` 只放 `Page.vue`、`components/`、`api.ts`、`composables/`。

- feature 之间**禁止互相 import**；跨模块共享只能下沉到第二层
- `@/` 别名只给应用层（`src/App.vue`、`src/router/`）用，feature 内一律相对路径
- 命令式 API（`ElMessage`、`ElMessageBox` 等）从 `element-plus` 具名 import
- 表格页沿用原型的高度填充写法：`.l-page--fill` + 模块 `.l-fill` + `<ElTable class="l-fill">`

ESLint 会拦下越界的写法（原生表单表格、inline style、`<style>`、Tailwind 布局类、非白名单组件、跨层跨模块 import），报错就按提示改，不要加 `eslint-disable`。

## 3. 写差异清单

`features/<名>/DIFF.md` 逐条列出原型与实现的差异及原因。典型的几类：外壳与路由由应用层统一、mock 换成真实接口、原型专有的调试控件（数据集切换、状态切换）不进正式页面。

**只写真实存在的差异**，不要为了凑数编。

## 4. 门禁

```bash
pnpm lint && pnpm typecheck
```

然后把用例加进 `tests/visual/compare.mjs` 的 `CASES`，跑：

```bash
pnpm test:visual
```

它会自动起原型与正式页面两个 dev server，喂同一份 mock、同一视口，只截 `.l-page` 做 pixelmatch。**差异 ≤ 1% 才算转换完成**；超了就看 `tests/visual/__output__/<name>-diff.png` 定位，不要调阈值。

改到第一、二层时还要补跑：

```bash
pnpm build:ds        # 含 check-layer2：第二层样式值必须来自 token
pnpm test:mutation   # 声明消费的 token 必须真的在用
```

## 汇报格式

- 四块各自映射到哪个文件
- `MENU` 加了什么
- `DIFF.md` 列了几条差异，分别是什么原因
- 门禁实际输出：lint / typecheck 结果、`test:visual` 三个方向的具体差异百分比

差异百分比要报真实数字，不要写"通过"了事。
