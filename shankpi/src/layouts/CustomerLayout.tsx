import { Outlet } from 'react-router-dom'
import { BottomNav } from '../components/ui/BottomNav'
import { Sidebar } from '../components/ui/Sidebar'

export function CustomerLayout() {
  return (
    <div className="min-h-screen bg-cream lg:pl-64">
      <Sidebar variant="customer" />
      <main className="mx-auto max-w-6xl pb-24 lg:pb-8">
        <Outlet />
      </main>
      <BottomNav variant="customer" />
    </div>
  )
}
