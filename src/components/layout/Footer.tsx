import { Link } from 'react-router-dom'
import { BookOpen, Phone, Mail, MapPin, Instagram, Twitter, Facebook } from 'lucide-react'

const footerLinks = {
  'روابط سريعة': [
    { path: '/', label: 'الرئيسية' },
    { path: '/how-it-works', label: 'كيف يعمل' },
    { path: '/create-order', label: 'طلب كتاب فوري' },
    { path: '/academic-services', label: 'الخدمات الأكاديمية' },
    { path: '/pricing', label: 'الأسعار' },
    { path: '/gallery', label: 'معرض الأعمال' },
  ],
  'الدعم': [
    { path: '/faq', label: 'الأسئلة الشائعة' },
    { path: '/contact', label: 'تواصل معنا' },
    { path: '/about', label: 'من نحن' },
    { path: '/privacy', label: 'سياسة الخصوصية' },
    { path: '/terms', label: 'الشروط والأحكام' },
    { path: '/shipping', label: 'سياسة الشحن' },
  ],
}

export function Footer() {
  return (
    <footer className="gradient-dark text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">أنجز</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              أنجز... كل ما تحتاجه من خدمات الكتابة والتصميم في مكان واحد. نحول أفكارك إلى واقع باحترافية.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://www.instagram.com/riwaytak_vip/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-primary/20 flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-primary/20 flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-primary/20 flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="tel:+84382676210" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-primary/20 flex items-center justify-center transition-colors">
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-white/60 hover:text-primary text-sm transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-semibold mb-4">معلومات التواصل</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <Phone className="w-4 h-4 mt-0.5 text-primary" />
                <span dir="ltr">+84382676210</span>
              </li>
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <Mail className="w-4 h-4 mt-0.5 text-primary" />
                <span>theprogect8@gmail.com</span>
              </li>
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-primary" />
                <span>حماه - الجمهورية العربية السورية</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-custom py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">© {new Date().getFullYear()} أنجز. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-4 text-white/40 text-sm">
            <Link to="/privacy" className="hover:text-primary transition-colors">سياسة الخصوصية</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">الشروط والأحكام</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
