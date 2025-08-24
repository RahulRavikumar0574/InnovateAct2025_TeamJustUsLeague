import React from 'react';
import Header from '../../../components/Header';

const SupervisorHealthPage = () => (
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
      <h2 className="text-2xl font-bold mb-4">Workers Health Advisories</h2>
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full border rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-gradient-to-r from-blue-100 to-green-100">
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Message</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Severity</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr className="hover:bg-blue-50 transition">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">16:20</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-700">Health</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Worker hydration levels are low. Advise water break.</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm"><span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-700">Info</span></td>
            </tr>
            <tr className="hover:bg-yellow-50 transition">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">15:55</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-yellow-600">Safety</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">High temperature detected in Zone 3. Limit exposure.</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm"><span className="inline-block px-2 py-1 rounded bg-yellow-100 text-yellow-700">Warning</span></td>
            </tr>
            <tr className="hover:bg-green-50 transition">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">15:30</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">Compliance</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">PPE compliance below 90% for Team B.</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm"><span className="inline-block px-2 py-1 rounded bg-green-100 text-green-700">Info</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </>
);

export default SupervisorHealthPage;
