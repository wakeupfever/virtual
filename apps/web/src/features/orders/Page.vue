<script setup lang="ts">
/**
 * features/orders/Page.vue · 由原型 apps/prototypes/_template.html ③ 模板逐一映射
 * <el-*> → <El*>，<ui-*> → <Ui*>；结构与 .l-* 类保持不变。
 * 与原型的差异见 ./DIFF.md。
 */
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute } from 'vue-router'
import type { Dataset, Order } from './api'
import { useOrders } from './composables/useOrders'

const route = useRoute()
/** 开发期 / 视觉回归：?dataset=normal|long|big 切换 mock 样本 */
const dataset = (route.query.dataset as Dataset | undefined) ?? 'normal'
const { filter, page, pageSize, rows, total, view, dialogOpen, form, load, statusLabel, statusType, resetFilter, submit, remove, STATUSES } = useOrders({ dataset })

const viewRow = (row: Order) => ElMessage.info(`查看 ${row.no}`)
const confirmRemove = (row: Order) =>
  ElMessageBox.confirm(`删除 ${row.no}？`, '确认').then(async () => { await remove(row); ElMessage.success('已删除') }).catch(() => {})
const create = async () => { await submit(); ElMessage.success('已创建') }
</script>

<template>
  <div class="l-page l-page--fill">
    <UiPageHeader title="订单列表" :subtitle="`共 ${total} 条`">
      <template #actions>
        <ElButton @click="load">刷新</ElButton>
        <ElButton type="primary" @click="dialogOpen = true">新建订单</ElButton>
      </template>
    </UiPageHeader>

    <section class="l-module l-fill">
      <div class="l-toolbar">
        <span class="l-cluster">
          <ElInput v-model="filter.keyword" placeholder="搜索客户 / 单号" clearable />
          <ElSelect v-model="filter.status" placeholder="状态" clearable>
            <ElOption v-for="s in STATUSES" :key="s.value" :label="s.label" :value="s.value" />
          </ElSelect>
        </span>
        <span class="l-cluster l-cluster--end">
          <ElButton @click="resetFilter">重置</ElButton>
        </span>
      </div>

      <UiState class="l-fill" :state="view" @retry="load">
        <ElTable class="l-fill" :data="rows" stripe>
          <ElTableColumn prop="no" label="单号" width="160" />
          <ElTableColumn prop="customer" label="客户" min-width="160" show-overflow-tooltip />
          <ElTableColumn prop="amount" label="金额" width="120" align="right" />
          <ElTableColumn label="状态" width="100">
            <template #default="{ row }">
              <ElTag :type="statusType(row.status)" size="small">{{ statusLabel(row.status) }}</ElTag>
            </template>
          </ElTableColumn>
          <ElTableColumn prop="remark" label="备注" min-width="240" show-overflow-tooltip />
          <ElTableColumn label="操作" width="140" fixed="right">
            <template #default="{ row }">
              <ElButton text type="primary" size="small" @click="viewRow(row)">查看</ElButton>
              <ElButton text type="danger" size="small" @click="confirmRemove(row)">删除</ElButton>
            </template>
          </ElTableColumn>
        </ElTable>
        <div class="l-cluster l-cluster--end">
          <ElPagination v-model:current-page="page" v-model:page-size="pageSize" layout="total, prev, pager, next, sizes" :total="total" :page-sizes="[10, 20, 50]" />
        </div>
      </UiState>
    </section>

    <ElDialog v-model="dialogOpen" title="新建订单">
      <ElForm class="l-form" label-position="right">
        <ElFormItem label="客户"><ElInput v-model="form.customer" /></ElFormItem>
        <ElFormItem label="金额"><ElInputNumber v-model="form.amount" :min="0" /></ElFormItem>
        <ElFormItem label="备注"><ElInput v-model="form.remark" type="textarea" /></ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="dialogOpen = false">取消</ElButton>
        <ElButton type="primary" @click="create">确定</ElButton>
      </template>
    </ElDialog>
  </div>
</template>
