import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function ShippingPolicy() {
  return (
    <div className="pt-24 pb-20">
      <div className="container-custom max-w-3xl">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-secondary/60 hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            العودة للرئيسية
          </Link>
          <h1 className="text-4xl font-bold text-secondary mb-8">سياسة الشحن</h1>
          <div className="space-y-6 text-secondary/70 leading-relaxed">
            <h2 className="text-xl font-bold text-secondary">مناطق الشحن</h2>
             <p>نشحن داخل الجمهورية العربية السورية وإلى جميع دول العالم. تكلفة وأوقات الشحن تختلف حسب الوجهة.</p>
            <h2 className="text-xl font-bold text-secondary">مدة التجهيز</h2>
            <p>بعد تأكيد الدفع، يستغرق تجهيز الكتاب من ٧ إلى ١٤ يوم عمل. بعد ذلك، يتم شحنه حسب الوجهة.</p>
            <h2 className="text-xl font-bold text-secondary">مدة الشحن الداخلي</h2>
            <p>داخل الجمهورية العربية السورية: ٢-٤ أيام عمل. التوصيل مجاني للطلبات فوق ٢٠٠ ل.س.</p>
            <h2 className="text-xl font-bold text-secondary">مدة الشحن الدولي</h2>
            <p>للشحن الدولي: ٧-١٤ يوم عمل حسب الوجهة. تحسب تكلفة الشحن حسب الوزن والوجهة.</p>
            <h2 className="text-xl font-bold text-secondary">تتبع الشحنة</h2>
            <p>بعد شحن الطلب، ستصلك رسالة تحتوي على رابط تتبع الشحنة لمتابعة حالة التوصيل.</p>
            <h2 className="text-xl font-bold text-secondary">التغليف</h2>
            <p>جميع الطلبات تغلف بعناية فائقة لضمان وصول الكتاب بحالة ممتازة. نستخدم تغليفاً فاخراً للطلبات الهدية.</p>
            <h2 className="text-xl font-bold text-secondary">تأخير الشحن</h2>
            <p>في حال تأخر الشحن لأكثر من المدة المحددة، يرجى التواصل معنا لتتبع الطلب وحل المشكلة.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
