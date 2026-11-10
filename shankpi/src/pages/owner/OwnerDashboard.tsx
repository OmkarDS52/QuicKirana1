import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, Clock, CheckCircle, Package } from 'lucide-react'
import { OrderStatusBadge } from '../../components/ui/StatusBadge'
import { useApp } from '../../context/AppContext'
import { useTranslation } from '../../hooks/useTranslation'

export function OwnerDashboard() {
  const { orders, shopSettings, shopId, loadOrders, loadProducts, updateShopSettings } = useApp()
  const { t } = useTranslation()

  useEffect(() => {
  if (shopId) {
    loadOrders()
    loadProducts(shopId)
  }
}, [shopId])


  const today = new Date().toDateString()
  const todayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === today)
  const pending = orders.filter((o) => o.status === 'PENDING').length
  const ready = orders.filter((o) => o.status === 'READY').length
  const completed = orders.filter((o) => o.status === 'COMPLETED').length

  const stats = [
    { label: t('todaysOrders'), value: todayOrders.length, icon: ClipboardList, color: 'bg-saffron/10 text-saffron' },
    { label: t('pending'), value: pending, icon: Clock, color: 'bg-amber-100 text-amber-700' },
    { label: t('readyForPickup'), value: ready, icon: Package, color: 'bg-green-100 text-green-700' },
    { label: t('completed'), value: completed, icon: CheckCircle, color: 'bg-gray-100 text-gray-700' },
  ]

  return (
    <div className="px-4 py-6 lg:px-8">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-warm-900 lg:text-3xl">{shopSettings.name}</h1>
          <p className="text-warm-800/60">{shopSettings.area}</p>
        </div>
        <button
          type="button"
          onClick={() => updateShopSettings({ isOpen: !shopSettings.isOpen })}
          className={`min-h-12 shrink-0 rounded-2xl px-4 font-semibold transition-colors ${
            shopSettings.isOpen
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          {shopSettings.isOpen ? t('toggleOpen') : t('toggleClosed')}
        </button>
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-3xl bg-white p-4 shadow-card">
            <div className={`mb-2 inline-flex rounded-xl p-2 ${color}`}>
              <Icon size={22} />
            </div>
            <p className="text-2xl font-bold text-warm-900">{value}</p>
            <p className="text-sm text-warm-800/60">{label}</p>
          </div>
        ))}
      </div>

      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">{t('recentOrders')}</h2>
        {orders.length === 0 ? (
          <p className="py-8 text-center text-warm-800/60">No orders yet</p>
        ) : (
          <ul className="space-y-3">
            {orders.slice(0, 5).reverse().map((order) => (
              <Link
                key={order.id}
                to={`/owner/orders/${order.id}`}
                className="flex items-center justify-between rounded-3xl bg-white p-4 shadow-card transition-transform hover:scale-[1.01]"
              >
                <div>
                  <p className="font-semibold text-warm-900">{order.customerName}</p>
                  <p className="text-sm text-warm-800/60">
                    {order.items.length} {t('items')} · ₹{order.total}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
              </Link>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}