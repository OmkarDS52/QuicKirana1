import apiClient from './apiClient'

export const resolveBackendAssetUrl = (url?: string | null) => {
  if (!url) return ''
  if (/^(https?:|blob:|data:)/.test(url)) return url
  if (!url.startsWith('/uploads/')) return url

  const apiBaseUrl = String(apiClient.defaults.baseURL ?? '').replace(/\/api\/?$/, '')
  return apiBaseUrl ? `${apiBaseUrl}${url}` : url
}

// ─── AUTH ───────────────────────────────────────────

export const registerUser = async (data: {
  name: string
  phone: string
  password: string
  role: 'CUSTOMER' | 'SHOP_OWNER'
}) => {
  const res = await apiClient.post('/auth/register', data)
  return res.data
}

export const loginUser = async (data: {
  phone: string
  password: string
}) => {
  const res = await apiClient.post('/auth/login', data)
  return res.data
}

// ─── SHOPS ──────────────────────────────────────────

export const getShopsByArea = async (area: string) => {
  const res = await apiClient.get(`/shops/area/${area}`)
  return res.data
}

export const getShopById = async (shopId: string) => {
  const res = await apiClient.get(`/shops/${shopId}`)
  return res.data
}

export const getMyShop = async () => {
  const res = await apiClient.get('/shops/my')
  return res.data
}

export const getAllShops = async () => {
  const res = await apiClient.get('/shops/all')
  return res.data
}

export const getAreas = async () => {
  const res = await apiClient.get('/shops/areas')
  return res.data
}

export const createShop = async (data: {
  name: string
  address: string
  area: string
  city: string
  phone: string
  whatsappNumber: string
}) => {
  const res = await apiClient.post('/shops', data)
  return res.data
}

export const updateShop = async (data: {
  name: string
  address: string
  area: string
  phone: string
  whatsappNumber: string
}) => {
  const res = await apiClient.put('/shops/my', data)
  return res.data
}

export const toggleShopStatus = async () => {
  const res = await apiClient.patch('/shops/my/toggle')
  return res.data
}

// ─── PRODUCTS ───────────────────────────────────────

export const getProductsByShop = async (shopId: string) => {
  const res = await apiClient.get(`/products/shop/${shopId}`)
  return res.data
}

export const getProductsByCategory = async (shopId: string, category: string) => {
  const res = await apiClient.get(`/products/shop/${shopId}/category/${category}`)
  return res.data
}

export const uploadProductImage = async (file: File) => {
  const formData = new FormData()
  formData.append('image', file)
  const res = await apiClient.post('/products/images', formData)
  const imageUrl = resolveBackendAssetUrl(res.data?.imageUrl ?? res.data?.url)
  return { ...res.data, imageUrl, url: imageUrl }
}

export const addProduct = async (data: {
  shopId?: string
  name: string
  nameMarathi: string
  category: string
  unit: string
  pricePerUnit: number
  stockApprox: string
  imageUrl?: string
}) => {
  const res = await apiClient.post('/products', data)
  return res.data
}

export const updateProduct = async (productId: string, data: {
  shopId?: string
  name: string
  nameMarathi: string
  category: string
  unit: string
  pricePerUnit: number
  stockApprox: string
  imageUrl?: string
}) => {
  const res = await apiClient.put(`/products/${productId}`, data)
  return res.data
}

export const toggleProduct = async (productId: string) => {
  const res = await apiClient.patch(`/products/${productId}/toggle`)
  return res.data
}

export const updateStockStatus = async (productId: string, status: string) => {
  const res = await apiClient.patch(`/products/${productId}/stock/${status}`)
  return res.data
}

// ─── ORDERS ─────────────────────────────────────────

export const createOrder = async (data: {
  shopId: string
  customerNote?: string
  paymentMode: string
  items: { productId: string; quantity: string; note?: string }[]
}) => {
  const res = await apiClient.post('/orders', data)
  return res.data
}

export const getMyOrders = async () => {
  const res = await apiClient.get('/orders/my')
  return res.data
}

export const getOrderById = async (orderId: string) => {
  const res = await apiClient.get(`/orders/${orderId}`)
  return res.data
}

export const getShopOrders = async (shopId: string) => {
  const res = await apiClient.get(`/orders/shop/${shopId}`)
  return res.data
}

export const updateOrderStatus = async (orderId: string, data: {
  status: string
  rejectionReason?: string
}) => {
  const res = await apiClient.put(`/orders/${orderId}/status`, data)
  return res.data
}

// ─── NOTIFICATIONS ───────────────────────────────────

export const getUnreadNotifications = async () => {
  const res = await apiClient.get('/notifications/unread')
  return res.data
}

export const markAllNotificationsRead = async () => {
  const res = await apiClient.patch('/notifications/read-all')
  return res.data
}
