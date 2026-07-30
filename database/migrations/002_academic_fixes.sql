-- =============================================
-- أنجز - Fix: Add missing `files` column
-- =============================================

ALTER TABLE graduation_projects ADD COLUMN IF NOT EXISTS files JSONB DEFAULT '[]';
ALTER TABLE presentations ADD COLUMN IF NOT EXISTS files JSONB DEFAULT '[]';
ALTER TABLE academic_tasks ADD COLUMN IF NOT EXISTS files JSONB DEFAULT '[]';
ALTER TABLE research_circles ADD COLUMN IF NOT EXISTS files JSONB DEFAULT '[]';

-- =============================================
-- إنشاء buckets التخزين (إن لم تكن موجودة)
-- =============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('academic-uploads', 'academic-uploads', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('academic-final', 'academic-final', true) ON CONFLICT (id) DO NOTHING;
