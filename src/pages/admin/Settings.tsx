import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { toast } from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

export default function AdminSettings() {
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    siteName: 'روايتك',
    siteDescription: 'لأن لكل إنسان قصة تستحق أن تُروى',
    email: 'info@riwayatek.com',
    phone: '+966 55 123 4567',
    address: 'حماه، الجمهورية العربية السورية',
    shamCashWallet: '0991234567',
    shamCashBeneficiary: 'روايتك',
    shippingCost: 'مجاني',
  })

  const handleSave = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.from('site_settings').upsert([
        { key: 'siteName', value: settings.siteName },
        { key: 'siteDescription', value: settings.siteDescription },
        { key: 'email', value: settings.email },
        { key: 'phone', value: settings.phone },
        { key: 'address', value: settings.address },
        { key: 'shamCashWallet', value: settings.shamCashWallet },
        { key: 'shamCashBeneficiary', value: settings.shamCashBeneficiary },
        { key: 'shippingCost', value: settings.shippingCost },
      ], { onConflict: 'key' })
      if (error) throw error
      toast.success('تم حفظ الإعدادات بنجاح')
    } catch {
      toast.error('فشل حفظ الإعدادات')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-secondary mb-6">الإعدادات</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-secondary mb-4">معلومات الموقع</h3>
            <div className="space-y-4">
              <Input label="اسم الموقع" value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} />
              <Textarea label="وصف الموقع" value={settings.siteDescription} onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-secondary mb-4">معلومات التواصل</h3>
            <div className="space-y-4">
              <Input label="البريد الإلكتروني" value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
              <Input label="رقم الهاتف" value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} />
              <Textarea label="العنوان" value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-secondary mb-4">إعدادات الدفع</h3>
            <div className="space-y-4">
              <Input label="رقم محفظة شام كاش" value={settings.shamCashWallet} onChange={(e) => setSettings({ ...settings, shamCashWallet: e.target.value })} />
              <Input label="اسم المستفيد" value={settings.shamCashBeneficiary} onChange={(e) => setSettings({ ...settings, shamCashBeneficiary: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-secondary mb-4">إعدادات الشحن</h3>
            <div className="space-y-4">
              <Input label="تكلفة الشحن" value={settings.shippingCost} onChange={(e) => setSettings({ ...settings, shippingCost: e.target.value })} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Button size="lg" loading={loading} onClick={handleSave}>حفظ الإعدادات</Button>
      </div>
    </div>
  )
}
