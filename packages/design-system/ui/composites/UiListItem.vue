<script setup lang="ts">
/**
 * UiListItem · 第二层 · 复合组件（结构级下沉范例）
 * 结构：[leading: 头像] [标题 / 副标题] …… [trailing: 状态胶囊 + 操作 + 箭头]
 * 由白名单原语 + .l-* 布局类拼成；本文件不写数值，只引用 token。
 */
import { ElAvatar, ElTag } from 'element-plus'

export interface UiListItemStatus {
  label: string
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
}

withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    /** 头像文字（取首字）；给了 leading 插槽时忽略 */
    avatar?: string
    /** 右侧状态胶囊；给了 trailing 插槽时仍显示在其左侧 */
    status?: UiListItemStatus
    /** 是否可点击（hover 高亮 + 右侧箭头） */
    clickable?: boolean
    /** 当前项：用 --color-bg-accent 高亮 */
    active?: boolean
    /** 底部分割线 */
    divided?: boolean
  }>(),
  { subtitle: '', avatar: '', status: undefined, clickable: false, active: false, divided: false },
)

const emit = defineEmits<{ (e: 'click'): void }>()
</script>

<template>
  <div class="ui-list-item l-cluster l-cluster--between" :class="{ 'is-clickable': clickable, 'is-active': active, 'is-divided': divided }" @click="clickable && emit('click')">
    <span class="ui-list-item__main l-inline">
      <slot name="leading">
        <ElAvatar v-if="avatar" class="ui-list-item__avatar" :size="36">{{ avatar.slice(0, 1) }}</ElAvatar>
      </slot>
      <span class="ui-list-item__text l-stack l-stack--tight">
        <strong class="ui-list-item__title">{{ title }}</strong>
        <small v-if="subtitle" class="ui-list-item__subtitle">{{ subtitle }}</small>
      </span>
    </span>
    <span class="ui-list-item__trailing l-cluster">
      <ElTag v-if="status" :type="status.type || 'info'" size="small" round>{{ status.label }}</ElTag>
      <slot name="trailing" />
      <svg v-if="clickable" class="ui-list-item__chevron" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 6l6 6-6 6" /></svg>
    </span>
  </div>
</template>

<style>
.ui-list-item { padding: var(--space-component-pad-y) var(--space-component-pad-x); border-radius: var(--radius-md); flex-wrap: nowrap; transition: background 0.15s ease; }
.ui-list-item.is-clickable { cursor: pointer; }
.ui-list-item.is-clickable:hover { background: var(--color-bg-subtle); }
.ui-list-item.is-active, .ui-list-item.is-active.is-clickable:hover { background: var(--color-bg-accent); }
.ui-list-item.is-divided { border-radius: 0; border-bottom: var(--border-w) solid var(--color-border-muted); }
.ui-list-item.is-divided:last-child { border-bottom: none; }
.ui-list-item__main { flex: 1 1 auto; min-width: 0; white-space: normal; gap: var(--space-component-gap); }
.ui-list-item__avatar { flex: none; background: var(--color-bg-accent); color: var(--color-primary); font-weight: var(--font-weight-medium); }
.ui-list-item.is-active .ui-list-item__avatar { background: var(--color-primary); color: var(--color-text-inverse); }
.ui-list-item__text { flex: 1 1 auto; gap: var(--space-component-title); min-width: 0; }
.ui-list-item__title { font-weight: var(--font-weight-medium); color: var(--color-text-default); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-list-item__subtitle { color: var(--color-text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-list-item__trailing { flex: none; }
.ui-list-item__chevron { color: var(--color-text-placeholder); }
</style>
