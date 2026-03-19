import { pgTable, serial, integer, numeric, date, boolean, text, smallint, timestamp } from 'drizzle-orm/pg-core';


export const pengeluaran = pgTable('pengeluaran', {
  id: serial('id').primaryKey().notNull(), // auto-increment
  pengajuan_id: integer('pengajuan_id').notNull(),
  jumlah_pengeluaran: numeric('jumlah_pengeluaran').notNull(),
  tanggal_cair: date('tanggal_cair').notNull(),
  tanggal_sp2d: date('tanggal_sp2d').notNull(),
  status_sp2d: boolean('status_sp2d').notNull(),
  status_pj: boolean('status_pj').notNull(),
  tanggal_pj: date('tanggal_pj').notNull(),
  keterangan: text('keterangan').notNull(),
  created_at: timestamp('created_at', { withTimezone: false }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: false }).notNull().defaultNow(),
});
