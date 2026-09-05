# virtual · Claude 插件

把 virtual 工作区的三层分层规范与两条流程封装成可安装的 Claude Code 插件。版本 `1.0.0`。

## 三个技能

| 技能 | 调用 | 做什么 |
|---|---|---|
| `layer-rules` | `/virtual:layer-rules` | 读取仓库里的规范真值并注入上下文；也可单独调用做合规检阅 |
| `prototype` | `/virtual:prototype <需求>` | 需求 → `apps/prototypes/<功能>.html`，跑 `check-prototype.js` 自检 |
| `promote` | `/virtual:promote <原型文件>` | 原型 → `apps/web/src/features/<名>/`，出 `DIFF.md`，跑视觉回归 |

`prototype` 与 `promote` 设了 `disable-model-invocation: true`，只在你显式调用时执行——它们会成批写文件，不该被模型自作主张地触发。`layer-rules` 允许模型自动调用，因为它只读不写。

## 安装

本仓库自身就是插件市场（根目录 `.claude-plugin/marketplace.json`）。在 Claude Code 里：

```text
/plugin marketplace add D:\git-project\virtual
/plugin install virtual@virtual
```

校验插件结构：

```bash
claude plugin validate packages/claude-plugin
```

## 规则不在插件里

技能文件**不复制**任何规则文本，只写"去哪读、怎么用"。真值永远是仓库里的这几份：

- `CLAUDE.md` —— 分层、硬性规则、三级偏差、原型与正式功能规则、命令
- `packages/design-system/README.md` —— 布局类、白名单、自研组件、皮肤、五套模板
- `packages/design-system/whitelist.json` —— 机器可读的标签白名单
- `doc/frontend-layered-design.md.rai.md` —— 需求台账

这是台账不变量 `I-006` 的要求：规范只有一份，插件跟着仓库走。改了 `CLAUDE.md`，插件行为自动跟着变，不需要同步维护第二份。

**因此本插件只对 virtual 工作区有意义。** 装到别的仓库里，技能读不到上述文件会直接停下。
