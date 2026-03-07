import { db } from '../../database';

export default defineEventHandler(async (event) => {
  const programId = getRouterParam(event, 'program_id');
  if (!programId) return [];
  const result = await db
    .selectFrom('anggaran_suboutput')
    .innerJoin('master_suboutput', 'anggaran_suboutput.suboutput_id', 'master_suboutput.id')
    .innerJoin('master_output', 'master_suboutput.output_id', 'master_output.id')
    .innerJoin('master_kegiatan', 'master_output.kegiatan_id', 'master_kegiatan.id')
    .where('master_kegiatan.program_id', '=', Number(programId))
    .select(['anggaran_suboutput.*'])
    .execute();
  return result;
});
