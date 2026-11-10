import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Logo } from '../components/ui/Logo'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useApp } from '../context/AppContext'
import { useTranslation } from '../hooks/useTranslation'
import { registerUser, loginUser } from '../api/services'

export function AuthPage() {
  const navigate = useNavigate()
  const { role, login } = useApp()
  const { t } = useTranslation()
  const [isRegister, setIsRegister] = useState(false)
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  if (!role) {
    navigate('/')
    return null
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!/^\d{10}$/.test(phone.replace(/\D/g, '').slice(-10))) {
      e.phone = t('invalidPhone')
    }
    if (password.length < 4) e.password = t('invalidPassword')
    if (isRegister && name.trim().length < 2) e.name = t('invalidName')
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)

    try {
      const backendRole = role === 'customer' ? 'CUSTOMER' : 'SHOP_OWNER'

      let response
      if (isRegister) {
        response = await registerUser({ name, phone, password, role: backendRole })
      } else {
        response = await loginUser({ phone, password })
      }

      // Save token and user info
      localStorage.setItem('token', response.token)
      localStorage.setItem('userId', response.userId)
      localStorage.setItem('role', role!)
      localStorage.setItem('userName', response.name)   // ← add this
      localStorage.setItem('userPhone', phone)

      login({ name: response.name, phone })
      navigate(role === 'customer' ? '/customer' : '/owner')

    } catch (err: any) {
      setErrors({ general: err.response?.data?.error || 'Something went wrong' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rangoli-bg flex min-h-screen flex-col px-6 py-8">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="tap-target mb-6 flex w-fit items-center gap-2 rounded-xl text-forest"
      >
        <ArrowLeft size={22} />
        <span className="font-medium">Back</span>
      </button>

      <Logo size="md" />
      <h1 className="mt-6 text-2xl font-bold text-warm-900">
        {isRegister ? t('createAccount') : t('welcomeBack')}
      </h1>
      <p className="mt-1 text-warm-800/70">
        {role === 'customer' ? t('customerLogin') : t('shopOwnerLogin')}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-1 flex-col gap-4">
        {isRegister && (
          <Input
            label={t('name')}
            placeholder={t('namePlaceholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />
        )}
        <Input
          label={t('phone')}
          type="tel"
          inputMode="numeric"
          placeholder={t('phonePlaceholder')}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={errors.phone}
        />
        <Input
          label={t('password')}
          type="password"
          placeholder={t('passwordPlaceholder')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <Button type="submit" fullWidth size="lg" loading={loading} className="mt-4">
          {isRegister ? t('register') : t('login')}
        </Button>

        <p className="text-center text-base text-warm-800/70">
          {isRegister ? t('haveAccount') : t('noAccount')}{' '}
          <button
            type="button"
            className="font-semibold text-saffron underline-offset-2 hover:underline"
            onClick={() => {
              setIsRegister(!isRegister)
              setErrors({})
            }}
          >
            {isRegister ? t('login') : t('register')}
          </button>
          {errors.general && (
            <p className="text-center text-sm text-red-500">{errors.general}</p>
          )}
        </p>
      </form>
    </div>
  )
}
