import { users } from '../../database/schema/users'
import { satker } from '../../database/schema/satker'
import { roles } from '../../database/schema/role'
import { db } from '../../database';
import { H3Event } from 'h3'
import { eq } from 'drizzle-orm/sql/expressions';
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event: H3Event) => {
	const id = Number(event.context.params?.id)
	if (!id) {
		event.res.statusCode = 400
		return { error: 'Invalid id' }
	}

	if (event.method === 'GET') {
		// Ambil user by id, join satker & roles
		const result = await db
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
			.where(eq(users.id, id))
		if (!result[0]) {
			event.res.statusCode = 404
			return { error: 'User not found' }
		}
		return {
			...result[0],
			satker_name: result[0].satker_name || null,
			role_name: result[0].role_name || null
		}
	}

	if (event.method === 'PUT') {
		const body = await readBody(event)
		// Jika ada field password, hash dulu
		if (body.password) {
			const saltRounds = 10
			const hash = await new Promise((resolve, reject) => {
				bcrypt.hash(body.password, saltRounds, (err, hash) => {
					if (err) reject(err)
					else resolve(hash)
				})
			})
			body.password_hash = hash
			delete body.password
		}
		// Update user by id
		const updated = await db.update(users).set(body).where(eq(users.id, id)).returning()
		if (!updated[0]) {
			event.res.statusCode = 404
			return { error: 'User not found' }
		}
		return updated[0]
	}

	if (event.method === 'DELETE') {
		// Delete user by id
		const deleted = await db.delete(users).where(eq(users.id, id)).returning()
		if (!deleted[0]) {
			event.res.statusCode = 404
			return { error: 'User not found' }
		}
		return { success: true }
	}

	event.res.statusCode = 405
	return { error: 'Method Not Allowed' }
})
