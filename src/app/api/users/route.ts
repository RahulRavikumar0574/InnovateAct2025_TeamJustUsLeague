import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../auth/middleware';

const prisma = new PrismaClient();

// Get all users (GET)
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, ['ADMIN', 'SUPERVISOR']);
  if (auth instanceof NextResponse) return auth;
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
  });
  return NextResponse.json(users);
}

// Create a new user (POST)
export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, ['ADMIN']);
  if (auth instanceof NextResponse) return auth;
  const { name, email, password, role } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  // Password should be hashed in production, but handled in signup route
  const user = await prisma.user.create({
    data: { name, email, password, role: role || 'WORKER' },
  });
  return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role });
}
