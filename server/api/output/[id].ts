import { db } from '@/server/database';
import { masterOutput } from '@/server/database/schema/master_output';
import { eq } from 'drizzle-orm';
import { masterKegiatan } from '@/server/database/schema/master_kegiatan';
import { masterProgram } from '@/server/database/schema/master_program';
import { tahunAnggaran } from '@/server/database/schema/tahun_anggaran';
import { satker as satkerTable } from '@/server/database/schema/satker';

export default defineEventHandler(async (event) => {
  // Ambil id dari params
  let id: string | undefined;
  if (event.context && event.context.params && typeof event.context.params === 'object') {
    id = (event.context.params as Record<string, string>)["id"];
  }
  if (!id) return { success: false, message: 'Missing id' };


  // GET: Ambil 1 output by id
  if (event.node.req.method === 'GET') {
    // Ambil output
    const data = await db.select().from(masterOutput).where(eq(masterOutput.id, Number(id)));
    if (!data.length) return { success: false, message: 'Not found' };
    const output = data[0];
    if (!output) return { success: false, message: 'Not found' };
    // Join ke master_kegiatan
    const keg = await db.select().from(masterKegiatan).where(eq(masterKegiatan.id, output.kegiatan_id));
    let tahun_anggaran = null;
    let tahun_anggaran_id = null;
    let program = null;
    let kegiatanObj = null;
    if (keg.length && keg[0]) {
      kegiatanObj = {
        id: keg[0].id,
        kode_kegiatan: keg[0].kode_kegiatan,
        nama_kegiatan: keg[0].nama_kegiatan
      };
      // Join ke master_program
      const prog = await db.select().from(masterProgram).where(eq(masterProgram.id, keg[0].program_id));
      if (prog.length && prog[0] && prog[0].created_at) {
        tahun_anggaran = new Date(prog[0].created_at).getFullYear();
        program = {
          id: prog[0].id,
          kode_program: prog[0].kode_program,
          nama_program: prog[0].nama_program
        };
        // Cari id tahun_anggaran
        const tahunRow = await db.select().from(tahunAnggaran).where(eq(tahunAnggaran.tahun, tahun_anggaran));
        if (tahunRow.length && tahunRow[0]) {
          tahun_anggaran_id = tahunRow[0].id;
          tahun_anggaran = tahunRow[0].tahun;
        }
      }
    }
    // Join ke satker
    let satkerObj = null;
    if (output.satker_id) {
      const satkerRows = await db.select().from(satkerTable).where(eq(satkerTable.id, output.satker_id));
      if (satkerRows.length && satkerRows[0]) {
        satkerObj = {
          id: satkerRows[0].id,
          name: satkerRows[0].name
        };
      }
    }
    return { success: true, data: { ...output, tahun_anggaran_id, tahun_anggaran, program, kegiatan: kegiatanObj, satker: satkerObj } };
  }

  // PUT: Update output by id
  if (event.node.req.method === 'PUT') {
    const body = await readBody(event);
    const now = new Date();
    const updated = await db.update(masterOutput)
      .set({
        ...(body.kode_output && { kode_output: body.kode_output }),
        ...(body.nama_output && { nama_output: body.nama_output }),
        ...(body.kegiatan_id && { kegiatan_id: Number(body.kegiatan_id) }),
        ...(body.total !== undefined && { total: body.total }),
        ...(body.satker_id && { satker_id: Number(body.satker_id) }),
        updated_at: now,
      })
      .where(eq(masterOutput.id, Number(id)))
      .returning();
    if (!updated.length) return { success: false, message: 'Not found or not updated' };
    return { success: true, data: updated[0] };
  }

  // DELETE: Hapus output by id
  if (event.node.req.method === 'DELETE') {
    const deleted = await db.delete(masterOutput)
      .where(eq(masterOutput.id, Number(id)))
      .returning();
    if (!deleted.length) return { success: false, message: 'Not found or not deleted' };
    return { success: true, data: deleted[0] };
  }

  return { success: false, message: 'Method not allowed' };
});
