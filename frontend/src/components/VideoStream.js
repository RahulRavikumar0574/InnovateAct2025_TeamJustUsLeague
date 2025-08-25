import React, { useEffect, useRef } from "react";

function VideoStream() {
  const videoRef = useRef();

  useEffect(() => {
    const ws = new WebSocket("ws://192.168.242.7:8000/ws?role=viewer");

    ws.onmessage = (event) => {
      const img = new Image();
      img.src = "data:image/jpeg;base64," + event.data;
      img.onload = () => {
        const canvas = videoRef.current;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    };

    return () => ws.close();
  }, []);

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Live Video Stream</h2>
      <canvas ref={videoRef} width={640} height={480} style={{ border: "1px solid #000" }} />
    </div>
  );
}

export default VideoStream;
