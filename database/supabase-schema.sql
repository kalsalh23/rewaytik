-- ============================
-- Supabase Schema for Riwayatek
-- Run this in Supabase SQL Editor
-- ============================

-- 1. Users table (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Book Types
CREATE TABLE IF NOT EXISTS book_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  name_ar TEXT NOT NULL,
  description TEXT,
  description_ar TEXT,
  icon TEXT,
  price NUMERIC,
  min_pages INT,
  max_pages INT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Gallery Items
CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT,
  title TEXT,
  title_ar TEXT NOT NULL,
  description TEXT,
  description_ar TEXT,
  book_type TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  book_type_id UUID REFERENCES book_types(id),
  status TEXT DEFAULT 'pending_payment',
  total_amount NUMERIC DEFAULT 0,
  character_name TEXT,
  age INT,
  nationality TEXT,
  hobbies JSONB DEFAULT '[]',
  qualities JSONB DEFAULT '[]',
  memories JSONB DEFAULT '[]',
  story_type TEXT,
  story_goal TEXT,
  client_message TEXT,
  images JSONB DEFAULT '[]',
  character_images JSONB DEFAULT '[]',
  eye_color TEXT,
  hair_color TEXT,
  height TEXT,
  skin_tone TEXT,
  build TEXT,
  shipping_address JSONB,
  timeline JSONB DEFAULT '[]',
  transaction_number TEXT,
  payment_notification_url TEXT,
  rejection_reason TEXT,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Contact Messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Site Settings
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT
);

-- 7. Site Banners (homepage slideshow)
CREATE TABLE IF NOT EXISTS site_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================
-- Enable Row Level Security
-- ============================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE manuscript_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE manuscript_attachments ENABLE ROW LEVEL SECURITY;

-- ============================
-- Helper function (avoids RLS recursion)
-- ============================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin');
END;
$$;

-- ============================
-- RLS Policies (using is_admin() to avoid infinite recursion)
-- ============================

-- Users: users can read/update their own data, admin can read all
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own data" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Orders: users see own, admin sees all
CREATE POLICY "Users can read own orders" ON orders FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own orders" ON orders FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin can update orders" ON orders FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin can delete orders" ON orders FOR DELETE USING (public.is_admin());

-- Gallery: public read, admin write
CREATE POLICY "Public can read gallery" ON gallery_items FOR SELECT USING (true);
CREATE POLICY "Admin can insert gallery" ON gallery_items FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin can update gallery" ON gallery_items FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin can delete gallery" ON gallery_items FOR DELETE USING (public.is_admin());

-- Contact Messages: public can insert, admin can read
CREATE POLICY "Anyone can submit contact" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can read contact" ON contact_messages FOR SELECT USING (public.is_admin());

-- Book Types: public read, admin write
CREATE POLICY "Public can read book types" ON book_types FOR SELECT USING (true);
CREATE POLICY "Admin can manage book types" ON book_types FOR ALL USING (public.is_admin());

-- Site Settings: admin only
CREATE POLICY "Admin can manage settings" ON site_settings FOR ALL USING (public.is_admin());
CREATE POLICY "Public can read settings" ON site_settings FOR SELECT USING (true);

-- Site Banners: public read, admin write
CREATE POLICY "Public can read banners" ON site_banners FOR SELECT USING (true);
CREATE POLICY "Admin can insert banners" ON site_banners FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin can delete banners" ON site_banners FOR DELETE USING (public.is_admin());

-- Manuscript Orders: users see own, admin sees all
CREATE POLICY "Users can read own manuscripts" ON manuscript_orders FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can create manuscripts" ON manuscript_orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own manuscripts" ON manuscript_orders FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin can update manuscripts" ON manuscript_orders FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin can delete manuscripts" ON manuscript_orders FOR DELETE USING (public.is_admin());

-- Manuscript Attachments: users see own, admin sees all
CREATE POLICY "Users can read own manuscript attachments" ON manuscript_attachments FOR SELECT USING (
  EXISTS (SELECT 1 FROM manuscript_orders WHERE id = manuscript_order_id AND (user_id = auth.uid() OR public.is_admin()))
);
CREATE POLICY "Users can insert manuscript attachments" ON manuscript_attachments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM manuscript_orders WHERE id = manuscript_order_id AND user_id = auth.uid())
);
CREATE POLICY "Admin can delete manuscript attachments" ON manuscript_attachments FOR DELETE USING (public.is_admin());

-- 8. Manuscript Orders (اصنع كتابك)
CREATE TABLE IF NOT EXISTS manuscript_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'new' CHECK (status IN (
    'new', 'under_review', 'awaiting_client', 'designing',
    'formatting', 'illustrating', 'final_review', 'ready_to_print', 'completed', 'cancelled'
  )),
  -- Step 1: Book Info
  book_title TEXT NOT NULL,
  author_name TEXT NOT NULL,
  show_author_on_cover BOOLEAN DEFAULT true,
  book_summary TEXT,
  book_language TEXT DEFAULT 'arabic' CHECK (book_language IN ('arabic', 'english', 'bilingual', 'other')),
  -- Step 2: Files
  manuscript_file_url TEXT,
  manuscript_file_name TEXT,
  manuscript_file_size NUMERIC,
  -- Step 4: Book Type
  book_category TEXT NOT NULL,
  -- Step 5: Visual Identity
  visual_styles JSONB DEFAULT '[]',
  -- Step 7: Internal Images
  internal_images_option TEXT DEFAULT 'none' CHECK (internal_images_option IN ('none', 'upload', 'designer')),
  -- Step 8: Page Layout
  page_layout TEXT DEFAULT 'designer' CHECK (page_layout IN ('luxury', 'classic', 'modern', 'simple', 'designer')),
  -- Step 9: Additional Services
  additional_services JSONB DEFAULT '[]',
  -- Step 10: Notes
  additional_notes TEXT,
  -- Admin fields
  internal_notes TEXT,
  final_file_url TEXT,
  estimated_days INT,
  -- Meta
  timeline JSONB DEFAULT '[]',
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Manuscript Order Attachments (صور إضافية)
CREATE TABLE IF NOT EXISTS manuscript_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manuscript_order_id UUID REFERENCES manuscript_orders(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT,
  file_size NUMERIC,
  file_type TEXT DEFAULT 'image',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================
-- Create admin user trigger
-- ============================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, name, email, phone, role, created_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    NOW()
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================
-- Seed Data
-- ============================

-- Seed Book Types
INSERT INTO book_types (name, name_ar, description_ar, icon, price, min_pages, max_pages, is_active) VALUES
  ('Childhood', 'قصة طفولة', 'وثق ذكريات طفولتك أو طفولة أطفالك في كتاب فاخر', '👶', 150000, 20, 30, true),
  ('Youth', 'قصة شباب', 'سجل مرحلة الشباب والإنجازات والطموحات', '🌟', 150000, 20, 30, true),
  ('Graduation', 'قصة تخرج', 'رحلة النجاح والتفوق من أول يوم دراسي حتى لحظة التخرج', '🎓', 175000, 25, 35, true),
  ('Success', 'قصة نجاح', 'سرد ملهم لرحلتك المهنية وإنجازاتك', '🏆', 200000, 30, 40, true),
  ('Love', 'قصة حب', 'أجمل مشاعر الحب والرومانسية في كتاب فاخر', '💕', 175000, 20, 30, true),
  ('Travel', 'قصة رحلة', 'أجمل ذكريات أسفارك ومغامراتك حول العالم', '✈️', 200000, 30, 40, true),
  ('Biography', 'سيرة ذاتية', 'سيرتك المهنية بقصة ملهمة تعكس مسيرتك', '💼', 250000, 40, 50, true),
  ('Gift', 'هدية مخصصة', 'هدية فريدة ومميزة لأعز الناس', '🎁', 150000, 20, 30, true),
  ('Family', 'قصة عائلة', 'تاريخ عائلتك وقصص الأجداد في كتاب ينتقل عبر الأجيال', '👨‍👩‍👧‍👦', 250000, 40, 60, true),
  ('Custom', 'قصة مخصصة', 'أي قصة أخرى تريد تخليدها', '✨', 0, 0, 0, true)
ON CONFLICT DO NOTHING;

-- Seed Gallery Items (6 real works)
INSERT INTO gallery_items (title_ar, title, description_ar, description, book_type, image_url, is_active) VALUES
  ('ذكريات الطفولة', 'Childhood Memories', 'قصة حقيقية لطفل نشأ في ريف حماه، يحكي عن أيام الطفولة البريئة بين حقول الزيتون وأصوات العصافير. كتاب يبعث الدفء في القلب ويأخذك في رحلة إلى الزمن الجميل.', 'A true story of a child growing up in the countryside of Hama, narrating innocent childhood days among olive fields and birdsongs.', 'أطفال', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600', true),
  ('رحلة الشباب', 'Youth Journey', 'قصة ملهمة لشاب سوري تجاوز الصعاب وحقق أحلامه. من شوارع دمشق القديمة إلى آفاق العالمية، يروي كيف تحولت التحديات إلى فرص.', 'An inspiring story of a Syrian youth who overcame obstacles and achieved his dreams. From the old streets of Damascus to global horizons.', 'شباب', 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=600', true),
  ('قصة حب من حلب', 'A Love Story from Aleppo', 'رواية حب حقيقية تجمع بين قلبي شابين في رحاب حلب القديمة. حكاية مؤثرة عن الحب الذي يتحدى الظروف وينتصر على المستحيل.', 'A true love story uniting two hearts in ancient Aleppo. A touching tale of love that defies circumstances and triumphs over the impossible.', 'حب', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600', true),
  ('سيرة الأجداد', 'Ancestors Legacy', 'توثيق شيق لسيرة عائلة عريقة تمتد عبر مئة عام. قصص الأجداد والآباء، الحكايات المتناقلة عبر الأجيال، والعبر التي شكلت هوية العائلة.', 'A fascinating documentation of a distinguished family lineage spanning a hundred years. Stories of ancestors passed down through generations.', 'عائلة', 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600', true),
  ('رحلة العلم والتعلم', 'The Journey of Knowledge', 'قصة نجاح ملهمة لطالب تفوق على نفسه ووصل إلى أعلى المراتب العلمية. يوثق رحلته من أول يوم دراسي إلى لحظة التخرج بالفخر.', 'An inspiring success story of a student who excelled and reached the highest academic ranks.', 'تخرج', 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600', true),
  ('مغامرات حول العالم', 'Adventures Around the World', 'يوميات مسافر سوري جاب أكثر من ٣٠ دولة. قصص مشوقة عن ثقافات مختلفة، عادات وتقاليد، ولحظات لا تنسى من رحلة استثنائية.', 'Travel diaries of a Syrian traveler who visited over 30 countries. Fascinating stories about different cultures, traditions, and unforgettable moments.', 'رحلة', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600', true)
ON CONFLICT DO NOTHING;

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('order-images', 'order-images', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('character-images', 'character-images', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-notifications', 'payment-notifications', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('site-banners', 'site-banners', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('manuscript-files', 'manuscript-files', false) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('manuscript-attachments', 'manuscript-attachments', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('manuscript-final', 'manuscript-final', false) ON CONFLICT DO NOTHING;

-- Storage policies
CREATE POLICY "Public can read order-images" ON storage.objects FOR SELECT USING (bucket_id = 'order-images');
CREATE POLICY "Authenticated can upload order-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'order-images' AND auth.role() = 'authenticated');
CREATE POLICY "Public can read character-images" ON storage.objects FOR SELECT USING (bucket_id = 'character-images');
CREATE POLICY "Authenticated can upload character-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'character-images' AND auth.role() = 'authenticated');
CREATE POLICY "Public can read payment-notifications" ON storage.objects FOR SELECT USING (bucket_id = 'payment-notifications');
CREATE POLICY "Authenticated can upload payment-notifications" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'payment-notifications' AND auth.role() = 'authenticated');
CREATE POLICY "Public can read site-banners" ON storage.objects FOR SELECT USING (bucket_id = 'site-banners');
CREATE POLICY "Admin can upload site-banners" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'site-banners' AND public.is_admin());
CREATE POLICY "Admin can delete site-banners" ON storage.objects FOR DELETE USING (bucket_id = 'site-banners' AND public.is_admin());

-- Manuscript Files (private - only owner and admin can read)
CREATE POLICY "Owner can read manuscript-files" ON storage.objects FOR SELECT USING (bucket_id = 'manuscript-files' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_admin()));
CREATE POLICY "Authenticated can upload manuscript-files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'manuscript-files' AND auth.role() = 'authenticated');
CREATE POLICY "Admin can delete manuscript-files" ON storage.objects FOR DELETE USING (bucket_id = 'manuscript-files' AND public.is_admin());

-- Manuscript Attachments (public read, authenticated upload)
CREATE POLICY "Public can read manuscript-attachments" ON storage.objects FOR SELECT USING (bucket_id = 'manuscript-attachments');
CREATE POLICY "Authenticated can upload manuscript-attachments" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'manuscript-attachments' AND auth.role() = 'authenticated');
CREATE POLICY "Admin can delete manuscript-attachments" ON storage.objects FOR DELETE USING (bucket_id = 'manuscript-attachments' AND public.is_admin());

-- Manuscript Final Files (private - only owner and admin can read)
CREATE POLICY "Owner can read manuscript-final" ON storage.objects FOR SELECT USING (bucket_id = 'manuscript-final' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_admin()));
CREATE POLICY "Admin can upload manuscript-final" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'manuscript-final' AND public.is_admin());
