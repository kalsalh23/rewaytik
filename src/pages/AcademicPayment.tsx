import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Copy, Check, Wallet, CreditCard, ArrowLeft, Upload, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { toast } from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { getAcademicOrder, updateAcademicPayment } from '@/lib/supabase-service'
import { useAuthStore } from '@/store/auth'

const shamCashInfo = {
  beneficiary: 'أنجز',
  walletNumber: '97ceb947e59e77ef55fdfa062f0afcaf',
}

export default function AcademicPayment() {
  const { type, id } = useParams<{ type: string; id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [paymentFile, setPaymentFile] = useState<File | null>(null)
  const [paymentPreview, setPaymentPreview] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (type && id) {
      getAcademicOrder(type, id)
        .then((data) => {
          if (data.payment_status !== 'pending') {
            navigate('/my-academic-orders')
            return
          }
          setOrder(data)
        })
        .catch((e) => toast.error(e?.message || 'لم يتم العثور على الطلب'))
        .finally(() => setLoading(false))
    }
  }, [type, id])

  const copyNumber = () => {
    navigator.clipboard.writeText(shamCashInfo.walletNumber)
    setCopied(true)
    toast.success('تم نسخ رقم المحفظة')
    setTimeout(() => setCopied(false), 3000)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('يرجى اختيار صورة')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم الملف يجب أن لا يتجاوز 5 ميغابايت')
      return
    }
    setPaymentFile(file)
    setPaymentPreview(URL.createObjectURL(file))
  }

  const removeFile = () => {
    if (paymentPreview) URL.revokeObjectURL(paymentPreview)
    setPaymentFile(null)
    setPaymentPreview('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async () => {
    if (!paymentFile) {
      toast.error('يرجى رفع صورة إشعار الدفع')
      return
    }
    if (!id || !type) return
    setSubmitting(true)
    try {
      const safeName = paymentFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const filePath = `academic-payments/${type}/${user?.id}/${Date.now()}-${safeName}`
      const { error: uploadError } = await supabase.storage
        .from('academic-uploads')
        .upload(filePath, paymentFile)
      if (uploadError) throw uploadError
      const { data: { publicUrl } } = supabase.storage
        .from('academic-uploads')
        .getPublicUrl(filePath)
      await updateAcademicPayment(type, id, publicUrl, shamCashInfo.walletNumber)
      toast.success('تم إرسال إشعار الدفع! بانتظار المراجعة.')
      navigate('/my-academic-orders')
    } catch (e: any) {
      const msg = e?.message || ''
      if (msg.includes('does not exist') || msg.includes('relation') || msg.includes('not found')) {
        toast.error('خطأ في قاعدة البيانات. يرجى التأكد من تنفيذ ملف الترحيل SQL')
      } else if (msg.includes('policy') || msg.includes('row-level security')) {
        toast.error('خطأ في الصلاحيات')
      } else {
        toast.error(msg || 'حدث خطأ في الاتصال')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  const orderTitle = order?.project_title || order?.research_title || order?.course_name || ''

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-gradient-to-b from-primary/5 to-background">
      <div className="w-full max-w-lg">
        <button onClick={() => navigate('/my-academic-orders')} className="inline-flex items-center gap-2 text-sm text-secondary/60 hover:text-primary mb-6 transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          العودة للطلبات
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-secondary">تأكيد الدفع</h1>
          <p className="text-secondary-light mt-2">أكمل عملية الدفع لتأكيد طلبك</p>
        </div>

        <div className="bg-card rounded-2xl shadow-card p-8">
          {order && (
            <div className="p-4 rounded-xl bg-accent/30 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-secondary/60">رقم الطلب</span>
                <span className="font-medium text-sm">{order.order_number}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary/60">الخدمة</span>
                <span className="font-medium text-sm">{orderTitle}</span>
              </div>
            </div>
          )}

          <Card variant="bordered">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-secondary">شام كاش</h3>
                  <p className="text-xs text-secondary-light">المحفظة الإلكترونية</p>
                </div>
              </div>

              <div className="flex items-center justify-center py-4">
                <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center shadow-sm border border-border overflow-hidden">
                  <img src="/images/shamcash-qr.png" alt="QR Code شام كاش" className="w-full h-full object-contain p-2" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-light">اسم المستفيد</span>
                <span className="font-medium text-secondary">{shamCashInfo.beneficiary}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-light">رقم المحفظة</span>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-medium text-secondary text-xs break-all leading-relaxed" style={{ direction: 'ltr', textAlign: 'right', unicodeBidi: 'bidi-override' }}>{shamCashInfo.walletNumber}</span>
                  <button onClick={copyNumber} className="p-1.5 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer flex-shrink-0" title="نسخ الرقم">
                    {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4 text-primary" />}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8">
            <label className="block text-sm font-medium text-secondary mb-3">
              صورة إشعار الدفع <span className="text-error">*</span>
            </label>
            {!paymentPreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary/30 transition-colors"
              >
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-secondary/60">اختر صورة إشعار الدفع</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, JPEG (حد أقصى 5 ميغابايت)</p>
              </div>
            ) : (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-border">
                <img src={paymentPreview} alt="إشعار الدفع" className="w-full h-full object-contain bg-accent/30" />
                <button onClick={removeFile} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
          </div>

          <div className="mt-8 space-y-3">
            <Button className="w-full" size="lg" onClick={handleSubmit} loading={submitting} disabled={submitting}>
              {submitting ? 'جاري الإرسال...' : 'تأكيد الدفع'}
            </Button>
            <p className="text-xs text-center text-secondary-light">
              بعد تأكيد الدفع، سيتم مراجعة طلبك من قبل الإدارة خلال 24 ساعة
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
