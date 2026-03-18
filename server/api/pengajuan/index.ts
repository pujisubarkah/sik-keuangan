import { db } from '@/server/database';
import { pengajuan } from '@/server/database/schema/pengajuan';
import { rkaklDetail } from '@/server/database/schema/rkakl_detail';
import { masterSuboutput } from '@/server/database/schema/master_suboutput';
import { masterKomponen } from '@/server/database/schema/master_komponen';
import { masterSubkomponen } from '@/server/database/schema/master_subkomponen';
import { masterAkun } from '@/server/database/schema/master_akun';
import { and, eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  if (event.method === 'POST') {
    const body = await readBody(event);
    // Simple validation
    if (!body || !body.rkakl_detail_id || !body.detil || !body.tanggal_pengajuan || !body.jumlah_pengajuan || !body.jumlah_data_dukung || body.status_berkas === undefined || body.status_verifikator === undefined || !body.tahun_anggaran_id || !body.satker_id || !body.unit_id || !body.user_id) {
      return { error: 'Data tidak lengkap' };
    }
    const [inserted] = await db.insert(pengajuan).values({
      rkakl_detail_id: Number(body.rkakl_detail_id),
      detil: body.detil,
      tanggal_pengajuan: body.tanggal_pengajuan,
      jumlah_pengajuan: body.jumlah_pengajuan,
      jumlah_data_dukung: Number(body.jumlah_data_dukung),
      status_berkas: Number(body.status_berkas),
      status_verifikator: Number(body.status_verifikator),
      tahun_anggaran_id: Number(body.tahun_anggaran_id),
      satker_id: Number(body.satker_id),
      unit_id: Number(body.unit_id),
      user_id: Number(body.user_id),
      created_at: new Date(),
      updated_at: new Date(),
    }).returning();
    return inserted;
  }

  // GET: list/filter pengajuan + join rkakl_detail + master_suboutput/komponen/subkomponen/akun
  const query = getQuery(event);
  const where: any[] = [];
  if (query.unit_id) where.push(eq(pengajuan.unit_id, Number(query.unit_id)));
  if (query.satker_id) where.push(eq(pengajuan.satker_id, Number(query.satker_id)));
  if (query.tahun_anggaran_id) where.push(eq(pengajuan.tahun_anggaran_id, Number(query.tahun_anggaran_id)));
  if (query.user_id) where.push(eq(pengajuan.user_id, Number(query.user_id)));

  const result = await db
    .select({
      id: pengajuan.id,
      rkakl_detail_id: pengajuan.rkakl_detail_id,
      detil: pengajuan.detil,
      tanggal_pengajuan: pengajuan.tanggal_pengajuan,
      jumlah_pengajuan: pengajuan.jumlah_pengajuan,
      jumlah_data_dukung: pengajuan.jumlah_data_dukung,
      status_berkas: pengajuan.status_berkas,
      status_verifikator: pengajuan.status_verifikator,
      tahun_anggaran_id: pengajuan.tahun_anggaran_id,
      satker_id: pengajuan.satker_id,
      unit_id: pengajuan.unit_id,
      user_id: pengajuan.user_id,
      created_at: pengajuan.created_at,
      updated_at: pengajuan.updated_at,
      rkakl_uraian: rkaklDetail.uraian,
      rkakl_status: rkaklDetail.status,
      rkakl_jumlah: rkaklDetail.jumlah,
      rkakl_akun_id: rkaklDetail.akun_id,
      rkakl_komponen_id: rkaklDetail.komponen_id,
      rkakl_subkomponen_id: rkaklDetail.sub_komponen_id,
      kode_suboutput: masterSuboutput.kode_suboutput,
      nama_suboutput: masterSuboutput.nama_suboutput,
      kode_komponen: masterKomponen.kode_komponen,
      kode_subkomponen: masterSubkomponen.kode_subkomponen,
      kode_akun: masterAkun.kode_akun,
      tahun_anggaran: rkaklDetail.tahun,
    })
    .from(pengajuan)
    .leftJoin(rkaklDetail, eq(pengajuan.rkakl_detail_id, rkaklDetail.id))
    .leftJoin(masterSuboutput, eq(rkaklDetail.suboutput_id, masterSuboutput.id))
    .leftJoin(masterKomponen, eq(rkaklDetail.komponen_id, masterKomponen.id))
    .leftJoin(masterSubkomponen, eq(rkaklDetail.sub_komponen_id, masterSubkomponen.id))
    .leftJoin(masterAkun, eq(rkaklDetail.akun_id, masterAkun.id))
    .where(where.length ? and(...where) : undefined)
    .orderBy(pengajuan.id);

  return {
    success: true,
    data: result
  };
});
