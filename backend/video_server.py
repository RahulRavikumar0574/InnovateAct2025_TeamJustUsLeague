import os
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()
SECRET_TOKEN = os.getenv("SECRET_TOKEN", "StrongPassword123")

app = FastAPI()

# ✅ Allow CORS for frontend (React, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for testing, restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve frontend index if needed
@app.get("/")
async def get_index():
    return FileResponse("static/index.html")

# Serve static files (React build, etc.)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Active connections
senders = []
viewers = []
latest_sensor_data = {}

# ✅ ESP8266 posts sensor data here
@app.post("/data")
async def receive_sensor_data(request: Request):
    global latest_sensor_data
    body = await request.json()
    latest_sensor_data = body

    # Broadcast sensor data to all viewers
    data_msg = json.dumps({"type": "sensor", "data": latest_sensor_data})
    for viewer in viewers:
        await viewer.send_text(data_msg)

    return {"status": "ok", "received": latest_sensor_data}

# ✅ WebSocket: both sender (YOLO) & viewers (frontend)
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    role = websocket.query_params.get("role")
    token = websocket.query_params.get("token")

    # Only sender requires auth
    if role == "sender" and token != SECRET_TOKEN:
        await websocket.close(code=1008)
        return

    await websocket.accept()

    try:
        if role == "sender":
            senders.append(websocket)
            print("📹 Sender connected")
            while True:
                frame = await websocket.receive_text()
                # Forward frame to all viewers
                data_msg = json.dumps({"type": "video", "frame": frame})
                for viewer in viewers:
                    await viewer.send_text(data_msg)

        elif role == "viewer":
            viewers.append(websocket)
            print("👀 Viewer connected")

            # On connect, send last known sensor data
            if latest_sensor_data:
                await websocket.send_text(
                    json.dumps({"type": "sensor", "data": latest_sensor_data})
                )

            while True:
                # Keep connection alive
                await websocket.receive_text()

    except WebSocketDisconnect:
        print(f"❌ {role} disconnected")
    finally:
        if role == "sender" and websocket in senders:
            senders.remove(websocket)
        if role == "viewer" and websocket in viewers:
            viewers.remove(websocket)
