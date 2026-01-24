-- Migration to ensure folder_id column exists in files table
-- This is an idempotent migration that can be safely run multiple times

-- Add folder_id column to files table if it doesn't exist
-- This references the folders table and sets NULL on folder deletion
ALTER TABLE files ADD COLUMN IF NOT EXISTS folder_id UUID REFERENCES folders(id) ON DELETE SET NULL;

-- Create index for faster lookups if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_files_folder_id ON files(folder_id);

-- Verify the column exists by selecting it (this will fail if column doesn't exist)
-- This helps validate the migration was successful
DO $$
BEGIN
  -- Try to access the folder_id column
  PERFORM folder_id FROM files LIMIT 0;
  RAISE NOTICE 'folder_id column verified successfully in files table';
EXCEPTION
  WHEN undefined_column THEN
    RAISE EXCEPTION 'folder_id column still missing after migration attempt';
END $$;
