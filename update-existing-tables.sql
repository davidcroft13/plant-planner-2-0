-- Update existing tables for content management
-- Run these statements in your Supabase SQL Editor

-- 1. Add missing columns to users table (if not already present)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP WITH TIME ZONE;

-- Update the subscription_status check constraint to include 'trial'
ALTER TABLE users 
DROP CONSTRAINT IF EXISTS users_subscription_status_check;

ALTER TABLE users 
ADD CONSTRAINT users_subscription_status_check 
CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'trial'));

-- 2. Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
  instructions JSONB NOT NULL DEFAULT '[]'::jsonb,
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

-- 3. Create workouts table
CREATE TABLE IF NOT EXISTS workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  exercises JSONB NOT NULL DEFAULT '[]'::jsonb,
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

-- 4. Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
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

-- 5. Create posts table
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

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_recipes_published ON recipes(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_recipes_category ON recipes(category);
CREATE INDEX IF NOT EXISTS idx_recipes_tags ON recipes USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_workouts_published ON workouts(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_workouts_category ON workouts(category);
CREATE INDEX IF NOT EXISTS idx_workouts_tags ON workouts USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_tags ON courses USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_posts_featured ON posts(featured, published_at DESC);

-- 7. Enable Row Level Security
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS Policies
-- Drop existing policies first to avoid conflicts
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

-- Users can read published content
CREATE POLICY "Published content is viewable by everyone" ON recipes
  FOR SELECT USING (is_published = true);

CREATE POLICY "Published content is viewable by everyone" ON workouts
  FOR SELECT USING (is_published = true);

CREATE POLICY "Published content is viewable by everyone" ON courses
  FOR SELECT USING (is_published = true);

CREATE POLICY "Published content is viewable by everyone" ON posts
  FOR SELECT USING (is_published = true);

-- Admins can do everything
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

-- Users can read their own content
CREATE POLICY "Users can read their own content" ON recipes
  FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can read their own content" ON workouts
  FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can read their own content" ON courses
  FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can read their own content" ON posts
  FOR SELECT USING (created_by = auth.uid());
