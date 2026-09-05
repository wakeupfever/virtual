---
name: layer-rules
description: "Load and enforce the virtual workspace's three-layer frontend constraints before writing any third-layer code (prototypes in apps/prototypes, features in apps/web/src/features, or the design-system showcase). Use when starting, reviewing, or auditing third-layer work in this repo, or when unsure whether a change belongs to layer 1 tokens, layer 2 components, or layer 3 business code."
---

# virtual · 三层规范注入

把 virtual 工作区的分层约束读进当前上下文，作为 `prototype` / `promote` 的前置步骤，也可单独调用做检阅。

## 规则真值只有一份

**本技能不复制任何规则文本。** 仓库里的这几份文件是唯一真值，每次执行都必须实际读取，不得凭记忆作答：

| 读什么 | 得到什么 |
|---|---|
| `CLAUDE.md` | §1 分层表、§2 硬性规则、§2.1 三级偏差流程、§3 原型规则、§4 正式功能规则、§5 开发流程、§6 命令 |
| `packages/design-system/README.md` | 第一层布局类清单与高度填充写法、第二层白名单与自研组件的 props/slots、皮肤层、五套页面排版模板 |
| `packages/design-system/whitelist.json` | 第三层可用标签的机器可读清单 |
| `doc/frontend-layered-design.md.rai.md` | 需求台账：当前基线、状态、未决项。改需求走 `/rai:rai`，不要静默改文档 |

读不到这些文件说明不在 virtual 工作区，直接说明情况并停止，不要按记忆里的"一般前端最佳实践"继续。

## 判断改动属于哪一层

拿到任务先定位层级，这决定了能不能直接动手：

- **第一层**（`packages/design-system/{tokens,layout,base}.css`）——只有值与纯 CSS。改 token 的**值**可以（一处生效，原型与正式页面同步）；改语义名、加类要先提议。
- **第二层**（`packages/design-system/{ui,skins}/`、`whitelist.json`）——有行为的组件与样式级皮肤。**冻结**：缺什么走 §2.1 三级偏差流程，单独一次对话、单独一次提交。
- **第三层**（`apps/prototypes/*.html`、`apps/web/src/features/`）——自由开发区，只能引用第一、二层。

依赖方向单向：第三层 → 第二层 → 第一层。反向禁止。

## 检阅模式

被要求"检查某个文件是否合规"时，按 `CLAUDE.md` §2 逐条对照并给出**具体行号**，不要泛泛地说"符合规范"。重点看这几类最常犯的：

1. 裸写 `<button> <input> <select> <table> <form>` 等原生标签
2. inline style、`<style>` 块、裸色值（`#xxx` / `rgb()`）、裸像素值
3. 手写 `display: flex / grid` 或 Tailwind 布局类
4. `overflow: auto/scroll`（滚动只能用 `<el-scrollbar>`）
5. 引用原始刻度 `--space-N` / `--palette-*`，或覆盖 `--el-*`
6. 白名单外的 Element Plus 组件
7. in-DOM 模板里自闭合的自定义标签（`<El-x />`）——会让整个应用编译失败

能用脚本判定的一律跑脚本，别靠肉眼：

```bash
node scripts/check-prototype.js          # 原型合规
node packages/design-system/scripts/check-layer2.mjs   # 第二层 token 约束
pnpm lint                                # 第三层 ESLint 三层约束
```

## 与其他技能的关系

`prototype` 与 `promote` 都会在开工前引用本技能。单独调用时只做读取与检阅，**不修改任何文件**，除非用户明确要求修改。
