import { useState, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { BookOpen, User, Heart, Camera, MapPin, Check, ArrowLeft, ArrowRight, Upload, Plus, X, Loader2, Image as ImageIcon, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { useAuthStore } from '@/store/auth'
import { toast } from 'react-hot-toast'
import { getBookTypes, createOrder } from '@/lib/supabase-service'
import { supabase } from '@/lib/supabase'

const nationalities = [
  'سعودي', 'إماراتي', 'كويتي', 'قطري', 'بحرييني', 'عماني',
  'مصري', 'أردني', 'لبناني', 'سوري', 'عراقي', 'يمني',
  'فلسطيني', 'تونسي', 'جزائري', 'مغربي', 'ليبي', 'سوداني',
]

const storyTypes = [
  'قصة طفولة', 'قصة شباب', 'قصة حب', 'قصة نجاح',
  'قصة تخرج', 'سيرة ذاتية', 'قصة عائلة', 'قصة رحلة',
  'هدية مخصصة', 'قصة مخصصة',
]

const storyGoals = [
  'توثيق الذكريات', 'هدية لأحد الأقارب', 'إرث عائلي',
  'إلهام الأجيال', 'تكريم شخص', 'سيرة مهنية',
]

const ageRanges = [
  { label: 'أقل من ١ سنة', value: '0' },
  { label: '١-٥ سنوات', value: '3' },
  { label: '٦-١٢ سنة', value: '9' },
  { label: '١٣-١٨ سنة', value: '15' },
  { label: '١٩-٢٥ سنة', value: '22' },
  { label: '٢٦-٣٥ سنة', value: '30' },
  { label: '٣٦-٤٥ سنة', value: '40' },
  { label: '٤٦-٦٠ سنة', value: '53' },
  { label: 'أكبر من ٦٠ سنة', value: '70' },
]

const eyeColors = ['أسود', 'بني', 'بني فاتح', 'عسلي', 'أخضر', 'أزرق', 'رمادي', 'أخضر']
const hairColors = ['أسود', 'بني غامق', 'بني فاتح', 'أشقر', 'أحمر', 'رمادي', 'أبيض', 'أصلع']
const skinTones = ['أبيض', 'حنطي', 'أسمر', 'أسود']
const builds = ['نحيف', 'رياضي', 'متوسط', 'ممتلئ', 'ضخم']
const heights = ['أقل من ١٥٠ سم', '١٥٠-١٦٠ سم', '١٦٠-١٧٠ سم', '١٧٠-١٨٠ سم', '١٨٠-١٩٠ سم', 'أكثر من ١٩٠ سم']

const characterRoles = [
  { key: 'father', label: 'الأب' },
  { key: 'mother', label: 'الأم' },
  { key: 'brother', label: 'الأخ' },
  { key: 'sister', label: 'الأخت' },
  { key: 'grandfather', label: 'الجد' },
  { key: 'grandmother', label: 'الجدة' },
  { key: 'friend', label: 'صديق' },
  { key: 'other', label: 'آخر' },
]

interface CharacterImage {
  role: string
  file: File | null
  preview: string
}

interface FormData {
  bookTypeId: string
  characterName: string
  age: string
  nationality: string
  hobbies: string[]
  qualities: string[]
  memories: string[]
  storyType: string
  storyGoal: string
  clientMessage: string
  images: string[]
  eyeColor: string
  hairColor: string
  height: string
  skinTone: string
  build: string
  characterImages: string[]
  fullName: string
  phone: string
  city: string
  district: string
  street: string
  buildingNumber: string
  additionalDetails: string
}

const steps = ['نوع الكتاب', 'معلومات الشخصية', 'الصفات الجسدية', 'الهوايات والصفات', 'الذكريات والصور', 'عنوان الشحن', 'مراجعة الطلب']

export default function CreateOrder() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuthStore()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [bookTypes, setBookTypes] = useState<{ id: string; name_ar: string }[]>([])
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState<FormData>({
    bookTypeId: searchParams.get('type') || '', characterName: '', age: '', nationality: '',
    hobbies: [], qualities: [], memories: [], storyType: '', storyGoal: '',
    clientMessage: '', images: [], eyeColor: '', hairColor: '', height: '',
    skinTone: '', build: '', characterImages: [], fullName: '', phone: '',
    city: '', district: '', street: '', buildingNumber: '', additionalDetails: '',
  })
  const [hobbyInput, setHobbyInput] = useState('')
  const [qualityInput, setQualityInput] = useState('')
  const [memoryInput, setMemoryInput] = useState('')

  useEffect(() => {
    getBookTypes()
      .then((data) => {
        setBookTypes(data || [])
        const typeId = searchParams.get('type')
        if (typeId && data?.some((b: any) => b.id === typeId)) {
          updateField('bookTypeId', typeId)
        }
      })
      .catch(() => {})
  }, [])
  const [characterImages, setCharacterImages] = useState<CharacterImage[]>(
    characterRoles.map((r) => ({ role: r.key, file: null, preview: '' }))
  )

  const updateField = (field: keyof FormData, val: any) => setForm({ ...form, [field]: val })

  const addItem = (field: 'hobbies' | 'qualities' | 'memories', input: string, setInput: (v: string) => void) => {
    if (input.trim() && !form[field].includes(input.trim())) {
      updateField(field, [...form[field], input.trim()])
      setInput('')
    }
  }

  const removeItem = (field: 'hobbies' | 'qualities' | 'memories', idx: number) => {
    updateField(field, form[field].filter((_, i) => i !== idx))
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const remaining = 5 - imageFiles.length
    if (files.length > remaining) {
      toast.error(`يمكنك رفع ${remaining} صور فقط`)
      return
    }
    const newFiles = [...imageFiles, ...files].slice(0, 5)
    setImageFiles(newFiles)
    const newPreviews = newFiles.map((f) => URL.createObjectURL(f))
    setImagePreviews(newPreviews)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeImage = (idx: number) => {
    URL.revokeObjectURL(imagePreviews[idx])
    const newFiles = imageFiles.filter((_, i) => i !== idx)
    const newPreviews = imagePreviews.filter((_, i) => i !== idx)
    setImageFiles(newFiles)
    setImagePreviews(newPreviews)
  }

  const handleCharacterImageSelect = (role: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const preview = URL.createObjectURL(file)
    setCharacterImages((prev) =>
      prev.map((ci) => (ci.role === role ? { role, file, preview } : ci))
    )
  }

  const removeCharacterImage = (role: string) => {
    const ci = characterImages.find((x) => x.role === role)
    if (ci?.preview) URL.revokeObjectURL(ci.preview)
    setCharacterImages((prev) =>
      prev.map((x) => (x.role === role ? { role, file: null, preview: '' } : x))
    )
  }

  const nextStep = () => {
    if (step === 0 && !form.bookTypeId) { toast.error('اختر نوع الكتاب'); return }
    if (step === 1) {
      if (!form.characterName) { toast.error('أدخل اسم الشخصية'); return }
      if (!form.nationality) { toast.error('اختر الجنسية'); return }
    }
    if (step === 4 && imageFiles.length < 5) { toast.error(`يجب رفع ٥ صور على الأقل (بقيت ${5 - imageFiles.length})`); return }
    if (step === 5) {
      if (!form.fullName) { toast.error('أدخل اسم المستلم'); return }
      if (!form.phone || !/^09\d{8}$/.test(form.phone)) { toast.error('رقم الهاتف يجب أن يكون 10 أرقام ويبدأ بـ 09'); return }
    }
    setStep((s) => Math.min(s + 1, steps.length - 1))
    window.scrollTo(0, 0)
  }

  const uploadImagesToSupabase = async (files: File[], bucket: string): Promise<string[]> => {
    const urls: string[] = []
    for (const file of files) {
      const filePath = `${user?.id}/${Date.now()}-${file.name}`
      const { error } = await supabase.storage.from(bucket).upload(filePath, file)
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath)
      urls.push(publicUrl)
    }
    return urls
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      let imageUrls: string[] = []
      if (imageFiles.length > 0) {
        try {
          imageUrls = await uploadImagesToSupabase(imageFiles, 'order-images')
        } catch {
          toast.error('فشل رفع الصور')
          setLoading(false)
          return
        }
      }

      let characterImageUrls: string[] = []
      const charFiles = characterImages.filter((ci) => ci.file)
      if (charFiles.length > 0) {
        try {
          characterImageUrls = await uploadImagesToSupabase(
            charFiles.map((ci) => ci.file!),
            'character-images'
          )
        } catch {
          toast.error('فشل رفع صور الشخصيات')
          setLoading(false)
          return
        }
      }

      const orderData = {
        book_type_id: form.bookTypeId,
        character_name: form.characterName,
        age: form.age ? parseInt(form.age) : null,
        nationality: form.nationality,
        hobbies: form.hobbies,
        qualities: form.qualities,
        memories: form.memories,
        story_type: form.storyType,
        story_goal: form.storyGoal,
        client_message: form.clientMessage,
        images: imageUrls,
        eye_color: form.eyeColor || null,
        hair_color: form.hairColor || null,
        height: form.height || null,
        skin_tone: form.skinTone || null,
        build: form.build || null,
        character_images: characterImageUrls,
        shipping_address: {
          fullName: form.fullName,
          phone: form.phone,
          city: form.city,
          district: form.district,
          street: form.street,
          buildingNumber: form.buildingNumber,
          additionalDetails: form.additionalDetails,
        },
        status: 'pending_payment',
        order_number: `RWK-${Date.now()}`,
        total_amount: 0,
        timeline: [{ status: 'pending_payment', date: new Date().toISOString(), note: 'تم إنشاء الطلب' }],
      }

      const data = await createOrder(orderData)
      toast.success('تم إرسال طلبك بنجاح!')
      navigate(`/payment?orderId=${data.id}&amount=${data.total_amount || 0}`)
    } catch (e: any) {
      toast.error(e?.message || 'حدث خطأ في الاتصال بالخادم')
    } finally {
      setLoading(false)
    }
  }

  const selectedBook = bookTypes.find((b) => b.id === form.bookTypeId)

  return (
    <div className="pt-24 pb-20">
      <div className="container-custom max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">طلب كتاب جديد</h1>
          <p className="text-secondary/60 mb-8">املأ المعلومات التالية لبدء كتابتك</p>

          <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2 flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  i <= step ? 'gradient-primary text-white' : 'bg-border text-muted-foreground'
                }`}>
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-sm whitespace-nowrap ${i <= step ? 'text-secondary font-medium' : 'text-muted-foreground'}`}>
                  {s}
                </span>
                {i < steps.length - 1 && <div className={`w-8 h-0.5 ${i < step ? 'bg-primary' : 'bg-border'}`} />}
              </div>
            ))}
          </div>

          <div className="bg-card rounded-2xl shadow-card p-8">
            {step === 0 && (
              <div>
                <h2 className="text-xl font-semibold text-secondary mb-6">اختر نوع الكتاب</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {bookTypes.map((bt) => (
                    <button
                      key={bt.id}
                      onClick={() => updateField('bookTypeId', bt.id)}
                      className={`p-4 rounded-xl border-2 text-right transition-all cursor-pointer ${
                        form.bookTypeId === bt.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <span className="font-medium text-secondary">{bt.name_ar}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-xl font-semibold text-secondary mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  معلومات الشخصية
                </h2>
                <div className="space-y-5">
                  <Input label="اسم الشخصية" placeholder="أدخل اسم الشخصية" value={form.characterName} onChange={(e) => updateField('characterName', e.target.value)} required />

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">الفئة العمرية</label>
                    <div className="grid grid-cols-3 gap-2">
                      {ageRanges.map((r) => (
                        <button
                          key={r.value}
                          onClick={() => updateField('age', r.value)}
                          className={`p-3 rounded-xl border-2 text-center text-sm transition-all cursor-pointer ${
                            form.age === r.value ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/30'
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">الجنسية</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {nationalities.map((n) => (
                        <button
                          key={n}
                          onClick={() => updateField('nationality', n)}
                          className={`p-3 rounded-xl border-2 text-center text-sm transition-all cursor-pointer ${
                            form.nationality === n ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/30'
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">نوع القصة</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {storyTypes.map((s) => (
                        <button
                          key={s}
                          onClick={() => updateField('storyType', s)}
                          className={`p-3 rounded-xl border-2 text-center text-sm transition-all cursor-pointer ${
                            form.storyType === s ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/30'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">هدف القصة</label>
                    <div className="grid grid-cols-2 gap-2">
                      {storyGoals.map((g) => (
                        <button
                          key={g}
                          onClick={() => updateField('storyGoal', g)}
                          className={`p-3 rounded-xl border-2 text-center text-sm transition-all cursor-pointer ${
                            form.storyGoal === g ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/30'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-xl font-semibold text-secondary mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  الصفات الجسدية
                </h2>
                <p className="text-sm text-secondary/60 mb-6">اختر صفات الشخصية الجسدية لمساعدة الكتاب في الوصف الدقيق</p>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">لون العيون</label>
                    <div className="grid grid-cols-4 gap-2">
                      {eyeColors.map((c) => (
                        <button
                          key={c}
                          onClick={() => updateField('eyeColor', c)}
                          className={`p-3 rounded-xl border-2 text-center text-sm transition-all cursor-pointer ${
                            form.eyeColor === c ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/30'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">لون الشعر</label>
                    <div className="grid grid-cols-4 gap-2">
                      {hairColors.map((c) => (
                        <button
                          key={c}
                          onClick={() => updateField('hairColor', c)}
                          className={`p-3 rounded-xl border-2 text-center text-sm transition-all cursor-pointer ${
                            form.hairColor === c ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/30'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">لون البشرة</label>
                    <div className="grid grid-cols-4 gap-2">
                      {skinTones.map((t) => (
                        <button
                          key={t}
                          onClick={() => updateField('skinTone', t)}
                          className={`p-3 rounded-xl border-2 text-center text-sm transition-all cursor-pointer ${
                            form.skinTone === t ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/30'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">الطول</label>
                    <div className="grid grid-cols-3 gap-2">
                      {heights.map((h) => (
                        <button
                          key={h}
                          onClick={() => updateField('height', h)}
                          className={`p-3 rounded-xl border-2 text-center text-sm transition-all cursor-pointer ${
                            form.height === h ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/30'
                          }`}
                        >
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">البنية الجسدية</label>
                    <div className="grid grid-cols-3 gap-2">
                      {builds.map((b) => (
                        <button
                          key={b}
                          onClick={() => updateField('build', b)}
                          className={`p-3 rounded-xl border-2 text-center text-sm transition-all cursor-pointer ${
                            form.build === b ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/30'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-xl font-semibold text-secondary mb-6 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  الهوايات والصفات
                </h2>
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">الهوايات</label>
                    <div className="flex gap-2 mb-2">
                      <Input placeholder="أضف هواية..." value={hobbyInput} onChange={(e) => setHobbyInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('hobbies', hobbyInput, setHobbyInput))} />
                      <Button variant="outline" onClick={() => addItem('hobbies', hobbyInput, setHobbyInput)}><Plus className="w-4 h-4" /></Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {form.hobbies.map((h, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                          {h}
                          <button onClick={() => removeItem('hobbies', i)} className="cursor-pointer"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">الصفات</label>
                    <div className="flex gap-2 mb-2">
                      <Input placeholder="أضف صفة..." value={qualityInput} onChange={(e) => setQualityInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('qualities', qualityInput, setQualityInput))} />
                      <Button variant="outline" onClick={() => addItem('qualities', qualityInput, setQualityInput)}><Plus className="w-4 h-4" /></Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {form.qualities.map((q, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm">
                          {q}
                          <button onClick={() => removeItem('qualities', i)} className="cursor-pointer"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="text-xl font-semibold text-secondary mb-6 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" />
                  الذكريات والصور
                </h2>
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">الذكريات</label>
                    <div className="flex gap-2 mb-2">
                      <Input placeholder="أضف ذكرى..." value={memoryInput} onChange={(e) => setMemoryInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('memories', memoryInput, setMemoryInput))} />
                      <Button variant="outline" onClick={() => addItem('memories', memoryInput, setMemoryInput)}><Plus className="w-4 h-4" /></Button>
                    </div>
                    <div className="space-y-2">
                      {form.memories.map((m, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-accent/30">
                          <span className="text-sm">{m}</span>
                          <button onClick={() => removeItem('memories', i)} className="cursor-pointer"><X className="w-4 h-4 text-muted-foreground hover:text-error" /></button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">رسالة العميل</label>
                    <Textarea placeholder="اكتب رسالتك أو ملاحظاتك..." value={form.clientMessage} onChange={(e) => updateField('clientMessage', e.target.value)} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      صور الشخصية الرئيسية
                      <span className="text-primary mr-2">(مطلوب ٥ صور)</span>
                    </label>
                    <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                      imageFiles.length >= 5 ? 'border-green-400 bg-green-50' : 'border-border hover:border-primary/30'
                    }`}>
                      {imageFiles.length < 5 && (
                        <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
                          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                          <p className="text-sm text-secondary/60">اختر الصور من جهازك</p>
                          <p className="text-xs text-muted-foreground mt-1">PNG, JPG, JPEG - مطلوب {5 - imageFiles.length} صور</p>
                        </div>
                      )}
                      <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelect} />
                    </div>

                    {imagePreviews.length > 0 && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-secondary">الصور المرفوعة ({imagePreviews.length}/5)</span>
                          {imagePreviews.length < 5 && (
                            <button onClick={() => fileInputRef.current?.click()} className="text-sm text-primary hover:underline cursor-pointer">
                              + إضافة صورة
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-5 gap-3">
                          {imagePreviews.map((preview, i) => (
                            <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-border">
                              <img src={preview} alt={`صورة ${i + 1}`} className="w-full h-full object-cover" />
                              <button onClick={() => removeImage(i)} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <X className="w-3 h-3" />
                              </button>
                              <div className="absolute bottom-1 left-1 w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                                {i + 1}
                              </div>
                            </div>
                          ))}
                          {Array.from({ length: 5 - imagePreviews.length }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square rounded-xl border-2 border-dashed border-border flex items-center justify-center">
                              <ImageIcon className="w-6 h-6 text-border" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-4">
                      صور الشخصيات المساعدة في القصة
                      <span className="text-muted-foreground mr-2 text-xs">(اختياري - صور الأشخاص المذكورين في القصة)</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {characterImages.map((ci) => (
                        <div key={ci.role} className="relative">
                          <div className={`aspect-square rounded-xl border-2 overflow-hidden transition-colors ${
                            ci.preview ? 'border-primary/30' : 'border-dashed border-border hover:border-primary/30'
                          }`}>
                            {ci.preview ? (
                              <>
                                <img src={ci.preview} alt={ci.role} className="w-full h-full object-cover" />
                                <button onClick={() => removeCharacterImage(ci.role)} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer">
                                  <X className="w-3 h-3" />
                                </button>
                              </>
                            ) : (
                              <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                                <Plus className="w-6 h-6 text-muted-foreground mb-1" />
                                <span className="text-xs text-muted-foreground">{characterRoles.find((r) => r.key === ci.role)?.label}</span>
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleCharacterImageSelect(ci.role, e)} />
                              </label>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <h2 className="text-xl font-semibold text-secondary mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  عنوان الشحن
                </h2>
                <div className="space-y-5">
                  <Input label="اسم المستلم" placeholder="الاسم الكامل" value={form.fullName} onChange={(e) => updateField('fullName', e.target.value)} required />
                  <Input label="رقم الهاتف" placeholder="09xxxxxxxx" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} maxLength={10} required />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="المدينة" placeholder="الرياض" value={form.city} onChange={(e) => updateField('city', e.target.value)} required />
                    <Input label="الحي" placeholder="النخيل" value={form.district} onChange={(e) => updateField('district', e.target.value)} required />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="الشارع" placeholder="اسم الشارع" value={form.street} onChange={(e) => updateField('street', e.target.value)} />
                    <Input label="رقم المبنى" placeholder="رقم المبنى أو الفيلا" value={form.buildingNumber} onChange={(e) => updateField('buildingNumber', e.target.value)} />
                  </div>
                  <Textarea label="تفاصيل إضافية" placeholder="أي معلومات إضافية للتوصيل" value={form.additionalDetails} onChange={(e) => updateField('additionalDetails', e.target.value)} />
                </div>
              </div>
            )}

            {step === 6 && (
              <div>
                <h2 className="text-xl font-semibold text-secondary mb-6">مراجعة الطلب</h2>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-accent/30">
                    <span className="text-sm text-secondary/60">نوع الكتاب</span>
                    <p className="font-medium">{selectedBook?.name_ar}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-accent/30">
                    <span className="text-sm text-secondary/60">اسم الشخصية</span>
                    <p className="font-medium">{form.characterName}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-accent/30">
                    <span className="text-sm text-secondary/60">الجنسية</span>
                    <p className="font-medium">{form.nationality}</p>
                  </div>
                  {(form.eyeColor || form.hairColor || form.height || form.skinTone || form.build) && (
                    <div className="p-4 rounded-xl bg-accent/30">
                      <span className="text-sm text-secondary/60">الصفات الجسدية</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {form.eyeColor && <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">العيون: {form.eyeColor}</span>}
                        {form.hairColor && <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">الشعر: {form.hairColor}</span>}
                        {form.skinTone && <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">البشرة: {form.skinTone}</span>}
                        {form.height && <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">الطول: {form.height}</span>}
                        {form.build && <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">البنية: {form.build}</span>}
                      </div>
                    </div>
                  )}
                  {form.hobbies.length > 0 && (
                    <div className="p-4 rounded-xl bg-accent/30">
                      <span className="text-sm text-secondary/60">الهوايات</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {form.hobbies.map((h, i) => <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">{h}</span>)}
                      </div>
                    </div>
                  )}
                  {form.qualities.length > 0 && (
                    <div className="p-4 rounded-xl bg-accent/30">
                      <span className="text-sm text-secondary/60">الصفات</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {form.qualities.map((q, i) => <span key={i} className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm">{q}</span>)}
                      </div>
                    </div>
                  )}
                  <div className="p-4 rounded-xl bg-accent/30">
                    <span className="text-sm text-secondary/60">الصور</span>
                    <p className="font-medium">{imageFiles.length} صور للشخصية الرئيسية</p>
                    <p className="font-medium">{characterImages.filter((ci) => ci.file).length} صور لشخصيات مساعدة</p>
                  </div>
                  <div className="p-4 rounded-xl bg-accent/30">
                    <span className="text-sm text-secondary/60">عنوان الشحن</span>
                    <p className="font-medium">{form.fullName} - {form.city}، {form.district}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              {step > 0 ? (
                <Button variant="outline" onClick={() => { setStep((s) => s - 1); window.scrollTo(0, 0) }}>
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
                <Button onClick={handleSubmit} loading={loading}>
                  {loading ? 'جاري إرسال الطلب...' : 'إرسال الطلب'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
