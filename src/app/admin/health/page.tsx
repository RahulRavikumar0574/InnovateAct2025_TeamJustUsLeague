import React from 'react';
import Header from '../../../components/Header';

const AdminHealthPage = () => (
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
    <div className="min-h-screen pt-20 px-6 bg-white">
      <h2 className="text-2xl font-bold mb-4">Workers Health Advisories</h2>
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow">
          <thead className="bg-gradient-to-r from-blue-100 to-green-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider rounded-tl-xl">Time</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Message</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider rounded-tr-xl">Severity</th>
            </tr>
          </thead>
          <tbody>
            {/* Mock advisory data for workers */}
            <tr className="hover:bg-blue-50 transition">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">16:20</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-semibold">Health</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">Worker hydration levels are low. Advise water break.</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm"><span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-700">Info</span></td>
            </tr>
            <tr className="hover:bg-yellow-50 transition">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15:55</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-semibold">Safety</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">High temperature detected in Zone 3. Limit exposure.</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm"><span className="inline-block px-2 py-1 rounded bg-yellow-100 text-yellow-700">Warning</span></td>
            </tr>
            <tr className="hover:bg-green-50 transition">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15:30</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">Compliance</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">PPE compliance below 90% for Team B.</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm"><span className="inline-block px-2 py-1 rounded bg-green-100 text-green-700">Info</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <h2 className="text-2xl font-bold mb-4">Supervisors Health Advisories</h2>
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow">
          <thead className="bg-gradient-to-r from-blue-100 to-green-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider rounded-tl-xl">Time</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Message</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider rounded-tr-xl">Severity</th>
            </tr>
          </thead>
          <tbody>
            {/* Mock advisory data for supervisors */}
            <tr className="hover:bg-blue-50 transition">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">16:10</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-semibold">Health</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">Supervisor reported mild fatigue. Recommend short break.</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm"><span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-700">Info</span></td>
            </tr>
            <tr className="hover:bg-yellow-50 transition">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15:45</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-semibold">Safety</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">Supervisor in Zone 2 has not checked in for 1 hour.</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm"><span className="inline-block px-2 py-1 rounded bg-yellow-100 text-yellow-700">Warning</span></td>
            </tr>
            <tr className="hover:bg-green-50 transition">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15:15</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">Compliance</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">Supervisor PPE compliance at 95%.</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm"><span className="inline-block px-2 py-1 rounded bg-green-100 text-green-700">Info</span></td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </>
);

export default AdminHealthPage;
