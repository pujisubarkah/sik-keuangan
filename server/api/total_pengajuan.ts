import { db } from '@/server/database';
import { pengajuan } from '@/server/database/schema/pengajuan';
import { rkaklDetail } from '@/server/database/schema/rkakl_detail';
import { masterSuboutput } from '@/server/database/schema/master_suboutput';
import { masterKomponen } from '@/server/database/schema/master_komponen';
import { masterSubkomponen } from '@/server/database/schema/master_subkomponen';
import { masterAkun } from '@/server/database/schema/master_akun';
import { and, eq, inArray, ne, isNull, or } from 'drizzle-orm';
import { statusPengajuan } from '@/server/database/schema/status_pengajuan';
import { pengeluaran } from '@/server/database/schema/pengeluaran';
import { sql } from 'drizzle-orm';
import { vRkaklSaldo } from '@/server/database/schema/vRkaklSaldo';

export default defineEventHandler(async (event) => {
  try {
    // 1. Total Budget dari rkaklDetail
    const rkakl = await db.select({ totalBudget: sql`COALESCE(SUM(${rkaklDetail.jumlah}),0)` }).from(rkaklDetail);
    const totalBudget = Number(rkakl[0]?.totalBudget || 0);

    // 2. Submission Count & Amount dari pengajuan
    const pengajuanRows = await db.select({ jumlah_pengajuan: pengajuan.jumlah_pengajuan, status_pengajuan_id: pengajuan.status_pengajuan_id }).from(pengajuan);
    // submissionCount: hanya status_pengajuan_id !== 2
    const submissionCount = pengajuanRows.filter(row => row.status_pengajuan_id !== 2).length;
    // submissionAmount: semua jumlah_pengajuan
    const submissionAmount = pengajuanRows.reduce((sum, row) => sum + Number(row.jumlah_pengajuan || 0), 0);

    // sp2dRealization: jumlah_pengajuan dengan status_pengajuan_id = 2
    const sp2dRealization = pengajuanRows.filter(row => row.status_pengajuan_id === 2).reduce((sum, row) => sum + Number(row.jumlah_pengajuan || 0), 0);

    // sp2dBalance: totalBudget - sp2dRealization
    const sp2dBalance = totalBudget - sp2dRealization;

    // sp2dAbsorption: persentase sp2dRealization / totalBudget
    const sp2dAbsorption = totalBudget > 0 ? (sp2dRealization / totalBudget) * 100 : 0;

    // treasurerRealization: semua jumlah_pengajuan
    const treasurerRealization = submissionAmount;
    // treasurerBalance: totalBudget - treasurerRealization
    const treasurerBalance = totalBudget - treasurerRealization;
    // treasurerAbsorption: persentase treasurerRealization / totalBudget
    const treasurerAbsorption = totalBudget > 0 ? (treasurerRealization / totalBudget) * 100 : 0;

    return {
      success: true,
      totalBudget,
      submissionCount,
      submissionAmount,
      sp2dRealization,
      sp2dBalance,
      sp2dAbsorption,
      treasurerRealization,
      treasurerBalance,
      treasurerAbsorption
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Gagal mengambil data total pengajuan",
    };
  }
});
