<script setup lang="ts">
/**
 * UiFilterBar · 第二层 · 复合组件
 * 表格 / 列表上方筛选条：整条包在 --color-bg-subtle 圆角容器里；
 * 默认插槽放筛选控件，summary 插槽放摘要（如"已选 N 项"），actions 插槽放右侧按钮；可选「重置」文字链接。
 */
import { ElButton } from 'element-plus'

withDefaults(
  defineProps<{
    /** 显示重置 */
    resettable?: boolean
    resetText?: string
  }>(),
  { resettable: true, resetText: '重置' },
)

const emit = defineEmits<{ (e: 'reset'): void }>()
</script>

<template>
  <div class="ui-filter-bar l-toolbar">
    <span class="ui-filter-bar__filters l-cluster">
      <slot />
      <ElButton v-if="resettable" link type="primary" @click="emit('reset')">{{ resetText }}</ElButton>
    </span>
    <span class="ui-filter-bar__right l-cluster l-cluster--end">
      <small v-if="$slots.summary" class="ui-filter-bar__summary"><slot name="summary" /></small>
      <slot name="actions" />
    </span>
  </div>
</template>

<style>
.ui-filter-bar { padding: var(--space-component-pad-y) var(--space-component-pad-x); background: var(--color-bg-subtle); border-radius: var(--radius-lg); }
.ui-filter-bar__filters { flex: 1; min-width: 0; }
.ui-filter-bar__right { flex: none; }
.ui-filter-bar__summary { color: var(--color-text-muted); }
</style>
