import React from "react";
import { BarChart3, FileText, Settings, Home } from "lucide-react";
import "./Navbar.css";

interface NavbarProps {
  onNavClick?: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavClick }) => {
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <BarChart3 size={24} />
          <span>SOC Tool</span>
        </div>
        <ul className="navbar-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  className="nav-button"
                  onClick={() => onNavClick?.(item.id)}
                  title={item.label}
                >
                  <Icon size={20} />
                  <span className="nav-label">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};
