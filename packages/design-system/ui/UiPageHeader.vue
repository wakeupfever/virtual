<script setup lang="ts">
/**
 * UiPageHeader · 第二层 · 页头
 * 面包屑插槽 + 标题 + 副标题 + 右侧操作区。间距由 .l-page-header（第一层）决定。
 */
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div class="ui-page-header l-page-header">
    <div class="ui-page-header__text">
      <small v-if="$slots.breadcrumb" class="ui-page-header__crumb l-inline"><slot name="breadcrumb" /></small>
      <h1>{{ title }}</h1>
      <small v-if="subtitle">{{ subtitle }}</small>
    </div>
    <div class="l-cluster l-cluster--end">
      <slot name="actions" />
    </div>
  </div>
</template>

<style>
.ui-page-header { align-items: flex-start; }
.ui-page-header__text { display: flex; flex-direction: column; gap: var(--space-component-title); min-width: 0; }
.ui-page-header__crumb { gap: var(--space-inline-gap); color: var(--color-text-muted); }
.ui-page-header__crumb > :last-child { color: var(--color-text-secondary); }
.ui-page-header__sep { color: var(--color-text-placeholder); }
</style>
