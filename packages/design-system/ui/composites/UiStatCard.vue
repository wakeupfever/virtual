<script setup lang="ts">
/**
 * UiStatCard · 第二层 · 复合组件
 * 统计卡片（对齐参考 StandardStatsMaterial）：标签 + 右上趋势胶囊（或图标插槽）/ 数值 / 说明。
 * 基于 .l-module；所有值只引用 token。
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
    /** 趋势上升是否为好事（决定颜色）；undefined 时胶囊用主色（参考站风格） */
    upIsGood?: boolean
  }>(),
  { unit: '', trend: undefined, hint: '', upIsGood: undefined },
)

const display = computed(() => (typeof props.value === 'number' ? props.value.toLocaleString('zh-CN') : props.value))
const trendClass = computed(() => {
  if (props.trend === undefined) return ''
  if (props.trend === 0) return 'is-flat'
  if (props.upIsGood === undefined) return 'is-primary'
  const good = props.trend > 0 ? props.upIsGood : !props.upIsGood
  return good ? 'is-good' : 'is-bad'
})
const trendText = computed(() => (props.trend === undefined ? '' : props.trend === 0 ? '持平' : `${props.trend > 0 ? '+' : ''}${props.trend}%`))
</script>

<template>
  <section class="ui-stat-card l-module">
    <div class="ui-stat-card__head">
      <span class="ui-stat-card__label">{{ label }}</span>
      <span v-if="$slots.icon" class="ui-stat-card__icon"><slot name="icon" /></span>
      <span v-else-if="trend !== undefined" class="ui-stat-card__trend" :class="trendClass">{{ trendText }}</span>
    </div>
    <div class="ui-stat-card__value l-inline">
      <span class="ui-stat-card__num">{{ display }}</span>
      <span v-if="unit" class="ui-stat-card__unit">{{ unit }}</span>
      <span v-if="$slots.icon && trend !== undefined" class="ui-stat-card__trend" :class="trendClass">{{ trendText }}</span>
    </div>
    <small v-if="hint" class="ui-stat-card__hint">{{ hint }}</small>
    <slot />
  </section>
</template>

<style>
.ui-stat-card { display: flex; flex-direction: column; gap: var(--space-component-title); transition: box-shadow 0.15s ease; }
.ui-stat-card:hover { box-shadow: var(--shadow-md); }
.ui-stat-card__head { display: flex; align-items: center; justify-content: space-between; gap: var(--space-component-gap); }
.ui-stat-card__label { font-size: var(--font-size-caption); color: var(--color-text-secondary); }
.ui-stat-card__icon { display: inline-grid; place-items: center; width: 28px; height: 28px; border-radius: var(--radius-md); background: var(--color-bg-accent); color: var(--color-primary); font-size: var(--font-size-body); }
.ui-stat-card__value { align-items: baseline; gap: var(--space-inline-pad); }
.ui-stat-card__num { font-size: var(--font-size-display); font-weight: var(--font-weight-bold); line-height: 1.1; letter-spacing: -0.3px; color: var(--color-text-default); font-variant-numeric: tabular-nums; }
.ui-stat-card__unit { font-size: var(--font-size-caption); color: var(--color-text-secondary); }
.ui-stat-card__trend { display: inline-flex; align-items: center; font-size: var(--font-size-micro); font-weight: var(--font-weight-medium); padding: 2px var(--space-inline-gap); border-radius: var(--radius-full); white-space: nowrap; }
.ui-stat-card__trend.is-primary { color: var(--color-primary); background: var(--color-bg-accent); }
.ui-stat-card__trend.is-good { color: var(--color-success); background: color-mix(in srgb, var(--color-success) 12%, var(--color-bg-surface)); }
.ui-stat-card__trend.is-bad { color: var(--color-danger); background: color-mix(in srgb, var(--color-danger) 12%, var(--color-bg-surface)); }
.ui-stat-card__trend.is-flat { color: var(--color-text-muted); background: var(--color-bg-muted); }
.ui-stat-card__hint { font-size: var(--font-size-micro); color: var(--color-text-muted); }
</style>
