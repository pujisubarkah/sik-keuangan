import { pgTable, serial, integer, bigint, timestamp } from 'drizzle-orm/pg-core';

export const suboutputJadwal = pgTable('suboutput_jadwal', {
  id: serial('id').primaryKey(),
  rkakl_detail_id: integer('rkakl_detail_id').notNull(),
  januari: bigint('januari', { mode: 'number' }),
  februari: bigint('februari', { mode: 'number' }),
  maret: bigint('maret', { mode: 'number' }),
  april: bigint('april', { mode: 'number' }),
  mei: bigint('mei', { mode: 'number' }),
  juni: bigint('juni', { mode: 'number' }),
  juli: bigint('juli', { mode: 'number' }),
  agustus: bigint('agustus', { mode: 'number' }),
  september: bigint('september', { mode: 'number' }),
  oktober: bigint('oktober', { mode: 'number' }),
  november: bigint('november', { mode: 'number' }),
  desember: bigint('desember', { mode: 'number' }),
  created_at: timestamp('created_at'),
  updated_at: timestamp('updated_at'),
});
