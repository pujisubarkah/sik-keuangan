import { db } from '@/server/database'
import { masterAkun } from '@/server/database/schema/master_akun'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const subkomponen_id = event.context.params?.subkomponen_id || getQuery(event).subkomponen_id
  let where = undefined
  if (subkomponen_id) {
    where = eq(masterAkun.subkomponen_id, Number(subkomponen_id))
  }
  const data = await db
    .select({
      id: masterAkun.id,
      kode_akun: masterAkun.kode_akun,
      subkomponen_id: masterAkun.subkomponen_id,
    })
    .from(masterAkun)
    .where(where)
  return {
    success: true,
    data,
  }
})
