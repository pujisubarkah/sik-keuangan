import { db } from '@/server/database'
import { informasi } from '@/server/database/schema/informasi'
import { desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    // Get all informasi
    const data = await db.select().from(informasi).orderBy(desc(informasi.created_at))
    return data
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const [inserted] = await db.insert(informasi).values({
      judul: body.judul,
      deskripsi: body.deskripsi,
      created_at: new Date(),
      updated_at: new Date(),
    }).returning()
    return inserted
  }

  return sendError(event, createError({ statusCode: 405, statusMessage: 'Method Not Allowed' }))
})
