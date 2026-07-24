import { useNavigate } from 'react-router-dom'
import { Check, ArrowLeft, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { useAuthStore } from '@/store/auth'

const plans = [
  {
    name: 'الكتاب الأساسي',
    price: '٦٥,٠٠٠',
    pages: '٢٠-٣٠ صفحة',
    popular: false,
    features: [
      'غلاف ناعم فاخر',
      'ورق كوشيه لامع',
      'صور ملونة',
      'تصميم بسيط',
      'شحن مجاني',
    ],
  },
  {
    name: 'الكتاب الفاخر',
    price: '٨٧,٠٠٠',
    pages: '٣٠-٤٠ صفحة',
    popular: true,
    features: [
      'غلاف مقوى فاخر',
      'ورق كوشيه فاخر',
      'صور عالية الدقة',
      'تصميم احترافي',
      'شحن مجاني',
      'تغليف هدايا',
      'مراجعة لغوية',
    ],
  },
  {
    name: 'الكتاب الماسي',
    price: '١٠٥,٠٠٠',
    pages: '٤٠-٦٠ صفحة',
    popular: false,
    features: [
      'غلاف مقوى فاخر مع نقش',
      'ورق كوشيه درجة أولى',
      'صور عالية الدقة',
      'تصميم حصري',
      'شحن مجاني',
      'تغليف هدايا فاخر',
      'مراجعة لغوية احترافية',
      'تحرير وتدقيق',
      'توصيل سريع',
    ],
  },
]

export default function Pricing() {
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
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">الأسعار</h1>
          <p className="text-secondary/60 max-w-2xl mx-auto text-lg">
            نقدم باقات متنوعة تناسب جميع الاحتياجات والميزانيات
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="inline-flex items-center gap-1 px-4 py-1.5 gradient-primary text-white text-sm font-medium rounded-full shadow-sm">
                    <Sparkles className="w-4 h-4" />
                    الأكثر طلباً
                  </span>
                </div>
              )}
              <Card className={`h-full ${plan.popular ? 'ring-2 ring-primary shadow-card-hover' : ''} pt-8`}>
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-bold text-secondary mb-2">{plan.name}</h3>
                    <p className="text-sm text-secondary/60 mb-4">{plan.pages}</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-primary">{plan.price}</span>
                      <span className="text-sm text-secondary/60">ل.س</span>
                    </div>
                  </div>
                  <div className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature, fi) => (
                      <div key={fi} className="flex items-center gap-3 text-sm text-secondary/70">
                        <div className="w-5 h-5 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button className={`w-full ${plan.popular ? '' : 'variant-outline'}`} variant={plan.popular ? 'primary' : 'outline'} onClick={handleAction}>
                      ابدأ الآن
                    </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
