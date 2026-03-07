import { pgTable, integer, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const masterKegiatan = pgTable('master_kegiatan', {
  id: integer('id').primaryKey().notNull(),
  kode_kegiatan: varchar('kode_kegiatan', { length: 255 }).notNull(),
  nama_kegiatan: text('nama_kegiatan').notNull(),
  program_id: integer('program_id').notNull(),
  created_at: timestamp('created_at', { withTimezone: false }).notNull(),
  updated_at: timestamp('updated_at', { withTimezone: false }).notNull(),
});
