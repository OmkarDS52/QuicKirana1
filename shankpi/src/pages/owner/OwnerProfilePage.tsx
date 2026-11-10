import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Store } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useApp } from '../../context/AppContext'
import { useTranslation } from '../../hooks/useTranslation'
import { createShop, getMyShop } from '../../api/services'

export function OwnerProfilePage() {
  const navigate = useNavigate()
  const { shopSettings, updateShopSettings, logout } = useApp()
  const { t } = useTranslation()
  const [form, setForm] = useState(shopSettings)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (shopSettings && shopSettings.shopId) {
      setForm(shopSettings)
    }
  }, [shopSettings])

  const handleSave = async () => {
    try {
      if (!shopSettings.shopId) {
        // No shop yet — create it
        await createShop({
          name: form.name,
          address: form.address,
          area: form.area,
          city: 'Kolhapur',
          phone: form.phone,
          whatsappNumber: form.whatsapp,
        })
        // Reload shop into context
        const shop = await getMyShop()
        updateShopSettings({
          shopId: shop.id,
          name: shop.name,
          address: shop.address,
          area: shop.area,
          phone: shop.phone,
          whatsapp: shop.whatsappNumber,
          isOpen: shop.isOpen,
        })
      } else {
        // Shop exists — update it
        await updateShopSettings({
          name: form.name,
          address: form.address,
          area: form.area,
          phone: form.phone,
          whatsapp: form.whatsapp,
        })
      }
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    } catch (err) {
      console.error('Failed to save shop', err)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('../')
  }

  return (
    <div className="px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold text-warm-900">{t('shopSettings')}</h1>

      <div className="mb-6 flex items-center justify-between rounded-3xl bg-white p-4 shadow-card">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-saffron/10">
            <Store className="text-saffron" size={24} />
          </div>
          <span className="font-medium">{form.isOpen ? t('toggleOpen') : t('toggleClosed')}</span>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={form.isOpen}
          onClick={() => setForm((f) => ({ ...f, isOpen: !f.isOpen }))}
          className={`relative h-8 w-14 rounded-full transition-colors ${form.isOpen ? 'bg-forest' : 'bg-gray-300'
            }`}
        >
          <span
            className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${form.isOpen ? 'left-7' : 'left-1'
              }`}
          />
        </button>
      </div>

      <div className="space-y-4 rounded-3xl bg-white p-4 shadow-card">
        <Input
          label={t('shopName')}
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <Input
          label={t('address')}
          value={form.address}
          onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
        />
        <Input
          label={t('area')}
          value={form.area}
          onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
        />
        <Input
          label={t('phone')}
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
        />
        <Input
          label={t('whatsapp')}
          value={form.whatsapp}
          onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
        />
        <Input
          label={t('ownerName')}
          value={form.ownerName}
          onChange={(e) => setForm((f) => ({ ...f, ownerName: e.target.value }))}
        />
        <Button fullWidth onClick={handleSave}>
          {t('saveChanges')}
        </Button>
        {success && <p className="text-sm font-medium text-forest">Saved successfully.</p>}
      </div>

      <Button variant="outline" fullWidth className="mt-8 gap-2" onClick={handleLogout}>
        <LogOut size={20} />
        {t('logout')}
      </Button>
    </div>
  )
}
