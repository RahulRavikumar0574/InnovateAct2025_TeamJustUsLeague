'use client';
import React, { useState } from "react";
import Header from '../../../components/Header';

const mockAlerts = [
  {
    id: 1,
    time: "16:32",
    type: "SOS",
    person: "Worker A",
    location: "Zone 3",
    status: "Active",
    details: "Fall detected, no response.",
  },
  {
    id: 2,
    time: "15:50",
    type: "SOS",
    person: "Supervisor Y",
    location: "Zone 2",
    status: "Acknowledged",
    details: "Manual SOS pressed.",
  },
  {
    id: 3,
    time: "14:10",
    type: "SOS",
    person: "Worker B",
    location: "Zone 1",
    status: "Resolved",
    details: "Medical assistance provided.",
  },
];

const AdminSOSPage = () => {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [personFilter, setPersonFilter] = useState<string>('All');

  // SOS form state
  const [showSOSForm, setShowSOSForm] = useState(false);
  const [sosLocation, setSOSLocation] = useState('');
  const [sosReason, setSOSReason] = useState('');
  const [sosConfirm, setSOSConfirm] = useState(false);
  const supervisors = ['Supervisor X', 'Supervisor Y', 'Supervisor Z'];
  const [selectedSupervisor, setSelectedSupervisor] = useState(supervisors[0]);


  const uniquePersons = Array.from(new Set(alerts.map(a => a.person)));

  const filteredAlerts = alerts.filter(alert =>
    (statusFilter === 'All' || alert.status === statusFilter) &&
    (personFilter === 'All' || alert.person === personFilter)
  );

  const acknowledgeAlert = (id: number) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id && alert.status === "Active"
          ? { ...alert, status: "Acknowledged" }
          : alert
      )
    );
  };

  const resolveAlert = (id: number) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id && alert.status !== "Resolved"
          ? { ...alert, status: "Resolved" }
          : alert
      )
    );
    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, 2000);
  };

  return (
    <>
      <Header
        links={[
          { href: "/admin", label: "Analytics" },
          { href: "/admin/camera", label: "Supervisor Camera" },
          { href: "/admin/health", label: "Health" },
          { href: "/admin/gps", label: "GPS" },
          { href: "/admin/sos", label: "SOS" },
          { href: "/admin/reports", label: "Reports" },
        ]}
        title="Admin Portal"
      />
      <div className="min-h-screen pt-20 px-6 bg-white">
        <h2 className="text-2xl font-bold mb-4">SOS Alerts & History</h2>
        <button
          className="mb-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition font-semibold"
          onClick={() => setShowSOSForm(true)}
        >
          Send SOS to Supervisor
        </button>
        {showSOSForm && (
          <div className="mb-4 bg-white border border-red-300 rounded-lg p-4 shadow flex flex-col gap-2 max-w-md">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-red-700">Send SOS to Supervisor</span>
              <button className="text-gray-400 hover:text-gray-600 text-xl" onClick={() => setShowSOSForm(false)}>&times;</button>
            </div>
            <label className="text-sm font-medium">Supervisor
              <select
                className="block w-full mt-1 rounded border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                value={selectedSupervisor}
                onChange={e => setSelectedSupervisor(e.target.value)}
              >
                {supervisors.map(sup => (
                  <option key={sup} value={sup}>{sup}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium">Location
              <input
                className="block w-full mt-1 rounded border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                value={sosLocation}
                onChange={e => setSOSLocation(e.target.value)}
                placeholder="e.g. Zone 1"
              />
            </label>
            <label className="text-sm font-medium">Reason
              <input
                className="block w-full mt-1 rounded border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                value={sosReason}
                onChange={e => setSOSReason(e.target.value)}
                placeholder="e.g. Emergency, Manual Trigger"
              />
            </label>
            <button
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-semibold"
              onClick={() => {
                setAlerts(prev => [
                  {
                    id: prev.length + 1,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    type: 'SOS',
                    person: selectedSupervisor,
                    location: sosLocation || 'Unknown',
                    status: 'Active',
                    details: sosReason || 'Manual SOS',
                  },
                  ...prev,
                ]);
                setShowSOSForm(false);
                setSOSLocation('');
                setSOSReason('');
                setSOSConfirm(true);
                setTimeout(() => setSOSConfirm(false), 2500);
              }}
            >
              Send SOS
            </button>
          </div>
        )}
        {sosConfirm && (
          <div className="mb-4 text-green-700 bg-green-100 border border-green-300 rounded px-4 py-2 font-medium">
            SOS sent to Supervisor!
          </div>
        )}
        <div className="flex flex-wrap gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="block w-36 rounded border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Acknowledged">Acknowledged</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Person</label>
            <select
              className="block w-36 rounded border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
              value={personFilter}
              onChange={e => setPersonFilter(e.target.value)}
            >
              <option value="All">All</option>
              {uniquePersons.map(person => (
                <option key={person} value={person}>{person}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="bg-gray-100 rounded-xl shadow p-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Person</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {alerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alert.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">{alert.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{alert.person}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{alert.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{alert.details}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {alert.status === "Active" && (
                      <span className="inline-block px-2 py-1 rounded bg-red-100 text-red-700">Active</span>
                    )}
                    {alert.status === "Acknowledged" && (
                      <span className="inline-block px-2 py-1 rounded bg-yellow-100 text-yellow-700">Acknowledged</span>
                    )}
                    {alert.status === "Resolved" && (
                      <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-700">Resolved</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                    {alert.status === "Active" && (
                      <button
                        className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        Acknowledge
                      </button>
                    )}
                    {alert.status !== "Resolved" && (
                      <button
                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                        onClick={() => resolveAlert(alert.id)}
                      >
                        Resolve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminSOSPage;
