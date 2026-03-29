import { defineEventHandler } from 'h3';
import { db } from '../../../database';
import { realisasiBulanan } from '../../../database/schema/realisasi_bulanan';
import { rkaklDetail } from '../../../database/schema/rkakl_detail';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const satkerId = Number(event.context.params?.id || event.context.params?.satker_id);
  if (!satkerId) {
    return { error: 'satker_id is required' };
  }

  // Ambil semua realisasi_bulanan yang join ke rkakl_detail dengan satker_id ini
  const rows = await db
    .select({
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
    .where(eq(rkaklDetail.satker_id, satkerId));

  // Agregasi total per bulan
  const total = rows.reduce((acc, row: Record<string, string | null>) => {
    for (const bulan of ['jan','feb','mar','apr','mei','jun','jul','agt','sep','okt','nov','des']) {
      acc[bulan] = (parseFloat(String(acc[bulan] ?? 0)) + parseFloat(String(row[bulan] ?? 0))).toString();
    }
    return acc;
  }, { satker_id: satkerId } as Record<string, string | number>);

  return total;
});
