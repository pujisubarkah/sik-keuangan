import { db } from '../../database';
import { users } from '../../database/schema/users';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { createError } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log('Login input:', body);
  const user = await db.select().from(users).where(eq(users.username, body.username));
  console.log('User query result:', user);
  if (!user || user.length === 0) {
    console.log('Invalid credential check: user not found');
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' });
  }
  if (!user[0]!.password_hash) {
    console.log('Invalid credential check: password hash not found');
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' });
  }
  
  // Test: Create a new hash with the input password to compare
  const testHash = await bcrypt.hash(body.password, 10);
  console.log('Test hash created:', testHash);
  console.log('Stored hash:', user[0]!.password_hash);
  
  const passwordMatch = await bcrypt.compare(body.password, user[0]!.password_hash);
  console.log('Password match result:', passwordMatch);
  
  if (!passwordMatch) {
    console.log('Invalid credential check: password mismatch', {
      passwordInput: body.password,
      passwordDb: user[0]?.password_hash
    });
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user[0]!.id, username: user[0]!.username, role_id: user[0]!.role_id, satker_id: user[0]!.satker_id }, 'SECRET_KEY', { expiresIn: '1h' });
  return { token };
});
