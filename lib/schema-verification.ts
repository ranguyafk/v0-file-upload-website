/**
 * Schema verification utility to check if required database columns exist
 * This helps provide better error messages when migrations haven't been run
 */

import { SupabaseClient } from "@supabase/supabase-js"

export interface SchemaCheckResult {
  isValid: boolean
  missingColumns: string[]
  errorMessage?: string
}

/**
 * Verify that the files table has all required columns
 * @param supabase - Supabase client instance
 * @returns Promise<SchemaCheckResult>
 */
export async function verifyFilesTableSchema(
  supabase: SupabaseClient,
): Promise<SchemaCheckResult> {
  const requiredColumns = ["folder_id", "user_id", "title", "owner_token", "view_count"]
  const missingColumns: string[] = []

  try {
    // Attempt a simple query that selects the required columns
    // This will fail if any column doesn't exist
    const { error } = await supabase
      .from("files")
      .select(requiredColumns.join(","))
      .limit(0)

    if (error) {
      // Parse error to identify missing columns
      const errorMessage = error.message.toLowerCase()

      for (const column of requiredColumns) {
        if (errorMessage.includes(column) && errorMessage.includes("not found")) {
          missingColumns.push(column)
        }
      }

      // If we couldn't parse specific columns, check the general error
      if (missingColumns.length === 0 && error.code === "42703") {
        // PostgreSQL undefined column error code
        return {
          isValid: false,
          missingColumns: [],
          errorMessage: `Database schema error: ${error.message}`,
        }
      }

      if (missingColumns.length > 0) {
        return {
          isValid: false,
          missingColumns,
          errorMessage: `Missing columns in files table: ${missingColumns.join(", ")}. Please run database migrations.`,
        }
      }
    }

    return {
      isValid: true,
      missingColumns: [],
    }
  } catch (error) {
    console.error("Schema verification error:", error)
    return {
      isValid: false,
      missingColumns: [],
      errorMessage: error instanceof Error ? error.message : "Unknown schema verification error",
    }
  }
}

/**
 * Verify that the folders table exists and has required structure
 * @param supabase - Supabase client instance
 * @returns Promise<boolean>
 */
export async function verifyFoldersTableExists(supabase: SupabaseClient): Promise<boolean> {
  try {
    const { error } = await supabase.from("folders").select("id").limit(0)

    if (error) {
      console.error("Folders table verification failed:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Folders table verification error:", error)
    return false
  }
}

/**
 * Check if specific column exists in a table
 * @param supabase - Supabase client instance
 * @param tableName - Name of the table to check
 * @param columnName - Name of the column to check
 * @returns Promise<boolean>
 */
export async function checkColumnExists(
  supabase: SupabaseClient,
  tableName: string,
  columnName: string,
): Promise<boolean> {
  try {
    const { error } = await supabase.from(tableName).select(columnName).limit(0)

    return !error
  } catch (error) {
    console.error(`Column check error for ${tableName}.${columnName}:`, error)
    return false
  }
}

/**
 * Get user-friendly error message for schema issues
 * @param missingColumns - Array of missing column names
 * @returns User-friendly error message
 */
export function getSchemaErrorMessage(missingColumns: string[]): string {
  if (missingColumns.length === 0) {
    return "Database schema error. Please contact support."
  }

  const columnList = missingColumns.join(", ")

  return `Database schema is outdated. Missing columns: ${columnList}. 
Please ensure all database migrations have been applied. 
If you're an administrator, run the migration scripts in the /scripts directory.
If you're a user, please contact the site administrator.`
}
