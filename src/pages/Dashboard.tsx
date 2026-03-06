import React from "react";
import { Activity, AlertCircle, TrendingUp, Users } from "lucide-react";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Overview of your SOC compliance and metrics</p>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon active">
            <Activity size={24} />
          </div>
          <div className="metric-content">
            <h3>Systems Active</h3>
            <p className="metric-value">12</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon warning">
            <AlertCircle size={24} />
          </div>
          <div className="metric-content">
            <h3>Alerts</h3>
            <p className="metric-value">3</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon success">
            <TrendingUp size={24} />
          </div>
          <div className="metric-content">
            <h3>Compliance</h3>
            <p className="metric-value">94%</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <Users size={24} />
          </div>
          <div className="metric-content">
            <h3>Users</h3>
            <p className="metric-value">48</p>
          </div>
        </div>
      </div>

      <div className="content-section">
        <h2>Recent Activity</h2>
        <div className="activity-placeholder">
          <p>Charts and detailed sensor data will appear here soon.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
