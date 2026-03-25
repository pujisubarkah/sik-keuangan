import { db } from '../../database';
import { tahunAnggaran } from '../../database/schema/tahun_anggaran';

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const data = await db.select().from(tahunAnggaran);
    return data;
  }
});