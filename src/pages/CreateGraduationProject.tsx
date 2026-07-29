import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, ArrowRight, ArrowLeft, Upload, X, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Card, CardContent } from '@/components/ui/Card'
import { toast } from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'

const SECTION_OPTIONS = [
  'المقدمة', 'أهداف المشروع', 'مشكلة البحث', 'أهمية المشروع',
  'التحليل', 'المتطلبات الوظيفية', 'المتطلبات غير الوظيفية',
  'UML', 'قاعدة البيانات', 'تصميم الواجهات', 'الاختبارات', 'الخاتمة', 'المراجع',
]

const ADDITIONAL_SERVICES = [
  'تدقيق لغوي', 'تنسيق احترافي', 'ترجمة', 'تصميم UML',
  'تصميم قاعدة البيانات', 'تصميم واجهات المشروع', 'تصميم المخططات',
]

export default function CreateGraduationProject() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [form, setForm] = useState({
    projectTitle: '', university: '', faculty: '', department: '', supervisorName: '', language: 'arabic', deadline: '',
    projectIdea: '', projectGoal: '', problem: '', expectedResults: '',
    requiredSections: [] as string[], pageCount: '', fontStyle: '', fontSize: '', citationStyle: '',
    hasImages: false, hasTables: false, additionalServices: [] as string[], additionalNotes: '',
  })

  const totalSteps = 6

  const updateForm = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }))

  const toggleArrayItem = (key: 'requiredSections' | 'additionalServices', item: string) => {
    setForm(prev => ({
      ...prev,
      [key]: prev[key].includes(item) ? prev[key].filter(i => i !== item) : [...prev[key], item],
    }))
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || [])
    setFiles(prev => [...prev, ...newFiles])
  }

  const removeFile = (index: number) => setFiles(prev => prev.filter((_, i) => i !== index))

  const handleSubmit = async () => {
    if (!form.projectTitle) { toast.error('يرجى إدخال عنوان المشروع'); return }
    if (!form.university) { toast.error('يرجى إدخال اسم الجامعة'); return }
    if (!form.faculty) { toast.error('يرجى إدخال اسم الكلية'); return }
    if (form.requiredSections.length === 0) { toast.error('يرجى اختيار قسم مطلوب واحد على الأقل'); return }
    if (files.length === 0) { toast.error('يرجى رفع ملف واحد على الأقل'); return }
    setLoading(true)
    try {
      const fileUrls: any[] = []
      for (const file of files) {
        const filePath = `graduation-projects/${user?.id}/${Date.now()}-${file.name}`
        const { error } = await supabase.storage.from('academic-uploads').upload(filePath, file)
        if (error) throw error
        const { data: { publicUrl } } = supabase.storage.from('academic-uploads').getPublicUrl(filePath)
        fileUrls.push({ url: publicUrl, name: file.name, size: file.size, type: file.type })
      }

      const orderNumber = `GP-${Date.now().toString(36).toUpperCase()}`
      const { error } = await supabase.from('graduation_projects').insert({
        user_id: user?.id,
        order_number: orderNumber,
        status: 'new',
        payment_status: 'pending',
        project_title: form.projectTitle,
        university: form.university,
        faculty: form.faculty,
        department: form.department,
        supervisor_name: form.supervisorName,
        language: form.language,
        deadline: form.deadline || null,
        project_idea: form.projectIdea,
        project_goal: form.projectGoal,
        problem: form.problem,
        expected_results: form.expectedResults,
        required_sections: form.requiredSections,
        page_count: form.pageCount,
        font_style: form.fontStyle,
        font_size: form.fontSize,
        citation_style: form.citationStyle,
        has_images: form.hasImages,
        has_tables: form.hasTables,
        additional_services: form.additionalServices,
        additional_notes: form.additionalNotes,
        timeline: [{ status: 'new', date: new Date().toISOString() }],
      })
      if (error) throw error
      toast.success('تم إنشاء الطلب بنجاح!')
      navigate('/my-academic-orders')
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
            <h3 className="text-lg font-semibold text-secondary">معلومات المشروع</h3>
            <Input label="عنوان المشروع *" value={form.projectTitle} onChange={e => updateForm('projectTitle', e.target.value)} />
            <Input label="الجامعة *" value={form.university} onChange={e => updateForm('university', e.target.value)} />
            <Input label="الكلية *" value={form.faculty} onChange={e => updateForm('faculty', e.target.value)} />
            <Input label="القسم" value={form.department} onChange={e => updateForm('department', e.target.value)} />
            <Input label="اسم المشرف" value={form.supervisorName} onChange={e => updateForm('supervisorName', e.target.value)} />
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
              <Input label="الموعد النهائي" type="date" value={form.deadline} onChange={e => updateForm('deadline', e.target.value)} />
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary">وصف المشروع</h3>
            <Textarea label="فكرة المشروع" value={form.projectIdea} onChange={e => updateForm('projectIdea', e.target.value)} rows={3} />
            <Textarea label="الهدف" value={form.projectGoal} onChange={e => updateForm('projectGoal', e.target.value)} rows={3} />
            <Textarea label="المشكلة" value={form.problem} onChange={e => updateForm('problem', e.target.value)} rows={3} />
            <Textarea label="النتائج المتوقعة" value={form.expectedResults} onChange={e => updateForm('expectedResults', e.target.value)} rows={3} />
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary">مكونات الملف المطلوبة</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SECTION_OPTIONS.map(section => (
                <button key={section} onClick={() => toggleArrayItem('requiredSections', section)}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                    form.requiredSections.includes(section) ? 'border-primary bg-primary/5 text-primary' : 'border-border text-secondary/60 hover:border-primary/30'
                  }`}>
                  {form.requiredSections.includes(section) && <CheckCircle2 className="w-4 h-4 inline ml-1" />}
                  {section}
                </button>
              ))}
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary">رفع الملفات</h3>
            <div onClick={() => document.getElementById('gp-files')?.click()}
              className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary/30 transition-colors">
              <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-secondary/60">اضغط لرفع الملفات</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, Word, ZIP, RAR, صور</p>
            </div>
            <input id="gp-files" type="file" multiple accept=".pdf,.doc,.docx,.zip,.rar,image/*" className="hidden" onChange={handleFileSelect} />
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
            <h3 className="text-lg font-semibold text-secondary">مواصفات الملف</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input label="عدد الصفحات" value={form.pageCount} onChange={e => updateForm('pageCount', e.target.value)} />
              <Input label="نوع الخط" value={form.fontStyle} onChange={e => updateForm('fontStyle', e.target.value)} />
              <Input label="حجم الخط" value={form.fontSize} onChange={e => updateForm('fontSize', e.target.value)} />
              <Input label="طريقة التوثيق" value={form.citationStyle} onChange={e => updateForm('citationStyle', e.target.value)} />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.hasImages} onChange={e => updateForm('hasImages', e.target.checked)} className="w-4 h-4 rounded" />
                <span className="text-sm text-secondary">يوجد صور</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.hasTables} onChange={e => updateForm('hasTables', e.target.checked)} className="w-4 h-4 rounded" />
                <span className="text-sm text-secondary">يوجد جداول</span>
              </label>
            </div>
          </div>
        )
      case 6:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary">الخدمات الإضافية</h3>
            <div className="grid grid-cols-2 gap-2">
              {ADDITIONAL_SERVICES.map(service => (
                <button key={service} onClick={() => toggleArrayItem('additionalServices', service)}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                    form.additionalServices.includes(service) ? 'border-primary bg-primary/5 text-primary' : 'border-border text-secondary/60 hover:border-primary/30'
                  }`}>
                  {form.additionalServices.includes(service) && <CheckCircle2 className="w-4 h-4 inline ml-1" />}
                  {service}
                </button>
              ))}
            </div>
            <Textarea label="ملاحظات إضافية" value={form.additionalNotes} onChange={e => updateForm('additionalNotes', e.target.value)} rows={3} />
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
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-secondary">طلب مشروع تخرج</h1>
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
