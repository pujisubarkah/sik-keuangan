import { db } from '@/server/database';
import { masterKegiatan } from '@/server/database/schema/master_kegiatan';
import { masterProgram } from '@/server/database/schema/master_program';
import { eq } from 'drizzle-orm';
import { masterOutput } from '@/server/database/schema/master_output';
import { masterSuboutput } from '@/server/database/schema/master_suboutput';

export default defineEventHandler(async (event) => {
	// Ambil id dari params
	let id: string | undefined;
	if (event.context && event.context.params && typeof event.context.params === 'object') {
		id = (event.context.params as Record<string, string>)["id"];
	}
	if (!id) return { success: false, message: 'Missing id' };

	// GET: Get kegiatan by id (with program info and summary)
	if (event.node.req.method === 'GET') {
		const kegiatanArr = await db.select().from(masterKegiatan).where(eq(masterKegiatan.id, Number(id)));
		if (!kegiatanArr.length) return { success: false, message: 'Not found' };
		const kegiatan = kegiatanArr[0];
		// Ambil program terkait
		let data = null;
		if (kegiatan) {
			const programArr = await db.select().from(masterProgram).where(eq(masterProgram.id, kegiatan.program_id));
			const program = programArr[0];
			// Ambil semua output untuk kegiatan ini
			const outputs = await db.select().from(masterOutput).where(eq(masterOutput.kegiatan_id, kegiatan.id));
			// Hitung jumlah output
			const jumlah_output = outputs.length;
			// Ambil semua suboutput untuk output-output ini
			const outputIds = outputs.map(o => o.id);
			let jumlah_suboutput = 0;
			if (outputIds.length) {
				const suboutputs = await db.select().from(masterSuboutput);
				jumlah_suboutput = suboutputs.filter(s => outputIds.includes(typeof s.output_id === 'number' ? s.output_id : Number(s.output_id))).length;
			}
			// Compose result
			data = {
				...kegiatan,
				nama_program: program ? program.nama_program : null,
				kode_program: program ? program.kode_program : null,
				tahun_anggaran: program && program.created_at ? new Date(program.created_at).getFullYear() : null,
				jumlah_output,
				jumlah_suboutput,
			};
		}
		return { success: true, data };
	}

	// PUT: Update kegiatan by id
	if (event.node.req.method === 'PUT') {
		const body = await readBody(event);
		const now = new Date();
		const updated = await db.update(masterKegiatan)
			.set({
				...(body.kode_kegiatan && { kode_kegiatan: body.kode_kegiatan }),
				...(body.nama_kegiatan && { nama_kegiatan: body.nama_kegiatan }),
				...(body.program_id !== undefined && { program_id: body.program_id }),
				...(body.total !== undefined && { total: body.total }),
				updated_at: now,
			})
			.where(eq(masterKegiatan.id, Number(id)))
			.returning();
		if (!updated.length) return { success: false, message: 'Not found or not updated' };
		return { success: true, data: updated[0] };
	}

	// DELETE: Delete kegiatan by id
	if (event.node.req.method === 'DELETE') {
		const deleted = await db.delete(masterKegiatan)
			.where(eq(masterKegiatan.id, Number(id)))
			.returning();
		if (!deleted.length) return { success: false, message: 'Not found or not deleted' };
		return { success: true, data: deleted[0] };
	}

	return { success: false, message: 'Method not allowed' };
});
