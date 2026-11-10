import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { OrderStatusBadge } from '../../components/ui/StatusBadge'
import { OrderTimeline } from '../../components/ui/OrderTimeline'
import { useApp } from '../../context/AppContext'
import { useTranslation } from '../../hooks/useTranslation'

export function OrderDetailPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { orders, addToCart, loadOrders } = useApp()
  const { t } = useTranslation()

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  const order = orders.find((o) => o.id === orderId)

  if (!order) {
    return <div className="p-6">Order not found</div>
  }

  const handleReorder = () => {
    order.items.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        addToCart(item.productId, order.shopId, order.shopName)
      }
    })
    navigate(`/customer/shop/${order.shopId}`)
  }

  return (
    <div className="px-4 py-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="tap-target mb-4 flex items-center gap-2 text-forest"
      >
        <ArrowLeft size={22} />
        <span className="font-medium">{t('myOrders')}</span>
      </button>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-warm-900">{order.shopName}</h1>
          <p className="mt-1 text-warm-800/60">
            {new Date(order.createdAt).toLocaleString('en-IN')}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {order.status === 'REJECTED' && order.rejectionReason && (
        <div className="mt-4 rounded-2xl border-2 border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">{t('rejectionReason')}</p>
          <p className="mt-1 text-red-700">{order.rejectionReason}</p>
        </div>
      )}

      <section className="mt-6">
        <h2 className="mb-3 font-semibold text-warm-900">{t('statusTimeline')}</h2>
        <OrderTimeline status={order.status} />
      </section>

      <section className="mt-6 rounded-3xl bg-white p-4 shadow-card">
        <h2 className="mb-3 font-semibold">{t('orderDetails')}</h2>
        <ul className="space-y-3">
          {order.items.map((item) => (
            <li key={item.productId} className="flex justify-between border-b border-warm-100 pb-3 last:border-0">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-warm-800/55">{item.nameMr}</p>
                {item.note && <p className="mt-1 text-sm text-saffron">{item.note}</p>}
              </div>
              <div className="text-right">
                <p>× {item.quantity}</p>
                <p className="font-bold">₹{item.price * item.quantity}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-right text-xl font-bold text-forest">
          {t('total')}: ₹{order.total}
        </p>
      </section>

      {order.status === 'COMPLETED' && (
        <Button fullWidth size="lg" className="mt-6" onClick={handleReorder}>
          {t('reorder')}
        </Button>
      )}
    </div>
  )
}
