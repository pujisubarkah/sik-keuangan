import { db } from '@/server/database';
import { masterKegiatan } from '@/server/database/schema/master_kegiatan';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  let kegiatan_id: string | undefined;
  if (event.context && event.context.params && typeof event.context.params === 'object') {
    kegiatan_id = (event.context.params as Record<string, string>)["kegiatan_id"];
  }
  if (!kegiatan_id) return { success: false, message: 'Missing kegiatan_id' };

  try {
    const deleted = await db.delete(masterKegiatan).where(eq(masterKegiatan.id, Number(kegiatan_id)));
    return { success: true, deleted };
  } catch (e) {
    return { success: false, message: 'Gagal menghapus data', error: String(e) };
  }
});
