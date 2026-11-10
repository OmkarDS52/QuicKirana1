import type { OrderStatus, StockStatus } from '../../types'
import { useTranslation } from '../../hooks/useTranslation'

const orderStyles: Record<OrderStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
  ACCEPTED: 'bg-blue-100 text-blue-800 border-blue-200',
  PREPARING: 'bg-purple-100 text-purple-800 border-purple-200',
  READY: 'bg-green-100 text-green-800 border-green-200',
  COMPLETED: 'bg-gray-100 text-gray-700 border-gray-200',
  REJECTED: 'bg-red-100 text-red-800 border-red-200',
}

const orderKeys: Record<OrderStatus, 'pending_status' | 'accepted_status' | 'preparing_status' | 'ready_status' | 'completed_status' | 'rejected_status'> = {
  PENDING: 'pending_status',
  ACCEPTED: 'accepted_status',
  PREPARING: 'preparing_status',
  READY: 'ready_status',
  COMPLETED: 'completed_status',
  REJECTED: 'rejected_status',
}

const stockStyles: Record<StockStatus, string> = {
  in_stock: 'bg-green-100 text-green-800',
  low_stock: 'bg-amber-100 text-amber-800',
  out_of_stock: 'bg-red-100 text-red-800',
}

const stockKeys: Record<StockStatus, 'inStock' | 'lowStock' | 'outOfStock'> = {
  in_stock: 'inStock',
  low_stock: 'lowStock',
  out_of_stock: 'outOfStock',
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { t } = useTranslation()
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${orderStyles[status]}`}
    >
      {t(orderKeys[status])}
    </span>
  )
}

export function StockBadge({ status }: { status: StockStatus }) {
  const { t } = useTranslation()
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${stockStyles[status]}`}>
      {t(stockKeys[status])}
    </span>
  )
}

export function OpenBadge({ isOpen }: { isOpen: boolean }) {
  const { t } = useTranslation()
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
        isOpen ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isOpen ? 'bg-green-500' : 'bg-gray-400'}`} />
      {isOpen ? t('open') : t('closed')}
    </span>
  )
}
