import React, { useState, useReducer, useEffect, useRef } from 'react';
import { Shield, Database, BarChart3, Palette, ChevronRight, Plus, Trash2, Cloud, HardDrive, Settings, Menu, X, Zap, Check, AlertCircle, Filter, Download, Copy, Printer, Mail, Eye, EyeOff, GripVertical, Save, RotateCcw } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';

// ═══════════════════════════════════════════════════════
// MOCK DATA & CONSTANTS
// ═══════════════════════════════════════════════════════

const MOCK_INCIDENTS = Array.from({ length: 45 }, (_, i) => ({
  id: `INC-${String(i + 1).padStart(5, '0')}`,
  timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
  analyst: ['Alice Chen', 'Bob Smith', 'Carol Zhang', 'David Park'][Math.floor(Math.random() * 4)],
  severity: ['Critical', 'High', 'Medium', 'Low'][Math.floor(Math.random() * 4)],
  category: ['Malware', 'Phishing', 'Intrusion', 'Data Exfiltration', 'Unauthorized Access'][Math.floor(Math.random() * 5)],
  title: `Suspicious ${['activity detected', 'login attempt', 'file access', 'network connection'][Math.floor(Math.random() * 4)]}`,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  status: ['Open', 'Investigating', 'Resolved', 'Escalated'][Math.floor(Math.random() * 4)],
  resolution: Math.random() > 0.3 ? 'Threat mitigated or false positive confirmed' : null,
}));

const SEVERITY_COLORS = {
  Critical: '#FF453A',
  High: '#FF9F0A',
  Medium: '#FFD60A',
  Low: '#30D158',
};

const REPORT_SECTIONS_DAILY = [
  'Executive Summary',
  'KPI Metrics',
  'Severity Distribution',
  'Category Breakdown',
  'Top Incidents',
  'Analyst Activity',
  'Footer',
];

const REPORT_SECTIONS_WEEKLY = [
  'Executive Summary',
  'KPI Metrics',
  'Trend Chart',
  'Category Breakdown',
  'MTTD/MTTR',
  'Analyst Performance',
  'Notable Incidents',
];

const REPORT_SECTIONS_MONTHLY = [
  'Executive Summary',
  'KPI Dashboard',
  'Trend Chart',
  'Severity Heatmap',
  'Top Categories',
  'SLA Compliance',
  'Team Performance',
  'Risk Posture',
  'Incident Appendix',
];

// ═══════════════════════════════════════════════════════
// DATA SOURCES PAGE
// ═══════════════════════════════════════════════════════

const DataSourcesPage = ({ onDataChange }) => {
  const [excelSources, setExcelSources] = useState([
    {
      id: '1',
      url: 'https://example.com/sample.xlsx',
      nickname: 'Tier 1 Observations',
      sheet: 'Analyst Observations',
      status: 'active',
      lastSync: new Date(),
      recordCount: 142,
    },
  ]);

  const [apiIntegrations, setApiIntegrations] = useState([
    {
      id: 'api1',
      tool: 'ServiceNow',
      nickname: 'Incident Management',
      status: 'active',
      lastSync: new Date(),
      recordCount: 89,
    },
  ]);

  const [totalRecords, setTotalRecords] = useState(231);

  const addExcelSource = () => {
    setExcelSources([
      ...excelSources,
      {
        id: Date.now().toString(),
        url: '',
        nickname: 'New Excel Source',
        sheet: '',
        status: 'inactive',
        lastSync: null,
        recordCount: 0,
      },
    ]);
  };

  const addApiIntegration = () => {
    setApiIntegrations([
      ...apiIntegrations,
      {
        id: 'api' + Date.now(),
        tool: '',
        nickname: 'New Integration',
        status: 'inactive',
        lastSync: null,
        recordCount: 0,
      },
    ]);
  };

  const removeExcelSource = (id) => {
    setExcelSources(excelSources.filter(s => s.id !== id));
  };

  const removeApiIntegration = (id) => {
    setApiIntegrations(apiIntegrations.filter(s => s.id !== id));
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Data Sources</h1>
        <p className="subtitle">Configure Excel/SharePoint and API integrations</p>
      </div>

      {/* EXCEL SOURCES SECTION */}
      <section className="data-section">
        <div className="section-header">
          <h2><Database size={20} /> Excel & SharePoint Sources</h2>
        </div>
        <div className="sources-list">
          {excelSources.map(source => (
            <div key={source.id} className="source-card">
              <div className="source-card-header">
                <input
                  type="text"
                  placeholder="Paste Excel/SharePoint URL..."
                  value={source.url}
                  onChange={(e) => {
                    setExcelSources(excelSources.map(s =>
                      s.id === source.id ? { ...s, url: e.target.value } : s
                    ));
                  }}
                  className="input-field input-url"
                />
                <button
                  className="btn-icon btn-delete"
                  onClick={() => removeExcelSource(source.id)}
                  title="Delete source"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="source-meta">
                <input
                  type="text"
                  placeholder="Source nickname (e.g., Tier 1 Observations)"
                  value={source.nickname}
                  onChange={(e) => {
                    setExcelSources(excelSources.map(s =>
                      s.id === source.id ? { ...s, nickname: e.target.value } : s
                    ));
                  }}
                  className="input-field input-small"
                />
                {source.sheet && (
                  <select
                    value={source.sheet}
                    onChange={(e) => {
                      setExcelSources(excelSources.map(s =>
                        s.id === source.id ? { ...s, sheet: e.target.value } : s
                      ));
                    }}
                    className="input-field input-select"
                  >
                    <option value="">Select Sheet</option>
                    <option value="Analyst Observations">Analyst Observations</option>
                    <option value="Escalations">Escalations</option>
                    <option value="Summary">Summary</option>
                    <option value="Raw Data">Raw Data</option>
                  </select>
                )}
              </div>

              <div className="source-status">
                <span className={`status-badge ${source.status}`}>
                  <span className={`status-dot ${source.status}`}></span>
                  {source.status}
                </span>
                {source.lastSync && (
                  <span className="sync-text">Last synced: {source.lastSync.toLocaleTimeString()}</span>
                )}
                <span className="record-count">{source.recordCount} records</span>
              </div>
            </div>
          ))}
        </div>
        <button className="btn btn-secondary" onClick={addExcelSource}>
          <Plus size={18} /> Add Excel Source
        </button>
      </section>

      {/* API INTEGRATIONS SECTION */}
      <section className="data-section">
        <div className="section-header">
          <h2><Cloud size={20} /> API & Ticketing Integrations</h2>
        </div>
        <div className="sources-list">
          {apiIntegrations.map(integration => (
            <div key={integration.id} className="source-card">
              <div className="source-card-header">
                <select
                  value={integration.tool}
                  onChange={(e) => {
                    setApiIntegrations(apiIntegrations.map(s =>
                      s.id === integration.id ? { ...s, tool: e.target.value } : s
                    ));
                  }}
                  className="input-field input-select"
                >
                  <option value="">Select Integration Tool</option>
                  <option value="ServiceNow">ServiceNow</option>
                  <option value="Jira">Jira Service Management</option>
                  <option value="Freshservice">Freshservice</option>
                  <option value="Zendesk">Zendesk</option>
                  <option value="PagerDuty">PagerDuty</option>
                  <option value="Microsoft Sentinel">Microsoft Sentinel</option>
                  <option value="Splunk">Splunk SIEM</option>
                  <option value="Custom REST">Custom REST API</option>
                </select>
                <button
                  className="btn-icon btn-delete"
                  onClick={() => removeApiIntegration(integration.id)}
                  title="Delete integration"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {integration.tool && (
                <div className="source-meta">
                  <input
                    type="text"
                    placeholder="Integration nickname"
                    value={integration.nickname}
                    onChange={(e) => {
                      setApiIntegrations(apiIntegrations.map(s =>
                        s.id === integration.id ? { ...s, nickname: e.target.value } : s
                      ));
                    }}
                    className="input-field input-small"
                  />
                  <input
                    type="password"
                    placeholder={`${integration.tool} API Key or Token`}
                    className="input-field input-small"
                  />
                </div>
              )}

              <div className="source-status">
                <span className={`status-badge ${integration.status}`}>
                  <span className={`status-dot ${integration.status}`}></span>
                  {integration.status}
                </span>
                {integration.lastSync && (
                  <span className="sync-text">Last synced: {integration.lastSync.toLocaleTimeString()}</span>
                )}
                <span className="record-count">{integration.recordCount} records</span>
              </div>

              <button className="btn btn-accent" style={{ width: '100%', marginTop: '12px' }}>
                <Zap size={16} /> Test Connection
              </button>
            </div>
          ))}
        </div>
        <button className="btn btn-secondary" onClick={addApiIntegration}>
          <Plus size={18} /> Add API Integration
        </button>
      </section>

      {/* DATA HEALTH DASHBOARD */}
      <section className="data-section data-health">
        <div className="section-header">
          <h2>Data Health Summary</h2>
        </div>
        <div className="health-metrics">
          <div className="health-card">
            <div className="health-label">Total Sources</div>
            <div className="health-value">{excelSources.length + apiIntegrations.length}</div>
          </div>
          <div className="health-card">
            <div className="health-label">Total Records</div>
            <div className="health-value">{totalRecords.toLocaleString()}</div>
          </div>
          <div className="health-card">
            <div className="health-label">Last Full Sync</div>
            <div className="health-value">2 min ago</div>
          </div>
        </div>
        <button className="btn btn-primary" style={{ marginTop: '16px' }}>
          <Zap size={16} /> Sync All Sources
        </button>
      </section>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// REPORT GENERATOR PAGE
// ═══════════════════════════════════════════════════════

const ReportGeneratorPage = () => {
  const [reportType, setReportType] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedAnalysts, setSelectedAnalysts] = useState([]);
  const [selectedSeverities, setSelectedSeverities] = useState(['Critical', 'High']);
  const [includeAISummary, setIncludeAISummary] = useState(true);
  const [includeRawTable, setIncludeRawTable] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);

  const analysts = ['Alice Chen', 'Bob Smith', 'Carol Zhang', 'David Park'];
  const severities = ['Critical', 'High', 'Medium', 'Low'];

  const handleGenerateReport = async () => {
    setGenerating(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 2000));
    
    const filteredIncidents = MOCK_INCIDENTS.filter(inc =>
      (!selectedAnalysts.length || selectedAnalysts.includes(inc.analyst)) &&
      selectedSeverities.includes(inc.severity)
    );

    setGeneratedReport({
      type: reportType,
      date: selectedDate,
      incidents: filteredIncidents,
      totalIncidents: filteredIncidents.length,
      severityCounts: severities.reduce((acc, sev) => ({
        ...acc,
        [sev]: filteredIncidents.filter(i => i.severity === sev).length
      }), {}),
    });
    setGenerating(false);
  };

  const severityChartData = generatedReport ? severities.map(sev => ({
    name: sev,
    value: generatedReport.severityCounts[sev] || 0,
    fill: SEVERITY_COLORS[sev],
  })) : [];

  const categoryChartData = generatedReport ? (() => {
    const categories = {};
    generatedReport.incidents.forEach(inc => {
      categories[inc.category] = (categories[inc.category] || 0) + 1;
    });
    return Object.entries(categories).map(([cat, count]) => ({
      name: cat,
      count,
    }));
  })() : [];

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Report Generator</h1>
        <p className="subtitle">Generate daily, weekly, or monthly SOC reports</p>
      </div>

      {/* REPORT TYPE SELECTOR */}
      <div className="report-type-selector">
        {['daily', 'weekly', 'monthly'].map(type => (
          <button
            key={type}
            className={`pill-button ${reportType === type ? 'active' : ''}`}
            onClick={() => setReportType(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* OPTIONS PANEL */}
      <div className="options-panel">
        <div className="option-group">
          <label>Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="option-group">
          <label>Analysts</label>
          <div className="checkbox-group">
            {analysts.map(analyst => (
              <label key={analyst} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedAnalysts.includes(analyst)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedAnalysts([...selectedAnalysts, analyst]);
                    } else {
                      setSelectedAnalysts(selectedAnalysts.filter(a => a !== analyst));
                    }
                  }}
                />
                {analyst}
              </label>
            ))}
          </div>
        </div>

        <div className="option-group">
          <label>Severity Levels</label>
          <div className="checkbox-group">
            {severities.map(sev => (
              <label key={sev} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedSeverities.includes(sev)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedSeverities([...selectedSeverities, sev]);
                    } else {
                      setSelectedSeverities(selectedSeverities.filter(s => s !== sev));
                    }
                  }}
                />
                <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '2px', backgroundColor: SEVERITY_COLORS[sev], marginRight: '6px' }}></span>
                {sev}
              </label>
            ))}
          </div>
        </div>

        <div className="option-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={includeAISummary}
              onChange={(e) => setIncludeAISummary(e.target.checked)}
            />
            Include AI Executive Summary
          </label>
        </div>

        <div className="option-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={includeRawTable}
              onChange={(e) => setIncludeRawTable(e.target.checked)}
            />
            Include Raw Incidents Table
          </label>
        </div>

        <button
          className={`btn btn-primary ${generating ? 'generating' : ''}`}
          onClick={handleGenerateReport}
          disabled={generating}
        >
          <BarChart3 size={18} />
          {generating ? 'Generating...' : `Generate ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`}
        </button>
      </div>

      {/* GENERATED REPORT */}
      {generatedReport && (
        <div className="report-container">
          <div className="report-header-section">
            <div className="report-title">
              <Shield size={32} style={{ color: '#0A84FF' }} />
              <div>
                <h1>{reportType.toUpperCase()} SOC REPORT</h1>
                <p>Generated on {new Date(generatedReport.date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {includeAISummary && (
            <div className="report-section">
              <h2>Executive Summary</h2>
              <p className="report-text">
                This {reportType} report covers SOC operations for the period of {generatedReport.date}. A total of {generatedReport.totalIncidents} security incidents were processed, with {generatedReport.severityCounts.Critical} critical, {generatedReport.severityCounts.High} high severity, and {generatedReport.severityCounts.Medium + generatedReport.severityCounts.Low} lower severity events. All critical incidents have been addressed, and the security posture remains stable.
              </p>
            </div>
          )}

          <div className="report-section">
            <h2>Key Performance Indicators</h2>
            <div className="kpi-row">
              <div className="kpi-card">
                <div className="kpi-value">{generatedReport.totalIncidents}</div>
                <div className="kpi-label">Total Incidents</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-value">{generatedReport.severityCounts.Critical}</div>
                <div className="kpi-label">Critical</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-value">{generatedReport.severityCounts.High}</div>
                <div className="kpi-label">High</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-value">{generatedReport.incidents.filter(i => i.status === 'Resolved').length}</div>
                <div className="kpi-label">Resolved</div>
              </div>
            </div>
          </div>

          {severityChartData.some(d => d.value > 0) && (
            <div className="report-section">
              <h2>Severity Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={severityChartData.filter(d => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {severityChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} incidents`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {categoryChartData.length > 0 && (
            <div className="report-section">
              <h2>Incidents by Category</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="#86868b" />
                  <YAxis stroke="#86868b" />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a1f', border: '1px solid rgba(255,255,255,0.1)' }} />
                  <Bar dataKey="count" fill="#0A84FF" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {includeRawTable && (
            <div className="report-section">
              <h2>Incident Details</h2>
              <div className="report-table-wrapper">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Time</th>
                      <th>Analyst</th>
                      <th>Severity</th>
                      <th>Category</th>
                      <th>Title</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generatedReport.incidents.slice(0, 10).map(inc => (
                      <tr key={inc.id}>
                        <td>{inc.id}</td>
                        <td>{new Date(inc.timestamp).toLocaleTimeString()}</td>
                        <td>{inc.analyst}</td>
                        <td>
                          <span className="severity-badge" style={{ color: SEVERITY_COLORS[inc.severity] }}>
                            {inc.severity}
                          </span>
                        </td>
                        <td>{inc.category}</td>
                        <td>{inc.title}</td>
                        <td>{inc.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="export-bar">
            <button className="btn btn-small"><Download size={16} /> Download HTML</button>
            <button className="btn btn-small"><Copy size={16} /> Copy to Clipboard</button>
            <button className="btn btn-small"><Printer size={16} /> Print</button>
            <button className="btn btn-small"><Mail size={16} /> Email Draft</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// REPORT FORMATTER PAGE
// ═══════════════════════════════════════════════════════

const ReportFormatterPage = () => {
  const [formatterTab, setFormatterTab] = useState('daily');
  const [orgName, setOrgName] = useState('Security Operations Center');
  const [reportTitle, setReportTitle] = useState('Daily SOC Report');
  const [visibleSections, setVisibleSections] = useState(
    formatterTab === 'daily' ? REPORT_SECTIONS_DAILY.reduce((a, s) => ({ ...a, [s]: true }), {}) : 
    formatterTab === 'weekly' ? REPORT_SECTIONS_WEEKLY.reduce((a, s) => ({ ...a, [s]: true }), {}) :
    REPORT_SECTIONS_MONTHLY.reduce((a, s) => ({ ...a, [s]: true }), {})
  );
  const [chartPalette, setChartPalette] = useState('SOC Dark');
  const [tableColumns, setTableColumns] = useState(['ID', 'Timestamp', 'Analyst', 'Severity', 'Category', 'Title', 'Status']);
  const [includedCharts, setIncludedCharts] = useState(true);
  const [headerColor, setHeaderColor] = useState('#0A84FF');
  const [aiSummaryLength, setAiSummaryLength] = useState('standard');

  const currentSections = 
    formatterTab === 'daily' ? REPORT_SECTIONS_DAILY :
    formatterTab === 'weekly' ? REPORT_SECTIONS_WEEKLY :
    REPORT_SECTIONS_MONTHLY;

  const columns = ['ID', 'Timestamp', 'Analyst', 'Severity', 'Category', 'Title', 'Description', 'Status', 'Resolution'];

  const toggleSection = (section) => {
    setVisibleSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleColumn = (column) => {
    setTableColumns(prev =>
      prev.includes(column)
        ? prev.filter(c => c !== column)
        : [...prev, column]
    );
  };

  const savePreset = () => {
    alert(`Preset saved: "${reportTitle} - ${formatterTab}"`);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Report Formatter</h1>
        <p className="subtitle">Customize report layouts and appearance</p>
      </div>

      {/* TAB SELECTOR */}
      <div className="formatter-tabs">
        {['daily', 'weekly', 'monthly'].map(tab => (
          <button
            key={tab}
            className={`tab-button ${formatterTab === tab ? 'active' : ''}`}
            onClick={() => setFormatterTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Format
          </button>
        ))}
      </div>

      <div className="formatter-grid">
        {/* LEFT PANEL - SETTINGS */}
        <div className="formatter-panel">
          {/* BRANDING */}
          <section className="formatter-section">
            <h3>Branding & Header</h3>
            <div className="form-group">
              <label>Organization Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label>Report Title</label>
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label>Header Color</label>
              <input
                type="color"
                value={headerColor}
                onChange={(e) => setHeaderColor(e.target.value)}
                className="input-color"
              />
            </div>
          </section>

          {/* SECTION VISIBILITY */}
          <section className="formatter-section">
            <h3>Report Sections</h3>
            <div className="section-list">
              {currentSections.map(section => (
                <label key={section} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={visibleSections[section] || false}
                    onChange={() => toggleSection(section)}
                  />
                  <GripVertical size={16} style={{ opacity: 0.5 }} />
                  {section}
                </label>
              ))}
            </div>
          </section>

          {/* TABLE SETTINGS */}
          <section className="formatter-section">
            <h3>Table Columns</h3>
            <div className="columns-list">
              {columns.map(col => (
                <label key={col} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={tableColumns.includes(col)}
                    onChange={() => toggleColumn(col)}
                  />
                  {col}
                </label>
              ))}
            </div>
          </section>

          {/* CHART SETTINGS */}
          <section className="formatter-section">
            <h3>Chart Settings</h3>
            <div className="form-group">
              <label>Color Palette</label>
              <select
                value={chartPalette}
                onChange={(e) => setChartPalette(e.target.value)}
                className="input-field"
              >
                <option value="SOC Dark">SOC Dark</option>
                <option value="Corporate Blue">Corporate Blue</option>
                <option value="High Contrast">High Contrast</option>
                <option value="Monochrome">Monochrome</option>
              </select>
            </div>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={includedCharts}
                onChange={(e) => setIncludedCharts(e.target.checked)}
              />
              Show Charts
            </label>
          </section>

          {/* AI SETTINGS */}
          <section className="formatter-section">
            <h3>AI Summary</h3>
            <div className="form-group">
              <label>Summary Length</label>
              <select
                value={aiSummaryLength}
                onChange={(e) => setAiSummaryLength(e.target.value)}
                className="input-field"
              >
                <option value="brief">Brief (2-3 lines)</option>
                <option value="standard">Standard (1 paragraph)</option>
                <option value="detailed">Detailed (2-3 paragraphs)</option>
              </select>
            </div>
            <div className="form-group">
              <button className="btn btn-secondary" onClick={savePreset}>
                <Save size={16} /> Save as Preset
              </button>
            </div>
          </section>
        </div>

        {/* RIGHT PANEL - PREVIEW */}
        <div className="formatter-panel preview-panel">
          <h3>Live Preview</h3>
          <div className="report-preview" style={{ borderTopColor: headerColor }}>
            <div className="preview-header" style={{ backgroundColor: headerColor }}>
              <h4>{orgName}</h4>
              <p>{reportTitle}</p>
            </div>
            <div className="preview-content">
              {visibleSections['Executive Summary'] && (
                <div className="preview-section">
                  <h5>Executive Summary</h5>
                  <p>This is a preview of how your {formatterTab} report will appear...</p>
                </div>
              )}
              {visibleSections['KPI Metrics'] && (
                <div className="preview-section">
                  <h5>Key Metrics</h5>
                  <div className="preview-kpis">
                    <div>Total: 45</div>
                    <div>Critical: 3</div>
                  </div>
                </div>
              )}
              {includedCharts && visibleSections['Severity Distribution'] && (
                <div className="preview-section">
                  <h5>Severity Chart</h5>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', height: '100px', borderRadius: '8px' }}></div>
                </div>
              )}
            </div>
          </div>
          <button className="btn btn-secondary" style={{ width: '100%', marginTop: '12px' }}>
            <Eye size={16} /> Preview Full Report
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════════════════════

export default function SOCReportingTool() {
  const [currentPage, setCurrentPage] = useState('sources');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pages = {
    sources: { label: 'Data Sources', icon: Database, component: DataSourcesPage },
    generator: { label: 'Report Generator', icon: BarChart3, component: ReportGeneratorPage },
    formatter: { label: 'Report Formatter', icon: Palette, component: ReportFormatterPage },
  };

  const CurrentPageComponent = pages[currentPage].component;

  return (
    <div className="soc-app">
      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-logo">
          <Shield size={28} style={{ color: '#0A84FF' }} />
          <span>SOC Lens</span>
        </div>

        <nav className="sidebar-nav">
          {Object.entries(pages).map(([key, page]) => {
            const Icon = page.icon;
            return (
              <button
                key={key}
                className={`nav-item ${currentPage === key ? 'active' : ''}`}
                onClick={() => setCurrentPage(key)}
                title={page.label}
              >
                <Icon size={20} />
                <span>{page.label}</span>
                {currentPage === key && <ChevronRight size={18} />}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <p className="version">v1.0</p>
          <button className="btn-icon">
            <Settings size={20} />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="main-content">
        {/* TOP BAR */}
        <div className="top-bar">
          <button
            className="btn-sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h2>{pages[currentPage].label}</h2>
          <div className="top-bar-actions">
            <span className="time-display">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* PAGE CONTENT */}
        <CurrentPageComponent />
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
          background: #08080d;
          color: #f5f5f7;
          overflow: hidden;
        }

        .soc-app {
          display: flex;
          height: 100vh;
          background: #08080d;
        }

        /* SIDEBAR */
        .sidebar {
          width: 260px;
          background: rgba(17, 17, 24, 0.8);
          backdrop-filter: blur(12px);
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
          padding: 20px;
          overflow-y: auto;
          transition: all 0.3s ease;
        }

        .sidebar.closed {
          width: 0;
          padding: 0;
          border: none;
          overflow: hidden;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 32px;
          color: #f5f5f7;
        }

        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: transparent;
          border: none;
          border-left: 3px solid transparent;
          color: #86868b;
          cursor: pointer;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s ease;
          position: relative;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.04);
          color: #f5f5f7;
        }

        .nav-item.active {
          background: rgba(10, 132, 255, 0.15);
          border-left-color: #0A84FF;
          color: #0A84FF;
        }

        .nav-item svg:last-child {
          margin-left: auto;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .nav-item.active svg:last-child {
          opacity: 1;
        }

        .sidebar-footer {
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .version {
          font-size: 12px;
          color: #86868b;
        }

        .btn-icon {
          background: transparent;
          border: none;
          color: #86868b;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-icon:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #f5f5f7;
        }

        /* MAIN CONTENT */
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #08080d;
        }

        .top-bar {
          display: flex;
          align-items: center;
          gap: 16px;
          height: 60px;
          padding: 0 24px;
          background: rgba(17, 17, 24, 0.6);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          z-index: 100;
        }

        .top-bar h2 {
          flex: 1;
          font-size: 18px;
          font-weight: 600;
        }

        .btn-sidebar-toggle {
          background: transparent;
          border: none;
          color: #f5f5f7;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          transition: background 0.2s ease;
        }

        .btn-sidebar-toggle:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .top-bar-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .time-display {
          font-size: 14px;
          color: #86868b;
          font-weight: 500;
        }

        .page-content {
          flex: 1;
          overflow-y: auto;
          padding: 32px 24px;
        }

        .page-header {
          margin-bottom: 32px;
        }

        .page-header h1 {
          font-size: 32px;
          margin-bottom: 8px;
          color: #f5f5f7;
        }

        .subtitle {
          font-size: 16px;
          color: #86868b;
        }

        /* BUTTONS */
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .btn-primary {
          background: #0A84FF;
          color: white;
        }

        .btn-primary:hover {
          background: #0077ed;
          transform: translateY(-1px);
        }

        .btn-primary:active {
          transform: scale(0.97);
        }

        .btn-primary.generating {
          opacity: 0.8;
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.08);
          color: #f5f5f7;
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.12);
        }

        .btn-accent {
          background: rgba(10, 132, 255, 0.2);
          color: #0A84FF;
          border: 1px solid rgba(10, 132, 255, 0.3);
        }

        .btn-accent:hover {
          background: rgba(10, 132, 255, 0.3);
        }

        .btn-small {
          padding: 8px 12px;
          font-size: 13px;
        }

        .btn-delete {
          color: #FF453A;
        }

        .btn-delete:hover {
          background: rgba(255, 69, 58, 0.1);
        }

        /* REPORT TYPE SELECTOR */
        .report-type-selector {
          display: flex;
          gap: 12px;
          margin-bottom: 32px;
          background: rgba(255, 255, 255, 0.04);
          padding: 4px;
          border-radius: 10px;
          width: fit-content;
        }

        .pill-button {
          padding: 10px 20px;
          background: transparent;
          border: none;
          border-radius: 8px;
          color: #86868b;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pill-button.active {
          background: #0A84FF;
          color: white;
        }

        /* FORM ELEMENTS */
        .input-field {
          width: 100%;
          padding: 10px 12px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          color: #f5f5f7;
          font-family: inherit;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .input-field:focus {
          outline: none;
          border-color: #0A84FF;
          background: rgba(255, 255, 255, 0.08);
        }

        .input-field::placeholder {
          color: #86868b;
        }

        .input-select {
          cursor: pointer;
        }

        .input-color {
          width: 100%;
          height: 40px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          cursor: pointer;
        }

        .input-url {
          margin-bottom: 8px;
        }

        .input-small {
          font-size: 13px;
          margin-bottom: 8px;
        }

        .input-select {
          width: 100%;
        }

        /* DATA SOURCES */
        .data-section {
          margin-bottom: 32px;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .section-header h2 {
          font-size: 18px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #f5f5f7;
        }

        .sources-list {
          display: grid;
          gap: 12px;
          margin-bottom: 16px;
        }

        .source-card {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          border-radius: 12px;
          padding: 16px;
          transition: all 0.2s ease;
        }

        .source-card:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.12);
        }

        .source-card-header {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }

        .source-meta {
          display: grid;
          gap: 8px;
          margin-bottom: 12px;
        }

        .source-status {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 13px;
          flex-wrap: wrap;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-badge.active {
          background: rgba(48, 209, 88, 0.15);
          color: #30D158;
        }

        .status-badge.inactive {
          background: rgba(255, 69, 58, 0.15);
          color: #FF453A;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          display: inline-block;
        }

        .status-dot.active {
          background: #30D158;
        }

        .status-dot.inactive {
          background: #FF453A;
        }

        .sync-text {
          color: #86868b;
        }

        .record-count {
          color: #86868b;
          margin-left: auto;
        }

        /* DATA HEALTH */
        .data-health {
          background: linear-gradient(135deg, rgba(10, 132, 255, 0.1) 0%, rgba(255, 69, 58, 0.1) 100%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 24px;
        }

        .health-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          margin-bottom: 16px;
        }

        .health-card {
          background: rgba(255, 255, 255, 0.04);
          border-radius: 10px;
          padding: 16px;
          text-align: center;
        }

        .health-label {
          font-size: 13px;
          color: #86868b;
          margin-bottom: 8px;
        }

        .health-value {
          font-size: 24px;
          font-weight: 600;
          color: #0A84FF;
        }

        /* OPTIONS PANEL */
        .options-panel {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
        }

        .option-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .option-group label {
          font-size: 13px;
          font-weight: 500;
          color: #86868b;
        }

        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 14px;
          color: #f5f5f7;
          user-select: none;
        }

        .checkbox-label input[type="checkbox"] {
          width: 16px;
          height: 16px;
          cursor: pointer;
          accent-color: #0A84FF;
        }

        /* REPORT CONTAINER */
        .report-container {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          overflow: hidden;
          margin-top: 24px;
        }

        .report-header-section {
          background: rgba(10, 132, 255, 0.08);
          padding: 32px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .report-title {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .report-title h1 {
          font-size: 28px;
          margin: 0;
          letter-spacing: -0.5px;
        }

        .report-title p {
          font-size: 14px;
          color: #86868b;
          margin: 0;
        }

        .report-section {
          padding: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .report-section h2 {
          font-size: 18px;
          margin-bottom: 16px;
          color: #f5f5f7;
        }

        .report-text {
          color: #86868b;
          line-height: 1.6;
        }

        .kpi-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
        }

        .kpi-card {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 16px;
          text-align: center;
        }

        .kpi-value {
          font-size: 28px;
          font-weight: 600;
          color: #0A84FF;
          margin-bottom: 4px;
        }

        .kpi-label {
          font-size: 12px;
          color: #86868b;
        }

        .report-table-wrapper {
          overflow-x: auto;
        }

        .report-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        .report-table th {
          background: rgba(255, 255, 255, 0.04);
          padding: 12px;
          text-align: left;
          font-weight: 600;
          color: #86868b;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .report-table td {
          padding: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          color: #f5f5f7;
        }

        .report-table tr:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .severity-badge {
          font-weight: 600;
        }

        /* EXPORT BAR */
        .export-bar {
          display: flex;
          gap: 8px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.02);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          flex-wrap: wrap;
        }

        /* FORMATTER */
        .formatter-tabs {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .tab-button {
          padding: 12px 16px;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          color: #86868b;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .tab-button.active {
          color: #0A84FF;
          border-bottom-color: #0A84FF;
        }

        .formatter-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-top: 24px;
        }

        .formatter-panel {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 24px;
        }

        .formatter-panel h3 {
          font-size: 16px;
          margin-bottom: 16px;
          color: #f5f5f7;
        }

        .formatter-section {
          margin-bottom: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .formatter-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .formatter-section h3 {
          font-size: 14px;
          color: #86868b;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 12px;
        }

        .form-group label {
          font-size: 13px;
          color: #86868b;
          font-weight: 500;
        }

        .section-list,
        .columns-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .section-list .checkbox-label,
        .columns-list .checkbox-label {
          padding: 8px;
          border-radius: 6px;
          transition: background 0.2s ease;
        }

        .section-list .checkbox-label:hover,
        .columns-list .checkbox-label:hover {
          background: rgba(255, 255, 255, 0.04);
        }

        .preview-panel {
          display: flex;
          flex-direction: column;
        }

        .report-preview {
          flex: 1;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border-top: 3px solid #0A84FF;
        }

        .preview-header {
          padding: 16px;
          color: white;
        }

        .preview-header h4 {
          margin: 0 0 4px 0;
          font-size: 14px;
          font-weight: 600;
        }

        .preview-header p {
          margin: 0;
          font-size: 12px;
          opacity: 0.8;
        }

        .preview-content {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
        }

        .preview-section {
          margin-bottom: 16px;
        }

        .preview-section h5 {
          font-size: 12px;
          color: #0A84FF;
          margin-bottom: 8px;
          font-weight: 600;
        }

        .preview-section p {
          font-size: 11px;
          color: #86868b;
          margin: 0;
        }

        .preview-kpis {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          font-size: 11px;
        }

        .preview-kpis div {
          background: rgba(255, 255, 255, 0.04);
          padding: 8px;
          border-radius: 4px;
          color: #0A84FF;
          font-weight: 500;
        }

        /* RESPONSIVE */
        @media (max-width: 1200px) {
          .formatter-grid {
            grid-template-columns: 1fr;
          }

          .options-panel {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            left: 0;
            top: 0;
            height: 100vh;
            z-index: 1000;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
          }

          .sidebar.closed {
            display: none;
          }

          .page-content {
            padding: 24px 16px;
          }

          .top-bar {
            padding: 0 16px;
          }

          .health-metrics {
            grid-template-columns: 1fr;
          }

          .options-panel {
            grid-template-columns: 1fr;
          }

          .kpi-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
