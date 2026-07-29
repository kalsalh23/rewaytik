import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPolicy() {
  return (
    <div className="pt-24 pb-20">
      <div className="container-custom max-w-3xl">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-secondary/60 hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            العودة للرئيسية
          </Link>
          <h1 className="text-4xl font-bold text-secondary mb-8">سياسة الخصوصية</h1>
          <div className="space-y-6 text-secondary/70 leading-relaxed">
            <p>نحن في "أنجز" نلتزم بحماية خصوصية مستخدمينا. توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية معلوماتك الشخصية.</p>
            <h2 className="text-xl font-bold text-secondary">المعلومات التي نجمعها</h2>
            <p>نجمع المعلومات التالية عند استخدامك لخدماتنا: الاسم الكامل، البريد الإلكتروني، رقم الهاتف، عنوان الشحن، الصور والذكريات التي تشاركها معنا، ومعلومات الدفع.</p>
            <h2 className="text-xl font-bold text-secondary">كيف نستخدم معلوماتك</h2>
            <p>نستخدم معلوماتك لتقديم خدماتنا، معالجة طلباتك، التواصل معك بخصوص طلبك، تحسين خدماتنا، وإرسال تحديثات متعلقة بالخدمة.</p>
            <h2 className="text-xl font-bold text-secondary">حماية المعلومات</h2>
            <p>نتخذ إجراءات أمنية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التعديل أو الإفشاء.</p>
            <h2 className="text-xl font-bold text-secondary">مشاركة المعلومات</h2>
            <p>لا نشارك معلوماتك الشخصية مع أطراف ثالثة إلا للضرورة القصوى لتقديم خدماتنا (مثل شركات الشحن) أو وفقاً للقانون.</p>
            <h2 className="text-xl font-bold text-secondary">حفظ البيانات</h2>
            <p>نحتفظ بمعلوماتك طوال الفترة اللازمة لتقديم خدماتنا. يمكنك طلب حذف بياناتك في أي وقت بالتواصل معنا.</p>
            <h2 className="text-xl font-bold text-secondary">اتصل بنا</h2>
            <p>للاستفسارات المتعلقة بالخصوصية، يرجى التواصل معنا عبر البريد الإلكتروني: privacy@riwayatek.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
