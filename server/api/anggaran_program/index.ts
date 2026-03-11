
import { db } from '@/server/database';
import { anggaranSuboutput } from '@/server/database/schema/anggaran_suboutput';
import { masterSuboutput } from '@/server/database/schema/master_suboutput';
import { masterOutput } from '@/server/database/schema/master_output';
import { masterKegiatan } from '@/server/database/schema/master_kegiatan';
import { masterProgram } from '@/server/database/schema/master_program';
import { tahunAnggaran } from '@/server/database/schema/tahun_anggaran';
import { satker } from '@/server/database/schema/satker';
import { eq, and } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  if (method === 'GET') {
    // Query params: suboutput_id, satker_id, tahun_anggaran_id
    const { suboutput_id, satker_id, tahun_anggaran_id } = getQuery(event);
    const where = [];
    if (suboutput_id) where.push(eq(anggaranSuboutput.suboutput_id, Number(suboutput_id)));
    if (satker_id) where.push(eq(anggaranSuboutput.satker_id, Number(satker_id)));
    if (tahun_anggaran_id) where.push(eq(anggaranSuboutput.tahun_anggaran_id, Number(tahun_anggaran_id)));

    // Join ke semua relasi
    const data = await db
      .select({
        id: anggaranSuboutput.id,
        anggaran: anggaranSuboutput.anggaran,
        tahun_anggaran: tahunAnggaran.tahun,
        tahun_anggaran_id: anggaranSuboutput.tahun_anggaran_id,
        satker_id: anggaranSuboutput.satker_id,
        satker_name: satker.name,
        unit_id: anggaranSuboutput.unit_id,
        suboutput_id: anggaranSuboutput.suboutput_id,
        suboutput_kode: masterSuboutput.kode_suboutput,
        suboutput_nama: masterSuboutput.nama_suboutput,
        output_id: masterSuboutput.output_id,
        output_kode: masterOutput.kode_output,
        output_nama: masterOutput.nama_output,
        kegiatan_id: masterOutput.kegiatan_id,
        kegiatan_kode: masterKegiatan.kode_kegiatan,
        kegiatan_nama: masterKegiatan.nama_kegiatan,
        program_id: masterKegiatan.program_id,
        program_kode: masterProgram.kode_program,
        program_nama: masterProgram.nama_program,
      })
      .from(anggaranSuboutput)
      .leftJoin(tahunAnggaran, eq(anggaranSuboutput.tahun_anggaran_id, tahunAnggaran.id))
      .leftJoin(satker, eq(anggaranSuboutput.satker_id, satker.id))
      .leftJoin(masterSuboutput, eq(anggaranSuboutput.suboutput_id, masterSuboutput.id))
      .leftJoin(masterOutput, eq(masterSuboutput.output_id, masterOutput.id))
      .leftJoin(masterKegiatan, eq(masterOutput.kegiatan_id, masterKegiatan.id))
      .leftJoin(masterProgram, eq(masterKegiatan.program_id, masterProgram.id))
      .where(where.length ? and(...where) : undefined);
    return { success: true, data };
  }

  if (method === 'POST') {
    const body = await readBody(event);
    // body: { suboutput_id, satker_id, unit_id, tahun_anggaran_id, anggaran }
    if (!body.suboutput_id || !body.satker_id || !body.unit_id || !body.tahun_anggaran_id || !body.anggaran) {
      return { success: false, message: 'Missing required fields' };
    }
    const inserted = await db.insert(anggaranSuboutput)
      .values({
        suboutput_id: Number(body.suboutput_id),
        satker_id: Number(body.satker_id),
        unit_id: Number(body.unit_id),
        tahun_anggaran_id: Number(body.tahun_anggaran_id),
        anggaran: body.anggaran,
      })
      .returning();
    return { success: true, data: inserted[0] };
  }

  if (method === 'PUT') {
    const body = await readBody(event);
    // body: { id, ...fields to update }
    if (!body.id) return { success: false, message: 'Missing id' };
    const updated = await db.update(anggaranSuboutput)
      .set({
        suboutput_id: body.suboutput_id,
        satker_id: body.satker_id,
        unit_id: body.unit_id,
        tahun_anggaran_id: body.tahun_anggaran_id,
        anggaran: body.anggaran,
      })
      .where(eq(anggaranSuboutput.id, Number(body.id)))
      .returning();
    return { success: true, data: updated[0] };
  }

  if (method === 'DELETE') {
    const { id } = getQuery(event);
    if (!id) return { success: false, message: 'Missing id' };
    await db.delete(anggaranSuboutput).where(eq(anggaranSuboutput.id, Number(id)));
    return { success: true };
  }

  return { success: false, message: 'Method not allowed' };
});
