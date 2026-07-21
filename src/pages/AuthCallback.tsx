import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'

export default function AuthCallback() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
        if (userData) {
          setAuth(session.access_token, userData)
          setStatus('success')
          setTimeout(() => navigate(userData.role === 'admin' ? '/admin' : '/home'), 1500)
        } else {
          setStatus('error')
        }
      } else {
        setStatus('error')
      }
    })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background">
      <div className="text-center">
        {status === 'loading' && (
          <div>
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-secondary/60">جاري تأكيد البريد الإلكتروني...</p>
          </div>
        )}
        {status === 'success' && (
          <div>
            <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
            <h2 className="text-xl font-bold text-secondary">تم تأكيد البريد الإلكتروني!</h2>
            <p className="text-secondary/60 mt-2">جاري توجيهك...</p>
          </div>
        )}
        {status === 'error' && (
          <div>
            <XCircle className="w-16 h-16 text-error mx-auto mb-4" />
            <h2 className="text-xl font-bold text-secondary">فشل التحقق</h2>
            <p className="text-secondary/60 mt-2">رابط التحقق غير صالح أو منتهي الصلاحية</p>
          </div>
        )}
      </div>
    </div>
  )
}