import { useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Mail, Phone, Calendar, Edit2, Save, ArrowLeft, Package } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/store/auth'
import { toast } from 'react-hot-toast'
import { updateProfile } from '@/lib/supabase-service'

export default function Profile() {
  const { user, setAuth } = useAuthStore()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' })

  const handleSave = async () => {
    setLoading(true)
    try {
      const updatedUser = await updateProfile(form)
      setAuth(localStorage.getItem('token') || '', updatedUser)
      toast.success('تم تحديث البيانات بنجاح')
      setEditing(false)
    } catch (err: any) {
      toast.error(err.message || 'حدث خطأ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-24 pb-20">
      <div className="container-custom max-w-4xl">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-secondary/60 hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            العودة للرئيسية
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl shadow-card p-6 text-center">
                <div className="w-24 h-24 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl font-bold text-white">{user?.name?.[0]}</span>
                </div>
                <h2 className="text-xl font-bold text-secondary">{user?.name}</h2>
                <p className="text-sm text-secondary/60 mt-1">{user?.role === 'admin' ? 'مدير' : 'عميل'}</p>
                <div className="mt-6 pt-6 border-t border-border">
                  <Link to="/my-orders">
                    <Button variant="outline" className="w-full">
                      <Package className="w-4 h-4 ml-2" />
                      طلباتي
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-card rounded-2xl shadow-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-secondary">البيانات الشخصية</h2>
                  {!editing ? (
                    <button onClick={() => setEditing(true)} className="flex items-center gap-2 text-sm text-primary hover:text-primary-dark cursor-pointer">
                      <Edit2 className="w-4 h-4" />
                      تعديل
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>إلغاء</Button>
                      <Button size="sm" loading={loading} onClick={handleSave}>
                        <Save className="w-4 h-4 ml-1" />
                        حفظ
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-5">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-accent/30">
                    <User className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <span className="text-sm text-secondary/60">الاسم</span>
                      {editing ? (
                        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" />
                      ) : (
                        <p className="font-medium">{user?.name}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-accent/30">
                    <Mail className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <span className="text-sm text-secondary/60">البريد الإلكتروني</span>
                      {editing ? (
                        <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1" />
                      ) : (
                        <p className="font-medium">{user?.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-accent/30">
                    <Phone className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <span className="text-sm text-secondary/60">رقم الهاتف</span>
                      {editing ? (
                        <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1" />
                      ) : (
                        <p className="font-medium">{user?.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-accent/30">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <span className="text-sm text-secondary/60">تاريخ التسجيل</span>
                      <p className="font-medium">{new Date(user?.createdAt || Date.now()).toLocaleDateString('ar-SA')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
