import { satker } from '../../database/schema/satker';
import { db } from '../../database';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const method = event.method;

  switch (method) {
    case 'GET':
      // Get all satker
      const all = await db.select().from(satker);
      return {
        success: true,
        data: all
      };

    case 'POST':
      // Create new satker
      const body = await readBody(event);
      const { name } = body;
      
      if (!name) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Name is required'
        });
      }
      
      const inserted = await db.insert(satker).values({ name }).returning();
      setResponseStatus(event, 201);
      return inserted[0];

    case 'PUT':
      // Update satker
      const updateBody = await readBody(event);
      const { id, name: newName } = updateBody;
      
      if (!id || !newName) {
        throw createError({
          statusCode: 400,
          statusMessage: 'ID and name are required'
        });
      }
      
      const updated = await db.update(satker).set({ name: newName }).where(eq(satker.id, id)).returning();
      return updated[0];

    case 'DELETE':
      // Delete satker
      const deleteBody = await readBody(event);
      const { id: deleteId } = deleteBody;
      
      if (!deleteId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'ID is required'
        });
      }
      
      await db.delete(satker).where(eq(satker.id, deleteId));
      setResponseStatus(event, 204);
      return null;

    default:
      throw createError({
        statusCode: 405,
        statusMessage: `Method ${method} Not Allowed`
      });
  }
});
