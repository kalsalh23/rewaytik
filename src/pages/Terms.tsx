import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function Terms() {
  return (
    <div className="pt-24 pb-20">
      <div className="container-custom max-w-3xl">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-secondary/60 hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            العودة للرئيسية
          </Link>
          <h1 className="text-4xl font-bold text-secondary mb-8">الشروط والأحكام</h1>
          <div className="space-y-6 text-secondary/70 leading-relaxed">
            <p>باستخدامك لموقع "روايتك" فإنك توافق على هذه الشروط والأحكام. يرجى قراءتها بعناية.</p>
            <h2 className="text-xl font-bold text-secondary">الخدمات</h2>
            <p>نقدم خدمات تحويل القصص الشخصية إلى كتب مطبوعة. جميع المحتويات المقدمة من العميل تخضع للمراجعة لضمان ملاءمتها للنشر.</p>
            <h2 className="text-xl font-bold text-secondary">الملكية الفكرية</h2>
            <p>يحتفظ العميل بحقوق الملكية الفكرية للقصص والصور المقدمة. نحتفظ بحق استخدام المحتوى في معرض أعمالنا بعد موافقة العميل.</p>
            <h2 className="text-xl font-bold text-secondary">الدفع</h2>
            <p>الدفع يتم مقدماً عبر محفظة شام كاش. لن يبدأ العمل على الطلب إلا بعد تأكيد الدفع.</p>
            <h2 className="text-xl font-bold text-secondary">الشحن</h2>
            <p>نشحن الطلبات إلى العنوان المقدم من العميل. مدة التوصيل تعتمد على الوجهة وشركة الشحن.</p>
            <h2 className="text-xl font-bold text-secondary">الإلغاء والاسترجاع</h2>
            <p>يمكن إلغاء الطلب قبل بدء العمل عليه. بعد بدء الكتابة أو الطباعة، لا يمكن إلغاء الطلب. نضمن إعادة الطباعة في حال وجود عيوب تصنيع.</p>
            <h2 className="text-xl font-bold text-secondary">تعديل الشروط</h2>
            <p>نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إعلام المستخدمين بالتغييرات الجوهرية.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
