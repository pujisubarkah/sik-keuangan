import { db } from '@/server/database';
import { masterProgram } from '@/server/database/schema/master_program';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  // Get id from params
  let id: string | undefined;
  if (event.context && event.context.params && typeof event.context.params === 'object') {
    id = (event.context.params as Record<string, string>)["id"];
  }
  if (!id) return { success: false, message: 'Missing id' };

  try {
    const deleted = await db.delete(masterProgram).where(eq(masterProgram.id, Number(id)));
    return { success: true, deleted };
  } catch (e) {
    return { success: false, message: 'Gagal menghapus data', error: String(e) };
  }
});
