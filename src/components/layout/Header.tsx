import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { Menu, X, User, LogOut, BookOpen, ChevronDown, ShieldOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/auth'
import { cn } from '@/lib/utils'

const browseNavLinks = [
  { path: '/home', label: 'الرئيسية' },
  { path: '/how-it-works', label: 'كيف يعمل' },
  { path: '/create-order', label: 'طلب كتاب فوري' },
  { path: '/create-manuscript', label: '📚 اصنع كتابك' },
  { path: '/academic-services', label: '🎓 الخدمات الأكاديمية' },
  { path: '/gallery', label: 'معرض الأعمال' },
  { path: '/pricing', label: 'الأسعار' },
  { path: '/faq', label: 'الأسئلة الشائعة' },
  { path: '/about', label: 'من نحن' },
  { path: '/contact', label: 'تواصل معنا' },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { isAuthenticated, user, logout } = useAuthStore()

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setScrolled(window.scrollY > 20)
    })
  }

  const navLinks = browseNavLinks

  const handleLogout = async () => {
    await logout()
    window.location.href = '/'
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-secondary">أنجز</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                  location.pathname === link.path
                    ? 'text-primary bg-primary/5'
                    : 'text-secondary-light hover:text-secondary hover:bg-primary/5'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{user?.name?.[0]}</span>
                  </div>
                  <span className="text-sm font-medium text-secondary">{user?.name}</span>
                  <ChevronDown className="w-4 h-4 text-secondary-light" />
                </button>
                <div className="absolute left-0 top-full mt-2 w-48 bg-card rounded-xl shadow-elevated border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-2">
                    <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-primary/5 transition-colors">
                      <User className="w-4 h-4 text-primary" />
                      حسابي الشخصي
                    </Link>
                    <Link to="/my-orders" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-primary/5 transition-colors">
                      <BookOpen className="w-4 h-4 text-primary" />
                      طلباتي
                    </Link>
                    <Link to="/my-manuscripts" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-primary/5 transition-colors">
                      <BookOpen className="w-4 h-4 text-primary" />
                      مخطوطاتي
                    </Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-primary/5 transition-colors">
                        لوحة التحكم
                      </Link>
                    )}
                    <hr className="my-1 border-border" />
                    <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-error hover:bg-error/5 transition-colors w-full cursor-pointer">
                      <LogOut className="w-4 h-4" />
                      تسجيل خروج
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/5 text-xs text-primary">
                  <ShieldOff className="w-3 h-3" />
                  وضع الزائر
                </div>
                <Link to="/login">
                  <Button variant="ghost" size="sm">تسجيل الدخول</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">إنشاء حساب</Button>
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-white border-t border-border overflow-hidden">
          <div className="container-custom py-4">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    location.pathname === link.path
                      ? 'text-primary bg-primary/5'
                      : 'text-secondary-light hover:text-secondary hover:bg-primary/5'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link to="/profile" onClick={() => setIsOpen(false)} className="px-4 py-3 rounded-lg text-sm hover:bg-primary/5">
                    حسابي الشخصي
                  </Link>
                  <Link to="/my-orders" onClick={() => setIsOpen(false)} className="px-4 py-3 rounded-lg text-sm hover:bg-primary/5">
                    طلباتي
                  </Link>
                  <Link to="/my-manuscripts" onClick={() => setIsOpen(false)} className="px-4 py-3 rounded-lg text-sm hover:bg-primary/5">
                    مخطوطاتي
                  </Link>
                  <button onClick={handleLogout} className="px-4 py-3 rounded-lg text-sm text-error hover:bg-error/5 text-right cursor-pointer">
                    تسجيل خروج
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">تسجيل الدخول</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">إنشاء حساب</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
