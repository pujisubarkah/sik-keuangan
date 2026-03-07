import { anggaranSuboutput } from '../../database/schema/anggaran_suboutput';
import { masterSuboutput } from '../../database/schema/master_suboutput';
import { masterOutput } from '../../database/schema/master_output';
import { masterKegiatan } from '../../database/schema/master_kegiatan';
import { masterProgram } from '../../database/schema/master_program';
import { db } from '../../database';

export default defineEventHandler(async (event) => {
  // Ambil semua data anggaran_suboutput beserta relasi ke master_suboutput, master_output, master_kegiatan, master_program
  const result = await db
    .selectFrom('anggaran_suboutput')
    .innerJoin('master_suboutput', 'anggaran_suboutput.suboutput_id', 'master_suboutput.id')
    .innerJoin('master_output', 'master_suboutput.output_id', 'master_output.id')
    .innerJoin('master_kegiatan', 'master_output.kegiatan_id', 'master_kegiatan.id')
    .innerJoin('master_program', 'master_kegiatan.program_id', 'master_program.id')
    .select([
      'anggaran_suboutput.*',
      'master_suboutput.kode_suboutput',
      'master_suboutput.nama_suboutput',
      'master_output.kode_output',
      'master_output.nama_output',
      'master_kegiatan.kode_kegiatan',
      'master_kegiatan.nama_kegiatan',
      'master_program.kode_program',
      'master_program.nama_program',
    ])
    .execute();

  return result;
});
