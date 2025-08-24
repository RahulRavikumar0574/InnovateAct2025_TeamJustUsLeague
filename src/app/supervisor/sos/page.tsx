"use client";
import React, { useState } from "react";
import Header from '../../../components/Header';

const mockSOS = [
  {
    id: 1,
    time: "16:55",
    from: "Admin",
    location: "Zone 2",
    status: "Active",
    details: "Emergency in Zone 2.",
  },
  {
    id: 2,
    time: "15:30",
    from: "Admin",
    location: "Zone 3",
    status: "Acknowledged",
    details: "Manual SOS sent by Admin.",
  },
];

const SupervisorSOSPage = () => {
  const [alerts, setAlerts] = useState(mockSOS);

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

  const [showSOSForm, setShowSOSForm] = useState(false);
  const [sosLocation, setSOSLocation] = useState("");
  const [sosReason, setSOSReason] = useState("");
  const [sosConfirm, setSOSConfirm] = useState(false);

  const handleSendSOS = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    setAlerts(prev => [
      {
        id: prev.length + 1,
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        from: "Supervisor",
        location: sosLocation || "Unknown",
        status: "Active",
        details: sosReason || "No details provided.",
      },
      ...prev,
    ]);
    setSOSLocation("");
    setSOSReason("");
    setShowSOSForm(false);
    setSOSConfirm(true);
    setTimeout(() => setSOSConfirm(false), 2000);
  };

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
        <h2 className="text-2xl font-bold mb-4">SOS Alerts</h2>
        <div className="mb-4">
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition mb-2"
            onClick={() => setShowSOSForm(v => !v)}
          >
            {showSOSForm ? "Cancel" : "Send SOS"}
          </button>
          {showSOSForm && (
            <form className="bg-white border rounded p-4 mt-2 flex flex-col gap-3 max-w-md" onSubmit={handleSendSOS}>
              <label className="font-medium">Location:
                <input
                  type="text"
                  className="border rounded px-2 py-1 ml-2"
                  value={sosLocation}
                  onChange={e => setSOSLocation(e.target.value)}
                  required
                />
              </label>
              <label className="font-medium">Reason:
                <input
                  type="text"
                  className="border rounded px-2 py-1 ml-2"
                  value={sosReason}
                  onChange={e => setSOSReason(e.target.value)}
                  required
                />
              </label>
              <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Send SOS</button>
            </form>
          )}
          {sosConfirm && (
            <div className="mt-2 text-green-600 font-semibold">SOS sent!</div>
          )}
        </div>
        <div className="bg-gray-100 rounded-xl shadow p-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{alert.from}</td>
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

export default SupervisorSOSPage;
