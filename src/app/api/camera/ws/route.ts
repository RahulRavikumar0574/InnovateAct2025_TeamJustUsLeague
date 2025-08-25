import { NextRequest } from 'next/server';

// Simple stats tracking without WebSocket server
class CameraStatsManager {
  private stats = {
    connections: 0,
    frames_sent: 0,
    start_time: Date.now(),
    senders: 0,
    viewers: 0
  };

  getStats() {
    const uptime = Date.now() - this.stats.start_time;
    return {
      uptime,
      connections: this.stats.connections,
      senders: this.stats.senders,
      viewers: this.stats.viewers,
      frames_sent: this.stats.frames_sent,
      fps: this.stats.frames_sent / (uptime / 1000) || 0
    };
  }

  updateStats(data: any) {
    if (data.connections !== undefined) this.stats.connections = data.connections;
    if (data.frames_sent !== undefined) this.stats.frames_sent = data.frames_sent;
    if (data.senders !== undefined) this.stats.senders = data.senders;
    if (data.viewers !== undefined) this.stats.viewers = data.viewers;
  }
}

const statsManager = new CameraStatsManager();

// API route handlers
export async function GET(request: NextRequest) {
  return Response.json({
    status: 'Camera API ready',
    message: 'Use the standalone Python WebSocket server for camera streaming',
    websocket_url: 'ws://127.0.0.1:7777',
    stats: statsManager.getStats()
  });
}

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json();
    
    if (action === 'stats') {
      return Response.json(statsManager.getStats());
    }
    
    if (action === 'update_stats') {
      statsManager.updateStats(data);
      return Response.json({ success: true });
    }
    
    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
