import { eq } from 'drizzle-orm';
import { anggaranSuboutput } from '../../database/schema/anggaran_suboutput';
import { masterSuboutput } from '../../database/schema/master_suboutput';
import { masterOutput } from '../../database/schema/master_output';
import { masterKegiatan } from '../../database/schema/master_kegiatan';
import { masterProgram } from '../../database/schema/master_program';
import { db } from '../../database';

export default defineEventHandler(async (event) => {
  const result = await db
    .select({
      anggaranSuboutput,
      kode_suboutput: masterSuboutput.kode_suboutput,
      nama_suboutput: masterSuboutput.nama_suboutput,
      kode_output: masterOutput.kode_output,
      nama_output: masterOutput.nama_output,
      kode_kegiatan: masterKegiatan.kode_kegiatan,
      nama_kegiatan: masterKegiatan.nama_kegiatan,
      kode_program: masterProgram.kode_program,
      nama_program: masterProgram.nama_program,
    })
    .from(anggaranSuboutput)
    .innerJoin(masterSuboutput, eq(anggaranSuboutput.suboutput_id, masterSuboutput.id))
    .innerJoin(masterOutput, eq(masterSuboutput.output_id, masterOutput.id))
    .innerJoin(masterKegiatan, eq(masterOutput.kegiatan_id, masterKegiatan.id))
    .innerJoin(masterProgram, eq(masterKegiatan.program_id, masterProgram.id));

  return result;
});
