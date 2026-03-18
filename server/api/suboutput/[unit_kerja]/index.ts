import { db } from "@/server/database";
import { masterSuboutput } from "@/server/database/schema/master_suboutput";
import { and, eq, sql } from 'drizzle-orm';
import { anggaranSuboutput } from '../../../database/schema/anggaran_suboutput';
import { tahunAnggaran } from '../../../database/schema/tahun_anggaran';
import { satker } from '../../../database/schema/satker';
import { unit } from '../../../database/schema/unit_kerja';

export default defineEventHandler(async (event) => {
    if (event.method === 'POST') {
        const body = await readBody(event);
        if (!body || !body.kode_suboutput || !body.nama_suboutput || !body.output_id) {
            return { error: 'Data tidak lengkap' };
        }
        const [inserted] = await db.insert(masterSuboutput).values({
            kode_suboutput: body.kode_suboutput,
            nama_suboutput: body.nama_suboutput,
            output_id: Number(body.output_id),
            total: body.total ? String(body.total) : '0',
        }).returning();
        return inserted;
    }

    // GET handler: only show suboutput for a specific unit kerja
    const query = getQuery(event);
    if (!query.unit_id) {
        return { error: 'unit_id harus diisi' };
    }
    const unitId = Number(query.unit_id);

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
    };

    // Join with tahun_anggaran to filter by year (optional)
    let targetYearId: number | null = null;
    if (query.tahun) {
        const yearRecord = await db.select({ id: tahunAnggaran.id }).from(tahunAnggaran).where(eq(tahunAnggaran.tahun, Number(query.tahun))).limit(1);
        targetYearId = yearRecord[0]?.id ?? null;
    }

    // Join conditions: only by unit kerja
    const joinConditions = [
        eq(anggaranSuboutput.suboutput_id, masterSuboutput.id),
        eq(anggaranSuboutput.unit_id, unitId)
    ];
    if (targetYearId) {
        joinConditions.push(eq(anggaranSuboutput.tahun_anggaran_id, targetYearId));
    }

    // Query
    const result = await db
        .select(selectColumns)
        .from(masterSuboutput)
        .leftJoin(anggaranSuboutput, and(...joinConditions))
        .leftJoin(satker, eq(anggaranSuboutput.satker_id, satker.id))
        .leftJoin(unit, eq(anggaranSuboutput.unit_id, unit.id))
        .leftJoin(tahunAnggaran, eq(anggaranSuboutput.tahun_anggaran_id, tahunAnggaran.id))
        .orderBy(masterSuboutput.kode_suboutput);

    return {
        success: true,
        data: result
    };
});
