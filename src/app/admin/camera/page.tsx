'use client';
import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import { useCamera } from '../../components/hooks/useCamera';

const AdminCamera = () => {
  const { isConnected, stats, error, videoRef, canvasRef, connect, disconnect } = useCamera('supervisor', true);
  const [cameras, setCameras] = useState([
    { id: 'camera-supervisor-1', name: 'Supervisor Camera 1', status: 'online', fps: 0 },
    { id: 'camera-supervisor-2', name: 'Supervisor Camera 2', status: 'offline', fps: 0 },
  ]);
  const [selectedCamera, setSelectedCamera] = useState('camera-supervisor-1');

  useEffect(() => {
    // Auto-connect on component mount
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  const refreshConnection = () => {
    disconnect();
    setTimeout(() => connect(), 1000);
  };

  return (
    <>
    <Header
        links={[
          { href: '/admin', label: 'Analytics' },
          { href: '/admin/health', label: 'Health' },
          { href: '/admin/attendance', label: 'Attendance' },
          { href: '/admin/sos', label: 'SOS' },
          { href: '/admin/gps', label: 'GPS' },
          { href: '/admin/reports', label: 'Reports' },
        ]}
        title="Admin Portal"
      />
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🎛️ Admin Camera Dashboard
          </h1>
          <p className="text-gray-300">
            Monitor live video feeds from supervisor cameras with real-time object detection
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
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
              <div className="text-sm text-gray-400">Active Cameras</div>
              <div className="text-xl font-bold">{cameras.filter(c => c.status === 'online').length}</div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
            <div className="text-white">
              <div className="text-sm text-gray-400">Stream FPS</div>
              <div className="text-xl font-bold">{stats.fps.toFixed(1)}</div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
            <div className="text-white">
              <div className="text-sm text-gray-400">Total Viewers</div>
              <div className="text-xl font-bold">{stats.connections}</div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
            <div className="text-white">
              <div className="text-sm text-gray-400">Frames Received</div>
              <div className="text-xl font-bold">{stats.frames_sent}</div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-red-400">⚠️</span>
                <span className="text-red-300">{error}</span>
              </div>
              <button
                onClick={refreshConnection}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Retry Connection
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Video Feed */}
          <div className="xl:col-span-3">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Live Feed: {selectedCamera}</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Resolution: 1280x720</span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-400">FPS: {stats.fps.toFixed(1)}</span>
                </div>
              </div>
              
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video 
                  ref={videoRef}
                  autoPlay 
                  playsInline 
                  className="w-full h-auto object-cover"
                  style={{ aspectRatio: '16/9', minHeight: '400px' }}
                />
                <canvas 
                  ref={canvasRef}
                  className="hidden"
                />
                
                {/* Overlay for when not connected */}
                {!isConnected && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
                    <div className="text-center">
                      <div className="text-6xl mb-4">📺</div>
                      <div className="text-white text-xl">No Signal</div>
                      <div className="text-gray-400 text-sm">Waiting for supervisor camera...</div>
                    </div>
                  </div>
                )}

                {/* Live indicator */}
                {isConnected && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span>LIVE</span>
                  </div>
                )}

                {/* Object detection overlay placeholder */}
                {isConnected && (
                  <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm">
                    🎯 Object Detection: Active
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Camera List */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-semibold mb-4">Camera Sources</h3>
              <div className="space-y-2">
                {cameras.map((camera) => (
                  <div
                    key={camera.id}
                    onClick={() => setSelectedCamera(camera.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedCamera === camera.id 
                        ? 'bg-blue-600/50 border border-blue-500' 
                        : 'bg-gray-700/50 hover:bg-gray-600/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium text-sm">{camera.name}</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${
                            camera.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                          }`}></div>
                          <span className="text-xs text-gray-400">{camera.status}</span>
                        </div>
                      </div>
                      {camera.status === 'online' && (
                        <div className="text-xs text-gray-400">
                          {camera.fps.toFixed(1)} FPS
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-semibold mb-4">Controls</h3>
              <div className="space-y-3">
                <button
                  onClick={isConnected ? disconnect : connect}
                  className={`w-full font-medium py-2 px-4 rounded-lg transition-colors ${
                    isConnected 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isConnected ? '🔌 Disconnect' : '🔗 Connect'}
                </button>
                
                <button
                  onClick={refreshConnection}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  🔄 Refresh
                </button>
              </div>
            </div>

            {/* System Info */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-semibold mb-3">System Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Role:</span>
                  <span className="text-white">Admin Viewer</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Watching:</span>
                  <span className="text-white">Supervisor Feed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Quality:</span>
                  <span className="text-white">HD 720p</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Latency:</span>
                  <span className="text-white">~200ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Uptime:</span>
                  <span className="text-white">{Math.floor(stats.uptime / 1000)}s</span>
                </div>
              </div>
            </div>

            {/* Detection Stats */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-semibold mb-3">Detection Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Objects Detected:</span>
                  <span className="text-white">-</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">People Count:</span>
                  <span className="text-white">-</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Vehicles:</span>
                  <span className="text-white">-</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Confidence:</span>
                  <span className="text-white">-</span>
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

export default AdminCamera;