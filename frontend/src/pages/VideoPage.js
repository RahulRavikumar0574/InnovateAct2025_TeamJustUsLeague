import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VideoPage() {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const [status, setStatus] = useState("Connecting to video server...");
  const [hasFrame, setHasFrame] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ws;
    let pingTimer;
    try {
      ws = new WebSocket("ws://192.168.242.7:8000/ws?role=viewer");
    } catch (e) {
      setError("Failed to create WebSocket: " + e.message);
      setStatus("Connection error");
      return;
    }
    ws.onopen = () => {
      setStatus("Connected to video server");
      // Keep-alive ping to satisfy server's receive loop
      pingTimer = setInterval(() => {
        try { ws.send("ping"); } catch {}
      }, 5000);
    };
    ws.onmessage = (event) => {
      // Server sends JSON: {type: 'video'|'sensor', ...}
      let msg;
      try {
        msg = JSON.parse(event.data);
      } catch {
        // Fallback: raw base64 frame (older sender)
        const img = new Image();
        img.src = "data:image/jpeg;base64," + event.data;
        img.onload = () => {
          const canvas = videoRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        setHasFrame(true);
        setStatus("Receiving video frames");
        return;
      }

      if (msg.type === "video" && msg.frame) {
        const img = new Image();
        img.src = "data:image/jpeg;base64," + msg.frame;
        img.onload = () => {
          const canvas = videoRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        setHasFrame(true);
        setStatus("Receiving video frames");
      } else if (msg.type === "sensor") {
        // Optionally could display sensor overlay later
      }
    };
    ws.onerror = (e) => {
      setError("WebSocket error: " + (e.message || "Unknown error"));
      setStatus("WebSocket error");
    };
    ws.onclose = () => {
      setStatus("Video connection closed");
    };
    return () => {
      if (pingTimer) clearInterval(pingTimer);
      if (ws) ws.close();
    };
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>🚗 Live Crash Dashboard Video Stream</h1>
      <canvas
        ref={videoRef}
        width={640}
        height={480}
        style={{ border: "1px solid #333", marginTop: "20px" }}
      ></canvas>
      <div style={{ marginTop: 16, color: error ? "red" : "#555" }}>
        {error ? error : status}
        {!hasFrame && !error && status === "Connected to video server" && (
          <span> | Waiting for video frames...</span>
        )}
      </div>
      <br />
      <button
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          borderRadius: "5px",
          backgroundColor: "#3498db",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
        onClick={() => navigate(-1)}
      >
        🔙 Back to Dashboard
      </button>
    </div>
  );
}

