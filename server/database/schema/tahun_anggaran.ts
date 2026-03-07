import { pgTable, integer } from 'drizzle-orm/pg-core';

export const tahunAnggaran = pgTable('tahun_anggaran', {
  id: integer('id').primaryKey().notNull(),
  tahun: integer('tahun').notNull(),
});
