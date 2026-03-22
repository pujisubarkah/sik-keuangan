import { db } from '@/server/database';
import { masterSuboutput } from '@/server/database/schema/master_suboutput';
import { masterKomponen } from '@/server/database/schema/master_komponen';
import { masterSubkomponen } from '@/server/database/schema/master_subkomponen';
import { masterAkun } from '@/server/database/schema/master_akun';
import { rkaklDetail } from '@/server/database/schema/rkakl_detail';
import { eq, and } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  // Optional: filter by parent ids
  const suboutputId = query.suboutput_id ? Number(query.suboutput_id) : undefined;
  const komponenId = query.komponen_id ? Number(query.komponen_id) : undefined;
  const subkomponenId = query.subkomponen_id ? Number(query.subkomponen_id) : undefined;
  const akunId = query.akun_id ? Number(query.akun_id) : undefined;

  // Ambil semua data flat
    const suboutputs = await db.select({
      id: masterSuboutput.id,
      kode_suboutput: masterSuboutput.kode_suboutput,
    }).from(masterSuboutput);
    const komponen = await db.select({
      id: masterKomponen.id,
      suboutput_id: masterKomponen.suboutput_id,
      kode_komponen: masterKomponen.kode_komponen,
    }).from(masterKomponen);
    const subkomponen = await db.select({
      id: masterSubkomponen.id,
      komponen_id: masterSubkomponen.komponen_id,
      kode_subkomponen: masterSubkomponen.kode_subkomponen,
    }).from(masterSubkomponen);
    const akun = await db.select({
      id: masterAkun.id,
      subkomponen_id: masterAkun.subkomponen_id,
      kode_akun: masterAkun.kode_akun,
    }).from(masterAkun);
  const rkakl = await db.select({
    id: rkaklDetail.id,
    uraian: rkaklDetail.uraian,
    akun_id: rkaklDetail.akun_id,
    sub_komponen_id: rkaklDetail.sub_komponen_id,
    komponen_id: rkaklDetail.komponen_id,
    suboutput_id: rkaklDetail.suboutput_id,
  }).from(rkaklDetail);

  // Nesting
  // 1. Uraian ke akun
  const akunMap: { [key: number]: any } = {};
  akun.forEach(a => akunMap[a.id] = { ...a, uraian: [] });
  rkakl.forEach(r => {
    const akunId = Number(r.akun_id);
    if (!isNaN(akunId) && akunMap[akunId]) {
      akunMap[akunId].uraian.push({ id: r.id, uraian: r.uraian });
    }
  });
  // 2. Akun ke subkomponen
  const subkomponenMap: { [key: number]: any } = {};
  subkomponen.forEach(s => subkomponenMap[s.id] = { ...s, akun: [] });
  Object.values(akunMap).forEach((a: any) => {
    if (a.subkomponen_id != null && subkomponenMap[a.subkomponen_id]) {
      subkomponenMap[a.subkomponen_id].akun.push(a);
    }
  });
  // 3. Subkomponen ke komponen
  const komponenMap: { [key: number]: any } = {};
  komponen.forEach(k => komponenMap[k.id] = { ...k, subkomponen: [] });
  Object.values(subkomponenMap).forEach((s: any) => {
    if (s.komponen_id != null && komponenMap[s.komponen_id]) {
      komponenMap[s.komponen_id].subkomponen.push(s);
    }
  });
  // 4. Komponen ke suboutput
  const suboutputMap: { [key: number]: any } = {};
  suboutputs.forEach(s => suboutputMap[s.id] = { ...s, komponen: [] });
  Object.values(komponenMap).forEach((k: any) => {
    if (k.suboutput_id != null && suboutputMap[k.suboutput_id]) {
      suboutputMap[k.suboutput_id].komponen.push(k);
    }
  });

  // Hasil akhir: array suboutput nested
  const nested = Object.values(suboutputMap);

  return {
    suboutputs: nested,
  };
});
