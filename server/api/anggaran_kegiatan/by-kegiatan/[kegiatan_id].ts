import { db } from '@/server/database';
import { anggaranSuboutput } from '@/server/database/schema/anggaran_suboutput';
import { masterSuboutput } from '@/server/database/schema/master_suboutput';
import { masterOutput } from '@/server/database/schema/master_output';
import { masterKegiatan } from '@/server/database/schema/master_kegiatan';
import { masterProgram } from '@/server/database/schema/master_program';
import { tahunAnggaran } from '@/server/database/schema/tahun_anggaran';
import { satker } from '@/server/database/schema/satker';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  // Safely get kegiatan_id from params
  let kegiatan_id: string | undefined;
  if (event.context && event.context.params && typeof event.context.params === 'object') {
    kegiatan_id = (event.context.params as Record<string, string>)["kegiatan_id"];
  }
  if (!kegiatan_id) return { success: false, message: 'Missing kegiatan_id' };

  if (event.node.req.method === 'PUT') {
    const body = await readBody(event);
    // body: { program_nama, satker_name, program_kode, tahun_anggaran }
    if (!body.program_nama && !body.satker_name && !body.program_kode && !body.tahun_anggaran) {
      return { success: false, message: 'No fields to update' };
    }
    // Update masterKegiatan (nama, kode)
    let updatedKegiatan = null;
    if (body.program_nama || body.program_kode) {
      updatedKegiatan = await db.update(masterKegiatan)
        .set({
          ...(body.program_nama && { nama_kegiatan: body.program_nama }),
          ...(body.program_kode && { kode_kegiatan: body.program_kode })
        })
        .where(eq(masterKegiatan.id, Number(kegiatan_id)))
        .returning();
    }
    // Update satker_name dan tahun_anggaran pada semua anggaranSuboutput di kegiatan ini
    let updatedSatker = null;
    let updatedTahun = null;
    if (body.satker_name) {
      // Update satker.name untuk semua satker_id yang terkait kegiatan ini
      const first = await db.select({ satker_id: anggaranSuboutput.satker_id })
        .from(anggaranSuboutput)
        .leftJoin(masterSuboutput, eq(anggaranSuboutput.suboutput_id, masterSuboutput.id))
        .leftJoin(masterOutput, eq(masterSuboutput.output_id, masterOutput.id))
        .leftJoin(masterKegiatan, eq(masterOutput.kegiatan_id, masterKegiatan.id))
        .where(eq(masterKegiatan.id, Number(kegiatan_id)))
        .limit(1);
      if (first.length && first[0]?.satker_id) {
        updatedSatker = await db.update(satker)
          .set({ name: body.satker_name })
          .where(eq(satker.id, first[0]?.satker_id))
          .returning();
      }
    }
    if (body.tahun_anggaran) {
      // Update tahunAnggaran.tahun untuk semua tahun_anggaran_id yang terkait kegiatan ini
      const first = await db.select({ tahun_anggaran_id: anggaranSuboutput.tahun_anggaran_id })
        .from(anggaranSuboutput)
        .leftJoin(masterSuboutput, eq(anggaranSuboutput.suboutput_id, masterSuboutput.id))
        .leftJoin(masterOutput, eq(masterSuboutput.output_id, masterOutput.id))
        .leftJoin(masterKegiatan, eq(masterOutput.kegiatan_id, masterKegiatan.id))
        .where(eq(masterKegiatan.id, Number(kegiatan_id)))
        .limit(1);
      if (first.length && first[0]?.tahun_anggaran_id) {
        updatedTahun = await db.update(tahunAnggaran)
          .set({ tahun: body.tahun_anggaran })
          .where(eq(tahunAnggaran.id, first[0]?.tahun_anggaran_id))
          .returning();
      }
    }
    return { success: true, updatedKegiatan, updatedSatker, updatedTahun };
  }

  // GET logic (default)
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
    .where(eq(masterKegiatan.id, Number(kegiatan_id)));

  // Hitung total anggaran kegiatan
  const total_anggaran = data.reduce((sum, item) => sum + Number(item.anggaran || 0), 0);

  // Ambil info summary dari data pertama jika ada data
  let kegiatan_nama = null;
  let satker_name = null;
  let kegiatan_kode = null;
  let tahun_anggaran = null;
  if (data.length > 0) {
    kegiatan_nama = data[0]?.kegiatan_nama ?? null;
    satker_name = data[0]?.satker_name ?? null;
    kegiatan_kode = data[0]?.kegiatan_kode ?? null;
    tahun_anggaran = data[0]?.tahun_anggaran ?? null;
  }

  // Map data hanya ke suboutput_nama dan anggaran
  const suboutputs = data.map(item => ({
    suboutput_nama: item.suboutput_nama,
    anggaran: item.anggaran
  }));

  return {
    success: true,
    data: suboutputs,
    total_anggaran,
    kegiatan_nama,
    satker_name,
    kegiatan_kode,
    tahun_anggaran
  };
});
