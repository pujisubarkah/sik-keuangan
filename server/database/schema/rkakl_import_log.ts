import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const rkaklImportLog = pgTable('rkakl_import_log', {
  id: serial('id').primaryKey(),
  fileName: text('file_name').notNull(),
  totalRow: integer('total_row').notNull(),
  successRow: integer('success_row').notNull(),
  failedRow: integer('failed_row').notNull(),
  uploadedBy: integer('uploaded_by').notNull(),
  uploadedAt: timestamp('uploaded_at', { withTimezone: true }).notNull(),
  tahun: integer('tahun').notNull(),
});
