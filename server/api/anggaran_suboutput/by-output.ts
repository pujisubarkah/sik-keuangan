import { db } from '../../database';

export default defineEventHandler(async (event) => {
  const outputId = getRouterParam(event, 'output_id');
  if (!outputId) return [];
  const result = await db
    .selectFrom('anggaran_suboutput')
    .innerJoin('master_suboutput', 'anggaran_suboutput.suboutput_id', 'master_suboutput.id')
    .where('master_suboutput.output_id', '=', Number(outputId))
    .select(['anggaran_suboutput.*'])
    .execute();
  return result;
});
