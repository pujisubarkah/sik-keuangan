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
  // Safely get id from params (Nuxt 3: event.context.params, fallback to getRouterParam if needed)
  let id: string | undefined;
  if (event.context && event.context.params && typeof event.context.params === 'object') {
    id = (event.context.params as Record<string, string>)["id"];
  }
  if (!id) return { success: false, message: 'Missing id' };

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
    .where(eq(anggaranSuboutput.id, Number(id)));

  return { success: true, data: data[0] };
});
