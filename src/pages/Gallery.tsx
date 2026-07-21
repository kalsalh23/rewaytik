import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Eye, Loader2 } from 'lucide-react'
import { getGalleryItems } from '@/lib/supabase-service'

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

const categoryColors: Record<string, string> = {
  أطفال: 'from-primary/10 to-primary/5',
  شباب: 'from-primary/10 to-accent/10',
  تخرج: 'from-primary/10 to-accent/10',
  حب: 'from-error/10 to-error/5',
  رحلة: 'from-accent/10 to-accent/5',
  عائلة: 'from-accent/10 to-accent/5',
  هدية: 'from-accent/10 to-accent/5',
}

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('الكل')
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)

  useEffect(() => {
    getGalleryItems()
      .then((data) => { setItems(data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const categories = ['الكل', ...new Set(items.map((i) => i.book_type).filter(Boolean))]

  const filtered = activeCategory === 'الكل' ? items : items.filter((item) => item.book_type === activeCategory)

  return (
    <div className="pt-24 pb-20">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">معرض الأعمال</h1>
          <p className="text-secondary/60 max-w-2xl mx-auto text-lg">
            تصفح بعضاً من أعمالنا الملهمة التي حولناها إلى كتب فاخرة
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <>
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    activeCategory === cat ? 'gradient-primary text-white shadow-sm' : 'bg-card border border-border text-secondary/70 hover:border-primary/30 hover:text-primary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item) => {
                const color = categoryColors[item.book_type] || 'from-primary/10 to-accent/10'
                const emoji = item.book_type === 'أطفال' ? '👶' : item.book_type === 'شباب' ? '🌟' : item.book_type === 'تخرج' ? '🎓' : item.book_type === 'حب' ? '💕' : item.book_type === 'رحلة' ? '✈️' : item.book_type === 'عائلة' ? '👨‍👩‍👧‍👦' : '🎁'
                return (
                  <div key={item.id}>
                    <Card className="group cursor-pointer overflow-hidden" onClick={() => setSelectedItem(item)}>
                      <div className={`h-48 bg-gradient-to-br ${color} flex items-center justify-center relative`}>
                        {item.image_url ? (
                          <img src={item.image_url.startsWith('http') ? item.image_url : item.image_url} alt={item.title_ar} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-20 h-20 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center">
                            <span className="text-4xl opacity-70">{emoji}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
                              <Eye className="w-5 h-5 text-secondary" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-secondary">{item.title_ar}</h3>
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">{item.book_type}</span>
                        </div>
                        <p className="text-sm text-secondary/60 mt-1">{item.description_ar}</p>
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
            </div>

            <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} title={selectedItem?.title_ar} size="lg">
              {selectedItem && (
                <div>
                  <div className={`h-64 rounded-xl bg-gradient-to-br ${categoryColors[selectedItem.book_type] || 'from-primary/10 to-accent/10'} flex items-center justify-center mb-6 overflow-hidden`}>
                    {selectedItem.image_url ? (
                      <img src={selectedItem.image_url.startsWith('http') ? selectedItem.image_url : selectedItem.image_url} alt={selectedItem.title_ar} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-24 h-24 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-5xl opacity-70">
                          {selectedItem.book_type === 'أطفال' ? '👶' : selectedItem.book_type === 'شباب' ? '🌟' : selectedItem.book_type === 'تخرج' ? '🎓' : selectedItem.book_type === 'حب' ? '💕' : selectedItem.book_type === 'رحلة' ? '✈️' : selectedItem.book_type === 'عائلة' ? '👨‍👩‍👧‍👦' : '🎁'}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-secondary/80 leading-relaxed">{selectedItem.description_ar}</p>
                </div>
              )}
            </Modal>
          </>
        )}
      </div>
    </div>
  )
}
