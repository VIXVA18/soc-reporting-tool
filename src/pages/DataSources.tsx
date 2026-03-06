import React, { useState } from "react";
import { Plus, Database, Cloud, HardDrive, Trash2 } from "lucide-react";
import "./DataSources.css";

interface DataSource {
  id: string;
  name: string;
  type: "database" | "cloud" | "file";
  connection: string;
  lastSync: string;
  status: "active" | "inactive";
}

const DataSources: React.FC = () => {
  const [sources, setSources] = useState<DataSource[]>([
    {
      id: "1",
      name: "Main Database",
      type: "database",
      connection: "postgresql://localhost:5432",
      lastSync: "2 hours ago",
      status: "active",
    },
    {
      id: "2",
      name: "Cloud Storage",
      type: "cloud",
      connection: "s3://bucket-name",
      lastSync: "1 hour ago",
      status: "active",
    },
    {
      id: "3",
      name: "Local File System",
      type: "file",
      connection: "/data/reports",
      lastSync: "30 minutes ago",
      status: "active",
    },
  ]);

  const getIcon = (type: DataSource["type"]) => {
    switch (type) {
      case "database":
        return <Database size={20} />;
      case "cloud":
        return <Cloud size={20} />;
      case "file":
        return <HardDrive size={20} />;
    }
  };

  const removeSource = (id: string) => {
    setSources(sources.filter((s) => s.id !== id));
  };

  return (
    <div className="data-sources-container">
      <div className="ds-header">
        <h1>Data Sources</h1>
        <p>Configure and manage your data sources</p>
      </div>

      <div className="ds-toolbar">
        <button className="btn btn-primary">
          <Plus size={18} />
          Add Source
        </button>
      </div>

      <div className="ds-list">
        {sources.length > 0 ? (
          sources.map((source) => (
            <div key={source.id} className="ds-item">
              <div className="ds-item-icon">{getIcon(source.type)}</div>
              <div className="ds-item-content">
                <h3>{source.name}</h3>
                <p className="ds-connection">{source.connection}</p>
                <p className="ds-sync">Last synced: {source.lastSync}</p>
              </div>
              <div className="ds-item-status">
                <span className={`status-badge ${source.status}`}>
                  {source.status}
                </span>
              </div>
              <button
                className="btn-icon btn-delete"
                onClick={() => removeSource(source.id)}
                title="Delete source"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        ) : (
          <div className="ds-empty">
            <p>No data sources configured. Add one to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataSources;
