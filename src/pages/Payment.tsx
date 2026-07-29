import { useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Copy, Check, Wallet, CreditCard, ArrowLeft, Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { toast } from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { updatePaymentNotification } from '@/lib/supabase-service'
import { useAuthStore } from '@/store/auth'

const shamCashInfo = {
  beneficiary: 'أنجز',
  walletNumber: '97ceb947e59e77ef55fdfa062f0afcaf',
}

export default function Payment() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')
  const amount = searchParams.get('amount') || '0'
  const { user } = useAuthStore()
  const [copied, setCopied] = useState(false)
  const [paymentFile, setPaymentFile] = useState<File | null>(null)
  const [paymentPreview, setPaymentPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const copyNumber = () => {
    navigator.clipboard.writeText(shamCashInfo.walletNumber)
    setCopied(true)
    toast.success('تم نسخ رقم المحفظة')
    setTimeout(() => setCopied(false), 3000)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
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
    setLoading(true)
    setUploading(true)
    try {
      const filePath = `payment-proofs/${user?.id}/${Date.now()}-${paymentFile.name}`
      const { error: uploadError } = await supabase.storage
        .from('payment-notifications')
        .upload(filePath, paymentFile)
      if (uploadError) throw uploadError
      const { data: { publicUrl } } = supabase.storage
        .from('payment-notifications')
        .getPublicUrl(filePath)

      await updatePaymentNotification(orderId!, publicUrl)
      toast.success('تم إرسال إشعار الدفع! بانتظار المراجعة.')
      navigate('/payment-success')
    } catch (e: any) {
      toast.error(e?.message || 'حدث خطأ في الاتصال')
    } finally {
      setLoading(false)
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-gradient-to-b from-primary/5 to-background">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-secondary">الدفع عبر شام كاش</h1>
          <p className="text-secondary-light mt-2">أكمل عملية الدفع عبر محفظة شام كاش</p>
        </div>

        <div className="bg-card rounded-2xl shadow-card p-8">
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
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between text-lg">
                  <span className="font-semibold text-secondary">المبلغ</span>
                  <span className="font-bold text-primary">{Number(amount).toLocaleString('ar-SA')} ل.س</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8">
            <label className="block text-sm font-medium text-secondary mb-3">
              صورة إشعار الدفع
              <span className="text-primary mr-1">*</span>
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
                <button
                  onClick={removeFile}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
            <p className="text-xs text-secondary-light mt-2">
              قم بتحويل المبلغ إلى رقم المحفظة أعلاه، ثم ارفع صورة إشعار التحويل
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <Button className="w-full" size="lg" onClick={handleSubmit} loading={loading}>
              {loading ? 'جاري الإرسال...' : 'تأكيد الدفع وإرسال الطلب'}
            </Button>
            <p className="text-xs text-center text-secondary-light">
              بعد إرسال الطلب، سيتم مراجعة الدفع من قبل الإدارة خلال 24 ساعة
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}