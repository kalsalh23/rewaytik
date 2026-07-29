import { BookOpen, Heart, Sparkles, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'

const values = [
  { icon: Heart, title: 'شغف بالقصص', desc: 'نؤمن بأن لكل إنسان قصة فريدة تستحق أن تُروى وتخلد في كتاب' },
  { icon: Sparkles, title: 'جودة استثنائية', desc: 'نقدم أعلى معايير الجودة في الطباعة والتصميم والتجليد' },
  { icon: Star, title: 'إبداع لا حدود له', desc: 'فريقنا الإبداعي يحول المعلومات إلى قصص أدبية رائعة' },
  { icon: BookOpen, title: 'اهتمام بالتفاصيل', desc: 'نعتني بكل تفصيلة صغيرة لتصنع كتاباً يليق بذكرياتك' },
]

const team = [
  { name: 'قصي مهند الصالح', role: '', initial: 'ق' },
  { name: 'محمد الرسلان', role: '', initial: 'م' },
  { name: 'خالد اليوسف', role: '', initial: 'خ' },
  { name: 'محمد اليوسف', role: '', initial: 'م' },
  { name: 'محمود الشقرة', role: '', initial: 'م' },
]

export default function About() {
  return (
    <div className="pt-24 pb-20">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">من نحن</h1>
          <p className="text-secondary/60 max-w-2xl mx-auto text-lg">نحن فريق من المحترفين المتحمسين لتحويل القصص إلى كتب خالدة</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-secondary mb-6">قصة أنجز</h2>
            <div className="space-y-4 text-secondary/70 leading-relaxed">
              <p>
                انطلقت فكرة "أنجز" من إيمان عميق بأن لكل إنسان قصة تستحق أن تُروى وتخلد في كتاب. في عالم سريع يطغى عليه الرقمي، أردنا أن نعيد للذكريات قيمتها الملموسة.
              </p>
              <p>
                نحن فريق من الكتاب والمصممين والناشرين المحترفين، نجتمع على شغف واحد: تحويل اللحظات الثمينة والقصص الملهمة إلى كتب مطبوعة فاخرة تبقى للأبد.
              </p>
              <p>
                منذ انطلاقتنا، ساعدنا مئات العملاء على توثيق قصصهم - قصص طفولة، نجاح، حب، رحلات، وإنجازات - في كتب تنتقل عبر الأجيال.
              </p>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-40 rounded-2xl gradient-primary flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-3xl font-bold">٥٠٠+</div>
                  <div className="text-sm text-white/80">قصة منشورة</div>
                </div>
              </div>
              <div className="h-40 rounded-2xl bg-secondary flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-3xl font-bold">٢٠٠+</div>
                  <div className="text-sm text-white/80">عميل سعيد</div>
                </div>
              </div>
              <div className="h-40 rounded-2xl bg-accent-dark flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary">٩٨٪</div>
                  <div className="text-sm text-secondary/60">رضا العملاء</div>
                </div>
              </div>
              <div className="h-40 rounded-2xl bg-primary/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">١٥+</div>
                  <div className="text-sm text-primary/70">نوع كتاب</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary mb-4">قيمنا</h2>
          <p className="text-secondary/60 max-w-xl mx-auto">المبادئ التي توجه عملنا وتجعل قصصك مميزة</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {values.map((value, i) => {
            const Icon = value.icon
            return (
              <div
                key={value.title}
              >
                <Card className="h-full text-center">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-secondary mb-2">{value.title}</h3>
                    <p className="text-sm text-secondary/60">{value.desc}</p>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary mb-4">فريقنا</h2>
          <p className="text-secondary/60 max-w-xl mx-auto">ناس شغوفين وراء كل كتاب ننتجه</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <div
              key={member.name}
              className="text-center"
            >
              <div className="w-24 h-24 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-white">{member.initial}</span>
              </div>
              <h3 className="font-semibold text-secondary">{member.name}</h3>
              <p className="text-sm text-secondary/60 mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
