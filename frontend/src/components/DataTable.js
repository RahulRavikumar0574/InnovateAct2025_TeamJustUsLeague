import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

export default function DataTable() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resLatest, resSos] = await Promise.all([
          fetch("http://192.168.242.7:5000/latest"),
          fetch("http://192.168.242.7:5000/sos"),
        ]);
        const latest = await resLatest.json();
        const sosObj = await resSos.json();
        setRows((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            timestamp: new Date().toLocaleTimeString(),
            ...latest,
            sos: !!sosObj.sos,
          },
        ]);
      } catch (e) {
        // noop
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "timestamp", headerName: "Time", width: 150 },
    { field: "status", headerName: "Status", width: 120 },
    { field: "temperature", headerName: "Temp (°C)", width: 120 },
    { field: "humidity", headerName: "Humidity (%)", width: 120 },
    { field: "sos", headerName: "SOS", width: 100, valueFormatter: (v) => (v?.value ? "ON" : "OFF") },
  ];

  return (
    <div style={{ height: 400, width: "100%", marginTop: "20px" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
      />
    </div>
  );
}
