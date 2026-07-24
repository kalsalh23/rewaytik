import { useNavigate } from 'react-router-dom'
import { BookOpen, ClipboardCheck, Camera, FileText, Printer, Truck, Heart, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/auth'

const steps = [
  {
    icon: BookOpen,
    title: 'اختر نوع الكتاب',
    desc: 'تصفح أنواع الكتب المتاحة واختر النوع الذي يناسب قصتك. سواء كانت قصة طفولة، رحلة، أو هدية مميزة.',
    color: 'from-primary/20 to-primary/5',
  },
  {
    icon: ClipboardCheck,
    title: 'أدخل المعلومات',
    desc: 'املأ جميع التفاصيل المتعلقة بالشخصية: الاسم، العمر، الهوايات، الصفات، الذكريات، وأي معلومات تريد إضافتها.',
    color: 'from-primary/10 to-accent/10',
  },
  {
    icon: Camera,
    title: 'رفع الصور',
    desc: 'أرفق الصور التي تريد إضافتها إلى الكتاب. يمكنك رفع صور من طفولة الشخص، رحلاته، مناسباته المهمة.',
    color: 'from-primary/10 to-primary/5',
  },
  {
    icon: FileText,
    title: 'مراجعة الطلب',
    desc: 'راجع جميع المعلومات التي أدخلتها وتأكد من صحتها قبل إرسال الطلب.',
    color: 'from-accent/10 to-accent/5',
  },
  {
    icon: Heart,
    title: 'الدفع عبر شام كاش',
    desc: 'قم بالدفع عبر محفظة شام كاش. اسم المستفيد: روايتك. رقم المحفظة: 0991234567.',
    color: 'from-accent/10 to-accent/5',
  },
  {
    icon: Camera,
    title: 'رفع إشعار الدفع',
    desc: 'بعد إتمام الدفع، ارفع صورة الإشعار لإتمام عملية التحقق.',
    color: 'from-error/10 to-error/5',
  },
  {
    icon: FileText,
    title: 'كتابة القصة',
    desc: 'بعد تأكيد الدفع، يبدأ فريق الكتابة لدينا في تحويل معلوماتك إلى قصة أدبية جميلة.',
    color: 'from-primary/10 to-primary/5',
  },
  {
    icon: Printer,
    title: 'الطباعة والتجليد',
    desc: 'نقوم بطباعة القصة بأعلى جودة وأجود أنواع الورق مع تجليد فاخر.',
    color: 'from-secondary/10 to-secondary/5',
  },
  {
    icon: Truck,
    title: 'الشحن والتسليم',
    desc: 'نشحن الكتاب إليك أينما كنت مع تغليف آمن وفاخر, لتستلم كتابك في أبهى حلة.',
    color: 'from-primary/10 to-primary/5',
  },
]

export default function HowItWorks() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()

  const handleAction = () => {
    if (isAuthenticated) {
      navigate('/create-order')
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="pt-24 pb-20">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">كيف يعمل الموقع</h1>
          <p className="text-secondary/60 max-w-2xl mx-auto text-lg">
            رحلة قصتك من الفكرة إلى الكتاب الفاخر في خطوات بسيطة وواضحة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div
                key={i}
                className="relative group"
              >
                <div className="bg-card rounded-2xl shadow-card hover:shadow-card-hover p-6 h-full transition-all duration-200">
                  <div className="flex items-start gap-4">
                    <div className={`relative flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-secondary" />
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full gradient-primary text-white text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary mb-2">{step.title}</h3>
                      <p className="text-sm text-secondary/60 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" onClick={handleAction}>
              ابدأ قصتك الآن
              <ArrowLeft className="w-5 h-5 mr-2" />
            </Button>
        </div>
      </div>
    </div>
  )
}
