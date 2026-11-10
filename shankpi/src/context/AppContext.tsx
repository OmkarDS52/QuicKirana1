import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  CartItem,
  Language,
  Order,
  OrderStatus,
  PaymentMode,
  Product,
  ShopSettings,
  StockStatus,
  UserProfile,
  UserRole,
} from '../types'
import {
  getMyOrders,
  getShopOrders,
  getProductsByShop,
  getMyShop,
  createOrder as apiCreateOrder,
  updateOrderStatus as apiUpdateOrderStatus,
  addProduct as apiAddProduct,
  updateProduct as apiUpdateProduct,
  uploadProductImage,
  resolveBackendAssetUrl,
  updateStockStatus,
  updateShop as apiUpdateShop,
} from '../api/services'

interface AppContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  role: UserRole | null
  setRole: (role: UserRole | null) => void
  isAuthenticated: boolean
  login: (profile: UserProfile) => void
  logout: () => void
  user: UserProfile
  shopSettings: ShopSettings
  updateShopSettings: (s: Partial<ShopSettings>) => void
  shopId: string | null
  products: Product[]
  loadProducts: (shopId: string) => Promise<void>
  addProduct: (p: Omit<Product, 'id'> & { imageFile?: File }) => Promise<void>
  updateProduct: (id: string, p: Partial<Product> & { imageFile?: File }) => Promise<void>
  deleteProduct: (id: string) => void
  cart: CartItem[]
  addToCart: (productId: string, shopId: string, shopName: string) => void
  updateCartQty: (productId: string, delta: number) => void
  updateCartNote: (productId: string, note: string) => void
  clearCart: () => void
  cartShopId: string | null
  cartCount: number
  cartTotal: (products: Product[]) => number
  orders: Order[]
  loadOrders: () => Promise<void>
  placeOrder: (opts: {
    paymentMode: PaymentMode
    orderNote?: string
    items: CartItem[]
    products: Product[]
  }) => Promise<string>
  updateOrderStatus: (id: string, status: OrderStatus, rejectionReason?: string) => Promise<void>
  updateOrderItemPacked: (orderId: string, productId: string, packed: boolean) => void
  toggleOrderItemUnavailable: (orderId: string, productId: string) => void
  cartBounce: boolean
  triggerCartBounce: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

const emptyUser: UserProfile = { name: '', phone: '' }
const emptyShop: ShopSettings = {
  shopId: '', name: '', address: '', area: '',
  phone: '', whatsapp: '', ownerName: '', isOpen: true,
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')
  const [role, setRole] = useState<UserRole | null>(
    () => localStorage.getItem('role') as UserRole | null
  )
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem('token')
  )
  const [user, setUser] = useState<UserProfile>(emptyUser)
  const [shopSettings, setShopSettings] = useState<ShopSettings>(emptyShop)
  const [shopId, setShopId] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [orders, setOrders] = useState<Order[]>([])
  const [cartBounce, setCartBounce] = useState(false)

  // Reload products for cart shop on refresh
  useEffect(() => {
    if (cart.length > 0 && cart[0].shopId) {
      loadProducts(cart[0].shopId)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])


  const login = useCallback((profile: UserProfile) => {
    setUser(profile)
    setIsAuthenticated(true)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('role')
    localStorage.removeItem('userName')
    localStorage.removeItem('userPhone')
    localStorage.removeItem('cart')
    setIsAuthenticated(false)
    setRole(null)
    setCart([])
    setOrders([])
    setProducts([])
    setShopId(null)
    setUser(emptyUser)
    setShopSettings(emptyShop)
  }, [])

  useEffect(() => {
    const name = localStorage.getItem('userName')
    const phone = localStorage.getItem('userPhone')
    if (name && phone) setUser({ name, phone })
  }, [])

  useEffect(() => {
    if (isAuthenticated && role) {
      loadOrders()
    }
  }, [isAuthenticated, role])


  // Load shop owner's shop on login
  useEffect(() => {
    if (isAuthenticated && role === 'shopowner') {
      getMyShop()
        .then((shop) => {
          setShopId(shop.id)
          setShopSettings({
            shopId: shop.id,
            name: shop.name,
            address: shop.address ?? '',
            area: shop.area ?? '',
            phone: shop.phone ?? '',
            whatsapp: shop.whatsappNumber ?? '',
            ownerName: shop.ownerName ?? '',
            isOpen: shop.isOpen,
          })
          return shop.id
        })
        .then((id) => loadProducts(id))
        .catch(() => { })
    }
  }, [isAuthenticated, role])

  const updateShopSettings = useCallback(async (s: Partial<ShopSettings>) => {
    setShopSettings((prev) => ({ ...prev, ...s }))
    try {
      await apiUpdateShop({
        name: s.name ?? '',
        address: s.address ?? '',
        area: s.area ?? '',
        phone: s.phone ?? '',
        whatsappNumber: s.whatsapp ?? '',
      })
    } catch (err) {
      console.error('Failed to update shop', err)
    }
  }, [])

  const loadProducts = useCallback(async (sid: string) => {
    try {
      const data = await getProductsByShop(sid)
      // Map backend response to frontend Product type
      const mapped: Product[] = data.map((p: any) => ({
        id: p.id,
        shopId: p.shopId,
        name: p.name,
        nameMr: p.nameMarathi ?? '',
        category: p.category ?? '',
        price: Number(p.pricePerUnit),
        unit: p.unit ?? '',
        imageUrl: resolveBackendAssetUrl(p.imageUrl),
        stock: p.stockApprox
          ?.toLowerCase()
          .replace(' ', '_') as StockStatus,
      }))
      setProducts(mapped)
    } catch (err) {
      console.error('Failed to load products', err)
    }
  }, [])

  const addProduct = useCallback(async (p: Omit<Product, 'id'> & { imageFile?: File }) => {
    try {
      const uploaded = p.imageFile ? await uploadProductImage(p.imageFile) : null
      const imageUrl = uploaded?.imageUrl ?? uploaded?.url ?? p.imageUrl
      await apiAddProduct({
        shopId: p.shopId,
        name: p.name,
        nameMarathi: p.nameMr,
        category: p.category,
        unit: p.unit,
        pricePerUnit: p.price,
        stockApprox: p.stock.toUpperCase(),
        imageUrl,
      })
      if (p.shopId) await loadProducts(p.shopId)
    } catch (err) {
      console.error('Failed to add product', err)
      throw err
    }
  }, [loadProducts])

  const updateProduct = useCallback(async (id: string, p: Partial<Product> & { imageFile?: File }) => {
    try {
      if (p.stock && !p.name) {
        // Only stock update
        await updateStockStatus(id, p.stock.toUpperCase())
      } else {
        const existing = products.find((product) => product.id === id)
        const uploaded = p.imageFile ? await uploadProductImage(p.imageFile) : null
        const imageUrl = uploaded?.imageUrl ?? uploaded?.url ?? p.imageUrl ?? existing?.imageUrl
        await apiUpdateProduct(id, {
          shopId: p.shopId,
          name: p.name ?? existing?.name ?? '',
          nameMarathi: p.nameMr ?? existing?.nameMr ?? '',
          category: p.category ?? existing?.category ?? '',
          unit: p.unit ?? existing?.unit ?? '',
          pricePerUnit: p.price ?? existing?.price ?? 0,
          stockApprox: p.stock?.toUpperCase() ?? existing?.stock.toUpperCase() ?? 'IN_STOCK',
          imageUrl,
        })
      }
      setProducts((prev) => prev.map((x) => (x.id === id ? { ...x, ...p } : x)))
    } catch (err) {
      console.error('Failed to update product', err)
      throw err
    }
  }, [products])

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((x) => x.id !== id))
  }, [])


  const cartShopId = cart[0]?.shopId ?? null

  const addToCart = useCallback((productId: string, sid: string, sName: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === productId)
      if (existing) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i,
        )
      }
      return [...prev, { productId, shopId: sid, shopName: sName, quantity: 1 }]
    })
    setCartBounce(true)
    setTimeout(() => setCartBounce(false), 500)
  }, [])

  const updateCartQty = useCallback((productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity + delta } : i,
        )
        .filter((i) => i.quantity > 0),
    )
  }, [])

  const updateCartNote = useCallback((productId: string, note: string) => {
    setCart((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, note } : i)),
    )
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const cartCount = useMemo(
    () => cart.reduce((s, i) => s + i.quantity, 0),
    [cart],
  )

  const cartTotal = useCallback(
    (prods: Product[]) =>
      cart.reduce((sum, item) => {
        const p = prods.find((x) => x.id === item.productId)
        return sum + (p?.price ?? 0) * item.quantity
      }, 0),
    [cart],
  )

  const loadOrders = useCallback(async () => {
    try {
      let data
      if (role === 'customer') {
        data = await getMyOrders()
      } else if (role === 'shopowner' && shopId) {
        data = await getShopOrders(shopId)
      } else return

      const mapped: Order[] = data.map((o: any) => ({
        id: o.id,
        shopId: o.shopId,
        shopName: o.shopName,
        customerName: o.customerName,
        customerPhone: '',
        items: o.items.map((i: any) => ({
          productId: i.id,
          name: i.itemName,
          nameMr: '',
          price: Number(i.unitPrice ?? 0),
          unit: '',
          quantity: Number(i.quantity),
          note: i.note,
        })),
        status: (o.status === 'READY_FOR_PICKUP' ? 'READY' : o.status) as OrderStatus,
        paymentMode: o.paymentMode.toLowerCase() as PaymentMode,
        orderNote: o.customerNote,
        total: Number(o.totalAmount ?? 0),
        createdAt: o.createdAt,
        rejectionReason: o.rejectionReason,
      }))
      setOrders(mapped)
    } catch (err) {
      console.error('Failed to load orders', err)
    }
  }, [role, shopId])

  const placeOrder = useCallback(async (opts: {
    paymentMode: PaymentMode
    orderNote?: string
    items: CartItem[]
    products: Product[]
  }) => {
    // Group cart items by shopId
    const grouped = opts.items.reduce<Record<string, CartItem[]>>((acc, item) => {
      if (!acc[item.shopId]) acc[item.shopId] = []
      acc[item.shopId].push(item)
      return acc
    }, {})

    // Send one order per shop
    const orderIds: string[] = []
    for (const [sid, shopItems] of Object.entries(grouped)) {
      const res = await apiCreateOrder({
        shopId: sid,
        customerNote: opts.orderNote,
        paymentMode: opts.paymentMode.toUpperCase(),
        items: shopItems.map((i) => ({
          productId: i.productId,
          quantity: String(i.quantity),
          note: i.note,
        })),
      })
      orderIds.push(res.id)
    }

    clearCart()
    await loadOrders()
    return orderIds[0] // return first order id for navigation
  }, [clearCart, loadOrders])

  const updateOrderStatus = useCallback(
    async (id: string, status: OrderStatus, rejectionReason?: string) => {
      // Update UI immediately
      setOrders((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, status, rejectionReason } : o
        )
      )
      try {
        const backendStatus = status.toUpperCase().replace('READY', 'READY_FOR_PICKUP')
        await apiUpdateOrderStatus(id, { status: backendStatus, rejectionReason })
      } catch (err) {
        // Rollback if API fails
        console.error('Status update failed, rolling back', err)
        await loadOrders()
      }
    },
    [loadOrders],
  )

  const updateOrderItemPacked = useCallback(
    (orderId: string, productId: string, packed: boolean) => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
              ...o,
              items: o.items.map((i) =>
                i.productId === productId ? { ...i, packed } : i,
              ),
            }
            : o,
        ),
      )
    },
    [],
  )

  const toggleOrderItemUnavailable = useCallback(
    (orderId: string, productId: string) => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
              ...o,
              items: o.items.map((i) =>
                i.productId === productId
                  ? { ...i, unavailable: !i.unavailable }
                  : i,
              ),
            }
            : o,
        ),
      )
    },
    [],
  )

  const triggerCartBounce = useCallback(() => {
    setCartBounce(true)
    setTimeout(() => setCartBounce(false), 500)
  }, [])

  const value = useMemo(
    () => ({
      language, setLanguage,
      role, setRole,
      isAuthenticated,
      login, logout,
      user,
      shopSettings, updateShopSettings,
      shopId,
      products, loadProducts, addProduct, updateProduct, deleteProduct,
      cart, addToCart, updateCartQty, updateCartNote, clearCart,
      cartShopId, cartCount, cartTotal,
      orders, loadOrders, placeOrder, updateOrderStatus,
      updateOrderItemPacked, toggleOrderItemUnavailable,
      cartBounce, triggerCartBounce,
    }),
    [
      language, role, isAuthenticated, login, logout, user,
      shopSettings, updateShopSettings, shopId,
      products, loadProducts, addProduct, updateProduct, deleteProduct,
      cart, addToCart, updateCartQty, updateCartNote, clearCart,
      cartShopId, cartCount, cartTotal,
      orders, loadOrders, placeOrder, updateOrderStatus,
      updateOrderItemPacked, toggleOrderItemUnavailable,
      cartBounce, triggerCartBounce,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

export function cycleStock(current: StockStatus): StockStatus {
  const order: StockStatus[] = ['in_stock', 'low_stock', 'out_of_stock']
  const i = order.indexOf(current)
  return order[(i + 1) % order.length]
}
