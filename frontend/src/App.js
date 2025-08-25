import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import VideoPage from "./pages/VideoPage";
import Login from "./pages/Login";
import Analytics from "./pages/Analytics";
import Layout from "./components/Layout";

function App() {
  const [sos, setSos] = useState(false);

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch("http://192.168.242.7:5000/sos");
        const j = await res.json();
        setSos(!!j.sos);
      } catch {}
    };
    poll();
    const i = setInterval(poll, 2000);
    return () => clearInterval(i);
  }, []);

  return (
    <Router>
      <Layout sos={sos}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/video" element={<VideoPage />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
