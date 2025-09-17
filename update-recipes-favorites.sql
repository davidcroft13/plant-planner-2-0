-- Add is_favorite field to recipes table
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT FALSE;

-- Create courses table if it doesn't exist
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  duration INTEGER, -- in minutes
  difficulty TEXT DEFAULT 'beginner',
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meal_plans table
CREATE TABLE IF NOT EXISTS meal_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  duration_days INTEGER DEFAULT 7,
  difficulty TEXT DEFAULT 'easy',
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meal_plan_recipes table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS meal_plan_recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE CASCADE NOT NULL,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  day_number INTEGER NOT NULL,
  meal_type TEXT NOT NULL, -- breakfast, lunch, dinner, snack
  servings INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for courses
CREATE POLICY "Public can view published courses" ON courses
  FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Admins can manage courses" ON courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Create RLS policies for meal_plans
CREATE POLICY "Public can view published meal plans" ON meal_plans
  FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Admins can manage meal plans" ON meal_plans
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Create RLS policies for meal_plan_recipes
CREATE POLICY "Public can view meal plan recipes" ON meal_plan_recipes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM meal_plans 
      WHERE meal_plans.id = meal_plan_recipes.meal_plan_id 
      AND meal_plans.is_published = TRUE
    )
  );

CREATE POLICY "Admins can manage meal plan recipes" ON meal_plan_recipes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plan_recipes ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published);
CREATE INDEX IF NOT EXISTS idx_meal_plans_published ON meal_plans(is_published);
CREATE INDEX IF NOT EXISTS idx_meal_plans_featured ON meal_plans(is_featured);
CREATE INDEX IF NOT EXISTS idx_meal_plan_recipes_meal_plan ON meal_plan_recipes(meal_plan_id);
CREATE INDEX IF NOT EXISTS idx_recipes_favorite ON recipes(is_favorite);
