import React, { useState } from "react";
import { Navbar } from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState<string>("dashboard");

  return (
    <div className="App">
      <Navbar onNavClick={setCurrentPage} />
      <main className="main-content">
        {currentPage === "dashboard" && <Dashboard />}
        {currentPage === "home" && (
          <div className="page-container">
            <h1>Welcome to SOC Reporting Tool</h1>
            <p>Select a section from the navigation to get started.</p>
          </div>
        )}
        {currentPage === "reports" && (
          <div className="page-container">
            <h1>Reports</h1>
            <p>View and generate SOC compliance reports.</p>
          </div>
        )}
        {currentPage === "settings" && (
          <div className="page-container">
            <h1>Settings</h1>
            <p>Configure your SOC Reporting Tool preferences.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
