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
    errorHint?: string
    /** 骨架屏行数 */
    rows?: number
  }>(),
  { emptyText: '暂无数据', errorText: '加载失败', errorHint: '网络异常或服务暂不可用，请稍后重试', rows: 5 },
)

const emit = defineEmits<{ (e: 'retry'): void }>()
</script>

<template>
  <div class="ui-state">
    <ElSkeleton v-if="state === 'loading'" :rows="rows" animated />
    <ElEmpty v-else-if="state === 'empty'" :description="emptyText" :image-size="72">
      <slot name="action" />
    </ElEmpty>
    <div v-else-if="state === 'error'" class="ui-state__error l-state">
      <span class="ui-state__error-icon">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" /></svg>
      </span>
      <strong class="ui-state__error-title">{{ errorText }}</strong>
      <small class="ui-state__error-hint">{{ errorHint }}</small>
      <ElButton size="small" @click="emit('retry')">重试</ElButton>
    </div>
    <slot v-else />
  </div>
</template>

<style>
/* 加 .l-fill 时容器自身纵向排布，ready 态的表格 / 列表才能继续吃掉剩余高度 */
.ui-state.l-fill { display: flex; flex-direction: column; gap: var(--space-component-gap); }
.ui-state__error { gap: var(--space-inline-gap); }
.ui-state__error-icon { display: inline-grid; place-items: center; width: var(--layout-icon-lg); height: var(--layout-icon-lg); border-radius: var(--radius-full); background: color-mix(in srgb, var(--color-danger) 12%, var(--color-bg-surface)); color: var(--color-danger); margin-bottom: var(--space-inline-pad); }
.ui-state__error-title { color: var(--color-text-default); font-weight: var(--font-weight-medium); }
.ui-state__error-hint { color: var(--color-text-muted); }
.ui-state__error .el-button { margin-top: var(--space-inline-pad); }
</style>
