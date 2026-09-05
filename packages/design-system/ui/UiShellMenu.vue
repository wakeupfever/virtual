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

/**
 * 内置图标集：24×24 线性图标的 path。放在第二层是为了让原型不必再引一个图标 CDN。
 * 每个字形都画在同一光学网格上——可见范围锁定 x/y ∈ [4, 20]、中心 (12, 12)。
 * 网格不统一时侧栏虽然几何左对齐（同一个 .el-icon 起点），字形却会一格左一格右，看着像没对齐。
 * 新增图标后用 getBBox() 复核 x≈4、宽≈16、cx≈12、cy≈12 再提交。
 */
export const ICONS = {
  dashboard: 'M4 13h7V4H4v9Zm0 7h7v-5H4v5Zm9 0h7v-9h-7v9Zm0-16v5h7V4h-7Z',
  map: 'M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2Zm0 0v14m6-12v14',
  monitor: 'M4 12h3.5l2-6 3 12 3-9 2 3H20',
  alarm: 'M12 4a6 6 0 0 0-6 6v3.5L4 17h16l-2-3.5V10a6 6 0 0 0-6-6Zm-2 13a2 2 0 0 0 4 0',
  incident: 'M12 4 4 20h16L12 4Zm0 6v5m0 3h.01',
  enterprise: 'M4 20V8l8-4 8 4v12M9.5 20v-5h5v5M8.5 11h.01M12 11h.01M15.5 11h.01',
  emergency: 'M12 4 4.5 7v5.5c0 4 3 7 7.5 8.5 4.5-1.5 7.5-4.5 7.5-8.5V7L12 4Zm0 5.5v4.5m0 2.5h.01',
  device: 'M4 4.5h16v10.5H4V4.5Zm4 15h8m-4-4.5v4.5',
  quality: 'M4 5.5h16M4 11h9M4 16.5h6M13 17.5l2 2 5-5',
  stats: 'M4.5 20V10.5M9.5 20V4M14.5 20v-7M19.5 20V7.5',
  settings: 'M4 9h9M17 9h3M4 15h3M11 15h9M15 6.5v5M9 12.5v5',
  default: 'M12 6.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z',
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

const props = withDefaults(defineProps<{ items: UiShellMenuItem[]; depth?: number }>(), { depth: 0 })

/** 顶层没给 icon 时回退到默认图标（折叠态要靠它辨认）；子层不给就不渲染，避免出现一条横杠 */
const showIcon = (item: UiShellMenuItem) => !!item.icon || props.depth === 0

const iconPath = (item: UiShellMenuItem) => ICONS[item.icon ?? 'default'] ?? ICONS.default
</script>

<template>
  <template v-for="item in items" :key="item.key">
    <div v-if="item.group" class="ui-shell__group"><span>{{ item.group }}</span></div>

    <ElSubMenu
      v-if="item.children && item.children.length"
      :index="item.key"
      :disabled="item.disabled"
      popper-class="ui-shell__popper"
    >
      <template #title>
        <i v-if="showIcon(item)" class="el-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path :d="iconPath(item)"></path>
          </svg>
        </i>
        <span class="ui-shell__text">{{ item.label }}</span>
        <span v-if="sumBadge(item)" class="ui-shell__badge">{{ sumBadge(item) }}</span>
      </template>
      <UiShellMenu :items="item.children" :depth="depth + 1" />
    </ElSubMenu>

    <ElMenuItem v-else :index="item.key" :disabled="item.disabled">
      <i v-if="showIcon(item)" class="el-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path :d="iconPath(item)"></path>
        </svg>
      </i>
      <template #title>
        <span class="ui-shell__text">{{ item.label }}</span>
        <span v-if="item.badge" class="ui-shell__badge">{{ item.badge }}</span>
      </template>
    </ElMenuItem>
  </template>
</template>
