-- =============================================
-- أنجز - Fix: Add missing `files` column + Storage
-- =============================================

-- 1. Add missing columns
ALTER TABLE graduation_projects ADD COLUMN IF NOT EXISTS files JSONB DEFAULT '[]';
ALTER TABLE presentations ADD COLUMN IF NOT EXISTS files JSONB DEFAULT '[]';
ALTER TABLE academic_tasks ADD COLUMN IF NOT EXISTS files JSONB DEFAULT '[]';
ALTER TABLE research_circles ADD COLUMN IF NOT EXISTS files JSONB DEFAULT '[]';

-- 2. Create buckets if not exist
INSERT INTO storage.buckets (id, name, public) VALUES ('academic-uploads', 'academic-uploads', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('academic-final', 'academic-final', true) ON CONFLICT (id) DO NOTHING;

-- 3. Create storage policies using security definer function
DO $$
BEGIN
  -- academic-uploads policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Anyone can view academic-uploads') THEN
    EXECUTE 'CREATE POLICY "Anyone can view academic-uploads" ON storage.objects FOR SELECT USING (bucket_id = ''academic-uploads'')';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Authenticated can upload to academic-uploads') THEN
    EXECUTE 'CREATE POLICY "Authenticated can upload to academic-uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = ''academic-uploads'' AND auth.role() = ''authenticated'')';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Owners can update academic-uploads') THEN
    EXECUTE 'CREATE POLICY "Owners can update academic-uploads" ON storage.objects FOR UPDATE USING (bucket_id = ''academic-uploads'' AND auth.uid() = owner)';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Owners can delete academic-uploads') THEN
    EXECUTE 'CREATE POLICY "Owners can delete academic-uploads" ON storage.objects FOR DELETE USING (bucket_id = ''academic-uploads'' AND auth.uid() = owner)';
  END IF;

  -- academic-final policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Anyone can view academic-final') THEN
    EXECUTE 'CREATE POLICY "Anyone can view academic-final" ON storage.objects FOR SELECT USING (bucket_id = ''academic-final'')';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Authenticated can upload to academic-final') THEN
    EXECUTE 'CREATE POLICY "Authenticated can upload to academic-final" ON storage.objects FOR INSERT WITH CHECK (bucket_id = ''academic-final'' AND auth.role() = ''authenticated'')';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Owners can update academic-final') THEN
    EXECUTE 'CREATE POLICY "Owners can update academic-final" ON storage.objects FOR UPDATE USING (bucket_id = ''academic-final'' AND auth.uid() = owner)';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Owners can delete academic-final') THEN
    EXECUTE 'CREATE POLICY "Owners can delete academic-final" ON storage.objects FOR DELETE USING (bucket_id = ''academic-final'' AND auth.uid() = owner)';
  END IF;
END;
$$;
