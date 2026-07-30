import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Presentation, ArrowRight, ArrowLeft, Upload, X, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Card, CardContent } from '@/components/ui/Card'
import { toast } from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'

export default function CreatePresentation() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [customColors, setCustomColors] = useState<string[]>([''])
  const [form, setForm] = useState({
    projectTitle: '',
    slideCount: 10,
    language: 'arabic',
    visualIdentity: '',
    universityLogoUrl: '',
    hasCharts: false,
    hasIcons: false,
    hasTransitions: false,
    additionalNotes: '',
  })

  const totalSteps = 4

  const updateForm = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }))

  const addColor = () => setCustomColors(prev => [...prev, ''])
  const updateColor = (index: number, value: string) => setCustomColors(prev => prev.map((c, i) => (i === index ? value : c)))
  const removeColor = (index: number) => setCustomColors(prev => prev.filter((_, i) => i !== index))

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || [])
    setFiles(prev => [...prev, ...newFiles])
  }

  const removeFile = (index: number) => setFiles(prev => prev.filter((_, i) => i !== index))

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const filePath = `presentations/${user?.id}/${Date.now()}-${safeName}`
      const { error } = await supabase.storage.from('academic-uploads').upload(filePath, file)
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from('academic-uploads').getPublicUrl(filePath)
      updateForm('universityLogoUrl', publicUrl)
      toast.success('تم رفع الشعار بنجاح')
    } catch (e: any) {
      const msg = e?.message || ''
      if (msg.includes('policy') || msg.includes('row-level security')) {
        toast.error('خطأ في الصلاحيات')
      } else {
        toast.error(msg || 'حدث خطأ أثناء رفع الشعار')
      }
    }
  }

  const handleSubmit = async () => {
    if (!form.projectTitle) {
      toast.error('يرجى إدخال عنوان العرض')
      return
    }
    setLoading(true)
    try {
      const fileUrls: any[] = []
      for (const file of files) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
        const filePath = `presentations/${user?.id}/${Date.now()}-${safeName}`
        const { error } = await supabase.storage.from('academic-uploads').upload(filePath, file)
        if (error) throw error
        const { data: { publicUrl } } = supabase.storage.from('academic-uploads').getPublicUrl(filePath)
        fileUrls.push({ url: publicUrl, name: file.name, size: file.size, type: file.type })
      }

      const filteredColors = customColors.filter(c => c.trim() !== '')
      const orderNumber = `PR-${Date.now().toString(36).toUpperCase()}`
      const slideNum = form.slideCount || 0
      const totalPrice = slideNum * 3000
      const { data, error } = await supabase.from('presentations').insert({
        user_id: user?.id,
        order_number: orderNumber,
        status: 'new',
        payment_status: 'pending',
        payment_amount: totalPrice,
        project_title: form.projectTitle,
        slide_count: form.slideCount,
        language: form.language,
        visual_identity: form.visualIdentity,
        university_logo_url: form.universityLogoUrl || null,
        custom_colors: filteredColors,
        has_charts: form.hasCharts,
        has_icons: form.hasIcons,
        has_transitions: form.hasTransitions,
        files: fileUrls,
        additional_notes: form.additionalNotes,
        timeline: [{ status: 'new', date: new Date().toISOString() }],
      }).select().single()
      if (error) throw error
      toast.success('تم إنشاء الطلب بنجاح!')
      navigate(`/academic-payment/presentation/${data.id}`)
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
            <h3 className="text-lg font-semibold text-secondary">معلومات العرض</h3>
            <Input label="عنوان العرض *" value={form.projectTitle} onChange={e => updateForm('projectTitle', e.target.value)} />
            <Input label="عدد الشرائح" type="number" value={form.slideCount} onChange={e => updateForm('slideCount', parseInt(e.target.value) || 10)} />
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">اللغة</label>
              <select value={form.language} onChange={e => updateForm('language', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option value="arabic">العربية</option>
                <option value="english">الإنجليزية</option>
                <option value="bilingual">ثنائية اللغة</option>
              </select>
            </div>
            <Textarea label="الهوية البصرية" value={form.visualIdentity} onChange={e => updateForm('visualIdentity', e.target.value)} rows={3} placeholder="صف الألوان والخطوط والأسلوب البصري المطلوب..." />
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">شعار الجامعة</label>
              <div onClick={() => document.getElementById('logo-upload')?.click()}
                className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:border-primary/30 transition-colors">
                {form.universityLogoUrl ? (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-secondary">تم رفع الشعار</span>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-secondary/60">اضغط لرفع شعار الجامعة</p>
                  </>
                )}
              </div>
              <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary">الهوية البصرية</h3>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-secondary">الألوان المخصصة</label>
              {customColors.map((color, index) => (
                <div key={index} className="flex gap-2">
                  <Input label="" value={color} onChange={e => updateColor(index, e.target.value)} placeholder={`لون ${index + 1} (مثال: #FF5733)`} />
                  {customColors.length > 1 && (
                    <button onClick={() => removeColor(index)} className="text-error cursor-pointer mt-2"><X className="w-4 h-4" /></button>
                  )}
                </div>
              ))}
              <button onClick={addColor} className="text-sm text-primary hover:text-primary/80 cursor-pointer">+ إضافة لون</button>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.hasCharts} onChange={e => updateForm('hasCharts', e.target.checked)} className="w-4 h-4 rounded" />
                <span className="text-sm text-secondary">يوجد مخططات ورسوم بيانية</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.hasIcons} onChange={e => updateForm('hasIcons', e.target.checked)} className="w-4 h-4 rounded" />
                <span className="text-sm text-secondary">يوجد أيقونات</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.hasTransitions} onChange={e => updateForm('hasTransitions', e.target.checked)} className="w-4 h-4 rounded" />
                <span className="text-sm text-secondary">يوجد انتقالات متحركة</span>
              </label>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary">رفع الملفات</h3>
            <div onClick={() => document.getElementById('presentation-files')?.click()}
              className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary/30 transition-colors">
              <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-secondary/60">اضغط لرفع الملفات</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, PowerPoint, Word, صور</p>
            </div>
            <input id="presentation-files" type="file" multiple accept=".pdf,.ppt,.pptx,.doc,.docx,image/*" className="hidden" onChange={handleFileSelect} />
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
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary">ملاحظات إضافية</h3>
            <Textarea label="ملاحظات إضافية" value={form.additionalNotes} onChange={e => updateForm('additionalNotes', e.target.value)} rows={5} placeholder="أي ملاحظات أو تعليمات إضافية..." />
            {(() => { const s = form.slideCount || 0; const total = s * 3000; return total > 0 ? (
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-center">
                <p className="text-sm text-secondary/60">إجمالي التكلفة المتوقعة</p>
                <p className="text-2xl font-bold text-primary mt-1">{total.toLocaleString('ar-SA')} ل.س</p>
                <p className="text-xs text-secondary/60 mt-1">{s} شريحة × 3,000 ل.س</p>
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
            <Presentation className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-secondary">طلب عرض تقديمي</h1>
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