import { db } from "@/server/database";
import { masterSuboutput } from "@/server/database/schema/master_suboutput";

import { and, eq, sql } from 'drizzle-orm';
import { anggaranSuboutput } from '../../database/schema/anggaran_suboutput';
import { tahunAnggaran } from '../../database/schema/tahun_anggaran';

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

	// We need to fetch data by joining suboutputs with their budget/planning data (anggaran)
	// based on the filters provided (tahun, satker, unit).

	const selectColumns = {
		id: masterSuboutput.id,
		suboutput_id: masterSuboutput.id, // Keep for frontend compatibility
		kode_suboutput: masterSuboutput.kode_suboutput,
		nama_suboutput: masterSuboutput.nama_suboutput,
		output_id: masterSuboutput.output_id,
		total: masterSuboutput.total,
		// Coalesce ensures we get 0 instead of null if no budget is found
		perencanaan: sql<number>`COALESCE(${anggaranSuboutput.anggaran}, 0)`.mapWith(Number),
	};

	// Join with tahun_anggaran to filter by year.
	// We use a subquery to get the id of the requested year to avoid complex joins.
	const targetYear = query.tahun ? Number(query.tahun) : new Date().getFullYear();
	const yearRecord = await db.select({ id: tahunAnggaran.id }).from(tahunAnggaran).where(eq(tahunAnggaran.tahun, targetYear)).limit(1);
	const targetYearId = yearRecord[0]?.id ?? null;

	// Conditions for the LEFT JOIN on anggaranSuboutput.
	// This allows us to fetch planning data for the specific context (year, satker, unit).
	const joinConditions = [
		eq(anggaranSuboutput.suboutput_id, masterSuboutput.id)
	];
	if (targetYearId) {
		joinConditions.push(eq(anggaranSuboutput.tahun_anggaran_id, targetYearId));
	}
	if (query.satker_id) {
		joinConditions.push(eq(anggaranSuboutput.satker_id, Number(query.satker_id)));
	}
	if (query.unit_id) {
		joinConditions.push(eq(anggaranSuboutput.unit_id, Number(query.unit_id)));
	}

	// Apply WHERE conditions on the main table if any (before leftJoin)
	const whereConditions = [];
	if (query.output_id) {
		whereConditions.push(eq(masterSuboutput.output_id, Number(query.output_id)));
	}

	let dbQueryWithJoin;
	if (whereConditions.length > 0) {
		dbQueryWithJoin = db
			.select(selectColumns)
			.from(masterSuboutput)
			.where(and(...whereConditions))
			.leftJoin(anggaranSuboutput, and(...joinConditions));
	} else {
		dbQueryWithJoin = db
			.select(selectColumns)
			.from(masterSuboutput)
			.leftJoin(anggaranSuboutput, and(...joinConditions));
	}

	const result = await dbQueryWithJoin.orderBy(masterSuboutput.kode_suboutput);

	return {
		success: true,
		data: result
	};
});
