/**
 * design-system/ui · 第二层入口
 * 正式项目：import DesignSystemUI from '@design-system/ui' 后 app.use(DesignSystemUI)
 * 原型：<script src="../design-system/dist/ui.iife.js"> 后 app.use(DesignSystemUI)
 *      （IIFE 全局对象 DesignSystemUI 自带 install，可直接 app.use）
 */
import type { App } from 'vue'
import UiShell from './UiShell.vue'
import UiPageHeader from './UiPageHeader.vue'
import UiState from './UiState.vue'

export { UiShell, UiPageHeader, UiState }
export type { UiShellMenuItem } from './UiShell.vue'
export type { UiStateKind } from './UiState.vue'

/** 自研复合组件清单：新增组件必须同时登记到 README.md */
export const components = { UiShell, UiPageHeader, UiState } as const

export function install(app: App) {
  for (const [name, comp] of Object.entries(components)) app.component(name, comp)
}

const DesignSystemUI = { install }
export default DesignSystemUI
