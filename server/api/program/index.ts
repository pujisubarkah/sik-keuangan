
import { db } from '@/server/database';
import { masterProgram } from '@/server/database/schema/master_program';
import { masterKegiatan } from '@/server/database/schema/master_kegiatan';
import { masterOutput } from '@/server/database/schema/master_output';
import { masterSuboutput } from '@/server/database/schema/master_suboutput';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  // GET: List all programs
  if (event.node.req.method === 'GET') {
    // Ambil semua program
    const data = await db.select().from(masterProgram).orderBy(masterProgram.id);
    // Ambil semua kegiatan sekaligus (untuk efisiensi)
    const kegiatanAll = await db.select().from(masterKegiatan);
    // Hitung jumlah kegiatan per program
    const kegiatanCountMap: Record<number, number> = {};
    for (const keg of kegiatanAll) {
      const pid = typeof keg.program_id === 'number' ? keg.program_id : Number(keg.program_id);
      if (!pid && pid !== 0) continue;
      if (!kegiatanCountMap[pid]) kegiatanCountMap[pid] = 0;
      kegiatanCountMap[pid]++;
    }
    // Ambil semua output sekaligus
    const outputAll = await db.select().from(masterOutput);
    // Hitung jumlah output per program (lewat kegiatan)
    const outputCountMap: Record<number, number> = {};
    for (const out of outputAll) {
      const kid = typeof out.kegiatan_id === 'number' ? out.kegiatan_id : Number(out.kegiatan_id);
      if (!kid && kid !== 0) continue;
      // Cari program_id dari kegiatan
      const kegiatan = kegiatanAll.find(k => k.id === kid);
      if (!kegiatan) continue;
      const pid = typeof kegiatan.program_id === 'number' ? kegiatan.program_id : Number(kegiatan.program_id);
      if (!pid && pid !== 0) continue;
      if (!outputCountMap[pid]) outputCountMap[pid] = 0;
      outputCountMap[pid]++;
    }
    // Ambil semua suboutput sekaligus
    const suboutputAll = await db.select().from(masterSuboutput);
    // Hitung jumlah suboutput per program (lewat output dan kegiatan)
    const suboutputCountMap: Record<number, number> = {};
    for (const sub of suboutputAll) {
      const oid = typeof sub.output_id === 'number' ? sub.output_id : Number(sub.output_id);
      if (!oid && oid !== 0) continue;
      // Cari kegiatan_id dari output
      const output = outputAll.find(o => o.id === oid);
      if (!output) continue;
      const kid = typeof output.kegiatan_id === 'number' ? output.kegiatan_id : Number(output.kegiatan_id);
      if (!kid && kid !== 0) continue;
      // Cari program_id dari kegiatan
      const kegiatan = kegiatanAll.find(k => k.id === kid);
      if (!kegiatan) continue;
      const pid = typeof kegiatan.program_id === 'number' ? kegiatan.program_id : Number(kegiatan.program_id);
      if (!pid && pid !== 0) continue;
      if (!suboutputCountMap[pid]) suboutputCountMap[pid] = 0;
      suboutputCountMap[pid]++;
    }
    // Gabungkan ke data program
    const dataWithCounts = data.map(p => ({
      ...p,
      jumlah_kegiatan: kegiatanCountMap[p.id] || 0,
      jumlah_output: outputCountMap[p.id] || 0,
      jumlah_suboutput: suboutputCountMap[p.id] || 0
    }));
    return { success: true, data: dataWithCounts };
  }

  // POST: Create new program
  if (event.node.req.method === 'POST') {
    const body = await readBody(event);
    if (!body.kode_program || !body.nama_program) {
      return { success: false, message: 'kode_program dan nama_program wajib diisi' };
    }
    const now = new Date();
    const inserted = await db.insert(masterProgram).values({
      kode_program: body.kode_program,
      nama_program: body.nama_program,
      created_at: now,
      updated_at: now,
      total: body.total ?? null,
    }).returning();
    return { success: true, data: inserted[0] };
  }

  // PUT: Update program
  if (event.node.req.method === 'PUT') {
    const body = await readBody(event);
    if (!body.id) return { success: false, message: 'ID wajib diisi' };
    const now = new Date();
    const updated = await db.update(masterProgram)
      .set({
        ...(body.kode_program && { kode_program: body.kode_program }),
        ...(body.nama_program && { nama_program: body.nama_program }),
        ...(body.total !== undefined && { total: body.total }),
        updated_at: now,
      })
      .where(eq(masterProgram.id, body.id))
      .returning();
    return { success: true, data: updated[0] };
  }

  // DELETE: Delete program
  if (event.node.req.method === 'DELETE') {
    const body = await readBody(event);
    if (!body.id) return { success: false, message: 'ID wajib diisi' };
    const deleted = await db.delete(masterProgram)
      .where(eq(masterProgram.id, body.id))
      .returning();
    return { success: true, data: deleted[0] };
  }

  return { success: false, message: 'Method not allowed' };
});
