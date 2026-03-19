import { pgTable, serial, integer, text, date, numeric, smallint, timestamp } from 'drizzle-orm/pg-core';

export const pengajuan = pgTable('pengajuan', {
  id: serial('id').primaryKey().notNull(), // auto-increment
  rkakl_detail_id: integer('rkakl_detail_id').notNull(),
  detil: text('detil').notNull(),
  tanggal_pengajuan: date('tanggal_pengajuan').notNull(),
  jumlah_pengajuan: numeric('jumlah_pengajuan').notNull(),
  jumlah_data_dukung: integer('jumlah_data_dukung').notNull(),
  status_berkas: smallint('status_berkas').notNull(),
  status_pengajuan_id: smallint('status_pengajuan_id').notNull(),
  tahun_anggaran_id: integer('tahun_anggaran_id').notNull(),
  satker_id: integer('satker_id').notNull(),
  unit_id: integer('unit_id').notNull(),
  user_id: integer('user_id').notNull(),
  created_at: timestamp('created_at', { withTimezone: false }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: false }).notNull().defaultNow(),
});
