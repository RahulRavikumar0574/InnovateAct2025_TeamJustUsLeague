import cv2
import base64
import asyncio
import websockets
import argparse
from ultralytics import YOLO

parser = argparse.ArgumentParser()
parser.add_argument("--server", type=str, required=True, help="WebSocket server URL, e.g. ws://localhost:8000/ws")
parser.add_argument("--token", type=str, required=True, help="Auth token (must match .env)")
args = parser.parse_args()

model = YOLO("yolov8n.pt")  # Replace with custom model if trained
cap = cv2.VideoCapture(0)

async def send_video():
    async with websockets.connect(f"{args.server}?role=sender&token={args.token}") as ws:
        while True:
            ret, frame = cap.read()
            if not ret:
                continue

            # Run YOLO detection
            results = model(frame, imgsz=640, conf=0.25)
            annotated = results[0].plot()

            # Encode frame to JPEG -> base64
            _, buffer = cv2.imencode(".jpg", annotated)
            jpg_as_text = base64.b64encode(buffer).decode("utf-8")

            await ws.send(jpg_as_text)

asyncio.run(send_video())
