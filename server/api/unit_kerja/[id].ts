import { db } from '../../database';
import { unit } from '../../database/schema/unit_kerja';
import { eq } from 'drizzle-orm';
import { createError } from 'h3';

export default defineEventHandler(async (event) => {
  const params = event.context.params as { id?: string } | undefined;
  if (!params?.id) {
    throw createError({ statusCode: 400, statusMessage: 'ID parameter is required' });
  }
  const id = parseInt(params.id);

  if (event.req.method === 'GET') {
    // Ambil unit kerja berdasarkan id
    const data = await db.select().from(unit).where(eq(unit.id, id));
    if (data.length === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Unit kerja not found' });
    }
    return data[0];
  }

  if (event.req.method === 'PUT') {
    const body = await readBody(event);
    const updated = await db.update(unit).set(body).where(eq(unit.id, id)).returning();
    if (updated.length === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Unit kerja not found' });
    }
    return updated[0];
  }

  if (event.req.method === 'DELETE') {
    const deleted = await db.delete(unit).where(eq(unit.id, id)).returning();
    if (deleted.length === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Unit kerja not found' });
    }
    return { message: 'Unit kerja deleted successfully' };
  }

  return { error: 'Method not allowed' };
});
