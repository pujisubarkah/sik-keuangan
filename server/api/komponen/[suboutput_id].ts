
import { db } from '@/server/database'
import { masterKomponen } from '@/server/database/schema/master_komponen'
import { getRouterParam } from 'h3'
import { sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  // GET: /api/komponen/123
  const suboutputId = getRouterParam(event, 'suboutput_id')
  if (!suboutputId) {
    return { success: false, message: 'suboutput_id diperlukan' }
  }
  const komponen = await db.select().from(masterKomponen).where(sql`suboutput_id = ${Number(suboutputId)}`)
  return { success: true, data: komponen }
})
