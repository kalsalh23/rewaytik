-- =============================================
-- أنجز - Academic Services Migration
-- =============================================

-- 1. Graduation Projects Table
CREATE TABLE IF NOT EXISTS graduation_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'new',
  payment_status TEXT DEFAULT 'pending',
  payment_amount NUMERIC DEFAULT 0,
  payment_image_url TEXT,
  wallet_number TEXT,
  project_title TEXT NOT NULL,
  university TEXT NOT NULL,
  faculty TEXT NOT NULL,
  department TEXT NOT NULL,
  supervisor_name TEXT,
  language TEXT DEFAULT 'arabic',
  deadline DATE,
  project_idea TEXT,
  project_goal TEXT,
  problem TEXT,
  expected_results TEXT,
  required_sections JSONB DEFAULT '[]',
  page_count TEXT,
  font_style TEXT,
  font_size TEXT,
  citation_style TEXT,
  has_images BOOLEAN DEFAULT false,
  has_tables BOOLEAN DEFAULT false,
  additional_services JSONB DEFAULT '[]',
  additional_notes TEXT,
  internal_notes TEXT,
  final_file_url TEXT,
  timeline JSONB DEFAULT '[]',
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Presentations Table
CREATE TABLE IF NOT EXISTS presentations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'new',
  payment_status TEXT DEFAULT 'pending',
  payment_amount NUMERIC DEFAULT 0,
  payment_image_url TEXT,
  wallet_number TEXT,
  project_title TEXT NOT NULL,
  slide_count INTEGER DEFAULT 10,
  language TEXT DEFAULT 'arabic',
  visual_identity TEXT,
  university_logo_url TEXT,
  custom_colors JSONB DEFAULT '[]',
  has_charts BOOLEAN DEFAULT false,
  has_icons BOOLEAN DEFAULT false,
  has_transitions BOOLEAN DEFAULT false,
  additional_notes TEXT,
  internal_notes TEXT,
  final_file_url TEXT,
  timeline JSONB DEFAULT '[]',
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Academic Tasks Table
CREATE TABLE IF NOT EXISTS academic_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'new',
  payment_status TEXT DEFAULT 'pending',
  payment_amount NUMERIC DEFAULT 0,
  payment_image_url TEXT,
  wallet_number TEXT,
  course_name TEXT NOT NULL,
  university TEXT NOT NULL,
  major TEXT NOT NULL,
  task_type TEXT NOT NULL,
  task_description TEXT,
  instructions TEXT,
  requirements TEXT,
  language TEXT DEFAULT 'arabic',
  word_count TEXT,
  page_count TEXT,
  citation_style TEXT,
  additional_services JSONB DEFAULT '[]',
  additional_notes TEXT,
  internal_notes TEXT,
  final_file_url TEXT,
  timeline JSONB DEFAULT '[]',
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Research Circles Table
CREATE TABLE IF NOT EXISTS research_circles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'new',
  payment_status TEXT DEFAULT 'pending',
  payment_amount NUMERIC DEFAULT 0,
  payment_image_url TEXT,
  wallet_number TEXT,
  research_title TEXT NOT NULL,
  university TEXT NOT NULL,
  faculty TEXT NOT NULL,
  department TEXT NOT NULL,
  course_name TEXT,
  supervisor_name TEXT,
  research_type TEXT NOT NULL,
  topic TEXT,
  objectives TEXT,
  description TEXT,
  instructions TEXT,
  keywords TEXT,
  language TEXT DEFAULT 'arabic',
  page_count TEXT,
  word_count TEXT,
  font_style TEXT,
  font_size TEXT,
  citation_style TEXT,
  min_references TEXT,
  has_tables BOOLEAN DEFAULT false,
  has_images BOOLEAN DEFAULT false,
  additional_services JSONB DEFAULT '[]',
  additional_notes TEXT,
  internal_notes TEXT,
  final_file_url TEXT,
  delivery_date DATE,
  delivery_time TEXT,
  priority TEXT DEFAULT 'normal',
  timeline JSONB DEFAULT '[]',
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Academic Attachments Table (shared for all academic services)
CREATE TABLE IF NOT EXISTS academic_attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL,
  service_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size NUMERIC,
  file_type TEXT,
  category TEXT DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_graduation_projects_user ON graduation_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_graduation_projects_status ON graduation_projects(status);
CREATE INDEX IF NOT EXISTS idx_presentations_user ON presentations(user_id);
CREATE INDEX IF NOT EXISTS idx_presentations_status ON presentations(status);
CREATE INDEX IF NOT EXISTS idx_academic_tasks_user ON academic_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_academic_tasks_status ON academic_tasks(status);
CREATE INDEX IF NOT EXISTS idx_research_circles_user ON research_circles(user_id);
CREATE INDEX IF NOT EXISTS idx_research_circles_status ON research_circles(status);
CREATE INDEX IF NOT EXISTS idx_academic_attachments_order ON academic_attachments(order_id);

-- Enable RLS
ALTER TABLE graduation_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE presentations ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_attachments ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can see their own, admins can see all)
CREATE POLICY "Users can view own graduation projects" ON graduation_projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own graduation projects" ON graduation_projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own graduation projects" ON graduation_projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can do everything on graduation projects" ON graduation_projects USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can view own presentations" ON presentations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own presentations" ON presentations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own presentations" ON presentations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can do everything on presentations" ON presentations USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can view own academic tasks" ON academic_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own academic tasks" ON academic_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own academic tasks" ON academic_tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can do everything on academic tasks" ON academic_tasks USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can view own research circles" ON research_circles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own research circles" ON research_circles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own research circles" ON research_circles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can do everything on research circles" ON research_circles USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can view own academic attachments" ON academic_attachments FOR SELECT USING (EXISTS (SELECT 1 FROM graduation_projects WHERE id = order_id AND user_id = auth.uid()) OR EXISTS (SELECT 1 FROM presentations WHERE id = order_id AND user_id = auth.uid()) OR EXISTS (SELECT 1 FROM academic_tasks WHERE id = order_id AND user_id = auth.uid()) OR EXISTS (SELECT 1 FROM research_circles WHERE id = order_id AND user_id = auth.uid()));
CREATE POLICY "Users can insert academic attachments" ON academic_attachments FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can do everything on academic attachments" ON academic_attachments USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
