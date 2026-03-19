import { pgTable, smallint, varchar } from 'drizzle-orm/pg-core';

export const statusPengajuan = pgTable('status_pengajuan', {
  id: smallint('id').primaryKey().notNull(),
  nama_status: varchar('nama_status', { length: 100 }).notNull(),
});
