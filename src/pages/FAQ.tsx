import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Search } from 'lucide-react'

const faqs = [
  {
    q: 'ما هي أنجز؟',
    a: 'أنجز هي منصة إلكترونية متخصصة في تحويل الأشخاص الحقيقيين إلى كتب مطبوعة فاخرة. نأخذ قصصك وذكرياتك ونحولها إلى كتاب جميل يبقى للأبد.',
    category: 'عام',
  },
  {
    q: 'كم يستغرق وقت إنتاج الكتاب؟',
    a: 'يستغرق إنتاج الكتاب من ٧ إلى ١٤ يوم عمل بعد تأكيد الدفع، حسب حجم الكتاب ونوعه.',
    category: 'عام',
  },
  {
    q: 'ما هي أنواع الكتب المتاحة؟',
    a: 'نقدم مجموعة متنوعة من أنواع الكتب: قصة طفولة، قصة شباب، قصة تخرج، سيرة ذاتية، قصة رحلة، قصة حب، هدية مخصصة، قصة عائلة، وأي قصة مخصصة أخرى.',
    category: 'الكتب',
  },
  {
    q: 'هل يمكنني إضافة صوري الخاصة؟',
    a: 'نعم، يمكنك رفع صورك الخاصة وسيتم تضمينها في الكتاب بأفضل جودة ممكنة.',
    category: 'الكتب',
  },
  {
    q: 'ما هي طرق الدفع المتاحة؟',
    a: 'الدفع حصراً عبر محفظة شام كاش. يمكنك الدفع عن طريق تحويل المبلغ إلى رقم المحفظة المخصص لنا، ثم رفع صورة الإشعار لتأكيد الدفع.',
    category: 'الدفع',
  },
  {
    q: 'هل يوجد دفع عند الاستلام؟',
    a: 'لا، الدفع يتم مقدماً عبر شام كاش فقط. نضمن لك الحصول على كتابك بعد تأكيد الدفع.',
    category: 'الدفع',
  },
  {
    q: 'هل تشحنون خارج سوريا؟',
    a: 'نعم، نشحن إلى جميع دول العالم. تختلف تكلفة الشحن حسب الوجهة.',
    category: 'الشحن',
  },
  {
    q: 'كم تكلفة الشحن؟',
    a: 'الشحن مجاني داخل الجمهورية العربية السورية. للشحن الدولي، تحسب التكلفة حسب الوزن والوجهة.',
    category: 'الشحن',
  },
  {
    q: 'هل يمكنني تتبع طلبي؟',
    a: 'نعم، يمكنك تتبع طلبك من خلال حسابك الشخصي على الموقع. نوفر لك تحديثات مستمرة عن حالة الطلب.',
    category: 'الطلبات',
  },
  {
    q: 'ماذا لو لم يعجبني الكتاب؟',
    a: 'نضمن لك الرضا التام. إذا لم يعجبك الكتاب، سنقوم بإعادة طباعته مجاناً بعد التعديل.',
    category: 'الطلبات',
  },
  {
    q: 'هل أكتب القصة بنفسي؟',
    a: 'لا داعي للكتابة بنفسك. ما عليك سوى تقديم المعلومات والصور، وفريق الكتابة المحترف لدينا سيتولى كتابة القصة بأسلوب أدبي جميل.',
    category: 'الكتابة',
  },
  {
    q: 'هل يمكنني طلب عدد نسخ متعددة؟',
    a: 'نعم، يمكنك طلب أي عدد من النسخ. سيتم خصم ١٠٪ للنسخ الإضافية.',
    category: 'الطلبات',
  },
]

const categories = ['الكل', ...new Set(faqs.map((f) => f.category))]

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('الكل')
  const [openItems, setOpenItems] = useState<number[]>([])
  const [search, setSearch] = useState('')

  const filtered = faqs.filter((f) => {
    const matchCategory = activeCategory === 'الكل' || f.category === activeCategory
    const matchSearch = !search || f.q.includes(search) || f.a.includes(search)
    return matchCategory && matchSearch
  })

  const toggleItem = (i: number) => {
    setOpenItems((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i])
  }

  return (
    <div className="pt-24 pb-20">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">الأسئلة الشائعة</h1>
          <p className="text-secondary/60 max-w-2xl mx-auto text-lg">إجابات على أكثر الأسئلة شيوعاً حول خدماتنا</p>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="ابحث في الأسئلة..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-12 pl-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>
        </div>

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

        <div className="max-w-3xl mx-auto space-y-3">
          {filtered.map((faq, i) => (
            <div
              key={i}
              className="bg-card rounded-xl shadow-card overflow-hidden"
            >
              <button
                onClick={() => toggleItem(i)}
                className="w-full flex items-center justify-between p-5 text-right cursor-pointer hover:bg-accent/30 transition-colors"
              >
                <span className="font-medium text-secondary">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-200 flex-shrink-0 mr-4 ${
                  openItems.includes(i) ? 'rotate-180' : ''
                }`} />
              </button>
              <AnimatePresence>
                {openItems.includes(i) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-sm text-secondary/70 leading-relaxed border-t border-border pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
