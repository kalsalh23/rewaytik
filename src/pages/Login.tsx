import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, Eye, EyeOff, Mail } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/store/auth'
import { toast } from 'react-hot-toast'
import { login, resendVerification } from '@/lib/supabase-service'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [unconfirmedEmail, setUnconfirmedEmail] = useState('')
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setUnconfirmedEmail('')
    try {
      const result = await login(form.email, form.password)
      const { data: userData } = await supabase.from('users').select('*').eq('id', result.user?.id).single()
      if (result.session && userData) {
        setAuth(result.session.access_token, userData)
        toast.success('مرحباً بعودتك!')
        navigate(userData.role === 'admin' ? '/admin' : '/home')
      } else {
        toast.error('بيانات الدخول غير صحيحة')
      }
    } catch (err: any) {
      if (err.message?.includes('غير مؤكد')) {
        setUnconfirmedEmail(form.email)
      } else {
        toast.error(err.message || 'حدث خطأ في الاتصال')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!unconfirmedEmail) return
    setSending(true)
    try {
      await resendVerification(unconfirmedEmail)
      toast.success('تم إعادة إرسال رابط التفعيل!')
    } catch (err: any) {
      toast.error(err.message || 'فشل إرسال الرابط')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-gradient-to-b from-primary/5 to-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-secondary">تسجيل الدخول</h1>
          <p className="text-secondary/60 mt-2">مرحباً بعودتك! أدخل بياناتك للمتابعة</p>
        </div>

        <div className="bg-card rounded-2xl shadow-card p-8">
          {unconfirmedEmail ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-secondary mb-2">البريد الإلكتروني غير مؤكد</h3>
              <p className="text-sm text-secondary/60 mb-4">
                يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب قبل تسجيل الدخول.
              </p>
              <p className="text-sm font-medium text-primary mb-6">{unconfirmedEmail}</p>
              <div className="space-y-3">
                <Button className="w-full" onClick={handleResend} loading={sending}>
                  إعادة إرسال رابط التفعيل
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setUnconfirmedEmail('')}>
                  العودة لتسجيل الدخول
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="البريد الإلكتروني"
                type="email"
                placeholder="example@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <div className="relative">
                <Input
                  label="كلمة المرور"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-[38px] text-muted-foreground hover:text-secondary transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                  <span className="text-sm text-secondary/60">تذكرني</span>
                </label>
                <a href="#" className="text-sm text-primary hover:text-primary-dark transition-colors">نسيت كلمة المرور؟</a>
              </div>
              <Button type="submit" className="w-full" size="lg" loading={loading}>
                {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </Button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-secondary/60">
              ليس لديك حساب؟{' '}
              <Link to="/register" className="text-primary hover:text-primary-dark font-medium transition-colors">
                إنشاء حساب جديد
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}