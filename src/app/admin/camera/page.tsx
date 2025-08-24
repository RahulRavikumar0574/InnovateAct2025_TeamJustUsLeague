'use client';
import React, { useEffect, useRef } from 'react';
import Peer from 'peerjs';

const SUPERVISOR_ID = 'supervisor-1';

const AdminCamera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const peer = new Peer(undefined, {
      host: 'peerjs.com',
      secure: true,
      port: 443,
    });

    peer.on('open', () => {
      const call = peer.call(SUPERVISOR_ID, undefined);
      call.on('stream', (remoteStream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = remoteStream;
          videoRef.current.play();
        }
      });
    });

    return () => {
      peer.destroy();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <h1 className="text-2xl font-bold text-white mb-4">Viewing Supervisor Camera</h1>
      <video ref={videoRef} autoPlay playsInline className="rounded shadow bg-black" width={480} height={360} />
    </div>
  );
};

export default AdminCamera;