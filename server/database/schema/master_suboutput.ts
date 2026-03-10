import { pgTable, integer, varchar, text, serial, numeric } from 'drizzle-orm/pg-core';

export const masterSuboutput = pgTable('master_suboutput', {
   id: serial('id').primaryKey(),
  kode_suboutput: varchar('kode_suboutput', { length: 255 }).notNull(),
  nama_suboutput: text('nama_suboutput').notNull(),
  output_id: integer('output_id').notNull(),
  total: numeric('total'),
});
