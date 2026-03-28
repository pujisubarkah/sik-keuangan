import { db } from "@/server/database";
import { unit } from "@/server/database/schema/unit_kerja";
import { anggaranSuboutput } from "@/server/database/schema/anggaran_suboutput";
import { pengajuan } from "@/server/database/schema/pengajuan";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
	// Ambil query parameter (misalnya jika ingin filter per satker)
	const query = getQuery(event);
	const satkerId = query.satker_id ? Number(query.satker_id) : null;

	// Ambil data unit (dengan filter opsional)
	const unitRows = satkerId 
		? await db.select().from(unit).where(eq(unit.satker_id, satkerId))
		: await db.select().from(unit);

	// Ambil pagu dari anggaran_suboutput
	const anggaranRows = satkerId 
		? await db.select().from(anggaranSuboutput).where(eq(anggaranSuboutput.satker_id, satkerId))
		: await db.select().from(anggaranSuboutput);

	// Ambil realisasi dari pengajuan
	const pengajuanRows = satkerId 
		? await db.select().from(pengajuan).where(eq(pengajuan.satker_id, satkerId))
		: await db.select().from(pengajuan);

	// Group pagu per unit_id
	const paguMap = new Map();
	for (const row of anggaranRows) {
		const uId = row.unit_id;
		if (!paguMap.has(uId)) paguMap.set(uId, 0);
		paguMap.set(uId, paguMap.get(uId) + Number(row.anggaran || 0));
	}

	// Group realisasi per unit_id
	const realisasiMap = new Map();
	for (const p of pengajuanRows) {
		const uId = p.unit_id;
		if (!realisasiMap.has(uId)) realisasiMap.set(uId, 0);
		// Hanya hitung jika status_pengajuan_id adalah 2 (SP2D terbit)
		if (p.status_pengajuan_id === 2) {
			realisasiMap.set(uId, realisasiMap.get(uId) + Number(p.jumlah_pengajuan || 0));
		}
	}

	// Agregasi per unit_kerja
	const unitArr = unitRows.map(u => {
		const uId = u.id;
		const pagu = paguMap.get(uId) || 0;
		const sp2dRealization = realisasiMap.get(uId) || 0;
		const percentageRaw = pagu > 0 ? (sp2dRealization / pagu) * 100 : 0;
		const percentage = Number(percentageRaw.toFixed(2));
		return {
			id: uId,
			nama_unit: u.name,
			kode: u.kode,
			pagu,
			sp2dRealization,
			percentage
		};
	});

	return {
		success: true,
		data: unitArr
	};
});
