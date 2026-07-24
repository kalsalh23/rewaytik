import { useState } from 'react'
import { Search, Package, Clock, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { getStatusColor, getStatusLabel } from '@/lib/utils'

const trackingSteps = [
  { label: 'تم إنشاء الطلب', date: '٢٠ ديسمبر ٢٠٢٥', completed: true },
  { label: 'تم تأكيد الدفع', date: '٢٤ ديسمبر ٢٠٢٥', completed: true },
  { label: 'جاري كتابة القصة', date: '٢٥ ديسمبر ٢٠٢٥', completed: true },
  { label: 'القصة جاهزة', date: 'قريباً', completed: false },
  { label: 'قيد الطباعة', date: '-', completed: false },
  { label: 'تم الشحن', date: '-', completed: false },
  { label: 'تم التسليم', date: '-', completed: false },
]

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState('')
  const [showTracking, setShowTracking] = useState(false)

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    if (orderNumber.trim()) setShowTracking(true)
  }

  return (
    <div className="pt-24 pb-20">
      <div className="container-custom max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary mb-4">تتبع الطلب</h1>
          <p className="text-secondary/60">أدخل رقم الطلب لتتبع حالة طلبك</p>
        </div>

        <form onSubmit={handleTrack} className="flex gap-3 mb-10">
          <div className="flex-1">
            <Input placeholder="أدخل رقم الطلب (مثال: RWK-001)" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} required />
          </div>
          <Button type="submit">
            <Search className="w-4 h-4 ml-2" />
            تتبع
          </Button>
        </form>

        {showTracking && (
          <div>
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-lg font-semibold text-secondary">طلب رقم: {orderNumber}</h2>
                    <p className="text-sm text-secondary/60">قصة طفولة - ليان أحمد</p>
                  </div>
                  <Badge variant="info" className={getStatusColor('writing')}>{getStatusLabel('writing')}</Badge>
                </div>

                <div className="space-y-6">
                  {trackingSteps.map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.completed ? 'gradient-primary text-white' : 'bg-border text-muted-foreground'
                        }`}>
                          {step.completed ? <Check className="w-4 h-4" /> : i + 1}
                        </div>
                        {i < trackingSteps.length - 1 && (
                          <div className={`w-0.5 flex-1 my-1 ${step.completed ? 'bg-primary/30' : 'bg-border'}`} />
                        )}
                      </div>
                      <div className="pb-6">
                        <p className={`font-medium ${step.completed ? 'text-secondary' : 'text-muted-foreground'}`}>{step.label}</p>
                        <p className="text-xs text-secondary/60 mt-0.5">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
