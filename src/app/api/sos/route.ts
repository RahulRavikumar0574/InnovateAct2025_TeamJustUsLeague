import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, SOSStatus } from '@prisma/client';
import { requireAuth } from '../auth/middleware';

const prisma = new PrismaClient();

// Send a new SOS alert (POST)
export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, ['WORKER', 'SUPERVISOR', 'ADMIN']);
  if (auth instanceof NextResponse) return auth;
  const { message } = await req.json();
  if (!message) return NextResponse.json({ error: 'Message required' }, { status: 400 });
  const userId = (auth as any).userId;
  const sos = await prisma.sOSAlert.create({
    data: {
      userId,
      message,
      status: SOSStatus.PENDING,
    },
  });
  return NextResponse.json(sos, { status: 201 });
}

// List all SOS alerts (GET)
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPERVISOR', 'ADMIN']);
  if (auth instanceof NextResponse) return auth;
  const sosAlerts = await prisma.sOSAlert.findMany({
    include: { user: { select: { id: true, name: true, email: true, role: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(sosAlerts);
}
