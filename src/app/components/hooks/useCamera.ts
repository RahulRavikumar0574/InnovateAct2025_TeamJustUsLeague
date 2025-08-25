import { useEffect, useRef, useState, useCallback } from 'react';

interface CameraStats {
  fps: number;
  connections: number;
  frames_sent: number;
  uptime: number;
}

interface CameraFrame {
  type: string;
  camera_id: string;
  timestamp: number;
  data: string;
}

export const useCamera = (role: 'supervisor' | 'admin', isViewer: boolean = true) => {
  const [isConnected, setIsConnected] = useState(false);
  const [stats, setStats] = useState<CameraStats>({ fps: 0, connections: 0, frames_sent: 0, uptime: 0 });
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const connect = useCallback(() => {
    try {
      const wsUrl = `ws://127.0.0.1:7777?token=your_secure_token_here&role=${role}&user_type=${isViewer ? 'viewer' : 'sender'}${!isViewer ? `&camera_id=camera-${role}-1` : ''}`;
      console.log('Attempting WebSocket connection to:', wsUrl);

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket onopen event fired');
        setIsConnected(true);
        setError(null);
        console.log(`Connected as ${role} ${isViewer ? 'viewer' : 'sender'}`);
      };

      ws.onclose = (event) => {
        console.log('WebSocket onclose event fired:', event.code, event.reason);
        console.log('Close event details:', event);
        setIsConnected(false);
        console.log('WebSocket disconnected');
      };

      ws.onerror = (err) => {
        console.log('WebSocket onerror event fired:', err);
        setError('WebSocket connection error');
        console.error('WebSocket error:', err);
        setIsConnected(false);
      };

      ws.onmessage = (event) => {
        try {
          const frame: CameraFrame = JSON.parse(event.data);
          
          if (frame.type === 'frame' && videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
              canvas.width = img.width;
              canvas.height = img.height;
              ctx?.drawImage(img, 0, 0);
              
              // Update video element if available
              if (videoRef.current) {
                const stream = canvas.captureStream(30);
                videoRef.current.srcObject = stream;
              }
            };
            
            img.src = `data:image/jpeg;base64,${frame.data}`;
          }
        } catch (err) {
          console.error('Error processing frame:', err);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.log('WebSocket disconnected');
      };

      ws.onerror = (err) => {
        setError('WebSocket connection error');
        console.error('WebSocket error:', err);
        setIsConnected(false);
      };

    } catch (err) {
      setError('Failed to connect to camera service');
      console.error('Connection error:', err);
    }
  }, [role, isViewer]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const sendFrame = useCallback((frameData: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(frameData);
    }
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720 }, 
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // If this is a sender, start capturing and sending frames
      if (!isViewer && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        const captureFrame = () => {
          if (videoRef.current && ctx) {
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            ctx.drawImage(videoRef.current, 0, 0);
            
            canvas.toBlob((blob) => {
              if (blob) {
                const reader = new FileReader();
                reader.onload = () => {
                  const base64 = (reader.result as string).split(',')[1];
                  sendFrame(base64);
                };
                reader.readAsDataURL(blob);
              }
            }, 'image/jpeg', 0.8);
          }
          
          if (isConnected) {
            setTimeout(captureFrame, 1000 / 15); // 15 FPS
          }
        };
        
        if (isConnected) {
          captureFrame();
        }
      }
      
    } catch (err) {
      setError('Failed to access camera');
      console.error('Camera error:', err);
    }
  }, [isViewer, isConnected, sendFrame]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/camera/ws', { 
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'stats' }) 
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      // Set default stats on error
      setStats({ fps: 0, connections: 0, frames_sent: 0, uptime: 0 });
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchStats, 2000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    stats,
    error,
    videoRef,
    canvasRef,
    connect,
    disconnect,
    startCamera
  };
};
