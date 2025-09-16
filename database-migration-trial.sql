-- Add trial_ends_at column to users table
ALTER TABLE public.users 
ADD COLUMN trial_ends_at TIMESTAMP WITH TIME ZONE;

-- Update existing users to have trial_ends_at set to 7 days from creation
UPDATE public.users 
SET trial_ends_at = created_at + INTERVAL '7 days'
WHERE subscription_status = 'trial' AND trial_ends_at IS NULL;

-- Set default trial_ends_at for future trial users
-- This will be handled in the application code when creating new users
