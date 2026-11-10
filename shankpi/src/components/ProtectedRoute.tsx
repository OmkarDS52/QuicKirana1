import { Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import type { UserRole } from '../types'

export function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode
  requiredRole: UserRole
}) {
  const { isAuthenticated, role } = useApp()

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  if (role !== requiredRole) {
    return <Navigate to={requiredRole === 'customer' ? '/customer' : '/owner'} replace />
  }

  return <>{children}</>
}
