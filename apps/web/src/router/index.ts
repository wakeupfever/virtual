/**
 * 路由表：key 与 UiShell 菜单 key 一致（原型 #/<key> → 正式 /<key>，R-038）。
 * 菜单即路由：新增功能 = 在 MENU 加一项 + features/<key>/Page.vue，两处不再各维护一份。
 */
import { createRouter, createWebHistory } from 'vue-router'
import type { UiShellMenuItem } from '@virtual/design-system'

export const MENU: UiShellMenuItem[] = [
  { key: 'orders', label: '订单管理' },
  { key: 'customers', label: '客户管理', disabled: true },
  { key: 'reports', label: '报表', disabled: true },
]

const pages = import.meta.glob('../features/*/Page.vue')

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: `/${MENU[0].key}` },
    ...MENU.filter(m => pages[`../features/${m.key}/Page.vue`]).map(m => ({
      path: `/${m.key}`,
      name: m.key,
      component: pages[`../features/${m.key}/Page.vue`],
      meta: { title: m.label },
    })),
  ],
})
