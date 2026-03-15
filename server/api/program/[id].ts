import { db } from '@/server/database';
import { masterProgram } from '@/server/database/schema/master_program';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  // Ambil id dari params
  let id: string | undefined;
  if (event.context && event.context.params && typeof event.context.params === 'object') {
    id = (event.context.params as Record<string, string>)["id"];
  }
  if (!id) return { success: false, message: 'Missing id' };

  // GET: Ambil 1 program by id
  if (event.node.req.method === 'GET') {
    const data = await db.select().from(masterProgram).where(eq(masterProgram.id, Number(id)));
    if (!data.length) return { success: false, message: 'Not found' };
    return { success: true, data: data[0] };
  }

  // PUT: Update program by id
  if (event.node.req.method === 'PUT') {
    const body = await readBody(event);
    const now = new Date();
    const updated = await db.update(masterProgram)
      .set({
        ...(body.kode_program && { kode_program: body.kode_program }),
        ...(body.nama_program && { nama_program: body.nama_program }),
        ...(body.total !== undefined && { total: body.total }),
        updated_at: now,
      })
      .where(eq(masterProgram.id, Number(id)))
      .returning();
    if (!updated.length) return { success: false, message: 'Not found or not updated' };
    return { success: true, data: updated[0] };
  }

  // DELETE: Hapus program by id
  if (event.node.req.method === 'DELETE') {
    const deleted = await db.delete(masterProgram)
      .where(eq(masterProgram.id, Number(id)))
      .returning();
    if (!deleted.length) return { success: false, message: 'Not found or not deleted' };
    return { success: true, data: deleted[0] };
  }

  return { success: false, message: 'Method not allowed' };
});
