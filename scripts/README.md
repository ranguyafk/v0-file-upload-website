# Database Migration Instructions

## Issue: Missing folder_id Column

If you're seeing the error: `"Failed to save file metadata: Could not find the 'folder_id' column of 'files' in the schema cache"`, it means the database migrations haven't been fully applied.

## Solution: Apply Database Migrations

### Option 1: Using Supabase Dashboard (Recommended)

1. Log in to your [Supabase Dashboard](https://app.supabase.com)
2. Navigate to your project
3. Go to **SQL Editor**
4. Run the following migration scripts in order:

   **Step 1:** Run `scripts/004-add-folders-table.sql`
   - This creates the folders table and adds the folder_id column to files

   **Step 2:** (Optional) Run `scripts/005-ensure-folder-id-column.sql`
   - This verifies the folder_id column exists and provides diagnostic output

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Apply the folders migration
supabase db push --file scripts/004-add-folders-table.sql

# Verify the schema
supabase db push --file scripts/005-ensure-folder-id-column.sql
```

### Option 3: Manual SQL Execution

Connect to your Supabase database using any PostgreSQL client and run:

```sql
-- From scripts/004-add-folders-table.sql
-- Creates folders table and adds folder_id column to files table

-- From scripts/005-ensure-folder-id-column.sql  
-- Ensures folder_id column exists and is properly indexed
```

## Verification

After applying the migrations, verify they worked:

1. **Check the files table:**
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'files' AND column_name = 'folder_id';
   ```

   Expected result: One row showing `folder_id | uuid`

2. **Test file upload:**
   - Try uploading a file through the web interface
   - The error should no longer appear

## Migration Scripts Overview

| Script | Purpose | Required |
|--------|---------|----------|
| 001-create-files-table.sql | Creates initial files table | ✅ Yes |
| 002-add-title-and-views.sql | Adds title and view tracking | ✅ Yes |
| 003-add-users-and-auth.sql | Adds user authentication support | ✅ Yes |
| 004-add-folders-table.sql | Adds folders and folder_id column | ✅ Yes |
| 005-ensure-folder-id-column.sql | Verifies folder_id exists | ⚠️ Optional |

## What the Migrations Do

### 004-add-folders-table.sql
- Creates the `folders` table for organizing files
- Adds `folder_id` column to `files` table
- Creates proper indexes for performance
- Sets up Row Level Security (RLS) policies

### 005-ensure-folder-id-column.sql
- Ensures the `folder_id` column exists (idempotent)
- Creates index if missing
- Provides diagnostic output to confirm success

## Expected Schema After Migration

### Files Table
```sql
files (
  id UUID PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  filename TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT,
  password_hash TEXT,
  expires_at TIMESTAMPTZ,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  title TEXT,                        -- Added by 002
  view_count INTEGER DEFAULT 0,      -- Added by 002
  owner_token TEXT,                  -- Added by 002
  user_id UUID,                      -- Added by 003
  folder_id UUID                     -- Added by 004
)
```

### Folders Table
```sql
folders (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  parent_id UUID REFERENCES folders(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, parent_id, name)
)
```

## Common Issues

### Issue: "Table 'folders' doesn't exist"
**Solution:** Run script 004 first, which creates both the folders table and adds folder_id to files

### Issue: "Permission denied"
**Solution:** Ensure you're running migrations with database owner privileges

### Issue: "Column already exists"
**Solution:** This is normal - the migrations use `IF NOT EXISTS` and are safe to re-run

## Automated Schema Verification

The application now includes automatic schema verification that:
- Checks if folder_id column exists when files are uploaded to folders
- Provides clear error messages if migrations are missing
- Logs detailed diagnostic information for administrators

If you see schema-related errors in the logs, follow the migration steps above.

## Support

If you continue to experience issues after running the migrations:
1. Check the server logs for detailed error information
2. Verify all environment variables are set correctly
3. Ensure you have the latest code from the repository
4. Contact support with the error logs and migration history
