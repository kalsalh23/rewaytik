import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { getBanners, createBanner, deleteBanner } from '@/lib/supabase-service'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Trash2, Plus, Loader2 } from 'lucide-react'

interface Banner {
  id: string
  image_url: string
  is_active: boolean
  sort_order: number
  created_at: string
}

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => { loadBanners() }, [])

  async function loadBanners() {
    try {
      setLoading(true)
      const data = await getBanners()
      setBanners(data)
    } catch (err: any) {
      toast.error(err.message || 'فشل تحميل الإعلانات')
    } finally {
      setLoading(false)
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `banner_${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('site-banners')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('site-banners')
        .getPublicUrl(fileName)

      await createBanner({ image_url: publicUrl, is_active: true, sort_order: banners.length })
      toast.success('تمت إضافة الإعلان بنجاح')
      await loadBanners()
    } catch (err: any) {
      toast.error(err.message || 'فشل رفع الصورة')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return
    try {
      await deleteBanner(id)
      toast.success('تم حذف الإعلان')
      await loadBanners()
    } catch (err: any) {
      toast.error(err.message || 'فشل الحذف')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">الإعلانات</h2>
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <span className="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed gradient-primary text-white hover:opacity-90 shadow-sm hover:shadow-md px-5 py-2.5 text-sm">
            {uploading ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <Plus className="w-4 h-4 ml-2" />}
            {uploading ? 'جاري الرفع...' : 'إضافة إعلان'}
          </span>
          <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={handleUpload} />
        </label>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {banners.map(banner => (
            <div key={banner.id} className="relative group rounded-xl overflow-hidden border border-border bg-card">
              <img src={banner.image_url} alt="" className="w-full h-48 object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all cursor-pointer"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          {banners.length === 0 && (
            <div className="col-span-full text-center py-20 text-secondary-light">
              لا توجد إعلانات بعد. أضف أول إعلان بالضغط على "إضافة إعلان"
            </div>
          )}
        </div>
      )}
    </div>
  )
}