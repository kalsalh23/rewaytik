import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Package, MapPin, User, Image as ImageIcon, MessageSquare, Clock, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { getStatusColor, getStatusLabel, formatPrice, formatDate } from '@/lib/utils'
import { getOrder } from '@/lib/supabase-service'

export default function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchOrder = () => {
    if (!id) return
    getOrder(id)
      .then((data) => setOrder(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchOrder()
  }, [id])

  if (loading) {
    return (
      <div className="pt-24 pb-20 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="pt-24 pb-20 text-center">
        <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-secondary mb-2">الطلب غير موجود</h2>
        <Link to="/my-orders" className="text-primary hover:underline">العودة للطلبات</Link>
      </div>
    )
  }

  const detail = order.detail || {}
  const timeline = detail.timeline || []

  return (
    <div className="pt-24 pb-20">
      <div className="container-custom max-w-4xl">
        <div>
          <Link to="/my-orders" className="inline-flex items-center gap-2 text-sm text-secondary/60 hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            العودة للطلبات
          </Link>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-secondary">تفاصيل الطلب</h1>
              <p className="text-secondary/60 mt-1">رقم الطلب: {order.orderNumber}</p>
            </div>
            <Badge variant="info" className={getStatusColor(order.status)}>
              {getStatusLabel(order.status)}
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    معلومات الشخصية
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-secondary/60">الاسم</span>
                      <p className="font-medium">{detail.characterName}</p>
                    </div>
                    {detail.age != null && (
                      <div>
                        <span className="text-sm text-secondary/60">العمر</span>
                        <p className="font-medium">{detail.age} سنوات</p>
                      </div>
                    )}
                    <div>
                      <span className="text-sm text-secondary/60">الجنسية</span>
                      <p className="font-medium">{detail.nationality}</p>
                    </div>
                    <div>
                      <span className="text-sm text-secondary/60">نوع القصة</span>
                      <p className="font-medium">{detail.storyType}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-sm text-secondary/60">هدف القصة</span>
                      <p className="font-medium">{detail.storyGoal}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-secondary mb-4">الهوايات والصفات</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <span className="text-sm text-secondary/60 block mb-2">الهوايات</span>
                      <div className="flex flex-wrap gap-2">
                        {(detail.hobbies || []).map((h: string) => (
                          <span key={h} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">{h}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-secondary/60 block mb-2">الصفات</span>
                      <div className="flex flex-wrap gap-2">
                        {(detail.qualities || []).map((q: string) => (
                          <span key={q} className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm">{q}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    الذكريات ورسالة العميل
                  </h2>
                  <div className="space-y-4">
                    {detail.memories && detail.memories.length > 0 && (
                      <div>
                        <span className="text-sm text-secondary/60 block mb-2">الذكريات</span>
                        <ul className="space-y-2">
                          {detail.memories.map((m: string, i: number) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                              {m}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {detail.clientMessage && (
                      <div className="pt-4 border-t border-border">
                        <span className="text-sm text-secondary/60 block mb-2">رسالة العميل</span>
                        <p className="text-sm text-secondary/80 bg-accent/30 p-4 rounded-lg">{detail.clientMessage}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {detail.images && detail.images.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-primary" />
                      الصور ({detail.images.length})
                    </h2>
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                      {detail.images.map((img: string, i: number) => (
                        <div key={i} className="aspect-square rounded-xl overflow-hidden border border-border">
                          <img src={img} alt={`صورة ${i + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              {detail.shippingAddress && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      عنوان الشحن
                    </h2>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-secondary/60">الاسم:</span> {detail.shippingAddress.fullName}</p>
                      <p><span className="text-secondary/60">الهاتف:</span> {detail.shippingAddress.phone}</p>
                      <p><span className="text-secondary/60">المدينة:</span> {detail.shippingAddress.city}</p>
                      <p><span className="text-secondary/60">الحي:</span> {detail.shippingAddress.district}</p>
                      {detail.shippingAddress.street && <p><span className="text-secondary/60">الشارع:</span> {detail.shippingAddress.street}</p>}
                      {detail.shippingAddress.buildingNumber && <p><span className="text-secondary/60">رقم المبنى:</span> {detail.shippingAddress.buildingNumber}</p>}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    تتبع الطلب
                  </h2>
                  <div className="space-y-4">
                    {timeline.map((t: any, i: number) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full ${i === timeline.length - 1 ? 'bg-primary' : 'bg-border'}`} />
                          {i < timeline.length - 1 && <div className="w-0.5 flex-1 bg-border my-1" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{getStatusLabel(t.status)}</p>
                          <p className="text-xs text-secondary/60">{formatDate(new Date(t.date))}</p>
                          {t.note && <p className="text-xs text-secondary/60 mt-0.5">{t.note}</p>}
                        </div>
                      </div>
                    ))}
                    {timeline.length === 0 && (
                      <p className="text-sm text-secondary/60">لا يوجد تتبع بعد</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
