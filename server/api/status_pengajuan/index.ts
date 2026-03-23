import { statusPengajuan } from '../../database/schema/status_pengajuan';
import { db } from '../../database';
import { eq } from 'drizzle-orm';

// GET all status_pengajuan
export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const result = await db.select().from(statusPengajuan);
    return result;
  }


  // Method not allowed
  return { error: 'Method not allowed' };
});
