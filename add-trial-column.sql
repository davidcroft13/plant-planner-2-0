-- Add trial_ends_at column to users table
-- Run this in your Supabase SQL editor

ALTER TABLE users 
ADD COLUMN trial_ends_at TIMESTAMP WITH TIME ZONE;

-- Update the subscription_status check constraint to include 'trial'
ALTER TABLE users 
DROP CONSTRAINT IF EXISTS users_subscription_status_check;

ALTER TABLE users 
ADD CONSTRAINT users_subscription_status_check 
CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'trial'));

-- Add an index for better performance
CREATE INDEX IF NOT EXISTS idx_users_trial_ends_at ON users(trial_ends_at);
