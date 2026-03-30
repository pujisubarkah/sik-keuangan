import { defineEventHandler } from 'h3';
import { db } from '../../database';
import { realisasiBulanan } from '../../database/schema/realisasi_bulanan';
import { anggaranSuboutput } from '../../database/schema/anggaran_suboutput';

export default defineEventHandler(async () => {
	// Ambil semua data realisasi_bulanan
	const rows = await db
		.select({
			jan: realisasiBulanan.jan,
			feb: realisasiBulanan.feb,
			mar: realisasiBulanan.mar,
			apr: realisasiBulanan.apr,
			mei: realisasiBulanan.mei,
			jun: realisasiBulanan.jun,
			jul: realisasiBulanan.jul,
			agt: realisasiBulanan.agt,
			sep: realisasiBulanan.sep,
			okt: realisasiBulanan.okt,
			nov: realisasiBulanan.nov,
			des: realisasiBulanan.des,
		})
		.from(realisasiBulanan);

	// Ambil total anggaran seluruh suboutput
	const anggaranRows = await db
		.select({ anggaran: anggaranSuboutput.anggaran })
		.from(anggaranSuboutput);
	const totalAnggaran = anggaranRows.reduce((sum, row) => sum + parseFloat(String(row.anggaran ?? 0)), 0);

	// Agregasi total per bulan seluruh data
	const total = rows.reduce((acc, row: Record<string, string | null>) => {
		for (const bulan of ['jan','feb','mar','apr','mei','jun','jul','agt','sep','okt','nov','des']) {
			acc[bulan] = (parseFloat(String(acc[bulan] ?? 0)) + parseFloat(String(row[bulan] ?? 0))).toString();
		}
		return acc;
	}, {} as Record<string, string>);

	// Hitung persentase per bulan
	const persentase: Record<string, string> = {};
	for (const bulan of ['jan','feb','mar','apr','mei','jun','jul','agt','sep','okt','nov','des']) {
		const nilai = parseFloat(total[bulan] ?? '0');
		persentase[bulan] = totalAnggaran > 0 ? ((nilai / totalAnggaran) * 100).toFixed(2) : '0';
	}

	return persentase;
});
