<script setup lang="ts">
/**
 * UiTuner · 第二层 · 调参浮窗
 * 把第一层语义 token 变成实时可调的控件，直接写在 :root 的 inline style 上，整站联动
 * （Element Plus 组件的圆角 / 边框经 --el-* 映射自第一层，不需要单独配）。
 *
 * 之所以做成第二层组件而不是页面里的一段代码：原型（第三层）禁止 <style> 与 inline style，
 * 调参面板必须有自己的样式，只能住在允许写样式的第二层。展示页与任意原型都用 <UiTuner> 接入。
 *
 * token 清单不手工维护：由 dist/tokens.js（window.DS_TOKENS）驱动，改 tokens.css 自动跟着变。
 */
import { computed, reactive, ref, onMounted, onBeforeUnmount } from 'vue'
import { ElButton, ElInput, ElSlider, ElColorPicker, ElScrollbar } from 'element-plus'

withDefaults(defineProps<{ title?: string }>(), { title: '调参 · 第一层' })

type Group = { id: string; label: string }
const GROUPS: Group[] = [
  { id: 'color', label: '颜色' }, { id: 'space', label: '间距' }, { id: 'radius', label: '圆角' },
  { id: 'border', label: '边框' }, { id: 'shadow', label: '阴影' }, { id: 'font', label: '字体' },
  { id: 'layout', label: '布局尺寸' }, { id: 'z', label: '层级' },
]

const open = ref(false)
const min = ref(false)
const dragging = ref(false)
const query = ref('')
const pos = reactive({ x: 0, y: 0 })
const overrides = reactive<Record<string, string>>({})
const draft = reactive<Record<string, string>>({})
const tick = ref(0)
const root = ref<HTMLElement | null>(null)
const probe = ref<HTMLElement | null>(null)

/** 只读 window.DS_TOKENS（build:ds 产物）；拿不到就渲染成空清单而不是报错 */
type TokenGroup = { id: string; tokens: Array<{ name: string }> }
const tokenGroups = computed(() => {
  const t = (globalThis as unknown as { DS_TOKENS?: { groups?: TokenGroup[] } }).DS_TOKENS
  const groups: TokenGroup[] = t?.groups ?? []
  const q = query.value.trim().toLowerCase()
  return GROUPS
    .map(g => ({
      ...g,
      tokens: (groups.find(x => x.id === g.id)?.tokens ?? [])
        .map(x => x.name)
        .filter(n => !/^--breakpoint-/.test(n) && (!q || n.includes(q))),
    }))
    .filter(g => g.tokens.length)
})

/** 解析当前生效值：颜色用探针元素取 computed，长度同理 */
function resolve(name: string): string {
  void tick.value
  const el = probe.value
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  if (!el) return raw
  el.removeAttribute('style')
  el.style.backgroundColor = `var(${name})`
  const bg = getComputedStyle(el).backgroundColor
  if (bg !== 'rgba(0, 0, 0, 0)') return bg
  el.removeAttribute('style')
  el.style.width = `var(${name})`
  const w = getComputedStyle(el).width
  return w === 'auto' ? raw : w
}
const shortColor = (v: string) => {
  const m = /^rgb\((\d+), (\d+), (\d+)\)$/.exec(v || '')
  return m ? '#' + [m[1], m[2], m[3]].map(x => (+x).toString(16).padStart(2, '0')).join('') : v
}
const pxOf = (v: string) => {
  const m = /^(-?\d+(?:\.\d+)?)px$/.exec(v || '')
  return m ? Math.round(+m[1]) : 0
}
const isLen = (v: string) => /^-?\d+(?:\.\d+)?px$/.test(v || '')

const baseCache: Record<string, string> = {}
const valueOf = (n: string) => overrides[n] ?? resolve(n)
/** 基线值：首次覆盖时冻结。控件形态与滑块区间只看它，调整过程中不会变形 */
const baseOf = (n: string) => (n in baseCache ? baseCache[n] : resolve(n))
const baseRange = (gid: string, n: string): [number, number] =>
  gid === 'space' ? [0, 64] : gid === 'radius' ? [0, 48] : gid === 'border' ? [0, 8]
    : gid === 'font' ? [8, 48] : /^--layout-(header|row|thead|control-h|menu|icon)/.test(n) ? [0, 120] : [0, 480]
const kindOf = (gid: string, n: string) => {
  if (gid === 'color') return 'color'
  const b = baseOf(n)
  return isLen(b) && pxOf(b) <= baseRange(gid, n)[1] * 3 ? 'length' : 'text'
}
const rangeOf = (gid: string, n: string): [number, number] => {
  const [lo, hi] = baseRange(gid, n)
  const b = pxOf(baseOf(n))
  return [Math.min(lo, b), Math.max(hi, b)]
}

const isOn = (n: string) => n in overrides
function setOverride(n: string, v: string) {
  if (!(n in baseCache)) baseCache[n] = resolve(n)
  overrides[n] = v
  document.documentElement.style.setProperty(n, v)
}
function resetOne(n: string) {
  delete overrides[n]
  delete baseCache[n]
  document.documentElement.style.removeProperty(n)
  tick.value++
}
function resetAll() {
  for (const n of Object.keys(overrides)) {
    document.documentElement.style.removeProperty(n)
    delete baseCache[n]
    delete overrides[n]
  }
  tick.value++
}
/** 只有真的变了才写，挡住控件回吐同值触发的空写 */
const onSlide = (n: string, v: number) => { const next = `${v}px`; if (next !== valueOf(n)) setOverride(n, next) }

const draftValue = (n: string) => (n in draft ? draft[n] : shortColor(valueOf(n)))
const onDraft = (n: string, v: string) => { draft[n] = v }
function commitDraft(n: string) {
  if (!(n in draft)) return
  const v = String(draft[n]).trim()
  delete draft[n]
  if (!v) return resetOne(n)
  if (v !== valueOf(n)) { setOverride(n, v); tick.value++ }
}

const count = computed(() => Object.keys(overrides).length)
const cssText = () => `:root {\n${Object.entries(overrides).map(([n, v]) => `  ${n}: ${v};`).join('\n')}\n}`
async function copyCss() {
  const text = cssText()
  try { await navigator.clipboard.writeText(text) } catch { /* 复制失败时保持静默，值仍在面板里 */ }
}

/* 拖动：按标题栏拖，按实际尺寸钳在视口内 */
const style = computed(() => (pos.x || pos.y ? { left: `${pos.x}px`, top: `${pos.y}px`, right: 'auto', bottom: 'auto' } : {}))
let from: { dx: number; dy: number } | null = null
function clamp(x: number, y: number) {
  const pad = 8
  const r = root.value?.getBoundingClientRect()
  const w = r?.width ?? 0
  const h = r?.height ?? 40
  return {
    x: Math.min(Math.max(pad, x), Math.max(pad, window.innerWidth - w - pad)),
    y: Math.min(Math.max(pad, y), Math.max(pad, window.innerHeight - h - pad)),
  }
}
function onMove(e: PointerEvent) { if (from) Object.assign(pos, clamp(e.clientX - from.dx, e.clientY - from.dy)) }
function onUp() { from = null; dragging.value = false; window.removeEventListener('pointermove', onMove) }
function onDown(e: PointerEvent) {
  if ((e.target as HTMLElement).closest('.ui-tuner__acts')) return
  const r = root.value?.getBoundingClientRect()
  if (r && !pos.x && !pos.y) { pos.x = Math.round(r.x); pos.y = Math.round(r.y) }
  from = { dx: e.clientX - pos.x, dy: e.clientY - pos.y }
  dragging.value = true
  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp, { once: true })
}
const onResize = () => { if (open.value && (pos.x || pos.y)) Object.assign(pos, clamp(pos.x, pos.y)) }
onMounted(() => window.addEventListener('resize', onResize))
onBeforeUnmount(() => { window.removeEventListener('resize', onResize); window.removeEventListener('pointermove', onMove) })
</script>

<template>
  <ElButton class="ui-tuner__entry" size="small" @click="open = true; min = false">
    调参<span v-if="count" class="ui-tuner__n">{{ count }}</span>
  </ElButton>

  <div v-if="open" ref="root" class="ui-tuner" :class="{ 'is-min': min, 'is-dragging': dragging }" :style="style">
    <div class="ui-tuner__bar" @pointerdown="onDown">
      <span class="ui-tuner__label">{{ title }}</span>
      <span v-if="count" class="ui-tuner__n">{{ count }} 项已改</span>
      <span class="ui-tuner__acts">
        <ElButton text size="small" @click="min = !min">{{ min ? '展开' : '收起' }}</ElButton>
        <ElButton text size="small" @click="open = false">关闭</ElButton>
      </span>
    </div>

    <div v-show="!min" class="ui-tuner__head">
      <ElInput v-model="query" size="small" placeholder="筛选 token，如 radius / module / border" clearable />
      <small>改动写在 <code>:root</code> 的 inline style 上，整站实时联动；会压过深浅模式与配色预设，看完记得「全部重置」。值格可直接打字，清空即恢复默认。</small>
    </div>

    <ElScrollbar v-show="!min" class="ui-tuner__scroll">
      <div class="ui-tuner__body">
        <div v-for="g in tokenGroups" :key="g.id" class="ui-tuner__group">
          <div class="ui-tuner__title">{{ g.label }}<span>{{ g.tokens.length }}</span></div>
          <div v-for="n in g.tokens" :key="n" class="ui-tuner__row" :class="{ 'is-text': kindOf(g.id, n) === 'text', 'is-on': isOn(n) }">
            <span class="ui-tuner__name" :title="n">{{ n }}</span>
            <span v-if="kindOf(g.id, n) === 'color'" class="ui-tuner__ctl">
              <ElColorPicker
                :model-value="valueOf(n)" size="small" show-alpha
                @update:model-value="v => v ? (setOverride(n, v), tick++) : resetOne(n)"
              />
            </span>
            <span v-else-if="kindOf(g.id, n) === 'length'" class="ui-tuner__ctl">
              <ElSlider
                :model-value="pxOf(valueOf(n))" :min="rangeOf(g.id, n)[0]" :max="rangeOf(g.id, n)[1]"
                :step="1" :show-tooltip="false" size="small" @input="v => onSlide(n, v as number)" @change="tick++"
              />
            </span>
            <ElInput
              class="ui-tuner__in" :model-value="draftValue(n)" size="small"
              @update:model-value="v => onDraft(n, v)" @change="commitDraft(n)" @blur="commitDraft(n)"
            />
          </div>
        </div>
        <div v-if="!tokenGroups.length" class="ui-tuner__empty">没有匹配的 token；确认已引入 dist/tokens.js。</div>
      </div>
    </ElScrollbar>

    <div v-show="!min" class="ui-tuner__foot">
      <small>{{ count }} 项已改</small>
      <ElButton size="small" :disabled="!count" @click="resetAll">全部重置</ElButton>
      <ElButton size="small" type="primary" :disabled="!count" @click="copyCss">复制为 tokens.css</ElButton>
    </div>
  </div>
  <span ref="probe" class="ui-tuner__probe"></span>
</template>

<style>
.ui-tuner__entry .ui-tuner__n { margin-left: var(--space-inline-pad); }
.ui-tuner__probe { position: absolute; visibility: hidden; pointer-events: none; }

.ui-tuner {
  position: fixed; right: var(--space-page-pad-x); top: calc(var(--layout-header-h) + var(--space-component-gap));
  z-index: var(--z-dialog); width: var(--layout-aside-w); max-height: 100vh;
  display: flex; flex-direction: column;
  background: var(--color-bg-surface); border: var(--border-w) solid var(--color-border-muted);
  border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); overflow: hidden;
}
.ui-tuner.is-min { width: max-content; }
.ui-tuner__bar, .ui-tuner__head, .ui-tuner__foot { flex: none; }
.ui-tuner__bar {
  display: flex; align-items: center; gap: var(--space-inline-gap);
  padding: var(--space-inline-pad) var(--space-inline-pad) var(--space-inline-pad) var(--space-component-pad-x);
  background: var(--color-bg-subtle); cursor: grab; user-select: none; touch-action: none;
}
.ui-tuner:not(.is-min) .ui-tuner__bar { border-bottom: var(--border-w) solid var(--color-border-muted); }
.ui-tuner.is-dragging .ui-tuner__bar { cursor: grabbing; }
.ui-tuner__label { font-size: var(--font-size-caption); font-weight: var(--font-weight-medium); white-space: nowrap; }
.ui-tuner__n { font-size: var(--font-size-micro); font-family: var(--font-family-mono); color: var(--color-primary); }
.ui-tuner__acts { margin-left: auto; display: flex; align-items: center; }

.ui-tuner__head {
  display: flex; flex-direction: column; gap: var(--space-component-gap);
  padding: var(--space-component-pad-y) var(--space-module-pad);
  border-bottom: var(--border-w) solid var(--color-bg-muted);
}
.ui-tuner__head small { font-size: var(--font-size-micro); color: var(--color-text-muted); line-height: var(--line-height-body); }
.ui-tuner__head code { font-family: var(--font-family-mono); }

.ui-tuner__scroll { flex: 1 1 auto; min-height: 0; }
.ui-tuner__body { display: flex; flex-direction: column; gap: var(--space-module-gap); padding: var(--space-component-pad-y) var(--space-module-pad) var(--space-module-pad); }
.ui-tuner__group { display: flex; flex-direction: column; }
.ui-tuner__title {
  display: flex; align-items: baseline; justify-content: space-between; margin-bottom: var(--space-component-gap);
  font-size: var(--font-size-caption); font-weight: var(--font-weight-medium);
}
.ui-tuner__title span { font-size: var(--font-size-micro); color: var(--color-text-placeholder); font-weight: var(--font-weight-regular); }
.ui-tuner__empty { font-size: var(--font-size-micro); color: var(--color-text-placeholder); }

.ui-tuner__row { display: grid; grid-template-columns: minmax(0, 1fr) 64px 60px; gap: var(--space-inline-gap); align-items: center; min-height: var(--layout-icon-sm); }
.ui-tuner__row.is-text { grid-template-columns: minmax(0, 1fr) 0 88px; }
.ui-tuner__row + .ui-tuner__row { border-top: var(--border-w) solid var(--color-bg-subtle); }
.ui-tuner__name { font-family: var(--font-family-mono); font-size: var(--font-size-micro); color: var(--color-text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ui-tuner__row.is-on .ui-tuner__name { color: var(--color-primary); }
.ui-tuner__ctl { display: flex; align-items: center; min-width: 0; }
.ui-tuner__ctl .el-slider { width: 100%; margin: 0 var(--space-inline-gap); }
.ui-tuner__ctl .el-color-picker { --el-color-picker-size: var(--layout-icon-sm); }
.ui-tuner__in .el-input__inner { font-family: var(--font-family-mono); font-size: var(--font-size-micro); }
.ui-tuner__in .el-input__wrapper { padding-inline: var(--space-inline-pad); }
.ui-tuner__row.is-on .ui-tuner__in .el-input__wrapper { box-shadow: 0 0 0 var(--border-w) var(--color-primary) inset; }

.ui-tuner__foot {
  display: flex; align-items: center; gap: var(--space-inline-gap);
  padding: var(--space-component-pad-y) var(--space-module-pad);
  border-top: var(--border-w) solid var(--color-bg-muted); background: var(--color-bg-subtle);
}
.ui-tuner__foot small { margin-right: auto; font-size: var(--font-size-micro); color: var(--color-text-muted); }
</style>
