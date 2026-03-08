import { eq, sql } from 'drizzle-orm'
import { anggaranSuboutput } from '../../database/schema/anggaran_suboutput'
import { masterSuboutput } from '../../database/schema/master_suboutput'
import { masterOutput } from '../../database/schema/master_output'
import { masterKegiatan } from '../../database/schema/master_kegiatan'
import { masterProgram } from '../../database/schema/master_program'
import { satker } from '../../database/schema/satker'
import { tahunAnggaran } from '../../database/schema/tahun_anggaran'
import { unit } from '../../database/schema/unit_kerja'
import { db } from '../../database'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) return { error: 'suboutput id is required' }

  if (event.method === 'PUT') {
    const body = await readBody(event)
    // Contoh: update anggaran
    const updateData: Record<string, any> = {}
    if (body.anggaran !== undefined) updateData.anggaran = body.anggaran
    // Tambahkan field lain sesuai kebutuhan
    if (Object.keys(updateData).length === 0) {
      return { error: 'No valid fields to update' }
    }
    const updated = await db.update(anggaranSuboutput)
      .set(updateData)
      .where(eq(anggaranSuboutput.suboutput_id, Number(id)))
      .returning()
    return { success: true, data: updated }
  }

  // Ambil satu data anggaran_suboutput pertama yang cocok
  const result = await db
    .select({
      anggaranSuboutput,
      kode: sql`CONCAT(master_kegiatan.kode_kegiatan, '.', master_output.kode_output, '.', master_suboutput.kode_suboutput)`,
      nama_suboutput: masterSuboutput.nama_suboutput,
      nama_satker: satker.name,
      nama_unit: unit.name,
      tahun: tahunAnggaran.tahun,
      nama_output: masterOutput.nama_output,
      nama_kegiatan: masterKegiatan.nama_kegiatan,
      nama_program: masterProgram.nama_program
    })
    .from(anggaranSuboutput)
    .innerJoin(masterSuboutput, eq(anggaranSuboutput.suboutput_id, masterSuboutput.id))
    .innerJoin(masterOutput, eq(masterSuboutput.output_id, masterOutput.id))
    .innerJoin(masterKegiatan, eq(masterOutput.kegiatan_id, masterKegiatan.id))
    .innerJoin(masterProgram, eq(masterKegiatan.program_id, masterProgram.id))
    .innerJoin(satker, eq(anggaranSuboutput.satker_id, satker.id))
    .leftJoin(unit, eq(anggaranSuboutput.unit_id, unit.id))
    .innerJoin(tahunAnggaran, eq(anggaranSuboutput.tahun_anggaran_id, tahunAnggaran.id))
    .where(eq(anggaranSuboutput.suboutput_id, Number(id)))
    .orderBy(anggaranSuboutput.id)

  return result[0] || null
})
