import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { BookOpen, Mail, RefreshCw, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { toast } from 'react-hot-toast'
import { resendVerification } from '@/lib/supabase-service'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''
  const [sending, setSending] = useState(false)

  const handleResend = async () => {
    if (!email) return
    setSending(true)
    try {
      await resendVerification(email)
      toast.success('تم إعادة إرسال رابط التفعيل! تحقق من بريدك الإلكتروني.')
    } catch (err: any) {
      toast.error(err.message || 'فشل إرسال رابط التفعيل')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-gradient-to-b from-primary/5 to-background">
      <div className="w-full max-w-md text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Mail className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-secondary mb-4">تحقق من بريدك الإلكتروني</h1>
        <p className="text-secondary/60 leading-relaxed mb-2">
          تم إنشاء حسابك بنجاح! يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب.
        </p>
        {email && (
          <p className="text-sm font-medium text-primary mb-8">
            {email}
          </p>
        )}
        <p className="text-sm text-secondary/60 mb-8">
          لم يصلك البريد؟ يمكنك إعادة إرسال رابط التفعيل.
        </p>

        <div className="space-y-3">
          <Button className="w-full" onClick={handleResend} loading={sending}>
            <RefreshCw className="w-4 h-4 ml-2" />
            {sending ? 'جاري الإرسال...' : 'إعادة إرسال رابط التفعيل'}
          </Button>
          <Link to="/login">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة لتسجيل الدخول
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}