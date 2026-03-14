import { db } from "@/server/database";
import { masterSuboutput } from "@/server/database/schema/master_suboutput";

export default defineEventHandler(async (event) => {
	if (event.method === 'POST') {
		const body = await readBody(event);
		// Validasi sederhana, bisa ditambah sesuai kebutuhan
		if (!body || !body.kode_suboutput || !body.nama_suboutput || !body.output_id) {
			return { error: 'Data tidak lengkap' };
		}
		const [inserted] = await db.insert(masterSuboutput).values({
			kode_suboutput: body.kode_suboutput,
			nama_suboutput: body.nama_suboutput,
			output_id: Number(body.output_id),
			total: body.total ? String(body.total) : '0',
		}).returning();
		return inserted;
	}

	// GET handler (default)
	const query = getQuery(event);
	let where = undefined;
	if (query.output_id) {
		where = (row: any) => row.output_id === Number(query.output_id);
	}
	const data = await db.select().from(masterSuboutput);
	const result = where ? data.filter(where) : data;
	const mapped = result.map(item => ({
		...item,
		suboutput_id: item.id
	}));
	return mapped;
});
