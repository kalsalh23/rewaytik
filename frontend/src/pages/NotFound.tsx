import { Link } from 'react-router-dom'
import { BookOpen, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-gradient-to-b from-primary/5 to-background">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-8">
          <BookOpen className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-8xl font-bold text-primary mb-4">٤٠٤</h1>
        <h2 className="text-2xl font-bold text-secondary mb-4">الصفحة غير موجودة</h2>
        <p className="text-secondary/60 mb-8 leading-relaxed">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها. ربما تكون القصة التي تبحث عنها لم تُكتب بعد!
        </p>
        <Link to="/">
          <Button size="lg">
            <ArrowLeft className="w-5 h-5 ml-2" />
            العودة للرئيسية
          </Button>
        </Link>
      </div>
    </div>
  )
}
