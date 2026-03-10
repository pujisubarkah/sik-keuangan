import { pgTable, serial, varchar, text, integer, numeric } from 'drizzle-orm/pg-core'

export const masterAkun = pgTable('master_akun', {
  id: serial('id').primaryKey(),
  kode_akun: varchar('kode_akun', { length: 255 }).notNull(),
  nama_akun: text('nama_akun').notNull(),
  subkomponen_id: integer('subkomponen_id').notNull(),
  total: numeric('total'),
})
