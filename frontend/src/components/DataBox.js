import React from "react";

function DataBox({ data }) {
  return (
    <div style={{ 
      border: "1px solid #ccc", 
      borderRadius: "8px", 
      padding: "15px", 
      margin: "10px", 
      display: "inline-block" 
    }}>
      <h2>Latest Sensor Data</h2>
      <pre>{data && Object.keys(data).length ? JSON.stringify(data, null, 2) : "Waiting for ESP32..."}</pre>
    </div>
  );
}

export default DataBox;
