-- Content Management Database Schema
-- This file contains all the tables needed for the Creator Portal and main site content

-- Recipes table
CREATE TABLE recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  ingredients JSONB NOT NULL, -- Array of ingredient objects
  instructions JSONB NOT NULL, -- Array of instruction steps
  prep_time INTEGER, -- in minutes
  cook_time INTEGER, -- in minutes
  servings INTEGER,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  category TEXT, -- e.g., 'breakfast', 'lunch', 'dinner', 'snack'
  tags TEXT[], -- Array of tags
  image_url TEXT,
  nutrition_info JSONB, -- calories, protein, carbs, etc.
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workouts table
CREATE TABLE workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  exercises JSONB NOT NULL, -- Array of exercise objects
  duration INTEGER, -- in minutes
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  category TEXT, -- e.g., 'strength', 'cardio', 'yoga', 'hiit'
  equipment TEXT[], -- Array of required equipment
  muscle_groups TEXT[], -- Array of targeted muscle groups
  tags TEXT[],
  image_url TEXT,
  video_url TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content JSONB NOT NULL, -- Course content structure
  duration INTEGER, -- in minutes
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  category TEXT, -- e.g., 'nutrition', 'fitness', 'wellness', 'cooking'
  prerequisites TEXT[],
  learning_objectives TEXT[],
  tags TEXT[],
  image_url TEXT,
  video_url TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts table (for blog posts, articles, etc.)
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL, -- Markdown content
  excerpt TEXT, -- Short description for previews
  category TEXT, -- e.g., 'nutrition', 'fitness', 'lifestyle', 'tips'
  tags TEXT[],
  image_url TEXT,
  featured BOOLEAN DEFAULT FALSE, -- For featured posts
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_recipes_published ON recipes(is_published, published_at DESC);
CREATE INDEX idx_recipes_category ON recipes(category);
CREATE INDEX idx_recipes_tags ON recipes USING GIN(tags);

CREATE INDEX idx_workouts_published ON workouts(is_published, published_at DESC);
CREATE INDEX idx_workouts_category ON workouts(category);
CREATE INDEX idx_workouts_tags ON workouts USING GIN(tags);

CREATE INDEX idx_courses_published ON courses(is_published, published_at DESC);
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_tags ON courses USING GIN(tags);

CREATE INDEX idx_posts_published ON posts(is_published, published_at DESC);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);
CREATE INDEX idx_posts_featured ON posts(featured, published_at DESC);

-- Enable Row Level Security
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for content management
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

-- Users can read their own unpublished content
CREATE POLICY "Users can read their own content" ON recipes
  FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can read their own content" ON workouts
  FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can read their own content" ON courses
  FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can read their own content" ON posts
  FOR SELECT USING (created_by = auth.uid());
