import { db } from "@/server/database";
import { masterSuboutput } from "@/server/database/schema/master_suboutput";
import { masterOutput } from "@/server/database/schema/master_output";

import { and, eq, sql } from 'drizzle-orm';
import { anggaranSuboutput } from '../../../../database/schema/anggaran_suboutput';
import { tahunAnggaran } from '../../../../database/schema/tahun_anggaran';
import { satker } from '../../../../database/schema/satker';
import { unit } from '../../../../database/schema/unit_kerja';
import { rkaklDetail } from '../../../../database/schema/rkakl_detail';
import { pengajuan } from '../../../../database/schema/pengajuan';

export default defineEventHandler(async (event) => {
    const params = event.context.params as { id?: string } | undefined;
    const satkerId = params?.id ? Number(params.id) : null;
    const query = getQuery(event);

    if (!satkerId) {
        throw createError({ statusCode: 400, statusMessage: "Parameter satker_id diperlukan di path" });
    }

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
        kode_output: masterOutput.kode_output,
        nama_output: masterOutput.nama_output,
    };

    const targetYear = query.tahun ? Number(query.tahun) : new Date().getFullYear();
    const yearRecord = await db.select({ id: tahunAnggaran.id }).from(tahunAnggaran).where(eq(tahunAnggaran.tahun, targetYear)).limit(1);
    const targetYearId = yearRecord[0]?.id ?? null;

    const joinConditions = [
        eq(anggaranSuboutput.suboutput_id, masterSuboutput.id),
        eq(anggaranSuboutput.satker_id, satkerId)
    ];
    if (targetYearId) {
        joinConditions.push(eq(anggaranSuboutput.tahun_anggaran_id, targetYearId));
    }
    if (query.unit_id) {
        joinConditions.push(eq(anggaranSuboutput.unit_id, Number(query.unit_id)));
    }

    const whereConditions = [];
    if (query.output_id) {
        whereConditions.push(eq(masterSuboutput.output_id, Number(query.output_id)));
    }

    let dbQueryWithJoin = db.select(selectColumns).from(masterSuboutput);
    if (whereConditions.length > 0) {
        dbQueryWithJoin = dbQueryWithJoin.where(and(...whereConditions)) as any;
    }
    dbQueryWithJoin = dbQueryWithJoin
        .leftJoin(masterOutput, eq(masterSuboutput.output_id, masterOutput.id))
        .leftJoin(anggaranSuboutput, and(...joinConditions))
        .leftJoin(satker, eq(anggaranSuboutput.satker_id, satker.id))
        .leftJoin(unit, eq(anggaranSuboutput.unit_id, unit.id))
        .leftJoin(tahunAnggaran, eq(anggaranSuboutput.tahun_anggaran_id, tahunAnggaran.id)) as any;

    const result = await dbQueryWithJoin.orderBy(masterSuboutput.kode_suboutput);

    // Ambil pengajuan difilter by satker_id
    const pengajuanRows = await db.select({
        jumlah_pengajuan: pengajuan.jumlah_pengajuan,
        status_pengajuan_id: pengajuan.status_pengajuan_id,
        rkakl_detail_id: pengajuan.rkakl_detail_id
    }).from(pengajuan).where(eq(pengajuan.satker_id, satkerId));

    // Ambil rkakl_detail difilter by satker_id
    const rkaklRows = await db.select({
        id: rkaklDetail.id,
        suboutput_id: rkaklDetail.suboutput_id,
        jumlah: rkaklDetail.jumlah
    }).from(rkaklDetail).where(eq(rkaklDetail.satker_id, satkerId));

    const rkaklMap = new Map();
    for (const row of rkaklRows) {
        if (!rkaklMap.has(row.suboutput_id)) rkaklMap.set(row.suboutput_id, []);
        rkaklMap.get(row.suboutput_id).push(row);
    }

    const pengajuanMap = new Map();
    for (const p of pengajuanRows) {
        const rkakl = rkaklRows.find(r => r.id === p.rkakl_detail_id);
        if (!rkakl) continue;
        if (!pengajuanMap.has(rkakl.suboutput_id)) pengajuanMap.set(rkakl.suboutput_id, []);
        pengajuanMap.get(rkakl.suboutput_id).push(p);
    }

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
        
        const pagu = (rkaklMap.get(row.suboutput_id) || []).reduce((sum: number, r: any) => sum + Number(r.jumlah || 0), 0);
        
        const pengajuanList = pengajuanMap.get(row.suboutput_id) || [];
        const treasurerRealization = pengajuanList.reduce((sum: number, p: any) => sum + Number(p.jumlah_pengajuan || 0), 0);
        const treasurerAbsorption = pagu > 0 ? (treasurerRealization / pagu) * 100 : 0;
        const treasurerBalance = pagu - treasurerRealization;
        
        const sp2dRealization = pengajuanList.filter((p: any) => p.status_pengajuan_id === 2).reduce((sum: number, p: any) => sum + Number(p.jumlah_pengajuan || 0), 0);
        const sp2dAbsorption = pagu > 0 ? (sp2dRealization / pagu) * 100 : 0;
        const sp2dBalance = pagu - sp2dRealization;
        
        group.pagu += pagu;
        group.treasurerRealization += treasurerRealization;
        group.treasurerBalance += treasurerBalance;
        group.sp2dRealization += sp2dRealization;
        group.sp2dBalance += sp2dBalance;
        group.treasurerAbsorption += treasurerAbsorption;
        group.sp2dAbsorption += sp2dAbsorption;
    }

    // Filter outputArr yang pagunya > 0 agar relevan untuk satker ini
    const outputArr = Array.from(outputMap.values())
        .map(group => ({
            ...group,
            treasurerAbsorption: group.jumlah_suboutput > 0 ? group.treasurerAbsorption / group.jumlah_suboutput : 0,
            sp2dAbsorption: group.jumlah_suboutput > 0 ? group.sp2dAbsorption / group.jumlah_suboutput : 0
        }))
        .filter(out => out.pagu > 0);

    return {
        success: true,
        data: outputArr
    };
});
