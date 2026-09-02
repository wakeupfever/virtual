<script setup lang="ts">
/**
 * UiFilterBar · 第二层 · 复合组件
 * 表格 / 列表上方工具条：左侧筛选控件（默认插槽），右侧操作（actions 插槽），可选「重置」。
 * 基于 .l-toolbar / .l-cluster，控件宽度由 --layout-control-w 决定。
 */
import { ElButton } from 'element-plus'

withDefaults(
  defineProps<{
    /** 显示重置按钮 */
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
      <ElButton v-if="resettable" @click="emit('reset')">{{ resetText }}</ElButton>
    </span>
    <span class="ui-filter-bar__actions l-cluster l-cluster--end">
      <slot name="actions" />
    </span>
  </div>
</template>

<style>
.ui-filter-bar__filters { flex: 1; min-width: 0; }
.ui-filter-bar__actions { flex: none; }
</style>
