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

const RESEARCH_TYPES = [
  'حلقة بحث', 'بحث أكاديمي', 'مراجعة أدبيات', 'دراسة حالة', 'تحليل علمي', 'أخرى',
]

const ADDITIONAL_SERVICES = [
  'تنسيق احترافي', 'تدقيق لغوي', 'مراجعة علمية', 'إعداد قائمة المراجع',
  'إنشاء الجداول', 'إنشاء الرسوم البيانية', 'تصميم المخططات',
  'تصميم عرض PowerPoint', 'ترجمة البحث', 'إعداد ملخص عربي وإنجليزي',
]

export default function CreateResearchCircle() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [form, setForm] = useState({
    researchTitle: '', university: '', faculty: '', department: '', courseName: '', supervisorName: '',
    researchType: 'حلقة بحث', topic: '', objectives: '', description: '', instructions: '', keywords: '',
    language: 'arabic', pageCount: '',
    deliveryDate: '', deliveryTime: '', priority: 'normal',
    additionalServices: [] as string[], additionalNotes: '',
  })

  const totalSteps = 6

  const updateForm = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }))

  const toggleArrayItem = (item: string) => {
    setForm(prev => ({
      ...prev,
      additionalServices: prev.additionalServices.includes(item)
        ? prev.additionalServices.filter(i => i !== item)
        : [...prev.additionalServices, item],
    }))
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || [])
    setFiles(prev => [...prev, ...newFiles])
  }

  const removeFile = (index: number) => setFiles(prev => prev.filter((_, i) => i !== index))

  const handleSubmit = async () => {
    if (!form.researchTitle) { toast.error('يرجى إدخال عنوان البحث'); return }
    if (!form.university) { toast.error('يرجى إدخال اسم الجامعة'); return }
    if (!form.faculty) { toast.error('يرجى إدخال اسم الكلية'); return }
    if (!form.department) { toast.error('يرجى إدخال القسم'); return }
    if (!form.researchType) { toast.error('يرجى اختيار نوع البحث'); return }
    if (!form.pageCount) { toast.error('يرجى إدخال عدد الصفحات'); return }
    if (!form.deliveryDate) { toast.error('يرجى تحديد تاريخ التسليم'); return }
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
      const orderNumber = `RC-${Date.now().toString(36).toUpperCase()}`
      const { data, error } = await supabase.from('research_circles').insert({
        user_id: user?.id,
        order_number: orderNumber,
        status: 'new',
        payment_status: 'pending',
        payment_amount: basePrice + extrasPrice,
        research_title: form.researchTitle,
        university: form.university,
        faculty: form.faculty,
        department: form.department,
        course_name: form.courseName,
        supervisor_name: form.supervisorName,
        research_type: form.researchType,
        topic: form.topic,
        objectives: form.objectives,
        description: form.description,
        instructions: form.instructions,
        keywords: form.keywords,
        language: form.language,
        page_count: form.pageCount,
        delivery_date: form.deliveryDate || null,
        delivery_time: form.deliveryTime || null,
        priority: form.priority,
        additional_services: form.additionalServices,
        additional_notes: form.additionalNotes,
        timeline: [{ status: 'new', date: new Date().toISOString() }],
      }).select().single()
      if (error) throw error
      toast.success('تم إنشاء الطلب بنجاح!')
      navigate(`/academic-payment/research_circle/${data.id}`)
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

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary">معلومات البحث</h3>
            <Input label="عنوان البحث *" value={form.researchTitle} onChange={e => updateForm('researchTitle', e.target.value)} />
            <Input label="الجامعة *" value={form.university} onChange={e => updateForm('university', e.target.value)} />
            <Input label="الكلية *" value={form.faculty} onChange={e => updateForm('faculty', e.target.value)} />
            <Input label="القسم" value={form.department} onChange={e => updateForm('department', e.target.value)} />
            <Input label="اسم المقرر" value={form.courseName} onChange={e => updateForm('courseName', e.target.value)} />
            <Input label="اسم المشرف" value={form.supervisorName} onChange={e => updateForm('supervisorName', e.target.value)} />
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary">نوع البحث</h3>
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">نوع البحث</label>
              <select value={form.researchType} onChange={e => updateForm('researchType', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20">
                {RESEARCH_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <Textarea label="الموضوع" value={form.topic} onChange={e => updateForm('topic', e.target.value)} rows={3} />
            <Textarea label="الأهداف" value={form.objectives} onChange={e => updateForm('objectives', e.target.value)} rows={3} />
            <Textarea label="الوصف" value={form.description} onChange={e => updateForm('description', e.target.value)} rows={3} />
            <Textarea label="التوجيهات" value={form.instructions} onChange={e => updateForm('instructions', e.target.value)} rows={3} />
            <Input label="الكلمات المفتاحية" value={form.keywords} onChange={e => updateForm('keywords', e.target.value)} />
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary">مواصفات البحث</h3>
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
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary">رفع الملفات</h3>
            <div onClick={() => document.getElementById('rc-files')?.click()}
              className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary/30 transition-colors">
              <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-secondary/60">اضغط لرفع الملفات</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, Word, ZIP, RAR, صور</p>
            </div>
            <input id="rc-files" type="file" multiple accept=".pdf,.doc,.docx,.zip,.rar,image/*" className="hidden" onChange={handleFileSelect} />
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
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary">موعد التسليم</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input label="تاريخ التسليم" type="date" value={form.deliveryDate} onChange={e => updateForm('deliveryDate', e.target.value)} />
              <Input label="وقت التسليم" type="time" value={form.deliveryTime} onChange={e => updateForm('deliveryTime', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">الأولوية</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="priority" value="normal" checked={form.priority === 'normal'} onChange={e => updateForm('priority', e.target.value)} className="w-4 h-4" />
                  <span className="text-sm text-secondary">عادي</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="priority" value="urgent" checked={form.priority === 'urgent'} onChange={e => updateForm('priority', e.target.value)} className="w-4 h-4" />
                  <span className="text-sm text-secondary">مستعجل</span>
                </label>
              </div>
            </div>
          </div>
        )
      case 6:
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
            {(() => { const p = parseInt(form.pageCount) || 0; const e = form.additionalServices.length; const total = p * 3000 + e * 5000; return total > 0 ? (
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-center">
                <p className="text-sm text-secondary/60">إجمالي التكلفة المتوقعة</p>
                <p className="text-2xl font-bold text-primary mt-1">{total.toLocaleString('ar-SA')} ل.س</p>
              </div>
            ) : null; })()}
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
          <h1 className="text-2xl font-bold text-secondary">طلب حلقة بحث</h1>
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
