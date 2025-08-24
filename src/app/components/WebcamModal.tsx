'use client';
import React, { useRef, useState } from 'react';

const WebcamModal = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openWebcam = async () => {
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setIsOpen(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
      }, 100); // Ensure ref is set after modal opens
    } catch (err) {
      setError('Could not access webcam. Please allow camera access and try again.');
      setIsOpen(true);
    }
  };

  const closeWebcam = () => {
    setIsOpen(false);
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  return (
    <div>
      <button
        onClick={openWebcam}
        className="px-4 py-2 bg-cyan-600 text-white rounded shadow"
      >
        Open Webcam
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg relative min-w-[350px] min-h-[250px] flex flex-col items-center justify-center">
            <button
              onClick={closeWebcam}
              className="absolute top-2 right-2 text-black hover:text-red-600"
            >
              ✕
            </button>
            {error ? (
              <div className="text-red-600 text-center mt-8">{error}</div>
            ) : (
              <video
                ref={videoRef}
                width="480"
                height="360"
                autoPlay
                playsInline
                className="rounded"
                style={{ background: '#222' }}
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WebcamModal;
