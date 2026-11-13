// supabase/apply-migration.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try loading .env from backend or root
dotenv.config({ path: path.join(__dirname, '../backend/.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const { Client } = pg;

async function runMigration() {
  console.log('--------------------------------------------------');
  console.log('🌾 AgriPulse AI - Supabase Migration Runner');
  console.log('--------------------------------------------------');

  const connectionString = 
    process.env.DATABASE_URL || 
    process.env.SUPABASE_DB_URL || 
    process.env.POSTGRES_URL;

  const sqlFilePath = path.join(__dirname, 'migrations', '001_initial_schema.sql');

  if (!fs.existsSync(sqlFilePath)) {
    console.error(`❌ Migration file not found at: ${sqlFilePath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlFilePath, 'utf8');

  if (!connectionString) {
    console.log('⚠️  DATABASE_URL / SUPABASE_DB_URL not found in environment.');
    console.log('ℹ️  You can copy and run the SQL directly in the Supabase SQL Editor:');
    console.log(`   Path: ${sqlFilePath}`);
    console.log('');
    console.log('💡 To run automatically via this script, set DATABASE_URL in backend/.env:');
    console.log('   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres');
    console.log('--------------------------------------------------');
    return;
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔄 Connecting to Supabase PostgreSQL database...');
    await client.connect();
    console.log('✅ Connected successfully.');

    console.log('🚀 Applying migration: 001_initial_schema.sql...');
    await client.query(sql);

    console.log('🎉 Migration applied successfully!');
    console.log('Tables: public.farms, public.advisories and RLS policies are ready.');
  } catch (err) {
    console.error('❌ Migration failed with error:', err.message);
    if (err.detail) console.error('Details:', err.detail);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();

