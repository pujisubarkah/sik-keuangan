import { pgTable, serial, integer, varchar, text, numeric } from 'drizzle-orm/pg-core'

export const masterKomponen = pgTable('master_komponen', {
  id: serial('id').primaryKey(),
  suboutput_id: integer('suboutput_id').notNull(),
  kode_komponen: varchar('kode_komponen', { length: 255 }).notNull(),
  nama_komponen: text('nama_komponen').notNull(),
  total: numeric('total'),
})
