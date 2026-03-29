import { defineEventHandler } from 'h3';
import { db } from '../../database';
import { realisasiBulanan } from '../../database/schema/realisasi_bulanan';

export default defineEventHandler(async () => {
  // Ambil semua data realisasi_bulanan
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
    .from(realisasiBulanan);

  // Agregasi total per bulan seluruh data
  const total = rows.reduce((acc, row: Record<string, string | null>) => {
    for (const bulan of ['jan','feb','mar','apr','mei','jun','jul','agt','sep','okt','nov','des']) {
      acc[bulan] = (parseFloat(String(acc[bulan] ?? 0)) + parseFloat(String(row[bulan] ?? 0))).toString();
    }
    return acc;
  }, {} as Record<string, string>);

  return total;
});
