import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { toast } from 'react-hot-toast'
import { submitContact } from '@/lib/supabase-service'

const contactInfo = [
  { icon: Phone, title: 'الهاتف', value: '+84382676210', action: 'اتصل بنا' },
  { icon: Mail, title: 'البريد الإلكتروني', value: 'theprogect8@gmail.com', action: 'راسلنا' },
  { icon: MapPin, title: 'العنوان', value: 'حماه - الجمهورية العربية السورية', action: 'على الخريطة' },
  { icon: Clock, title: 'ساعات العمل', value: 'السبت - الخميس، ٩ ص - ٩ م', action: '' },
]

export default function Contact() {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await submitContact(form)
      toast.success('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.')
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch {
      toast.error('حدث خطأ في الإرسال')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-24 pb-20">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">تواصل معنا</h1>
          <p className="text-secondary/60 max-w-2xl mx-auto text-lg">نحن هنا للإجابة على استفساراتك ومساعدتك في أي وقت</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div>
            <div className="bg-card rounded-2xl shadow-card p-8">
              <h2 className="text-xl font-bold text-secondary mb-6">أرسل لنا رسالة</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="الاسم الكامل" placeholder="أدخل اسمك" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  <Input label="البريد الإلكتروني" type="email" placeholder="example@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="رقم الهاتف" placeholder="05xxxxxxxx" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  <Input label="الموضوع" placeholder="عنوان الرسالة" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
                </div>
                <Textarea label="الرسالة" placeholder="اكتب رسالتك هنا..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                <Button type="submit" className="w-full" size="lg" loading={loading}>
                  {loading ? 'جاري الإرسال...' : 'إرسال الرسالة'}
                  {!loading && <Send className="w-4 h-4 mr-2" />}
                </Button>
              </form>
            </div>
          </div>

          <div className="space-y-4">
            {contactInfo.map((info) => {
              const Icon = info.icon
              return (
                <div key={info.title} className="bg-card rounded-xl shadow-card p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary mb-1">{info.title}</h3>
                    <p className="text-sm text-secondary/60">{info.title === 'الهاتف' || info.title === 'البريد الإلكتروني' ? <span dir="ltr">{info.value}</span> : info.value}</p>
                    {info.action && (
                      <button className="text-sm text-primary hover:text-primary-dark font-medium mt-1 transition-colors cursor-pointer">
                        {info.action}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
