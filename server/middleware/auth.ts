import jwt from 'jsonwebtoken';
import { createError } from 'h3';

export default defineEventHandler((event) => {
  const pathname = getRequestURL(event).pathname;

  if (!pathname.startsWith('/api')) return;
  if (pathname === '/api/auth/login') return;

  // Ambil header Authorization dari req atau dari event.headers (case-insensitive, support Headers object)
  let authHeader: string | undefined = event.req?.headers?.authorization;
  if (!authHeader && event.headers?.get) {
    const lower = event.headers.get('authorization');
    const upper = event.headers.get('Authorization');
    authHeader = lower || upper || undefined;
  }
  if (!authHeader) throw createError({ statusCode: 401, statusMessage: 'No token provided' });
  const token = authHeader.split(' ')[1];
  if (!token) throw createError({ statusCode: 401, statusMessage: 'No token provided' });
  try {
    const decoded = jwt.verify(token, 'SECRET_KEY');
    event.context.user = decoded;
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' });
  }
});
