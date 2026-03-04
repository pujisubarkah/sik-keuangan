import { satker } from '../../database/schema/satker';
import { unit } from '../../database/schema/unit_kerja';
import { db } from '../../database';
import { eq, sql } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const minCount = query.min ? Number(query.min) : 0;
  const maxCount = query.max ? Number(query.max) : undefined;

  // Query satker dengan count unit
  const result = await db
    .select({
      id: satker.id,
      name: satker.name,
      unitCount: sql<number>`count(${units.id})`.as('unit_count')
    })
    .from(satker)
    .leftJoin(units, eq(satker.id, units.satkerId))
    .groupBy(satker.id, satker.name)
    .having(
      maxCount !== undefined
        ? sql`count(${units.id}) >= ${minCount} AND count(${units.id}) <= ${maxCount}`
        : sql`count(${units.id}) >= ${minCount}`
    );

  return result;
});