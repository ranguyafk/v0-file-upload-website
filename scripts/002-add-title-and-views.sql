-- Add title and view_count columns to files table
ALTER TABLE files ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE files ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE files ADD COLUMN IF NOT EXISTS owner_token TEXT;

-- Create index on owner_token for analytics lookups
CREATE INDEX IF NOT EXISTS idx_files_owner_token ON files(owner_token);
