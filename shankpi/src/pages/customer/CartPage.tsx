import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Minus, Plus, ShoppingBag, CheckCircle2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { useApp } from '../../context/AppContext'
import { useTranslation } from '../../hooks/useTranslation'
import type { PaymentMode } from '../../types'

export function CartPage() {
  const navigate = useNavigate()
  const {
    cart,
    products,
    cartTotal,
    updateCartQty,
    updateCartNote,
    placeOrder,
  } = useApp()
  const { t } = useTranslation()
  const [orderNote, setOrderNote] = useState('')
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('cash')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const items = cart
    .map((item) => {
      const p = products.find((x) => x.id === item.productId)
      return p ? { ...item, product: p } : null
    })
    .filter(Boolean) as { productId: string; quantity: number; note?: string; product: (typeof products)[0] }[]

  const total = cartTotal(products)

  // Group cart items by shop
  const grouped = useMemo(() => {
    return cart.reduce<Record<string, { shopName: string; items: typeof cart }>>((acc, item) => {
      if (!acc[item.shopId]) {
        acc[item.shopId] = { shopName: item.shopName, items: [] }
      }
      acc[item.shopId].items.push(item)
      return acc
    }, {})
  }, [cart])

  const handleSend = async () => {
    if (cart.length === 0) return
    setLoading(true)
    try {
      await placeOrder({
        paymentMode,
        orderNote,
        items: cart,
        products,
      })
      setSent(true)
      setTimeout(() => {
        setSent(false)
        navigate('/customer/orders')
      }, 2200)
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Failed to place order.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0 && !sent) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title={t('emptyCart')}
        description={t('emptyCartDesc')}
        actionLabel={t('continueShopping')}
        onAction={() => navigate('/customer')}
      />
    )
  }

  if (sent) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 animate-fade-in">
        <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 size={64} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-warm-900">{t('orderSent')}</h2>
        <p className="mt-2 text-center text-warm-800/70">{t('orderSentDesc')}</p>
      </div>
    )
  }

  const payments: { mode: PaymentMode; label: string }[] = [
    { mode: 'cash', label: t('cash') },
    { mode: 'upi', label: t('upi') },
    { mode: 'credit', label: t('credit') },
  ]

  return (
    <div className="px-4 py-6 pb-8">
      <h1 className="mb-2 text-2xl font-bold text-warm-900">{t('cart')}</h1>
      {Object.entries(grouped).map(([sid, { shopName, items: shopItems }]) => (
        <div key={sid}>
          <h2 className="mb-3 mt-6 font-bold text-warm-900 text-lg">{shopName}</h2>
          <ul className="space-y-4">
            {shopItems.map(({ productId, quantity, note }) => {
              const product = products.find((p) => p.id === productId)
              if (!product) return null
              return (
                <li key={productId} className="rounded-3xl bg-white p-4 shadow-card">
                  <div className="flex justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-warm-900">{product.name}</h3>
                      <p className="text-sm text-warm-800/55">{product.nameMr}</p>
                      <p className="mt-1 font-bold text-forest">
                        ₹{product.price} / {product.unit}
                      </p>
                    </div>
                    <p className="font-bold text-warm-900">₹{product.price * quantity}</p>
                  </div>
                  <div className="mt-3 flex items-center gap-2 rounded-2xl bg-warm-100 p-1 w-fit">
                    <button type="button" onClick={() => updateCartQty(productId, -1)}
                      className="tap-target flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                      <Minus size={18} />
                    </button>
                    <span className="min-w-[2rem] text-center font-semibold">{quantity}</span>
                    <button type="button" onClick={() => updateCartQty(productId, 1)}
                      className="tap-target flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                      <Plus size={18} />
                    </button>
                  </div>
                  <input type="text" placeholder={t('itemNotePlaceholder')}
                    value={note ?? ''}
                    onChange={(e) => updateCartNote(productId, e.target.value)}
                    className="mt-3 min-h-11 w-full rounded-xl border border-warm-200 bg-warm-50 px-3 text-sm outline-none focus:border-saffron"
                  />
                </li>
              )
            })}
          </ul>
        </div>
      ))}

      <div className="mt-6 rounded-3xl bg-white p-4 shadow-card">
        <label className="mb-2 block text-sm font-medium text-warm-800">{t('orderNote')}</label>
        <textarea
          value={orderNote}
          onChange={(e) => setOrderNote(e.target.value)}
          placeholder={t('orderNotePlaceholder')}
          rows={2}
          className="w-full resize-none rounded-xl border border-warm-200 bg-warm-50 p-3 text-base outline-none focus:border-saffron"
        />
      </div>

      <div className="mt-4">
        <p className="mb-2 text-sm font-medium text-warm-800">{t('paymentMode')}</p>
        <div className="flex flex-wrap gap-2">
          {payments.map(({ mode, label }) => (
            <button
              key={mode}
              type="button"
              onClick={() => setPaymentMode(mode)}
              className={`min-h-12 rounded-2xl px-4 font-medium transition-colors ${paymentMode === mode
                ? 'bg-saffron text-white'
                : 'bg-white text-warm-800 shadow-card'
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between text-xl font-bold">
        <span>{t('total')}</span>
        <span className="text-forest">₹{total}</span>
      </div>
      {error && <p className="mt-3 text-center text-sm text-red-500">{error}</p>}
      <Button fullWidth size="lg" className="mt-6" onClick={handleSend} loading={loading}>
        {t('sendOrder')}
      </Button>
    </div>
  )
}
