import { pgTable, integer, varchar, text, timestamp, serial, numeric } from 'drizzle-orm/pg-core';

export const masterKegiatan = pgTable('master_kegiatan', {
   id: serial('id').primaryKey(),
  kode_kegiatan: varchar('kode_kegiatan', { length: 255 }).notNull(),
  nama_kegiatan: text('nama_kegiatan').notNull(),
  program_id: integer('program_id').notNull(),
  created_at: timestamp('created_at', { withTimezone: false }).notNull(),
  updated_at: timestamp('updated_at', { withTimezone: false }).notNull(),
  total: numeric('total'),
});
