import { db } from "@/server/database";
import { masterProgram } from "@/server/database/schema/master_program";
import { masterKegiatan } from "@/server/database/schema/master_kegiatan";
import { masterOutput } from "@/server/database/schema/master_output";
import { masterSuboutput } from "@/server/database/schema/master_suboutput";
import { rkaklDetail } from "@/server/database/schema/rkakl_detail";
import { pengajuan } from "@/server/database/schema/pengajuan";

export default defineEventHandler(async (event) => {
	// GET handler (default)
	// Ambil semua program
	const programRows = await db.select().from(masterProgram);
	// Ambil semua kegiatan, output, suboutput
	const kegiatanRows = await db.select().from(masterKegiatan);
	const outputRows = await db.select().from(masterOutput);
	const suboutputRows = await db.select().from(masterSuboutput);
	// Group by parent
	const kegiatanMap = new Map();
	for (const k of kegiatanRows) {
		if (!kegiatanMap.has(k.program_id)) kegiatanMap.set(k.program_id, []);
		kegiatanMap.get(k.program_id).push(k);
	}
	const outputMap = new Map();
	for (const o of outputRows) {
		if (!outputMap.has(o.kegiatan_id)) outputMap.set(o.kegiatan_id, []);
		outputMap.get(o.kegiatan_id).push(o);
	}
	const suboutputMap = new Map();
	for (const s of suboutputRows) {
		if (!suboutputMap.has(s.output_id)) suboutputMap.set(s.output_id, []);
		suboutputMap.get(s.output_id).push(s);
	}
	// Ambil semua rkakl_detail dan pengajuan
	const rkaklRows = await db.select().from(rkaklDetail);
	const pengajuanRows = await db.select().from(pengajuan);
	// Group rkakl_detail by suboutput_id
	const rkaklMap = new Map();
	for (const row of rkaklRows) {
		if (!rkaklMap.has(row.suboutput_id)) rkaklMap.set(row.suboutput_id, []);
		rkaklMap.get(row.suboutput_id).push(row);
	}
	// Group pengajuan by suboutput_id (via rkakl_detail)
	const pengajuanMap = new Map();
	for (const p of pengajuanRows) {
		const rkakl = rkaklRows.find(r => r.id === p.rkakl_detail_id);
		if (!rkakl) continue;
		if (!pengajuanMap.has(rkakl.suboutput_id)) pengajuanMap.set(rkakl.suboutput_id, []);
		pengajuanMap.get(rkakl.suboutput_id).push(p);
	}
	// Agregasi per program
	const programArr = programRows.map(prog => {
		// Kegiatan di bawah program ini
		const kegiatans = kegiatanMap.get(prog.id) || [];
		// Output di bawah semua kegiatan
		let outputs: any[] = [];
		for (const k of kegiatans) {
			outputs = outputs.concat(outputMap.get(k.id) || []);
		}
		// Suboutput di bawah semua output
		let suboutputs: any[] = [];
		for (const o of outputs) {
			suboutputs = suboutputs.concat(suboutputMap.get(o.id) || []);
		}
		// Jumlah kegiatan, output, suboutput
		const jumlah_kegiatan = kegiatans.length;
		const jumlah_output = outputs.length;
		const jumlah_suboutput = suboutputs.length;
		// Pagu: sum jumlah di rkakl_detail semua suboutput
		let pagu = 0;
		let treasurerRealization = 0;
		let treasurerAbsorption = 0;
		let treasurerBalance = 0;
		let sp2dRealization = 0;
		let sp2dAbsorption = 0;
		let sp2dBalance = 0;
		for (const sub of suboutputs) {
			const rkaklList = rkaklMap.get(sub.id) || [];
			const paguSub = rkaklList.reduce((sum: number, r: any) => sum + Number(r.jumlah || 0), 0);
			pagu += paguSub;
			// Realisasi Bendahara: sum semua jumlah_pengajuan
			const pengajuanList = pengajuanMap.get(sub.id) || [];
			const treasurerRealizationSub = pengajuanList.reduce((sum: number, p: any) => sum + Number(p.jumlah_pengajuan || 0), 0);
			const treasurerAbsorptionSub = paguSub > 0 ? (treasurerRealizationSub / paguSub) * 100 : 0;
			const treasurerBalanceSub = paguSub - treasurerRealizationSub;
			// Realisasi SP2D: sum jumlah_pengajuan status_pengajuan_id = 2
			const sp2dRealizationSub = pengajuanList.filter((p: any) => p.status_pengajuan_id === 2).reduce((sum: number, p: any) => sum + Number(p.jumlah_pengajuan || 0), 0);
			const sp2dAbsorptionSub = paguSub > 0 ? (sp2dRealizationSub / paguSub) * 100 : 0;
			const sp2dBalanceSub = paguSub - sp2dRealizationSub;
			treasurerRealization += treasurerRealizationSub;
			treasurerAbsorption += treasurerAbsorptionSub;
			treasurerBalance += treasurerBalanceSub;
			sp2dRealization += sp2dRealizationSub;
			sp2dAbsorption += sp2dAbsorptionSub;
			sp2dBalance += sp2dBalanceSub;
		}
		// Rata-rata persentase
		const divisor = suboutputs.length || 1;
		return {
			id: prog.id,
			kode_program: prog.kode_program,
			nama_program: prog.nama_program,
			jumlah_kegiatan,
			jumlah_output,
			jumlah_suboutput,
			pagu,
			treasurerRealization,
			treasurerAbsorption: treasurerAbsorption / divisor,
			treasurerBalance,
			sp2dRealization,
			sp2dAbsorption: sp2dAbsorption / divisor,
			sp2dBalance
		};
	});
	return {
		success: true,
		data: programArr
	};
});
