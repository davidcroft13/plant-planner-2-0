-- Step-by-step table fixes
-- Run these one section at a time in Supabase SQL Editor

-- 1. First, let's check what tables exist and their structure
-- Run this to see what we're working with:
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('recipes', 'workouts', 'courses', 'posts');

-- 2. If the tables don't exist, create them:
CREATE TABLE IF NOT EXISTS recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  ingredients JSONB DEFAULT '[]'::jsonb,
  instructions JSONB DEFAULT '[]'::jsonb,
  prep_time INTEGER,
  cook_time INTEGER,
  servings INTEGER,
  difficulty TEXT DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  nutrition_info JSONB DEFAULT '{}'::jsonb,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  exercises JSONB DEFAULT '[]'::jsonb,
  duration INTEGER,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  category TEXT,
  equipment TEXT[] DEFAULT '{}',
  muscle_groups TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  video_url TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content JSONB DEFAULT '{}'::jsonb,
  duration INTEGER,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  category TEXT,
  prerequisites TEXT[] DEFAULT '{}',
  learning_objectives TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  video_url TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. If tables exist but are missing columns, add them:
-- Check if is_published column exists, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'is_published') THEN
        ALTER TABLE recipes ADD COLUMN is_published BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workouts' AND column_name = 'is_published') THEN
        ALTER TABLE workouts ADD COLUMN is_published BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'is_published') THEN
        ALTER TABLE courses ADD COLUMN is_published BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'is_published') THEN
        ALTER TABLE posts ADD COLUMN is_published BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- 4. Add other missing columns if needed
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'published_at') THEN
        ALTER TABLE recipes ADD COLUMN published_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workouts' AND column_name = 'published_at') THEN
        ALTER TABLE workouts ADD COLUMN published_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'published_at') THEN
        ALTER TABLE courses ADD COLUMN published_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'published_at') THEN
        ALTER TABLE posts ADD COLUMN published_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- 5. Enable RLS
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 6. Create indexes
CREATE INDEX IF NOT EXISTS idx_recipes_published ON recipes(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_workouts_published ON workouts(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(is_published, published_at DESC);

-- 7. Drop existing policies if they exist
DROP POLICY IF EXISTS "Published content is viewable by everyone" ON recipes;
DROP POLICY IF EXISTS "Published content is viewable by everyone" ON workouts;
DROP POLICY IF EXISTS "Published content is viewable by everyone" ON courses;
DROP POLICY IF EXISTS "Published content is viewable by everyone" ON posts;

DROP POLICY IF EXISTS "Admins can manage all content" ON recipes;
DROP POLICY IF EXISTS "Admins can manage all content" ON workouts;
DROP POLICY IF EXISTS "Admins can manage all content" ON courses;
DROP POLICY IF EXISTS "Admins can manage all content" ON posts;

DROP POLICY IF EXISTS "Users can read their own content" ON recipes;
DROP POLICY IF EXISTS "Users can read their own content" ON workouts;
DROP POLICY IF EXISTS "Users can read their own content" ON courses;
DROP POLICY IF EXISTS "Users can read their own content" ON posts;

-- 8. Create new policies
CREATE POLICY "Published content is viewable by everyone" ON recipes
  FOR SELECT USING (is_published = true);

CREATE POLICY "Published content is viewable by everyone" ON workouts
  FOR SELECT USING (is_published = true);

CREATE POLICY "Published content is viewable by everyone" ON courses
  FOR SELECT USING (is_published = true);

CREATE POLICY "Published content is viewable by everyone" ON posts
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage all content" ON recipes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage all content" ON workouts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage all content" ON courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage all content" ON posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can read their own content" ON recipes
  FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can read their own content" ON workouts
  FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can read their own content" ON courses
  FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can read their own content" ON posts
  FOR SELECT USING (created_by = auth.uid());
