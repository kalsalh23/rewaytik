import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { toast } from 'react-hot-toast'
import { z } from 'zod'
import { register } from '@/lib/supabase-service'

const registerSchema = z.object({
  name: z.string().min(2, 'الاسم قصير جداً'),
  email: z.string().email('البريد الإلكتروني غير صالح'),
  phone: z.string().regex(/^09\d{8}$/, 'رقم الهاتف يجب أن يكون 10 أرقام ويبدأ بـ 09'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, { message: 'كلمة المرور غير متطابقة', path: ['confirmPassword'] })

export default function Register() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value })
    setErrors({ ...errors, [field]: '' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = registerSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach((err) => { fieldErrors[err.path[0] as string] = err.message })
      setErrors(fieldErrors)
      return
    }
    setLoading(true)
    try {
      await register(form.name, form.email, form.password, form.phone)
      toast.success('تم إنشاء الحساب! يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب.')
      navigate(`/verify-email?email=${encodeURIComponent(form.email)}`)
    } catch (err: any) {
      toast.error(err.message || 'حدث خطأ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-gradient-to-b from-primary/5 to-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-secondary">إنشاء حساب جديد</h1>
          <p className="text-secondary/60 mt-2">انضم إلينا واحفظ قصتك للأبد</p>
        </div>

        <div className="bg-card rounded-2xl shadow-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="الاسم الكامل" placeholder="أدخل اسمك الكامل" value={form.name} onChange={(e) => handleChange('name', e.target.value)} error={errors.name} required />
            <Input label="البريد الإلكتروني" type="email" placeholder="example@email.com" value={form.email} onChange={(e) => handleChange('email', e.target.value)} error={errors.email} required />
            <Input label="رقم الهاتف" placeholder="09xxxxxxxx" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} error={errors.phone} maxLength={10} required />
            <div className="relative">
              <Input label="كلمة المرور" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={(e) => handleChange('password', e.target.value)} error={errors.password} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-[38px] text-muted-foreground hover:text-secondary cursor-pointer">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <Input label="تأكيد كلمة المرور" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={(e) => handleChange('confirmPassword', e.target.value)} error={errors.confirmPassword} required />
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-secondary/60">
              لديك حساب بالفعل؟{' '}
              <Link to="/login" className="text-primary hover:text-primary-dark font-medium transition-colors">تسجيل الدخول</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}