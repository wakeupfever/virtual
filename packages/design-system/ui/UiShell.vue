<script setup lang="ts">
/**
 * UiShell · 第二层 · 页面外壳
 * 侧边栏折叠 / 当前菜单高亮 / 小屏下侧边栏变抽屉。
 * 滚动模型（R-043）：外壳固定为视口高，侧栏与主内容区各自在 ElScrollbar 内滚动，window 不滚动。
 * 所有尺寸取自 tokens.css 的 --layout-*，本文件不写任何数值。
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ElButton, ElDrawer, ElMenu, ElMenuItem, ElScrollbar } from 'element-plus'

export interface UiShellMenuItem {
  key: string
  label: string
  disabled?: boolean
  /** 内置图标名（见 ICONS）；折叠态只剩图标，不给的话折叠后是空白行 */
  icon?: keyof typeof ICONS
  /** 分组标题：出现在该项之前，折叠态自动隐藏 */
  group?: string
  /** 右上角徽标数字，0 或不给不显示 */
  badge?: number
}

/** 内置图标集：24×24 线性图标的 path。放在第二层是为了让原型不必再引一个图标 CDN。 */
const ICONS = {
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

const iconPath = (item: UiShellMenuItem) => ICONS[item.icon ?? 'default'] ?? ICONS.default

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
  /** 主内容区滚动（来自 ElScrollbar） */
  (e: 'scroll', payload: { scrollTop: number; scrollLeft: number }): void
}>()

const isMobile = ref(false)
const drawerOpen = ref(false)
const mainScroll = ref<InstanceType<typeof ElScrollbar> | null>(null)
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

/** 供第三层调用：滚动主区到顶 / 指定位置（如路由切换、锚点） */
function scrollTo(options: ScrollToOptions | number) {
  mainScroll.value?.scrollTo(typeof options === 'number' ? { top: options } : options)
}
/** 主区滚动容器元素（.el-scrollbar__wrap），供 ElAffix / ElBacktop 的 target 使用 */
const wrapEl = computed(() => mainScroll.value?.wrapRef ?? null)

defineExpose({ scrollTo, wrapEl })
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
          <span class="ui-shell__mark"></span>
          <span class="ui-shell__title">{{ title }}</span>
        </slot>
      </div>
      <div class="ui-shell__header-right l-cluster">
        <slot name="header-actions" />
      </div>
    </header>

    <!-- 桌面侧栏：ElScrollbar 内滚 -->
    <aside v-if="!isMobile" class="ui-shell__sidebar" :class="{ 'is-collapsed': collapsed }" :style="{ width: sidebarWidth }">
      <ElScrollbar>
        <ElMenu :default-active="activeKey" :collapse="collapsed" :collapse-transition="false" class="ui-shell__menu" @select="onSelect">
          <template v-for="item in menu" :key="item.key">
            <div v-if="item.group" class="ui-shell__group">{{ item.group }}</div>
            <ElMenuItem :index="item.key" :disabled="item.disabled">
              <span class="el-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <path :d="iconPath(item)"></path>
                </svg>
              </span>
              <template #title>
                <span>{{ item.label }}</span>
                <span v-if="item.badge" class="ui-shell__badge">{{ item.badge }}</span>
              </template>
            </ElMenuItem>
          </template>
        </ElMenu>
      </ElScrollbar>
    </aside>

    <!-- 小屏抽屉 -->
    <ElDrawer v-else v-model="drawerOpen" direction="ltr" :with-header="false" size="var(--layout-sidebar-w)" class="ui-shell__drawer">
      <ElScrollbar>
        <ElMenu :default-active="activeKey" class="ui-shell__menu" @select="onSelect">
          <template v-for="item in menu" :key="item.key">
            <div v-if="item.group" class="ui-shell__group">{{ item.group }}</div>
            <ElMenuItem :index="item.key" :disabled="item.disabled">
              <span class="el-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <path :d="iconPath(item)"></path>
                </svg>
              </span>
              <template #title>
                <span>{{ item.label }}</span>
                <span v-if="item.badge" class="ui-shell__badge">{{ item.badge }}</span>
              </template>
            </ElMenuItem>
          </template>
        </ElMenu>
      </ElScrollbar>
    </ElDrawer>

    <!-- 内容区：ElScrollbar 内滚；第三层用 .l-page 包裹内容 -->
    <main class="ui-shell__main">
      <ElScrollbar ref="mainScroll" class="ui-shell__scroll" view-class="ui-shell__view" @scroll="p => emit('scroll', p)">
        <slot />
      </ElScrollbar>
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
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background: var(--color-bg-canvas);
}
.ui-shell.is-mobile { grid-template-columns: minmax(0, 1fr); grid-template-areas: 'header' 'main'; }

.ui-shell__header {
  grid-area: header;
  z-index: var(--z-header);
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--layout-header-h);
  padding-inline: var(--space-component-pad-x);
  background: var(--color-bg-surface);
  border-bottom: var(--border-w) solid var(--color-border-muted);
}
.ui-shell__mark { width: var(--layout-icon-sm); height: var(--layout-icon-sm); border-radius: var(--radius-md); background: var(--color-primary); flex: none; }
.ui-shell__title { font-size: var(--font-size-module-title); font-weight: var(--font-weight-bold); color: var(--color-text-default); }
.ui-shell__toggle { --el-button-text-color: var(--color-icon-default); color: var(--color-icon-default); }

.ui-shell__sidebar {
  grid-area: sidebar;
  z-index: var(--z-sidebar);
  min-height: 0;
  background: var(--color-bg-surface);
  border-right: var(--border-w) solid var(--color-border-muted);
}
.ui-shell__sidebar .el-scrollbar { height: 100%; }
.ui-shell__menu { border-right: none; }
.ui-shell__menu:not(.el-menu--collapse) { width: 100%; }
.ui-shell__drawer .el-drawer__body { padding: 0; }
.ui-shell__drawer .el-scrollbar { height: 100%; }

.ui-shell__main { grid-area: main; min-width: 0; min-height: 0; }
.ui-shell__scroll { height: 100%; }
/* 滚动视图给出确定高度，.l-page--fill 的 height: 100% 才有参照；内容更高时照常溢出并由 wrap 内滚。
 * 这里刻意保持块级：一旦改成 flex，.l-page 的 margin-inline: auto 会在交叉轴压过 stretch，
 * 把内容收缩成 max-content 宽再居中——宽屏上两侧会平白多出大片留白。 */
.ui-shell__view { height: 100%; }
</style>
