-- Test script to verify posts table structure
-- Run this to see what columns exist in your posts table

SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'posts' 
ORDER BY column_name;

-- Also check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'posts';
