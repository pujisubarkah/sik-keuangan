import { eq, sql, and } from 'drizzle-orm';
import { anggaranSuboutput } from '../../database/schema/anggaran_suboutput';
import { masterSuboutput } from '../../database/schema/master_suboutput';
import { masterOutput } from '../../database/schema/master_output';
import { masterKegiatan } from '../../database/schema/master_kegiatan';
import { satker } from '../../database/schema/satker';
import { tahunAnggaran } from '../../database/schema/tahun_anggaran';
import { unit } from '../../database/schema/unit_kerja';
import { db } from '../../database';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const whereClause = [];

  if (query.satker_id && query.satker_id !== '') {
    whereClause.push(eq(anggaranSuboutput.satker_id, Number(query.satker_id)));
  }
  // Perbaiki bagian unit_id:
  if (query.unit_id && query.unit_id !== '') {
    whereClause.push(eq(anggaranSuboutput.unit_id, Number(query.unit_id)));
  }
  // Jika unit_id tidak dikirim, JANGAN tambahkan filter unit sama sekali!

  if (query.tahun) {
    whereClause.push(eq(tahunAnggaran.tahun, Number(query.tahun)));
  }

  const result = await db
    .select({
      anggaranSuboutput,
      kode: sql`CONCAT(master_kegiatan.kode_kegiatan, '.', master_output.kode_output, '.', master_suboutput.kode_suboutput)`,
      nama_suboutput: masterSuboutput.nama_suboutput,
      nama_satker: satker.name,
      nama_unit: unit.name,
      tahun: tahunAnggaran.tahun,
    })
    .from(anggaranSuboutput)
    .innerJoin(masterSuboutput, eq(anggaranSuboutput.suboutput_id, masterSuboutput.id))
    .innerJoin(masterOutput, eq(masterSuboutput.output_id, masterOutput.id))
    .innerJoin(masterKegiatan, eq(masterOutput.kegiatan_id, masterKegiatan.id))
    .innerJoin(satker, eq(anggaranSuboutput.satker_id, satker.id))
    .leftJoin(unit, eq(anggaranSuboutput.unit_id, unit.id)) // gunakan leftJoin agar data unit_id null tetap muncul
    .innerJoin(tahunAnggaran, eq(anggaranSuboutput.tahun_anggaran_id, tahunAnggaran.id))
    .where(whereClause.length ? and(...whereClause) : undefined)
    .orderBy(anggaranSuboutput.id);

  return result;
});
