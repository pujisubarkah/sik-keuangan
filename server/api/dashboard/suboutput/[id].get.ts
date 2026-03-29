import { db } from "@/server/database";
import { masterSuboutput } from "@/server/database/schema/master_suboutput";
import { anggaranSuboutput } from "@/server/database/schema/anggaran_suboutput";
import { tahunAnggaran } from "@/server/database/schema/tahun_anggaran";
import { satker } from "@/server/database/schema/satker";
import { unit } from "@/server/database/schema/unit_kerja";
import { rkaklDetail } from "@/server/database/schema/rkakl_detail";
import { pengajuan } from "@/server/database/schema/pengajuan";
import { eq, and, sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  // Ambil ID suboutput dari path (parameter URL) e.g., /api/dashboard/suboutput/123
  const params = event.context.params as { id?: string } | undefined;
  const suboutputId = params?.id ? Number(params.id) : null;
  if (!suboutputId) {
    throw createError({ statusCode: 400, statusMessage: "Parameter suboutput_id diperlukan di path" });
  }

  // Ambil tahun dari query jika ada, default tahun sekarang
  const query = getQuery(event);
  const targetYear = query.tahun ? Number(query.tahun) : new Date().getFullYear();
  const yearRecord = await db.select({ id: tahunAnggaran.id }).from(tahunAnggaran).where(eq(tahunAnggaran.tahun, targetYear)).limit(1);
  const targetYearId = yearRecord[0]?.id ?? null;

  // Kolom yang di-select
  const selectColumns = {
    id: masterSuboutput.id,
    suboutput_id: masterSuboutput.id,
    kode_suboutput: masterSuboutput.kode_suboutput,
    nama_suboutput: masterSuboutput.nama_suboutput,
    output_id: masterSuboutput.output_id,
    total: masterSuboutput.total,
    perencanaan: sql<number>`COALESCE(${anggaranSuboutput.anggaran}, 0)`.mapWith(Number),
    satker_name: satker.name,
    unit_name: unit.name,
    tahun_anggaran: tahunAnggaran.tahun,
    rkakl_total: sql<number>`COALESCE((SELECT SUM(jumlah) FROM rkakl_detail WHERE rkakl_detail.suboutput_id = ${masterSuboutput.id}), 0)`.mapWith(Number),
  };

  // Join ke anggaranSuboutput, satker, unit, tahunAnggaran
  const joinConditions = [eq(anggaranSuboutput.suboutput_id, masterSuboutput.id)];
  if (targetYearId) joinConditions.push(eq(anggaranSuboutput.tahun_anggaran_id, targetYearId));
  if (query.satker_id) joinConditions.push(eq(anggaranSuboutput.satker_id, Number(query.satker_id)));
  if (query.unit_id) joinConditions.push(eq(anggaranSuboutput.unit_id, Number(query.unit_id)));

  // Query utama: filter by suboutputId
  const result = await db
    .select(selectColumns)
    .from(masterSuboutput)
    .where(eq(masterSuboutput.id, suboutputId))
    .leftJoin(anggaranSuboutput, and(...joinConditions))
    .leftJoin(satker, eq(anggaranSuboutput.satker_id, satker.id))
    .leftJoin(unit, eq(anggaranSuboutput.unit_id, unit.id))
    .leftJoin(tahunAnggaran, eq(anggaranSuboutput.tahun_anggaran_id, tahunAnggaran.id))
    .limit(1);

  if (!result.length) {
    return { success: false, message: "Suboutput tidak ditemukan" };
  }

  const row = result[0]!;

  // Ambil pagu (sum rkakl_detail) khusus untuk id ini
  const rkaklRows = await db.select({
    jumlah: rkaklDetail.jumlah
  })
  .from(rkaklDetail)
  .where(eq(rkaklDetail.suboutput_id, suboutputId));

  const pagu = rkaklRows.reduce((sum, r) => sum + Number(r.jumlah || 0), 0);

  // Ambil realisasi pengajuan khusus untuk suboutput id ini
  const pengajuanList = await db.select({
    jumlah_pengajuan: pengajuan.jumlah_pengajuan,
    status_pengajuan_id: pengajuan.status_pengajuan_id,
  })
  .from(pengajuan)
  .innerJoin(rkaklDetail, eq(pengajuan.rkakl_detail_id, rkaklDetail.id))
  .where(eq(rkaklDetail.suboutput_id, suboutputId));

  // Hitung jumlah pengajuan berdasarkan status
  const jumlahPengajuan = pengajuanList
    .filter((p) => p.status_pengajuan_id !== 2)
    .reduce((sum, p) => sum + Number(p.jumlah_pengajuan || 0), 0);
    
  const jumlahPengeluaran = pengajuanList
    .filter((p) => p.status_pengajuan_id === 2)
    .reduce((sum, p) => sum + Number(p.jumlah_pengajuan || 0), 0);

  const treasurerRealization = pengajuanList.reduce((sum, p) => sum + Number(p.jumlah_pengajuan || 0), 0);
  const treasurerAbsorption = pagu > 0 ? (treasurerRealization / pagu) * 100 : 0;
  const treasurerBalance = pagu - treasurerRealization;
  
  const sp2dRealization = pengajuanList
    .filter((p) => p.status_pengajuan_id === 2)
    .reduce((sum, p) => sum + Number(p.jumlah_pengajuan || 0), 0);
  const sp2dAbsorption = pagu > 0 ? (sp2dRealization / pagu) * 100 : 0;
  const sp2dBalance = pagu - sp2dRealization;

  return {
    success: true,
    data: [{
      ...row,
      pagu,
      treasurerRealization,
      treasurerAbsorption,
      treasurerBalance,
      sp2dRealization,
      sp2dAbsorption,
      sp2dBalance,
      jumlahPengajuan,
      jumlahPengeluaran,
      stats: {
        pengeluaranCount: pengajuanList.filter(p => p.status_pengajuan_id === 2).length,
        pengajuanCount: pengajuanList.filter(p => p.status_pengajuan_id !== 2).length
      }
    }]
  };
});
