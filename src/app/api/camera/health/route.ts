import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  return Response.json({
    status: 'ok',
    timestamp: Date.now(),
    service: 'camera-api',
    version: '1.0.0'
  });
}
