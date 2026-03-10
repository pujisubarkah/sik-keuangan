import { pgTable, serial, integer, numeric } from 'drizzle-orm/pg-core';

export const anggaranSuboutput = pgTable('anggaran_suboutput', {
  id: serial('id').primaryKey(),
  suboutput_id: integer('suboutput_id').notNull(),
  satker_id: integer('satker_id').notNull(),
  unit_id: integer('unit_id').notNull(),
  tahun_anggaran_id: integer('tahun_anggaran_id').notNull(),
  anggaran: numeric('anggaran').notNull(),
});
