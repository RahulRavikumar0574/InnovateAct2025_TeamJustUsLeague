"use client";
import React, { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';

const SUPERVISOR_ID = 'supervisor-1'; // Use a unique ID per supervisor

const SupervisorCamera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [peer, setPeer] = useState<Peer | null>(null);

  useEffect(() => {
    const p = new Peer(SUPERVISOR_ID, {
      host: 'peerjs.com', // Use public PeerJS server for demo, or your own
      secure: true,
      port: 443,
    });
    setPeer(p);

    let localStream: MediaStream;

    p.on('open', () => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then((stream) => {
        localStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        // Answer incoming calls with our stream
        p.on('call', (call) => {
          call.answer(stream);
        });
      });
    });

    return () => {
      if (peer) peer.destroy();
      if (localStream) localStream.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <h1 className="text-2xl font-bold text-white mb-4">Supervisor Camera Streaming</h1>
      <video ref={videoRef} autoPlay playsInline className="rounded shadow bg-black" width={480} height={360} />
    </div>
  );
};

export default SupervisorCamera;
