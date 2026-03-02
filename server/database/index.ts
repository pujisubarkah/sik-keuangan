import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

// Pool PostgreSQL
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL as string,
})

// opsional: set per-connection
pool.on('connect', async (client) => {
  await client.query('SET search_path TO keuangan')
})

// Instance drizzle ORM
export const db = drizzle(pool)

// Contoh: import { db } from '@/server/database' lalu gunakan db.select(...)
// Jangan jalankan koneksi di top-level, biarkan pool dan db digunakan di handler/server

