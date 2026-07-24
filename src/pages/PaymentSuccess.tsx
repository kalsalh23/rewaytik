import { Link } from 'react-router-dom'
import { CheckCircle, ArrowLeft, Package } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-gradient-to-b from-primary/5 to-background">
      <div className="w-full max-w-md text-center">
        <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-success" />
        </div>
        <h1 className="text-3xl font-bold text-secondary mb-4">تم إرسال طلبك بنجاح!</h1>
        <p className="text-secondary/60 leading-relaxed mb-8">
          شكراً لك! تم استلام طلبك وإشعار الدفع. سيقوم فريقنا بمراجعة الدفع وتأكيده خلال ٢٤ ساعة.
          سنقوم بإعلامك عند تأكيد الدفع والبدء في كتابة قصتك.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/my-orders">
            <Button>
              <Package className="w-4 h-4 ml-2" />
              متابعة الطلب
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة للرئيسية
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
