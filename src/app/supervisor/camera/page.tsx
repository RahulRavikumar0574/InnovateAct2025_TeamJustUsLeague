"use client";
import React, { useEffect, useState } from 'react';
import { useCamera } from '../../components/hooks/useCamera';
import Header from '../../../components/Header';

const SupervisorCamera = () => {
  const { isConnected, stats, error, videoRef, canvasRef, connect, disconnect, startCamera } = useCamera('supervisor', false);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleStartStreaming = async () => {
    if (!isConnected) {
      connect();
    }
    await startCamera();
    setIsStreaming(true);
  };

  const handleStopStreaming = () => {
    disconnect();
    setIsStreaming(false);
  };

  // Automatically start camera streaming after connection
  useEffect(() => {
    if (isConnected && !isStreaming) {
      startCamera();
      setIsStreaming(true);
    }
  }, [isConnected, isStreaming, startCamera]);

  return (
    <>
    <Header
      links={[
        { href: '/supervisor', label: 'Analytics' },
        { href: '/supervisor/health', label: 'Health' },
        { href: '/supervisor/attendance', label: 'Attendance' },
        { href: '/supervisor/sos', label: 'SOS' },
        { href: '/supervisor/gps', label: 'GPS' },
      ]}
      title="Supervisor Portal"
    />
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            📹 Supervisor Camera Control
          </h1>
          <p className="text-gray-300">
            Stream live video with object detection to the admin dashboard
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-white font-medium">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
            <div className="text-white">
              <div className="text-sm text-gray-400">FPS</div>
              <div className="text-xl font-bold">{stats.fps.toFixed(1)}</div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
            <div className="text-white">
              <div className="text-sm text-gray-400">Viewers</div>
              <div className="text-xl font-bold">{stats.connections}</div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
            <div className="text-white">
              <div className="text-sm text-gray-400">Frames Sent</div>
              <div className="text-xl font-bold">{stats.frames_sent}</div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-red-400">⚠️</span>
              <span className="text-red-300">{error}</span>
            </div>
          </div>
        )}

        {/* Video Feed */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Video Display */}
            <div className="flex-1">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video 
                  ref={videoRef}
                  autoPlay 
                  playsInline 
                  muted
                  className="w-full h-auto max-h-96 object-cover"
                  style={{ aspectRatio: '16/9' }}
                />
                <canvas 
                  ref={canvasRef}
                  className="hidden"
                />
                
                {/* Overlay for when not streaming */}
                {!isStreaming && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
                    <div className="text-center">
                      <div className="text-6xl mb-4">📹</div>
                      <div className="text-white text-lg">Camera Ready</div>
                      <div className="text-gray-400 text-sm">Click "Start Streaming" to begin</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="lg:w-80 space-y-4">
              <div className="bg-gray-900/50 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-4">Stream Controls</h3>
                
                <div className="space-y-3">
                  {!isStreaming ? (
                    <button
                      onClick={handleStartStreaming}
                      disabled={!isConnected}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
                    >
                      {isConnected ? '▶️ Start Streaming' : '⏳ Connecting...'}
                    </button>
                  ) : (
                    <button
                      onClick={handleStopStreaming}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                    >
                      ⏹️ Stop Streaming
                    </button>
                  )}
                  
                  <button
                    onClick={isConnected ? disconnect : connect}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    {isConnected ? '🔌 Disconnect' : '🔗 Connect'}
                  </button>
                </div>
              </div>

              {/* Stream Info */}
              <div className="bg-gray-900/50 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">Stream Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Role:</span>
                    <span className="text-white">Supervisor</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Camera ID:</span>
                    <span className="text-white">camera-supervisor-1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Resolution:</span>
                    <span className="text-white">1280x720</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Target FPS:</span>
                    <span className="text-white">15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Uptime:</span>
                    <span className="text-white">{Math.floor(stats.uptime / 1000)}s</span>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-gray-900/50 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">Instructions</h3>
                <div className="text-sm text-gray-300 space-y-2">
                  <p>1. Click "Start Streaming" to begin broadcasting</p>
                  <p>2. Your video will be sent to admin viewers</p>
                  <p>3. Object detection runs automatically</p>
                  <p>4. Monitor connection status above</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default SupervisorCamera;
