import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { CustomerLayout } from './layouts/CustomerLayout'
import { ShopOwnerLayout } from './layouts/ShopOwnerLayout'
import { SplashPage } from './pages/SplashPage'
import { AuthPage } from './pages/AuthPage'
import { CustomerHome } from './pages/customer/CustomerHome'
import { ShopDetailPage } from './pages/customer/ShopDetailPage'
import { CartPage } from './pages/customer/CartPage'
import { OrdersPage } from './pages/customer/OrdersPage'
import { OrderDetailPage } from './pages/customer/OrderDetailPage'
import { ProfilePage } from './pages/customer/ProfilePage'
import { OwnerDashboard } from './pages/owner/OwnerDashboard'
import { OwnerOrdersPage } from './pages/owner/OwnerOrdersPage'
import { OwnerOrderDetailPage } from './pages/owner/OwnerOrderDetailPage'
import { InventoryPage } from './pages/owner/InventoryPage'
import { ProductFormPage } from './pages/owner/ProductFormPage'
import { OwnerProfilePage } from './pages/owner/OwnerProfilePage'

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route path="/auth" element={<AuthPage />} />

          <Route
            path="/customer"
            element={
              <ProtectedRoute requiredRole="customer">
                <CustomerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<CustomerHome />} />
            <Route path="shop/:shopId" element={<ShopDetailPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:orderId" element={<OrderDetailPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          <Route
            path="/owner"
            element={
              <ProtectedRoute requiredRole="shopowner">
                <ShopOwnerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<OwnerDashboard />} />
            <Route path="orders" element={<OwnerOrdersPage />} />
            <Route path="orders/:orderId" element={<OwnerOrderDetailPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="inventory/new" element={<ProductFormPage />} />
            <Route path="inventory/edit/:productId" element={<ProductFormPage />} />
            <Route path="profile" element={<OwnerProfilePage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
