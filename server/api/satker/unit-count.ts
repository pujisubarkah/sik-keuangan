import { db } from '../../database';
import { satker } from '../../database/schema/satker';
import { unit } from '../../database/schema/unit_kerja';
import { sql, eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  // Ambil semua satker beserta jumlah unit terkait
  const data = await db
    .select({
      id: satker.id,
      name: satker.name,
      unit_count: sql`COUNT(${unit.id})`
    })
    .from(satker)
    .leftJoin(unit, eq(unit.satker_id, satker.id))
    .groupBy(satker.id);

  return data;
});
