-- Fix workouts table by adding missing columns
-- Run this in your Supabase SQL Editor

-- Add missing columns to workouts table
DO $$ 
BEGIN
    -- Add category column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'workouts' AND column_name = 'category') THEN
        ALTER TABLE workouts ADD COLUMN category TEXT;
    END IF;

    -- Add difficulty column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'workouts' AND column_name = 'difficulty') THEN
        ALTER TABLE workouts ADD COLUMN difficulty TEXT;
    END IF;

    -- Add duration column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'workouts' AND column_name = 'duration') THEN
        ALTER TABLE workouts ADD COLUMN duration INTEGER;
    END IF;

    -- Add video_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'workouts' AND column_name = 'video_url') THEN
        ALTER TABLE workouts ADD COLUMN video_url TEXT;
    END IF;

    -- Add exercises column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'workouts' AND column_name = 'exercises') THEN
        ALTER TABLE workouts ADD COLUMN exercises JSONB DEFAULT '[]'::jsonb;
    END IF;

    -- Add published_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'workouts' AND column_name = 'published_at') THEN
        ALTER TABLE workouts ADD COLUMN published_at TIMESTAMP WITH TIME ZONE;
    END IF;

    -- Add created_by column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'workouts' AND column_name = 'created_by') THEN
        ALTER TABLE workouts ADD COLUMN created_by UUID REFERENCES auth.users(id);
    END IF;

    -- Add is_published column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'workouts' AND column_name = 'is_published') THEN
        ALTER TABLE workouts ADD COLUMN is_published BOOLEAN DEFAULT FALSE;
    END IF;
END $$;
