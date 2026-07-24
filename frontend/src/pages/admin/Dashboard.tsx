import { useState, useEffect } from 'react'
import { ShoppingBag, Users, DollarSign, Package, TrendingUp, TrendingDown, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { getDashboardStats } from '@/lib/supabase-service'

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardStats()
      .then((data) => { setStats(data); setLoading(false) })
      .catch(() => setLoading(false))
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
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-secondary mb-6">نظرة عامة</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
