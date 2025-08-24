import React from 'react';
import Header from '../../components/Header';

const SupervisorDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 pt-20 px-6">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Health Monitoring */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Workers Health Monitoring</h2>
          <div className="flex-1 flex flex-col space-y-2">
            <div className="text-lg">Worker 1: <span className="font-bold text-blue-500">HR: 80 bpm</span>, <span className="font-bold text-orange-500">Temp: 99.1°F</span></div>
            <div className="text-lg">Worker 2: <span className="font-bold text-blue-500">HR: 76 bpm</span>, <span className="font-bold text-orange-500">Temp: 98.4°F</span></div>
            <div className="text-lg">Worker 3: <span className="font-bold text-blue-500">HR: 88 bpm</span>, <span className="font-bold text-orange-500">Temp: 100.2°F</span></div>
            <div className="text-gray-400 mt-2">[Vitals Placeholder]</div>
          </div>
        </div>
        {/* Attendance */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Attendance</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Worker</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Check-in</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Check-out</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2">Worker 1</td>
                  <td className="px-4 py-2 text-green-600 font-bold">Present</td>
                  <td className="px-4 py-2">08:01</td>
                  <td className="px-4 py-2">—</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Worker 2</td>
                  <td className="px-4 py-2 text-green-600 font-bold">Present</td>
                  <td className="px-4 py-2">08:03</td>
                  <td className="px-4 py-2">—</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Worker 3</td>
                  <td className="px-4 py-2 text-red-600 font-bold">Absent</td>
                  <td className="px-4 py-2">—</td>
                  <td className="px-4 py-2">—</td>
                </tr>
              </tbody>
            </table>
            <div className="text-gray-400 mt-2">[Attendance Table Placeholder]</div>
          </div>
        </div>
      </div>
      {/* SOS Alerts */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">SOS Alerts</h2>
        <div className="flex flex-col space-y-2">
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded">SOS from Worker 2 at 10:42 AM</div>
          <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded">SOS from Worker 3 at 09:15 AM</div>
          <div className="text-gray-400">[SOS Alerts Placeholder]</div>
        </div>
      </div>
    </div>
  );
};

export default SupervisorDashboard;

