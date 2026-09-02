---
name: <组件或皮肤名，如 UiKanban / skins/button>
level: <style | structure | behavior>
status: <proposed | accepted | rejected | done>
source: <来源原型文件，如 apps/prototypes/orders.html>
date: <YYYY-MM-DD>
---

## 需要的效果

<一句话说清楚：在什么页面、什么位置、要长成什么样 / 有什么交互。可附截图或参考链接。>

## 为什么现有物料做不到

<写清尝试过的白名单组件 / .l-* 组合，以及卡在哪里（例如：需要负 margin 叠放；需要拖拽；Element Plus 没有对应组件）。>

## 建议方案

- 偏差级别：<样式级 → skins/<component>.css | 结构级 → ui/composites/<Name>.vue | 行为级 → 封装 <库名> 为 ui/<Name>.vue>
- 建议组件名 / 文件：
- props / slots / events（结构级、行为级）：
- 涉及 token：<列出要引用的 --color-* / --space-* / --radius-* 等；若需要新 token 单独说明>
- 是否需要新布局类（第一层）：<否 | 是，建议 .l-xxx 及理由>

## 占位

原型中占位标记：`data-placeholder="<name>"`，占位组件：<el-xxx>

## 判定（治理者填写）

- 结论：<接受 / 驳回 / 改为用现有 …>
- 实施提交：<commit / PR>
- 展示页登记：<showcase.data.js CUSTOM 条目>
