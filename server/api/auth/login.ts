import { db } from '../../database';
import { users } from '../../database/schema/users';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { createError } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const user = await db.select().from(users).where(eq(users.username, body.username));
  if (!user || user.length === 0) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' });
  }
  if (!user[0]!.password_hash) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' });
  }

  const passwordMatch = await bcrypt.compare(body.password, user[0]!.password_hash);

  if (!passwordMatch) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user[0]!.id, username: user[0]!.username, role_id: user[0]!.role_id, satker_id: user[0]!.satker_id }, 'SECRET_KEY', { expiresIn: '1h' });
  return { token };
});
