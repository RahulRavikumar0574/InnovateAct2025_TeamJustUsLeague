"use client";
import React from 'react';
import Header from '../../../components/Header';

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic<any>(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic<any>(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic<any>(
  () => import('react-leaflet').then(mod => mod.Marker),
  { ssr: false }
);
const Popup = dynamic<any>(
  () => import('react-leaflet').then(mod => mod.Popup),
  { ssr: false }
);

const SupervisorGPSPage = () => {
  // Mock worker positions
  const workerPositions = [
    { id: 1, name: 'Worker 1', position: [12.9716, 77.5946] },
    { id: 2, name: 'Worker 2', position: [12.9721, 77.5950] },
    { id: 3, name: 'Worker 3', position: [12.9709, 77.5932] },
  ];

  // Live location state
  const [liveLocation, setLiveLocation] = React.useState<[number, number] | null>(null);

  React.useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setLiveLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      undefined,
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Memoize blue pointer icon (same as admin)
  const workerIcon = React.useMemo(() => {
    if (typeof window === 'undefined') return undefined;
     
    const L = require('leaflet');
    return new L.Icon({
      iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="%23007bff" d="M16 2C9.372 2 4 7.372 4 14c0 6.627 8.06 14.51 11.09 17.09a2 2 0 0 0 2.82 0C19.94 28.51 28 20.627 28 14c0-6.628-5.372-12-12-12zm0 18a6 6 0 1 1 0-12a6 6 0 0 1 0 12z"/></svg>',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  }, []);

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
      <div className="min-h-screen pt-20 px-6 bg-white">
        <h2 className="text-2xl font-bold mb-4">Workers GPS Locations</h2>
        <div className="w-full h-96 rounded overflow-hidden mb-6" style={{ minHeight: 350 }}>
          <MapContainer center={liveLocation || [12.9716, 77.5946]} zoom={15} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {/* Worker Markers Only */}
            {workerPositions.map(worker => (
              <Marker key={worker.id} position={worker.position} icon={workerIcon}>
                <Popup>{worker.name}</Popup>
              </Marker>
            ))}
            {/* Live location marker for current device */}
            {liveLocation && (
              <Marker position={liveLocation}>
                <Popup>Your Location</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
        <div className="bg-gray-100 rounded-xl shadow p-6 flex flex-col items-center">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Worker</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latitude</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Longitude</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {workerPositions.map((w) => (
                <tr key={w.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{w.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{w.position[0]}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{w.position[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default SupervisorGPSPage;
