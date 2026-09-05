<script setup lang="ts">
/**
 * UiFilterBar · 第二层 · 复合组件（对齐参考 PuiSearch）
 * 表格 / 列表上方筛选条：整条包在 --color-bg-subtle 圆角容器里。
 * 默认插槽放「label + 控件」对（用 <span class="l-inline"><small>标签</small><el-input/></span>），
 * 右侧依次：搜索（primary）/ 重置 / 高级搜索（文字链接，可选）；summary 摘要；actions 操作按钮。
 * 高级搜索用浮窗承载（#advanced 插槽），展开不改变筛选条高度，表格区不会被推下去。
 */
import { ElButton, ElPopover } from 'element-plus'

withDefaults(
  defineProps<{
    /** 显示搜索按钮 */
    searchable?: boolean
    /** 显示重置按钮 */
    resettable?: boolean
    /** 显示「高级搜索」文字链接：有 #advanced 插槽时弹浮窗，否则只 emit toggle */
    advanced?: boolean
    searchText?: string
    resetText?: string
    advancedText?: string
  }>(),
  { searchable: true, resettable: true, advanced: false, searchText: '搜索', resetText: '重置', advancedText: '高级搜索' },
)

/** toggle 带上浮窗当前的展开状态；无 #advanced 插槽时退化为无参数的点击事件 */
const emit = defineEmits<{ (e: 'search'): void; (e: 'reset'): void; (e: 'toggle', open?: boolean): void }>()
</script>

<template>
  <div class="ui-filter-bar l-toolbar">
    <span class="ui-filter-bar__filters l-cluster">
      <slot />
      <span class="ui-filter-bar__btns l-cluster">
        <ElButton v-if="searchable" type="primary" @click="emit('search')">{{ searchText }}</ElButton>
        <ElButton v-if="resettable" @click="emit('reset')">{{ resetText }}</ElButton>
        <ElPopover
          v-if="advanced && $slots.advanced"
          trigger="click"
          placement="bottom-start"
          width="auto"
          popper-class="ui-filter-bar__adv"
          @update:visible="open => emit('toggle', open)"
        >
          <template #reference>
            <ElButton link type="primary">{{ advancedText }}</ElButton>
          </template>
          <div class="ui-filter-bar__adv-body l-stack l-stack--tight"><slot name="advanced" /></div>
        </ElPopover>
        <ElButton v-else-if="advanced" link type="primary" @click="emit('toggle')">{{ advancedText }}</ElButton>
      </span>
    </span>
    <span class="ui-filter-bar__right l-cluster l-cluster--end">
      <small v-if="$slots.summary" class="ui-filter-bar__summary"><slot name="summary" /></small>
      <slot name="actions" />
    </span>
  </div>
</template>

<style>
.ui-filter-bar { flex-wrap: wrap; padding: var(--space-component-gap) var(--space-component-pad-x); background: var(--color-bg-subtle); border-radius: var(--radius-md); margin-bottom: 0; }
.ui-filter-bar__filters { flex: 1; min-width: 0; }
.ui-filter-bar__filters > .l-inline > small { color: var(--color-text-secondary); font-size: var(--font-size-caption); }
.ui-filter-bar__filters > .l-inline > .el-input,
.ui-filter-bar__filters > .l-inline > .el-select,
.ui-filter-bar__filters > .l-inline > .el-date-editor { width: var(--layout-control-w); }
.ui-filter-bar__btns { flex: none; }
.ui-filter-bar__right { flex: none; margin-left: auto; white-space: nowrap; }
.ui-filter-bar__summary { color: var(--color-text-muted); }
/* 高级搜索浮窗：与筛选条同一套「label + 控件」写法，展开不占据文档流高度 */
.el-popover.ui-filter-bar__adv { padding: var(--space-module-pad); }
.ui-filter-bar__adv-body > .l-inline > small { color: var(--color-text-secondary); font-size: var(--font-size-caption); }
.ui-filter-bar__adv-body > .l-inline > .el-input,
.ui-filter-bar__adv-body > .l-inline > .el-select,
.ui-filter-bar__adv-body > .l-inline > .el-date-editor { width: var(--layout-control-w); }
</style>
