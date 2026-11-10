import { useNavigate } from 'react-router-dom'
import { LogOut, User, Phone } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { useApp } from '../../context/AppContext'
import { useTranslation } from '../../hooks/useTranslation'
import type { Language } from '../../types'

export function ProfilePage() {
  const navigate = useNavigate()
  const { user, language, setLanguage, logout } = useApp()
  const { t } = useTranslation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold text-warm-900">{t('profile')}</h1>

      <div className="rounded-3xl bg-white p-6 shadow-card">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-saffron/20 to-forest/20">
          <User size={40} className="text-saffron" />
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User size={20} className="text-warm-800/50" />
            <div>
              <p className="text-sm text-warm-800/60">{t('name')}</p>
              <p className="font-semibold text-warm-900">{user.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone size={20} className="text-warm-800/50" />
            <div>
              <p className="text-sm text-warm-800/60">{t('phone')}</p>
              <p className="font-semibold text-warm-900">{user.phone || '—'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-white p-4 shadow-card">
        <p className="mb-3 text-sm font-medium text-warm-800">{t('language')}</p>
        <div className="flex gap-2">
          {(['en', 'mr'] as Language[]).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguage(lang)}
              className={`min-h-12 flex-1 rounded-2xl font-semibold transition-colors ${
                language === lang
                  ? 'bg-saffron text-white'
                  : 'bg-warm-100 text-warm-800'
              }`}
            >
              {lang === 'en' ? t('english') : t('marathi')}
            </button>
          ))}
        </div>
      </div>

      <Button variant="outline" fullWidth className="mt-8 gap-2" onClick={handleLogout}>
        <LogOut size={20} />
        {t('logout')}
      </Button>
    </div>
  )
}
