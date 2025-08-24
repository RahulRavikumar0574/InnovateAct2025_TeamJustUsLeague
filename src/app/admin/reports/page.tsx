"use client";
import React, { useState } from "react";
import Header from '../../../components/Header';

// Mock data for reports
const mockReports = [
  {
    id: 1,
    type: "SOS",
    person: "Supervisor Y",
    location: "Zone 2",
    time: "2025-08-24 16:32",
    details: "Manual SOS pressed.",
  },
  {
    id: 2,
    type: "Health",
    person: "Worker A",
    location: "Zone 3",
    time: "2025-08-24 15:50",
    details: "Elevated heart rate alert.",
  },
  {
    id: 3,
    type: "Geofence",
    person: "Worker B",
    location: "Zone 1",
    time: "2025-08-24 14:10",
    details: "Exited geofence.",
  },
];

const reportTypes = ["All", "SOS", "Health", "Geofence"];

const AdminReportsPage = () => {
  const [typeFilter, setTypeFilter] = useState("All");
  const [personFilter, setPersonFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const uniquePersons = ["All", ...Array.from(new Set(mockReports.map(r => r.person)))];

  // Parse date string to Date object, fallback to null
  const parseDate = (str: string) => {
    if (!str) return null;
    // Accepts yyyy-mm-dd or yyyy-mm-dd HH:mm
    const [datePart, timePart] = str.split(" ");
    if (!datePart) return null;
    if (timePart) {
      return new Date(datePart + "T" + timePart);
    } else {
      return new Date(datePart);
    }
  };

  const filteredReports = mockReports.filter(report => {
    const reportDate = parseDate(report.time);
    const afterStart = !startDate || (reportDate && reportDate >= new Date(startDate));
    const beforeEnd = !endDate || (reportDate && reportDate <= new Date(endDate + 'T23:59:59'));
    return (
      (typeFilter === "All" || report.type === typeFilter) &&
      (personFilter === "All" || report.person === personFilter) &&
      afterStart && beforeEnd
    );
  });

  // Download CSV
  const downloadCSV = () => {
    const rows = [
      ["Type", "Person", "Location", "Time", "Details"],
      ...filteredReports.map(r => [r.type, r.person, r.location, r.time, r.details]),
    ];
    const csvContent = rows.map(e => e.map(x => `"${x}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `admin_reports_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
        <h2 className="text-2xl font-bold mb-4">Reports</h2>
        <div className="flex flex-wrap gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              className="block w-36 rounded border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
            >
              {reportTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Person</label>
            <select
              className="block w-36 rounded border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
              value={personFilter}
              onChange={e => setPersonFilter(e.target.value)}
            >
              {uniquePersons.map(person => (
                <option key={person} value={person}>{person}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              className="block w-36 rounded border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              className="block w-36 rounded border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
          <button
            className="self-end px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold"
            onClick={downloadCSV}
          >
            Download CSV
          </button>
        </div>
        <div className="bg-gray-100 rounded-xl shadow p-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Person</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">No reports found.</td>
                </tr>
              ) : (
                filteredReports.map(report => (
                  <tr key={report.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">{report.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{report.person}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{report.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{report.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{report.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminReportsPage;
