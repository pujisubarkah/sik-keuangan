import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core'

export const informasi = pgTable('informasi', {
  id: serial('id').primaryKey(),
  judul: varchar('judul', { length: 255 }).notNull(),
  deskripsi: text('deskripsi'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})
