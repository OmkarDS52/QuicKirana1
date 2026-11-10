import { Home, Package, ShoppingCart, User, LayoutDashboard, ClipboardList } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { useTranslation } from '../../hooks/useTranslation'

interface NavItem {
  to: string
  icon: typeof Home
  labelKey: 'home' | 'orders' | 'cart' | 'profile' | 'dashboard' | 'inventory'
}

const customerNav: NavItem[] = [
  { to: '/customer', icon: Home, labelKey: 'home' },
  { to: '/customer/orders', icon: Package, labelKey: 'orders' },
  { to: '/customer/cart', icon: ShoppingCart, labelKey: 'cart' },
  { to: '/customer/profile', icon: User, labelKey: 'profile' },
]

const ownerNav: NavItem[] = [
  { to: '/owner', icon: LayoutDashboard, labelKey: 'dashboard' },
  { to: '/owner/orders', icon: ClipboardList, labelKey: 'orders' },
  { to: '/owner/inventory', icon: Package, labelKey: 'inventory' },
  { to: '/owner/profile', icon: User, labelKey: 'profile' },
]

export function BottomNav({ variant }: { variant: 'customer' | 'owner' }) {
  const items = variant === 'customer' ? customerNav : ownerNav
  const { t } = useTranslation()
  const { cartCount, cartBounce } = useApp()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-warm-200 bg-white/95 backdrop-blur-md safe-bottom lg:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {items.map(({ to, icon: Icon, labelKey }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/customer' || to === '/owner'}
            className={({ isActive }) =>
              `tap-target flex min-w-[4.5rem] flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                isActive ? 'text-saffron' : 'text-warm-800/60 hover:text-warm-800'
              }`
            }
          >
            <span className="relative">
              <Icon size={24} strokeWidth={2} />
              {variant === 'customer' && labelKey === 'cart' && cartCount > 0 && (
                <span
                  className={`absolute -right-2 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-saffron px-1 text-[10px] font-bold text-white ${cartBounce ? 'animate-cart-bounce' : ''}`}
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </span>
            <span>{t(labelKey)}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
