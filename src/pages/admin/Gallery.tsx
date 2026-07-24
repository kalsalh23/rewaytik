import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { toast } from 'react-hot-toast'
import { getAdminGalleryItems, createGalleryItem, updateGalleryItem, deleteGalleryItem } from '@/lib/supabase-service'

interface GalleryItem {
  id: string
  image_url: string
  title: string
  title_ar: string
  description: string
  description_ar: string
  book_type: string
  is_active: boolean
  created_at: string
}

const emptyForm = { image_url: '', title: '', title_ar: '', description: '', description_ar: '', book_type: '', is_active: true }

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  const fetchItems = () => {
    setLoading(true)
    getAdminGalleryItems()
      .then((data) => { setItems(data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchItems() }, [])

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setModal(true) }

  const openEdit = (item: GalleryItem) => {
    setForm({ image_url: item.image_url, title: item.title, title_ar: item.title_ar, description: item.description, description_ar: item.description_ar, book_type: item.book_type, is_active: item.is_active })
    setEditingId(item.id)
    setModal(true)
  }

  const handleSave = async () => {
    if (!form.title_ar || !form.image_url) { toast.error('يرجى ملء الحقول المطلوبة'); return }
    try {
      if (editingId) {
        await updateGalleryItem(editingId, form)
        toast.success('تم تحديث العنصر')
      } else {
        await createGalleryItem(form)
        toast.success('تم إضافة العنصر')
      }
      setModal(false)
      fetchItems()
    } catch {
      toast.error('فشل الحفظ')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) return
    try {
      await deleteGalleryItem(id)
      toast.success('تم حذف العنصر')
      setItems((prev) => prev.filter((i) => i.id !== id))
    } catch {
      toast.error('فشل الحذف')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-secondary">معرض الأعمال</h2>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 ml-1" />
          إضافة عمل
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-center text-secondary/60 py-10">لا توجد عناصر في المعرض</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="h-40 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-3 overflow-hidden">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title_ar} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-primary/30" />
                  )}
                </div>
                <h3 className="font-semibold text-secondary mb-1">{item.title_ar}</h3>
                <p className="text-xs text-secondary/60 mb-1">{item.title}</p>
                <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">{item.book_type}</span>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${item.is_active ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                    {item.is_active ? 'ظاهر' : 'مخفي'}
                  </span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="text-error hover:text-error">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editingId ? 'تعديل العنصر' : 'إضافة عنصر جديد'}>
        <div className="space-y-4">
          <Input label="رابط الصورة" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
          <Input label="العنوان (عربي)" value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} required />
          <Input label="العنوان (إنجليزي)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input label="الوصف (عربي)" value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} />
          <Input label="الوصف (إنجليزي)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input label="نوع الكتاب" value={form.book_type} onChange={(e) => setForm({ ...form, book_type: e.target.value })} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4" />
            مرئي في الموقع
          </label>
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave}>حفظ</Button>
            <Button variant="outline" onClick={() => setModal(false)}>إلغاء</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
