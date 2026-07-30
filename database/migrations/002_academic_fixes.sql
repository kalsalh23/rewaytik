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

-- 3. Create storage policies (try with elevated role)
DO $$
BEGIN
  SET ROLE supabase_storage_admin;

  -- academic-uploads
  EXECUTE 'CREATE POLICY IF NOT EXISTS "Anyone can view academic-uploads" ON storage.objects FOR SELECT USING (bucket_id = ''academic-uploads'')';
  EXECUTE 'CREATE POLICY IF NOT EXISTS "Authenticated can upload to academic-uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = ''academic-uploads'' AND auth.role() = ''authenticated'')';
  EXECUTE 'CREATE POLICY IF NOT EXISTS "Owners can update academic-uploads" ON storage.objects FOR UPDATE USING (bucket_id = ''academic-uploads'' AND auth.uid() = owner)';
  EXECUTE 'CREATE POLICY IF NOT EXISTS "Owners can delete academic-uploads" ON storage.objects FOR DELETE USING (bucket_id = ''academic-uploads'' AND auth.uid() = owner)';

  -- academic-final
  EXECUTE 'CREATE POLICY IF NOT EXISTS "Anyone can view academic-final" ON storage.objects FOR SELECT USING (bucket_id = ''academic-final'')';
  EXECUTE 'CREATE POLICY IF NOT EXISTS "Authenticated can upload to academic-final" ON storage.objects FOR INSERT WITH CHECK (bucket_id = ''academic-final'' AND auth.role() = ''authenticated'')';
  EXECUTE 'CREATE POLICY IF NOT EXISTS "Owners can update academic-final" ON storage.objects FOR UPDATE USING (bucket_id = ''academic-final'' AND auth.uid() = owner)';
  EXECUTE 'CREATE POLICY IF NOT EXISTS "Owners can delete academic-final" ON storage.objects FOR DELETE USING (bucket_id = ''academic-final'' AND auth.uid() = owner)';

  RESET ROLE;
EXCEPTION WHEN OTHERS THEN
  RESET ROLE;
  RAISE;
END;
$$;
