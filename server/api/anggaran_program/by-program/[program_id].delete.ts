import { db } from '@/server/database';
import { masterProgram } from '@/server/database/schema/master_program';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  let program_id: string | undefined;
  if (event.context && event.context.params && typeof event.context.params === 'object') {
    program_id = (event.context.params as Record<string, string>)["program_id"];
  }
  if (!program_id) return { success: false, message: 'Missing program_id' };

  try {
    const deleted = await db.delete(masterProgram).where(eq(masterProgram.id, Number(program_id)));
    return { success: true, deleted };
  } catch (e) {
    return { success: false, message: 'Gagal menghapus data', error: String(e) };
  }
});
