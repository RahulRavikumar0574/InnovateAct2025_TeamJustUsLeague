import React, { useEffect, useMemo, useState } from "react";
import DataTable from "../components/DataTable";

export default function Analytics() {
  const [snapshot, setSnapshot] = useState({ status: "-", temperature: 0, humidity: 0, sos: false });

  useEffect(() => {
    const fetchNow = async () => {
      try {
        const [resLatest, resSos] = await Promise.all([
          fetch("http://192.168.242.7:5000/latest"),
          fetch("http://192.168.242.7:5000/sos"),
        ]);
        const latest = await resLatest.json();
        const sosObj = await resSos.json();
        setSnapshot({ ...latest, sos: !!sosObj.sos });
      } catch {}
    };
    fetchNow();
    const i = setInterval(fetchNow, 3000);
    return () => clearInterval(i);
  }, []);

  const statChip = (label, value, color) => (
    <div style={{
      padding: "10px 14px",
      borderRadius: 10,
      background: color,
      color: "#fff",
      fontWeight: 700,
      minWidth: 120,
      textAlign: "center"
    }}>
      <div style={{ fontSize: 12, opacity: 0.9 }}>{label}</div>
      <div style={{ fontSize: 18 }}>{value}</div>
    </div>
  );

  return (
    <div>
      <h1 style={{ marginBottom: 12 }}>Analytics</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
        {statChip("Status", snapshot.status?.toUpperCase?.() || "-", snapshot.status === "crash" ? "#e74c3c" : "#2ecc71")}
        {statChip("Temperature", `${snapshot.temperature}\u00B0C`, "#3498db")}
        {statChip("Humidity", `${snapshot.humidity}%`, "#9b59b6")}
        {statChip("SOS", snapshot.sos ? "ON" : "OFF", snapshot.sos ? "#e67e22" : "#27ae60")}
      </div>

      {/* Historical table (appends new rows) */}
      <DataTable />
    </div>
  );
}
