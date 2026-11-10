import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronUp, Package } from 'lucide-react'
import { EmptyState } from '../../components/ui/EmptyState'
import { OrderStatusBadge } from '../../components/ui/StatusBadge'
import { useApp } from '../../context/AppContext'
import { useTranslation } from '../../hooks/useTranslation'

export function OrdersPage() {
  const { orders, loadOrders } = useApp()
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  const myOrders = orders

  if (myOrders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title={t('emptyOrders')}
        description={t('emptyOrdersDesc')}
      />
    )
  }

  return (
    <div className="px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold text-warm-900">{t('myOrders')}</h1>
      <ul className="space-y-4">
        {[...myOrders].reverse().map((order) => {
          const isOpen = expanded === order.id
          return (
            <li key={order.id} className="rounded-3xl bg-white shadow-card overflow-hidden">
              <button
                type="button"
                className="w-full p-4 text-left"
                onClick={() => setExpanded(isOpen ? null : order.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-warm-900">{order.shopName}</h3>
                    <p className="mt-1 text-sm text-warm-800/60">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {' · '}
                      {order.items.length} {t('items')}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <OrderStatusBadge status={order.status} />
                    <span className="font-bold text-forest">₹{order.total}</span>
                  </div>
                </div>
                {isOpen ? <ChevronUp className="mt-2 text-warm-800/40" size={20} /> : <ChevronDown className="mt-2 text-warm-800/40" size={20} />}
              </button>
              {isOpen && (
                <div className="border-t border-warm-100 px-4 pb-4 animate-fade-in">
                  <ul className="mt-3 space-y-2 text-sm">
                    {order.items.map((item) => (
                      <li key={item.productId} className="flex justify-between">
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span>₹{item.price * item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={`/customer/orders/${order.id}`}
                    className="mt-4 block text-center font-semibold text-saffron"
                  >
                    {t('orderDetails')} →
                  </Link>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
