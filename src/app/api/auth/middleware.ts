import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export function getTokenFromHeader(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.replace('Bearer ', '').trim();
}

export function verifyJWT(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function requireAuth(req: NextRequest, allowedRoles: string[] = []) {
  const token = getTokenFromHeader(req);
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized: No token' }, { status: 401 });
  }
  const payload = verifyJWT(token);
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
  }
  if (allowedRoles.length && typeof payload !== 'string' && (payload as jwt.JwtPayload).role && !allowedRoles.includes((payload as jwt.JwtPayload).role)) {
    return NextResponse.json({ error: 'Forbidden: Insufficient role' }, { status: 403 });
  }
  return payload;
}
