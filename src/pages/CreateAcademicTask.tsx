import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, ArrowRight, ArrowLeft, Upload, X, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Card, CardContent } from '@/components/ui/Card'
import { toast } from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'

const ADDITIONAL_SERVICES = [
  'تنسيق', 'تدقيق', 'تلخيص', 'تحويل PDF', 'تصميم PowerPoint',
]

export default function CreateAcademicTask() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [form, setForm] = useState({
    language: 'arabic', pageCount: '',
    additionalServices: [] as string[], additionalNotes: '',
  })

  const totalSteps = 3

  const updateForm = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }))
  const toggleArrayItem = (item: string) => setForm(prev => ({
    ...prev,
    additionalServices: prev.additionalServices.includes(item)
      ? prev.additionalServices.filter(i => i !== item)
      : [...prev.additionalServices, item],
  }))
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || [])
    setFiles(prev => [...prev, ...newFiles])
  }
  const removeFile = (index: number) => setFiles(prev => prev.filter((_, i) => i !== index))

  const handleSubmit = async () => {
    if (!form.pageCount) { toast.error('يرجى إدخال عدد الصفحات'); return }
    if (files.length === 0) { toast.error('يرجى رفع ملف واحد على الأقل'); return }
    setLoading(true)
    try {
      const fileUrls: any[] = []
      for (const file of files) {
        const result = await new Promise<{ url: string; name: string; size: number; type: string }>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve({ url: reader.result as string, name: file.name, size: file.size, type: file.type })
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
        fileUrls.push(result)
      }

      const pageNum = parseInt(form.pageCount) || 0
      const basePrice = pageNum * 3000
      const extrasPrice = form.additionalServices.length * 5000
      const orderNumber = `AT-${Date.now().toString(36).toUpperCase()}`
      const { data, error } = await supabase.from('academic_tasks').insert({
        user_id: user?.id,
        order_number: orderNumber,
        status: 'new',
        payment_status: 'pending',
        payment_amount: basePrice + extrasPrice,
        language: form.language,
        page_count: form.pageCount,
        additional_services: form.additionalServices,
        additional_notes: form.additionalNotes,
        files: fileUrls,
        timeline: [{ status: 'new', date: new Date().toISOString() }],
      }).select().single()
      if (error) throw error
      toast.success('تم إنشاء الطلب بنجاح!')
      navigate(`/academic-payment/academic_task/${data.id}`)
    } catch (e: any) {
      const msg = e?.message || ''
      if (msg.includes('does not exist') || msg.includes('relation') || msg.includes('not found')) {
        toast.error('خطأ في قاعدة البيانات. يرجى التأكد من تنفيذ ملف الترحيل SQL')
      } else if (msg.includes('policy') || msg.includes('row-level security')) {
        toast.error('خطأ في الصلاحيات')
      } else {
        toast.error(msg || 'حدث خطأ')
      }
    } finally {
      setLoading(false)
    }
  }

  const pageNum = parseInt(form.pageCount) || 0
  const extrasCount = form.additionalServices.length
  const previewPrice = pageNum * 3000 + extrasCount * 5000

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary">رفع الملفات</h3>
            <div onClick={() => document.getElementById('at-files')?.click()}
              className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary/30 transition-colors">
              <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-secondary/60">اضغط لرفع الملفات</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, Word, صور</p>
            </div>
            <input id="at-files" type="file" multiple accept=".pdf,.doc,.docx,image/*" className="hidden" onChange={handleFileSelect} />
            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-accent/30">
                    <span className="text-sm text-secondary truncate">{file.name}</span>
                    <button onClick={() => removeFile(i)} className="text-error cursor-pointer"><X className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary">المواصفات</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">اللغة</label>
                <select value={form.language} onChange={e => updateForm('language', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="arabic">العربية</option>
                  <option value="english">الإنجليزية</option>
                  <option value="bilingual">ثنائية اللغة</option>
                </select>
              </div>
              <Input label="عدد الصفحات *" type="number" value={form.pageCount} onChange={e => updateForm('pageCount', e.target.value)} />
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary">الخدمات الإضافية</h3>
            <div className="grid grid-cols-2 gap-2">
              {ADDITIONAL_SERVICES.map(service => (
                <button key={service} onClick={() => toggleArrayItem(service)}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                    form.additionalServices.includes(service) ? 'border-primary bg-primary/5 text-primary' : 'border-border text-secondary/60 hover:border-primary/30'
                  }`}>
                  {form.additionalServices.includes(service) && <CheckCircle2 className="w-4 h-4 inline ml-1" />}
                  {service} (+5,000)
                </button>
              ))}
            </div>
            <Textarea label="ملاحظات إضافية" value={form.additionalNotes} onChange={e => updateForm('additionalNotes', e.target.value)} rows={3} />
            {previewPrice > 0 && (
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-center">
                <p className="text-sm text-secondary/60">إجمالي التكلفة المتوقعة</p>
                <p className="text-2xl font-bold text-primary mt-1">{previewPrice.toLocaleString('ar-SA')} ل.س</p>
              </div>
            )}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-2xl mx-auto px-4">
        <button onClick={() => navigate('/academic-services')} className="inline-flex items-center gap-2 text-sm text-secondary/60 hover:text-primary mb-6 transition-colors cursor-pointer">
          <ArrowRight className="w-4 h-4" /> العودة للخدمات
        </button>

        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-secondary">طلب خدمة أكاديمية</h1>
          <p className="text-secondary-light mt-2">أكمل الخطوات التالية لإنشاء طلبك</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i < step ? 'w-8 bg-primary' : 'w-4 bg-border'}`} />
          ))}
        </div>

        <Card>
          <CardContent className="p-6">
            {renderStep()}
          </CardContent>
        </Card>

        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <Button variant="outline" className="flex-1" onClick={() => setStep(s => s - 1)}>
              <ArrowRight className="w-4 h-4 ml-2" /> السابق
            </Button>
          )}
          {step < totalSteps ? (
            <Button className="flex-1" onClick={() => setStep(s => s + 1)}>
              التالي <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
          ) : (
            <Button className="flex-1" onClick={handleSubmit} loading={loading} disabled={loading}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin ml-2" /> جاري الإرسال...</> : 'إرسال الطلب'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
