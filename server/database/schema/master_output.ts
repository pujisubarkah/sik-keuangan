import { pgTable, integer, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const masterOutput = pgTable('master_output', {
  id: integer('id').primaryKey().notNull(),
  kode_output: varchar('kode_output', { length: 255 }).notNull(),
  nama_output: text('nama_output').notNull(),
  kegiatan_id: integer('kegiatan_id').notNull(),
  created_at: timestamp('created_at', { withTimezone: false }).notNull(),
  updated_at: timestamp('updated_at', { withTimezone: false }).notNull(),
});
