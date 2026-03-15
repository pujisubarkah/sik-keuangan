

import { eq } from 'drizzle-orm';
import { anggaranSuboutput } from '../../database/schema/anggaran_suboutput';
import { tahunAnggaran } from '../../database/schema/tahun_anggaran';
import { db } from '../../database';
import { readBody, sendError, createError } from 'h3';

export default defineEventHandler(async (event) => {

	if (event.method === 'GET') {
		// List all anggaran_suboutput with tahun_anggaran join
		const result = await db
			.select({
				id: anggaranSuboutput.id,
				suboutput_id: anggaranSuboutput.suboutput_id,
				satker_id: anggaranSuboutput.satker_id,
				unit_id: anggaranSuboutput.unit_id,
				tahun_anggaran_id: anggaranSuboutput.tahun_anggaran_id,
				anggaran: anggaranSuboutput.anggaran,
				tahun: tahunAnggaran.tahun
			})
			.from(anggaranSuboutput)
			.leftJoin(tahunAnggaran, eq(anggaranSuboutput.tahun_anggaran_id, tahunAnggaran.id))
			.orderBy(anggaranSuboutput.id);
		return result;
	}

	if (event.method === 'POST') {
		const body = await readBody(event);
		// Validasi minimal
		if (!body.suboutput_id || !body.satker_id || !body.unit_id || !body.tahun_anggaran_id || !body.anggaran) {
			return sendError(event, createError({ statusCode: 400, statusMessage: 'Data tidak lengkap' }));
		}
		const inserted = await db.insert(anggaranSuboutput).values({
			suboutput_id: Number(body.suboutput_id),
			satker_id: Number(body.satker_id),
			unit_id: Number(body.unit_id),
			tahun_anggaran_id: Number(body.tahun_anggaran_id),
			anggaran: body.anggaran,
		}).returning();
		return { success: true, data: inserted };
	}
});
