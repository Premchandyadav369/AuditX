-- Add tables for advanced features

-- Bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL, -- 'document', 'vendor', 'transaction', 'case'
  resource_id UUID NOT NULL,
  name TEXT,
  notes TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved searches table
CREATE TABLE IF NOT EXISTS saved_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  search_type TEXT NOT NULL, -- 'documents', 'transactions', 'vendors'
  filters JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity timeline table
CREATE TABLE IF NOT EXISTS activity_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'uploaded', 'analyzed', 'flagged', 'resolved', etc.
  resource_type TEXT NOT NULL,
  resource_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document versions table
CREATE TABLE IF NOT EXISTS document_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  file_url TEXT NOT NULL,
  changes TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resource tags junction table
CREATE TABLE IF NOT EXISTS resource_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tag_id, resource_type, resource_id)
);

-- Batch operations table
CREATE TABLE IF NOT EXISTS batch_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  operation_type TEXT NOT NULL, -- 'analyze', 'export', 'update', 'delete'
  resource_type TEXT NOT NULL,
  status TEXT DEFAULT 'processing', -- 'processing', 'completed', 'failed'
  total_items INTEGER,
  processed_items INTEGER DEFAULT 0,
  results JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Widget preferences table
CREATE TABLE IF NOT EXISTS dashboard_widgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  widget_type TEXT NOT NULL,
  position INTEGER NOT NULL,
  size TEXT DEFAULT 'medium', -- 'small', 'medium', 'large'
  config JSONB,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_resource ON bookmarks(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_saved_searches_user ON saved_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_timeline_user ON activity_timeline(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_timeline_created ON activity_timeline(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_document_versions_document ON document_versions(document_id);
CREATE INDEX IF NOT EXISTS idx_resource_tags_resource ON resource_tags(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_batch_operations_user ON batch_operations(user_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_widgets_user ON dashboard_widgets(user_id);

-- Enable RLS
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_widgets ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own bookmarks" ON bookmarks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own saved searches" ON saved_searches
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view all activity" ON activity_timeline
  FOR SELECT USING (true);

CREATE POLICY "Users can create activity logs" ON activity_timeline
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view document versions" ON document_versions
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view tags" ON tags
  FOR SELECT USING (true);

CREATE POLICY "Users can create tags" ON tags
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view resource tags" ON resource_tags
  FOR SELECT USING (true);

CREATE POLICY "Users can manage resource tags" ON resource_tags
  FOR ALL USING (true);

CREATE POLICY "Users can manage their own batch operations" ON batch_operations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own dashboard widgets" ON dashboard_widgets
  FOR ALL USING (auth.uid() = user_id);
