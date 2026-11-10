import {
  Home,
  Package,
  ShoppingCart,
  User,
  LayoutDashboard,
  ClipboardList,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Logo } from './Logo'
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

export function Sidebar({ variant }: { variant: 'customer' | 'owner' }) {
  const items = variant === 'customer' ? customerNav : ownerNav
  const { t } = useTranslation()

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-warm-200 lg:bg-white lg:fixed lg:inset-y-0 lg:left-0">
      <div className="border-b border-warm-200 p-6">
        <Logo size="sm" />
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {items.map(({ to, icon: Icon, labelKey }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/customer' || to === '/owner'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium transition-colors ${
                isActive
                  ? 'bg-saffron/10 text-saffron'
                  : 'text-warm-800/70 hover:bg-warm-100 hover:text-warm-900'
              }`
            }
          >
            <Icon size={22} />
            {t(labelKey)}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
