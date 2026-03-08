import { db } from '@/server/database'
import { masterSuboutput } from '@/server/database/schema/master_suboutput'
import { masterOutput } from '@/server/database/schema/master_output'
import { masterKegiatan } from '@/server/database/schema/master_kegiatan'
import { masterProgram } from '@/server/database/schema/master_program'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) {
    return { error: 'ID is required' }
  }
  if (event.req.method === 'POST') {
    const body = await readBody(event)
    if (!body.kode_suboutput || !body.nama_suboutput || !body.output_id) {
      return { error: 'kode_suboutput, nama_suboutput, dan output_id wajib diisi' }
    }
    try {
      const updated = await db.update(masterSuboutput)
        .set({
          kode_suboutput: body.kode_suboutput,
          nama_suboutput: body.nama_suboutput,
          output_id: Number(body.output_id)
        })
        .where(eq(masterSuboutput.id, Number(id)))
        .returning()
      return updated[0]
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e))
      return { error: 'Database error', detail: err.message }
    }
  } else {
    try {
      const sub = await db.select().from(masterSuboutput).where(eq(masterSuboutput.id, Number(id))).then(r => r[0])
      if (!sub) return { error: 'Not found' }
      const output = await db.select().from(masterOutput).where(eq(masterOutput.id, sub.output_id)).then(r => r[0])
      let kegiatan = null, program = null
      if (output) {
        kegiatan = await db.select().from(masterKegiatan).where(eq(masterKegiatan.id, output.kegiatan_id)).then(r => r[0])
        if (kegiatan) {
          program = await db.select().from(masterProgram).where(eq(masterProgram.id, kegiatan.program_id)).then(r => r[0])
        }
      }
      return {
        ...sub,
        output: output ? { id: output.id, kode_output: output.kode_output, nama_output: output.nama_output } : null,
        kegiatan: kegiatan ? { id: kegiatan.id, kode_kegiatan: kegiatan.kode_kegiatan, nama_kegiatan: kegiatan.nama_kegiatan } : null,
        program: program ? { id: program.id, kode_program: program.kode_program, nama_program: program.nama_program } : null
      }
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e))
      return { error: 'Database error', detail: err.message }
    }
  }
})
