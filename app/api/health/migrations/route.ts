import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  checkMigrationStatus,
  getMigrationErrorMessage,
  getAdminMigrationDetails,
} from "@/lib/db-migrations"

/**
 * GET /api/health/migrations
 * Check the status of database migrations
 * This endpoint is useful for administrators to diagnose schema issues
 */
export async function GET(request: NextRequest) {
  try {
    // Validate required environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(
        {
          status: "error",
          message: "Server configuration error: Missing Supabase credentials",
        },
        { status: 500 },
      )
    }

    const supabase = await createClient()
    const migrationStatus = await checkMigrationStatus(supabase)

    // Get user for admin check
    // Note: This is a simple authentication check. In production environments,
    // you should implement proper role-based access control (RBAC) to restrict
    // detailed migration information to users with specific admin roles.
    // For example:
    // - Check user roles from a profiles table
    // - Use Supabase RLS policies to control access
    // - Implement middleware to verify admin permissions
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Return different levels of detail based on authentication
    // Authenticated users get detailed info (assumes they are admins/developers)
    // Public users get simplified message
    // TODO: Replace with proper RBAC check in production
    const isAdmin = !!user

    if (migrationStatus.allApplied) {
      return NextResponse.json({
        status: "ok",
        message: "All database migrations have been applied successfully.",
        details: {
          totalMigrations: migrationStatus.appliedMigrations.length + migrationStatus.missingMigrations.length,
          appliedMigrations: migrationStatus.appliedMigrations.length,
          missingMigrations: 0,
        },
      })
    }

    // Migrations are missing
    const criticalMissing = migrationStatus.missingMigrations.filter((m) => m.critical)
    
    return NextResponse.json(
      {
        status: criticalMissing.length > 0 ? "error" : "warning",
        message: isAdmin
          ? getAdminMigrationDetails(migrationStatus)
          : "Database schema updates are required. Please contact the administrator.",
        details: isAdmin
          ? {
              totalMigrations: migrationStatus.appliedMigrations.length + migrationStatus.missingMigrations.length,
              appliedMigrations: migrationStatus.appliedMigrations.length,
              missingMigrations: migrationStatus.missingMigrations.length,
              criticalMissing: criticalMissing.length,
              missing: migrationStatus.missingMigrations.map((m) => ({
                name: m.migrationName,
                description: m.description,
                critical: m.critical,
              })),
              applied: migrationStatus.appliedMigrations.map((m) => ({
                name: m.migrationName,
                description: m.description,
              })),
            }
          : {
              totalMigrations: migrationStatus.appliedMigrations.length + migrationStatus.missingMigrations.length,
              appliedMigrations: migrationStatus.appliedMigrations.length,
              missingMigrations: migrationStatus.missingMigrations.length,
            },
      },
      { status: criticalMissing.length > 0 ? 503 : 200 },
    )
  } catch (error) {
    console.error("Migration status check error:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })

    return NextResponse.json(
      {
        status: "error",
        message: "Failed to check migration status",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
