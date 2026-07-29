import { useState, useEffect, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, User, FileText, Download, Loader2, Trash2, CreditCard, Upload, MessageSquare, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Textarea } from '@/components/ui/Textarea'
import { Modal } from '@/components/ui/Modal'
import { toast } from 'react-hot-toast'
import {
  getAcademicOrder,
  updateAcademicOrderStatus,
  updateAcademicInternalNotes,
  uploadAcademicFinalFile,
  archiveAcademicOrder,
  updateAcademicPaymentStatus,
} from '@/lib/supabase-service'
import { formatPrice } from '@/lib/utils'

const ACADEMIC_STATUS_LABELS: Record<string, string> = {
  new: 'جديد',
  under_review: 'قيد المراجعة',
  in_progress: 'قيد التنفيذ',
  completed: 'مكتمل',
  delivered: 'تم التسليم',
  cancelled: 'ملغي',
}

const ACADEMIC_STATUS_COLORS: Record<string, string> = {
  new: 'bg-info/10 text-info border-info/20',
  under_review: 'bg-warning/10 text-warning border-warning/20',
  in_progress: 'bg-primary/10 text-primary border-primary/20',
  completed: 'bg-success/10 text-success border-success/20',
  delivered: 'bg-success/10 text-success border-success/20',
  cancelled: 'bg-error/10 text-error border-error/20',
}

const STATUS_OPTIONS = ['new', 'under_review', 'in_progress', 'completed', 'delivered', 'cancelled']

const TYPE_LABELS: Record<string, string> = {
  graduation_project: 'مشروع تخرج',
  presentation: 'عرض تقديمي',
  academic_task: 'خدمة أكاديمية',
  research_circle: 'حلقة بحث',
}

export default function AdminAcademicOrderDetail() {
  const { type, id } = useParams()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [internalNotes, setInternalNotes] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [showPaymentProof, setShowPaymentProof] = useState(false)

  useEffect(() => {
    if (!type || !id) return
    loadOrder()
  }, [type, id])

  const loadOrder = () => {
    setLoading(true)
    getAcademicOrder(type!, id!)
      .then((data) => {
        setOrder(data)
        setNewStatus(data.status || 'new')
        setInternalNotes(data.internal_notes || '')
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  const handleStatusUpdate = async () => {
    if (!type || !id || !newStatus || newStatus === order.status) return
    setUpdating(true)
    try {
      await updateAcademicOrderStatus(type, id, newStatus)
      setOrder({ ...order, status: newStatus })
      toast.success(`تم تحديث الحالة إلى: ${ACADEMIC_STATUS_LABELS[newStatus] || newStatus}`)
    } catch {
      toast.error('فشل تحديث الحالة')
    }
    setUpdating(false)
  }

  const handleSaveNotes = async () => {
    if (!type || !id) return
    setSavingNotes(true)
    try {
      await updateAcademicInternalNotes(type, id, internalNotes)
      setOrder({ ...order, internal_notes: internalNotes })
      toast.success('تم حفظ الملاحظات')
    } catch {
      toast.error('فشل حفظ الملاحظات')
    }
    setSavingNotes(false)
  }

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !type || !id) return
    setUploading(true)
    try {
      const url = await uploadAcademicFinalFile(type, id, file, order.user_id)
      setOrder({ ...order, final_file_url: url })
      toast.success('تم رفع الملف النهائي')
    } catch {
      toast.error('فشل رفع الملف')
    }
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDelete = async () => {
    if (!type || !id) return
    try {
      await archiveAcademicOrder(type, id)
      toast.success('تم أرشفة الطلب')
      navigate('/admin/academic-orders')
    } catch {
      toast.error('فشل أرشفة الطلب')
    }
    setDeleteModal(false)
  }

  const handlePaymentAction = async (action: 'approved' | 'rejected') => {
    if (!type || !id) return
    try {
      await updateAcademicPaymentStatus(type, id, action)
      setOrder({ ...order, payment_status: action })
      if (action === 'approved') setOrder((prev: any) => ({ ...prev, status: 'under_review' }))
      toast.success(action === 'approved' ? 'تم قبول الدفع' : 'تم رفض الدفع')
    } catch {
      toast.error('فشل تحديث حالة الدفع')
    }
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

  const timeline = order.timeline || []

  return (
    <div>
      <Link to="/admin/academic-orders" className="inline-flex items-center gap-2 text-sm text-secondary/60 hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        العودة للطلبات الأكاديمية
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-secondary">تفاصيل الطلب</h2>
          <p className="text-secondary/60 mt-1">رقم الطلب: {order.order_number}</p>
          <p className="text-sm text-primary font-medium mt-1">{TYPE_LABELS[type || ''] || type}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="danger" size="sm" onClick={() => setDeleteModal(true)}>
            <Trash2 className="w-4 h-4 ml-1" />
            حذف الطلب
          </Button>
          <Badge variant="info" className={ACADEMIC_STATUS_COLORS[order.status] || ''}>
            {ACADEMIC_STATUS_LABELS[order.status] || order.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                معلومات الطلب
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {order.title && (
                  <div className="col-span-2">
                    <span className="text-sm text-secondary/60">العنوان</span>
                    <p className="font-medium">{order.title}</p>
                  </div>
                )}
                {order.description && (
                  <div className="col-span-2">
                    <span className="text-sm text-secondary/60">الوصف</span>
                    <p className="text-sm text-secondary/80 bg-accent/30 p-3 rounded-lg mt-1">{order.description}</p>
                  </div>
                )}
                {order.subject && (
                  <div>
                    <span className="text-sm text-secondary/60">المادة</span>
                    <p className="font-medium">{order.subject}</p>
                  </div>
                )}
                {order.university && (
                  <div>
                    <span className="text-sm text-secondary/60">الجامعة</span>
                    <p className="font-medium">{order.university}</p>
                  </div>
                )}
                {order.major && (
                  <div>
                    <span className="text-sm text-secondary/60">التخصص</span>
                    <p className="font-medium">{order.major}</p>
                  </div>
                )}
                {order.slide_count && (
                  <div>
                    <span className="text-sm text-secondary/60">عدد الشرائح</span>
                    <p className="font-medium">{order.slide_count}</p>
                  </div>
                )}
                {order.word_count && (
                  <div>
                    <span className="text-sm text-secondary/60">عدد الكلمات</span>
                    <p className="font-medium">{order.word_count}</p>
                  </div>
                )}
                {order.page_count && (
                  <div>
                    <span className="text-sm text-secondary/60">عدد الصفحات</span>
                    <p className="font-medium">{order.page_count}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                ملاحظات داخلية
              </h3>
              <Textarea
                placeholder="أضف ملاحظات داخلية..."
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
              />
              <Button
                size="sm"
                className="mt-3"
                onClick={handleSaveNotes}
                disabled={savingNotes}
              >
                {savingNotes && <Loader2 className="w-4 h-4 ml-1 animate-spin" />}
                حفظ الملاحظات
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                الملف النهائي
              </h3>
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                  className="hidden"
                  onChange={handleUploadFile}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 ml-1 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 ml-1" />
                  )}
                  رفع ملف نهائي
                </Button>
                {order.final_file_url && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/30">
                    <FileText className="w-4 h-4 text-primary" />
                    <a href={order.final_file_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex-1">
                      عرض الملف النهائي
                    </a>
                    <a href={order.final_file_url} download>
                      <Download className="w-4 h-4 text-secondary/60 hover:text-primary" />
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {order.attachments && order.attachments.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  المرفقات
                </h3>
                <div className="space-y-2">
                  {order.attachments.map((att: any, i: number) => (
                    <div key={att.id || i} className="flex items-center gap-2 p-3 rounded-lg bg-accent/30">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="text-sm flex-1">{att.file_name}</span>
                      <a href={att.file_url} target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4 text-secondary/60 hover:text-primary" />
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {order.payment_status === 'reviewing' && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-secondary mb-4">مراجعة الدفع</h3>
                <div className="flex gap-3">
                  <Button onClick={() => handlePaymentAction('approved')}>
                    قبول الدفع
                  </Button>
                  <Button variant="danger" onClick={() => handlePaymentAction('rejected')}>
                    رفض الدفع
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {timeline.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  الجدول الزمني
                </h3>
                <div className="space-y-3">
                  {timeline.map((entry: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {ACADEMIC_STATUS_LABELS[entry.status] || entry.status}
                        </p>
                        {entry.note && <p className="text-xs text-secondary/60 mt-0.5">{entry.note}</p>}
                        <p className="text-xs text-secondary/40 mt-0.5">
                          {new Date(entry.date).toLocaleString('ar-SA')}
                        </p>
                      </div>
                    </div>
                  ))}
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
                  <span className="font-medium">{order.order_number}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-secondary/60">النوع</span>
                  <Badge variant="info">{TYPE_LABELS[type || ''] || type}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-secondary/60">المبلغ</span>
                  <span className="font-bold text-primary">{order.price ? formatPrice(order.price) : '-'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-secondary/60">حالة الدفع</span>
                  <Badge variant="info" className={
                    order.payment_status === 'approved'
                      ? 'bg-success/10 text-success border-success/20'
                      : order.payment_status === 'rejected'
                      ? 'bg-error/10 text-error border-error/20'
                      : 'bg-warning/10 text-warning border-warning/20'
                  }>
                    {order.payment_status === 'approved' ? 'تم الدفع' : order.payment_status === 'rejected' ? 'مرفوض' : order.payment_status === 'reviewing' ? 'قيد المراجعة' : 'بانتظار الدفع'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-secondary/60">الحالة</span>
                  <Badge variant="info" className={ACADEMIC_STATUS_COLORS[order.status] || ''}>
                    {ACADEMIC_STATUS_LABELS[order.status] || order.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-secondary/60">تاريخ الإنشاء</span>
                  <span className="text-secondary/60">{new Date(order.created_at).toLocaleDateString('ar-SA')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {order.payment_image_url && (
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
                    src={order.payment_image_url}
                    alt="إشعار الدفع"
                    className="w-full h-full object-contain"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-secondary mb-4">تحديث الحالة</h3>
              <div className="space-y-3">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{ACADEMIC_STATUS_LABELS[s] || s}</option>
                  ))}
                </select>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={handleStatusUpdate}
                  disabled={updating || newStatus === order.status}
                >
                  {updating && <Loader2 className="w-4 h-4 ml-1 animate-spin" />}
                  تحديث الحالة
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

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
        {order.payment_image_url && (
          <div className="flex items-center justify-center">
            <img src={order.payment_image_url} alt="إشعار الدفع" className="max-w-full max-h-[70vh] rounded-xl" />
          </div>
        )}
      </Modal>
    </div>
  )
}
