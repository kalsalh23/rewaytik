import { useState, useEffect } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { getCustomers } from '@/lib/supabase-service'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getCustomers()
      .then((data) => { setCustomers(data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = customers.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
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
        <h2 className="text-2xl font-bold text-secondary">العملاء</h2>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pr-10 w-64" placeholder="بحث عن عميل..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          {filtered.length === 0 ? (
            <p className="text-center text-secondary/60 py-10">لا يوجد عملاء</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-right py-3 px-4 font-medium text-secondary/60">الاسم</th>
                    <th className="text-right py-3 px-4 font-medium text-secondary/60">البريد الإلكتروني</th>
                    <th className="text-right py-3 px-4 font-medium text-secondary/60">الهاتف</th>
                    <th className="text-right py-3 px-4 font-medium text-secondary/60">عدد الطلبات</th>
                    <th className="text-right py-3 px-4 font-medium text-secondary/60">تاريخ التسجيل</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                      <td className="py-3 px-4 font-medium">{c.name}</td>
                      <td className="py-3 px-4">{c.email}</td>
                      <td className="py-3 px-4">{c.phone || '-'}</td>
                      <td className="py-3 px-4">{c.ordersCount}</td>
                      <td className="py-3 px-4 text-secondary/60">{new Date(c.created_at).toLocaleDateString('ar-SA')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
