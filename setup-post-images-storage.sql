-- Create storage bucket for post images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for post-images bucket
CREATE POLICY IF NOT EXISTS "Anyone can view post images" ON storage.objects 
FOR SELECT USING (bucket_id = 'post-images');

CREATE POLICY IF NOT EXISTS "Authenticated users can upload post images" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'post-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY IF NOT EXISTS "Users can update their own post images" ON storage.objects 
FOR UPDATE USING (
  bucket_id = 'post-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY IF NOT EXISTS "Users can delete their own post images" ON storage.objects 
FOR DELETE USING (
  bucket_id = 'post-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
