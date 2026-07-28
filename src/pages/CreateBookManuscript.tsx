import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Upload, Check, ArrowLeft, ArrowRight, FileText, Image as ImageIcon, X, Loader2, Palette, Layers, Settings, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { useAuthStore } from '@/store/auth'
import { toast } from 'react-hot-toast'
import { createManuscriptOrder } from '@/lib/supabase-service'
import { supabase } from '@/lib/supabase'

const bookCategories = [
  'رواية', 'كتاب علمي', 'كتاب تعليمي', 'سيرة ذاتية', 'كتاب أطفال',
  'ديوان شعر', 'تطوير ذات', 'تاريخ', 'ديني', 'أعمال', 'آخر',
]

const visualStyles = [
  { key: 'classic', label: 'كلاسيكي', icon: '🏛️' },
  { key: 'modern', label: 'حديث', icon: '✨' },
  { key: 'luxury', label: 'فاخر', icon: '👑' },
  { key: 'minimal', label: 'Minimal', icon: '◻️' },
  { key: 'fantasy', label: 'فانتازي', icon: '🧙' },
  { key: 'historical', label: 'تاريخي', icon: '📜' },
  { key: 'romantic', label: 'رومانسي', icon: '💕' },
  { key: 'detective', label: 'بوليسي', icon: '🔍' },
  { key: 'scifi', label: 'خيال علمي', icon: '🚀' },
  { key: 'children', label: 'أطفال', icon: '🧸' },
  { key: 'designer', label: 'أترك القرار لفريق التصميم', icon: '🎨' },
]

const additionalServicesList = [
  { key: 'proofreading', label: 'تدقيق لغوي' },
  { key: 'printing_prep', label: 'تجهيز للطباعة' },
  { key: 'pdf_copy', label: 'نسخة PDF' },
  { key: 'print_ship', label: 'طباعة وشحن' },
]

interface FormData {
  bookTitle: string
  authorName: string
  showAuthorOnCover: boolean
  bookSummary: string
  bookLanguage: string
  manuscriptFile: File | null
  manuscriptPreview: string
  additionalImages: File[]
  bookCategory: string
  visualStyles: string[]
  internalImagesOption: string
  pageLayout: string
  additionalServices: string[]
  additionalNotes: string
}

const steps = [
  { label: 'معلومات الكتاب', icon: BookOpen },
  { label: 'رفع الملفات', icon: Upload },
  { label: 'تحليل الملف', icon: FileText },
  { label: 'نوع الكتاب', icon: Layers },
  { label: 'الهوية البصرية', icon: Palette },
  { label: 'الصور الداخلية', icon: ImageIcon },
  { label: 'تنسيق الصفحات', icon: Settings },
  { label: 'الخدمات الإضافية', icon: Check },
  { label: 'ملاحظات إضافية', icon: MessageSquare },
  { label: 'ملخص الطلب', icon: Check },
]

export default function CreateBookManuscript() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imagesInputRef = useRef<HTMLInputElement>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const [form, setForm] = useState<FormData>({
    bookTitle: '',
    authorName: '',
    showAuthorOnCover: true,
    bookSummary: '',
    bookLanguage: 'arabic',
    manuscriptFile: null,
    manuscriptPreview: '',
    additionalImages: [],
    bookCategory: '',
    visualStyles: [],
    internalImagesOption: 'none',
    pageLayout: 'designer',
    additionalServices: [],
    additionalNotes: '',
  })

  const [fileAnalysis, setFileAnalysis] = useState<{
    words: number
    pages: number
    chapters: number
    language: string
    hasImages: boolean
    estimatedTime: string
  } | null>(null)

  const updateField = (field: keyof FormData, val: any) => setForm({ ...form, [field]: val })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.name.endsWith('.docx') && !file.name.endsWith('.doc') && !file.name.endsWith('.pdf')) {
      toast.error('يجب أن يكون الملف Word أو PDF')
      return
    }
    updateField('manuscriptFile', file)
    updateField('manuscriptPreview', file.name)
    simulateAnalysis()
  }

  const handleImagesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const newImages = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (newImages.length === 0) {
      toast.error('يجب أن تكون الصور بصيغة PNG أو JPG')
      return
    }
    updateField('additionalImages', [...form.additionalImages, ...newImages])
    toast.success(`تم إضافة ${newImages.length} صورة`)
  }

  const removeImage = (index: number) => {
    updateField('additionalImages', form.additionalImages.filter((_, i) => i !== index))
  }

  const simulateAnalysis = () => {
    setFileAnalysis(null)
    setTimeout(() => {
      setFileAnalysis({
        words: Math.floor(Math.random() * 50000) + 5000,
        pages: Math.floor(Math.random() * 200) + 50,
        chapters: Math.floor(Math.random() * 15) + 3,
        language: form.bookLanguage === 'arabic' ? 'العربية' : form.bookLanguage === 'english' ? 'الإنجليزية' : 'ثنائية اللغة',
        hasImages: Math.random() > 0.5,
        estimatedTime: `${Math.floor(Math.random() * 10) + 5} أيام عمل`,
      })
    }, 2000)
  }

  const toggleVisualStyle = (key: string) => {
    if (key === 'designer') {
      updateField('visualStyles', ['designer'])
      return
    }
    const current = form.visualStyles.filter((s) => s !== 'designer')
    if (current.includes(key)) {
      updateField('visualStyles', current.filter((s) => s !== key))
    } else {
      updateField('visualStyles', [...current, key])
    }
  }

  const toggleService = (key: string) => {
    if (form.additionalServices.includes(key)) {
      updateField('additionalServices', form.additionalServices.filter((s) => s !== key))
    } else {
      updateField('additionalServices', [...form.additionalServices, key])
    }
  }

  const nextStep = () => {
    if (step === 0) {
      if (!form.bookTitle.trim()) { toast.error('أدخل اسم الكتاب'); return }
      if (!form.authorName.trim()) { toast.error('أدخل اسم المؤلف'); return }
    }
    if (step === 1 && !form.manuscriptFile) { toast.error('يجب رفع ملف المخطوطة'); return }
    if (step === 3 && !form.bookCategory) { toast.error('اختر نوع الكتاب'); return }
    if (step === 4 && form.visualStyles.length === 0) { toast.error('اختر أسلوباً بصرياً واحداً على الأقل'); return }
    setStep((s) => Math.min(s + 1, steps.length - 1))
    window.scrollTo(0, 0)
  }

  const prevStep = () => {
    setStep((s) => Math.max(s - 1, 0))
    window.scrollTo(0, 0)
  }

  const uploadFileToSupabase = async (file: File, bucket: string): Promise<{ url: string; name: string; size: number }> => {
    const filePath = `${user?.id}/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from(bucket).upload(filePath, file)
    if (error) throw error
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath)
    return { url: publicUrl, name: file.name, size: file.size }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setUploadProgress(0)
    try {
      let fileInfo = { url: '', name: '', size: 0 }
      if (form.manuscriptFile) {
        setUploadProgress(20)
        fileInfo = await uploadFileToSupabase(form.manuscriptFile, 'manuscript-files')
        setUploadProgress(50)
      }

      let uploadedImages: { url: string; name: string; size: number }[] = []
      if (form.additionalImages.length > 0) {
        setUploadProgress(60)
        for (let i = 0; i < form.additionalImages.length; i++) {
          const result = await uploadFileToSupabase(form.additionalImages[i], 'manuscript-attachments')
          uploadedImages.push(result)
          setUploadProgress(60 + Math.floor((i + 1) / form.additionalImages.length) * 20)
        }
      }

      const orderData = {
        book_title: form.bookTitle,
        author_name: form.authorName,
        show_author_on_cover: form.showAuthorOnCover,
        book_summary: form.bookSummary,
        book_language: form.bookLanguage,
        manuscript_file_url: fileInfo.url,
        manuscript_file_name: fileInfo.name,
        manuscript_file_size: fileInfo.size,
        book_category: form.bookCategory,
        visual_styles: form.visualStyles,
        internal_images_option: form.internalImagesOption,
        page_layout: form.pageLayout,
        additional_services: form.additionalServices,
        additional_notes: form.additionalNotes,
        status: 'new' as const,
        order_number: `MSK-${Date.now()}`,
        timeline: [{ status: 'new' as const, date: new Date().toISOString(), note: 'تم إنشاء الطلب' }],
      }

      setUploadProgress(85)
      const order = await createManuscriptOrder(orderData)

      if (uploadedImages.length > 0 && order) {
        const attachments = uploadedImages.map(img => ({
          manuscript_order_id: order.id,
          file_url: img.url,
          file_name: img.name,
          file_size: img.size,
          file_type: 'image',
        }))
        await supabase.from('manuscript_attachments').insert(attachments)
      }

      setUploadProgress(100)
      toast.success('تم إرسال طلبك بنجاح!')
      navigate('/my-manuscripts')
    } catch (e: any) {
      toast.error(e?.message || 'حدث خطأ في الاتصال بالخادم')
    } finally {
      setLoading(false)
      setUploadProgress(0)
    }
  }

  const progressPercent = ((step + 1) / steps.length) * 100

  return (
    <div className="pt-24 pb-20">
      <div className="container-custom max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">📚 اصنع كتابك</h1>
          <p className="text-secondary/60 mb-6">حوّل مخطوطتك إلى كتاب احترافي</p>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-secondary">الخطوة {step + 1} من {steps.length}</span>
              <span className="text-sm text-primary font-medium">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-2 bg-border rounded-full overflow-hidden">
              <div className="h-full gradient-primary rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
            {steps.map((s, i) => {
              const Icon = s.icon
              return (
                <div key={i} className="flex items-center gap-2 flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    i <= step ? 'gradient-primary text-white' : 'bg-border text-muted-foreground'
                  }`}>
                    {i < step ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-sm whitespace-nowrap hidden md:inline ${i <= step ? 'text-secondary font-medium' : 'text-muted-foreground'}`}>
                    {s.label}
                  </span>
                  {i < steps.length - 1 && <div className={`w-8 h-0.5 ${i < step ? 'bg-primary' : 'bg-border'}`} />}
                </div>
              )
            })}
          </div>

          <div className="bg-card rounded-2xl shadow-card p-8">
            {/* Step 0: Book Info */}
            {step === 0 && (
              <div>
                <h2 className="text-xl font-semibold text-secondary mb-6 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  معلومات الكتاب
                </h2>
                <div className="space-y-5">
                  <Input label="اسم الكتاب" placeholder="أدخل اسم الكتاب" value={form.bookTitle} onChange={(e) => updateField('bookTitle', e.target.value)} required />
                  <Input label="اسم المؤلف" placeholder="أدخل اسم المؤلف" value={form.authorName} onChange={(e) => updateField('authorName', e.target.value)} required />

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">هل تريد إظهار اسم المؤلف على الغلاف؟</label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => updateField('showAuthorOnCover', true)}
                        className={`flex-1 p-4 rounded-xl border-2 text-center transition-all cursor-pointer ${
                          form.showAuthorOnCover ? 'border-primary bg-primary/5 text-primary font-medium' : 'border-border hover:border-primary/30'
                        }`}
                      >
                        نعم
                      </button>
                      <button
                        onClick={() => updateField('showAuthorOnCover', false)}
                        className={`flex-1 p-4 rounded-xl border-2 text-center transition-all cursor-pointer ${
                          !form.showAuthorOnCover ? 'border-primary bg-primary/5 text-primary font-medium' : 'border-border hover:border-primary/30'
                        }`}
                      >
                        لا
                      </button>
                    </div>
                  </div>

                  <Textarea label="نبذة مختصرة عن الكتاب" placeholder="اكتب نبذة مختصرة عن محتوى الكتاب..." value={form.bookSummary} onChange={(e) => updateField('bookSummary', e.target.value)} rows={4} />

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">لغة الكتاب</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { key: 'arabic', label: 'العربية' },
                        { key: 'english', label: 'الإنجليزية' },
                        { key: 'bilingual', label: 'ثنائي اللغة' },
                        { key: 'other', label: 'أخرى' },
                      ].map((lang) => (
                        <button
                          key={lang.key}
                          onClick={() => updateField('bookLanguage', lang.key)}
                          className={`p-3 rounded-xl border-2 text-center text-sm transition-all cursor-pointer ${
                            form.bookLanguage === lang.key ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/30'
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: File Upload */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-semibold text-secondary mb-6 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  رفع الملفات
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      ملف المخطوطة <span className="text-error">*</span>
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                        form.manuscriptFile ? 'border-green-400 bg-green-50' : 'border-border hover:border-primary/30'
                      }`}
                    >
                      {form.manuscriptFile ? (
                        <div className="space-y-3">
                          <FileText className="w-12 h-12 text-primary mx-auto" />
                          <p className="font-medium text-secondary">{form.manuscriptPreview}</p>
                          <p className="text-sm text-secondary/60">{(form.manuscriptFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          <button
                            onClick={() => { updateField('manuscriptFile', null); updateField('manuscriptPreview', ''); setFileAnalysis(null) }}
                            className="text-sm text-error hover:underline cursor-pointer"
                          >
                            إزالة الملف
                          </button>
                        </div>
                      ) : (
                        <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
                          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                          <p className="text-secondary font-medium mb-1">اسحب الملف هنا أو اضغط للاختيار</p>
                          <p className="text-sm text-secondary/60">Word (DOCX/DOC) أو PDF - حتى 50MB</p>
                        </div>
                      )}
                      <input ref={fileInputRef} type="file" accept=".docx,.doc,.pdf" className="hidden" onChange={handleFileSelect} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      صور إضافية <span className="text-muted-foreground">(اختياري)</span>
                    </label>
                    <div
                      className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/30 transition-colors cursor-pointer"
                      onClick={() => imagesInputRef.current?.click()}
                    >
                      <ImageIcon className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-secondary/60">اختر الصور من جهازك</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG, JPEG</p>
                    </div>
                    <input
                      ref={imagesInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      multiple
                      className="hidden"
                      onChange={handleImagesSelect}
                    />
                    {form.additionalImages.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-3">
                        {form.additionalImages.map((img, i) => (
                          <div key={i} className="relative group">
                            <img
                              src={URL.createObjectURL(img)}
                              alt={img.name}
                              className="w-20 h-20 object-cover rounded-xl border-2 border-border"
                            />
                            <button
                              onClick={(e) => { e.stopPropagation(); removeImage(i) }}
                              className="absolute -top-2 -left-2 w-5 h-5 bg-error text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            <p className="text-xs text-secondary/60 mt-1 truncate max-w-[80px]">{img.name}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: File Analysis */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-semibold text-secondary mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  تحليل الملف
                </h2>
                {!fileAnalysis ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                    <p className="text-secondary font-medium">جاري تحليل الملف...</p>
                    <p className="text-sm text-secondary/60 mt-1">قد يستغرق هذا بضع ثوانٍ</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-secondary/60 mb-4">هذه المعلومات للمعاينة فقط</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {[
                        { label: 'عدد الكلمات', value: fileAnalysis.words.toLocaleString('ar-SA'), icon: '📝' },
                        { label: 'عدد الصفحات التقريبي', value: fileAnalysis.pages.toLocaleString('ar-SA'), icon: '📄' },
                        { label: 'عدد الفصول', value: fileAnalysis.chapters.toLocaleString('ar-SA'), icon: '📖' },
                        { label: 'اللغة', value: fileAnalysis.language, icon: '🌐' },
                        { label: 'يحتوي صوراً؟', value: fileAnalysis.hasImages ? 'نعم' : 'لا', icon: '🖼️' },
                        { label: 'الوقت المتوقع', value: fileAnalysis.estimatedTime, icon: '⏱️' },
                      ].map((item) => (
                        <div key={item.label} className="p-4 rounded-xl bg-accent/30 text-center">
                          <div className="text-2xl mb-2">{item.icon}</div>
                          <div className="text-lg font-bold text-secondary">{item.value}</div>
                          <div className="text-xs text-secondary/60 mt-1">{item.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Book Category */}
            {step === 3 && (
              <div>
                <h2 className="text-xl font-semibold text-secondary mb-6 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" />
                  نوع الكتاب
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {bookCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => updateField('bookCategory', cat)}
                      className={`p-4 rounded-xl border-2 text-center transition-all cursor-pointer ${
                        form.bookCategory === cat ? 'border-primary bg-primary/5 text-primary font-medium' : 'border-border hover:border-primary/30'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Visual Identity */}
            {step === 4 && (
              <div>
                <h2 className="text-xl font-semibold text-secondary mb-2 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary" />
                  الهوية البصرية
                </h2>
                <p className="text-sm text-secondary/60 mb-6">كيف تتخيل كتابك؟ يُسمح باختيار أكثر من أسلوب</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {visualStyles.map((style) => (
                    <button
                      key={style.key}
                      onClick={() => toggleVisualStyle(style.key)}
                      className={`p-4 rounded-xl border-2 text-center transition-all cursor-pointer ${
                        form.visualStyles.includes(style.key) ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <div className="text-2xl mb-2">{style.icon}</div>
                      <div className="text-sm font-medium">{style.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Internal Images */}
            {step === 5 && (
              <div>
                <h2 className="text-xl font-semibold text-secondary mb-6 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  الصور الداخلية
                </h2>
                <p className="text-sm text-secondary/60 mb-6">هل تريد صوراً داخل الكتاب؟</p>
                <div className="space-y-3">
                  {[
                    { key: 'none', label: 'بدون صور', desc: 'كتاب نصي فقط بدون صور داخلية' },
                    { key: 'upload', label: 'سأرفع صوري', desc: 'ستقوم برفع الصور التي تريد إضافتها' },
                    { key: 'designer', label: 'أترك القرار لفريق التصميم', desc: 'سيقوم فريق التصميم باختيار الصور المناسبة' },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => updateField('internalImagesOption', opt.key)}
                      className={`w-full p-5 rounded-xl border-2 text-right transition-all cursor-pointer ${
                        form.internalImagesOption === opt.key ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <div className="font-medium text-secondary">{opt.label}</div>
                      <div className="text-sm text-secondary/60 mt-1">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: Page Layout */}
            {step === 6 && (
              <div>
                <h2 className="text-xl font-semibold text-secondary mb-6 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  تنسيق الصفحات
                </h2>
                <div className="space-y-3">
                  {[
                    { key: 'luxury', label: 'فاخر', desc: 'تنسيق فاخر بألوان مميزة وتأثيرات بصرية' },
                    { key: 'classic', label: 'كلاسيكي', desc: 'تنسيق تقليدي أنيق يناسب كل أنواع الكتب' },
                    { key: 'modern', label: 'حديث', desc: 'تصميم عصري مع مساحات بيضاء واسعة' },
                    { key: 'simple', label: 'بسيط', desc: 'تنسيق بسيط ونظير يركز على المحتوى' },
                    { key: 'designer', label: 'اترك جميع التفاصيل لفريق التصميم', desc: 'سيقوم فريق التصميم باختيار أفضل تنسيق مناسب' },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => updateField('pageLayout', opt.key)}
                      className={`w-full p-5 rounded-xl border-2 text-right transition-all cursor-pointer ${
                        form.pageLayout === opt.key ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <div className="font-medium text-secondary">{opt.label}</div>
                      <div className="text-sm text-secondary/60 mt-1">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 7: Additional Services */}
            {step === 7 && (
              <div>
                <h2 className="text-xl font-semibold text-secondary mb-6 flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  الخدمات الإضافية
                </h2>
                <div className="space-y-3">
                  {additionalServicesList.map((svc) => (
                    <button
                      key={svc.key}
                      onClick={() => toggleService(svc.key)}
                      className={`w-full p-5 rounded-xl border-2 text-right transition-all cursor-pointer flex items-center justify-between ${
                        form.additionalServices.includes(svc.key) ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <span className="font-medium text-secondary">{svc.label}</span>
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                        form.additionalServices.includes(svc.key) ? 'border-primary bg-primary text-white' : 'border-border'
                      }`}>
                        {form.additionalServices.includes(svc.key) && <Check className="w-4 h-4" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 8: Additional Notes */}
            {step === 8 && (
              <div>
                <h2 className="text-xl font-semibold text-secondary mb-6 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  ملاحظات إضافية
                </h2>
                <Textarea
                  label="أي ملاحظات أو طلبات خاصة"
                  placeholder="اكتب أي ملاحظات إضافية تريد إبلاغ فريق العمل بها..."
                  value={form.additionalNotes}
                  onChange={(e) => updateField('additionalNotes', e.target.value)}
                  rows={8}
                />
              </div>
            )}

            {/* Step 9: Summary */}
            {step === 9 && (
              <div>
                <h2 className="text-xl font-semibold text-secondary mb-6">ملخص الطلب</h2>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-accent/30">
                    <span className="text-sm text-secondary/60">اسم الكتاب</span>
                    <p className="font-medium">{form.bookTitle}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-accent/30">
                    <span className="text-sm text-secondary/60">اسم المؤلف</span>
                    <p className="font-medium">{form.authorName}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-accent/30">
                    <span className="text-sm text-secondary/60">إظهار اسم المؤلف على الغلاف</span>
                    <p className="font-medium">{form.showAuthorOnCover ? 'نعم' : 'لا'}</p>
                  </div>
                  {form.bookSummary && (
                    <div className="p-4 rounded-xl bg-accent/30">
                      <span className="text-sm text-secondary/60">نبذة عن الكتاب</span>
                      <p className="font-medium text-sm">{form.bookSummary}</p>
                    </div>
                  )}
                  <div className="p-4 rounded-xl bg-accent/30">
                    <span className="text-sm text-secondary/60">لغة الكتاب</span>
                    <p className="font-medium">{form.bookLanguage === 'arabic' ? 'العربية' : form.bookLanguage === 'english' ? 'الإنجليزية' : form.bookLanguage === 'bilingual' ? 'ثنائي اللغة' : 'أخرى'}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-accent/30">
                    <span className="text-sm text-secondary/60">الملف المرفوع</span>
                    <p className="font-medium">{form.manuscriptPreview || 'لم يتم الرفع'}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-accent/30">
                    <span className="text-sm text-secondary/60">نوع الكتاب</span>
                    <p className="font-medium">{form.bookCategory}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-accent/30">
                    <span className="text-sm text-secondary/60">الهوية البصرية</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form.visualStyles.map((s) => (
                        <span key={s} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                          {visualStyles.find((v) => v.key === s)?.label || s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-accent/30">
                    <span className="text-sm text-secondary/60">الصور الداخلية</span>
                    <p className="font-medium">{form.internalImagesOption === 'none' ? 'بدون صور' : form.internalImagesOption === 'upload' ? 'سأرفع صوري' : 'أترك القرار لفريق التصميم'}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-accent/30">
                    <span className="text-sm text-secondary/60">تنسيق الصفحات</span>
                    <p className="font-medium">{form.pageLayout === 'designer' ? 'اترك لفريق التصميم' : form.pageLayout === 'luxury' ? 'فاخر' : form.pageLayout === 'classic' ? 'كلاسيكي' : form.pageLayout === 'modern' ? 'حديث' : 'بسيط'}</p>
                  </div>
                  {form.additionalServices.length > 0 && (
                    <div className="p-4 rounded-xl bg-accent/30">
                      <span className="text-sm text-secondary/60">الخدمات الإضافية</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {form.additionalServices.map((s) => (
                          <span key={s} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                            {additionalServicesList.find((v) => v.key === s)?.label || s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {form.additionalNotes && (
                    <div className="p-4 rounded-xl bg-accent/30">
                      <span className="text-sm text-secondary/60">ملاحظات إضافية</span>
                      <p className="font-medium text-sm">{form.additionalNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              {step > 0 ? (
                <Button variant="outline" onClick={prevStep}>
                  <ArrowRight className="w-4 h-4 ml-2" />
                  السابق
                </Button>
              ) : <div />}
              {step < steps.length - 1 ? (
                <Button onClick={nextStep}>
                  التالي
                  <ArrowLeft className="w-4 h-4 mr-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} loading={loading} disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      جاري الإرسال... {uploadProgress}%
                    </span>
                  ) : (
                    'إرسال الطلب'
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
