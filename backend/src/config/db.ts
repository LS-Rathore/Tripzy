import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL || '';

if (!connectionString) {
  console.warn("WARNING: DATABASE_URL environment variable is empty!");
}

const pool = new pg.Pool({
  connectionString,
  ssl: connectionString.includes('supabase.com') || connectionString.includes('pooler') ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool error:', err);
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
// Prisma client configuration loaded
