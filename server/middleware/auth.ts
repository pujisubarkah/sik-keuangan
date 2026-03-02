import jwt from 'jsonwebtoken';
import { createError } from 'h3';

export default defineEventHandler((event) => {
  const pathname = getRequestURL(event).pathname;

  if (!pathname.startsWith('/api')) return;
  if (pathname === '/api/auth/login') return;

  const authHeader = event.req.headers.authorization;
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
