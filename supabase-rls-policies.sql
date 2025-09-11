-- Supabase Row Level Security (RLS) Policies
-- Run this in your Supabase SQL Editor after running the main database-schema.sql

-- Enable RLS on all tables (if not already enabled)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plan_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_workout_progress ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can read own data" ON users
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON users
FOR INSERT WITH CHECK (auth.uid() = id);

-- Recipes table policies
CREATE POLICY "Recipes are viewable by everyone when published" ON recipes
FOR SELECT USING (status = 'published');

CREATE POLICY "Users can view their own recipes" ON recipes
FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can insert their own recipes" ON recipes
FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own recipes" ON recipes
FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own recipes" ON recipes
FOR DELETE USING (auth.uid() = created_by);

CREATE POLICY "Admins can manage all recipes" ON recipes
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Meal plans table policies
CREATE POLICY "Meal plans are viewable by everyone when published" ON meal_plans
FOR SELECT USING (status = 'published');

CREATE POLICY "Users can view their own meal plans" ON meal_plans
FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can insert their own meal plans" ON meal_plans
FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own meal plans" ON meal_plans
FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own meal plans" ON meal_plans
FOR DELETE USING (auth.uid() = created_by);

CREATE POLICY "Admins can manage all meal plans" ON meal_plans
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Meal plan recipes junction table policies
CREATE POLICY "Meal plan recipes are viewable by everyone" ON meal_plan_recipes
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM meal_plans 
    WHERE id = meal_plan_id AND status = 'published'
  )
);

CREATE POLICY "Users can manage their own meal plan recipes" ON meal_plan_recipes
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM meal_plans 
    WHERE id = meal_plan_id AND created_by = auth.uid()
  )
);

CREATE POLICY "Admins can manage all meal plan recipes" ON meal_plan_recipes
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Courses table policies
CREATE POLICY "Courses are viewable by everyone when published" ON courses
FOR SELECT USING (status = 'published');

CREATE POLICY "Users can view their own courses" ON courses
FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can insert their own courses" ON courses
FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own courses" ON courses
FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own courses" ON courses
FOR DELETE USING (auth.uid() = created_by);

CREATE POLICY "Admins can manage all courses" ON courses
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Course lessons table policies
CREATE POLICY "Course lessons are viewable by everyone" ON course_lessons
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM courses 
    WHERE id = course_id AND status = 'published'
  )
);

CREATE POLICY "Users can manage their own course lessons" ON course_lessons
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM courses 
    WHERE id = course_id AND created_by = auth.uid()
  )
);

CREATE POLICY "Admins can manage all course lessons" ON course_lessons
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Workouts table policies
CREATE POLICY "Workouts are viewable by everyone when published" ON workouts
FOR SELECT USING (status = 'published');

CREATE POLICY "Users can view their own workouts" ON workouts
FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can insert their own workouts" ON workouts
FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own workouts" ON workouts
FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own workouts" ON workouts
FOR DELETE USING (auth.uid() = created_by);

CREATE POLICY "Admins can manage all workouts" ON workouts
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Posts table policies
CREATE POLICY "Posts are viewable by everyone when published" ON posts
FOR SELECT USING (status = 'published');

CREATE POLICY "Users can view their own posts" ON posts
FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can insert their own posts" ON posts
FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own posts" ON posts
FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own posts" ON posts
FOR DELETE USING (auth.uid() = created_by);

CREATE POLICY "Admins can manage all posts" ON posts
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- User subscriptions table policies
CREATE POLICY "Users can view their own subscriptions" ON user_subscriptions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" ON user_subscriptions
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON user_subscriptions
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all subscriptions" ON user_subscriptions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- User favorites table policies
CREATE POLICY "Users can view their own favorites" ON user_favorites
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" ON user_favorites
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON user_favorites
FOR DELETE USING (auth.uid() = user_id);

-- User course progress table policies
CREATE POLICY "Users can view their own course progress" ON user_course_progress
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own course progress" ON user_course_progress
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own course progress" ON user_course_progress
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all course progress" ON user_course_progress
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- User workout progress table policies
CREATE POLICY "Users can view their own workout progress" ON user_workout_progress
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout progress" ON user_workout_progress
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout progress" ON user_workout_progress
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all workout progress" ON user_workout_progress
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
