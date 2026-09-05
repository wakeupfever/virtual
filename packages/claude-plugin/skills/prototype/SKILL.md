---
name: prototype
description: "Turn a natural-language feature requirement into a single-file interactive HTML prototype in the virtual workspace's apps/prototypes/, following the frozen layer-1 tokens and layer-2 component whitelist, then self-check it with check-prototype.js."
argument-hint: "[功能需求描述]"
disable-model-invocation: true
---

# prototype · 需求 → 可交互原型

把一句自然语言需求变成 `apps/prototypes/<功能>.html`：单文件、可直接双击打开、只引用第一、二层。

## 0. 先注入规范

执行 `layer-rules` 技能的读取步骤（`CLAUDE.md`、`packages/design-system/README.md`、`whitelist.json`）。**没读到就不要动手** —— 白名单和自研组件的 props 每次都可能变，凭记忆写出来的原型十有八九过不了检查。

## 1. 选页面模板（第一步，不能跳）

五套骨架覆盖后台绝大多数页面，定义在 `packages/design-system/showcase.data.js` 的 `TEMPLATES`：

| 编号 | 模板 | 什么时候用 |
|---|---|---|
| 01 | 统计模板 | 只有统计与分析模块，无列表 |
| 02 | 纯表格页 | 标准查询 + 表格 |
| 03 | 统计 + 表格 | 上面一行统计卡，下面一个列表 |
| 04 | 左树 + 表格 | 需要按组织 / 分类筛选 |
| 05 | TabBar + 表格 | 同一列表分几个页签 |

跑 `pnpm dev` 打开展示页 `#/templates` 可以逐套预览、点「打开整页」看真实效果、「复制页面骨架」拿到可直接粘进 `.l-page` 的内容。组合不出来的再走 §2.1 三级偏差。

**表格页（02～05）用高度填充写法**：`<div class="l-page l-page--fill">` + 承载表格的模块加 `.l-fill` + `<el-table class="l-fill">`，不要给 `el-table` 传 `height`。统计页不加 `--fill`。

## 2. 从模板复制起步

以 `apps/prototypes/_template.html` 为起点复制成 `apps/prototypes/<功能名>.html`，**保留四个区块及其注释**，不要重排顺序：

| 区块 | 放什么 |
|---|---|
| ① `DATA` | mock 数据。必须含三类样本：常规、长文本、大数据量 |
| ② `state` | `Vue.reactive`。必须能切 `ready / loading / empty / error` 四态，用 `<ui-state>` 呈现 |
| ③ `<div id="app">` | 模板。套 `<ui-shell>`，内容用 `.l-page` 包裹 |
| ④ `methods` | 写在 `setup()` 内。只读 `DATA`、只改 `state`，禁止操作 DOM 样式 |

路由用 hash：`#/<key>`，`<key>` 即 `UiShell` 菜单 key；`onSelect` 只改 `location.hash`，`state.route` 由 `hashchange` 同步（模板已内置）。

**需求文档里有菜单或路由，原型就必须有可切换的路由。** 先把需求里的一级导航原样搬进 `DATA.menu`（顺序、命名都别改），再按 `state.route` 分支渲染：本轮实现的菜单渲染真实页面，其余渲染明确占位——

```html
<div v-if="state.route === 'alarms'" class="l-page l-page--fill">…真实页面…</div>
<div v-else class="l-page l-page--fill">
  <section class="l-module l-fill">
    <ui-state class="l-fill" state="empty" :empty-text="`「${currentMenu.label}」原型尚未覆盖`">
      <template #action><small>对应需求 {{ currentMenu.prd }}</small></template>
    </ui-state>
  </section>
</div>
```

点了没反应、或所有菜单都停在同一个页面，都算没完成：菜单是信息架构的一部分，只做一个页面等于没验证架构。给 `DATA.menu` 的每一项挂上对应的需求章节号，占位页直接引用，评审时能一眼看出哪些还没做。

**in-DOM 模板的两个硬性写法**：自定义标签必须显式闭合（`<el-table-column ...></el-table-column>`，不能写成 `/>`，否则整个应用编译失败）；props 用 kebab-case（`:active-key`）。

## 3. 物料不够用时（三级偏差，四句话按顺序来）

1. **优先复合组件**：先查 README 的 `ui/` 与 `ui/composites/`，命中直接用
2. **没有就拼**：能用白名单原语 + `.l-*` 拼出来的，就地拼装，外层打 `data-composite="<候选名>"`（kebab-case），拼装过程不写任何样式
3. **拼不出就占位**：需要写样式才能成立的（叠放、连接线、横向滚动列…），用最接近的白名单组件占位并打 `data-placeholder="<需求名>"`，同时复制 `packages/design-system/requests/_template.md` 写需求单
4. **第三层永不写样式**：任何情况下不加 `<style>`、inline style、`--el-*` 覆盖或 flex/grid

## 4. 自检后再汇报

```bash
node scripts/check-prototype.js
```

通过才算完成。脚本会同时统计 `data-composite` 候选（同一候选 ≥2 次提示下沉为复合组件）与 `data-placeholder` 占位清单——这两个数字要在汇报里如实说出来，它们是第二层演进的输入。

## 汇报格式

- 选了哪套模板、为什么
- 三类样本与四态分别怎么覆盖的
- 走了三级偏差的地方：候选结构有哪些、占位有哪些、需求单写在哪
- `check-prototype.js` 的实际输出

不要写"已按规范完成"这种没有信息量的结论。
