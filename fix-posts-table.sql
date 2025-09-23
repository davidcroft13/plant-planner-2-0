-- Fix posts table schema
-- Add missing columns to posts table

-- First, let's see what columns exist
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'posts';

-- Add missing columns
ALTER TABLE posts ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE posts ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- Update existing posts to have default values
UPDATE posts SET 
  category = 'General',
  tags = '{}',
  content = COALESCE(content, ''),
  is_published = false
WHERE category IS NULL;

-- Create RLS policies for posts
CREATE POLICY IF NOT EXISTS "Users can view all posts" ON posts FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Users can insert their own posts" ON posts FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY IF NOT EXISTS "Users can update their own posts" ON posts FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY IF NOT EXISTS "Users can delete their own posts" ON posts FOR DELETE USING (auth.uid() = created_by);
