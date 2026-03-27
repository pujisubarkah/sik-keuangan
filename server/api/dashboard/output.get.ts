import { db } from "@/server/database";
import { masterSuboutput } from "@/server/database/schema/master_suboutput";
import { masterOutput } from "@/server/database/schema/master_output";

import { and, eq, sql } from 'drizzle-orm';
import { anggaranSuboutput } from '../../database/schema/anggaran_suboutput';
import { tahunAnggaran } from '../../database/schema/tahun_anggaran';
import { satker } from '../../database/schema/satker';
import { unit } from '../../database/schema/unit_kerja';
import { rkaklDetail } from '../../database/schema/rkakl_detail';
import { pengajuan } from '../../database/schema/pengajuan';

export default defineEventHandler(async (event) => {

    // GET handler (default)
    const query = getQuery(event);

    // We need to fetch data by joining suboutputs with their budget/planning data (anggaran)
    // based on the filters provided (tahun, satker, unit).

    const selectColumns = {
        id: masterSuboutput.id,
        suboutput_id: masterSuboutput.id,
        kode_suboutput: masterSuboutput.kode_suboutput,
        nama_suboutput: masterSuboutput.nama_suboutput,
        output_id: masterSuboutput.output_id,
        total: masterSuboutput.total,
        perencanaan: sql<number>`COALESCE(${anggaranSuboutput.anggaran}, 0)`.mapWith(Number),
        satker_name: satker.name,
        unit_name: unit.name,
        tahun_anggaran: tahunAnggaran.tahun,
        rkakl_total: sql<number>`COALESCE((SELECT SUM(jumlah) FROM rkakl_detail WHERE rkakl_detail.suboutput_id = ${masterSuboutput.id}), 0)`.mapWith(Number),
        kode_output: masterOutput.kode_output,
        nama_output: masterOutput.nama_output,
    };

    // Join with tahun_anggaran to filter by year.
    // We use a subquery to get the id of the requested year to avoid complex joins.
    const targetYear = query.tahun ? Number(query.tahun) : new Date().getFullYear();
    const yearRecord = await db.select({ id: tahunAnggaran.id }).from(tahunAnggaran).where(eq(tahunAnggaran.tahun, targetYear)).limit(1);
    const targetYearId = yearRecord[0]?.id ?? null;

    // Conditions for the LEFT JOIN on anggaranSuboutput.
    // This allows us to fetch planning data for the specific context (year, satker, unit).
    const joinConditions = [
        eq(anggaranSuboutput.suboutput_id, masterSuboutput.id)
    ];
    if (targetYearId) {
        joinConditions.push(eq(anggaranSuboutput.tahun_anggaran_id, targetYearId));
    }
    if (query.satker_id) {
        joinConditions.push(eq(anggaranSuboutput.satker_id, Number(query.satker_id)));
    }
    if (query.unit_id) {
        joinConditions.push(eq(anggaranSuboutput.unit_id, Number(query.unit_id)));
    }

    // Apply WHERE conditions on the main table if any (before leftJoin)
    const whereConditions = [];
    if (query.output_id) {
        whereConditions.push(eq(masterSuboutput.output_id, Number(query.output_id)));
    }

    let dbQueryWithJoin;
    if (whereConditions.length > 0) {
        dbQueryWithJoin = db
            .select(selectColumns)
            .from(masterSuboutput)
            .where(and(...whereConditions))
            .leftJoin(masterOutput, eq(masterSuboutput.output_id, masterOutput.id))
            .leftJoin(anggaranSuboutput, and(...joinConditions))
            .leftJoin(satker, eq(anggaranSuboutput.satker_id, satker.id))
            .leftJoin(unit, eq(anggaranSuboutput.unit_id, unit.id))
            .leftJoin(tahunAnggaran, eq(anggaranSuboutput.tahun_anggaran_id, tahunAnggaran.id));
    } else {
        dbQueryWithJoin = db
            .select(selectColumns)
            .from(masterSuboutput)
            .leftJoin(masterOutput, eq(masterSuboutput.output_id, masterOutput.id))
            .leftJoin(anggaranSuboutput, and(...joinConditions))
            .leftJoin(satker, eq(anggaranSuboutput.satker_id, satker.id))
            .leftJoin(unit, eq(anggaranSuboutput.unit_id, unit.id))
            .leftJoin(tahunAnggaran, eq(anggaranSuboutput.tahun_anggaran_id, tahunAnggaran.id));
    }

        const result = await dbQueryWithJoin.orderBy(masterSuboutput.kode_suboutput);

        // Ambil semua pengajuan untuk mapping per suboutput_id
        const pengajuanRows = await db.select({
            jumlah_pengajuan: pengajuan.jumlah_pengajuan,
            status_pengajuan_id: pengajuan.status_pengajuan_id,
            rkakl_detail_id: pengajuan.rkakl_detail_id
        }).from(pengajuan);

        // Ambil mapping rkakl_detail_id ke suboutput_id
        const rkaklRows = await db.select({
            id: rkaklDetail.id,
            suboutput_id: rkaklDetail.suboutput_id,
            jumlah: rkaklDetail.jumlah
        }).from(rkaklDetail);
        const rkaklMap = new Map();
        for (const row of rkaklRows) {
            if (!rkaklMap.has(row.suboutput_id)) rkaklMap.set(row.suboutput_id, []);
            rkaklMap.get(row.suboutput_id).push(row);
        }

        // Group pengajuan by suboutput_id
        const pengajuanMap = new Map();
        for (const p of pengajuanRows) {
            // Cari suboutput_id dari rkakl_detail
            const rkakl = rkaklRows.find(r => r.id === p.rkakl_detail_id);
            if (!rkakl) continue;
            if (!pengajuanMap.has(rkakl.suboutput_id)) pengajuanMap.set(rkakl.suboutput_id, []);
            pengajuanMap.get(rkakl.suboutput_id).push(p);
        }

        // Group dan agregasi per output
        const outputMap = new Map();
        for (const row of result) {
            const outputId = row.output_id;
            if (!outputMap.has(outputId)) {
                outputMap.set(outputId, {
                    id: outputId,
                    kode_output: row.kode_output,
                    nama_output: row.nama_output,
                    jumlah_suboutput: 0,
                    pagu: 0,
                    treasurerRealization: 0,
                    treasurerAbsorption: 0,
                    treasurerBalance: 0,
                    sp2dRealization: 0,
                    sp2dAbsorption: 0,
                    sp2dBalance: 0
                });
            }
            const group = outputMap.get(outputId);
            group.jumlah_suboutput += 1;
            // Pagu: sum jumlah di rkakl_detail
            const pagu = (rkaklMap.get(row.suboutput_id) || []).reduce((sum: number, r: { jumlah: number | string }) => sum + Number(r.jumlah || 0), 0);
            // Realisasi Bendahara: sum semua jumlah_pengajuan
            const pengajuanList = pengajuanMap.get(row.suboutput_id) || [];
            const treasurerRealization = pengajuanList.reduce((sum: number, p: { jumlah_pengajuan: number | string }) => sum + Number(p.jumlah_pengajuan || 0), 0);
            const treasurerAbsorption = pagu > 0 ? (treasurerRealization / pagu) * 100 : 0;
            const treasurerBalance = pagu - treasurerRealization;
            // Realisasi SP2D: sum jumlah_pengajuan status_pengajuan_id = 2
            const sp2dRealization = pengajuanList.filter((p: { status_pengajuan_id: number }) => p.status_pengajuan_id === 2).reduce((sum: number, p: { jumlah_pengajuan: number | string, status_pengajuan_id: number }) => sum + Number(p.jumlah_pengajuan || 0), 0);
            const sp2dAbsorption = pagu > 0 ? (sp2dRealization / pagu) * 100 : 0;
            const sp2dBalance = pagu - sp2dRealization;
            group.pagu += pagu;
            group.treasurerRealization += treasurerRealization;
            group.treasurerBalance += treasurerBalance;
            group.sp2dRealization += sp2dRealization;
            group.sp2dBalance += sp2dBalance;
            // Persentase diakumulasi, nanti dihitung rata-rata/total
            group.treasurerAbsorption += treasurerAbsorption;
            group.sp2dAbsorption += sp2dAbsorption;
        }
        // Hitung rata-rata persentase
        const outputArr = Array.from(outputMap.values()).map(group => ({
            ...group,
            treasurerAbsorption: group.jumlah_suboutput > 0 ? group.treasurerAbsorption / group.jumlah_suboutput : 0,
            sp2dAbsorption: group.jumlah_suboutput > 0 ? group.sp2dAbsorption / group.jumlah_suboutput : 0
        }));

        return {
            success: true,
            data: outputArr
        };
});
