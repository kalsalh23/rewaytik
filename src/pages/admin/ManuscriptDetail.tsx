import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Download, Loader2, FileText, Clock, CheckCircle, Save, Upload, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { getManuscriptStatusColor, getManuscriptStatusLabel, formatDate } from '@/lib/utils'
import { toast } from 'react-hot-toast'
import { getManuscriptOrder, updateManuscriptStatus, updateManuscriptInternalNotes, uploadManuscriptFinalFile, updateManuscriptPaymentStatus } from '@/lib/supabase-service'
import { useAuthStore } from '@/store/auth'

const allStatuses = [
  { value: 'new', label: 'جديد' },
  { value: 'under_review', label: 'قيد المراجعة' },
  { value: 'awaiting_client', label: 'بانتظار العميل' },
  { value: 'designing', label: 'جاري التصميم' },
  { value: 'formatting', label: 'جاري التنسيق' },
  { value: 'illustrating', label: 'جاري إنشاء الرسومات' },
  { value: 'final_review', label: 'مراجعة نهائية' },
  { value: 'ready_to_print', label: 'جاهز للطباعة' },
  { value: 'completed', label: 'مكتمل' },
  { value: 'cancelled', label: 'ملغي' },
]

const visualStylesLabels: Record<string, string> = {
  classic: 'كلاسيكي', modern: 'حديث', luxury: 'فاخر', minimal: 'Minimal',
  fantasy: 'فانتازي', historical: 'تاريخي', romantic: 'رومانسي',
  detective: 'بوليسي', scifi: 'خيال علمي', children: 'أطفال', designer: 'قرار التصميم',
}

const servicesLabels: Record<string, string> = {
  proofreading: 'تدقيق لغوي', printing_prep: 'تجهيز للطباعة',
  pdf_copy: 'نسخة PDF', print_ship: 'طباعة وشحن',
}

const languageLabels: Record<string, string> = {
  arabic: 'العربية', english: 'الإنجليزية', bilingual: 'ثنائي اللغة', other: 'أخرى',
}

const layoutLabels: Record<string, string> = {
  luxury: 'فاخر', classic: 'كلاسيكي', modern: 'حديث', simple: 'بسيط', designer: 'لفريق التصميم',
}

const imagesOptionLabels: Record<string, string> = {
  none: 'بدون صور', upload: 'سأرفع صوري', designer: 'لفريق التصميم',
}

export default function AdminManuscriptDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuthStore()
  const [manuscript, setManuscript] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [internalNotes, setInternalNotes] = useState('')
  const [estimatedDays, setEstimatedDays] = useState('')
  const [saving, setSaving] = useState(false)
  const [newStatusNote, setNewStatusNote] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (id) {
      getManuscriptOrder(id)
        .then((data) => {
          setManuscript(data)
          setStatus(data.status)
          setInternalNotes(data.internalNotes || '')
          setEstimatedDays(data.estimatedDays?.toString() || '')
        })
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [id])

  const handleStatusChange = async () => {
    if (!id || status === manuscript.status) return
    setSaving(true)
    try {
      await updateManuscriptStatus(id, status, newStatusNote || undefined)
      setManuscript((prev: any) => ({
        ...prev,
        status,
        timeline: [...(prev.timeline || []), { status, date: new Date().toISOString(), note: newStatusNote }],
      }))
      setNewStatusNote('')
      toast.success('تم تحديث الحالة')
    } catch {
      toast.error('فشل تحديث الحالة')
    }
    setSaving(false)
  }

  const handleSaveNotes = async () => {
    if (!id) return
    setSaving(true)
    try {
      await updateManuscriptInternalNotes(id, internalNotes)
      toast.success('تم حفظ الملاحظات')
    } catch {
      toast.error('فشل حفظ الملاحظات')
    }
    setSaving(false)
  }

  const handleFinalFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !id || !user) return
    setSaving(true)
    try {
      const url = await uploadManuscriptFinalFile(id, file, user.id)
      setManuscript((prev: any) => ({ ...prev, finalFileUrl: url }))
      toast.success('تم رفع الملف النهائي')
    } catch {
      toast.error('فشل رفع الملف')
    }
    setSaving(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (!manuscript) {
    return <p className="text-secondary/60">لم يتم العثور على الطلب</p>
  }

  return (
    <div>
      <Link to="/admin/manuscripts" className="inline-flex items-center gap-2 text-sm text-secondary/60 hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        العودة للقائمة
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary mb-2">{manuscript.bookTitle}</h1>
          <div className="flex items-center gap-3 text-sm text-secondary/60">
            <span>{manuscript.orderNumber}</span>
            <span>•</span>
            <span>{formatDate(new Date(manuscript.createdAt))}</span>
          </div>
        </div>
        <Badge variant="info" className={getManuscriptStatusColor(manuscript.status)}>
          {getManuscriptStatusLabel(manuscript.status)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-secondary mb-4">معلومات الكتاب</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-accent/30">
                  <span className="text-xs text-secondary/60">اسم الكتاب</span>
                  <p className="font-medium">{manuscript.bookTitle}</p>
                </div>
                <div className="p-3 rounded-xl bg-accent/30">
                  <span className="text-xs text-secondary/60">اسم المؤلف</span>
                  <p className="font-medium">{manuscript.authorName}</p>
                </div>
                <div className="p-3 rounded-xl bg-accent/30">
                  <span className="text-xs text-secondary/60">لغة الكتاب</span>
                  <p className="font-medium">{languageLabels[manuscript.bookLanguage] || manuscript.bookLanguage}</p>
                </div>
                <div className="p-3 rounded-xl bg-accent/30">
                  <span className="text-xs text-secondary/60">نوع الكتاب</span>
                  <p className="font-medium">{manuscript.bookCategory}</p>
                </div>
                {manuscript.bookSummary && (
                  <div className="col-span-2 p-3 rounded-xl bg-accent/30">
                    <span className="text-xs text-secondary/60">نبذة عن الكتاب</span>
                    <p className="font-medium text-sm">{manuscript.bookSummary}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-secondary mb-4">التصميم والتنسيق</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-accent/30">
                  <span className="text-xs text-secondary/60">الهوية البصرية</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {(manuscript.visualStyles || []).map((s: string) => (
                      <span key={s} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                        {visualStylesLabels[s] || s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-accent/30">
                  <span className="text-xs text-secondary/60">تنسيق الصفحات</span>
                  <p className="font-medium">{layoutLabels[manuscript.pageLayout] || manuscript.pageLayout}</p>
                </div>
                <div className="p-3 rounded-xl bg-accent/30">
                  <span className="text-xs text-secondary/60">الصور الداخلية</span>
                  <p className="font-medium">{imagesOptionLabels[manuscript.internalImagesOption] || manuscript.internalImagesOption}</p>
                </div>
                {manuscript.additionalServices?.length > 0 && (
                  <div className="p-3 rounded-xl bg-accent/30">
                    <span className="text-xs text-secondary/60">الخدمات الإضافية</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {manuscript.additionalServices.map((s: string) => (
                        <span key={s} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                          {servicesLabels[s] || s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-secondary mb-4">الملف</h2>
              {manuscript.manuscriptFileName ? (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/30">
                  <FileText className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{manuscript.manuscriptFileName}</p>
                    {manuscript.manuscriptFileSize && (
                      <p className="text-xs text-secondary/60">{(manuscript.manuscriptFileSize / 1024 / 1024).toFixed(2)} MB</p>
                    )}
                  </div>
                  {manuscript.manuscriptFileUrl && (
                    <a href={manuscript.manuscriptFileUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm"><Download className="w-4 h-4 ml-1" /> تحميل</Button>
                    </a>
                  )}
                </div>
              ) : (
                <p className="text-secondary/60 text-sm">لم يتم رفع ملف</p>
              )}
            </CardContent>
          </Card>

          {manuscript.additionalNotes && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-secondary mb-4">ملاحظات العميل</h2>
                <p className="text-sm text-secondary/80">{manuscript.additionalNotes}</p>
              </CardContent>
            </Card>
          )}

          {manuscript.timeline?.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-secondary mb-4">سجل التقدم</h2>
                <div className="space-y-4">
                  {[...manuscript.timeline].reverse().map((t: any, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        i === 0 ? 'gradient-primary text-white' : 'bg-border text-muted-foreground'
                      }`}>
                        {i === 0 ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{getManuscriptStatusLabel(t.status)}</p>
                        <p className="text-xs text-secondary/60">{formatDate(new Date(t.date))}</p>
                        {t.note && <p className="text-xs text-secondary/80 mt-1">{t.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-secondary mb-4">تغيير الحالة</h2>
              <div className="space-y-3">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-3 rounded-xl border border-border bg-card text-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  {allStatuses.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <Input
                  placeholder="ملاحظة على التغيير (اختياري)"
                  value={newStatusNote}
                  onChange={(e) => setNewStatusNote(e.target.value)}
                />
                <Button onClick={handleStatusChange} loading={saving} disabled={status === manuscript.status} className="w-full">
                  <Save className="w-4 h-4 ml-2" />
                  تحديث الحالة
                </Button>
              </div>
            </CardContent>
          </Card>

          {manuscript.paymentStatus === 'reviewing' && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-primary" />
                  مراجعة الدفع
                </h2>
                <div className="space-y-3">
                  {manuscript.paymentImageUrl && (
                    <a href={manuscript.paymentImageUrl} target="_blank" rel="noopener noreferrer">
                      <img src={manuscript.paymentImageUrl} alt="إشعار الدفع" className="w-full rounded-xl border border-border" />
                    </a>
                  )}
                  {manuscript.walletNumber && (
                    <div className="p-3 rounded-xl bg-accent/30">
                      <span className="text-xs text-secondary/60">رقم المحفظة</span>
                      <p className="font-medium text-sm">{manuscript.walletNumber}</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button variant="success" className="flex-1" onClick={async () => {
                      if (!id) return
                      setSaving(true)
                      try {
                        await updateManuscriptPaymentStatus(id, 'approved', 'تم الموافقة على الدفع')
                        setManuscript((prev) => ({ ...prev, paymentStatus: 'approved', status: 'under_review' }))
                        setStatus('under_review')
                        toast.success('تم الموافقة على الدفع')
                      } catch { toast.error('فشل الموافقة') }
                      setSaving(false)
                    }} loading={saving}>
                      الموافقة
                    </Button>
                    <Button variant="danger" className="flex-1" onClick={async () => {
                      if (!id) return
                      setSaving(true)
                      try {
                        await updateManuscriptPaymentStatus(id, 'rejected', 'تم رفض الدفع')
                        setManuscript((prev) => ({ ...prev, paymentStatus: 'rejected' }))
                        toast.success('تم رفض الدفع')
                      } catch { toast.error('فشل الرفض') }
                      setSaving(false)
                    }} loading={saving}>
                      الرفض
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-secondary mb-4">ملاحظات داخلية</h2>
              <Textarea
                placeholder="ملاحظات للفريق الداخلي..."
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                rows={4}
              />
              <Button variant="outline" onClick={handleSaveNotes} loading={saving} className="w-full mt-3">
                <Save className="w-4 h-4 ml-2" />
                حفظ الملاحظات
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-secondary mb-4">رفع النسخة النهائية</h2>
              <div
                className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/30 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-secondary/60">اضغط لرفع الملف النهائي</p>
              </div>
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleFinalFileUpload} />
              {manuscript.finalFileUrl && (
                <a href={manuscript.finalFileUrl} target="_blank" rel="noopener noreferrer" className="block mt-3">
                  <Button variant="outline" className="w-full" size="sm">
                    <Download className="w-4 h-4 ml-1" /> تحميل النسخة الحالية
                  </Button>
                </a>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-secondary mb-4">الأيام المقدرة</h2>
              <Input
                type="number"
                placeholder="عدد الأيام"
                value={estimatedDays}
                onChange={(e) => setEstimatedDays(e.target.value)}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
