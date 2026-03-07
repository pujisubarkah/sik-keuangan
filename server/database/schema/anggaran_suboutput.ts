import { pgTable, integer, numeric } from 'drizzle-orm/pg-core';

export const anggaranSuboutput = pgTable('anggaran_suboutput', {
  id: integer('id').primaryKey().notNull(),
  suboutput_id: integer('suboutput_id').notNull(),
  satker_id: integer('satker_id').notNull(),
  unit_id: integer('unit_id').notNull(),
  tahun: integer('tahun').notNull(),
  anggaran: numeric('anggaran').notNull(),
});
