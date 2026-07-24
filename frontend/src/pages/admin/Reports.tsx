import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, Loader2 } from 'lucide-react'
import { getReports } from '@/lib/supabase-service'

const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']

export default function AdminReports() {
  const [reports, setReports] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getReports()
      .then((data) => { setReports(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  const monthly = reports?.monthlyOrders || []
  const totalRevenue = monthly.reduce((sum: number, m: any) => sum + m.revenue, 0)
  const totalOrders = monthly.reduce((sum: number, m: any) => sum + m.count, 0)
  const avgOrder = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0

  return (
    <div>
      <h2 className="text-2xl font-bold text-secondary mb-6">التقارير</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-secondary/60 mb-1">إجمالي الإيرادات</p>
                <p className="text-xl font-bold text-secondary">{totalRevenue.toLocaleString('ar-SA')} ل.س</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-secondary/60 mb-1">إجمالي الطلبات</p>
                <p className="text-xl font-bold text-secondary">{totalOrders}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-secondary/60 mb-1">متوسط قيمة الطلب</p>
                <p className="text-xl font-bold text-secondary">{avgOrder.toLocaleString('ar-SA')} ل.س</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-secondary/60 mb-1">عدد الأشهر النشطة</p>
                <p className="text-xl font-bold text-secondary">{monthly.length}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {monthly.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-secondary mb-4">الطلبات الشهرية</h3>
            <div className="space-y-3">
              {monthly.map((m: any) => (
                <div key={`${m.year}-${m.month}`} className="flex items-center gap-4 p-3 rounded-lg bg-accent/30">
                  <span className="text-sm font-medium w-24">{monthNames[m.month - 1]} {m.year}</span>
                  <div className="flex-1 bg-border rounded-full h-3 overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${(m.count / totalOrders) * 100}%` }} />
                  </div>
                  <span className="text-sm text-secondary/60">{m.count} طلب</span>
                  <span className="text-sm font-medium">{m.revenue.toLocaleString('ar-SA')} ل.س</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {monthly.length === 0 && (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-secondary/60 py-10">لا توجد بيانات تقارير</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
