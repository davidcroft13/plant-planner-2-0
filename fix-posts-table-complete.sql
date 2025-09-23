-- Complete fix for posts table - add ALL missing columns
-- This will ensure all required columns exist

-- First, let's check what columns currently exist
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'posts' ORDER BY column_name;

-- Add ALL missing columns one by one
ALTER TABLE posts ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS title TEXT NOT NULL;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE posts ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE posts ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE posts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Update existing posts to have proper values
UPDATE posts SET 
  title = COALESCE(title, 'Untitled Post'),
  description = COALESCE(description, ''),
  content = COALESCE(content, ''),
  category = COALESCE(category, 'General'),
  tags = COALESCE(tags, '{}'),
  is_published = COALESCE(is_published, false),
  created_at = COALESCE(created_at, NOW()),
  updated_at = COALESCE(updated_at, NOW())
WHERE title IS NULL OR description IS NULL OR content IS NULL;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view all posts" ON posts;
DROP POLICY IF EXISTS "Users can insert their own posts" ON posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON posts;

-- Create RLS policies for posts
CREATE POLICY "Users can view all posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Users can insert their own posts" ON posts FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own posts" ON posts FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their own posts" ON posts FOR DELETE USING (auth.uid() = created_by);

-- Enable RLS on posts table
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
