import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, MessageCircle, ShoppingCart } from 'lucide-react'
import { ProductCard } from '../../components/products/ProductCard'
import { OpenBadge } from '../../components/ui/StatusBadge'
import { categoryLabel } from '../../i18n/translations'
import { useTranslation } from '../../hooks/useTranslation'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { getShopById } from '../../api/services'

const CATEGORIES = ['all', 'grains', 'dairy', 'spices', 'oil', 'snacks', 'beverages']

export function ShopDetailPage() {

  const { shopId } = useParams()
  const { loadProducts, products, addToCart, cartCount, cartShopId, language } = useApp()
  const [shop, setShop] = useState<any>(null)

  useEffect(() => {
    if (shopId) {
      loadProducts(shopId)

      getShopById(shopId).then(setShop)
    }
  }, [shopId])

  const navigate = useNavigate()
  const { t, language: lang } = useTranslation()
  const [category, setCategory] = useState('all')

  const shopProducts = useMemo(
    () =>
      products
        .filter((p) => p.shopId === shopId)
        .filter((p) => category === 'all' || p.category === category),
    [products, shopId, category],
  )

  if (!shop) {
    return (
      <div className="p-6 text-center">
        <p>Shop not found</p>
        <Link to="/customer" className="text-saffron">
          Go home
        </Link>
      </div>
    )
  }



  const name = language === 'mr' ? shop.nameMr : shop.name
  const area = language === 'mr' ? shop.areaMr : shop.area
  const showCartBar = cartCount > 0 && cartShopId === shopId

  return (
    <div className="pb-28">
      <div className="sticky top-0 z-30 border-b border-warm-200 bg-cream/95 px-4 py-4 backdrop-blur-md">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="tap-target flex shrink-0 items-center justify-center rounded-xl bg-white p-2 shadow-card"
          >
            <ArrowLeft size={22} />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold text-warm-900">{name}</h1>
            <p className="text-sm text-warm-800/60">{area}</p>
            <div className="mt-2 flex items-center gap-3">
              <OpenBadge isOpen={shop.isOpen} />
              <a
                href={`https://wa.me/91${shop.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="tap-target flex items-center gap-1 rounded-full bg-green-100 px-3 py-1.5 text-sm font-medium text-green-800"
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${category === cat
                  ? 'bg-saffron text-white'
                  : 'bg-white text-warm-800 shadow-card'
                }`}
            >
              {categoryLabel(lang, cat)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-3 lg:grid-cols-4">
        {shopProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAdd={() => addToCart(product.id, shopId!, shop.name)}
          />
        ))}
      </div>

      {showCartBar && (
        <div className="fixed bottom-20 left-4 right-4 z-40 mx-auto max-w-lg animate-slide-up lg:bottom-8">
          <button
            type="button"
            onClick={() => navigate('/customer/cart')}
            className="flex min-h-14 w-full items-center justify-between rounded-2xl bg-forest px-6 text-white shadow-lift"
          >
            <span className="flex items-center gap-2 font-medium">
              <ShoppingCart size={22} className="animate-cart-bounce" />
              {cartCount} {t('itemsInCart')}
            </span>
            <span className="font-bold">{t('viewCart')} →</span>
          </button>
        </div>
      )}
    </div>
  )
}
