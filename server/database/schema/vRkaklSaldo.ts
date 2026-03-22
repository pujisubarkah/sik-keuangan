import { pgTable, integer, numeric, text } from 'drizzle-orm/pg-core';

export const vRkaklSaldo = pgTable('v_rkakl_saldo', {
  rkakl_id: integer('rkakl_id'),
  kode_akun: text('kode_akun'),
  nama_akun: text('nama_akun'),
  pagu: numeric('pagu'),
  realisasi: numeric('realisasi'),
  saldo: numeric('saldo'),
});
