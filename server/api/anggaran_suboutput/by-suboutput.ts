import { eq, sql } from 'drizzle-orm';
import { anggaranSuboutput } from '../../database/schema/anggaran_suboutput';
import { masterSuboutput } from '../../database/schema/master_suboutput';
import { masterOutput } from '../../database/schema/master_output';
import { masterKegiatan } from '../../database/schema/master_kegiatan';
import { masterProgram } from '../../database/schema/master_program';
import { satker } from '../../database/schema/satker';
import { tahunAnggaran } from '../../database/schema/tahun_anggaran';
import { unit } from '../../database/schema/unit_kerja';
import { db } from '../../database';

export default defineEventHandler(async (event) => {
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
    })
    .from(anggaranSuboutput)
    .innerJoin(masterSuboutput, eq(anggaranSuboutput.suboutput_id, masterSuboutput.id))
    .innerJoin(masterOutput, eq(masterSuboutput.output_id, masterOutput.id))
    .innerJoin(masterKegiatan, eq(masterOutput.kegiatan_id, masterKegiatan.id))
    .innerJoin(masterProgram, eq(masterKegiatan.program_id, masterProgram.id))
    .leftJoin(tahunAnggaran, eq(anggaranSuboutput.tahun_anggaran_id, tahunAnggaran.id))
    .leftJoin(satker, eq(anggaranSuboutput.satker_id, satker.id))
    .leftJoin(unit, eq(anggaranSuboutput.unit_id, unit.id))
    .orderBy(anggaranSuboutput.id);

  return result;
});
