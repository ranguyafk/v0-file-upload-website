# Troubleshooting Guide - File Upload and Folder Creation

This guide helps debug common issues with file upload and folder creation functionality.

## Common Error Codes

### 400 Bad Request

**Possible Causes:**

1. **Invalid request format**
   - Error: "Invalid request format"
   - Solution: Ensure request body is valid JSON for folder operations or FormData for file uploads

2. **Missing required fields**
   - Folder creation: "Folder name is required"
   - File upload: "No file provided"
   - Solution: Verify all required fields are included in the request

3. **Invalid field values**
   - "Folder name too long" - Folder names must be ≤100 characters
   - "File too large. Maximum size is 1GB." - Reduce file size
   - "File is empty" - File must have content
   - "File must have a valid name" - File name is required
   - "Invalid custom URL" - Custom URLs must be 3-32 characters (alphanumeric, underscores, and dashes allowed)

4. **Invalid UUID format**
   - "Invalid folder ID format"
   - "Invalid parent folder ID format"
   - Solution: Ensure folder_id and parent_id are valid UUIDs

5. **Parent folder not found**
   - "Invalid parent folder or parent folder not found"
   - Solution: Verify the parent folder exists and belongs to the user

6. **Folder not empty**
   - "Cannot delete folder with subfolders"
   - "Cannot delete folder with files"
   - Solution: Delete or move contents before deleting folder

### 401 Unauthorized

**Possible Causes:**

1. **Not authenticated**
   - Error: "Unauthorized"
   - Solution: User must be logged in to create folders or upload files to folders

2. **Wrong user**
   - Attempting to access another user's folder or file
   - Solution: Verify user has ownership of the resource

### 404 Not Found

**Possible Causes:**

1. **Folder doesn't exist**
   - Error: "Folder not found"
   - Solution: Verify the folder ID is correct

2. **File doesn't exist**
   - Error: "File not found"
   - Solution: Verify the file ID is correct

### 409 Conflict

**Possible Causes:**

1. **Duplicate folder name**
   - Error: "A folder with this name already exists here"
   - Solution: Use a different folder name or rename existing folder

2. **Duplicate custom URL**
   - Error: "This custom URL is already taken"
   - Solution: Choose a different custom URL

### 429 Too Many Requests

**Possible Causes:**

1. **Rate limit exceeded**
   - Error: "Rate limit exceeded. Try again later."
   - Solution: Wait before retrying (limit: 10 uploads per hour per IP)

### 500 Internal Server Error

**Possible Causes:**

1. **Server configuration error**
   - Missing environment variables (Supabase URL, Supabase Key, Blob Token)
   - Solution: Verify all environment variables are set correctly

2. **Database errors**
   - Connection issues
   - RLS policy violations
   - Query errors
   - Solution: Check server logs for detailed error messages

3. **Blob storage errors**
   - Failed to upload file to Vercel Blob
   - Solution: Check Blob storage configuration and quota

4. **Uncaught exceptions**
   - Check server logs for stack traces
   - Solution: Report error details to developers

## Debugging Steps

### For File Upload Issues

1. **Check browser console** for client-side errors
2. **Verify file properties**:
   - File size ≤ 1GB
   - File has a valid name
   - File is not empty
3. **Check authentication** - User should be logged in if uploading to a folder
4. **Verify folder ID** - If uploading to a folder, ensure folder_id is valid
5. **Check server logs** for detailed error information

### For Folder Creation Issues

1. **Check browser console** for client-side errors
2. **Verify folder name**:
   - Not empty
   - ≤100 characters
   - No duplicate names in the same parent folder
3. **Check authentication** - User must be logged in
4. **Verify parent folder** - If creating a subfolder, ensure parent_id is valid
5. **Check server logs** for detailed error information

### For Folder Deletion Issues

1. **Ensure folder is empty**:
   - No subfolders
   - No files
2. **Check ownership** - User must own the folder
3. **Verify folder ID** - Ensure folder_id is valid

## Server Logs

Enhanced logging now includes:

- **Request context**: User ID, file/folder IDs, names
- **Error details**: Error codes, messages, hints from database
- **Stack traces**: For debugging unexpected errors
- **Rate limiting**: Logs when rate limits are exceeded

### Log Format Examples

**Successful operations:**
```
[Info] Folder created: { folderId: 'xxx', name: 'My Folder', userId: 'yyy' }
```

**Database errors:**
```
[Error] Create folder error: {
  error: { code: '23505', message: 'duplicate key value...' },
  folderName: 'My Folder',
  userId: 'xxx',
  parentId: 'yyy'
}
```

**Validation errors:**
```
[Error] Folder validation error: {
  error: { code: 'PGRST116', message: 'JSON object requested...' },
  folderId: 'xxx',
  userId: 'yyy'
}
```

## Environment Variables

Required environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
BLOB_READ_WRITE_TOKEN=vercel_blob_...
```

To verify environment variables are set:
1. Check server logs for "Missing Supabase environment variables" or "Storage service not configured"
2. Ensure all three variables are set in your deployment environment

## Database Schema

### Schema Verification

The application now includes **automatic schema verification** that checks if required database columns exist before performing operations. This helps identify when database migrations haven't been applied.

**If you see schema-related errors:**
1. The error message will tell you which columns are missing
2. Follow the migration instructions in `/scripts/README.md`
3. Run the required migration scripts in your Supabase dashboard
4. Restart your application

**Schema error format:**
```
Database schema is outdated. Missing columns: folder_id. 
Please ensure all database migrations have been applied.
```

### Folders Table
```sql
folders (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  parent_id UUID REFERENCES folders(id),
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  UNIQUE(user_id, parent_id, name)
)
```

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
  user_id UUID REFERENCES auth.users(id),
  folder_id UUID REFERENCES folders(id),
  ...
)
```

## Common Solutions

### Issue: "Could not find the 'folder_id' column of 'files' in the schema cache"
**Solution:** 
1. This means database migrations haven't been applied
2. Follow instructions in `/scripts/README.md`
3. Run migration script `004-add-folders-table.sql` in Supabase dashboard
4. Verify with `005-ensure-folder-id-column.sql`
5. Restart your application

### Issue: "Database schema is outdated. Missing columns: ..."
**Solution:**
1. Check which columns are missing from the error message
2. Review migration scripts in `/scripts` directory
3. Apply missing migrations in order (001, 002, 003, 004)
4. Restart your application

### Issue: "Server configuration error"
**Solution:** Verify environment variables are set correctly in your deployment

### Issue: Folder creation returns 500 error
**Solution:** 
1. Check database connection
2. Verify RLS policies are enabled
3. Check server logs for detailed error

### Issue: File upload hangs or times out
**Solution:**
1. Check file size (must be ≤ 1GB)
2. Verify Blob storage is configured
3. Check network connection

### Issue: "Invalid folder or folder not found"
**Solution:**
1. Verify folder exists
2. Ensure user owns the folder
3. Check folder_id format is a valid UUID

### Issue: Slug collision errors even with random slugs
**Solution:**
- The system now auto-retries with longer slugs
- If error persists, check database for slug conflicts

## Testing Checklist

- [ ] File upload with small file (<1MB)
- [ ] File upload with large file (>100MB)
- [ ] File upload without authentication
- [ ] File upload with authentication
- [ ] File upload to folder
- [ ] File upload with custom slug
- [ ] File upload with password protection
- [ ] File upload with expiry
- [ ] Folder creation at root level
- [ ] Folder creation as subfolder
- [ ] Folder rename
- [ ] Folder deletion (empty)
- [ ] Folder deletion (with files) - should fail
- [ ] File move to folder
- [ ] Duplicate folder names - should fail
- [ ] Duplicate custom URLs - should fail
- [ ] Rate limit enforcement

## Getting Help

If you continue to experience issues:

1. **Collect information**:
   - Error message
   - Status code
   - Browser console logs
   - Server logs
   - Steps to reproduce

2. **Check recent changes**:
   - Review recent code changes
   - Check for database migrations
   - Verify deployment configuration

3. **Review logs**:
   - All errors now include detailed context
   - Look for error codes, messages, and hints
   - Check for stack traces

4. **Contact support**:
   - Provide collected information
   - Include server log excerpts
   - Describe expected vs actual behavior
