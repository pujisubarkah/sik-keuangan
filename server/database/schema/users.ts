import { pgTable, serial, varchar, integer, timestamp, text } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  nama: varchar('nama'),
  username: varchar('username'),
  role_id: integer('role_id'),
  satker_id: integer('satker_id'),
  last_login: timestamp('last_login'),
  created_at: timestamp('created_at'),
  updated_at: timestamp('updated_at'),
  password_hash: text('password_hash'),
})