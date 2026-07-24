import { Link } from 'react-router-dom'
import { BookOpen, Sparkles, ArrowLeft, Star, Heart, Shield } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function Welcome() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/5">
        {/* Decorative elements */}
        <div className="absolute top-20 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-4xl">
          <div className="absolute top-10 right-10 w-4 h-4 rounded-full bg-primary/20" />
          <div className="absolute bottom-20 left-20 w-6 h-6 rounded-full bg-primary/15" />
          <div className="absolute top-1/3 left-1/4 w-3 h-3 rounded-full bg-primary/25" />
        </div>

        <div className="container-custom relative z-10 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div>
              <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-8 shadow-lg shadow-primary/25">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
            </div>

            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                المنصة الأولى لتحويل القصص إلى كتب مطبوعة
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-secondary leading-tight mb-6">
              لأن لكل إنسان
              <br />
              <span className="gradient-primary bg-clip-text text-transparent">قصة تستحق أن تُروى</span>
            </h1>

            <p className="text-lg text-secondary-light max-w-2xl mx-auto mb-10 leading-relaxed">
              منصة متكاملة لتحويل قصصك وذكرياتك إلى كتب مطبوعة فاخرة. 
              اختر نوع قصتك، أضف التفاصيل والصور، ونحن نصنع لك كتاباً يبقى للأبد.
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/create-order">
                <Button size="lg" className="shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-shadow">
                  ابدأ قصتك الآن
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Button>
              </Link>
              <Link to="/home">
                <Button variant="outline" size="lg">
                  الدخول كزائر
                </Button>
              </Link>
            </div>

            <div className="mt-16 flex items-center justify-center gap-8 flex-wrap">
              {[
                { icon: Star, text: 'جودة فاخرة' },
                { icon: Heart, text: 'تصميم احترافي' },
                { icon: Shield, text: 'شحن آمن' },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.text} className="flex items-center gap-2 text-sm text-secondary-light">
                    <Icon className="w-4 h-4 text-primary" />
                    <span>{item.text}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
