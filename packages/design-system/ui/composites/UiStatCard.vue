<script setup lang="ts">
/**
 * UiStatCard · 第二层 · 复合组件
 * 统计卡片：标签 / 数值 / 单位 / 趋势 / 说明。基于 .l-module；字号与颜色只引用 token。
 */
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    label: string
    value: number | string
    unit?: string
    /** 趋势百分比，正为上升；undefined 不显示 */
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
</script>

<template>
  <section class="ui-stat-card l-module">
    <div class="ui-stat-card__label">{{ label }}</div>
    <div class="ui-stat-card__value l-inline">
      <span class="ui-stat-card__num">{{ display }}</span>
      <span v-if="unit" class="ui-stat-card__unit">{{ unit }}</span>
      <span v-if="trend !== undefined" class="ui-stat-card__trend" :class="trendClass">{{ trend > 0 ? '+' : '' }}{{ trend }}%</span>
    </div>
    <small v-if="hint" class="ui-stat-card__hint">{{ hint }}</small>
    <slot />
  </section>
</template>

<style>
.ui-stat-card { display: flex; flex-direction: column; gap: var(--space-component-title); }
.ui-stat-card__label { font-size: var(--font-size-caption); color: var(--color-text-muted); }
.ui-stat-card__value { align-items: baseline; }
.ui-stat-card__num { font-size: var(--font-size-page-title); font-weight: var(--font-weight-bold); line-height: var(--line-height-tight); color: var(--color-text-default); }
.ui-stat-card__unit { font-size: var(--font-size-caption); color: var(--color-text-secondary); }
.ui-stat-card__trend { font-size: var(--font-size-caption); font-weight: var(--font-weight-medium); padding: 0 var(--space-inline-pad); border-radius: var(--radius-sm); }
.ui-stat-card__trend.is-good { color: var(--color-success); background: color-mix(in srgb, var(--color-success) 12%, var(--color-bg-surface)); }
.ui-stat-card__trend.is-bad { color: var(--color-danger); background: color-mix(in srgb, var(--color-danger) 12%, var(--color-bg-surface)); }
.ui-stat-card__trend.is-flat { color: var(--color-text-muted); background: var(--color-bg-muted); }
.ui-stat-card__hint { color: var(--color-text-muted); }
</style>
