import { db } from '@/server/database';
import { rkaklDetail } from '@/server/database/schema/rkakl_detail';
import { masterSuboutput } from '@/server/database/schema/master_suboutput';
import { masterKomponen } from '@/server/database/schema/master_komponen';
import { masterSubkomponen } from '@/server/database/schema/master_subkomponen';
import { masterAkun } from '@/server/database/schema/master_akun';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  if (!id) return { error: 'suboutput_id is required' };

  // Join ke master tables
  const flat = await db.select({
    id: rkaklDetail.id,
    volume: rkaklDetail.volume,
    satuan: rkaklDetail.satuan,
    harga_satuan: rkaklDetail.harga_satuan,
    jumlah: rkaklDetail.jumlah,
    tahun: rkaklDetail.tahun,
    created_at: rkaklDetail.created_at,
    import_id: rkaklDetail.import_id,
    status: rkaklDetail.status,
    updated_at: rkaklDetail.updated_at,
    satker_id: rkaklDetail.satker_id,
    uraian: rkaklDetail.uraian,
    kode_suboutput: masterSuboutput.kode_suboutput,
    nama_suboutput: masterSuboutput.nama_suboutput,
    kode_komponen: masterKomponen.kode_komponen,
    nama_komponen: masterKomponen.nama_komponen,
    kode_subkomponen: masterSubkomponen.kode_subkomponen,
    nama_subkomponen: masterSubkomponen.nama_subkomponen,
    kode_akun: masterAkun.kode_akun,
    nama_akun: masterAkun.nama_akun
  })
    .from(rkaklDetail)
    .leftJoin(masterSuboutput, eq(rkaklDetail.suboutput_id, masterSuboutput.id))
    .leftJoin(masterKomponen, eq(rkaklDetail.komponen_id, masterKomponen.id))
    .leftJoin(masterSubkomponen, eq(rkaklDetail.sub_komponen_id, masterSubkomponen.id))
    .leftJoin(masterAkun, eq(rkaklDetail.akun_id, masterAkun.id))
    .where(eq(rkaklDetail.suboutput_id, Number(id)))
    .orderBy(rkaklDetail.id);

  // Proses ke bentuk nested/hierarki
  if (!flat || flat.length === 0 || !flat[0]) return [];
  const suboutput = {
    kode_suboutput: flat[0].kode_suboutput,
    nama_suboutput: flat[0].nama_suboutput,
    komponen: [] as any[]
  };

  const komponenMap: { [key: string]: any } = {};
  const subkomponenMap: { [key: string]: any } = {};

  for (const row of flat) {
    // Gunakan string khusus jika id null agar tidak error TypeScript
    const kompKey = row.kode_komponen !== null ? String(row.kode_komponen) : '__null_komponen';
    let komp = komponenMap[kompKey];
    if (!komp) {
      komp = {
        kode_komponen: row.kode_komponen,
        nama_komponen: row.nama_komponen,
        subkomponen: [] as any[]
      };
      komponenMap[kompKey] = komp;
      suboutput.komponen.push(komp);
    }
    // Subkomponen
    const subkompKey = (row.kode_subkomponen !== null ? String(row.kode_subkomponen) : '__null_subkomp') + '-' + kompKey;
    let subkomp = subkomponenMap[subkompKey];
    if (!subkomp) {
      subkomp = {
        kode_subkomponen: row.kode_subkomponen,
        nama_subkomponen: row.nama_subkomponen,
        akun: [] as any[]
      };
      subkomponenMap[subkompKey] = subkomp;
      komp.subkomponen.push(subkomp);
    }
    // Akun: hanya push jika kode_akun atau nama_akun tidak null
    if (row.kode_akun !== null || row.nama_akun !== null) {
      subkomp.akun.push({
        kode_akun: row.kode_akun,
        nama_akun: row.nama_akun,
        volume: row.volume,
        satuan: row.satuan,
        harga_satuan: row.harga_satuan,
        jumlah: row.jumlah,
        tahun: row.tahun,
        created_at: row.created_at,
        import_id: row.import_id,
        status: row.status,
        updated_at: row.updated_at,
        satker_id: row.satker_id,
        uraian: row.uraian
      });
    }
  }

  // Filter subkomponen tanpa akun
  suboutput.komponen.forEach((komp: any) => {
    komp.subkomponen = komp.subkomponen.filter((subkomp: any) => subkomp.akun && subkomp.akun.length > 0);
  });
  // Filter komponen tanpa subkomponen
  suboutput.komponen = suboutput.komponen.filter(komp => komp.subkomponen && komp.subkomponen.length > 0);

  return [suboutput];
});
