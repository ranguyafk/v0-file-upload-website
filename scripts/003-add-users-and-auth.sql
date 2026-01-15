-- Create users/profiles table for subscription management
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  plan_expires_at TIMESTAMP WITH TIME ZONE,
  max_file_size BIGINT NOT NULL DEFAULT 536870912, -- 500MB for free
  max_uploads_per_day INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Add user_id column to files table to link files to users
ALTER TABLE files ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_files_user_id ON files(user_id);

-- Rate limits for auth
CREATE TABLE IF NOT EXISTS auth_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  action TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on auth_rate_limits
ALTER TABLE auth_rate_limits ENABLE ROW LEVEL SECURITY;

-- Allow public access to rate limits (needed for anonymous rate limiting)
CREATE POLICY "Allow public auth rate limits" ON auth_rate_limits FOR ALL USING (true) WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_auth_rate_limits_ip ON auth_rate_limits(ip_address, action);
