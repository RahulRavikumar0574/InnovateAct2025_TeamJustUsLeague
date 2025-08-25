import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Layout({ children, sos = false }) {
  const location = useLocation();

  const NavLink = ({ to, label }) => (
    <Link
      to={to}
      style={{
        padding: "8px 12px",
        borderRadius: 6,
        textDecoration: "none",
        color: location.pathname === to ? "#fff" : "#eaf2f8",
        background: location.pathname === to ? "#2c3e50" : "transparent",
        fontWeight: 600,
      }}
    >
      {label}
    </Link>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f6f8fb" }}>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 20px",
          background: "#34495e",
          color: "white",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ fontWeight: 700, letterSpacing: 0.3 }}>Crash Monitor</div>
        <nav style={{ display: "flex", gap: 12 }}>
          <NavLink to="/dashboard" label="Dashboard" />
          <NavLink to="/video" label="Video" />
          <NavLink to="/analytics" label="Analytics" />
        </nav>
        <div>
          <span
            style={{
              padding: "6px 10px",
              borderRadius: 999,
              background: sos ? "#e74c3c" : "#2ecc71",
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            SOS {sos ? "ON" : "OFF"}
          </span>
        </div>
      </header>

      <main style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>{children}</main>
    </div>
  );
}
