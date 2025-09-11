-- Supabase Storage Buckets Setup
-- Run this in your Supabase SQL Editor

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('recipe-images', 'recipe-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('workout-videos', 'workout-videos', true, 52428800, ARRAY['video/mp4', 'video/webm', 'video/quicktime']),
  ('course-content', 'course-content', true, 104857600, ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'application/pdf', 'image/jpeg', 'image/png']),
  ('user-uploads', 'user-uploads', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']),
  ('profile-pictures', 'profile-pictures', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']);

-- Storage policies for recipe-images bucket
CREATE POLICY "Recipe images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'recipe-images');

CREATE POLICY "Authenticated users can upload recipe images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'recipe-images' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'recipes'
);

CREATE POLICY "Users can update their own recipe images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'recipe-images' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'recipes'
);

CREATE POLICY "Users can delete their own recipe images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'recipe-images' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'recipes'
);

-- Storage policies for workout-videos bucket
CREATE POLICY "Workout videos are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'workout-videos');

CREATE POLICY "Authenticated users can upload workout videos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'workout-videos' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'workouts'
);

CREATE POLICY "Users can update their own workout videos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'workout-videos' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'workouts'
);

CREATE POLICY "Users can delete their own workout videos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'workout-videos' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'workouts'
);

-- Storage policies for course-content bucket
CREATE POLICY "Course content is publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'course-content');

CREATE POLICY "Authenticated users can upload course content" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'course-content' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'courses'
);

CREATE POLICY "Users can update their own course content" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'course-content' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'courses'
);

CREATE POLICY "Users can delete their own course content" ON storage.objects
FOR DELETE USING (
  bucket_id = 'course-content' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'courses'
);

-- Storage policies for user-uploads bucket (private)
CREATE POLICY "Users can view their own uploads" ON storage.objects
FOR SELECT USING (
  bucket_id = 'user-uploads' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can upload to their own folder" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'user-uploads' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own uploads" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'user-uploads' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own uploads" ON storage.objects
FOR DELETE USING (
  bucket_id = 'user-uploads' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Storage policies for profile-pictures bucket
CREATE POLICY "Profile pictures are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'profile-pictures');

CREATE POLICY "Users can upload their own profile picture" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profile-pictures' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own profile picture" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'profile-pictures' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own profile picture" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profile-pictures' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
