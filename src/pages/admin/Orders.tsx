import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Search, Trash2, Check, X, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { getStatusColor, getStatusLabel, formatPrice } from '@/lib/utils'
import { toast } from 'react-hot-toast'
import { getAllOrders, archiveOrder, approveOrder } from '@/lib/supabase-service'

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [deleteModal, setDeleteModal] = useState<string | null>(null)
  const [approveModal, setApproveModal] = useState<any | null>(null)

  const fetchOrders = () => {
    setLoading(true)
    getAllOrders({ fromDate, toDate })
      .then((data) => { setOrders(data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchOrders() }, [])

  const handleDelete = async (id: string) => {
    try {
      await archiveOrder(id)
      toast.success('تم أرشفة الطلب')
      setOrders((prev) => prev.filter((o) => o.id !== id))
    } catch {
      toast.error('فشل أرشفة الطلب')
    }
    setDeleteModal(null)
  }

  const handleApprove = async (id: string) => {
    try {
      await approveOrder(id)
      toast.success('تمت الموافقة على الطلب')
      setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: 'writing' } : o))
    } catch {
      toast.error('فشل الموافقة على الطلب')
    }
    setApproveModal(null)
  }

  const filtered = orders.filter((o) =>
    o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
    o.detail?.characterName?.includes(search) ||
    o.bookTypeName?.includes(search)
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-secondary">الطلبات</h2>
        <div className="flex items-center gap-3">
          <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-40" />
          <span className="text-secondary/60">إلى</span>
          <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-40" />
          <Button variant="outline" size="sm" onClick={fetchOrders}>تصفية</Button>
          {(fromDate || toDate) && (
            <Button variant="ghost" size="sm" onClick={() => { setFromDate(''); setToDate(''); fetchOrders() }}>إلغاء</Button>
          )}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pr-10 w-64" placeholder="بحث..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
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
                    <th className="text-right py-3 px-4 font-medium text-secondary/60">العميل</th>
                    <th className="text-right py-3 px-4 font-medium text-secondary/60">نوع الكتاب</th>
                    <th className="text-right py-3 px-4 font-medium text-secondary/60">المبلغ</th>
                    <th className="text-right py-3 px-4 font-medium text-secondary/60">الحالة</th>
                    <th className="text-right py-3 px-4 font-medium text-secondary/60">التاريخ</th>
                    <th className="text-right py-3 px-4 font-medium text-secondary/60">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order) => (
                    <tr key={order.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                      <td className="py-3 px-4 font-medium">{order.orderNumber}</td>
                      <td className="py-3 px-4">{order.detail?.characterName || '-'}</td>
                      <td className="py-3 px-4">{order.bookTypeName}</td>
                      <td className="py-3 px-4">{formatPrice(order.totalAmount)}</td>
                      <td className="py-3 px-4">
                        <Badge variant="info" className={getStatusColor(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-secondary/60">{new Date(order.createdAt).toLocaleDateString('ar-SA')}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Link to={`/admin/orders/${order.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          {(order.status === 'pending_review' || order.status === 'pending_approval') && (
                            <Button variant="ghost" size="sm" onClick={() => setApproveModal(order)} className="text-success hover:text-success">
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => setDeleteModal(order.id)} className="text-error hover:text-error">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="حذف الطلب">
        <div className="space-y-4">
          <p className="text-sm text-secondary/60">سيتم أرشفة هذا الطلب ولن يظهر في لوحة التحكم، لكنه سيبقى في حساب المستخدم. هل أنت متأكد؟</p>
          <div className="flex gap-3">
            <Button variant="danger" onClick={() => handleDelete(deleteModal!)}>تأكيد الحذف</Button>
            <Button variant="outline" onClick={() => setDeleteModal(null)}>إلغاء</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!approveModal} onClose={() => setApproveModal(null)} title="الموافقة على الطلب">
        <div className="space-y-4">
          <p className="text-sm text-secondary/60">يرجى التأكد من بيانات المستخدم قبل الموافقة:</p>
          {approveModal && (
            <div className="p-4 rounded-xl bg-accent/30 space-y-2 text-sm">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <User className="w-4 h-4 text-primary" />
                <span className="font-medium">{approveModal.detail?.characterName}</span>
              </div>
              <p><span className="text-secondary/60">نوع الكتاب:</span> {approveModal.bookTypeName}</p>
              <p><span className="text-secondary/60">المبلغ:</span> {formatPrice(approveModal.totalAmount)}</p>
              <p><span className="text-secondary/60">رقم الطلب:</span> {approveModal.orderNumber}</p>
              <p><span className="text-secondary/60">الحالة:</span> {getStatusLabel(approveModal.status)}</p>
              {approveModal.detail?.shippingAddress && (
                <div className="pt-2 border-t border-border">
                  <p className="text-secondary/60 mb-1">عنوان الشحن:</p>
                  <p>{approveModal.detail.shippingAddress.fullName}</p>
                  <p>{approveModal.detail.shippingAddress.phone}</p>
                  <p>{approveModal.detail.shippingAddress.city}، {approveModal.detail.shippingAddress.district}</p>
                </div>
              )}
            </div>
          )}
          <div className="flex gap-3">
            <Button onClick={() => handleApprove(approveModal?.id)}>تأكيد الموافقة</Button>
            <Button variant="outline" onClick={() => setApproveModal(null)}>إلغاء</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}