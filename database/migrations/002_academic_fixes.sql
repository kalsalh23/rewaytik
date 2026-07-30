-- =============================================
-- أنجز - Fix: Missing columns + Storage RLS
-- =============================================

-- 1. Add missing `files` column to all academic tables
ALTER TABLE graduation_projects ADD COLUMN IF NOT EXISTS files JSONB DEFAULT '[]';
ALTER TABLE presentations ADD COLUMN IF NOT EXISTS files JSONB DEFAULT '[]';
ALTER TABLE academic_tasks ADD COLUMN IF NOT EXISTS files JSONB DEFAULT '[]';
ALTER TABLE research_circles ADD COLUMN IF NOT EXISTS files JSONB DEFAULT '[]';

-- 2. Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public) VALUES ('academic-uploads', 'academic-uploads', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('academic-final', 'academic-final', true) ON CONFLICT (id) DO NOTHING;

-- 3. Storage RLS policies for academic-uploads
CREATE POLICY "Anyone can view academic-uploads" ON storage.objects FOR SELECT USING (bucket_id = 'academic-uploads');
CREATE POLICY "Authenticated users can upload to academic-uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'academic-uploads' AND auth.role() = 'authenticated');
CREATE POLICY "Owners can update academic-uploads" ON storage.objects FOR UPDATE USING (bucket_id = 'academic-uploads' AND auth.uid() = owner);
CREATE POLICY "Owners can delete academic-uploads" ON storage.objects FOR DELETE USING (bucket_id = 'academic-uploads' AND auth.uid() = owner);

-- 4. Storage RLS policies for academic-final
CREATE POLICY "Anyone can view academic-final" ON storage.objects FOR SELECT USING (bucket_id = 'academic-final');
CREATE POLICY "Authenticated users can upload to academic-final" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'academic-final' AND auth.role() = 'authenticated');
CREATE POLICY "Owners can update academic-final" ON storage.objects FOR UPDATE USING (bucket_id = 'academic-final' AND auth.uid() = owner);
CREATE POLICY "Owners can delete academic-final" ON storage.objects FOR DELETE USING (bucket_id = 'academic-final' AND auth.uid() = owner);

-- 5. Enable RLS on storage buckets (if not already)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
