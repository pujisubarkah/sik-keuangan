import { db } from '../database';
import { masterSuboutput, anggaranSuboutput } from '../database/schema';
import { eq, count } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  // Hitung jumlah suboutput yang tidak punya unit (unit_id = 0)
  // Join master_suboutput dengan anggaran_suboutput
  const result = await db
    .select({ count: count() })
    .from(anggaranSuboutput)
    .where(eq(anggaranSuboutput.unit_id, 0));

  // result[0].count adalah jumlahnya
  return {
    count: Number(result[0]?.count ?? 0),
  };
});
