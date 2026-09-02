<script setup lang="ts">
/**
 * UiShell · 第二层 · 页面外壳
 * 侧边栏折叠 / 当前菜单高亮 / 小屏下侧边栏变抽屉。
 * 所有尺寸取自 tokens.css 的 --layout-*，本文件不写任何数值。
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ElButton, ElDrawer, ElMenu, ElMenuItem } from 'element-plus'

export interface UiShellMenuItem {
  key: string
  label: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    /** 顶栏 / 侧栏顶部显示的产品名 */
    title?: string
    /** 侧栏菜单项 */
    menu?: UiShellMenuItem[]
    /** 当前高亮菜单 key（正式项目由路由驱动，原型由 state 驱动） */
    activeKey?: string
    /** 侧栏是否折叠（v-model:collapsed） */
    collapsed?: boolean
  }>(),
  { title: '', menu: () => [], activeKey: '', collapsed: false },
)

const emit = defineEmits<{
  (e: 'update:collapsed', value: boolean): void
  (e: 'select', key: string): void
}>()

const isMobile = ref(false)
const drawerOpen = ref(false)
let mql: MediaQueryList | null = null

function syncMedia() {
  if (!mql) return
  isMobile.value = mql.matches
  if (!isMobile.value) drawerOpen.value = false
}

onMounted(() => {
  const bp = getComputedStyle(document.documentElement).getPropertyValue('--breakpoint-md').trim() || '768px'
  mql = window.matchMedia(`(max-width: ${bp})`)
  syncMedia()
  mql.addEventListener('change', syncMedia)
})
onBeforeUnmount(() => mql?.removeEventListener('change', syncMedia))

const sidebarWidth = computed(() =>
  props.collapsed ? 'var(--layout-sidebar-w-collapsed)' : 'var(--layout-sidebar-w)',
)

function toggle() {
  if (isMobile.value) drawerOpen.value = !drawerOpen.value
  else emit('update:collapsed', !props.collapsed)
}

function onSelect(key: string) {
  emit('select', key)
  if (isMobile.value) drawerOpen.value = false
}
</script>

<template>
  <div class="ui-shell" :class="{ 'is-collapsed': collapsed, 'is-mobile': isMobile }">
    <!-- 顶栏 -->
    <header class="ui-shell__header">
      <div class="ui-shell__header-left l-inline">
        <ElButton text circle class="ui-shell__toggle" aria-label="切换侧边栏" @click="toggle">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </ElButton>
        <slot name="logo">
          <span class="ui-shell__title">{{ title }}</span>
        </slot>
      </div>
      <div class="ui-shell__header-right l-cluster">
        <slot name="header-actions" />
      </div>
    </header>

    <!-- 桌面侧栏 -->
    <aside v-if="!isMobile" class="ui-shell__sidebar" :style="{ width: sidebarWidth }">
      <ElMenu :default-active="activeKey" :collapse="collapsed" :collapse-transition="false" class="ui-shell__menu" @select="onSelect">
        <ElMenuItem v-for="item in menu" :key="item.key" :index="item.key" :disabled="item.disabled">
          <span>{{ item.label }}</span>
        </ElMenuItem>
      </ElMenu>
    </aside>

    <!-- 小屏抽屉 -->
    <ElDrawer v-else v-model="drawerOpen" direction="ltr" :with-header="false" size="var(--layout-sidebar-w)" class="ui-shell__drawer">
      <ElMenu :default-active="activeKey" class="ui-shell__menu" @select="onSelect">
        <ElMenuItem v-for="item in menu" :key="item.key" :index="item.key" :disabled="item.disabled">
          <span>{{ item.label }}</span>
        </ElMenuItem>
      </ElMenu>
    </ElDrawer>

    <!-- 内容区：由第三层用 .l-page 包裹 -->
    <main class="ui-shell__main">
      <slot />
    </main>
  </div>
</template>

<style>
.ui-shell {
  display: grid;
  grid-template-rows: var(--layout-header-h) minmax(0, 1fr);
  grid-template-columns: auto minmax(0, 1fr);
  grid-template-areas:
    'header header'
    'sidebar main';
  min-height: 100vh;
  background: var(--color-bg-page);
}
.ui-shell.is-mobile { grid-template-columns: minmax(0, 1fr); grid-template-areas: 'header' 'main'; }

.ui-shell__header {
  grid-area: header;
  position: sticky;
  top: 0;
  z-index: var(--z-header);
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--layout-header-h);
  padding-inline: var(--space-component-pad-x);
  background: var(--color-bg-surface);
  border-bottom: var(--border-w) solid var(--color-border-muted);
}
.ui-shell__title { font-size: var(--font-size-module-title); font-weight: var(--font-weight-bold); color: var(--color-text-default); }
.ui-shell__toggle { color: var(--color-icon-default); }

.ui-shell__sidebar {
  grid-area: sidebar;
  position: sticky;
  top: var(--layout-header-h);
  z-index: var(--z-sidebar);
  height: calc(100vh - var(--layout-header-h));
  overflow-y: auto;
  background: var(--color-bg-surface);
  border-right: var(--border-w) solid var(--color-border-muted);
}
.ui-shell__menu { border-right: none; }
.ui-shell__menu:not(.el-menu--collapse) { width: 100%; }
.ui-shell__drawer .el-drawer__body { padding: 0; }

.ui-shell__main { grid-area: main; min-width: 0; }
</style>
