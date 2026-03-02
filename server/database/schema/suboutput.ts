import { pgTable, serial, varchar, integer, timestamp, numeric } from 'drizzle-orm/pg-core';

export const suboutput = pgTable('sub_output', {
  id: serial('id').primaryKey(),
  kode: varchar('kode'),
  nama: varchar('nama'),
  tahun: integer('tahun'),
  anggaran: numeric('anggaran'),
  satker_id: integer('satker_id'),
  unit_id: integer('unit_id'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});
