# Database Schema Migration Resolution Guide

## Problem Summary

The application was experiencing `500 Internal Server Error` when uploading files or creating folders due to missing database schema migrations. Specifically, the `folder_id` column was missing from the `files` table.

## Solution Implemented

### 1. Automated Migration Detection

**Created `/lib/db-migrations.ts`**
- Comprehensive migration status checking
- Detects which migrations have been applied
- Provides detailed diagnostic information
- User-friendly and admin-specific error messages

**Created `/api/health/migrations` endpoint**
- Check migration status via HTTP GET request
- Returns different detail levels for admins vs. regular users
- Returns 503 status when critical migrations are missing
- Accessible at: `https://your-app.com/api/health/migrations`

### 2. Improved Error Handling

**Updated `/app/api/upload/route.ts`**
- Schema validation before file uploads
- User-friendly error messages for end users
- Detailed migration info for administrators in logs
- Links to migration status endpoint

**Updated `/app/api/folders/route.ts`**
- Schema validation for folder operations  
- Clear error messages with migration guidance
- Automatic detection of missing tables/columns

### 3. Migration Management Tools

**Created `/scripts/run-migrations.js`**
- CLI tool for checking migration status
- Displays current database state
- Provides SQL content for manual execution
- Step-by-step instructions for administrators

**Updated `/scripts/README.md`**
- Quick start guide for migration checking
- Clear instructions for applying migrations
- Example error messages and resolutions

## How to Verify the Fix

### Step 1: Check Migration Status

**Option A: Via API Endpoint**
```bash
curl https://your-app.com/api/health/migrations
```

**Option B: Via CLI Tool**
```bash
node scripts/run-migrations.js
```

**Expected Output (when migrations are missing):**
```json
{
  "status": "error",
  "message": "Missing X critical database migration(s)...",
  "details": {
    "totalMigrations": 5,
    "appliedMigrations": 2,
    "missingMigrations": 3,
    "missing": [
      {
        "name": "004-add-folders-table",
        "description": "Creates folders table and adds folder_id to files",
        "critical": true
      }
    ]
  }
}
```

### Step 2: Apply Missing Migrations

1. Log in to your [Supabase Dashboard](https://app.supabase.com)
2. Navigate to your project
3. Go to **SQL Editor**
4. Run the missing migration scripts in order:
   - `scripts/001-create-files-table.sql`
   - `scripts/002-add-title-and-views.sql`
   - `scripts/003-add-users-and-auth.sql`
   - `scripts/004-add-folders-table.sql`
   - `scripts/005-ensure-folder-id-column.sql`

### Step 3: Verify Migrations Were Applied

**Check via API:**
```bash
curl https://your-app.com/api/health/migrations
```

**Expected Output (when all migrations are applied):**
```json
{
  "status": "ok",
  "message": "All database migrations have been applied successfully.",
  "details": {
    "totalMigrations": 5,
    "appliedMigrations": 5,
    "missingMigrations": 0
  }
}
```

### Step 4: Test File Upload and Folder Creation

1. **Test File Upload:**
   - Navigate to the upload page
   - Upload a test file
   - Verify no 500 errors occur
   - Check that the file appears in your dashboard

2. **Test Folder Creation:**
   - Navigate to the dashboard
   - Create a new folder
   - Verify the folder appears in the list
   - Upload a file to the folder
   - Verify the file is associated with the folder

3. **Test Folder Upload:**
   - Upload a file and select a folder
   - Verify the file is saved to the correct folder
   - Check that folder_id is properly stored

## Error Messages Explained

### For End Users

When a migration is missing, users will see:
```
Unable to save file due to database schema issues. Please contact the administrator.
```

or

```
Folder functionality is currently unavailable due to database schema issues. Please contact the administrator.
```

These messages are intentionally generic to avoid exposing technical details to end users.

### For Administrators

Administrators (authenticated users) will see detailed messages in:
- API responses (when checking `/api/health/migrations`)
- Server logs
- Error responses with `adminMessage` field

Example admin message:
```
ADMIN NOTICE: 2 critical migration(s) missing.

Required actions:
1. Log in to Supabase Dashboard: https://app.supabase.com
2. Navigate to SQL Editor
3. Apply these migrations in order:
   1. scripts/004-add-folders-table.sql - Creates folders table and adds folder_id to files
   2. scripts/005-ensure-folder-id-column.sql - Verifies folder_id column exists (optional validation)
4. Restart the application

Current status:
- Applied: 3/5 migrations
- Missing (critical): 2
- Missing (optional): 0
```

## Testing Checklist

After applying migrations, verify the following:

- [ ] `/api/health/migrations` returns status "ok"
- [ ] File upload without folder works
- [ ] File upload to folder works
- [ ] Folder creation works
- [ ] Folder listing works
- [ ] No 500 errors in browser console
- [ ] No schema-related errors in server logs

## Troubleshooting

### Issue: Migration status endpoint returns 503

**Cause:** Critical migrations are still missing

**Solution:** Apply the missing migrations listed in the response

### Issue: Migration script shows SQL but doesn't apply it

**Cause:** The Node.js Supabase client cannot execute DDL statements directly

**Solution:** Copy the SQL from the script output and run it in Supabase Dashboard SQL Editor

### Issue: After applying migrations, status still shows missing

**Cause:** Application cache or connection pool

**Solution:** 
1. Restart the application
2. Clear any CDN caches
3. Check that migrations were actually applied by querying the database directly

## Benefits of This Solution

1. **Proactive Detection:** Errors are caught before they reach the database
2. **Clear Guidance:** Users and administrators get appropriate error messages
3. **Self-Service Diagnostics:** The `/api/health/migrations` endpoint allows admins to check status at any time
4. **Automated Checking:** The migration checking is integrated into the application logic
5. **No User Confusion:** End users see simple messages, admins get detailed info
6. **Easy to Extend:** New migrations can be easily added to the system

## Maintenance

When adding new migrations in the future:

1. Create the SQL migration file in `/scripts/`
2. Add the migration to the `REQUIRED_MIGRATIONS` array in `/lib/db-migrations.ts`
3. Add checking logic for the new tables/columns
4. Update `/scripts/README.md` with the new migration details
5. Test the migration checking logic
6. Deploy the code changes
7. Apply the migration in Supabase
8. Verify via `/api/health/migrations`

## Related Documentation

- `/scripts/README.md` - Detailed migration instructions
- `TROUBLESHOOTING.md` - General troubleshooting guide
- Supabase Documentation: https://supabase.com/docs

## Support

If you continue to experience issues:

1. Check `/api/health/migrations` for current status
2. Review server logs for detailed error messages
3. Verify all environment variables are set correctly
4. Ensure you have database admin privileges in Supabase
5. Contact support with the output from `/api/health/migrations`
