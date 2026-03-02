import { db } from '../../database';
import { unit } from '../../database/schema/unit_kerja';
import { createError } from 'h3';

export default defineEventHandler(async (event) => {
  if (event.req.method === 'GET') {
    // Ambil semua data unit kerja
    const data = await db.select().from(unit);
    return data;
  }
  if (event.req.method === 'POST') {
    const body = await readBody(event);
    const inserted = await db.insert(unit).values(body).returning();
    return inserted[0];
  }
  return { error: 'Method not allowed' };
});
