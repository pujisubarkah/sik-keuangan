import { db } from '@/server/database';
import { rkaklDetail } from '@/server/database/schema/rkakl_detail';
import { eq, and } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
	const method = event.method;
	const query = getQuery(event);

	// GET: list/filter
	if (method === 'GET') {
		const where = [];
		if (query.id) where.push(eq(rkaklDetail.id, Number(query.id)));
		if (query.satker_id) where.push(eq(rkaklDetail.satker_id, Number(query.satker_id)));
		if (query.tahun) where.push(eq(rkaklDetail.tahun, Number(query.tahun)));
		if (query.suboutput_id) where.push(eq(rkaklDetail.suboutput_id, Number(query.suboutput_id)));
		// Tambah filter lain sesuai kebutuhan
		const result = await db.select().from(rkaklDetail)
			.where(where.length ? and(...where) : undefined)
			.orderBy(rkaklDetail.id);
		return result;
	}

	// POST: create
	if (method === 'POST') {
		const body = await readBody(event);
		const inserted = await db.insert(rkaklDetail).values(body).returning();
		return inserted[0];
	}

	// PUT: update (by id)
	if (method === 'PUT') {
		const body = await readBody(event);
		if (!body.id) return { error: 'id is required for update' };
		const updated = await db.update(rkaklDetail)
			.set(body)
			.where(eq(rkaklDetail.id, Number(body.id)))
			.returning();
		return updated[0];
	}

	// DELETE: hapus (by id)
	if (method === 'DELETE') {
		const body = await readBody(event);
		if (!body.id) return { error: 'id is required for delete' };
		const deleted = await db.delete(rkaklDetail)
			.where(eq(rkaklDetail.id, Number(body.id)))
			.returning();
		return deleted[0];
	}

	return { error: 'Method not allowed' };
});
