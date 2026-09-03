# 原型与实现差异清单 · orders

来源原型：`apps/prototypes/_template.html` → `apps/web/src/features/orders/`

| 原型 | 正式 | 说明 |
|---|---|---|
| ① `DATA`（menu / statuses / orders×3 样本） | `api.ts`：`Order` / `OrderQuery` / `Page` 类型 + `fetchOrders` / `createOrder` / `removeOrder`（mock，300ms 延迟） | menu 迁到 `router/index.ts` 的 `MENU`；三套样本保留，`?dataset=long|big` 切换 |
| ② `state`（reactive 一坨） | `composables/useOrders.ts`：`filter` / `page` / `pageSize` / `rows` / `total` / `view` / `dialogOpen` / `form` | `route` / `collapsed` 归 `App.vue`（外壳级），不在 feature 内 |
| `state.view` 手动切换四态 | `view` 随请求自动流转 `loading → ready / empty / error` | 顶栏「原型状态」选择器删除（原型必备 R-018，正式无） |
| 过滤 / 分页在前端 `computed` | 过滤 / 分页交给 `fetchOrders`（服务端分页语义） | `filteredRows` / `pagedRows` 不再存在；`total` 来自接口 |
| hash 路由 `#/orders` | vue-router `/orders`（`createWebHistory`） | `onSelect` → `router.push`；R-038 |
| `<el-*>` kebab、显式闭合 | `<El*>` PascalCase、自闭合 | SFC 编译，不受 in-DOM 限制 |
| `ElementPlus.ElMessage` 全局 | `import { ElMessage, ElMessageBox } from 'element-plus'` | |
| `<ui-shell>` 在原型内 | `<UiShell>` 在 `App.vue`，feature 只渲染 `.l-page` | 外壳与路由由应用层统一 |

模板结构、`.l-*` 类、白名单组件与 props 一一对应，未新增任何样式。
