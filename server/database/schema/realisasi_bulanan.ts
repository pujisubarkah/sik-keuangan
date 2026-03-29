// Schema untuk view realisasi_bulanan_pivot
// Hasil dari query pivot realisasi bulanan per rkakl_detail_id

import { pgTable, numeric, integer } from 'drizzle-orm/pg-core';

export const realisasiBulanan = pgTable('realisasi_bulanan', {
  rkakl_detail_id: integer('rkakl_detail_id').notNull(),
  jan: numeric('jan'),
  feb: numeric('feb'),
  mar: numeric('mar'),
  apr: numeric('apr'),
  mei: numeric('mei'),
  jun: numeric('jun'),
  jul: numeric('jul'),
  agt: numeric('agt'),
  sep: numeric('sep'),
  okt: numeric('okt'),
  nov: numeric('nov'),
  des: numeric('des'),
});
