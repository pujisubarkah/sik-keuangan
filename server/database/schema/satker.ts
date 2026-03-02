import { pgTable, serial, varchar, integer, timestamp, text } from 'drizzle-orm/pg-core'

export const satker = pgTable('satker', {
  id: serial('id').primaryKey(),
  name: varchar('name'),
})