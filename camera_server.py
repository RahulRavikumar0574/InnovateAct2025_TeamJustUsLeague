#!/usr/bin/env python3
"""
Standalone WebSocket Server for Camera System
Handles video streaming between supervisor cameras and admin viewers
"""

import asyncio
import websockets
import json
import logging
from typing import Dict, Set
from urllib.parse import parse_qs, urlparse
import signal
import sys
import functools

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class CameraWebSocketServer:
    def __init__(self, host='127.0.0.1', port=7777, token='StrongPassword123'):
        self.host = host
        self.port = port
        self.token = token
        
        # Connection storage
        self.senders: Dict[str, websockets.WebSocketServerProtocol] = {}  # camera_id -> websocket
        self.viewers: Dict[str, Set[websockets.WebSocketServerProtocol]] = {  # role -> set of websockets
            'supervisor': set(),
            'admin': set()
        }
        
        # Statistics
        self.stats = {
            'connections': 0,
            'frames_sent': 0,
            'start_time': asyncio.get_event_loop().time()
        }
        
        logger.info(f"Camera WebSocket Server initialized on {host}:{port}")
    
    def validate_connection(self, path: str, headers) -> tuple:
        """Validate incoming WebSocket connection"""
        try:
            # Parse query parameters
            parsed = urlparse(path)
            params = parse_qs(parsed.query)
            
            token = params.get('token', [None])[0]
            role = params.get('role', [None])[0]
            user_type = params.get('user_type', ['viewer'])[0]
            camera_id = params.get('camera_id', [None])[0]
            
            # Validate token
            if token != self.token:
                return False, "Invalid token"
            
            # Validate role
            if role not in ['supervisor', 'admin']:
                return False, "Invalid role"
            
            # Validate sender requirements
            if user_type == 'sender' and not camera_id:
                return False, "Camera ID required for senders"
            
            return True, {
                'role': role,
                'user_type': user_type,
                'camera_id': camera_id
            }
            
        except Exception as e:
            return False, f"Validation error: {str(e)}"
    
    async def register_connection(self, websocket, connection_info):
        """Register a new connection"""
        role = connection_info['role']
        user_type = connection_info['user_type']
        camera_id = connection_info['camera_id']
        
        if user_type == 'sender':
            self.senders[camera_id] = websocket
            logger.info(f"📹 {role} sender registered for camera {camera_id}")
        else:
            self.viewers[role].add(websocket)
            logger.info(f"👀 {role} viewer registered (total: {len(self.viewers[role])})")
        
        self.stats['connections'] += 1
    
    async def unregister_connection(self, websocket, connection_info):
        """Unregister a connection"""
        role = connection_info['role']
        user_type = connection_info['user_type']
        camera_id = connection_info['camera_id']
        
        try:
            if user_type == 'sender' and camera_id in self.senders:
                if self.senders[camera_id] == websocket:
                    del self.senders[camera_id]
                    logger.info(f"❌ {role} sender disconnected for camera {camera_id}")
            else:
                if websocket in self.viewers[role]:
                    self.viewers[role].remove(websocket)
                    logger.info(f"❌ {role} viewer disconnected")
            
            self.stats['connections'] -= 1
            
        except Exception as e:
            logger.error(f"Error unregistering connection: {e}")
    
    async def broadcast_frame(self, role: str, frame_data: str, camera_id: str):
        """Broadcast frame to all viewers of a specific role"""
        if role not in self.viewers:
            return
        
        message = json.dumps({
            'type': 'frame',
            'camera_id': camera_id,
            'timestamp': asyncio.get_event_loop().time() * 1000,
            'data': frame_data
        })
        
        # Get list of viewers to avoid modification during iteration
        viewers = list(self.viewers[role])
        disconnected = []
        
        for viewer in viewers:
            try:
                await viewer.send(message)
                self.stats['frames_sent'] += 1
            except websockets.exceptions.ConnectionClosed:
                disconnected.append(viewer)
            except Exception as e:
                logger.error(f"Error sending frame to viewer: {e}")
                disconnected.append(viewer)
        
        # Remove disconnected viewers
        for viewer in disconnected:
            self.viewers[role].discard(viewer)
    
    async def handle_client(self, websocket, path):
        """Handle individual client connections"""
        logger.info(f"🔌 New WebSocket connection attempt from {websocket.remote_address} to {path}")
        
        # Validate connection
        is_valid, result = self.validate_connection(path, websocket.request_headers)
        
        if not is_valid:
            logger.warning(f"❌ Connection rejected: {result}")
            await websocket.close(code=1008, reason=result)
            return
        
        connection_info = result
        logger.info(f"✅ Connection validated: {connection_info}")
        
        # Register connection
        await self.register_connection(websocket, connection_info)
        logger.info(f"📝 Connection registered successfully")
        
        try:
            # Handle messages
            async for message in websocket:
                if connection_info['user_type'] == 'sender':
                    # Forward frame to viewers
                    await self.broadcast_frame(
                        connection_info['role'], 
                        message, 
                        connection_info['camera_id']
                    )
                else:
                    # Handle viewer messages (ping, etc.)
                    try:
                        data = json.loads(message)
                        if data.get('type') == 'ping':
                            await websocket.send(json.dumps({
                                'type': 'pong',
                                'timestamp': asyncio.get_event_loop().time() * 1000
                            }))
                    except:
                        pass  # Ignore invalid messages from viewers
                        
        except websockets.exceptions.ConnectionClosed:
            logger.info("Client disconnected")
        except Exception as e:
            logger.error(f"Error handling client: {e}")
        finally:
            # Unregister connection
            await self.unregister_connection(websocket, connection_info)
    
    def get_stats(self):
        """Get server statistics"""
        uptime = asyncio.get_event_loop().time() - self.stats['start_time']
        return {
            'uptime': uptime,
            'connections': self.stats['connections'],
            'senders': len(self.senders),
            'viewers': {role: len(viewers) for role, viewers in self.viewers.items()},
            'frames_sent': self.stats['frames_sent'],
            'fps': self.stats['frames_sent'] / uptime if uptime > 0 else 0
        }
    
    async def start_server(self):
        """Start the WebSocket server"""
        logger.info(f"Starting WebSocket server on {self.host}:{self.port}")
        
        # Start the server
        server = await websockets.serve(
            functools.partial(self.handle_client),
            self.host,
            self.port,
            ping_interval=20,
            ping_timeout=10
        )
        
        logger.info("✅ Camera WebSocket server started successfully")
        logger.info(f"🌐 Server URL: ws://{self.host}:{self.port}")
        logger.info(f"🔑 Authentication token: {self.token}")
        
        # Print usage instructions
        print("\n" + "="*60)
        print("📹 CAMERA SYSTEM READY")
        print("="*60)
        print(f"WebSocket Server: ws://{self.host}:{self.port}")
        print(f"Token: {self.token}")
        print("\nTo start a supervisor camera:")
        print(f"python camera_sender.py --server ws://{self.host}:{self.port} --token {self.token} --role supervisor --camera-id camera-supervisor-1")
        print("\nTo start an admin camera:")
        print(f"python camera_sender.py --server ws://{self.host}:{self.port} --token {self.token} --role admin --camera-id camera-admin-1")
        print("\nPress Ctrl+C to stop the server")
        print("="*60 + "\n")
        
        return server
    
    async def stop_server(self, server):
        """Stop the WebSocket server"""
        logger.info("Stopping WebSocket server...")
        server.close()
        await server.wait_closed()
        logger.info("WebSocket server stopped")

async def main():
    # Create server instance
    server_instance = CameraWebSocketServer()
    
    # Start server
    server = await server_instance.start_server()
    
    try:
        # Keep server running
        await server.wait_closed()
    except KeyboardInterrupt:
        logger.info("Server interrupted by user")
    finally:
        await server_instance.stop_server(server)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n👋 Camera server stopped by user")
    except Exception as e:
        logger.error(f"Server error: {e}")
        sys.exit(1)
