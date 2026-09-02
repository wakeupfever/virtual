<script setup lang="ts">
/**
 * UiListItem · 第二层 · 复合组件（结构级下沉范例）
 * 结构：[leading: 头像] [标题 / 副标题] …… [trailing: 状态 + 操作]
 * 由白名单原语 + .l-* 布局类拼成；本文件不写数值，只引用 token。
 * 来源：原型中 data-composite="list-item" 出现第二次后下沉。
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
    /** 右侧状态标签；给了 trailing 插槽时仍显示在其左侧 */
    status?: UiListItemStatus
    /** 是否可点击（hover 高亮 + 指针） */
    clickable?: boolean
  }>(),
  { subtitle: '', avatar: '', status: undefined, clickable: false },
)

const emit = defineEmits<{ (e: 'click'): void }>()
</script>

<template>
  <div class="ui-list-item l-cluster l-cluster--between" :class="{ 'is-clickable': clickable }" @click="clickable && emit('click')">
    <span class="ui-list-item__main l-inline">
      <slot name="leading">
        <ElAvatar v-if="avatar" class="ui-list-item__avatar">{{ avatar.slice(0, 1) }}</ElAvatar>
      </slot>
      <span class="ui-list-item__text l-stack l-stack--tight">
        <strong class="ui-list-item__title">{{ title }}</strong>
        <small v-if="subtitle" class="ui-list-item__subtitle">{{ subtitle }}</small>
      </span>
    </span>
    <span class="ui-list-item__trailing l-cluster">
      <ElTag v-if="status" :type="status.type || 'info'" size="small">{{ status.label }}</ElTag>
      <slot name="trailing" />
    </span>
  </div>
</template>

<style>
.ui-list-item { padding: var(--space-component-pad-y) var(--space-component-pad-x); border-radius: var(--radius-md); flex-wrap: nowrap; }
.ui-list-item.is-clickable { cursor: pointer; }
.ui-list-item.is-clickable:hover { background: var(--color-bg-subtle); }
.ui-list-item__main { flex: 1 1 auto; min-width: 0; white-space: normal; }
.ui-list-item__avatar { flex: none; background: var(--color-bg-accent); color: var(--color-primary); font-weight: var(--font-weight-medium); }
.ui-list-item__text { flex: 1 1 auto; gap: var(--space-component-title); min-width: 0; }
.ui-list-item__title { font-weight: var(--font-weight-medium); color: var(--color-text-default); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-list-item__subtitle { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ui-list-item__trailing { flex: none; }
</style>
