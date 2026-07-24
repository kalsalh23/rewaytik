import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { useAuthStore } from '@/store/auth'

const bookTypes = [
  {
    id: 1,
    title: 'قصة طفولة',
    icon: '👶',
    desc: 'وثق ذكريات طفولتك أو طفولة أطفالك في كتاب فاخر يحتفظ بأجمل اللحظات.',
    price: 'تبدأ من ١٥٠ ل.س',
    features: ['٢٠-٣٠ صفحة', 'غلاف فاخر', 'صور ملونة', 'ورق عالي الجودة'],
    color: 'from-primary/10 to-primary/5',
    popular: true,
  },
  {
    id: 2,
    title: 'قصة شباب',
    icon: '🌟',
    desc: 'سجل مرحلة الشباب والإنجازات والطموحات في كتاب يوثق هذه المرحلة المهمة.',
    price: 'تبدأ من ١٥٠ ل.س',
    features: ['٢٠-٣٠ صفحة', 'غلاف فاخر', 'صور ملونة', 'ورق عالي الجودة'],
    color: 'from-primary/10 to-accent/10',
    popular: false,
  },
  {
    id: 3,
    title: 'قصة تخرج',
    icon: '🎓',
    desc: 'رحلة النجاح والتفوق من أول يوم دراسي حتى لحظة التخرج في كتاب لا يُنسى.',
    price: 'تبدأ من ١٧٥ ل.س',
    features: ['٢٥-٣٥ صفحة', 'غلاف فاخر', 'صور ملونة', 'تصميم خاص'],
    color: 'from-primary/10 to-primary/5',
    popular: true,
  },
  {
    id: 4,
    title: 'قصة نجاح',
    icon: '🏆',
    desc: 'سرد ملهم لرحلتك المهنية وإنجازاتك في كتاب يلهم الأجيال القادمة.',
    price: 'تبدأ من ٢٠٠ ل.س',
    features: ['٣٠-٤٠ صفحة', 'غلاف فاخر', 'صور ملونة', 'تحرير احترافي'],
    color: 'from-accent/10 to-accent/5',
    popular: false,
  },
  {
    id: 5,
    title: 'قصة حب',
    icon: '💕',
    desc: 'أجمل مشاعر الحب والرومانسية في كتاب فاخر يخلد قصتكما للأبد.',
    price: 'تبدأ من ١٧٥ ل.س',
    features: ['٢٠-٣٠ صفحة', 'غلاف فاخر', 'تصميم رومانسي', 'ورق عالي الجودة'],
    color: 'from-error/10 to-error/5',
    popular: true,
  },
  {
    id: 6,
    title: 'قصة رحلة',
    icon: '✈️',
    desc: 'أجمل ذكريات أسفارك ومغامراتك حول العالم في كتاب مصور فاخر.',
    price: 'تبدأ من ٢٠٠ ل.س',
    features: ['٣٠-٤٠ صفحة', 'غلاف فاخر', 'صور عالية الدقة', 'خرائط ومسارات'],
    color: 'from-primary/10 to-accent/10',
    popular: false,
  },
  {
    id: 7,
    title: 'سيرة ذاتية',
    icon: '💼',
    desc: 'سيرتك المهنية بقصة ملهمة تعكس مسيرتك وخبراتك وإنجازاتك.',
    price: 'تبدأ من ٢٥٠ ل.س',
    features: ['٤٠-٥٠ صفحة', 'غلاف فاخر', 'تصميم احترافي', 'مراجعة لغوية'],
    color: 'from-primary/5 to-primary/10',
    popular: false,
  },
  {
    id: 8,
    title: 'هدية مخصصة',
    icon: '🎁',
    desc: 'هدية فريدة ومميزة لأعز الناس. كتاب مخصص يعبر عن مشاعرك بأجمل طريقة.',
    price: 'تبدأ من ١٥٠ ل.س',
    features: ['حسب الطلب', 'غلاف فاخر', 'تغليف هدايا', 'رسالة شخصية'],
    color: 'from-accent/10 to-accent/5',
    popular: false,
  },
  {
    id: 9,
    title: 'قصة عائلة',
    icon: '👨‍👩‍👧‍👦',
    desc: 'تاريخ عائلتك وقصص الأجداد في كتاب ينتقل عبر الأجيال.',
    price: 'تبدأ من ٢٥٠ ل.س',
    features: ['٤٠-٦٠ صفحة', 'غلاف فاخر', 'شجرة عائلة', 'صور أرشيفية'],
    color: 'from-accent/10 to-accent/5',
    popular: false,
  },
  {
    id: 10,
    title: 'قصة مخصصة',
    icon: '✨',
    desc: 'أي قصة أخرى تريد تخليدها. نخبرك قصتك بأسلوبنا الإبداعي الفريد.',
    price: 'حسب الطلب',
    features: ['محتوى مخصص', 'تصميم خاص', 'إبداع غير محدود', 'جودة فاخرة'],
    color: 'from-primary/10 to-primary/5',
    popular: false,
  },
]

export default function BookTypes() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()

  const handleSelect = (bookId: number) => {
    if (isAuthenticated) {
      navigate(`/create-order?type=${bookId}`)
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="pt-24 pb-20">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">أنواع الكتب</h1>
          <p className="text-secondary/60 max-w-2xl mx-auto text-lg">
            اختر نوع قصتك وسنحولها إلى كتاب فاخر يبقى للأبد
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookTypes.map((book, i) => (
            <div
              key={book.id}
            >
              <Card className="group hover:shadow-card-hover h-full relative overflow-hidden">
                {book.popular && (
                  <div className="absolute top-4 left-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                      الأكثر طلباً
                    </span>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${book.color} flex items-center justify-center text-3xl mb-4`}>
                    {book.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-secondary mb-2">{book.title}</h3>
                  <p className="text-sm text-secondary/60 leading-relaxed mb-4">{book.desc}</p>
                  <div className="space-y-2 mb-6">
                    {book.features.map((f, fi) => (
                      <div key={fi} className="flex items-center gap-2 text-sm text-secondary/70">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="font-semibold text-primary">{book.price}</span>
                    <Button size="sm" onClick={() => handleSelect(book.id)}>اختيار</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
