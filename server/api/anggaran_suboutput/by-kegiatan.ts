import { anggaranSuboutput } from '../../database/schema/anggaran_suboutput';
import { masterSuboutput } from '../../database/schema/master_suboutput';
import { masterOutput } from '../../database/schema/master_output';

export default defineEventHandler(async (event) => {
  const kegiatanId = getRouterParam(event, 'kegiatan_id');
  if (!kegiatanId) return [];
  // Query dengan drizzle ORM
  const result = await db.select()
    .from(anggaranSuboutput)
    .innerJoin(masterSuboutput, anggaranSuboutput.suboutput_id.eq(masterSuboutput.id))
    .innerJoin(masterOutput, masterSuboutput.output_id.eq(masterOutput.id))
    .where(masterOutput.kegiatan_id.eq(Number(kegiatanId)))
    .execute();
  return result;
});
