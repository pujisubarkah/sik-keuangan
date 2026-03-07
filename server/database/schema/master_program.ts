import { pgTable, integer, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const masterProgram = pgTable('master_program', {
  id: integer('id').primaryKey().notNull(),
  kode_program: varchar('kode_program', { length: 255 }).notNull(),
  nama_program: text('nama_program').notNull(),
  created_at: timestamp('created_at', { withTimezone: false }).notNull(),
  updated_at: timestamp('updated_at', { withTimezone: false }).notNull(),
});
