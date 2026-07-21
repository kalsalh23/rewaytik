import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import { BookOpen, LayoutDashboard, ShoppingBag, Users, BarChart3, Settings, Image as ImageIcon, Bell, MessageSquare, ArrowLeft } from 'lucide-react'
import { Header } from './Header'
import { Footer } from './Footer'

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export function AdminLayout() {
  const { user } = useAuthStore()
  const location = useLocation()

  const sidebarLinks = [
    { path: '/admin', label: 'الإحصائيات', icon: LayoutDashboard },
    { path: '/admin/orders', label: 'الطلبات', icon: ShoppingBag },
    { path: '/admin/customers', label: 'العملاء', icon: Users },
    { path: '/admin/reports', label: 'التقارير', icon: BarChart3 },
    { path: '/admin/inquiries', label: 'الاستفسارات', icon: MessageSquare },
    { path: '/admin/payment-notifications', label: 'إشعارات الدفع', icon: Bell },
    { path: '/admin/gallery', label: 'معرض الأعمال', icon: ImageIcon },
    { path: '/admin/settings', label: 'الإعدادات', icon: Settings },
  ]

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 min-h-screen bg-card border-l border-border flex flex-col">
        <Link to="/" className="flex items-center gap-3 px-6 h-16 border-b border-border">
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold">روايتك</span>
        </Link>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon
            const isActive = location.pathname === link.path || (link.path !== '/admin' && location.pathname.startsWith(link.path))
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-secondary/70 hover:bg-accent'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <Link to="/" className="flex items-center gap-3 text-sm text-secondary/60 hover:text-secondary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            العودة للموقع
          </Link>
        </div>
      </aside>
      <div className="flex-1">
        <header className="h-16 border-b border-border bg-card flex items-center px-6">
          <h1 className="text-lg font-semibold">لوحة التحكم</h1>
        </header>
        <main className="p-6 bg-background min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
