import { db } from "@/server/database";
import { masterOutput } from "@/server/database/schema/master_output";
import { masterSuboutput } from "@/server/database/schema/master_suboutput";
import { masterKegiatan } from "@/server/database/schema/master_kegiatan";
import { masterProgram } from "@/server/database/schema/master_program";
import { and, eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'POST') {
    const body = await readBody(event);
    if (!body.kode_output || !body.nama_output || !body.kegiatan_id || !body.satker_id) {
      return { success: false, message: 'kode_output, nama_output, kegiatan_id, dan satker_id wajib diisi' };
    }
    // Cek duplikat kombinasi unik
    const existing = await db.select().from(masterOutput).where(
      and(
        eq(masterOutput.kode_output, body.kode_output),
        eq(masterOutput.kegiatan_id, Number(body.kegiatan_id)),
        eq(masterOutput.satker_id, Number(body.satker_id))
      )
    );
    if (existing && existing.length > 0) {
      return { success: false, message: 'Data dengan kombinasi kode_output, kegiatan_id, dan satker_id sudah ada.' };
    }
    const now = new Date();
    const inserted = await db.insert(masterOutput).values({
      kode_output: body.kode_output,
      nama_output: body.nama_output,
      kegiatan_id: Number(body.kegiatan_id),
      created_at: now,
      updated_at: now,
      total: body.total ?? null,
      satker_id: Number(body.satker_id),
    }).returning();
    return { success: true, data: inserted[0] };
  }

  // GET
  const query = getQuery(event);
  let where = undefined;
  if (query.kegiatan_id) {
    where = (row: any) => row.kegiatan_id === Number(query.kegiatan_id);
  }
  const data = await db.select().from(masterOutput);
  const suboutputs = await db.select().from(masterSuboutput);
  const kegiatans = await db.select().from(masterKegiatan);
  const programs = await db.select().from(masterProgram);
  // Hitung jumlah suboutput per output
  const suboutputCountMap: Record<number, number> = {};
  for (const sub of suboutputs) {
    const oid = typeof sub.output_id === 'number' ? sub.output_id : Number(sub.output_id);
    if (!oid && oid !== 0) continue;
    if (!suboutputCountMap[oid]) suboutputCountMap[oid] = 0;
    suboutputCountMap[oid]++;
  }
  const result = (where ? data.filter(where) : data).map(item => {
    // Cari tahun anggaran dari program terkait
    const kegiatan = kegiatans.find(k => k.id === item.kegiatan_id);
    let tahun_anggaran = null;
    let program = null;
    let kegiatanObj = null;
    if (kegiatan) {
      kegiatanObj = {
        id: kegiatan.id,
        kode_kegiatan: kegiatan.kode_kegiatan,
        nama_kegiatan: kegiatan.nama_kegiatan
      };
      const prog = programs.find(p => p.id === kegiatan.program_id);
      if (prog && prog.created_at) {
        tahun_anggaran = new Date(prog.created_at).getFullYear();
        program = {
          id: prog.id,
          kode_program: prog.kode_program,
          nama_program: prog.nama_program
        };
      }
    }
    return {
      ...item,
      jumlah_suboutput: suboutputCountMap[item.id] || 0,
      tahun_anggaran,
      program,
      kegiatan: kegiatanObj,
    };
  });
  return { success: true, data: result };
});
