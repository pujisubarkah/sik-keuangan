import { db } from "@/server/database";
import { masterSuboutput } from "@/server/database/schema/master_suboutput";

export default defineEventHandler(async (event) => {
	// Optional: add query params for filtering if needed
	const query = getQuery(event);
	let where: ((row: typeof masterSuboutput.$inferSelect) => boolean) | undefined = undefined;
	if (query.output_id) {
		where = (row: typeof masterSuboutput.$inferSelect) => row.output_id === Number(query.output_id);
	}
	const data = await db.select().from(masterSuboutput);
	// If filtering by output_id
	const result = where ? data.filter(where) : data;
	// Tambahkan field suboutput_id pada setiap item
	const mapped = result.map(item => ({
		...item,
		suboutput_id: item.id
	}))
	return mapped;
});
