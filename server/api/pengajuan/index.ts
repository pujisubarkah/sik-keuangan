import { db } from '@/server/database';
import { pengajuan } from '@/server/database/schema/pengajuan';
import { rkaklDetail } from '@/server/database/schema/rkakl_detail';
import { masterSuboutput } from '@/server/database/schema/master_suboutput';
import { masterKomponen } from '@/server/database/schema/master_komponen';
import { masterSubkomponen } from '@/server/database/schema/master_subkomponen';
import { masterAkun } from '@/server/database/schema/master_akun';
import { and, eq, inArray, ne, isNull, or } from 'drizzle-orm';
import { statusPengajuan } from '@/server/database/schema/status_pengajuan';
import { pengeluaran } from '@/server/database/schema/pengeluaran';
import { sql } from 'drizzle-orm';
import { vRkaklSaldo } from '@/server/database/schema/vRkaklSaldo';

export default defineEventHandler(async (event) => {
  // Ambil query params untuk pagination
  const query = getQuery(event);
  const page = parseInt((Array.isArray(query.page) ? query.page[0] : query.page) ?? '') || 1;
  const pageSize = parseInt((Array.isArray(query.pageSize) ? query.pageSize[0] : query.pageSize) ?? '') || 10;
  try {
    // =========================
    // 1. Ambil data pengajuan + RKAKL
    // =========================
    const data = await db
      .select({
        id: pengajuan.id,
        rkakl_detail_id: pengajuan.rkakl_detail_id,
        detil: pengajuan.detil,
        tanggal_pengajuan: pengajuan.tanggal_pengajuan,
        jumlah_pengajuan: pengajuan.jumlah_pengajuan,
        jumlah_data_dukung: pengajuan.jumlah_data_dukung,
        status_berkas: pengajuan.status_berkas,
        status_pengajuan_id: pengajuan.status_pengajuan_id,
        tahun_anggaran_id: pengajuan.tahun_anggaran_id,
        satker_id: pengajuan.satker_id,
        unit_id: pengajuan.unit_id,
        user_id: pengajuan.user_id,
        created_at: pengajuan.created_at,
        updated_at: pengajuan.updated_at,

        // RKAKL detail
        rkakl_uraian: rkaklDetail.uraian,
        rkakl_status: rkaklDetail.status,
        rkakl_jumlah: rkaklDetail.jumlah,
        rkakl_akun_id: rkaklDetail.akun_id,
        rkakl_komponen_id: rkaklDetail.komponen_id,
        rkakl_subkomponen_id: rkaklDetail.sub_komponen_id,

        // Kode struktur
        kode_suboutput: masterSuboutput.kode_suboutput,
        nama_suboutput: masterSuboutput.nama_suboutput,
        kode_komponen: masterKomponen.kode_komponen,
        kode_subkomponen: masterSubkomponen.kode_subkomponen,
        kode_akun: masterAkun.kode_akun,
        tahun_anggaran: rkaklDetail.tahun,

        // Status Pengajuan
        nama_status: statusPengajuan.nama_status,
      })
      .from(pengajuan)
      .leftJoin(rkaklDetail, eq(pengajuan.rkakl_detail_id, rkaklDetail.id))
      .leftJoin(
        masterSuboutput,
        eq(rkaklDetail.suboutput_id, masterSuboutput.id)
      )
      .leftJoin(
        masterKomponen,
        eq(rkaklDetail.komponen_id, masterKomponen.id)
      )
      .leftJoin(
        masterSubkomponen,
        eq(rkaklDetail.sub_komponen_id, masterSubkomponen.id)
      )
      .leftJoin(masterAkun, eq(rkaklDetail.akun_id, masterAkun.id))
      .leftJoin(statusPengajuan, eq(pengajuan.status_pengajuan_id, statusPengajuan.id));

    // =========================
    // 2. Ambil pengeluaran per pengajuan
    // =========================
    const pengeluaranData = await db
      .select()
      .from(pengeluaran);

    const pengeluaranMap = new Map();
    pengeluaranData.forEach((pg) => {
      pengeluaranMap.set(pg.pengajuan_id, pg);
    });

    // =========================
    // 3. Ambil saldo HANYA untuk RKAKL yang dipakai
    // =========================
    const rkaklIds = [
      ...new Set(data.map((d) => d.rkakl_detail_id).filter(Boolean)),
    ];

    const saldo = rkaklIds.length
      ? await db
          .select()
          .from(vRkaklSaldo)
          .where(inArray(vRkaklSaldo.rkakl_id, rkaklIds))
      : [];

    // Map saldo berdasarkan rkakl_id ✅
    const saldoMap = new Map();
    saldo.forEach((s) => saldoMap.set(s.rkakl_id, s));

    // =========================
    // 4. Gabungkan semua data
    // =========================
    let result = data
      .filter(item => item.status_pengajuan_id !== 2)
      .map((item) => {
        const saldoObj = saldoMap.get(item.rkakl_detail_id) || null;
        let sisa_anggaran = null;
        if (saldoObj && saldoObj.saldo != null && item.jumlah_pengajuan != null) {
          // Convert to number for calculation
          const saldoVal = Number(saldoObj.saldo);
          const pengajuanVal = Number(item.jumlah_pengajuan);
          if (!isNaN(saldoVal) && !isNaN(pengajuanVal)) {
            sisa_anggaran = saldoVal - pengajuanVal;
          }
        }
        return {
          ...item,
          pengeluaran: pengeluaranMap.get(item.id) || null,
          saldo: saldoObj,
          sisa_anggaran,
        };
      })
      .sort((a, b) => a.id - b.id);

    // Pagination logic
    const total = result.length;
    const startIdx = (page - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    result = result.slice(startIdx, endIdx);

    return {
      success: true,
      data: result,
      total,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Gagal mengambil data pengajuan",
    };
  }
});