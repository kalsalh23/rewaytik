import { useState, useEffect } from 'react'
import { Mail, Phone, MessageSquare, Trash2, Loader2, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { toast } from 'react-hot-toast'
import { getContactMessages, deleteContactMessage } from '@/lib/supabase-service'

export default function AdminInquiries() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteModal, setDeleteModal] = useState<string | null>(null)
  const [selectedMsg, setSelectedMsg] = useState<any | null>(null)

  useEffect(() => {
    getContactMessages()
      .then((data) => { setMessages(data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await deleteContactMessage(id)
      toast.success('تم حذف الاستفسار')
      setMessages((prev) => prev.filter((m) => m.id !== id))
    } catch {
      toast.error('فشل الحذف')
    }
    setDeleteModal(null)
    setSelectedMsg(null)
  }

  const filtered = messages.filter((m) =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.email?.toLowerCase().includes(search.toLowerCase()) ||
    m.subject?.toLowerCase().includes(search.toLowerCase())
  )

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
        <h2 className="text-2xl font-bold text-secondary">الاستفسارات</h2>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pr-10 w-64" placeholder="بحث..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-secondary/60 py-10">لا توجد استفسارات</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((msg) => (
            <Card key={msg.id}>
              <CardContent className="p-6">
                <div
                  className="cursor-pointer"
                  onClick={() => setSelectedMsg(selectedMsg?.id === msg.id ? null : msg)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-secondary">{msg.subject}</p>
                        <p className="text-xs text-secondary/60">
                          {new Date(msg.created_at).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setDeleteModal(msg.id) }} className="text-error hover:text-error">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-secondary/60 mb-2">
                    <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {msg.email}</span>
                    {msg.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {msg.phone}</span>}
                  </div>

                  <p className="text-sm text-secondary/80">{msg.name}</p>

                  {selectedMsg?.id === msg.id && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm text-secondary whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="حذف الاستفسار">
        <div className="space-y-4">
          <p className="text-sm text-secondary/60">هل أنت متأكد من حذف هذا الاستفسار؟ لن تتمكن من استعادته.</p>
          <div className="flex gap-3">
            <Button variant="danger" onClick={() => handleDelete(deleteModal!)}>تأكيد الحذف</Button>
            <Button variant="outline" onClick={() => setDeleteModal(null)}>إلغاء</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}