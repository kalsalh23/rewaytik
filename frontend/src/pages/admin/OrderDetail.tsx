import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, X, FileText, Download, Printer, Truck, User, Image as ImageIcon, MessageSquare, MapPin, Loader2, Trash2, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Textarea } from '@/components/ui/Textarea'
import { getStatusColor, getStatusLabel, formatPrice } from '@/lib/utils'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { getOrder, updateOrderStatus, archiveOrder, approveOrder } from '@/lib/supabase-service'

const statusActions = ['pending_payment', 'pending_approval', 'pending_review', 'writing', 'story_ready', 'printing', 'printed', 'shipped', 'delivered']

export default function AdminOrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [rejectionModal, setRejectionModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [deleteModal, setDeleteModal] = useState(false)
  const [showPaymentProof, setShowPaymentProof] = useState(false)

  useEffect(() => {
    if (!id) return
    getOrder(id)
      .then((data) => { setOrder(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  const acceptPayment = async () => {
    if (!id) return
    await updateOrderStatus(id, 'pending_review')
    setOrder({ ...order, status: 'pending_review' })
    toast.success('تم قبول الدفع')
  }

  const rejectPayment = async () => {
    if (!rejectionReason.trim()) { toast.error('يرجى كتابة سبب الرفض'); return }
    if (!id) return
    await updateOrderStatus(id, 'rejected')
    setOrder({ ...order, status: 'rejected', rejectionReason })
    setRejectionModal(false)
    toast.success('تم رفض الدفع')
  }

  const updateStatus = async (status: string) => {
    if (!id) return
    await updateOrderStatus(id, status)
    setOrder({ ...order, status })
    toast.success(`تم تحديث الحالة إلى: ${getStatusLabel(status)}`)
  }

  const handleDelete = async () => {
    if (!id) return
    try {
      await archiveOrder(id)
      toast.success('تم أرشفة الطلب')
      navigate('/admin/orders')
    } catch {
      toast.error('فشل أرشفة الطلب')
    }
    setDeleteModal(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (!order) {
    return <p className="text-center text-secondary/60 py-10">الطلب غير موجود</p>
  }

  const detail = order.detail || {}
  const currentStatus = order.status
  const currentStatusIndex = statusActions.indexOf(currentStatus)
  const canMoveForward = currentStatusIndex < statusActions.length - 1
  const canMoveBackward = currentStatusIndex > 0
  const canDelete = true
  const canApprove = currentStatus === 'pending_review' || currentStatus === 'pending_approval'

  return (
    <div>
      <Link to="/admin/orders" className="inline-flex items-center gap-2 text-sm text-secondary/60 hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        العودة للطلبات
      </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-secondary">تفاصيل الطلب</h2>
            <p className="text-secondary/60 mt-1">رقم الطلب: {order.orderNumber}</p>
            <p className="text-sm text-primary font-medium mt-1">{order.bookTypeName}</p>
          </div>
          <div className="flex items-center gap-2">
            {canApprove && (
              <Button size="sm" variant="success" onClick={() => {
                approveOrder(id!)
                setOrder({ ...order, status: 'writing' })
                toast.success('تمت الموافقة على الطلب')
              }}>
                <Check className="w-4 h-4 ml-1" />
                موافقة
              </Button>
            )}
            {canDelete && (
              <Button variant="danger" size="sm" onClick={() => setDeleteModal(true)}>
                <Trash2 className="w-4 h-4 ml-1" />
                حذف الطلب
              </Button>
            )}
            <Badge variant="info" className={getStatusColor(currentStatus)}>
              {getStatusLabel(currentStatus)}
            </Badge>
          </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                معلومات الشخصية
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-sm text-secondary/60">الاسم</span><p className="font-medium">{detail.characterName}</p></div>
                {detail.age != null && <div><span className="text-sm text-secondary/60">العمر</span><p className="font-medium">{detail.age} سنوات</p></div>}
                <div><span className="text-sm text-secondary/60">الجنسية</span><p className="font-medium">{detail.nationality}</p></div>

                {detail.eyeColor && <div><span className="text-sm text-secondary/60">لون العيون</span><p className="font-medium">{detail.eyeColor}</p></div>}
                {detail.hairColor && <div><span className="text-sm text-secondary/60">لون الشعر</span><p className="font-medium">{detail.hairColor}</p></div>}
                {detail.height && <div><span className="text-sm text-secondary/60">الطول</span><p className="font-medium">{detail.height}</p></div>}
                {detail.skinTone && <div><span className="text-sm text-secondary/60">لون البشرة</span><p className="font-medium">{detail.skinTone}</p></div>}
                {detail.build && <div><span className="text-sm text-secondary/60">البنية</span><p className="font-medium">{detail.build}</p></div>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-secondary mb-4">الهوايات والصفات</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-secondary/60 block mb-2">الهوايات</span>
                  <div className="flex flex-wrap gap-2">
                    {(detail.hobbies || []).map((h: string) => <span key={h} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">{h}</span>)}
                    {(!detail.hobbies || detail.hobbies.length === 0) && <span className="text-sm text-secondary/40">لا توجد</span>}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-secondary/60 block mb-2">الصفات</span>
                  <div className="flex flex-wrap gap-2">
                    {(detail.qualities || []).map((q: string) => <span key={q} className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm">{q}</span>)}
                    {(!detail.qualities || detail.qualities.length === 0) && <span className="text-sm text-secondary/40">لا توجد</span>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {detail.images && detail.images.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  الصور
                </h3>
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

          {detail.characterImages && detail.characterImages.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  صور الشخصيات المساعدة
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                  {detail.characterImages.map((img: string, i: number) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden border border-border">
                      <img src={img} alt={`شخصية ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {detail.memories && detail.memories.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  الذكريات
                </h3>
                <div className="space-y-2">
                  {detail.memories.map((m: string, i: number) => (
                    <p key={i} className="text-sm text-secondary/80 bg-accent/30 p-3 rounded-lg">{m}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {(detail.storyType || detail.storyGoal) && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  تفاصيل القصة
                </h3>
                <div className="space-y-3">
                  <div><span className="text-sm text-secondary/60">نوع القصة</span><p className="font-medium">{detail.storyType}</p></div>
                  <div><span className="text-sm text-secondary/60">هدف القصة</span><p className="font-medium">{detail.storyGoal}</p></div>
                </div>
              </CardContent>
            </Card>
          )}

          {detail.clientMessage && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  رسالة العميل
                </h3>
                <p className="text-sm text-secondary/80 bg-accent/30 p-4 rounded-lg">{detail.clientMessage}</p>
              </CardContent>
            </Card>
          )}

          {currentStatus === 'pending_review' && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-secondary mb-4">إدارة الدفع</h3>
                <div className="flex gap-3">
                  <Button onClick={acceptPayment}>
                    <Check className="w-4 h-4 ml-1" />
                    قبول الدفع
                  </Button>
                  <Button variant="danger" onClick={() => setRejectionModal(true)}>
                    <X className="w-4 h-4 ml-1" />
                    رفض الدفع
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-secondary mb-4">معلومات الطلب</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-secondary/60">رقم الطلب</span>
                  <span className="font-medium">{order.orderNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-secondary/60">نوع الكتاب</span>
                  <span className="font-medium">{order.bookTypeName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-secondary/60">المبلغ</span>
                  <span className="font-bold text-primary">{formatPrice(order.totalAmount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-secondary/60">الحالة</span>
                  <Badge variant="info" className={getStatusColor(currentStatus)}>{getStatusLabel(currentStatus)}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-secondary/60">تاريخ الإنشاء</span>
                  <span className="text-secondary/60">{new Date(order.createdAt).toLocaleDateString('ar-SA')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {detail.paymentNotificationUrl && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  إشعار الدفع
                </h3>
                <div
                  className="aspect-[4/3] rounded-xl overflow-hidden border border-border cursor-pointer bg-accent/20"
                  onClick={() => setShowPaymentProof(true)}
                >
                  <img
                    src={detail.paymentNotificationUrl}
                    alt="إشعار الدفع"
                    className="w-full h-full object-contain"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {detail.shippingAddress && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  عنوان الشحن
                </h3>
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
              <h3 className="text-lg font-semibold text-secondary mb-4">تحديث حالة الطلب</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">الحالة الحالية:</span>
                  <Badge variant="info" className={getStatusColor(currentStatus)}>{getStatusLabel(currentStatus)}</Badge>
                </div>
                <div className="flex gap-2 pt-4">
                  {canMoveBackward && (
                    <Button variant="outline" size="sm" onClick={() => updateStatus(statusActions[currentStatusIndex - 1])}>
                      السابقة
                    </Button>
                  )}
                  {canMoveForward && (
                    <Button size="sm" onClick={() => updateStatus(statusActions[currentStatusIndex + 1])}>
                      الحالة التالية
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Modal isOpen={rejectionModal} onClose={() => setRejectionModal(false)} title="رفض الدفع">
        <div className="space-y-4">
          <p className="text-sm text-secondary/60">يرجى كتابة سبب رفض الدفع</p>
          <Textarea placeholder="سبب الرفض..." value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} />
          <div className="flex gap-3">
            <Button variant="danger" onClick={rejectPayment}>تأكيد الرفض</Button>
            <Button variant="outline" onClick={() => setRejectionModal(false)}>إلغاء</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="حذف الطلب">
        <div className="space-y-4">
          <p className="text-sm text-secondary/60">سيتم أرشفة هذا الطلب ولن يظهر في لوحة التحكم. هل أنت متأكد؟</p>
          <div className="flex gap-3">
            <Button variant="danger" onClick={handleDelete}>تأكيد الحذف</Button>
            <Button variant="outline" onClick={() => setDeleteModal(false)}>إلغاء</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showPaymentProof} onClose={() => setShowPaymentProof(false)} title="إشعار الدفع">
        {detail.paymentNotificationUrl && (
          <div className="flex items-center justify-center">
            <img src={detail.paymentNotificationUrl} alt="إشعار الدفع" className="max-w-full max-h-[70vh] rounded-xl" />
          </div>
        )}
      </Modal>
    </div>
  )
}
