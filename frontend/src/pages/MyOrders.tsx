import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, Eye, ArrowLeft, Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { getStatusColor, getStatusLabel, formatPrice, formatDate } from '@/lib/utils'
import { getMyOrders } from '@/lib/supabase-service'

export default function MyOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = () => {
    setLoading(true)
    getMyOrders()
      .then((data) => setOrders(data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <div className="pt-24 pb-20">
      <div className="container-custom max-w-4xl">
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link to="/profile" className="inline-flex items-center gap-2 text-sm text-secondary/60 hover:text-primary mb-2 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                العودة للحساب
              </Link>
              <h1 className="text-3xl font-bold text-secondary">طلباتي</h1>
            </div>
            <Link to="/create-order">
              <Button>
                <Plus className="w-4 h-4 ml-2" />
                طلب جديد
              </Button>
            </Link>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          )}

          {!loading && orders.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-secondary mb-2">لا توجد طلبات بعد</h2>
              <p className="text-secondary/60 mb-6">ابدأ رحلتك معنا وأنشئ أول كتاب لك</p>
              <Link to="/create-order">
                <Button size="lg">اطلب كتابك الآن</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {!loading && orders.map((order: any) => (
                <div key={order.id}>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                            <Package className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-semibold text-secondary">{order.bookTypeName}</h3>
                              <span className="text-xs text-muted-foreground">{order.orderNumber}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-secondary/60">
                              <span>{formatDate(new Date(order.createdAt))}</span>
                              <span>•</span>
                              <span>{formatPrice(order.totalAmount)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="info" className={getStatusColor(order.status)}>
                            {getStatusLabel(order.status)}
                          </Badge>
                          <Link to={`/order/${order.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 ml-1" />
                              التفاصيل
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
