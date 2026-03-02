import { db } from '../../database';
import { suboutput } from '../../database/schema/suboutput';
import { createError } from 'h3';
import { eq, and } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  if (event.req.method === 'GET') {
    // Ambil semua data suboutput dengan filter
    const { satker_id, unit_id, tahun } = getQuery(event)
    const conditions = [];
    if (satker_id) conditions.push(eq(suboutput.satker_id, Number(satker_id)))
    if (unit_id) conditions.push(eq(suboutput.unit_id, Number(unit_id)))
    if (tahun) conditions.push(eq(suboutput.tahun, Number(tahun)))
    
    let query = db.select().from(suboutput)
    if (conditions.length) {
      query = query.where(and(...conditions)) as typeof query
    }
    const data = await query
    return data;
  }
  if (event.req.method === 'POST') {
    const body = await readBody(event);
    const inserted = await db.insert(suboutput).values(body).returning();
    return inserted[0];
  }
  return { error: 'Method not allowed' };
});
