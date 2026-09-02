# requests · 组件需求单

原型阶段发现"白名单 + 皮肤做不出来"的 UI 时，AI 在原型里用最接近的白名单组件占位（`data-placeholder="<name>"`），并从 `_template.md` 复制一份到本目录：`<YYYY-MM-DD>-<name>.md`。

治理流程：`proposed` → 第二层负责人判定（样式级 / 结构级 / 行为级 / 驳回）→ `accepted` → 单独一次对话实施到第二层并 `pnpm build:ds` → 登记 README / whitelist / showcase.data.js → `done` → 原型回填替换占位。

`node scripts/check-prototype.js` 会列出所有占位；`--strict`（promote 前）下存在占位即失败。
