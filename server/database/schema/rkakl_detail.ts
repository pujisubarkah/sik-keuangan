import { pgTable, serial, integer, numeric, varchar, timestamp } from 'drizzle-orm/pg-core';

export const rkaklDetail = pgTable('rkakl_detail', {
  id: serial('id').primaryKey(),
  sub_komponen_id: integer('sub_komponen_id'),
  akun_id: integer('akun_id'),
  volume: numeric('volume'),
  satuan: varchar('satuan'),
  harga_satuan: numeric('harga_satuan'),
  jumlah: numeric('jumlah'),
  tahun: integer('tahun'),
  created_at: timestamp('created_at'),
  program_id: integer('program_id'),
  kegiatan_id: integer('kegiatan_id'),
  output_id: integer('output_id'),
  suboutput_id: integer('suboutput_id'),
  komponen_id: integer('komponen_id'),
  import_id: integer('import_id'),
  status: varchar('status'),
  updated_at: timestamp('updated_at'),
  satker_id: integer('satker_id'),
});
