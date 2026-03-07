import { eq, sql } from 'drizzle-orm';
import { anggaranSuboutput } from '../../database/schema/anggaran_suboutput';
import { masterSuboutput } from '../../database/schema/master_suboutput';
import { masterOutput } from '../../database/schema/master_output';
import { masterKegiatan } from '../../database/schema/master_kegiatan';
import { masterProgram } from '../../database/schema/master_program';
import { satker } from '../../database/schema/satker';
import { tahunAnggaran } from '../../database/schema/tahun_anggaran';
import { db } from '../../database';

export default defineEventHandler(async (event) => {
  const result = await db
    .select({
      id: masterProgram.id,
      program_id: masterProgram.id,
      nama_program: masterProgram.nama_program,
      satker_id: anggaranSuboutput.satker_id,
      satker_name: satker.name,
      tahun_anggaran_id: anggaranSuboutput.tahun_anggaran_id,
      tahun: tahunAnggaran.tahun,
      kegiatan: sql<number>`count(distinct ${masterKegiatan.id})`.as('kegiatan'),
      output: sql<number>`count(distinct ${masterOutput.id})`.as('output'),
      suboutput: sql<number>`count(distinct ${masterSuboutput.id})`.as('suboutput'),
      jumlah: sql<string>`coalesce(sum(${anggaranSuboutput.anggaran}), 0)`.as('jumlah'),
      kode: masterProgram.kode_program,
    })
    .from(anggaranSuboutput)
    .innerJoin(masterSuboutput, eq(anggaranSuboutput.suboutput_id, masterSuboutput.id))
    .innerJoin(masterOutput, eq(masterSuboutput.output_id, masterOutput.id))
    .innerJoin(masterKegiatan, eq(masterOutput.kegiatan_id, masterKegiatan.id))
    .innerJoin(masterProgram, eq(masterKegiatan.program_id, masterProgram.id))
    .leftJoin(satker, eq(anggaranSuboutput.satker_id, satker.id))
    .leftJoin(tahunAnggaran, eq(anggaranSuboutput.tahun_anggaran_id, tahunAnggaran.id))
    .groupBy(
      masterProgram.id,
      masterProgram.nama_program,
      masterProgram.kode_program,
      anggaranSuboutput.satker_id,
      satker.name,
      anggaranSuboutput.tahun_anggaran_id,
      tahunAnggaran.tahun,
    )
    .orderBy(masterProgram.kode_program, satker.name, tahunAnggaran.tahun);

  return result;
});
