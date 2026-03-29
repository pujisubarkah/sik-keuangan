import { defineEventHandler } from 'h3';
import { db } from '../../database';
import { realisasiBulanan } from '../../database/schema/realisasi_bulanan';
import { rkaklDetail } from '../../database/schema/rkakl_detail';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  // Join realisasi_bulanan dengan rkakl_detail berdasarkan rkakl_detail_id
  const result = await db
    .select({
      rkakl_detail_id: realisasiBulanan.rkakl_detail_id,
      uraian: rkaklDetail.uraian,
      jumlah: rkaklDetail.jumlah,
      suboutput_id: rkaklDetail.suboutput_id,
      jan: realisasiBulanan.jan,
      feb: realisasiBulanan.feb,
      mar: realisasiBulanan.mar,
      apr: realisasiBulanan.apr,
      mei: realisasiBulanan.mei,
      jun: realisasiBulanan.jun,
      jul: realisasiBulanan.jul,
      agt: realisasiBulanan.agt,
      sep: realisasiBulanan.sep,
      okt: realisasiBulanan.okt,
      nov: realisasiBulanan.nov,
      des: realisasiBulanan.des,
    })
    .from(realisasiBulanan)
    .innerJoin(rkaklDetail, eq(realisasiBulanan.rkakl_detail_id, rkaklDetail.id))
    .orderBy(realisasiBulanan.rkakl_detail_id);

  return result;
});
