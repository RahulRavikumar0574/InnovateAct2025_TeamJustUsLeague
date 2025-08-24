import React from 'react';
import Header from '../../../components/Header';

const SupervisorAttendancePage = () => (
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
      <h2 className="text-2xl font-bold mb-4">Attendance</h2>
      <div className="bg-gray-100 rounded-xl shadow p-6 text-gray-400">
        <table className="table-auto w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Worker Name</th>
              <th className="px-4 py-2">Attendance Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'John Doe', status: 'Present' },
              { name: 'Jane Doe', status: 'Absent' },
              { name: 'Bob Smith', status: 'Late' },
              { name: 'Alice Johnson', status: 'Present' },
              { name: 'Mike Brown', status: 'Absent' },
            ].map((worker, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="px-4 py-2">{worker.name}</td>
                <td className="px-4 py-2">
                  <span
                    className={`${
                      worker.status === 'Present'
                        ? 'bg-green-200'
                        : worker.status === 'Absent'
                        ? 'bg-red-200'
                        : 'bg-yellow-200'
                    } text-gray-600 py-1 px-2 rounded`}
                  >
                    {worker.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </>
);

export default SupervisorAttendancePage;
