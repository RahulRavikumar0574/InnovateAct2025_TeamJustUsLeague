#!/usr/bin/env python3
"""
Camera Sender Script for InnovateHack1 Project
Captures video from webcam and sends frames via WebSocket to the Next.js application
"""

import cv2
import base64
import json
import asyncio
import websockets
import argparse
import time
import logging
from typing import Optional
import numpy as np

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class CameraSender:
    def __init__(self, server_url: str, token: str, role: str, camera_id: str, 
                 camera_index: int = 0, width: int = 1280, height: int = 720, 
                 fps: int = 15, enable_detection: bool = True):
        self.server_url = server_url
        self.token = token
        self.role = role
        self.camera_id = camera_id
        self.camera_index = camera_index
        self.width = width
        self.height = height
        self.fps = fps
        self.enable_detection = enable_detection
        
        self.cap: Optional[cv2.VideoCapture] = None
        self.websocket: Optional[websockets.WebSocketServerProtocol] = None
        self.running = False
        
        # YOLO detection (optional)
        self.net = None
        self.output_layers = None
        self.classes = None
        
        # FPS tracking
        self.frame_count = 0
        self.start_time = time.time()
        
    def initialize_camera(self) -> bool:
        """Initialize the camera capture"""
        try:
            self.cap = cv2.VideoCapture(self.camera_index)
            if not self.cap.isOpened():
                logger.error(f"Failed to open camera {self.camera_index}")
                return False
                
            # Set camera properties
            self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, self.width)
            self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, self.height)
            self.cap.set(cv2.CAP_PROP_FPS, self.fps)
            
            # Verify settings
            actual_width = int(self.cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            actual_height = int(self.cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            actual_fps = self.cap.get(cv2.CAP_PROP_FPS)
            
            logger.info(f"Camera initialized: {actual_width}x{actual_height} @ {actual_fps} FPS")
            return True
            
        except Exception as e:
            logger.error(f"Error initializing camera: {e}")
            return False
    
    def initialize_detection(self) -> bool:
        """Initialize YOLO object detection (optional)"""
        if not self.enable_detection:
            return True
            
        try:
            # Try to load YOLOv4 or YOLOv3 weights (if available)
            # For now, we'll use a simple detection placeholder
            logger.info("Object detection initialized (placeholder)")
            return True
            
        except Exception as e:
            logger.warning(f"Could not initialize object detection: {e}")
            self.enable_detection = False
            return True
    
    def detect_objects(self, frame: np.ndarray) -> np.ndarray:
        """Perform object detection on frame"""
        if not self.enable_detection:
            return frame
            
        # Placeholder for object detection
        # In a real implementation, you would run YOLO here
        height, width = frame.shape[:2]
        
        # Draw a simple detection box as demo
        cv2.rectangle(frame, (50, 50), (200, 150), (0, 255, 0), 2)
        cv2.putText(frame, "Demo Detection", (55, 45), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
        
        return frame
    
    def add_overlay(self, frame: np.ndarray) -> np.ndarray:
        """Add FPS and info overlay to frame"""
        # Calculate FPS
        self.frame_count += 1
        elapsed_time = time.time() - self.start_time
        current_fps = self.frame_count / elapsed_time if elapsed_time > 0 else 0
        
        # Add overlay text
        overlay_text = [
            f"FPS: {current_fps:.1f}",
            f"Role: {self.role}",
            f"Camera: {self.camera_id}",
            f"Resolution: {frame.shape[1]}x{frame.shape[0]}"
        ]
        
        y_offset = 30
        for i, text in enumerate(overlay_text):
            y_pos = y_offset + (i * 25)
            cv2.putText(frame, text, (10, y_pos), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
            cv2.putText(frame, text, (10, y_pos), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 0), 1)
        
        return frame
    
    def encode_frame(self, frame: np.ndarray) -> str:
        """Encode frame to base64 JPEG"""
        try:
            # Encode frame as JPEG
            _, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
            
            # Convert to base64
            frame_base64 = base64.b64encode(buffer).decode('utf-8')
            return frame_base64
            
        except Exception as e:
            logger.error(f"Error encoding frame: {e}")
            return ""
    
    async def connect_websocket(self) -> bool:
        """Connect to WebSocket server"""
        try:
            # Build WebSocket URL with query parameters
            ws_url = f"{self.server_url}?token={self.token}&role={self.role}&user_type=sender&camera_id={self.camera_id}"
            
            logger.info(f"Connecting to {ws_url}")
            self.websocket = await websockets.connect(ws_url)
            logger.info("WebSocket connected successfully")
            return True
            
        except Exception as e:
            logger.error(f"WebSocket connection failed: {e}")
            return False
    
    async def send_frame(self, frame_data: str) -> bool:
        """Send frame data via WebSocket"""
        try:
            if self.websocket and hasattr(self.websocket, 'closed') and not self.websocket.closed:
                await self.websocket.send(frame_data)
                return True
            else:
                return False
                
        except Exception as e:
            logger.error(f"Error sending frame: {e}")
            return False
    
    async def capture_and_send(self):
        """Main capture and send loop"""
        if not self.cap:
            logger.error("Camera not initialized")
            return
            
        frame_interval = 1.0 / self.fps
        last_frame_time = 0
        
        logger.info(f"Starting capture loop at {self.fps} FPS")
        
        while self.running:
            current_time = time.time()
            
            # Control frame rate
            if current_time - last_frame_time < frame_interval:
                await asyncio.sleep(0.01)
                continue
                
            # Capture frame
            ret, frame = self.cap.read()
            if not ret:
                logger.warning("Failed to capture frame")
                await asyncio.sleep(0.1)
                continue
            
            # Process frame
            try:
                # Apply object detection
                frame = self.detect_objects(frame)
                
                # Add overlay information
                frame = self.add_overlay(frame)
                
                # Encode frame
                frame_data = self.encode_frame(frame)
                if not frame_data:
                    continue
                
                # Send frame
                success = await self.send_frame(frame_data)
                if not success:
                    # Try to reconnect (limit reconnection attempts)
                    if not hasattr(self, '_reconnect_count'):
                        self._reconnect_count = 0
                    
                    if self._reconnect_count < 3:
                        logger.info("Attempting to reconnect...")
                        self._reconnect_count += 1
                        if await self.connect_websocket():
                            logger.info("Reconnected successfully")
                            self._reconnect_count = 0  # Reset counter on success
                        else:
                            await asyncio.sleep(2)
                            continue
                    else:
                        logger.error("Max reconnection attempts reached. Stopping.")
                        self.running = False
                        break
                
                last_frame_time = current_time
                
            except Exception as e:
                logger.error(f"Error processing frame: {e}")
                await asyncio.sleep(0.1)
    
    async def start(self):
        """Start the camera sender"""
        logger.info(f"Starting Camera Sender for {self.role} - {self.camera_id}")
        
        # Initialize camera
        if not self.initialize_camera():
            logger.error("Failed to initialize camera")
            return
        
        # Initialize detection
        if not self.initialize_detection():
            logger.error("Failed to initialize detection")
            return
        
        # Connect to WebSocket
        if not await self.connect_websocket():
            logger.error("Failed to connect to WebSocket")
            return
        
        # Start capture loop
        self.running = True
        try:
            await self.capture_and_send()
        except KeyboardInterrupt:
            logger.info("Received interrupt signal")
        finally:
            await self.stop()
    
    async def stop(self):
        """Stop the camera sender"""
        logger.info("Stopping camera sender...")
        self.running = False
        
        if self.cap:
            self.cap.release()
            
        if self.websocket:
            await self.websocket.close()
        
        logger.info("Camera sender stopped")

def main():
    parser = argparse.ArgumentParser(description='Camera Sender for InnovateHack1')
    parser.add_argument('--server', default='ws://localhost:8080', 
                       help='WebSocket server URL')
    parser.add_argument('--token', default='your_secure_token_here',
                       help='Authentication token')
    parser.add_argument('--role', choices=['supervisor', 'admin'], default='supervisor',
                       help='User role')
    parser.add_argument('--camera-id', default='camera-1',
                       help='Camera identifier')
    parser.add_argument('--camera-index', type=int, default=0,
                       help='Camera device index')
    parser.add_argument('--width', type=int, default=1280,
                       help='Camera width')
    parser.add_argument('--height', type=int, default=720,
                       help='Camera height')
    parser.add_argument('--fps', type=int, default=15,
                       help='Target FPS')
    parser.add_argument('--no-detection', action='store_true',
                       help='Disable object detection')
    
    args = parser.parse_args()
    
    # Create camera sender
    sender = CameraSender(
        server_url=args.server,
        token=args.token,
        role=args.role,
        camera_id=args.camera_id,
        camera_index=args.camera_index,
        width=args.width,
        height=args.height,
        fps=args.fps,
        enable_detection=not args.no_detection
    )
    
    # Run the sender
    try:
        asyncio.run(sender.start())
    except KeyboardInterrupt:
        logger.info("Application terminated by user")
    except Exception as e:
        logger.error(f"Application error: {e}")

if __name__ == "__main__":
    main()
