import { db } from '../../database';
import { roles } from '../../database/schema/role';
import { createError } from 'h3';

export default defineEventHandler(async (event) => {
  if (event.req.method === 'GET') {
    // Ambil semua data role
    const data = await db.select().from(roles);
    return data;
  }
  if (event.req.method === 'POST') {
    const body = await readBody(event);
    const inserted = await db.insert(roles).values(body).returning();
    return inserted[0];
  }
  return { error: 'Method not allowed' };
});
