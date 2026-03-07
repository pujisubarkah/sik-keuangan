import { pgTable, integer, varchar, text } from 'drizzle-orm/pg-core';

export const masterSuboutput = pgTable('master_suboutput', {
  id: integer('id').primaryKey().notNull(),
  kode_suboutput: varchar('kode_suboutput', { length: 255 }).notNull(),
  nama_suboutput: text('nama_suboutput').notNull(),
  output_id: integer('output_id').notNull(),
});
