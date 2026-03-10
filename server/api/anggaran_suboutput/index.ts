import { eq, sql, and } from 'drizzle-orm';
import { rkaklDetail } from '../../database/schema/rkakl_detail';
import { masterSuboutput } from '../../database/schema/master_suboutput';
import { masterOutput } from '../../database/schema/master_output';
import { masterKegiatan } from '../../database/schema/master_kegiatan';
import { satker } from '../../database/schema/satker';
import { unit } from '../../database/schema/unit_kerja';
import { db } from '../../database';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const whereClause = [];

  if (query.satker_id && query.satker_id !== '') {
    whereClause.push(eq(rkaklDetail.satker_id, Number(query.satker_id)));
  }
  if (query.tahun) {
    whereClause.push(eq(rkaklDetail.tahun, Number(query.tahun)));
  }
  if (query.suboutput_id && query.suboutput_id !== '') {
    whereClause.push(eq(rkaklDetail.suboutput_id, Number(query.suboutput_id)));
  }
  // Add more filters as needed

  const result = await db
    .select({
      id: rkaklDetail.id,
      program_id: rkaklDetail.program_id,
      kegiatan_id: rkaklDetail.kegiatan_id,
      output_id: rkaklDetail.output_id,
      suboutput_id: rkaklDetail.suboutput_id,
      komponen_id: rkaklDetail.komponen_id,
      sub_komponen_id: rkaklDetail.sub_komponen_id,
      akun_id: rkaklDetail.akun_id,
      volume: rkaklDetail.volume,
      satuan: rkaklDetail.satuan,
      harga_satuan: rkaklDetail.harga_satuan,
      jumlah: rkaklDetail.jumlah,
      tahun: rkaklDetail.tahun,
      created_at: rkaklDetail.created_at,
      updated_at: rkaklDetail.updated_at,
      import_id: rkaklDetail.import_id,
      status: rkaklDetail.status,
      satker_id: rkaklDetail.satker_id,
      kode: sql`CONCAT(master_kegiatan.kode_kegiatan, '.', master_output.kode_output, '.', master_suboutput.kode_suboutput)`,
      nama_suboutput: masterSuboutput.nama_suboutput,
      nama_satker: satker.name,
      nama_unit: unit.name,
    })
    .from(rkaklDetail)
    .innerJoin(masterSuboutput, eq(rkaklDetail.suboutput_id, masterSuboutput.id))
    .innerJoin(masterOutput, eq(masterSuboutput.output_id, masterOutput.id))
    .innerJoin(masterKegiatan, eq(masterOutput.kegiatan_id, masterKegiatan.id))
    .innerJoin(satker, eq(rkaklDetail.satker_id, satker.id))
    .leftJoin(unit, eq(satker.id, unit.satker_id))
    .where(whereClause.length ? and(...whereClause) : undefined)
    .orderBy(rkaklDetail.id);

  return result;
});
