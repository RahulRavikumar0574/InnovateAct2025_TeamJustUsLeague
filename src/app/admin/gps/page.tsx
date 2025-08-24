'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import Header from '../../../components/Header';
import 'leaflet/dist/leaflet.css';

// Custom marker icons

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
const Polygon = dynamic<any>(
  () => import('react-leaflet').then(mod => mod.Polygon),
  { ssr: false }
);
const Polyline = dynamic<any>(
  () => import('react-leaflet').then(mod => mod.Polyline),
  { ssr: false }
);

import { useEffect, useState, useRef } from 'react';

const pointInPolygon = (point: [number, number], polygon: [number, number][]) => {
  // Ray casting algorithm for detecting if point is in polygon
  const x = point[1], y = point[0];
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][1], yi = polygon[i][0];
    const xj = polygon[j][1], yj = polygon[j][0];
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi + 0.0000001) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

const AdminGPSPage = () => {
  // Memoize custom icons client-side only
  const workerIcon = React.useMemo(() => {
    if (typeof window === 'undefined') return undefined;
     
    const L = require('leaflet');
    return new L.Icon({
      iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="red" d="M16 2C9.372 2 4 7.372 4 14c0 6.627 8.06 14.51 11.09 17.09a2 2 0 0 0 2.82 0C19.94 28.51 28 20.627 28 14c0-6.628-5.372-12-12-12zm0 18a6 6 0 1 1 0-12a6 6 0 0 1 0 12z"/></svg>',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
      className: 'leaflet-marker-red',
    });
  }, []);
  const supervisorIcon = React.useMemo(() => {
    if (typeof window === 'undefined') return undefined;
     
    const L = require('leaflet');
    return new L.Icon({
      iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="blue" d="M16 2C9.372 2 4 7.372 4 14c0 6.627 8.06 14.51 11.09 17.09a2 2 0 0 0 2.82 0C19.94 28.51 28 20.627 28 14c0-6.628-5.372-12-12-12zm0 18a6 6 0 1 1 0-12a6 6 0 0 1 0 12z"/></svg>',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
      className: 'leaflet-marker-blue',
    });
  }, []);

  // Initial positions
  const [workerPositions, setWorkerPositions] = useState<{ id: number; name: string; position: [number, number] }[]>([
    { id: 1, name: 'Worker A', position: [28.6139, 77.209] },
    { id: 2, name: 'Worker B', position: [28.6200, 77.210] },
    { id: 3, name: 'Worker C', position: [28.6170, 77.215] },
  ]);
  const [supervisors, setSupervisors] = useState<{ id: number; name: string; position: [number, number] }[]>([
    { id: 1, name: 'Supervisor X', position: [28.616, 77.211] },
    { id: 2, name: 'Supervisor Y', position: [28.618, 77.216] },
  ]);
  const geofence = [
    [28.612, 77.208],
    [28.622, 77.208],
    [28.622, 77.218],
    [28.612, 77.218],
  ];
  const route = [
    [28.6139, 77.209],
    [28.6145, 77.210],
    [28.6155, 77.212],
    [28.6165, 77.214],
    [28.6170, 77.215],
  ];

  // Simulate live data (move markers every 2s)
  useEffect(() => {
    const move = (pos: [number, number]): [number, number] => [pos[0] + (Math.random()-0.5)*0.0005, pos[1] + (Math.random()-0.5)*0.0005];
    const interval = setInterval(() => {
      setWorkerPositions(w => w.map(worker => ({ ...worker, position: move(worker.position as [number, number]) as [number, number] })));
      setSupervisors(s => s.map(sup => ({ ...sup, position: move(sup.position as [number, number]) as [number, number] })));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Geofence alert
  const [alert, setAlert] = useState<string | null>(null);
  useEffect(() => {
    const outWorkers = workerPositions.filter(w => !pointInPolygon(w.position as [number, number], geofence as [number, number][]));
    const outSupervisors = supervisors.filter(s => !pointInPolygon(s.position as [number, number], geofence as [number, number][]));
    if (outWorkers.length || outSupervisors.length) {
      setAlert(
        `${[...outWorkers.map(w => w.name), ...outSupervisors.map(s => s.name)].join(', ')} outside geofence!`
      );
    } else {
      setAlert(null);
    }
  }, [workerPositions, supervisors]);

  return (
    <>
      <Header
        links={[
          { href: '/admin', label: 'Analytics' },
          { href: '/admin/camera', label: 'Supervisor Camera' },
          { href: '/admin/health', label: 'Health' },
          { href: '/admin/gps', label: 'GPS' },
          { href: '/admin/sos', label: 'SOS' },
          { href: '/admin/reports', label: 'Reports' },
        ]}
        title="Admin Portal"
      />
      {alert && (
        <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4 mb-2 text-center z-10">
          <strong className="font-bold">Geofence Alert: </strong>
          <span className="block sm:inline">{alert}</span>
        </div>
      )}
      <div className="min-h-screen pt-20 px-6 bg-white">
        <h2 className="text-2xl font-bold mb-4">GPS Tracking & Geofencing</h2>
        <div className="bg-gray-100 rounded-xl shadow p-6 flex flex-col items-center">
          <div className="w-full h-96 rounded overflow-hidden mb-6" style={{ minHeight: 350 }}>
            <MapContainer center={[28.615, 77.213]} zoom={14} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {/* Worker Markers */}
              {workerPositions.map(worker => (
                <Marker key={worker.id} position={worker.position} icon={workerIcon}>
                  <Popup>{worker.name}</Popup>
                </Marker>
              ))}
              {/* Supervisor Markers */}
              {supervisors.map(sup => (
                <Marker key={`sup-${sup.id}`} position={sup.position} icon={supervisorIcon}>
                  <Popup>{sup.name}</Popup>
                </Marker>
              ))}
              {/* Geofence Polygon */}
              <Polygon positions={geofence as [number, number][]} pathOptions={{ color: 'red', fillOpacity: 0.1 }} />
              {/* Route History Polyline */}
              <Polyline positions={route as [number, number][]} pathOptions={{ color: 'blue' }} />
            </MapContainer>
          </div>
          {/* Geofence legend and route info (mock, for now) */}
          <div className="w-full flex flex-col md:flex-row gap-6">
            <div className="flex-1 bg-white rounded shadow p-4">
              <h3 className="font-semibold mb-2">Geofence Area</h3>
              <p className="text-gray-500 text-sm">Polygon: 28.612,77.208 → 28.622,77.208 → 28.622,77.218 → 28.612,77.218</p>
            </div>
            <div className="flex-1 bg-white rounded shadow p-4">
              <h3 className="font-semibold mb-2">Route History</h3>
              <ol className="text-gray-500 text-sm list-decimal ml-4">
                {route.map((pos, i) => (
                  <li key={i}>{pos[0]}, {pos[1]}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminGPSPage;
