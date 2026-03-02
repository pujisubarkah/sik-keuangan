import { createError } from 'h3'
import { eq } from 'drizzle-orm'
import { db } from '../../database'
import { users } from '../../database/schema/users'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  if (event.req.method !== 'POST') {
    return createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
  }

  const token = event.req.headers['authorization']?.replace('Bearer ', '')
  if (!token) {
    return createError({ statusCode: 401, statusMessage: 'No token provided' })
  }

  // TODO: Validasi token dan dapatkan userId
  // Contoh: const userId = verifyToken(token)
  const userId = getUserIdFromToken(token) // Implementasi sesuai JWT Anda
  if (!userId) {
    return createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }

  const body = await readBody(event)
  const { oldPassword, newPassword, confirmPassword } = body

  if (!oldPassword || !newPassword || !confirmPassword) {
    return createError({ statusCode: 400, statusMessage: 'Semua field harus diisi' })
  }
  if (newPassword !== confirmPassword) {
    return createError({ statusCode: 400, statusMessage: 'Konfirmasi password tidak cocok' })
  }

  // Cari user di database
  const userResult = await db.select().from(users).where(eq(users.id, userId))
  if (!userResult || userResult.length === 0) {
    return createError({ statusCode: 404, statusMessage: 'User tidak ditemukan' })
  }
  const user = userResult[0]
  if (!user || !user.password_hash) {
    return createError({ statusCode: 400, statusMessage: 'Password lama salah' })
  }
  const passwordMatch = await bcrypt.compare(oldPassword, user.password_hash)
  if (!passwordMatch) {
    return createError({ statusCode: 400, statusMessage: 'Password lama salah' })
  }

  // Update password
  const newHash = await bcrypt.hash(newPassword, 10)
  await db.update(users).set({ password_hash: newHash }).where(eq(users.id, userId))

  return { success: true, message: 'Password berhasil diubah' }
})

// Implementasi JWT decode
const SECRET = 'SECRET_KEY' // Secret yang sama dengan login.ts
function getUserIdFromToken(token: string): number | null {
  try {
    const payload = jwt.verify(token, SECRET) as { id: number }
    return payload.id
  } catch {
    return null
  }
}
