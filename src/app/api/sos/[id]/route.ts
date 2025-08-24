import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, SOSStatus } from '@prisma/client';
import { requireAuth } from '../../auth/middleware';

const prisma = new PrismaClient();

// Resolve an SOS alert (PATCH)
export async function PATCH(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPERVISOR', 'ADMIN']);
  if (auth instanceof NextResponse) return auth;
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'SOS ID required' }, { status: 400 });
  const sos = await prisma.sOSAlert.update({
    where: { id: Number(id) },
    data: { status: SOSStatus.RESOLVED, resolvedAt: new Date() },
  });
  return NextResponse.json(sos);
}
