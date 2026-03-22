import { db } from '@/server/database'
import { masterSubkomponen } from '@/server/database/schema/master_subkomponen'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const komponen_id = event.context.params?.komponen_id || getQuery(event).komponen_id
  let where = undefined
  if (komponen_id) {
    where = eq(masterSubkomponen.komponen_id, Number(komponen_id))
  }
  const data = await db
    .select({
      id: masterSubkomponen.id,
      komponen_id: masterSubkomponen.komponen_id,
      kode_subkomponen: masterSubkomponen.kode_subkomponen,
    })
    .from(masterSubkomponen)
    .where(where)
  return {
    success: true,
    data,
  }
})
