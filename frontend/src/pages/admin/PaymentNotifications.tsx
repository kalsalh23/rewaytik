import { useState, useEffect } from 'react'
import { Loader2, ExternalLink, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { toast } from 'react-hot-toast'
import { getPaymentNotifications, clearPaymentNotification } from '@/lib/supabase-service'

export default function AdminPaymentNotifications() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [previewImg, setPreviewImg] = useState('')
  const [deleteModal, setDeleteModal] = useState<string | null>(null)

  const fetch = () => {
    setLoading(true)
    getPaymentNotifications()
      .then((data) => { setNotifications(data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [])

  const handleDelete = async (id: string) => {
    try {
      await clearPaymentNotification(id)
      toast.success('تم حذف إشعار الدفع')
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    } catch {
      toast.error('فشل الحذف')
    }
    setDeleteModal(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-secondary">إشعارات الدفع</h2>
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-secondary/60 py-10">لا توجد إشعارات دفع</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {notifications.map((n) => (
            <Card key={n.id}>
              <CardContent className="p-4">
                <div
                  className="aspect-[4/3] rounded-xl overflow-hidden border border-border mb-3 cursor-pointer bg-accent/20"
                  onClick={() => setPreviewImg(n.imageUrl)}
                >
                  <img
                    src={n.imageUrl}
                    alt="إشعار دفع"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary">{n.customerName}</p>
                    <p className="text-xs text-secondary/60">{new Date(n.date).toLocaleDateString('ar-SA')}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <a href={n.imageUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 text-primary cursor-pointer hover:text-primary/70" />
                    </a>
                    <button onClick={() => setDeleteModal(n.id)} className="p-1 text-error hover:text-error/70 cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={!!previewImg} onClose={() => setPreviewImg('')} title="إشعار الدفع">
        {previewImg && (
          <div className="flex items-center justify-center">
            <img src={previewImg} alt="إشعار الدفع" className="max-w-full max-h-[70vh] rounded-xl" />
          </div>
        )}
      </Modal>

      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="حذف إشعار الدفع">
        <div className="space-y-4">
          <p className="text-sm text-secondary/60">هل أنت متأكد من حذف إشعار الدفع؟</p>
          <div className="flex gap-3">
            <Button variant="danger" onClick={() => handleDelete(deleteModal!)}>تأكيد الحذف</Button>
            <Button variant="outline" onClick={() => setDeleteModal(null)}>إلغاء</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}