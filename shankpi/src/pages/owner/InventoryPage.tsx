import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Pencil, Plus, Search } from 'lucide-react'
import { categoryLabel } from '../../i18n/translations'
import { EmptyState } from '../../components/ui/EmptyState'
import { StockBadge } from '../../components/ui/StatusBadge'
import { cycleStock, useApp } from '../../context/AppContext'
import { useTranslation } from '../../hooks/useTranslation'

const CATEGORIES = ['all', 'grains', 'dairy', 'spices', 'oil', 'snacks', 'beverages']

export function InventoryPage() {
  const navigate = useNavigate()
  const { products, updateProduct, shopId, loadProducts } = useApp()
  const { t, language } = useTranslation()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  useEffect(() => {
    if (shopId) loadProducts(shopId)
  }, [shopId])

  const shopProducts = useMemo(() => {
    return products
      .filter((p) => category === 'all' || p.category === category)
      .filter(
        (p) =>
          !search ||
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.nameMr.includes(search),
      )
  }, [products, search, category])

  return (
    <div className="relative px-4 py-6 pb-24">
      <h1 className="mb-4 text-2xl font-bold text-warm-900">{t('inventory')}</h1>

      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-800/40" size={20} />
        <input
          type="search"
          placeholder={t('searchProducts')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-h-12 w-full rounded-2xl border-2 border-warm-200 bg-white py-3 pl-12 pr-4 outline-none focus:border-saffron"
        />
      </div>

      <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${
              category === cat ? 'bg-saffron text-white' : 'bg-white shadow-card'
            }`}
          >
            {categoryLabel(language, cat)}
          </button>
        ))}
      </div>

      {shopProducts.length === 0 ? (
        <EmptyState
          icon={Search}
          title={t('noProducts')}
          description={t('noProductsDesc')}
          actionLabel={t('addProduct')}
          onAction={() => navigate('/owner/inventory/new')}
        />
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {shopProducts.map((product) => (
            <li
              key={product.id}
              className="flex min-h-[250px] flex-col rounded-3xl bg-white p-4 shadow-card"
            >
              <div className="mb-3 flex h-24 items-center justify-center overflow-hidden rounded-2xl bg-warm-100 text-sm font-bold uppercase text-warm-800/45">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  product.category
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 font-semibold leading-snug text-warm-900">{product.name}</p>
                <p className="mt-0.5 line-clamp-1 text-sm text-warm-800/55">{product.nameMr}</p>
                <p className="mt-1 font-bold text-forest">
                  ₹{product.price} / {product.unit}
                </p>
                <div className="mt-2 min-h-6">
                  <StockBadge status={product.stock} />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-[48px_1fr] gap-2">
                <Link
                  to={`/owner/inventory/edit/${product.id}`}
                  className="tap-target flex items-center justify-center rounded-xl bg-warm-100 text-forest transition-colors hover:bg-warm-200"
                  aria-label={`${t('editProduct')} ${product.name}`}
                >
                  <Pencil size={20} />
                </Link>
                <button
                  type="button"
                  onClick={() => updateProduct(product.id, { stock: cycleStock(product.stock) })}
                  className="min-h-12 rounded-xl bg-saffron/10 px-3 text-sm font-semibold text-saffron transition-colors hover:bg-saffron/15"
                >
                  Stock
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Link
        to="/owner/inventory/new"
        className="fixed bottom-24 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-saffron text-white shadow-lift lg:bottom-8"
        aria-label={t('addProduct')}
      >
        <Plus size={28} />
      </Link>
    </div>
  )
}
