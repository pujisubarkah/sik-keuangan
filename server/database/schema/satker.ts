import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const satker = pgTable('satker', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }),
});
