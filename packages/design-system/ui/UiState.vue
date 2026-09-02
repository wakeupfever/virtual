<script setup lang="ts">
/**
 * UiState · 第二层 · 状态容器
 * 统一 loading / empty / error 的呈现；state 为 'ready' 时渲染默认插槽。
 * 原型必须能切换这三种状态（R-018），正式页面接 API 后复用同一组件。
 */
import { ElButton, ElEmpty, ElSkeleton } from 'element-plus'

export type UiStateKind = 'ready' | 'loading' | 'empty' | 'error'

withDefaults(
  defineProps<{
    state: UiStateKind
    emptyText?: string
    errorText?: string
    /** 骨架屏行数 */
    rows?: number
  }>(),
  { emptyText: '暂无数据', errorText: '加载失败，请重试', rows: 5 },
)

const emit = defineEmits<{ (e: 'retry'): void }>()
</script>

<template>
  <div class="ui-state">
    <ElSkeleton v-if="state === 'loading'" :rows="rows" animated />
    <ElEmpty v-else-if="state === 'empty'" :description="emptyText" />
    <div v-else-if="state === 'error'" class="l-state">
      <span>{{ errorText }}</span>
      <ElButton size="small" @click="emit('retry')">重试</ElButton>
    </div>
    <slot v-else />
  </div>
</template>
