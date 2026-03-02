import { pgTable, serial, varchar, integer, timestamp } from 'drizzle-orm/pg-core';

export const unit = pgTable('unit', {
  id: serial('id').primaryKey(),
  name: varchar('name'),
  satker_id: integer('satker_id'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  kode: varchar('kode'),
  alias: varchar('alias'),
});
