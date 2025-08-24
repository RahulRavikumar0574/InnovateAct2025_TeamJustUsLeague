import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../../auth/middleware';

const prisma = new PrismaClient();

// Get user by ID (GET)
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, ['ADMIN', 'SUPERVISOR']);
  if (auth instanceof NextResponse) return auth;
  const { searchParams } = new URL(req.url!);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
  });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json(user);
}

// Update user by ID (PUT)
export async function PUT(req: NextRequest) {
  const auth = await requireAuth(req, ['ADMIN']);
  if (auth instanceof NextResponse) return auth;
  const { id, name, email, role } = await req.json();
  if (!id) return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  const user = await prisma.user.update({
    where: { id: Number(id) },
    data: { name, email, role },
  });
  return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role });
}

// Delete user by ID (DELETE)
export async function DELETE(req: NextRequest) {
  const auth = await requireAuth(req, ['ADMIN']);
  if (auth instanceof NextResponse) return auth;
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  await prisma.user.delete({ where: { id: Number(id) } });
  return NextResponse.json({ message: 'User deleted' });
}
