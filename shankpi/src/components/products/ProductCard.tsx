import { Check, Plus } from 'lucide-react'
import { useState } from 'react'
import type { Product } from '../../types'
import { StockBadge } from '../ui/StatusBadge'
import { useTranslation } from '../../hooks/useTranslation'

interface ProductCardProps {
  product: Product
  onAdd: () => void
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const { t } = useTranslation()
  const [justAdded, setJustAdded] = useState(false)
  const disabled = product.stock === 'out_of_stock'

  const handleAdd = () => {
    if (disabled) return
    onAdd()
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1200)
  }

  return (
    <article className="flex flex-col rounded-3xl bg-white p-4 shadow-card">
      <div className="mb-3 flex h-28 items-center justify-center overflow-hidden rounded-2xl bg-warm-100 text-sm font-bold uppercase text-warm-800/45">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          product.category
        )}
      </div>
      <h3 className="line-clamp-2 font-semibold leading-snug text-warm-900">{product.name}</h3>
      <p className="mt-0.5 line-clamp-1 text-sm text-warm-800/55">{product.nameMr}</p>
      <p className="mt-2 text-base font-bold text-forest">
        {'\u20b9'}{product.price}
        <span className="text-sm font-normal text-warm-800/60"> / {product.unit}</span>
      </p>
      <div className="mt-2 flex items-center justify-between gap-2">
        <StockBadge status={product.stock} />
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={handleAdd}
        className={`mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-semibold transition-all ${
          disabled
            ? 'cursor-not-allowed bg-warm-100 text-warm-800/40'
            : justAdded
              ? 'bg-forest text-white'
              : 'bg-saffron text-white hover:bg-saffron-dark active:scale-[0.98]'
        }`}
      >
        {justAdded ? (
          <>
            <Check size={18} /> {t('added')}
          </>
        ) : (
          <>
            <Plus size={18} /> {t('addToCart')}
          </>
        )}
      </button>
    </article>
  )
}
