#!/usr/bin/env node

/**
 * Database Migration Runner
 * 
 * This script applies database migrations to a Supabase instance.
 * It can be run during deployment or manually by administrators.
 * 
 * Usage:
 *   node scripts/run-migrations.js
 * 
 * Environment variables required:
 *   SUPABASE_URL - Your Supabase project URL
 *   SUPABASE_SERVICE_KEY - Your Supabase service role key (for admin operations)
 * 
 * Note: This requires the @supabase/supabase-js package
 */

const fs = require('fs').promises;
const path = require('path');

// Check if running in a module context
let createClient;
try {
  const supabase = require('@supabase/supabase-js');
  createClient = supabase.createClient;
} catch (error) {
  console.error('Error: @supabase/supabase-js is not installed.');
  console.error('Please run: npm install @supabase/supabase-js');
  process.exit(1);
}

// Configuration
const MIGRATIONS_DIR = path.join(__dirname);
const MIGRATIONS = [
  '001-create-files-table.sql',
  '002-add-title-and-views.sql',
  '003-add-users-and-auth.sql',
  '004-add-folders-table.sql',
  '005-ensure-folder-id-column.sql',
];

/**
 * Read SQL file content
 */
async function readSQLFile(filename) {
  const filePath = path.join(MIGRATIONS_DIR, filename);
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return content;
  } catch (error) {
    console.error(`Error reading ${filename}:`, error.message);
    return null;
  }
}

/**
 * Apply a single migration using Supabase REST API
 */
async function applyMigration(supabase, migrationName, sqlContent) {
  console.log(`\nApplying migration: ${migrationName}`);
  console.log('='.repeat(60));
  
  try {
    // Execute SQL using Supabase RPC or raw query
    // Note: Supabase client doesn't directly support raw SQL execution
    // This would need to be done through the Supabase Management API or SQL Editor
    console.log('⚠️  This script provides the SQL for manual execution.');
    console.log('📋 SQL Content:');
    console.log('-'.repeat(60));
    console.log(sqlContent);
    console.log('-'.repeat(60));
    
    return {
      success: true,
      message: 'SQL provided for manual execution',
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}

/**
 * Check migration status
 */
async function checkMigrationStatus(supabase) {
  console.log('\n📊 Checking current migration status...\n');
  
  const checks = [
    { name: 'files table', check: async () => {
      const { error } = await supabase.from('files').select('*').limit(0);
      return !error;
    }},
    { name: 'title column', check: async () => {
      const { error } = await supabase.from('files').select('title').limit(0);
      return !error;
    }},
    { name: 'view_count column', check: async () => {
      const { error } = await supabase.from('files').select('view_count').limit(0);
      return !error;
    }},
    { name: 'user_id column', check: async () => {
      const { error } = await supabase.from('files').select('user_id').limit(0);
      return !error;
    }},
    { name: 'folders table', check: async () => {
      const { error } = await supabase.from('folders').select('*').limit(0);
      return !error;
    }},
    { name: 'folder_id column', check: async () => {
      const { error } = await supabase.from('files').select('folder_id').limit(0);
      return !error;
    }},
  ];
  
  for (const { name, check } of checks) {
    try {
      const exists = await check();
      console.log(`${exists ? '✅' : '❌'} ${name}`);
    } catch (error) {
      console.log(`❌ ${name} - Error: ${error.message}`);
    }
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Database Migration Runner');
  console.log('='.repeat(60));
  
  // Check environment variables
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('\n❌ Error: Missing environment variables');
    console.error('\nRequired:');
    console.error('  - SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL');
    console.error('  - SUPABASE_SERVICE_KEY (required for admin operations)');
    console.error('\nNote: SUPABASE_SERVICE_KEY must be set for migration management.');
    console.error('      Do NOT use NEXT_PUBLIC_SUPABASE_ANON_KEY as it has insufficient permissions.');
    process.exit(1);
  }
  
  console.log('\n✅ Environment variables found');
  console.log(`📍 Supabase URL: ${supabaseUrl}`);
  
  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Check current status
  await checkMigrationStatus(supabase);
  
  console.log('\n📚 Migration Scripts:');
  console.log('='.repeat(60));
  
  // Read and display all migration scripts
  for (const migration of MIGRATIONS) {
    const sql = await readSQLFile(migration);
    if (sql) {
      console.log(`\n✅ Found: ${migration}`);
    } else {
      console.log(`\n❌ Missing: ${migration}`);
    }
  }
  
  console.log('\n\n📋 Migration Instructions:');
  console.log('='.repeat(60));
  console.log('\nTo apply these migrations:');
  console.log('\n1. Go to your Supabase Dashboard: https://app.supabase.com');
  console.log('2. Navigate to: SQL Editor');
  console.log('3. Copy and run each SQL script in order:');
  
  for (let i = 0; i < MIGRATIONS.length; i++) {
    console.log(`   ${i + 1}. ${MIGRATIONS[i]}`);
  }
  
  console.log('\n4. After running all scripts, restart your application');
  console.log('\n5. Verify migrations by visiting: /api/health/migrations');
  
  console.log('\n\n📝 Alternative: Manual SQL Execution');
  console.log('='.repeat(60));
  console.log('\nYou can also run the SQL files directly:');
  
  for (const migration of MIGRATIONS) {
    const sql = await readSQLFile(migration);
    if (sql) {
      await applyMigration(supabase, migration, sql);
    }
  }
  
  console.log('\n\n✅ Migration runner completed');
  console.log('\nNote: Since Supabase client cannot directly execute DDL,');
  console.log('please use the Supabase Dashboard SQL Editor to run these scripts.');
}

// Run main function
main().catch((error) => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
