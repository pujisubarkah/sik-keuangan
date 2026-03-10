import { db } from "@/server/database";
import { masterSuboutput } from "@/server/database/schema/master_suboutput";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  let where = undefined;
  if (query.output_id) {
    where = (row: typeof masterSuboutput.$inferSelect) => row.output_id === Number(query.output_id);
  }
  const data = await db.select().from(masterSuboutput);
  const result = where ? data.filter(where) : data;
  return result;
});
