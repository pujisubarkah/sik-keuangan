import { users } from '../../database/schema/users'
import { satker } from '../../database/schema/satker'
import { roles } from '../../database/schema/role'
import { db } from '../../database';
import { H3Event } from 'h3'
import { eq } from 'drizzle-orm/sql/expressions';

// GET /api/users
export default defineEventHandler(async (event: H3Event) => {
  if (event.method === 'GET') {
    // Join users dengan satker untuk ambil nama satker
    const allUsers = await db
      .select({
        id: users.id,
        nama: users.nama,
        username: users.username,
        role_id: users.role_id,
        satker_id: users.satker_id,
        last_login: users.last_login,
        created_at: users.created_at,
        updated_at: users.updated_at,
        password_hash: users.password_hash,
        nama_pegawai: users.nama_pegawai,
        nip: users.nip,
        satker_name: satker.name,
        role_name: roles.name
      })
      .from(users)
      .leftJoin(satker, eq(users.satker_id, satker.id))
      .leftJoin(roles, eq(users.role_id, roles.id))

    // Format respons agar satker_id & role_id tetap ada, dan satker_name & role_name ikut
    return allUsers.map(u => ({
      ...u,
      satker_name: u.satker_name || null,
      role_name: u.role_name || null
    }))
  }

  if (event.method === 'POST') {
    const body = await readBody(event)
    // Validasi dan insert user baru
    const inserted = await db.insert(users).values(body).returning()
    return inserted
  }

  // Method lain tidak diizinkan
  event.res.statusCode = 405
  return { error: 'Method Not Allowed' }
})
