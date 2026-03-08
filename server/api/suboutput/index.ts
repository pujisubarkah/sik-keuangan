import { db } from '@/server/database'
import { masterSuboutput } from '@/server/database/schema/master_suboutput'
import { masterOutput } from '@/server/database/schema/master_output'
import { masterKegiatan } from '@/server/database/schema/master_kegiatan'
import { masterProgram } from '@/server/database/schema/master_program'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  if (event.req.method === 'POST') {
    const body = await readBody(event)
    if (!body.id || !body.kode_suboutput || !body.nama_suboutput || !body.output_id) {
      return { error: 'id, kode_suboutput, nama_suboutput, dan output_id wajib diisi' }
    }
    try {
      const inserted = await db.insert(masterSuboutput).values({
        id: Number(body.id),
        kode_suboutput: body.kode_suboutput,
        nama_suboutput: body.nama_suboutput,
        output_id: Number(body.output_id)
      }).returning()
      return inserted[0]
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e))
      return { error: 'Database error', detail: err.message }
    }
  } else {
    try {
      const id = event.context.params?.id
      let suboutputs
      if (id) {
        suboutputs = await db.select().from(masterSuboutput).where(eq(masterSuboutput.id, Number(id)))
      } else {
        suboutputs = await db.select().from(masterSuboutput)
      }
      const results = []
      for (const sub of suboutputs) {
        const output = await db.select().from(masterOutput).where(eq(masterOutput.id, sub.output_id)).then(r => r[0])
        let kegiatan = null, program = null
        if (output) {
          kegiatan = await db.select().from(masterKegiatan).where(eq(masterKegiatan.id, output.kegiatan_id)).then(r => r[0])
          if (kegiatan) {
            program = await db.select().from(masterProgram).where(eq(masterProgram.id, kegiatan.program_id)).then(r => r[0])
          }
        }
        results.push({
          ...sub,
          output: output ? { id: output.id, kode_output: output.kode_output, nama_output: output.nama_output } : null,
          kegiatan: kegiatan ? { id: kegiatan.id, kode_kegiatan: kegiatan.kode_kegiatan, nama_kegiatan: kegiatan.nama_kegiatan } : null,
          program: program ? { id: program.id, kode_program: program.kode_program, nama_program: program.nama_program } : null
        })
      }
      return results
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e))
      return { error: 'Database error', detail: err.message }
    }
  }
})
