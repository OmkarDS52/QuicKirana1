import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Image, Upload } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useApp } from '../../context/AppContext'
import { useTranslation } from '../../hooks/useTranslation'
import type { StockStatus } from '../../types'
import { productImageLibrary } from '../../data/productImageLibrary'

const categories = ['grains', 'dairy', 'spices', 'oil', 'snacks', 'beverages']
const units = ['kg', 'litre', 'piece', 'packet'] as const
const stockOptions: StockStatus[] = ['in_stock', 'low_stock', 'out_of_stock']

export function ProductFormPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { products, addProduct, updateProduct, shopId } = useApp()
  const { t } = useTranslation()
  const isEdit = Boolean(productId && productId !== 'new')

  const [name, setName] = useState('')
  const [nameMr, setNameMr] = useState('')
  const [category, setCategory] = useState('grains')
  const [price, setPrice] = useState('')
  const [unit, setUnit] = useState<string>('kg')
  const [stock, setStock] = useState<StockStatus>('in_stock')
  const [imageUrl, setImageUrl] = useState('')
  const [imageFile, setImageFile] = useState<File | undefined>()
  const [imagePreview, setImagePreview] = useState('')
  const [imageSource, setImageSource] = useState<'upload' | 'library'>('library')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit && productId) {
      const p = products.find((x) => x.id === productId)
      if (p) {
        setName(p.name)
        setNameMr(p.nameMr)
        setCategory(p.category)
        setPrice(String(p.price))
        setUnit(p.unit)
        setStock(p.stock)
        setImageUrl(p.imageUrl ?? '')
        setImagePreview(p.imageUrl ?? '')
      }
    }
  }, [isEdit, productId, products])

  useEffect(() => {
    if (!imageFile) return

    const objectUrl = URL.createObjectURL(imageFile)
    setImagePreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [imageFile])

  const handleSave = async () => {
    setError('')
    if (!shopId) {
      setError('Please create or load your shop profile before adding products.')
      return
    }

    const data = {
      shopId,
      name,
      nameMr,
      category,
      price: Number(price) || 0,
      unit,
      stock,
      imageUrl,
      imageFile,
    }

    try {
      console.log(data);
      setSaving(true)
      if (isEdit && productId) {
        await updateProduct(productId, data)
      } else {
        await addProduct(data)
      }
      navigate('/owner/inventory')
    } catch (err) {
      console.error('Failed to save product', err)
      setError('Product could not be saved. Please check your shop profile and try again.')
    } finally {
      setSaving(false)
    }
  }

  const stockLabel = (s: StockStatus) => {
    if (s === 'in_stock') return t('inStock')
    if (s === 'low_stock') return t('lowStock')
    return t('outOfStock')
  }

  const selectLibraryImage = (url: string) => {
    setImageSource('library')
    setImageUrl(url)
    setImagePreview(url)
    setImageFile(undefined)
  }

  const selectUploadedImage = (file?: File) => {
    if (!file) return
    setImageSource('upload')
    setImageUrl('')
    setImageFile(file)
  }

  return (
    <div className="px-4 py-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="tap-target mb-4 flex items-center gap-2 text-forest"
      >
        <ArrowLeft size={22} />
        {t('inventory')}
      </button>

      <h1 className="mb-6 text-2xl font-bold">
        {isEdit ? t('editProduct') : t('addProduct')}
      </h1>

      <div className="space-y-4">
        <Input label={t('productName')} value={name} onChange={(e) => setName(e.target.value)} />
        <Input label={t('productNameMr')} value={nameMr} onChange={(e) => setNameMr(e.target.value)} />

        <div className="rounded-3xl bg-white p-4 shadow-card">
          <label className="mb-3 block text-sm font-medium">Product image</label>

          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-warm-100">
              {imagePreview ? (
                <img src={imagePreview} alt="" className="h-full w-full object-cover" />
              ) : (
                <Image size={28} className="text-warm-800/35" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="grid grid-cols-2 gap-2">
                <label
                  className={`flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl px-3 text-sm font-semibold ${
                    imageSource === 'upload' ? 'bg-forest text-white' : 'bg-warm-100 text-forest'
                  }`}
                >
                  <Upload size={18} />
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => selectUploadedImage(e.target.files?.[0])}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setImageSource('library')}
                  className={`min-h-12 rounded-2xl px-3 text-sm font-semibold ${
                    imageSource === 'library' ? 'bg-forest text-white' : 'bg-warm-100 text-forest'
                  }`}
                >
                  Library
                </button>
              </div>
            </div>
          </div>

          {imageSource === 'library' && (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {productImageLibrary.map((image) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => selectLibraryImage(image.url)}
                  className={`overflow-hidden rounded-2xl border-2 bg-warm-100 ${
                    imageUrl === image.url ? 'border-saffron' : 'border-transparent'
                  }`}
                  aria-label={`Use ${image.label} image`}
                >
                  <img src={image.url} alt="" className="aspect-square w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">{t('category')}</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="min-h-12 w-full rounded-2xl border-2 border-warm-200 bg-white px-4 outline-none focus:border-saffron"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <Input
          label={t('price')}
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium">{t('unit')}</label>
          <div className="flex flex-wrap gap-2">
            {units.map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setUnit(u)}
                className={`min-h-12 rounded-2xl px-4 font-medium ${
                  unit === u ? 'bg-saffron text-white' : 'bg-white shadow-card'
                }`}
              >
                {t(u)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">{t('stockStatus')}</label>
          <div className="flex flex-wrap gap-2">
            {stockOptions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStock(s)}
                className={`min-h-12 rounded-2xl px-4 font-medium ${
                  stock === s ? 'bg-forest text-white' : 'bg-white shadow-card'
                }`}
              >
                {stockLabel(s)}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}

        <Button fullWidth size="lg" className="mt-4" onClick={handleSave} loading={saving}>
          {t('save')}
        </Button>
      </div>
    </div>
  )
}
