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
    .leftJoin(tahunAnggaran, eq(anggaranSuboutput.tahun_anggaran_id, tahunAnggaran.id));

  if (!result.length) {
    return { success: false, message: "Suboutput tidak ditemukan" };
  }

  // Ambil pengajuan dan rkakl_detail untuk agregat
  const pengajuanRows = await db.select({
    jumlah_pengajuan: pengajuan.jumlah_pengajuan,
    status_pengajuan_id: pengajuan.status_pengajuan_id,
    rkakl_detail_id: pengajuan.rkakl_detail_id
  }).from(pengajuan);
  const rkaklRows = await db.select({
    id: rkaklDetail.id,
    suboutput_id: rkaklDetail.suboutput_id,
    jumlah: rkaklDetail.jumlah
  }).from(rkaklDetail);
  const rkaklMap = new Map();
  for (const row of rkaklRows) {
    if (!rkaklMap.has(row.suboutput_id)) rkaklMap.set(row.suboutput_id, []);
    rkaklMap.get(row.suboutput_id).push(row);
  }
  const pengajuanMap = new Map();
  for (const p of pengajuanRows) {
    const rkakl = rkaklRows.find(r => r.id === p.rkakl_detail_id);
    if (!rkakl) continue;
    if (!pengajuanMap.has(rkakl.suboutput_id)) pengajuanMap.set(rkakl.suboutput_id, []);
    pengajuanMap.get(rkakl.suboutput_id).push(p);
  }

  // Proses agregat untuk satu suboutput
  const row = result[0]!;
  const pagu = (rkaklMap.get(row.suboutput_id) || []).reduce((sum: number, r: { jumlah: number | string }) => sum + Number(r.jumlah || 0), 0);
  const pengajuanList = pengajuanMap.get(row.suboutput_id) || [];
  // Jumlah pengajuan (status_pengajuan_id != 2)
  const jumlahPengajuan = pengajuanList
    .filter((p: { status_pengajuan_id: number }) => p.status_pengajuan_id !== 2)
    .reduce((sum: number, p: { jumlah_pengajuan: number | string }) => sum + Number(p.jumlah_pengajuan || 0), 0);
  // Jumlah pengeluaran (status_pengajuan_id == 2)
  const jumlahPengeluaran = pengajuanList
    .filter((p: { status_pengajuan_id: number }) => p.status_pengajuan_id === 2)
    .reduce((sum: number, p: { jumlah_pengajuan: number | string }) => sum + Number(p.jumlah_pengajuan || 0), 0);
  const treasurerRealization = pengajuanList.reduce((sum: number, p: { jumlah_pengajuan: number | string }) => sum + Number(p.jumlah_pengajuan || 0), 0);
  const treasurerAbsorption = pagu > 0 ? (treasurerRealization / pagu) * 100 : 0;
  const treasurerBalance = pagu - treasurerRealization;
  const sp2dRealization = pengajuanList.filter((p: { status_pengajuan_id: number }) => p.status_pengajuan_id === 2).reduce((sum: number, p: { jumlah_pengajuan: number | string, status_pengajuan_id: number }) => sum + Number(p.jumlah_pengajuan || 0), 0);
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
      jumlahPengeluaran
    }]
  };
});
