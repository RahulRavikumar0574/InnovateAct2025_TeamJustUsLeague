'use client';
import React from 'react';
import Header from '../../components/Header';
// Chart.js and react-leaflet imports
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';
Chart.register(CategoryScale);
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
const MapContainer = dynamic<any>(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic<any>(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic<any>(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic<any>(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 pt-20 px-6">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Safety KPIs */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between">
          <h2 className="text-lg font-semibold mb-2">Incident Frequency</h2>
          <Line data={{
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              label: 'Incidents',
              data: [2, 4, 3, 5, 6, 4],
              backgroundColor: 'rgba(255,99,132,0.2)',
              borderColor: 'rgba(255,99,132,1)',
              borderWidth: 2,
            }],
          }} />
          <div className="text-sm text-gray-500">This month</div>
          {/* TODO: Replace with real incidents data */}
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between">
          <h2 className="text-lg font-semibold mb-2">Avg Worker Vitals</h2>
          <Line data={{
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            datasets: [{
              label: 'HR',
              data: [80, 82, 78, 85, 88],
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 2,
            }],
          }} />
          <div className="text-sm text-gray-500">Last 24h</div>
          {/* TODO: Replace with real vitals data */}
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between">
          <h2 className="text-lg font-semibold mb-2">Time in Unsafe Zones</h2>
          <Line data={{
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              label: 'Time',
              data: [2, 4, 3, 5, 6, 4],
              backgroundColor: 'rgba(255, 206, 86, 0.2)',
              borderColor: 'rgba(255, 206, 86, 1)',
              borderWidth: 2,
            }],
          }} />
          <div className="text-sm text-gray-500">This week</div>
          {/* TODO: Replace with real unsafe zone data */}
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between">
          <h2 className="text-lg font-semibold mb-2">Compliance Score</h2>
          <Line data={{
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              label: 'Score',
              data: [90, 92, 95, 98, 99, 100],
              backgroundColor: 'rgba(40, 167, 69, 0.2)',
              borderColor: 'rgba(40, 167, 69, 1)',
              borderWidth: 2,
            }],
          }} />
          <div className="text-sm text-gray-500">Current</div>
          {/* TODO: Replace with real compliance data */}
        </div>
      </div>

      {/* Supervisor Camera, Health, GPS, SOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Supervisor Camera Feed</h2>
          <div className="flex-1 flex items-center justify-center bg-gray-100 rounded h-52 text-gray-400">[Live Camera Placeholder]</div>
          <button className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded font-semibold">View Live</button>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Supervisor Health Monitoring</h2>
          <div className="flex-1 flex flex-col justify-center items-center space-y-2">
            <div className="text-2xl">HR: <span className="font-bold text-blue-500">78 bpm</span></div>
            <div className="text-2xl">Temp: <span className="font-bold text-orange-500">98.6°F</span></div>
            <div className="text-2xl">SpO₂: <span className="font-bold text-green-500">97%</span></div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Supervisor GPS Location</h2>
          <div className="flex-1 flex items-center justify-center bg-gray-100 rounded h-52 text-gray-400">
          {/* Live Map with Workers & Supervisors */}
          <MapContainer center={[28.6139, 77.209]} zoom={13} style={{ height: '180px', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[28.6139, 77.209]}>
              <Popup>Supervisor 1</Popup>
            </Marker>
            <Marker position={[28.6200, 77.210]}>
              <Popup>Worker A</Popup>
            </Marker>
            {/* TODO: Add more markers for real data */}
          </MapContainer>
        </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
          <h2 className="text-xl font-semibold mb-4">SOS Controls</h2>
          <div className="flex-1 flex flex-col items-center justify-center">
            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-bold text-lg mb-4">Send SOS</button>
            <div className="text-gray-500">Detect and send emergency alerts to supervisor</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Compliance Reports */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Compliance Reports</h2>
          <div className="h-40 bg-gray-50 rounded flex items-center justify-center text-gray-400">
          {/* Attendance Rate Chart */}
          <Line data={{
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            datasets: [{
              label: 'Attendance %',
              data: [95, 97, 93, 96, 98],
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 2,
            }],
          }} />
        </div>
        </div>
        {/* Predictive Analytics */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Predictive Analytics</h2>
          <div className="h-40 bg-gray-50 rounded flex items-center justify-center text-gray-400">
          {/* Incidents Over Time Chart */}
          <Line data={{
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              label: 'Incidents',
              data: [2, 4, 3, 5, 6, 4],
              backgroundColor: 'rgba(255,99,132,0.2)',
              borderColor: 'rgba(255,99,132,1)',
              borderWidth: 2,
            }],
          }} />
        </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Exportable Reports</h2>
        <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded font-semibold">Export CSV</button>
      </div>
    </div>
  );
};

export default AdminDashboard;

