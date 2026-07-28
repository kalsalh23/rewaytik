import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Download, Loader2, FileText, Clock, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { getManuscriptStatusColor, getManuscriptStatusLabel, formatDate } from '@/lib/utils'
import { getManuscriptOrder } from '@/lib/supabase-service'

const visualStylesLabels: Record<string, string> = {
  classic: 'كلاسيكي', modern: 'حديث', luxury: 'فاخر', minimal: 'Minimal',
  fantasy: 'فانتازي', historical: 'تاريخي', romantic: 'رومانسي',
  detective: 'بوليسي', scifi: 'خيال علمي', children: 'أطفال', designer: 'قرار التصميم',
}

const servicesLabels: Record<string, string> = {
  proofreading: 'تدقيق لغوي', printing_prep: 'تجهيز للطباعة',
  pdf_copy: 'نسخة PDF', print_ship: 'طباعة وشحن',
}

const languageLabels: Record<string, string> = {
  arabic: 'العربية', english: 'الإنجليزية', bilingual: 'ثنائي اللغة', other: 'أخرى',
}

const layoutLabels: Record<string, string> = {
  luxury: 'فاخر', classic: 'كلاسيكي', modern: 'حديث', simple: 'بسيط', designer: 'لفريق التصميم',
}

const imagesOptionLabels: Record<string, string> = {
  none: 'بدون صور', upload: 'سأرفع صوري', designer: 'لفريق التصميم',
}

export default function ManuscriptDetail() {
  const { id } = useParams<{ id: string }>()
  const [manuscript, setManuscript] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      getManuscriptOrder(id)
        .then((data) => setManuscript(data))
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [id])

  if (loading) {
    return (
      <div className="pt-24 pb-20 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (!manuscript) {
    return (
      <div className="pt-24 pb-20 text-center">
        <p className="text-secondary/60">لم يتم العثور على الطلب</p>
        <Link to="/my-manuscripts"><Button variant="outline" className="mt-4">العودة للقائمة</Button></Link>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-20">
      <div className="container-custom max-w-3xl">
        <Link to="/my-manuscripts" className="inline-flex items-center gap-2 text-sm text-secondary/60 hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          العودة لمخطوطاتي
        </Link>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary mb-2">{manuscript.bookTitle}</h1>
            <div className="flex items-center gap-3 text-sm text-secondary/60">
              <span>{manuscript.orderNumber}</span>
              <span>•</span>
              <span>{formatDate(new Date(manuscript.createdAt))}</span>
            </div>
          </div>
          <Badge variant="info" className={getManuscriptStatusColor(manuscript.status)}>
            {getManuscriptStatusLabel(manuscript.status)}
          </Badge>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-secondary mb-4">معلومات الكتاب</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-accent/30">
                  <span className="text-xs text-secondary/60">اسم الكتاب</span>
                  <p className="font-medium">{manuscript.bookTitle}</p>
                </div>
                <div className="p-3 rounded-xl bg-accent/30">
                  <span className="text-xs text-secondary/60">اسم المؤلف</span>
                  <p className="font-medium">{manuscript.authorName}</p>
                </div>
                <div className="p-3 rounded-xl bg-accent/30">
                  <span className="text-xs text-secondary/60">إظهار الاسم على الغلاف</span>
                  <p className="font-medium">{manuscript.showAuthorOnCover ? 'نعم' : 'لا'}</p>
                </div>
                <div className="p-3 rounded-xl bg-accent/30">
                  <span className="text-xs text-secondary/60">لغة الكتاب</span>
                  <p className="font-medium">{languageLabels[manuscript.bookLanguage] || manuscript.bookLanguage}</p>
                </div>
                <div className="p-3 rounded-xl bg-accent/30">
                  <span className="text-xs text-secondary/60">نوع الكتاب</span>
                  <p className="font-medium">{manuscript.bookCategory}</p>
                </div>
                {manuscript.bookSummary && (
                  <div className="col-span-2 p-3 rounded-xl bg-accent/30">
                    <span className="text-xs text-secondary/60">نبذة عن الكتاب</span>
                    <p className="font-medium text-sm">{manuscript.bookSummary}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-secondary mb-4">التصميم والتنسيق</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-accent/30">
                  <span className="text-xs text-secondary/60">الهوية البصرية</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {(manuscript.visualStyles || []).map((s: string) => (
                      <span key={s} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                        {visualStylesLabels[s] || s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-accent/30">
                  <span className="text-xs text-secondary/60">تنسيق الصفحات</span>
                  <p className="font-medium">{layoutLabels[manuscript.pageLayout] || manuscript.pageLayout}</p>
                </div>
                <div className="p-3 rounded-xl bg-accent/30">
                  <span className="text-xs text-secondary/60">الصور الداخلية</span>
                  <p className="font-medium">{imagesOptionLabels[manuscript.internalImagesOption] || manuscript.internalImagesOption}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-secondary mb-4">الملف والخدمات</h2>
              <div className="space-y-3">
                {manuscript.manuscriptFileName && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/30">
                    <FileText className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{manuscript.manuscriptFileName}</p>
                      {manuscript.manuscriptFileSize && (
                        <p className="text-xs text-secondary/60">{(manuscript.manuscriptFileSize / 1024 / 1024).toFixed(2)} MB</p>
                      )}
                    </div>
                  </div>
                )}
                {manuscript.additionalServices?.length > 0 && (
                  <div className="p-3 rounded-xl bg-accent/30">
                    <span className="text-xs text-secondary/60">الخدمات الإضافية</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {manuscript.additionalServices.map((s: string) => (
                        <span key={s} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                          {servicesLabels[s] || s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {manuscript.additionalNotes && (
                  <div className="p-3 rounded-xl bg-accent/30">
                    <span className="text-xs text-secondary/60">ملاحظات إضافية</span>
                    <p className="font-medium text-sm">{manuscript.additionalNotes}</p>
                  </div>
                )}
                {manuscript.finalFileUrl && (
                  <a href={manuscript.finalFileUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 ml-2" />
                      تحميل النسخة النهائية
                    </Button>
                  </a>
                )}
              </div>
            </CardContent>
          </Card>

          {manuscript.paymentStatus && manuscript.paymentStatus !== 'pending' && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-secondary mb-4">حالة الدفع</h2>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-accent/30 flex items-center justify-between">
                    <span className="text-sm text-secondary/60">الحالة</span>
                    <Badge className={
                      manuscript.paymentStatus === 'approved' ? 'bg-success/10 text-success' :
                      manuscript.paymentStatus === 'reviewing' ? 'bg-warning/10 text-warning' :
                      manuscript.paymentStatus === 'rejected' ? 'bg-error/10 text-error' : ''
                    }>
                      {manuscript.paymentStatus === 'approved' ? 'تمت الموافقة' :
                       manuscript.paymentStatus === 'reviewing' ? 'قيد المراجعة' :
                       manuscript.paymentStatus === 'rejected' ? 'مرفوض' : manuscript.paymentStatus}
                    </Badge>
                  </div>
                  {manuscript.paymentAmount && (
                    <div className="p-3 rounded-xl bg-accent/30">
                      <span className="text-xs text-secondary/60">المبلغ</span>
                      <p className="font-medium">{manuscript.paymentAmount} ل.س</p>
                    </div>
                  )}
                  {manuscript.paymentImageUrl && (
                    <a href={manuscript.paymentImageUrl} target="_blank" rel="noopener noreferrer">
                      <img src={manuscript.paymentImageUrl} alt="إشعار الدفع" className="w-full rounded-xl border border-border cursor-pointer hover:opacity-90 transition-opacity" />
                    </a>
                  )}
                  {manuscript.paymentNotes && (
                    <div className="p-3 rounded-xl bg-accent/30">
                      <span className="text-xs text-secondary/60">ملاحظات المراجعة</span>
                      <p className="text-sm">{manuscript.paymentNotes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {manuscript.timeline?.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-secondary mb-4">سجل التقدم</h2>
                <div className="space-y-4">
                  {[...manuscript.timeline].reverse().map((t: any, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        i === 0 ? 'gradient-primary text-white' : 'bg-border text-muted-foreground'
                      }`}>
                        {i === 0 ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{getManuscriptStatusLabel(t.status)}</p>
                        <p className="text-xs text-secondary/60">{formatDate(new Date(t.date))}</p>
                        {t.note && <p className="text-xs text-secondary/80 mt-1">{t.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
