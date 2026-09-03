<script setup lang="ts">
/**
 * UiModuleHeader · 第二层 · 复合组件
 * 模块（卡片）标题行：标题 + 描述 + 右侧 meta 插槽。基于 .l-module-header；间距与字号只引用 token。
 * 来源：五套页面模板中每个模块都出现的同一结构（data-composite="module-header"）。
 */
defineProps<{
  title: string
  desc?: string
}>()
</script>

<template>
  <header class="ui-module-header l-module-header">
    <div class="ui-module-header__text">
      <h2 class="ui-module-header__title">{{ title }}</h2>
      <small v-if="desc" class="ui-module-header__desc">{{ desc }}</small>
    </div>
    <span v-if="$slots.meta" class="ui-module-header__meta l-cluster"><slot name="meta" /></span>
  </header>
</template>

<style>
.ui-module-header { align-items: flex-start; }
.ui-module-header__text { display: flex; flex-direction: column; gap: var(--space-inline-pad); min-width: 0; }
.ui-module-header__title { font-size: var(--font-size-body); font-weight: var(--font-weight-bold); line-height: var(--line-height-tight); }
.ui-module-header__desc { color: var(--color-text-muted); }
.ui-module-header__meta { flex: none; font-size: var(--font-size-caption); font-weight: var(--font-weight-medium); color: var(--color-primary); }
</style>
