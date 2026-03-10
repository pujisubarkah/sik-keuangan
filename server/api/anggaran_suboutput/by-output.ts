import { eq, sql } from 'drizzle-orm';
import { anggaranSuboutput } from '../../database/schema/anggaran_suboutput';
import { masterSuboutput } from '../../database/schema/master_suboutput';
import { masterOutput } from '../../database/schema/master_output';
import { masterKegiatan } from '../../database/schema/master_kegiatan';
import { satker } from '../../database/schema/satker';
import { tahunAnggaran } from '../../database/schema/tahun_anggaran';
import { db } from '../../database';

export default defineEventHandler(async (event) => {
  const result = await db
    .select({
      id: masterOutput.id,
      output_id: masterOutput.id,
      nama_output: masterOutput.nama_output,
      satker_id: anggaranSuboutput.satker_id,
      satker_name: satker.name,
      tahun_anggaran_id: anggaranSuboutput.tahun_anggaran_id,
      tahun: tahunAnggaran.tahun,
      suboutput: sql<number>`count(distinct ${masterSuboutput.id})`.as('suboutput'),
      jumlah: sql<string>`coalesce(sum(${anggaranSuboutput.anggaran}), 0)`.as('jumlah'),
      kode: masterOutput.kode_output,
    })
    .from(anggaranSuboutput)
    .innerJoin(masterSuboutput, eq(anggaranSuboutput.suboutput_id, masterSuboutput.id))
    .innerJoin(masterOutput, eq(masterSuboutput.output_id, masterOutput.id))
    .innerJoin(masterKegiatan, eq(masterOutput.kegiatan_id, masterKegiatan.id))
    .leftJoin(satker, eq(anggaranSuboutput.satker_id, satker.id))
    .leftJoin(tahunAnggaran, eq(anggaranSuboutput.tahun_anggaran_id, tahunAnggaran.id))
    .groupBy(
      masterOutput.id,
      masterOutput.nama_output,
      masterKegiatan.kode_kegiatan,
      masterOutput.kode_output,
      anggaranSuboutput.satker_id,
      satker.name,
      anggaranSuboutput.tahun_anggaran_id,
      tahunAnggaran.tahun,
    )
    .orderBy(masterKegiatan.kode_kegiatan, masterOutput.kode_output, satker.name, tahunAnggaran.tahun);

  return result;
});
