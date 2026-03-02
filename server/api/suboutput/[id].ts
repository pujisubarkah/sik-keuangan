import { db } from '../../database';
import { suboutput } from '../../database/schema/suboutput';
import { satker } from '../../database/schema/satker';
import { unit } from '../../database/schema/unit_kerja';
import { createError } from 'h3';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const { req, context } = event;
  const method = req.method;
  // GET by id
  if (method === 'GET') {
    const id = event.context.params?.id || event.req.url?.split('/').pop();
    if (id && !isNaN(Number(id))) {
      // Join satker and unit for name output
      const data = await db
        .select({
          id: suboutput.id,
          satker_id: suboutput.satker_id,
          unit_id: suboutput.unit_id,
          satker_name: satker.name,
          unit_name: unit.name
        })
        .from(suboutput)
        .leftJoin(satker, eq(suboutput.satker_id, satker.id))
        .leftJoin(unit, eq(suboutput.unit_id, unit.id))
        .where(eq(suboutput.id, Number(id)));
      if (!data.length) throw createError({ statusCode: 404, statusMessage: 'Not found' });
      return data[0];
    }
    // Ambil semua data suboutput
    const data = await db.select().from(suboutput);
    return data;
  }
  // POST
  if (method === 'POST') {
    const body = await readBody(event);
    const inserted = await db.insert(suboutput).values(body).returning();
    return inserted[0];
  }
  // PUT
  if (method === 'PUT') {
    const id = event.context.params?.id || event.req.url?.split('/').pop();
    if (!id || isNaN(Number(id))) throw createError({ statusCode: 400, statusMessage: 'Invalid id' });
    const body = await readBody(event);
    const updated = await db.update(suboutput).set(body).where(eq(suboutput.id, Number(id))).returning();
    if (!updated.length) throw createError({ statusCode: 404, statusMessage: 'Not found' });
    return updated[0];
  }
  // DELETE
  if (method === 'DELETE') {
    const id = event.context.params?.id || event.req.url?.split('/').pop();
    if (!id || isNaN(Number(id))) throw createError({ statusCode: 400, statusMessage: 'Invalid id' });
    const deleted = await db.delete(suboutput).where(eq(suboutput.id, Number(id))).returning();
    if (!deleted.length) throw createError({ statusCode: 404, statusMessage: 'Not found' });
    return { success: true, deleted: deleted[0] };
  }
  return { error: 'Method not allowed' };
});
