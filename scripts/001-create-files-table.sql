-- Create the files table for storing file metadata
CREATE TABLE files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  filename TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT,
  password_hash TEXT,
  expires_at TIMESTAMPTZ,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT
);

-- Create index on slug for fast lookups
CREATE INDEX idx_files_slug ON files(slug);

-- Create index on expires_at for cleanup queries
CREATE INDEX idx_files_expires_at ON files(expires_at);

-- Enable RLS (public access for this use case - no auth required)
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read files (they still need password if protected)
CREATE POLICY "Allow public read" ON files FOR SELECT USING (true);

-- Allow anyone to insert files
CREATE POLICY "Allow public insert" ON files FOR INSERT WITH CHECK (true);

-- Allow anyone to update download count
CREATE POLICY "Allow public update" ON files FOR UPDATE USING (true);

-- Allow deletion for cleanup
CREATE POLICY "Allow public delete" ON files FOR DELETE USING (true);

-- Rate limiting table
CREATE TABLE rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  action TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(ip_address, action)
);

CREATE INDEX idx_rate_limits_ip ON rate_limits(ip_address, action);

ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public rate_limits" ON rate_limits FOR ALL USING (true);
