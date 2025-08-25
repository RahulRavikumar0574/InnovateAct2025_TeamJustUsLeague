import React from "react";

function SOSStatus({ sos }) {
  return (
    <div style={{ 
      border: "1px solid #ccc", 
      borderRadius: "8px", 
      padding: "15px", 
      margin: "10px", 
      display: "inline-block" 
    }}>
      <h2>SOS Status</h2>
      <p>{sos ? "🚨 SOS Active" : "✅ Normal"}</p>
    </div>
  );
}

export default SOSStatus;
