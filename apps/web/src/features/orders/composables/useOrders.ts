/**
 * features/orders/composables/useOrders.ts · 由原型 ② state + ④ methods 转换而来
 * 原型的 view 三态由手动切换变为随请求自动流转：loading → ready | empty | error。
 */
import { reactive, ref, watch } from 'vue'
import type { UiStateKind } from '@virtual/design-system'
import { fetchOrders, createOrder, removeOrder, STATUSES, type Order, type OrderStatus, type Dataset, type OrderForm } from '../api'

export function useOrders(options: { dataset?: Dataset } = {}) {
  const filter = reactive({ keyword: '', status: '' as OrderStatus | '' })
  const page = ref(1)
  const pageSize = ref(10)
  const rows = ref<Order[]>([])
  const total = ref(0)
  const view = ref<UiStateKind>('loading')
  const dialogOpen = ref(false)
  const form = reactive<OrderForm>({ customer: '', amount: 0, remark: '' })

  async function load() {
    view.value = 'loading'
    try {
      const res = await fetchOrders({ ...filter, page: page.value, pageSize: pageSize.value, dataset: options.dataset })
      rows.value = res.rows
      total.value = res.total
      view.value = res.total ? 'ready' : 'empty'
    } catch {
      view.value = 'error'
    }
  }

  watch(() => [filter.keyword, filter.status], () => { page.value = 1 })
  watch([() => filter.keyword, () => filter.status, page, pageSize], load, { immediate: true })

  const statusLabel = (v: OrderStatus) => STATUSES.find(s => s.value === v)?.label ?? v
  const statusType = (v: OrderStatus) => ({ pending: 'warning', done: 'success', cancelled: 'info' } as const)[v] ?? 'info'
  const resetFilter = () => { filter.keyword = ''; filter.status = '' }

  async function submit() {
    await createOrder({ ...form })
    dialogOpen.value = false
    await load()
  }

  async function remove(row: Order) {
    await removeOrder(row.no)
    await load()
  }

  return { filter, page, pageSize, rows, total, view, dialogOpen, form, load, statusLabel, statusType, resetFilter, submit, remove, STATUSES }
}
