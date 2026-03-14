import { db } from "@/server/database";
import { masterOutput } from "@/server/database/schema/master_output";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  let where = undefined;
  if (query.kegiatan_id) {
    where = (row: any) => row.kegiatan_id === Number(query.kegiatan_id);
  }
  const data = await db.select().from(masterOutput);
  const result = where ? data.filter(where) : data;
  return result;
});
