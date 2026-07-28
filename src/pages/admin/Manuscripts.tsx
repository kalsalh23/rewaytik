import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Search, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { getManuscriptStatusColor, getManuscriptStatusLabel, formatDate } from '@/lib/utils'
import { toast } from 'react-hot-toast'
import { getAllManuscriptOrders, archiveManuscriptOrder } from '@/lib/supabase-service'

export default function AdminManuscripts() {
  const [manuscripts, setManuscripts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [deleteModal, setDeleteModal] = useState<string | null>(null)

  const fetchManuscripts = () => {
    setLoading(true)
    getAllManuscriptOrders({ fromDate, toDate })
      .then((data) => { setManuscripts(data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchManuscripts() }, [])

  const handleDelete = async (id: string) => {
    try {
      await archiveManuscriptOrder(id)
      toast.success('تم أرشفة الطلب')
      setManuscripts((prev) => prev.filter((m) => m.id !== id))
    } catch {
      toast.error('فشل أرشفة الطلب')
    }
    setDeleteModal(null)
  }

  const filtered = manuscripts.filter((m) =>
    m.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
    m.bookTitle?.includes(search) ||
    m.authorName?.includes(search)
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-secondary">طلبات اصنع كتابك</h2>
        <div className="flex items-center gap-3">
          <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-40" />
          <span className="text-secondary/60">إلى</span>
          <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-40" />
          <Button variant="outline" size="sm" onClick={fetchManuscripts}>تصفية</Button>
          {(fromDate || toDate) && (
            <Button variant="ghost" size="sm" onClick={() => { setFromDate(''); setToDate(''); fetchManuscripts() }}>إلغاء</Button>
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
                    <th className="text-right py-3 px-4 font-medium text-secondary/60">اسم الكتاب</th>
                    <th className="text-right py-3 px-4 font-medium text-secondary/60">المؤلف</th>
                    <th className="text-right py-3 px-4 font-medium text-secondary/60">نوع الكتاب</th>
                    <th className="text-right py-3 px-4 font-medium text-secondary/60">الدفع</th>
                    <th className="text-right py-3 px-4 font-medium text-secondary/60">الحالة</th>
                    <th className="text-right py-3 px-4 font-medium text-secondary/60">التاريخ</th>
                    <th className="text-right py-3 px-4 font-medium text-secondary/60">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m) => (
                    <tr key={m.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                      <td className="py-3 px-4 font-medium">{m.orderNumber}</td>
                      <td className="py-3 px-4">{m.bookTitle}</td>
                      <td className="py-3 px-4">{m.authorName}</td>
                      <td className="py-3 px-4">{m.bookCategory}</td>
                      <td className="py-3 px-4">
                        {m.paymentStatus === 'approved' ? (
                          <Badge variant="info" className="bg-success/10 text-success border-success/20">مدفوع</Badge>
                        ) : m.paymentStatus === 'reviewing' ? (
                          <Badge variant="info" className="bg-warning/10 text-warning border-warning/20">قيد المراجعة</Badge>
                        ) : m.paymentStatus === 'rejected' ? (
                          <Badge variant="info" className="bg-error/10 text-error border-error/20">مرفوض</Badge>
                        ) : (
                          <Badge variant="info" className="bg-muted/10 text-muted-foreground border-muted/20">بانتظار الدفع</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="info" className={getManuscriptStatusColor(m.status)}>
                          {getManuscriptStatusLabel(m.status)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-secondary/60">{new Date(m.createdAt).toLocaleDateString('ar-SA')}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Link to={`/admin/manuscripts/${m.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm" onClick={() => setDeleteModal(m.id)} className="text-error hover:text-error">
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

      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="أرشفة الطلب">
        <div className="space-y-4">
          <p className="text-sm text-secondary/60">سيتم أرشفة هذا الطلب. هل أنت متأكد؟</p>
          <div className="flex gap-3">
            <Button variant="danger" onClick={() => handleDelete(deleteModal!)}>تأكيد</Button>
            <Button variant="outline" onClick={() => setDeleteModal(null)}>إلغاء</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
