import { eq } from "drizzle-orm"
import { db } from "@/server/database"

export async function getOrCreate(
  table: any,
  kodeField: string,
  namaField: string,
  kode: string,
  nama: string
) {
  const existing = await db
    .select()
    .from(table)
    .where(eq(table[kodeField], kode))
    .limit(1) as any[]

  if (existing[0]?.id) {
    return existing[0].id
  }

  const inserted = await db
    .insert(table)
    .values({
      [kodeField]: kode,
      [namaField]: nama
    })
    .returning() as any[]

  return inserted[0].id
}
