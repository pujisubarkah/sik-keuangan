import { db } from '../../database';

export default defineEventHandler(async (event) => {
  const suboutputId = getRouterParam(event, 'suboutput_id');
  if (!suboutputId) return [];
  const result = await db
    .selectFrom('anggaran_suboutput')
    .where('anggaran_suboutput.suboutput_id', '=', Number(suboutputId))
    .selectAll()
    .execute();
  return result;
});
