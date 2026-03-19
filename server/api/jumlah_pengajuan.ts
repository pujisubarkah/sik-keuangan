import { db } from '@/server/database';
import { pengajuan } from '@/server/database/schema/pengajuan';
import { sql } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  // Filter opsional (misal: tahun_anggaran_id, satker_id, dst)
  const query = getQuery(event);
  const where: any[] = [];
  if (query.tahun_anggaran_id) where.push(sql`tahun_anggaran_id = ${Number(query.tahun_anggaran_id)}`);
  if (query.satker_id) where.push(sql`satker_id = ${Number(query.satker_id)}`);
  // Tambahkan filter lain jika perlu

  // Query jumlah pengajuan dan total anggaran
  const result = await db.execute(sql`
    SELECT COUNT(*)::int as jumlah_pengajuan, COALESCE(SUM(jumlah_pengajuan::numeric),0) as jumlah_dana
    FROM pengajuan
    ${where.length ? sql`WHERE ${sql.join(where, sql` AND `)}` : sql``}
  `);
  const row = result.rows?.[0] || { jumlah_pengajuan: 0, jumlah_dana: 0 };
  return {
    success: true,
    jumlah_pengajuan: row.jumlah_pengajuan,
    jumlah_dana: row.jumlah_dana
  };
});
