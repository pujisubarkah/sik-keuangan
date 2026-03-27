import { pgTable, serial, integer, varchar, text, numeric } from 'drizzle-orm/pg-core'

export const masterSubkomponen = pgTable('master_subkomponen', {
  id: serial('id').primaryKey(),
  komponen_id: integer('komponen_id'),
  kode_subkomponen: varchar('kode_subkomponen', { length: 255 }),
  nama_subkomponen: text('nama_subkomponen'),
  total: numeric('total'),
})
