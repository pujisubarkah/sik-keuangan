import { eq, sql } from 'drizzle-orm';
import { anggaranSuboutput } from '../../../database/schema/anggaran_suboutput';
import { masterSuboutput } from '../../../database/schema/master_suboutput';
import { masterOutput } from '../../../database/schema/master_output';
import { masterKegiatan } from '../../../database/schema/master_kegiatan';
import { masterProgram } from '../../../database/schema/master_program';
import { satker } from '../../../database/schema/satker';
import { tahunAnggaran } from '../../../database/schema/tahun_anggaran';
import { unit } from '../../../database/schema/unit_kerja';
import { db } from '../../../database';
import { readBody, sendError, createError } from 'h3';

export default defineEventHandler(async (event) => {
	const id = event.context.params?.id;
	if (!id) return sendError(event, createError({ statusCode: 400, statusMessage: 'ID is required' }));

	if (event.method === 'GET') {
		// GET detail by id, join ke master
		const result = await db
			.select({
				   id: anggaranSuboutput.id,
				   suboutput_id: anggaranSuboutput.suboutput_id,
				   nama_suboutput: masterSuboutput.nama_suboutput,
				   satker_id: anggaranSuboutput.satker_id,
				   satker_name: satker.name,
				   unit_id: anggaranSuboutput.unit_id,
				   unit_name: unit.name,
				   tahun_anggaran_id: anggaranSuboutput.tahun_anggaran_id,
				   tahun: tahunAnggaran.tahun,
				   anggaran: anggaranSuboutput.anggaran,
				   kode: masterSuboutput.kode_suboutput,
				   output_id: masterOutput.id,
				   output_name: masterOutput.nama_output,
			})
			.from(anggaranSuboutput)
			.innerJoin(masterSuboutput, eq(anggaranSuboutput.suboutput_id, masterSuboutput.id))
			.innerJoin(masterOutput, eq(masterSuboutput.output_id, masterOutput.id))
			.innerJoin(masterKegiatan, eq(masterOutput.kegiatan_id, masterKegiatan.id))
			.innerJoin(masterProgram, eq(masterKegiatan.program_id, masterProgram.id))
			.leftJoin(tahunAnggaran, eq(anggaranSuboutput.tahun_anggaran_id, tahunAnggaran.id))
			.leftJoin(satker, eq(anggaranSuboutput.satker_id, satker.id))
			.leftJoin(unit, eq(anggaranSuboutput.unit_id, unit.id))
			.where(eq(anggaranSuboutput.id, Number(id)))
			.orderBy(anggaranSuboutput.id);
		return result[0] || null;
	}

	if (event.method === 'PUT') {
		const body = await readBody(event);
		const updateData: Record<string, any> = {};
		if (body.suboutput_id !== undefined) updateData.suboutput_id = Number(body.suboutput_id);
		if (body.satker_id !== undefined) updateData.satker_id = Number(body.satker_id);
		if (body.unit_id !== undefined) updateData.unit_id = Number(body.unit_id);
		if (body.tahun_anggaran_id !== undefined) updateData.tahun_anggaran_id = Number(body.tahun_anggaran_id);
		if (body.anggaran !== undefined) updateData.anggaran = body.anggaran;
		if (Object.keys(updateData).length === 0) {
			return sendError(event, createError({ statusCode: 400, statusMessage: 'No valid fields to update' }));
		}
		const updated = await db.update(anggaranSuboutput)
			.set(updateData)
			.where(eq(anggaranSuboutput.id, Number(id)))
			.returning();
		return { success: true, data: updated };
	}

	if (event.method === 'DELETE') {
		const deleted = await db.delete(anggaranSuboutput)
			.where(eq(anggaranSuboutput.id, Number(id)))
			.returning();
		return { success: true, data: deleted };
	}
});
