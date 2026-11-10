import { Store, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Shop } from '../../types'
import { OpenBadge } from '../ui/StatusBadge'
import { useApp } from '../../context/AppContext'

interface ShopCardProps {
  shop: Shop
  variant?: 'horizontal' | 'grid'
}

export function ShopCard({ shop, variant = 'grid' }: ShopCardProps) {
  const { language } = useApp()
  const name = language === 'mr' ? shop.nameMr : shop.name
  const area = language === 'mr' ? shop.areaMr : shop.area

  if (variant === 'horizontal') {
    return (
      <Link
        to={`/customer/shop/${shop.id}`}
        className="flex min-w-[170px] flex-col rounded-3xl bg-white p-4 shadow-card transition-transform hover:scale-[1.02] active:scale-[0.98]"
      >
        <div className="mb-3 flex h-20 items-center justify-center rounded-2xl bg-gradient-to-br from-saffron/15 to-forest/15">
          <Store size={36} className="text-saffron" strokeWidth={1.5} />
        </div>
        <h3 className="line-clamp-1 font-semibold text-warm-900">{name}</h3>
        <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
          <span className="text-sm text-warm-800/60">{area}</span>
          {shop.distance !== undefined && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-forest/10 px-1.5 py-0.5 text-xs font-semibold text-forest">
              <MapPin size={10} />
              {shop.distance.toFixed(1)} km
            </span>
          )}
        </div>
        <div className="mt-2">
          <OpenBadge isOpen={shop.isOpen} />
        </div>
      </Link>
    )
  }

  return (
    <Link
      to={`/customer/shop/${shop.id}`}
      className="flex gap-4 rounded-3xl bg-white p-4 shadow-card transition-transform hover:scale-[1.01] active:scale-[0.99]"
    >
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-saffron/15 to-forest/15">
        <Store size={28} className="text-saffron" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-warm-900">{name}</h3>
        <div className="flex flex-wrap items-center gap-2 mt-0.5">
          <span className="text-sm text-warm-800/60">{area}</span>
          {shop.distance !== undefined && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-forest/10 px-1.5 py-0.5 text-xs font-semibold text-forest">
              <MapPin size={10} />
              {shop.distance.toFixed(1)} km
            </span>
          )}
        </div>
        <div className="mt-2">
          <OpenBadge isOpen={shop.isOpen} />
        </div>
      </div>
    </Link>
  )
}
