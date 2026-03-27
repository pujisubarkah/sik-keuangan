
import { db } from "@/server/database";
import { satker } from "@/server/database/schema/satker";
import { rkaklDetail } from "@/server/database/schema/rkakl_detail";
import { pengajuan } from "@/server/database/schema/pengajuan";

export default defineEventHandler(async (event) => {
	// GET handler (default)
	// Ambil semua satker
	const satkerRows = await db.select().from(satker);
	// Ambil semua rkakl_detail dan pengajuan
	const rkaklRows = await db.select().from(rkaklDetail);
	const pengajuanRows = await db.select().from(pengajuan);

	// Group rkakl_detail by satker_id
	const rkaklMap = new Map();
	for (const row of rkaklRows) {
		if (!rkaklMap.has(row.satker_id)) rkaklMap.set(row.satker_id, []);
		rkaklMap.get(row.satker_id).push(row);
	}

	// Group pengajuan by satker_id (via rkakl_detail)
	const pengajuanMap = new Map();
	for (const p of pengajuanRows) {
		const rkakl = rkaklRows.find(r => r.id === p.rkakl_detail_id);
		if (!rkakl) continue;
		if (!pengajuanMap.has(rkakl.satker_id)) pengajuanMap.set(rkakl.satker_id, []);
		pengajuanMap.get(rkakl.satker_id).push(p);
	}

	// Agregasi per satker
	const satkerArr = satkerRows.map(s => {
		const rkaklList = rkaklMap.get(s.id) || [];
		const pagu = rkaklList.reduce((sum: number, r: any) => sum + Number(r.jumlah || 0), 0);
		const pengajuanList = pengajuanMap.get(s.id) || [];
		const sp2dRealization = pengajuanList.filter((p: any) => p.status_pengajuan_id === 2).reduce((sum: number, p: any) => sum + Number(p.jumlah_pengajuan || 0), 0);
		const percentageRaw = pagu > 0 ? (sp2dRealization / pagu) * 100 : 0;
		const percentage = Number(percentageRaw.toFixed(2));
		return {
			id: s.id,
			nama_satker: s.name,
			percentage
		};
	});

	return {
		success: true,
		data: satkerArr
	};
});
