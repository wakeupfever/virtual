<script lang="ts">
export interface UiShellMenuItem {
  key: string
  label: string
  disabled?: boolean
  /** 内置图标名（见 ICONS）；折叠态只剩图标，不给的话折叠后是空白行 */
  icon?: keyof typeof ICONS
  /** 分组标题：出现在该项之前，折叠态收成一条分隔线 */
  group?: string
  /** 数字徽标（如告警待办数）；0 或不给不显示。父级会自动汇总子级徽标 */
  badge?: number
  /** 子菜单，层级不限；有 children 即渲染为可展开的父项 */
  children?: UiShellMenuItem[]
}

/** 内置图标集：24×24 线性图标的 path。放在第二层是为了让原型不必再引一个图标 CDN。 */
export const ICONS = {
  dashboard: 'M4 13h7V4H4v9Zm0 7h7v-5H4v5Zm9 0h7v-9h-7v9Zm0-16v5h7V4h-7Z',
  map: 'M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Zm0 0v14m6-12v14',
  monitor: 'M3 12h4l2-6 3 12 3-9 2 3h4',
  alarm: 'M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6Zm-2 16a2 2 0 0 0 4 0',
  incident: 'M12 3 2 20h20L12 3Zm0 6v5m0 3h.01',
  enterprise: 'M4 21V7l7-4 7 4v14M9 21v-5h6v5M8 10h.01M12 10h.01M16 10h.01',
  emergency: 'M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4Zm0 6v5m0 3h.01',
  device: 'M5 4h14v10H5V4Zm3 14h8m-4-4v4M9 8h6',
  quality: 'M4 7h16M4 12h10M4 17h7m6 1 2 2 4-4',
  stats: 'M4 20V10m5 10V4m5 16v-7m5 7V8',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8-3a8 8 0 0 1-.1 1.2l2 1.6-2 3.4-2.4-1a8 8 0 0 1-2 1.2l-.4 2.6h-4l-.4-2.6a8 8 0 0 1-2-1.2l-2.4 1-2-3.4 2-1.6A8 8 0 0 1 4 12c0-.4 0-.8.1-1.2l-2-1.6 2-3.4 2.4 1a8 8 0 0 1 2-1.2L8.9 3h4l.4 2.6a8 8 0 0 1 2 1.2l2.4-1 2 3.4-2 1.6c.1.4.1.8.1 1.2Z',
  default: 'M5 12h14',
} as const

/** 父项徽标 = 自身 + 所有后代之和，折叠或收起时仍能看出下面有多少待办 */
export function sumBadge(item: UiShellMenuItem): number {
  const own = item.badge ?? 0
  return (item.children ?? []).reduce((n, c) => n + sumBadge(c), own)
}
</script>

<script setup lang="ts">
/**
 * UiShellMenu · 第二层 · UiShell 内部使用的递归菜单
 * 单独成文件是为了自引用递归（层级不限）；不对外导出，第三层只通过 UiShell 的 menu prop 使用。
 */
import { ElMenuItem, ElSubMenu } from 'element-plus'

defineProps<{ items: UiShellMenuItem[] }>()

const iconPath = (item: UiShellMenuItem) => ICONS[item.icon ?? 'default'] ?? ICONS.default
</script>

<template>
  <template v-for="item in items" :key="item.key">
    <div v-if="item.group" class="ui-shell__group"><span>{{ item.group }}</span></div>

    <ElSubMenu v-if="item.children && item.children.length" :index="item.key" :disabled="item.disabled">
      <template #title>
        <span class="el-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path :d="iconPath(item)"></path>
          </svg>
        </span>
        <span class="ui-shell__text">{{ item.label }}</span>
        <span v-if="sumBadge(item)" class="ui-shell__badge">{{ sumBadge(item) }}</span>
      </template>
      <UiShellMenu :items="item.children" />
    </ElSubMenu>

    <ElMenuItem v-else :index="item.key" :disabled="item.disabled">
      <span class="el-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path :d="iconPath(item)"></path>
        </svg>
      </span>
      <template #title>
        <span class="ui-shell__text">{{ item.label }}</span>
        <span v-if="item.badge" class="ui-shell__badge">{{ item.badge }}</span>
      </template>
    </ElMenuItem>
  </template>
</template>
