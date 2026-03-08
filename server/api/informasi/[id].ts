import { db } from '@/server/database'
import { informasi } from '@/server/database/schema/informasi'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (isNaN(id)) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'Invalid or missing ID parameter' }))
  }
  const method = event.node.req.method

  if (method === 'GET') {
    // Get single informasi
    const [item] = await db.select().from(informasi).where(eq(informasi.id, id))
    return item
  }

  if (method === 'PUT' || method === 'PATCH') {
    const body = await readBody(event)
    const [updated] = await db.update(informasi)
      .set({
        judul: body.judul,
        deskripsi: body.deskripsi,
        updated_at: new Date(),
      })
      .where(eq(informasi.id, id))
      .returning()
    return updated
  }

  if (method === 'DELETE') {
    await db.delete(informasi).where(eq(informasi.id, id))
    return { success: true }
  }

  return sendError(event, createError({ statusCode: 405, statusMessage: 'Method Not Allowed' }))
})
