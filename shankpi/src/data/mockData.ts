import type { Order, Product, Shop } from '../types'

export const shops: Shop[] = [
  {
    id: 'shop-1',
    name: 'Sharma Kirana Store',
    nameMr: 'शर्मा किराणा स्टोअर',
    area: 'Kothrud',
    areaMr: 'कोथरूड',
    isOpen: true,
    whatsapp: '9876543210',
    followed: true,
  },
  {
    id: 'shop-2',
    name: 'Patil General Stores',
    nameMr: 'पाटील जनरल स्टोअर्स',
    area: 'Karve Nagar',
    areaMr: 'कर्वे नगर',
    isOpen: true,
    whatsapp: '9876543211',
    followed: true,
  },
  {
    id: 'shop-3',
    name: 'Desai Provision',
    nameMr: 'देसाई प्रोव्हिजन',
    area: 'Warje',
    areaMr: 'वारजे',
    isOpen: false,
    whatsapp: '9876543212',
  },
  {
    id: 'shop-4',
    name: 'Ganesh Kirana',
    nameMr: 'गणेश किराणा',
    area: 'Baner',
    areaMr: 'बाणेर',
    isOpen: true,
    whatsapp: '9876543213',
  },
  {
    id: 'shop-5',
    name: 'Sai Mart',
    nameMr: 'साई मार्ट',
    area: 'Aundh',
    areaMr: 'औंध',
    isOpen: true,
    whatsapp: '9876543214',
  },
]

export const initialProducts: Product[] = [
  { id: 'p1', shopId: 'shop-1', name: 'Basmati Rice', nameMr: 'बासमती तांदूळ', category: 'grains', price: 85, unit: 'kg', stock: 'in_stock' },
  { id: 'p2', shopId: 'shop-1', name: 'Toor Dal', nameMr: 'तूर डाळ', category: 'grains', price: 120, unit: 'kg', stock: 'in_stock' },
  { id: 'p3', shopId: 'shop-1', name: 'Amul Milk', nameMr: 'अमूल दूध', category: 'dairy', price: 28, unit: 'litre', stock: 'low_stock' },
  { id: 'p4', shopId: 'shop-1', name: 'Turmeric Powder', nameMr: 'हळद पूड', category: 'spices', price: 45, unit: 'packet', stock: 'in_stock' },
  { id: 'p5', shopId: 'shop-1', name: 'Sunflower Oil', nameMr: 'सूर्यफूल तेल', category: 'oil', price: 165, unit: 'litre', stock: 'in_stock' },
  { id: 'p6', shopId: 'shop-1', name: 'Red Chilli Powder', nameMr: 'लाल मिरची पूड', category: 'spices', price: 55, unit: 'packet', stock: 'out_of_stock' },
  { id: 'p7', shopId: 'shop-1', name: 'Parle-G Biscuits', nameMr: 'पारले-जी बिस्किट', category: 'snacks', price: 10, unit: 'packet', stock: 'in_stock' },
  { id: 'p8', shopId: 'shop-1', name: 'Masala Chai', nameMr: 'मसाला चहा', category: 'beverages', price: 180, unit: 'packet', stock: 'in_stock' },
  { id: 'p9', shopId: 'shop-2', name: 'Wheat Flour', nameMr: 'गहू पीठ', category: 'grains', price: 42, unit: 'kg', stock: 'in_stock' },
  { id: 'p10', shopId: 'shop-2', name: 'Curd', nameMr: 'दही', category: 'dairy', price: 35, unit: 'piece', stock: 'in_stock' },
]

export const initialOrders: Order[] = [
  {
    id: 'ord-1',
    shopId: 'shop-1',
    shopName: 'Sharma Kirana Store',
    customerName: 'Rahul Patil',
    customerPhone: '9876501234',
    items: [
      { productId: 'p1', name: 'Basmati Rice', nameMr: 'बासमती तांदूळ', price: 85, unit: 'kg', quantity: 2 },
      { productId: 'p3', name: 'Amul Milk', nameMr: 'अमूल दूध', price: 28, unit: 'litre', quantity: 3, note: 'Amul brand only' },
    ],
    status: 'PREPARING',
    paymentMode: 'upi',
    total: 254,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'ord-2',
    shopId: 'shop-1',
    shopName: 'Sharma Kirana Store',
    customerName: 'Rahul Patil',
    customerPhone: '9876501234',
    items: [
      { productId: 'p4', name: 'Turmeric Powder', nameMr: 'हळद पूड', price: 45, unit: 'packet', quantity: 1 },
    ],
    status: 'COMPLETED',
    paymentMode: 'cash',
    total: 45,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
]

export const defaultShopSettings = {
  name: 'Sharma Kirana Store',
  address: '12, Main Road, Kothrud',
  area: 'Kothrud',
  phone: '9876543210',
  whatsapp: '9876543210',
  ownerName: 'Rajesh Sharma',
  isOpen: true,
}

export const defaultCustomer = {
  name: 'Rahul Patil',
  phone: '9876501234',
}
