import { satker } from '../../database/schema/satker';
import { db } from '../../database';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid id'
    });
  }

  const found = await db.select().from(satker).where(eq(satker.id, Number(id)));
  
  if (!found.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not found'
    });
  }

  return found[0];
});
