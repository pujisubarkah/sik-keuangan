import { db } from '../../database';
import { satker } from '../../database/schema/satker';
import { eq } from 'drizzle-orm';
import { createError } from 'h3';

export default defineEventHandler(async (event) => {
  const params = event.context.params as { id?: string } | undefined;
  if (!params?.id) {
    throw createError({ statusCode: 400, statusMessage: 'ID parameter is required' });
  }
  const id = parseInt(params.id);

  if (event.req.method === 'GET') {
    // Ambil data satker berdasarkan id
    const data = await db.select().from(satker).where(eq(satker.id, id));
    if (data.length === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Satker not found' });
    }
    return data[0];
  }

  if (event.req.method === 'PUT') {
    const body = await readBody(event);
    const updated = await db.update(satker).set(body).where(eq(satker.id, id)).returning();
    if (updated.length === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Satker not found' });
    }
    return updated[0];
  }

  if (event.req.method === 'DELETE') {
    const deleted = await db.delete(satker).where(eq(satker.id, id)).returning();
    if (deleted.length === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Satker not found' });
    }
    return { message: 'Satker deleted successfully' };
  }

  return { error: 'Method not allowed' };
});