import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { OrderStatusBadge } from '../../components/ui/StatusBadge'
import { useApp } from '../../context/AppContext'
import { useTranslation } from '../../hooks/useTranslation'
import type { OrderStatus } from '../../types'

type Tab = 'all' | OrderStatus

const tabs: { key: Tab; labelKey: 'all' | 'pending' | 'preparing' | 'readyForPickup' | 'completed' }[] = [
  { key: 'all', labelKey: 'all' },
  { key: 'PENDING', labelKey: 'pending' },
  { key: 'PREPARING', labelKey: 'preparing' },
  { key: 'READY', labelKey: 'readyForPickup' },
  { key: 'COMPLETED', labelKey: 'completed' },
]

export function OwnerOrdersPage() {
  const { orders, updateOrderStatus, loadOrders, shopId } = useApp()
  const { t } = useTranslation()
  const [tab, setTab] = useState<Tab>('all')

  useEffect(() => {
  if (shopId) {
    loadOrders()
  }
}, [shopId])

  const shopOrders = orders
  

    const filtered = useMemo(
    () => (tab === 'all' ? shopOrders : shopOrders.filter((o) => o.status === tab)),
    [shopOrders, tab],
  )

  const paymentLabel = (mode: string) => {
    if (mode === 'cash') return t('cash')
    if (mode === 'upi') return t('upi')
    return t('credit')
  }

  if (shopOrders.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title={t('noOrdersOwner')}
        description={t('noOrdersOwnerDesc')}
      />
    )
  }

  return (
    <div className="px-4 py-6">
      <h1 className="mb-4 text-2xl font-bold text-warm-900">{t('orders')}</h1>

      <div className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4">
        {tabs.map(({ key, labelKey }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${
              tab === key ? 'bg-saffron text-white' : 'bg-white text-warm-800 shadow-card'
            }`}
          >
            {t(labelKey)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-warm-800/60">{t('noOrdersOwner')}</p>
      ) : (
        <ul className="space-y-4">
          {[...filtered].reverse().map((order) => (
            <li key={order.id} className="rounded-3xl bg-white p-4 shadow-card">
              <Link to={`/owner/orders/${order.id}`} className="block">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold text-warm-900">{order.customerName}</p>
                    <p className="text-sm text-warm-800/60">
                      {new Date(order.createdAt).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {' · '}
                      {order.items.length} {t('items')} · {paymentLabel(order.paymentMode)}
                    </p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>
              </Link>
              <div className="mt-3 flex flex-wrap gap-2">
                {order.status === 'PENDING' && (
                  <>
                    <Button size="sm" onClick={() => updateOrderStatus(order.id, 'ACCEPTED')}>
                      {t('accept')}
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => updateOrderStatus(order.id, 'REJECTED', 'Out of stock')}>
                      {t('reject')}
                    </Button>
                  </>
                )}
                {order.status === 'ACCEPTED' && (
                  <Button size="sm" variant="secondary" onClick={() => updateOrderStatus(order.id, 'PREPARING')}>
                    {t('markPreparing')}
                  </Button>
                )}
                {order.status === 'PREPARING' && (
                  <Button size="sm" variant="secondary" onClick={() => updateOrderStatus(order.id, 'READY')}>
                    {t('markReady')}
                  </Button>
                )}
                {order.status === 'READY' && (
                  <Button size="sm" onClick={() => updateOrderStatus(order.id, 'COMPLETED')}>
                    {t('markCompleted')}
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
