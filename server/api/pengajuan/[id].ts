import { db } from '@/server/database';
import { pengajuan } from '@/server/database/schema/pengajuan';
import { pengeluaran } from '@/server/database/schema/pengeluaran';
import { and, eq, inArray } from 'drizzle-orm';
import { statusPengajuan } from '@/server/database/schema/status_pengajuan';
import { rkaklDetail } from '@/server/database/schema/rkakl_detail';
import { masterSuboutput } from '@/server/database/schema/master_suboutput';
import { masterKomponen } from '@/server/database/schema/master_komponen';
import { masterSubkomponen } from '@/server/database/schema/master_subkomponen';
import { masterAkun } from '@/server/database/schema/master_akun';
import { vRkaklSaldo } from '@/server/database/schema/vRkaklSaldo';

export default defineEventHandler(async (event) => {
  const id = Number(event.context?.params?.id);
  if (!id) return { error: 'ID tidak valid' };

  if (event.method === 'GET') {
    // Get pengajuan by id beserta pengeluaran terkait
    const result = await db
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
        rkakl_akun_id: rkaklDetail.akun_id,
        rkakl_komponen_id: rkaklDetail.komponen_id,
        rkakl_subkomponen_id: rkaklDetail.sub_komponen_id,
        kode_suboutput: masterSuboutput.kode_suboutput,
        nama_suboutput: masterSuboutput.nama_suboutput,
        kode_komponen: masterKomponen.kode_komponen,
        kode_subkomponen: masterSubkomponen.kode_subkomponen,
        kode_akun: masterAkun.kode_akun,
        // Status Pengajuan
        nama_status: statusPengajuan.nama_status,
      })
      .from(pengajuan)
      .leftJoin(rkaklDetail, eq(pengajuan.rkakl_detail_id, rkaklDetail.id))
      .leftJoin(masterSuboutput, eq(rkaklDetail.suboutput_id, masterSuboutput.id))
      .leftJoin(masterKomponen, eq(rkaklDetail.komponen_id, masterKomponen.id))
      .leftJoin(masterSubkomponen, eq(rkaklDetail.sub_komponen_id, masterSubkomponen.id))
      .leftJoin(masterAkun, eq(rkaklDetail.akun_id, masterAkun.id))
      .leftJoin(statusPengajuan, eq(pengajuan.status_pengajuan_id, statusPengajuan.id))
      .where(eq(pengajuan.id, id));
    if (!result.length) return { error: 'Data tidak ditemukan' };
    const pengajuanData = result[0];
    if (!pengajuanData) return { error: 'Data tidak ditemukan' };
    const pengeluaranData = await db
      .select()
      .from(pengeluaran)
      .where(eq(pengeluaran.pengajuan_id, id))
      .orderBy(pengeluaran.created_at)
      .limit(1);

    // Ambil saldo dan hitung sisa_anggaran (sama seperti index.ts)
    let saldoObj = null;
    let sisa_anggaran = null;
    if (pengajuanData.rkakl_detail_id) {
      const saldoArr = await db
        .select()
        .from(vRkaklSaldo)
        .where(eq(vRkaklSaldo.rkakl_id, pengajuanData.rkakl_detail_id));
      saldoObj = saldoArr[0] || null;
      if (saldoObj && saldoObj.saldo != null && pengajuanData.jumlah_pengajuan != null) {
        const saldoVal = Number(saldoObj.saldo);
        const pengajuanVal = Number(pengajuanData.jumlah_pengajuan);
        if (!isNaN(saldoVal) && !isNaN(pengajuanVal)) {
          sisa_anggaran = saldoVal - pengajuanVal;
        }
      }
    }
    return {
      ...pengajuanData,
      pengeluaran: pengeluaranData[0] || null,
      saldo: saldoObj,
      sisa_anggaran,
    };
  }

  if (event.method === 'PUT') {
    const body = await readBody(event);
    const [updated] = await db
      .update(pengajuan)
      .set({
        rkakl_detail_id: Number(body.rkakl_detail_id),
        detil: body.detil,
        tanggal_pengajuan: body.tanggal_pengajuan,
        jumlah_pengajuan: body.jumlah_pengajuan,
        jumlah_data_dukung: Number(body.jumlah_data_dukung),
        status_berkas: Number(body.status_berkas),
        status_pengajuan_id: Number(body.status_pengajuan_id),
        tahun_anggaran_id: Number(body.tahun_anggaran_id),
        satker_id: Number(body.satker_id),
        unit_id: Number(body.unit_id),
        user_id: Number(body.user_id),
        updated_at: new Date(),
      })
      .where(eq(pengajuan.id, id))
      .returning();
    if (!updated) return { error: 'Gagal update data' };
    // Query data lengkap setelah update
    const result = await db
      .select({
        id: pengajuan.id,
        rkakl_detail_id: pengajuan.rkakl_detail_id,
        detil: pengajuan.detil,
        tanggal_pengajuan: pengajuan.tanggal_pengajuan,
        jumlah_pengajuan: pengajuan.jumlah_pengajuan,
        jumlah_data_dukung: pengajuan.jumlah_data_dukung,
        status_berkas: pengajuan.status_berkas,
        status_pengajuan_id: pengajuan.status_pengajuan_id,
        status_pengajuan_nama: statusPengajuan.nama_status,
        tahun_anggaran_id: pengajuan.tahun_anggaran_id,
        satker_id: pengajuan.satker_id,
        unit_id: pengajuan.unit_id,
        user_id: pengajuan.user_id,
        created_at: pengajuan.created_at,
        updated_at: pengajuan.updated_at,
        rkakl_akun_id: rkaklDetail.akun_id,
        rkakl_komponen_id: rkaklDetail.komponen_id,
        rkakl_subkomponen_id: rkaklDetail.sub_komponen_id,
        kode_suboutput: masterSuboutput.kode_suboutput,
        nama_suboutput: masterSuboutput.nama_suboutput,
        kode_komponen: masterKomponen.kode_komponen,
        kode_subkomponen: masterSubkomponen.kode_subkomponen,
        kode_akun: masterAkun.kode_akun,
      })
      .from(pengajuan)
      .leftJoin(rkaklDetail, eq(pengajuan.rkakl_detail_id, rkaklDetail.id))
      .leftJoin(masterSuboutput, eq(rkaklDetail.suboutput_id, masterSuboutput.id))
      .leftJoin(masterKomponen, eq(rkaklDetail.komponen_id, masterKomponen.id))
      .leftJoin(masterSubkomponen, eq(rkaklDetail.sub_komponen_id, masterSubkomponen.id))
      .leftJoin(masterAkun, eq(rkaklDetail.akun_id, masterAkun.id))
      .leftJoin(statusPengajuan, eq(pengajuan.status_pengajuan_id, statusPengajuan.id))
      .leftJoin(pengeluaran, eq(pengajuan.rkakl_detail_id, pengeluaran.id))
      .where(eq(pengajuan.id, id));
    return result[0];
  }

  if (event.method === 'DELETE') {
    const [deleted] = await db.delete(pengajuan).where(eq(pengajuan.id, id)).returning();
    return deleted || { error: 'Gagal hapus data' };
  }

  return { error: 'Method tidak didukung' };
});
