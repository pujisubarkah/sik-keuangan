import { db } from '../../../database';
import { unit } from '../../../database/schema/unit_kerja';
import { eq } from 'drizzle-orm';
import { createError } from 'h3';

export default defineEventHandler(async (event) => {
  const params = event.context.params as { id?: string } | undefined;
  if (!params?.id) {
    throw createError({ statusCode: 400, statusMessage: 'satker_id parameter is required' });
  }
  const satkerId = parseInt(params.id);

  if (event.req.method === 'GET') {
    // Ambil semua unit kerja berdasarkan satker_id
    const data = await db.select().from(unit).where(eq(unit.satker_id, satkerId));
    return data;
  }

  return { error: 'Method not allowed' };
});
