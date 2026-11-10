import { useNavigate } from 'react-router-dom'
import { Store, Users } from 'lucide-react'
import { Logo } from '../components/ui/Logo'
import { Button } from '../components/ui/Button'
import { useApp } from '../context/AppContext'
import { useTranslation } from '../hooks/useTranslation'

export function SplashPage() {
  const navigate = useNavigate()
  const { setRole } = useApp()
  const { t } = useTranslation()

  const selectRole = (role: 'customer' | 'shopowner') => {
    setRole(role)
    navigate('/auth')
  }

  return (
    <div className="rangoli-bg relative flex min-h-screen flex-col">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 top-20 h-64 w-64 rounded-full bg-saffron/10 blur-3xl" />
        <div className="absolute -left-16 bottom-32 h-72 w-72 rounded-full bg-forest/10 blur-3xl" />
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="mb-8 flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-saffron/20 to-forest/20">
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-lift">
            <Store size={56} className="text-saffron" strokeWidth={1.5} />
          </div>
        </div>

        <Logo size="lg" />
        <p className="mt-3 text-center text-lg text-warm-800/80">{t('tagline')}</p>

        <div className="mt-12 w-full max-w-sm space-y-4">
          <Button
            fullWidth
            size="lg"
            onClick={() => selectRole('customer')}
            className="gap-3"
          >
            <Users size={22} />
            {t('iAmCustomer')}
          </Button>
          <Button
            fullWidth
            size="lg"
            variant="secondary"
            onClick={() => selectRole('shopowner')}
            className="gap-3"
          >
            <Store size={22} />
            {t('iAmShopOwner')}
          </Button>
        </div>
      </div>

      <p className="relative pb-8 text-center text-sm text-warm-800/50">
        Pickup only · Support local kirana
      </p>
    </div>
  )
}
