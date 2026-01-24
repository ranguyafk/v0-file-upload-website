/**
 * Database migration utility for checking and applying migrations
 * This helps ensure the database schema is up-to-date
 */

import { SupabaseClient } from "@supabase/supabase-js"

export interface MigrationStatus {
  migrationName: string
  isApplied: boolean
  description: string
  critical: boolean
}

export interface MigrationCheckResult {
  allApplied: boolean
  missingMigrations: MigrationStatus[]
  appliedMigrations: MigrationStatus[]
  errorMessage?: string
}

/**
 * List of required migrations in order
 * These check for the existence of tables and columns to determine if migrations are applied
 */
const REQUIRED_MIGRATIONS: MigrationStatus[] = [
  {
    migrationName: "001-create-files-table",
    description: "Creates the initial files table",
    isApplied: false,
    critical: true,
  },
  {
    migrationName: "002-add-title-and-views",
    description: "Adds title, view_count, and owner_token columns",
    isApplied: false,
    critical: true,
  },
  {
    migrationName: "003-add-users-and-auth",
    description: "Adds user authentication and profiles",
    isApplied: false,
    critical: true,
  },
  {
    migrationName: "004-add-folders-table",
    description: "Creates folders table and adds folder_id to files",
    isApplied: false,
    critical: true,
  },
  {
    migrationName: "005-ensure-folder-id-column",
    description: "Verifies folder_id column exists (optional validation)",
    isApplied: false,
    critical: false,
  },
]

// Migration indices for readability
const MIGRATION_INDEX = {
  CREATE_FILES_TABLE: 0,
  ADD_TITLE_AND_VIEWS: 1,
  ADD_USERS_AND_AUTH: 2,
  ADD_FOLDERS_TABLE: 3,
  ENSURE_FOLDER_ID: 4,
} as const

/**
 * Check if a table exists in the database
 */
async function checkTableExists(
  supabase: SupabaseClient,
  tableName: string,
): Promise<boolean> {
  try {
    const { error } = await supabase.from(tableName).select("*").limit(0)
    return !error
  } catch {
    return false
  }
}

/**
 * Check if a column exists in a table
 */
async function checkColumnExists(
  supabase: SupabaseClient,
  tableName: string,
  columnName: string,
): Promise<boolean> {
  try {
    const { error } = await supabase.from(tableName).select(columnName).limit(0)
    return !error
  } catch {
    return false
  }
}

/**
 * Check which migrations have been applied
 */
export async function checkMigrationStatus(
  supabase: SupabaseClient,
): Promise<MigrationCheckResult> {
  const migrations = [...REQUIRED_MIGRATIONS]
  const appliedMigrations: MigrationStatus[] = []
  const missingMigrations: MigrationStatus[] = []

  try {
    // Check 001-create-files-table
    const filesTableExists = await checkTableExists(supabase, "files")
    migrations[MIGRATION_INDEX.CREATE_FILES_TABLE].isApplied = filesTableExists
    if (filesTableExists) {
      appliedMigrations.push(migrations[MIGRATION_INDEX.CREATE_FILES_TABLE])
    } else {
      missingMigrations.push(migrations[MIGRATION_INDEX.CREATE_FILES_TABLE])
    }

    // Check 002-add-title-and-views
    if (filesTableExists) {
      const hasTitleColumn = await checkColumnExists(supabase, "files", "title")
      const hasViewCountColumn = await checkColumnExists(supabase, "files", "view_count")
      const hasOwnerTokenColumn = await checkColumnExists(supabase, "files", "owner_token")
      
      migrations[MIGRATION_INDEX.ADD_TITLE_AND_VIEWS].isApplied = hasTitleColumn && hasViewCountColumn && hasOwnerTokenColumn
      if (migrations[MIGRATION_INDEX.ADD_TITLE_AND_VIEWS].isApplied) {
        appliedMigrations.push(migrations[MIGRATION_INDEX.ADD_TITLE_AND_VIEWS])
      } else {
        missingMigrations.push(migrations[MIGRATION_INDEX.ADD_TITLE_AND_VIEWS])
      }
    } else {
      migrations[MIGRATION_INDEX.ADD_TITLE_AND_VIEWS].isApplied = false
      missingMigrations.push(migrations[MIGRATION_INDEX.ADD_TITLE_AND_VIEWS])
    }

    // Check 003-add-users-and-auth
    if (filesTableExists) {
      const hasUserIdColumn = await checkColumnExists(supabase, "files", "user_id")
      const profilesTableExists = await checkTableExists(supabase, "profiles")
      
      migrations[MIGRATION_INDEX.ADD_USERS_AND_AUTH].isApplied = hasUserIdColumn && profilesTableExists
      if (migrations[MIGRATION_INDEX.ADD_USERS_AND_AUTH].isApplied) {
        appliedMigrations.push(migrations[MIGRATION_INDEX.ADD_USERS_AND_AUTH])
      } else {
        missingMigrations.push(migrations[MIGRATION_INDEX.ADD_USERS_AND_AUTH])
      }
    } else {
      migrations[MIGRATION_INDEX.ADD_USERS_AND_AUTH].isApplied = false
      missingMigrations.push(migrations[MIGRATION_INDEX.ADD_USERS_AND_AUTH])
    }

    // Check 004-add-folders-table
    if (filesTableExists) {
      const foldersTableExists = await checkTableExists(supabase, "folders")
      const hasFolderIdColumn = await checkColumnExists(supabase, "files", "folder_id")
      
      migrations[MIGRATION_INDEX.ADD_FOLDERS_TABLE].isApplied = foldersTableExists && hasFolderIdColumn
      if (migrations[MIGRATION_INDEX.ADD_FOLDERS_TABLE].isApplied) {
        appliedMigrations.push(migrations[MIGRATION_INDEX.ADD_FOLDERS_TABLE])
      } else {
        missingMigrations.push(migrations[MIGRATION_INDEX.ADD_FOLDERS_TABLE])
      }
    } else {
      migrations[MIGRATION_INDEX.ADD_FOLDERS_TABLE].isApplied = false
      missingMigrations.push(migrations[MIGRATION_INDEX.ADD_FOLDERS_TABLE])
    }

    // Check 005-ensure-folder-id-column (optional validation)
    // This migration is essentially a verification of migration 004
    // It doesn't add new functionality, just validates that folder_id exists
    // We mark it as applied if migration 004 is applied, since they're dependent
    migrations[MIGRATION_INDEX.ENSURE_FOLDER_ID].isApplied = migrations[MIGRATION_INDEX.ADD_FOLDERS_TABLE].isApplied
    if (migrations[MIGRATION_INDEX.ENSURE_FOLDER_ID].isApplied) {
      appliedMigrations.push(migrations[MIGRATION_INDEX.ENSURE_FOLDER_ID])
    } else {
      missingMigrations.push(migrations[MIGRATION_INDEX.ENSURE_FOLDER_ID])
    }

    const criticalMissing = missingMigrations.filter((m) => m.critical)
    const allApplied = criticalMissing.length === 0

    return {
      allApplied,
      missingMigrations,
      appliedMigrations,
      errorMessage: allApplied
        ? undefined
        : `Missing ${criticalMissing.length} critical database migration(s). Please apply the following migrations in order: ${criticalMissing.map((m) => m.migrationName).join(", ")}`,
    }
  } catch (error) {
    console.error("Migration status check error:", error)
    return {
      allApplied: false,
      missingMigrations: migrations,
      appliedMigrations: [],
      errorMessage:
        error instanceof Error
          ? `Failed to check migration status: ${error.message}`
          : "Failed to check migration status: Unknown error",
    }
  }
}

/**
 * Get a user-friendly error message for missing migrations
 */
export function getMigrationErrorMessage(missingMigrations: MigrationStatus[]): string {
  if (missingMigrations.length === 0) {
    return "All database migrations have been applied."
  }

  const criticalMissing = missingMigrations.filter((m) => m.critical)
  
  if (criticalMissing.length === 0) {
    return "Database schema is up-to-date."
  }

  const migrationList = criticalMissing.map((m) => `- ${m.migrationName}: ${m.description}`).join("\n")

  return `The database schema is not up-to-date. This may cause errors when uploading files or creating folders.

Missing migrations:
${migrationList}

If you're an administrator:
1. Navigate to your Supabase Dashboard SQL Editor
2. Run the migration scripts in order from the /scripts directory
3. Restart the application

If you're a user:
Please contact the site administrator to apply the required database updates.

For detailed instructions, see: /scripts/README.md`
}

/**
 * Get admin-specific error details
 */
export function getAdminMigrationDetails(checkResult: MigrationCheckResult): string {
  const missing = checkResult.missingMigrations.filter((m) => m.critical)
  
  if (missing.length === 0) {
    return "All critical migrations applied. Database schema is up-to-date."
  }

  return `ADMIN NOTICE: ${missing.length} critical migration(s) missing.

Required actions:
1. Log in to Supabase Dashboard: https://app.supabase.com
2. Navigate to SQL Editor
3. Apply these migrations in order:
${missing.map((m, i) => `   ${i + 1}. scripts/${m.migrationName}.sql - ${m.description}`).join("\n")}
4. Restart the application

Current status:
- Applied: ${checkResult.appliedMigrations.length}/${REQUIRED_MIGRATIONS.length} migrations
- Missing (critical): ${missing.length}
- Missing (optional): ${checkResult.missingMigrations.filter((m) => !m.critical).length}

For detailed migration instructions, see: scripts/README.md`
}
