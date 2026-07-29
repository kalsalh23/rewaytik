import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, FileText, Presentation, Search, BookOpen, Eye, ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import { getMyAcademicOrders } from '@/lib/supabase-service'

type ServiceType = 'graduation_project' | 'presentation' | 'academic_task' | 'research_circle'

interface AcademicOrder {
  id: string
  order_number: string
  title: string
  status: string
  created_at: string
  [key: string]: any
}

const TABS: { key: 'all' | ServiceType; label: string; icon: React.ReactNode }[] = [
  { key: 'all', label: 'الكل', icon: <BookOpen className="w-4 h-4" /> },
  { key: 'graduation_project', label: 'مشروع تخرج', icon: <GraduationCap className="w-4 h-4" /> },
  { key: 'presentation', label: 'عرض تقديمي', icon: <Presentation className="w-4 h-4" /> },
  { key: 'academic_task', label: 'خدمة أكاديمية', icon: <FileText className="w-4 h-4" /> },
  { key: 'research_circle', label: 'حلقة بحث', icon: <Search className="w-4 h-4" /> },
]

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-info/10 text-info border-info/20',
  under_review: 'bg-warning/10 text-warning border-warning/20',
  in_progress: 'bg-primary/10 text-primary border-primary/20',
  completed: 'bg-success/10 text-success border-success/20',
  delivered: 'bg-success/10 text-success border-success/20',
  cancelled: 'bg-error/10 text-error border-error/20',
}

const STATUS_LABELS: Record<string, string> = {
  new: 'جديد',
  under_review: 'قيد المراجعة',
  in_progress: 'جاري العمل',
  completed: 'مكتمل',
  delivered: 'تم التسليم',
  cancelled: 'ملغي',
}

export default function MyAcademicOrders() {
  const [activeTab, setActiveTab] = useState<'all' | ServiceType>('all')
  const [orders, setOrders] = useState<AcademicOrder[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = (tab: 'all' | ServiceType) => {
    setLoading(true)
    if (tab === 'all') {
      const types: ServiceType[] = ['graduation_project', 'presentation', 'academic_task', 'research_circle']
      Promise.all(types.map((t) => getMyAcademicOrders(t).then((data) => (data || []).map((o: any) => ({ ...o, _serviceType: t })))))
        .then((results) => {
          const all = results.flat().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          setOrders(all)
        })
        .catch(() => setOrders([]))
        .finally(() => setLoading(false))
    } else {
      getMyAcademicOrders(tab)
        .then((data) => setOrders((data || []).map((o: any) => ({ ...o, _serviceType: tab }))))
        .catch(() => setOrders([]))
        .finally(() => setLoading(false))
    }
  }

  useEffect(() => {
    fetchOrders(activeTab)
  }, [activeTab])

  const getTitle = (order: AcademicOrder) => {
    return order.title || order.project_title || order.topic || 'بدون عنوان'
  }

  const getServiceTypeLabel = (type: ServiceType) => {
    const labels: Record<ServiceType, string> = {
      graduation_project: 'مشروع تخرج',
      presentation: 'عرض تقديمي',
      academic_task: 'خدمة أكاديمية',
      research_circle: 'حلقة بحث',
    }
    return labels[type] || type
  }

  return (
    <div className="pt-24 pb-20">
      <div className="container-custom max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/profile" className="inline-flex items-center gap-2 text-sm text-secondary/60 hover:text-primary mb-2 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              العودة للحساب
            </Link>
            <h1 className="text-3xl font-bold text-secondary">🎓 طلباتي الأكاديمية</h1>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-white/50 text-secondary/60 hover:bg-white hover:text-secondary'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        {!loading && orders.length === 0 ? (
          <div className="text-center py-20">
            <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-secondary mb-2">لا توجد طلبات أكاديمية بعد</h2>
            <p className="text-secondary/60 mb-6">ابدأ بطلب خدمة أكاديمية جديدة</p>
            <Link to="/academic-services">
              <Button size="lg">🎓 اطلب خدمة أكاديمية</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                        {order._serviceType === 'graduation_project' && <GraduationCap className="w-5 h-5 text-white" />}
                        {order._serviceType === 'presentation' && <Presentation className="w-5 h-5 text-white" />}
                        {order._serviceType === 'academic_task' && <FileText className="w-5 h-5 text-white" />}
                        {order._serviceType === 'research_circle' && <Search className="w-5 h-5 text-white" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-secondary">{getTitle(order)}</h3>
                          <span className="text-xs text-muted-foreground">{order.order_number}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-secondary/60">
                          <span>{formatDate(new Date(order.created_at))}</span>
                          <span>•</span>
                          <span>{getServiceTypeLabel(order._serviceType)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="info" className={STATUS_COLORS[order.status] || ''}>
                        {STATUS_LABELS[order.status] || order.status}
                      </Badge>
                      <Link to={`/academic-order/${order._serviceType}/${order.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 ml-1" />
                          التفاصيل
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
