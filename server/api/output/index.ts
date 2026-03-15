import { db } from "@/server/database";
import { masterOutput } from "@/server/database/schema/master_output";
import { masterSuboutput } from "@/server/database/schema/master_suboutput";
import { masterKegiatan } from "@/server/database/schema/master_kegiatan";
import { masterProgram } from "@/server/database/schema/master_program";

export default defineEventHandler(async (event) => {
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
    if (kegiatan) {
      const program = programs.find(p => p.id === kegiatan.program_id);
      if (program && program.created_at) {
        tahun_anggaran = new Date(program.created_at).getFullYear();
      }
    }
    return {
      ...item,
      jumlah_suboutput: suboutputCountMap[item.id] || 0,
      tahun_anggaran,
    };
  });
  return result;
});
