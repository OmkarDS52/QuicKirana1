export type Language = 'en' | 'mr'
export type UserRole = 'customer' | 'shopowner'
export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock'
export type PaymentMode = 'cash' | 'upi' | 'credit'
export type OrderStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY'
  | 'COMPLETED'
  | 'REJECTED'

export interface Shop {
  id: string
  name: string
  nameMr: string
  area: string
  areaMr: string
  isOpen: boolean
  whatsapp: string
  whatsappNumber?: string
  followed?: boolean
  latitude?: number
  longitude?: number
  distance?: number
}

export interface Product {
  id: string
  shopId: string
  name: string
  nameMr: string
  category: string
  price: number
  unit: string
  stock: StockStatus
  imageUrl?: string
}

export interface CartItem {
  productId: string
  shopId: string        // required again
  shopName: string      // add this so we know shop name at checkout
  quantity: number
  note?: string
}

export interface OrderItem {
  productId: string
  name: string
  nameMr: string
  price: number
  unit: string
  quantity: number
  note?: string
  packed?: boolean
  unavailable?: boolean
}

export interface Order {
  id: string
  shopId: string
  shopName: string
  customerName: string
  customerPhone: string
  items: OrderItem[]
  status: OrderStatus
  paymentMode: PaymentMode
  orderNote?: string
  total: number
  createdAt: string
  rejectionReason?: string
}

export interface UserProfile {
  name: string
  phone: string
}

export interface ShopSettings {
  shopId: string
  name: string
  address: string
  area: string
  phone: string
  whatsapp: string
  ownerName: string
  isOpen: boolean
}
