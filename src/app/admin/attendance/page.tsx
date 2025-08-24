"use client";
import React, { useState } from "react";
import Header from '../../../components/Header';

const mockSupervisors = [
  { id: 1, name: "Supervisor X", status: "Present", checkIn: "08:40" },
  { id: 2, name: "Supervisor Y", status: "Late", checkIn: "09:15" },
  { id: 3, name: "Supervisor Z", status: "Absent", checkIn: null },
];

const mockWorkersBySupervisor = {
  1: [
    { name: "Worker 1", status: "Present", checkIn: "08:55" },
    { name: "Worker 2", status: "Late", checkIn: "09:20" },
    { name: "Worker 3", status: "Absent", checkIn: null },
  ],
  2: [
    { name: "Worker 4", status: "Present", checkIn: "08:50" },
    { name: "Worker 5", status: "Present", checkIn: "08:59" },
  ],
  3: [
    { name: "Worker 6", status: "Absent", checkIn: null },
    { name: "Worker 7", status: "Late", checkIn: "09:35" },
  ],
};

const statusBadge = (status: string) => {
  if (status === "Present")
    return <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-700">Present</span>;
  if (status === "Absent")
    return <span className="inline-block px-2 py-1 rounded bg-red-100 text-red-700">Absent</span>;
  return <span className="inline-block px-2 py-1 rounded bg-yellow-100 text-yellow-700">Late</span>;
};

const AdminAttendancePage = () => {
  const [selectedSupervisor, setSelectedSupervisor] = useState<number | null>(null);

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
      <div className="min-h-screen pt-20 px-6 bg-white">
        <h2 className="text-2xl font-bold mb-4">Supervisors Attendance Tracker</h2>
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full border rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-blue-100 to-green-100">
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Supervisor</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Check-in Time</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">View Workers</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockSupervisors.map((sup) => (
                <tr key={sup.id} className="hover:bg-blue-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{sup.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{statusBadge(sup.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sup.checkIn || <span className="text-gray-400 italic">--</span>}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => setSelectedSupervisor(sup.id)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selectedSupervisor && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-2">Workers under {mockSupervisors.find(s => s.id === selectedSupervisor)?.name}</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-100 to-green-100">
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Worker</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Check-in Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockWorkersBySupervisor[selectedSupervisor].map((worker, idx) => (
                    <tr key={idx} className="hover:bg-blue-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{worker.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{statusBadge(worker.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{worker.checkIn || <span className="text-gray-400 italic">--</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => setSelectedSupervisor(null)}
            >
              Back to Supervisors
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminAttendancePage;
