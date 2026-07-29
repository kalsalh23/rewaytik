import { useState, useEffect } from 'react'
import { ShoppingBag, Users, DollarSign, Package, TrendingUp, TrendingDown, Loader2, FileText, GraduationCap, Presentation, BookMarked, FlaskConical } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { getDashboardStats, getManuscriptStats, getAcademicStats } from '@/lib/supabase-service'

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [manuscriptStats, setManuscriptStats] = useState<any>(null)
  const [academicStats, setAcademicStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getDashboardStats().catch(() => null),
      getManuscriptStats().catch(() => null),
      getAcademicStats().catch(() => null),
    ]).then(([orderData, msData, acData]) => {
      setStats(orderData)
      setManuscriptStats(msData)
      setAcademicStats(acData)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (!stats) {
    return <p className="text-secondary/60">فشل تحميل البيانات</p>
  }

  const cards = [
    { title: 'إجمالي الطلبات', value: stats.totalOrders, icon: ShoppingBag, color: 'from-primary/20 to-primary/5' },
    { title: 'العملاء', value: stats.totalCustomers, icon: Users, color: 'from-primary/10 to-accent/10' },
    { title: 'الإيرادات', value: `${stats.totalRevenue.toLocaleString('ar-SA')} ل.س`, icon: DollarSign, color: 'from-primary/10 to-primary/5' },
    { title: 'بانتظار المراجعة', value: stats.pendingReview, icon: Package, color: 'from-accent/10 to-accent/5' },
    { title: 'طلبات المخطوطات', value: manuscriptStats?.total || 0, icon: FileText, color: 'from-info/10 to-info/5' },
    { title: 'مشاريع التخرج', value: academicStats?.graduation_project?.total || 0, icon: GraduationCap, color: 'from-success/10 to-success/5' },
    { title: 'العروض التقديمية', value: academicStats?.presentation?.total || 0, icon: Presentation, color: 'from-warning/10 to-warning/5' },
    { title: 'الخدمات الأكاديمية', value: academicStats?.academic_task?.total || 0, icon: BookMarked, color: 'from-primary/10 to-primary/5' },
    { title: 'حلقات البحث', value: academicStats?.research_circle?.total || 0, icon: FlaskConical, color: 'from-accent/10 to-accent/5' },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-secondary mb-6">نظرة عامة</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.title}>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-secondary/60 mb-1">{card.title}</p>
                      <p className="text-2xl font-bold text-secondary">{card.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-secondary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}
