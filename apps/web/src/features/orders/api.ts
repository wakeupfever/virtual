/**
 * features/orders/api.ts · 由原型 apps/prototypes/_template.html 的 ① DATA 转换而来
 * 接口定义 + mock。接入真实后端时只替换 fetchOrders / createOrder / removeOrder 的实现，类型与调用方不变。
 * mock 三套样本（常规 / 长文本 / 大数据量）保留，供视觉回归（R-027）与开发期切换。
 */
export type OrderStatus = 'pending' | 'done' | 'cancelled'
export type Dataset = 'normal' | 'long' | 'big'

export interface Order {
  no: string
  customer: string
  amount: number
  status: OrderStatus
  remark: string
}

export interface OrderQuery {
  keyword?: string
  status?: OrderStatus | ''
  page: number
  pageSize: number
  /** 开发期：切换 mock 样本；正式接口忽略 */
  dataset?: Dataset
}

export interface Page<T> {
  rows: T[]
  total: number
}

export interface OrderForm {
  customer: string
  amount: number
  remark: string
}

export const STATUSES: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: '待处理' },
  { value: 'done', label: '已完成' },
  { value: 'cancelled', label: '已取消' },
]

/* ---------- mock ---------- */
const MOCK: Record<Dataset, Order[]> = {
  normal: [
    { no: 'SO-20260901-001', customer: '成都示例科技', amount: 12800, status: 'pending', remark: '常规订单' },
    { no: 'SO-20260901-002', customer: '绵阳示例贸易', amount: 3200, status: 'done', remark: '' },
    { no: 'SO-20260901-003', customer: '德阳示例机械', amount: 56000, status: 'cancelled', remark: '客户取消' },
  ],
  long: [
    { no: 'SO-20260901-004', customer: '四川省某某某某某某某某某某某某某某某某某某某某科技发展有限责任公司西南区域分公司', amount: 99999999, status: 'pending', remark: '这是一条非常长的备注，用于验证表格在超长文本下的换行、截断与省略行为是否符合预期，转正式页面时应保留该样本以便视觉回归对比。' },
  ],
  big: Array.from({ length: 500 }, (_, i) => ({
    no: `SO-20260901-${String(i + 10).padStart(3, '0')}`,
    customer: `批量客户 ${i + 1}`,
    amount: (i * 37) % 10000,
    status: (['pending', 'done', 'cancelled'] as OrderStatus[])[i % 3],
    remark: i % 7 === 0 ? '每七条一条备注' : '',
  })),
}

const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

export async function fetchOrders(q: OrderQuery): Promise<Page<Order>> {
  await delay(300)
  const all = MOCK[q.dataset ?? 'normal'].filter(r =>
    (!q.keyword || r.customer.includes(q.keyword) || r.no.includes(q.keyword)) &&
    (!q.status || r.status === q.status))
  const start = (q.page - 1) * q.pageSize
  return { rows: all.slice(start, start + q.pageSize), total: all.length }
}

export async function createOrder(form: OrderForm): Promise<Order> {
  await delay(200)
  return { no: `SO-${Date.now()}`, status: 'pending', ...form }
}

export async function removeOrder(no: string): Promise<void> {
  await delay(200)
  void no
}
