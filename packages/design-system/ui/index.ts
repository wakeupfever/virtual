/**
 * design-system/ui · 第二层入口
 * 正式项目：import DesignSystemUI from '@virtual/design-system' 后 app.use(DesignSystemUI)
 * 原型：<script src="../design-system/dist/ui.iife.js"> 后 app.use(DesignSystemUI)
 *      （IIFE 全局对象 DesignSystemUI 自带 install，可直接 app.use）
 *
 * 目录：ui/            外壳与页面级组件（UiShell / UiPageHeader / UiState）
 *       ui/composites/ 结构级下沉的复合组件（由原型中 data-composite 候选提炼）
 */
import type { App } from 'vue'
import UiShell from './UiShell.vue'
import UiPageHeader from './UiPageHeader.vue'
import UiState from './UiState.vue'
import UiTuner from './UiTuner.vue'
import UiListItem from './composites/UiListItem.vue'
import UiFilterBar from './composites/UiFilterBar.vue'
import UiStatCard from './composites/UiStatCard.vue'
import UiModuleHeader from './composites/UiModuleHeader.vue'

export { UiShell, UiPageHeader, UiState, UiTuner, UiListItem, UiFilterBar, UiStatCard, UiModuleHeader }
export type { UiShellMenuItem } from './UiShell.vue'
export type { UiStateKind } from './UiState.vue'
export type { UiListItemStatus } from './composites/UiListItem.vue'

/** 自研组件清单：新增组件必须同时登记到 README.md、whitelist.json（custom）与 showcase.data.js（CUSTOM） */
export const components = { UiShell, UiPageHeader, UiState, UiTuner, UiListItem, UiFilterBar, UiStatCard, UiModuleHeader } as const

export function install(app: App) {
  for (const [name, comp] of Object.entries(components)) app.component(name, comp)
}

const DesignSystemUI = { install }
export default DesignSystemUI
