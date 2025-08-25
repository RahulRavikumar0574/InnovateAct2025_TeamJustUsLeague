# 📹 Camera System Setup Guide

This guide explains how to set up and use the integrated camera monitoring system in your InnovateHack1 project.

## 🎯 Overview

The camera system provides:
- **Supervisor Camera Streaming**: Supervisors can stream live video with object detection
- **Admin Camera Monitoring**: Admins can view live feeds from supervisor cameras
- **Real-time Object Detection**: YOLO-based detection overlays on video streams
- **WebSocket Communication**: Low-latency streaming between components
- **Role-based Access**: Separate interfaces for supervisors and admins

## 🏗️ Architecture

```
┌─────────────────┐    WebSocket    ┌─────────────────┐    HTTP/WS    ┌─────────────────┐
│  Supervisor     │ ──────────────→ │  Camera Server  │ ←──────────── │  Admin          │
│  Camera Sender  │                 │  (Python)       │               │  Web Interface  │
│  (Python)       │                 │  Port 8080      │               │  (Next.js)      │
└─────────────────┘                 └─────────────────┘               └─────────────────┘
```

## 📋 Prerequisites

### For Python Components:
```bash
pip install -r camera_requirements.txt
```

### For Next.js Application:
```bash
npm install
```

## 🚀 Quick Start

### 1. Start the Camera WebSocket Server

```bash
python camera_server.py
```

This starts the WebSocket server on `ws://localhost:8080` and displays connection instructions.

### 2. Start the Next.js Application

```bash
npm run dev
```

The web interface will be available at `http://localhost:3000`.

### 3. Start Supervisor Camera Streaming

In a new terminal:
```bash
python camera_sender.py --server ws://localhost:8080 --token your_secure_token_here --role supervisor --camera-id camera-supervisor-1
```

### 4. Access the Interfaces

- **Supervisor Interface**: `http://localhost:3000/supervisor/camera`
- **Admin Interface**: `http://localhost:3000/admin/camera`

## 🔧 Configuration

### Camera Sender Options

```bash
python camera_sender.py [OPTIONS]

Options:
  --server URL          WebSocket server URL (default: ws://localhost:8080)
  --token TOKEN         Authentication token (default: your_secure_token_here)
  --role ROLE           User role: supervisor or admin (default: supervisor)
  --camera-id ID        Camera identifier (default: camera-1)
  --camera-index N      Camera device index (default: 0)
  --width WIDTH         Camera width (default: 1280)
  --height HEIGHT       Camera height (default: 720)
  --fps FPS             Target FPS (default: 15)
  --no-detection        Disable object detection
```

### Environment Variables

Create a `.env.local` file in your project root:
```env
NEXT_PUBLIC_SECRET_TOKEN=your_secure_token_here
NEXT_PUBLIC_WS_URL=ws://localhost:8080
```

## 📱 Usage Instructions

### For Supervisors:

1. Navigate to `/supervisor/camera`
2. Click "Start Streaming" to begin broadcasting
3. Your video feed will be sent to admin viewers
4. Monitor connection status and FPS in real-time
5. Object detection runs automatically on your stream

### For Admins:

1. Navigate to `/admin/camera`
2. The interface automatically connects to view supervisor feeds
3. Select different camera sources from the sidebar
4. Monitor system statistics and detection results
5. Use controls to manage connections

## 🛠️ Troubleshooting

### Common Issues:

**1. Camera Not Found**
```bash
# Try different camera indices
python camera_sender.py --camera-index 1
python camera_sender.py --camera-index 2
```

**2. WebSocket Connection Failed**
- Ensure the camera server is running
- Check that port 8080 is not blocked by firewall
- Verify the token matches between server and client

**3. No Video in Browser**
- Check browser console for WebSocket errors
- Ensure camera permissions are granted
- Try refreshing the connection

**4. Poor Performance**
- Reduce resolution: `--width 640 --height 480`
- Lower FPS: `--fps 10`
- Disable detection: `--no-detection`

### Debug Mode:

Enable verbose logging:
```bash
python camera_sender.py --server ws://localhost:8080 --token your_secure_token_here --role supervisor --camera-id camera-supervisor-1 --verbose
```

## 🔒 Security Considerations

1. **Change Default Token**: Update the authentication token in production
2. **Network Security**: Use HTTPS/WSS in production environments
3. **Access Control**: Implement proper user authentication
4. **Firewall Rules**: Restrict WebSocket server access as needed

## 🎨 Customization

### Adding New Camera Sources:

1. Update the camera list in `admin/camera/page.tsx`:
```typescript
const [cameras, setCameras] = useState([
  { id: 'camera-supervisor-1', name: 'Supervisor Camera 1', status: 'online', fps: 0 },
  { id: 'camera-supervisor-2', name: 'Supervisor Camera 2', status: 'offline', fps: 0 },
  // Add more cameras here
]);
```

2. Start additional camera senders with unique IDs:
```bash
python camera_sender.py --camera-id camera-supervisor-2 --camera-index 1
```

### Modifying Object Detection:

Edit the `detect_objects` method in `camera_sender.py` to integrate with different YOLO models or detection systems.

## 📊 Performance Optimization

### For High-Quality Streaming:
```bash
python camera_sender.py --width 1920 --height 1080 --fps 30
```

### For Low-Bandwidth Environments:
```bash
python camera_sender.py --width 640 --height 480 --fps 10 --no-detection
```

### Multiple Camera Setup:
```bash
# Terminal 1 - Supervisor Camera 1
python camera_sender.py --camera-id supervisor-cam-1 --camera-index 0

# Terminal 2 - Supervisor Camera 2  
python camera_sender.py --camera-id supervisor-cam-2 --camera-index 1

# Terminal 3 - Admin Camera
python camera_sender.py --role admin --camera-id admin-cam-1 --camera-index 2
```

## 🔄 Integration with Existing Features

The camera system integrates seamlessly with your existing InnovateHack1 features:

- **Authentication**: Uses the same user roles (supervisor/admin)
- **Navigation**: Accessible through existing navigation structure
- **Styling**: Consistent with your Tailwind CSS design system
- **API**: Extends your existing API structure

## 📝 API Endpoints

- `GET /api/camera/health` - Health check for camera system
- `GET /api/camera/ws` - WebSocket server status and statistics
- `POST /api/camera/ws` - Get camera system statistics

## 🚀 Production Deployment

For production deployment:

1. **Use Environment Variables**:
```env
NEXT_PUBLIC_SECRET_TOKEN=production_secure_token
NEXT_PUBLIC_WS_URL=wss://your-domain.com/camera-ws
```

2. **Deploy Camera Server**:
```bash
# Use a process manager like PM2
pm2 start camera_server.py --name camera-ws-server
```

3. **Configure Reverse Proxy**:
```nginx
location /camera-ws {
    proxy_pass http://localhost:8080;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console for WebSocket errors
3. Check Python logs for camera server issues
4. Ensure all dependencies are properly installed

---

**🎉 Your camera monitoring system is now ready to use!**
