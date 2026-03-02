import { db } from '../../database';
import { satker } from '../../database/schema/satker';
import { createError } from 'h3';

export default defineEventHandler(async (event) => {
  if (event.req.method === 'GET') {
    // Ambil semua data satker
    const data = await db.select().from(satker);
    return data;
  }
  if (event.req.method === 'POST') {
    const body = await readBody(event);
    const inserted = await db.insert(satker).values(body).returning();
    return inserted[0];
  }
  return { error: 'Method not allowed' };
});