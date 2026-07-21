import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, Star, Shield, Heart, Camera, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

const stats = [
  { number: '٥٠٠+', label: 'قصة منشورة', icon: BookOpen },
  { number: '٢٠٠+', label: 'عميل سعيد', icon: Star },
  { number: '٩٨٪', label: 'رضا العملاء', icon: Heart },
  { number: '١٥+', label: 'نوع كتاب', icon: Sparkles },
]

const bookTypes = [
  { title: 'قصة طفولة', desc: 'احتفظ بذكريات طفولتك في كتاب فاخر', icon: '👶', color: 'from-primary/10 to-accent/10' },
  { title: 'قصة شباب', desc: 'توثيق مرحلة الشباب والإنجازات', icon: '🌟', color: 'from-primary/10 to-accent/10' },
  { title: 'قصة تخرج', desc: 'رحلة النجاح من أول يوم دراسي', icon: '🎓', color: 'from-primary/10 to-accent/10' },
  { title: 'سيرة ذاتية', desc: 'سيرتك المهنية بقصة ملهمة', icon: '💼', color: 'from-accent/10 to-accent/5' },
  { title: 'قصة رحلة', desc: 'أجمل ذكريات أسفارك ومغامراتك', icon: '✈️', color: 'from-accent/10 to-accent/5' },
  { title: 'هدية مخصصة', desc: 'هدية فريدة لأعز الناس', icon: '🎁', color: 'from-error/10 to-error/5' },
]

const testimonials = [
  {
    name: 'سارة الأحمد', role: 'عميلة',
    text: 'تجربة رائعة! حولت قصة طفولتي إلى كتاب فاخر، العائلة كلها انبهرت بالنتيجة.',
    rating: 5,
  },
  {
    name: 'محمد العلي', role: 'عميل',
    text: 'أهديت زوجتي كتاب قصة حبنا في ذكرى زواجنا. كانت أجمل هدية على الإطلاق.',
    rating: 5,
  },
  {
    name: 'نورة السعد', role: 'عميلة',
    text: 'سيرة والدي المهنية أصبحت كتاباً ملهماً. شكراً روايتك على هذا العمل الرائع.',
    rating: 5,
  },
]

export default function FullHome() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-right order-2 lg:order-1">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                حول قصتك إلى كتاب فاخر
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary leading-tight mb-6">
                لأن لكل إنسان
                <br />
                <span className="gradient-primary bg-clip-text text-transparent">قصة تستحق أن تُروى</span>
              </h1>
              <p className="text-lg text-secondary-light max-w-xl mb-10 leading-relaxed lg:mx-0 mx-auto">
                منصة متكاملة لتحويل قصصك وذكرياتك إلى كتب مطبوعة فاخرة. اختر نوع قصتك، أضف التفاصيل والصور، ونحن نصنع لك كتاباً يبقى للأبد.
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-4 flex-wrap">
                <Link to="/create-order">
                  <Button size="lg" className="shadow-lg shadow-primary/25">
                    ابدأ قصتك الآن
                    <ArrowLeft className="w-5 h-5 mr-2" />
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button variant="outline" size="lg">كيف يعمل الموقع</Button>
                </Link>
              </div>
            </div>
            <div className="order-1 lg:order-2 flex justify-center lg:justify-start">
              <div className="relative w-full max-w-lg">
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl blur-2xl" />
                <img
                  src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80"
                  alt="كتاب فاخر"
                  className="relative rounded-2xl shadow-2xl w-full h-auto object-cover aspect-[4/3]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary/5">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="text-center">
                  <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-secondary mb-1">{stat.number}</div>
                  <div className="text-sm text-secondary-light">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Book Types Preview */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">اختر نوع قصتك</h2>
            <p className="text-secondary-light max-w-xl mx-auto">نقدم مجموعة متنوعة من أنواع الكتب لتناسب كل مناسبة وكل قصة</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookTypes.map((type, i) => (
              <div key={type.title}>
                <Link to="/create-order">
                  <Card className="group hover:shadow-card-hover cursor-pointer h-full">
                    <CardContent className="p-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${type.color} flex items-center justify-center text-3xl mb-4`}>{type.icon}</div>
                      <h3 className="text-lg font-semibold text-secondary mb-2">{type.title}</h3>
                      <p className="text-sm text-secondary-light leading-relaxed">{type.desc}</p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/create-order">
              <Button variant="outline" size="lg">ابدأ كتابتك الآن <ArrowLeft className="w-5 h-5 mr-2" /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-primary/5">
        <div className="container-custom">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">كيف تعمل روايتك؟</h2>
            <p className="text-secondary-light max-w-xl mx-auto">ثلاث خطوات بسيطة لتحويل قصتك إلى كتاب فاخر</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '١', title: 'اختر نوع قصتك', desc: 'اختر من بين مجموعة متنوعة من أنواع الكتب', icon: BookOpen },
              { step: '٢', title: 'أضف التفاصيل', desc: 'أخبرنا بقصتك وأرفق الصور والذكريات', icon: Camera },
              { step: '٣', title: 'استلم كتابك', desc: 'نقوم بكتابة وطباعة وشحن الكتاب الفاخر إليك', icon: Heart },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div key={item.step} className="text-center">
                  <div className="relative inline-block mb-6">
                    <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center"><Icon className="w-8 h-8 text-white" /></div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary text-white text-sm font-bold flex items-center justify-center">{item.step}</div>
                  </div>
                  <h3 className="text-lg font-semibold text-secondary mb-2">{item.title}</h3>
                  <p className="text-sm text-secondary-light max-w-xs mx-auto">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">ماذا يقول عملاؤنا</h2>
            <p className="text-secondary-light max-w-xl mx-auto">قصص نجاح من عملائنا الذين وثقوا ذكرياتهم معنا</p>
          </div>
          <div className="max-w-lg mx-auto">
            <div key={currentTestimonial}>
              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 text-3xl">{testimonials[currentTestimonial].name[0]}</div>
                  <div className="flex justify-center gap-1 mb-4">
                    {Array.from({ length: testimonials[currentTestimonial].rating }).map((_, i) => (<Star key={i} className="w-4 h-4 fill-primary text-primary" />))}
                  </div>
                  <p className="text-secondary/80 leading-relaxed mb-6">"{testimonials[currentTestimonial].text}"</p>
                  <div>
                    <div className="font-semibold text-secondary">{testimonials[currentTestimonial].name}</div>
                    <div className="text-sm text-secondary-light">{testimonials[currentTestimonial].role}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="flex items-center justify-center gap-3 mt-6">
              <button onClick={() => setCurrentTestimonial((p) => (p - 1 + testimonials.length) % testimonials.length)} className="p-2 rounded-lg border border-border hover:bg-primary/5 transition-colors cursor-pointer"><ChevronRight className="w-5 h-5" /></button>
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setCurrentTestimonial(i)} className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${i === currentTestimonial ? 'bg-primary w-6' : 'bg-border hover:bg-primary/50'}`} />
              ))}
              <button onClick={() => setCurrentTestimonial((p) => (p + 1) % testimonials.length)} className="p-2 rounded-lg border border-border hover:bg-primary/5 transition-colors cursor-pointer"><ChevronLeft className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-primary/5">
        <div className="container-custom">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">لماذا تختار روايتك؟</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'جودة فاخرة', desc: 'طباعة عالية الجودة على أفضل أنواع الورق مع تجليد فاخر', icon: Shield },
              { title: 'تصميم احترافي', desc: 'فريق من المصممين المحترفين يصمم كتابك بأعلى معايير الجمال', icon: Sparkles },
              { title: 'كتابة إبداعية', desc: 'كتاب محترفون يحولون قصتك إلى نص أدبي رائع', icon: BookOpen },
              { title: 'شحن لكل العالم', desc: 'نشحن طلبك أينما كنت في العالم مع تغليف آمن وفاخر', icon: Shield },
              { title: 'هدية مثالية', desc: 'كتاب مخصص هو أرقى وأجمل هدية يمكنك تقديمها', icon: Heart },
              { title: 'ضمان الرضا', desc: 'نضمن لك الرضا التام أو نعيد طباعة كتابك مجاناً', icon: Star },
            ].map((feature, i) => {
              const Icon = feature.icon
              return (
                <div key={feature.title}>
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4"><Icon className="w-5 h-5 text-white" /></div>
                      <h3 className="font-semibold text-secondary mb-2">{feature.title}</h3>
                      <p className="text-sm text-secondary-light leading-relaxed">{feature.desc}</p>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container-custom">
          <div className="relative overflow-hidden rounded-3xl gradient-primary p-12 text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">ابدأ قصتك الآن</h2>
              <p className="text-white/80 max-w-lg mx-auto mb-8">كل لحظة في حياتك تستحق أن تخلد. حول ذكرياتك إلى كتاب فاخر يبقى للأبد.</p>
              <Link to="/create-order">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg">
                  ابدأ الآن <ArrowLeft className="w-5 h-5 mr-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
