<script setup lang="ts">
/**
 * UiStatCard · 第二层 · 复合组件
 * 统计卡片：标签 / 数值 / 单位 / 趋势胶囊 / 说明 / 右上角图标插槽。基于 .l-module；所有值只引用 token。
 */
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    label: string
    value: number | string
    unit?: string
    /** 趋势百分比，正为上升；0 显示"持平"；undefined 不显示 */
    trend?: number
    hint?: string
    /** 趋势上升是否为好事（决定颜色） */
    upIsGood?: boolean
  }>(),
  { unit: '', trend: undefined, hint: '', upIsGood: true },
)

const display = computed(() => (typeof props.value === 'number' ? props.value.toLocaleString('zh-CN') : props.value))
const trendClass = computed(() => {
  if (props.trend === undefined || props.trend === 0) return 'is-flat'
  const good = props.trend > 0 ? props.upIsGood : !props.upIsGood
  return good ? 'is-good' : 'is-bad'
})
const trendText = computed(() => (props.trend === undefined ? '' : props.trend === 0 ? '持平' : `${Math.abs(props.trend)}%`))
</script>

<template>
  <section class="ui-stat-card l-module">
    <div class="ui-stat-card__head">
      <span class="ui-stat-card__label">{{ label }}</span>
      <span v-if="$slots.icon" class="ui-stat-card__icon"><slot name="icon" /></span>
    </div>
    <div class="ui-stat-card__value l-inline">
      <span class="ui-stat-card__num">{{ display }}</span>
      <span v-if="unit" class="ui-stat-card__unit">{{ unit }}</span>
    </div>
    <div v-if="trend !== undefined || hint" class="ui-stat-card__foot l-inline">
      <span v-if="trend !== undefined" class="ui-stat-card__trend" :class="trendClass">
        <svg v-if="trend > 0" viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
        <svg v-else-if="trend < 0" viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
        {{ trendText }}
      </span>
      <small v-if="hint" class="ui-stat-card__hint">{{ hint }}</small>
    </div>
    <slot />
  </section>
</template>

<style>
.ui-stat-card { display: flex; flex-direction: column; gap: var(--space-component-title); transition: box-shadow 0.15s ease; }
.ui-stat-card:hover { box-shadow: var(--shadow-md); }
.ui-stat-card__head { display: flex; align-items: center; justify-content: space-between; gap: var(--space-inline-gap); }
.ui-stat-card__label { font-size: var(--font-size-caption); color: var(--color-text-muted); }
.ui-stat-card__icon { display: inline-grid; place-items: center; width: 28px; height: 28px; border-radius: var(--radius-lg); background: var(--color-bg-accent); color: var(--color-primary); font-size: var(--font-size-body); }
.ui-stat-card__value { align-items: baseline; gap: var(--space-inline-pad); }
.ui-stat-card__num { font-size: var(--font-size-display); font-weight: var(--font-weight-bold); line-height: 1.1; letter-spacing: -0.3px; color: var(--color-text-default); }
.ui-stat-card__unit { font-size: var(--font-size-caption); color: var(--color-text-secondary); }
.ui-stat-card__foot { gap: var(--space-inline-gap); }
.ui-stat-card__trend { display: inline-flex; align-items: center; gap: 2px; font-size: var(--font-size-caption); font-weight: var(--font-weight-medium); padding: 1px var(--space-inline-gap); border-radius: var(--radius-full); }
.ui-stat-card__trend.is-good { color: var(--color-success); background: color-mix(in srgb, var(--color-success) 12%, var(--color-bg-surface)); }
.ui-stat-card__trend.is-bad { color: var(--color-danger); background: color-mix(in srgb, var(--color-danger) 12%, var(--color-bg-surface)); }
.ui-stat-card__trend.is-flat { color: var(--color-text-muted); background: var(--color-bg-muted); }
.ui-stat-card__hint { color: var(--color-text-muted); }
</style>
