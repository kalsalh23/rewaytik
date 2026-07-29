import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Eye, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { getAllAcademicOrders } from '@/lib/supabase-service'
import { formatPrice } from '@/lib/utils'

const ACADEMIC_TYPES = [
  { key: 'graduation_project', label: 'مشروع تخرج', prefix: 'GP' },
  { key: 'presentation', label: 'عرض تقديمي', prefix: 'PR' },
  { key: 'academic_task', label: 'خدمة أكاديمية', prefix: 'AT' },
  { key: 'research_circle', label: 'حلقة بحث', prefix: 'RC' },
] as const

const FILTER_TABS = [
  { key: 'all', label: 'الكل' },
  ...ACADEMIC_TYPES.map((t) => ({ key: t.key, label: t.label })),
]

const ACADEMIC_STATUS_COLORS: Record<string, string> = {
  new: 'bg-info/10 text-info border-info/20',
  under_review: 'bg-warning/10 text-warning border-warning/20',
  in_progress: 'bg-primary/10 text-primary border-primary/20',
  awaiting_client: 'bg-accent/10 text-accent-dark border-accent/20',
  revision: 'bg-warning/10 text-warning border-warning/20',
  ready: 'bg-success/10 text-success border-success/20',
  delivered: 'bg-success/10 text-success border-success/20',
  cancelled: 'bg-error/10 text-error border-error/20',
}

const ACADEMIC_STATUS_LABELS: Record<string, string> = {
  new: 'جديد',
  under_review: 'قيد المراجعة',
  in_progress: 'قيد التنفيذ',
  awaiting_client: 'بانتظار العميل',
  revision: 'تعديل',
  ready: 'جاهز',
  delivered: 'تم التسليم',
  cancelled: 'ملغي',
}

export default function AdminAcademicOrders() {
  const [allOrders, setAllOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLoading(true)
    const promises = ACADEMIC_TYPES.map((t) =>
      getAllAcademicOrders(t.key).then((data) =>
        (data || []).map((o: any) => ({ ...o, _type: t.key, _typeLabel: t.label, _prefix: t.prefix }))
      )
    )
    Promise.all(promises)
      .then((results) => {
        setAllOrders(results.flat())
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filteredByType = activeTab === 'all'
    ? allOrders
    : allOrders.filter((o) => o._type === activeTab)

  const filtered = filteredByType.filter((o) =>
    o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
    o.title?.toLowerCase().includes(search.toLowerCase()) ||
    (o.users?.name || '')?.toLowerCase().includes(search.toLowerCase())
  )

  const stats = filteredByType
  const total = stats.length
  const newCount = stats.filter((o) => o.status === 'new').length
  const inProgress = stats.filter((o) => o.status === 'under_review' || o.status === 'in_progress').length
  const completed = stats.filter((o) => o.status === 'completed' || o.status === 'delivered').length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-secondary">الطلبات الأكاديمية</h2>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pr-10 w-64" placeholder="بحث..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 overflow-x-auto">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-primary text-white'
                : 'bg-card text-secondary/70 hover:bg-accent border border-border'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-secondary/60">المجموع</p>
            <p className="text-2xl font-bold text-secondary">{total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-secondary/60">جديد</p>
            <p className="text-2xl font-bold text-info">{newCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-secondary/60">قيد التنفيذ</p>
            <p className="text-2xl font-bold text-primary">{inProgress}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-secondary/60">مكتمل</p>
            <p className="text-2xl font-bold text-success">{completed}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-secondary/60 py-10">لا توجد طلبات</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-right py-3 px-4 font-medium text-secondary/60">رقم الطلب</th>
                    <th className="text-right py-3 px-4 font-medium text-secondary/60">العنوان</th>
                    <th className="text-right py-3 px-4 font-medium text-secondary/60">النوع</th>
                    <th className="text-right py-3 px-4 font-medium text-secondary/60">اسم المستخدم</th>
                    <th className="text-right py-3 px-4 font-medium text-secondary/60">الحالة</th>
                    <th className="text-right py-3 px-4 font-medium text-secondary/60">التاريخ</th>
                    <th className="text-right py-3 px-4 font-medium text-secondary/60">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order) => (
                    <tr key={`${order._type}-${order.id}`} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                      <td className="py-3 px-4 font-medium">{order.order_number}</td>
                      <td className="py-3 px-4 max-w-[200px] truncate">{order.title || '-'}</td>
                      <td className="py-3 px-4">
                        <Badge variant="info">{order._typeLabel}</Badge>
                      </td>
                      <td className="py-3 px-4">{order.users?.name || '-'}</td>
                      <td className="py-3 px-4">
                        <Badge variant="info" className={ACADEMIC_STATUS_COLORS[order.status] || ''}>
                          {ACADEMIC_STATUS_LABELS[order.status] || order.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-secondary/60">{new Date(order.created_at).toLocaleDateString('ar-SA')}</td>
                      <td className="py-3 px-4">
                        <Link to={`/admin/academic-order/${order._type}/${order.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
