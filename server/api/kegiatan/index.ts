import { db } from '@/server/database';
import { masterKegiatan } from '@/server/database/schema/master_kegiatan';
import { masterProgram } from '@/server/database/schema/master_program';
import { eq } from 'drizzle-orm';
import { masterOutput } from '@/server/database/schema/master_output';
import { masterSuboutput } from '@/server/database/schema/master_suboutput';

export default defineEventHandler(async (event) => {
	// GET: List all kegiatan (with program info and jumlah_output)
	if (event.node.req.method === 'GET') {
		// Ambil semua kegiatan
		const kegiatan = await db.select().from(masterKegiatan).orderBy(masterKegiatan.id);
		// Ambil semua program
		const programs = await db.select().from(masterProgram);
		// Ambil semua output
		const outputs = await db.select().from(masterOutput);
		// Hitung jumlah output per kegiatan
		const outputCountMap: Record<number, number> = {};
		for (const out of outputs) {
			const kid = typeof out.kegiatan_id === 'number' ? out.kegiatan_id : Number(out.kegiatan_id);
			if (!kid && kid !== 0) continue;
			if (!outputCountMap[kid]) outputCountMap[kid] = 0;
			outputCountMap[kid]++;
		}

		// Ambil semua suboutput
		const suboutputs = await db.select().from(masterSuboutput);
		// Hitung jumlah suboutput per kegiatan (lewat output)
		const suboutputCountMap: Record<number, number> = {};
		for (const sub of suboutputs) {
			const oid = typeof sub.output_id === 'number' ? sub.output_id : Number(sub.output_id);
			if (!oid && oid !== 0) continue;
			// Cari kegiatan_id dari output
			const output = outputs.find(o => o.id === oid);
			if (!output) continue;
			const kid = typeof output.kegiatan_id === 'number' ? output.kegiatan_id : Number(output.kegiatan_id);
			if (!kid && kid !== 0) continue;
			if (!suboutputCountMap[kid]) suboutputCountMap[kid] = 0;
			suboutputCountMap[kid]++;
		}
		// Gabungkan nama_program, kode_program, jumlah_output, jumlah_suboutput ke setiap kegiatan
		const data = kegiatan.map(item => {
			const prog = programs.find(p => p.id === item.program_id);
			return {
				...item,
				nama_program: prog ? prog.nama_program : null,
				kode_program: prog ? prog.kode_program : null,
				tahun_anggaran: prog && prog.created_at ? new Date(prog.created_at).getFullYear() : null,
				jumlah_output: outputCountMap[item.id] || 0,
				jumlah_suboutput: suboutputCountMap[item.id] || 0,
			};
		});
		return { success: true, data };
	}

	// POST: Create new kegiatan
	if (event.node.req.method === 'POST') {
		const body = await readBody(event);
		if (!body.kode_kegiatan || !body.nama_kegiatan || !body.program_id) {
			return { success: false, message: 'kode_kegiatan, nama_kegiatan, dan program_id wajib diisi' };
		}
		const now = new Date();
		const inserted = await db.insert(masterKegiatan).values({
			kode_kegiatan: body.kode_kegiatan,
			nama_kegiatan: body.nama_kegiatan,
			program_id: body.program_id,
			created_at: now,
			updated_at: now,
			total: body.total ?? null,
		}).returning();
		return { success: true, data: inserted[0] };
	}

	// PUT: Update kegiatan
	if (event.node.req.method === 'PUT') {
		const body = await readBody(event);
		if (!body.id) return { success: false, message: 'ID wajib diisi' };
		const now = new Date();
		const updated = await db.update(masterKegiatan)
			.set({
				...(body.kode_kegiatan && { kode_kegiatan: body.kode_kegiatan }),
				...(body.nama_kegiatan && { nama_kegiatan: body.nama_kegiatan }),
				...(body.program_id !== undefined && { program_id: body.program_id }),
				...(body.total !== undefined && { total: body.total }),
				updated_at: now,
			})
			.where(eq(masterKegiatan.id, body.id))
			.returning();
		return { success: true, data: updated[0] };
	}

	// DELETE: Delete kegiatan
	if (event.node.req.method === 'DELETE') {
		const body = await readBody(event);
		if (!body.id) return { success: false, message: 'ID wajib diisi' };
		const deleted = await db.delete(masterKegiatan)
			.where(eq(masterKegiatan.id, body.id))
			.returning();
		return { success: true, data: deleted[0] };
	}

	return { success: false, message: 'Method not allowed' };
});
