import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2, FileText, GraduationCap, Presentation, Search, Wallet, Eye } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import { getAcademicOrder } from '@/lib/supabase-service'

const serviceLabels: Record<string, string> = {
  graduation_project: 'مشروع تخرج',
  presentation: 'عرض تقديمي',
  academic_task: 'خدمة أكاديمية',
  research_circle: 'حلقة بحث',
}

const statusLabels: Record<string, string> = {
  new: 'جديد', under_review: 'قيد المراجعة', in_progress: 'قيد التنفيذ',
  completed: 'مكتمل', delivered: 'تم التسليم', cancelled: 'ملغي',
}

const statusColors: Record<string, string> = {
  new: 'bg-info/10 text-info', under_review: 'bg-warning/10 text-warning',
  in_progress: 'bg-primary/10 text-primary', completed: 'bg-success/10 text-success',
  delivered: 'bg-success/10 text-success', cancelled: 'bg-error/10 text-error',
}

const paymentLabels: Record<string, string> = {
  pending: 'بانتظار الدفع', reviewing: 'قيد المراجعة', approved: 'تم الدفع', rejected: 'مرفوض',
}

const serviceIcons: Record<string, any> = {
  graduation_project: GraduationCap, presentation: Presentation,
  academic_task: FileText, research_circle: Search,
}

export default function AcademicOrderDetail() {
  const { type, id } = useParams<{ type: string; id: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!type || !id) return
    setLoading(true)
    getAcademicOrder(type, id)
      .then(setOrder)
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [type, id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-secondary">الطلب غير موجود</h2>
          <Link to="/my-academic-orders" className="text-primary hover:underline mt-2 inline-block">العودة للطلبات</Link>
        </div>
      </div>
    )
  }

  const Icon = serviceIcons[type || ''] || FileText
  const title = order.project_title || order.research_title || order.course_name || 'طلب'

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate('/my-academic-orders')} className="inline-flex items-center gap-2 text-sm text-secondary/60 hover:text-primary mb-6 transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          العودة للطلبات
        </button>

        <Card>
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center">
                <Icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-secondary">{title}</h1>
                <p className="text-secondary/60">{serviceLabels[type || ''] || type}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-accent/30">
                <p className="text-sm text-secondary/60">رقم الطلب</p>
                <p className="font-semibold text-secondary mt-1">{order.order_number}</p>
              </div>
              <div className="p-4 rounded-xl bg-accent/30">
                <p className="text-sm text-secondary/60">تاريخ الطلب</p>
                <p className="font-semibold text-secondary mt-1">{formatDate(new Date(order.created_at))}</p>
              </div>
              <div className="p-4 rounded-xl bg-accent/30">
                <p className="text-sm text-secondary/60">حالة الطلب</p>
                <Badge variant="info" className={statusColors[order.status] || ''}>{statusLabels[order.status] || order.status}</Badge>
              </div>
              <div className="p-4 rounded-xl bg-accent/30">
                <p className="text-sm text-secondary/60">حالة الدفع</p>
                <Badge variant="info" className={order.payment_status === 'approved' ? 'bg-success/10 text-success' : order.payment_status === 'reviewing' ? 'bg-warning/10 text-warning' : order.payment_status === 'rejected' ? 'bg-error/10 text-error' : 'bg-secondary/10 text-secondary'}>{paymentLabels[order.payment_status] || order.payment_status}</Badge>
              </div>
            </div>

            {order.payment_status === 'pending' && (
              <Link to={`/academic-payment/${type}/${id}`}>
                <Button className="w-full" size="lg">
                  <Wallet className="w-5 h-5 ml-2" />
                  إتمام الدفع
                </Button>
              </Link>
            )}

            {order.files && order.files.length > 0 && (
              <div className="mt-8">
                <h3 className="font-semibold text-secondary mb-4">الملفات المرفوعة</h3>
                <div className="space-y-2">
                  {order.files.map((f: any, i: number) => (
                    <a key={i} href={f.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-accent/30 hover:bg-accent/50 transition-colors">
                      <Eye className="w-4 h-4 text-primary" />
                      <span className="text-sm text-secondary">{f.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
