import { pgTable, serial, varchar, integer, timestamp, text } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(), // int4
  nama: varchar('nama'), // varchar
  username: varchar('username'), // varchar
  role_id: integer('role_id'), // int4
  satker_id: integer('satker_id'), // int4
  last_login: timestamp('last_login'), // timestamp
  created_at: timestamp('created_at'), // timestamp
  updated_at: timestamp('updated_at'), // timestamp
  password_hash: text('password_hash'), // text
  nama_pegawai: varchar('nama_pegawai'), // varchar
  nip: varchar('nip'), // varchar
})