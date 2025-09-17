-- Setup Supabase Storage for recipe and workout images
-- Run this in your Supabase SQL Editor

-- Create storage bucket for recipe images
INSERT INTO storage.buckets (id, name, public)
VALUES ('recipe-images', 'recipe-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for workout images
INSERT INTO storage.buckets (id, name, public)
VALUES ('workout-images', 'workout-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for workout videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('workout-videos', 'workout-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for exercise images
INSERT INTO storage.buckets (id, name, public)
VALUES ('exercise-images', 'exercise-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for exercise videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('exercise-videos', 'exercise-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for post images
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for the storage buckets
CREATE POLICY "Public Access Recipes" ON storage.objects
FOR SELECT USING (bucket_id = 'recipe-images');

CREATE POLICY "Public Access Workout Images" ON storage.objects
FOR SELECT USING (bucket_id = 'workout-images');

CREATE POLICY "Public Access Workout Videos" ON storage.objects
FOR SELECT USING (bucket_id = 'workout-videos');

CREATE POLICY "Public Access Exercise Images" ON storage.objects
FOR SELECT USING (bucket_id = 'exercise-images');

CREATE POLICY "Public Access Exercise Videos" ON storage.objects
FOR SELECT USING (bucket_id = 'exercise-videos');

CREATE POLICY "Public Access Post Images" ON storage.objects
FOR SELECT USING (bucket_id = 'post-images');

CREATE POLICY "Authenticated users can upload recipes" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'recipe-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can upload workout images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'workout-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can upload workout videos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'workout-videos' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can upload exercise images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'exercise-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can upload exercise videos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'exercise-videos' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can upload post images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'post-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own recipe images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'recipe-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own workout images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'workout-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own workout videos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'workout-videos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own exercise images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'exercise-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own exercise videos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'exercise-videos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own post images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'post-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own recipe images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'recipe-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own workout images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'workout-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own workout videos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'workout-videos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own exercise images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'exercise-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own exercise videos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'exercise-videos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own post images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'post-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
