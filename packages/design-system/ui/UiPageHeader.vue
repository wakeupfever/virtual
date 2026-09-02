<script setup lang="ts">
/**
 * UiPageHeader · 第二层 · 页头
 * 标题 + 副标题 + 右侧操作区。间距由 .l-page-header（第一层）决定。
 */
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div class="ui-page-header l-page-header">
    <div class="ui-page-header__text">
      <h1>{{ title }}</h1>
      <small v-if="subtitle">{{ subtitle }}</small>
    </div>
    <div class="l-cluster l-cluster--end">
      <slot name="actions" />
    </div>
  </div>
</template>

<style>
.ui-page-header__text { display: flex; flex-direction: column; gap: var(--space-component-title); }
</style>
