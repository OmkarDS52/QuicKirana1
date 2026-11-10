import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Phone } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { OrderStatusBadge } from '../../components/ui/StatusBadge'
import { useApp } from '../../context/AppContext'
import { useTranslation } from '../../hooks/useTranslation'
import type { OrderStatus } from '../../types'

export function OwnerOrderDetailPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const {
    orders,
    updateOrderStatus,
    updateOrderItemPacked,
    toggleOrderItemUnavailable,
  } = useApp()
  const { t } = useTranslation()
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const order = orders.find((o) => o.id === orderId)

  if (!order) return <div className="p-6">Order not found</div>

  const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
    PENDING: 'ACCEPTED',
    ACCEPTED: 'PREPARING',
    PREPARING: 'READY',
    READY: 'COMPLETED',
  }

  const handleReject = () => {
    updateOrderStatus(order.id, 'REJECTED', rejectReason)
    setRejectOpen(false)
    navigate('/owner/orders')
  }

  const handleUpdate = () => {
    const next = nextStatus[order.status]
    if (next) updateOrderStatus(order.id, next)
  }

  return (
    <div className="px-4 py-6 pb-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="tap-target mb-4 flex items-center gap-2 text-forest"
      >
        <ArrowLeft size={22} />
        {t('orders')}
      </button>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{order.customerName}</h1>
          <a
            href={`tel:${order.customerPhone}`}
            className="mt-1 flex items-center gap-1 text-saffron"
          >
            <Phone size={16} />
            {order.customerPhone}
          </a>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <section className="mt-6 rounded-3xl bg-white p-4 shadow-card">
        <h2 className="mb-3 font-semibold">{t('packItems')}</h2>
        <ul className="space-y-3">
          {order.items.map((item) => (
            <li
              key={item.productId}
              className={`rounded-2xl border-2 p-3 ${
                item.unavailable ? 'border-red-200 bg-red-50 opacity-70' : 'border-warm-100'
              }`}
            >
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={item.packed ?? false}
                  disabled={item.unavailable}
                  onChange={(e) =>
                    updateOrderItemPacked(order.id, item.productId, e.target.checked)
                  }
                  className="mt-1 h-5 w-5 rounded accent-forest"
                />
                <div className="flex-1">
                  <p className={`font-medium ${item.packed ? 'line-through text-warm-800/50' : ''}`}>
                    {item.name} × {item.quantity}
                  </p>
                  <p className="text-sm text-warm-800/55">{item.nameMr}</p>
                  {item.note && <p className="mt-1 text-sm text-saffron">{item.note}</p>}
                </div>
              </label>
              <button
                type="button"
                onClick={() => toggleOrderItemUnavailable(order.id, item.productId)}
                className="mt-2 text-sm font-medium text-red-600"
              >
                {t('markUnavailable')}
              </button>
            </li>
          ))}
        </ul>
        {order.orderNote && (
          <p className="mt-4 rounded-xl bg-warm-100 p-3 text-sm">
            <strong>{t('orderNote')}:</strong> {order.orderNote}
          </p>
        )}
        <p className="mt-4 text-right text-lg font-bold text-forest">₹{order.total}</p>
      </section>

      <div className="mt-6 flex flex-col gap-3">
        {order.status === 'PENDING' && (
          <>
            <Button fullWidth size="lg" onClick={handleUpdate}>
              {t('accept')}
            </Button>
            <Button fullWidth size="lg" variant="danger" onClick={() => setRejectOpen(true)}>
              {t('reject')}
            </Button>
          </>
        )}
        {order.status !== 'PENDING' &&
          order.status !== 'COMPLETED' &&
          order.status !== 'REJECTED' && (
            <Button fullWidth size="lg" onClick={handleUpdate}>
              {order.status === 'ACCEPTED'
                ? t('markPreparing')
                : order.status === 'PREPARING'
                  ? t('markReady')
                  : t('markCompleted')}
            </Button>
          )}
      </div>

      <Modal open={rejectOpen} onClose={() => setRejectOpen(false)} title={t('rejectOrder')}>
        <textarea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder={t('rejectReasonPlaceholder')}
          rows={3}
          className="mb-4 w-full rounded-2xl border-2 border-warm-200 p-3 outline-none focus:border-saffron"
        />
        <Button fullWidth variant="danger" onClick={handleReject}>
          {t('confirm')}
        </Button>
      </Modal>
    </div>
  )
}
