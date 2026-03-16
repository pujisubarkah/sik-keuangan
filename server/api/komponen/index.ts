import { db } from "@/server/database";
import { masterKomponen } from '@/server/database/schema/master_komponen'
import { getQuery } from 'h3'
import { sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  // GET: /api/komponen?suboutput_id=123
  const query = getQuery(event)
  const suboutputId = query.suboutput_id
  let komponen
  if (suboutputId) {
    komponen = await db.select().from(masterKomponen).where(sql`suboutput_id = ${Number(suboutputId)}`)
  } else {
    komponen = await db.select().from(masterKomponen)
  }
  return { success: true, data: komponen }
})
