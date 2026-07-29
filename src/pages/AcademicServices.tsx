import { useNavigate } from 'react-router-dom'
import { GraduationCap, Presentation, BookMarked, FlaskConical, ArrowLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { useAuthStore } from '@/store/auth'

const services = [
  {
    id: 'graduation-project',
    icon: GraduationCap,
    title: 'مشروع تخرج',
    description: 'إعداد ملفات مشاريع التخرج بجميع مكوناتها: المقدمة، الأهداف، UML، قاعدة البيانات، التحليل، الاختبارات والمراجع.',
    color: 'from-primary/20 to-primary/5',
    features: ['تصميم UML', 'قاعدة بيانات', 'واجهات', 'اختبارات', 'توثيق'],
  },
  {
    id: 'presentation',
    icon: Presentation,
    title: 'عرض تقديمي',
    description: 'تصميم عروض PowerPoint احترافية بألوان مخصصة وحركات انتقالية ورسوم بيانية.',
    color: 'from-accent/20 to-accent/5',
    features: ['PowerPoint + PDF', 'تصاميم مخصصة', 'رسوم بيانية', 'حركات انتقالية'],
  },
  {
    id: 'academic-task',
    icon: BookMarked,
    title: 'خدمات أكاديمية',
    description: 'المساعدة في إعداد الوظائف الجامعية: تقارير، أبحاث، دراسات حالة، مقالات، وواجبات مع التنسيق والتدقيق.',
    color: 'from-info/20 to-info/5',
    features: ['تنسيق احترافي', 'تدقيق لغوي', 'تحويل PDF', 'تصميم PowerPoint'],
  },
  {
    id: 'research-circle',
    icon: FlaskConical,
    title: 'حلقات البحث',
    description: 'مساعدة احترافية في إعداد وتنسيق ومراجعة حلقات البحث والأبحاث الأكاديمية وفق متطلبات الجامعة.',
    color: 'from-success/20 to-success/5',
    features: ['توثيق APA/MLA', 'قائمة مراجع', 'رسوم بيانية', 'ملخص عربي وإنجليزي'],
  },
]

export default function AcademicServices() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()

  const handleServiceClick = (serviceId: string) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    navigate(`/create-${serviceId}`)
  }

  return (
    <div className="pt-24 pb-20">
      <div className="container-custom">
        <div className="text-center mb-16">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">الاستوديو الأكاديمي</h1>
          <p className="text-secondary/60 max-w-2xl mx-auto text-lg">
            خدمات أكاديمية متكاملة لمساعدتك في إنجاز مشاريعك وواجباتك الجامعية باحترافية
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <div
                key={service.id}
                className="cursor-pointer group"
                onClick={() => handleServiceClick(service.id)}
              >
                <Card className="h-full hover:shadow-card-hover transition-all duration-300 group-hover:-translate-y-1">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6`}>
                      <Icon className="w-8 h-8 text-secondary" />
                    </div>
                    <h2 className="text-2xl font-bold text-secondary mb-3">{service.title}</h2>
                    <p className="text-secondary/60 leading-relaxed mb-6">{service.description}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {service.features.map((feature) => (
                        <span key={feature} className="px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-medium">
                          {feature}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                      <span>ابدأ الآن</span>
                      <ArrowLeft className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
