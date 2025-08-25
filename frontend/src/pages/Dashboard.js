import React, { useEffect, useState } from "react";
import DataBox from "../components/DataBox";
import SOSStatus from "../components/SOSStatus";
import DataTable from "../components/DataTable";
import CrashAlert from "../components/CrashAlert";

export default function Dashboard() {
  const [sensorData, setSensorData] = useState({});
  const [sos, setSos] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [sensorRes, sosRes] = await Promise.all([
          fetch("http://192.168.242.7:5000/latest"),
          fetch("http://192.168.242.7:5000/sos")
        ]);
        const sensorJson = await sensorRes.json();
        const sosJson = await sosRes.json();
        setSensorData(sensorJson);
        setSos(sosJson.sos);
      } catch (e) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
    const interval = setInterval(fetchAll, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Crash Monitoring Dashboard</h1>
      {sensorData?.status === "crash" && (
        <div style={{ margin: "10px 0" }}>
          <CrashAlert />
        </div>
      )}

      {/* Video Button */}
      <a
        href="/video"
        style={{
          padding: "10px 20px",
          display: "inline-block",
          marginBottom: "20px",
          borderRadius: "5px",
          backgroundColor: "#3498db",
          color: "white",
          textDecoration: "none",
          cursor: "pointer"
        }}
      >
        Show Live Video
      </a>

      {/* SOS Controls */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={async () => {
            try {
              await fetch("http://192.168.242.7:5000/sos/activate", { method: "POST" });
              setSos(true);
            } catch {}
          }}
          style={{
            padding: "8px 16px",
            marginRight: 8,
            borderRadius: 6,
            background: "#e74c3c",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Activate SOS
        </button>
        <button
          onClick={async () => {
            try {
              await fetch("http://192.168.242.7:5000/sos/deactivate", { method: "POST" });
              setSos(false);
            } catch {}
          }}
          style={{
            padding: "8px 16px",
            borderRadius: 6,
            background: "#2ecc71",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Deactivate SOS
        </button>
      </div>

      {/* Sensor Data */}
      <DataBox data={{ ...sensorData, sos }} />
      <SOSStatus sos={sos} />

      {/* Table of Latest Data */}
      <DataTable />
    </div>
  );
}
