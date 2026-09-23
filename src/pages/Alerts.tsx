import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Alert } from '../types';
import { AlertDetailModal } from '../components/AlertDetailModal';
import { 
  ShieldAlert, 
  Search, 
  RefreshCw, 
  ArrowRight 
} from 'lucide-react';
import { formatISTTime } from '../utils/time';

export const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedThreat, setSelectedThreat] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const data = await api.getAlerts({ limit: 200 });
      setAlerts(data);
      setFilteredAlerts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  useEffect(() => {
    let res = alerts;
    if (selectedSeverity !== 'ALL') {
      res = res.filter((a) => a.severity.toUpperCase() === selectedSeverity);
    }
    if (selectedThreat !== 'ALL') {
      res = res.filter((a) => a.threat_class === selectedThreat);
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      res = res.filter(
        (a) =>
          a.src_ip.toLowerCase().includes(q) ||
          a.dst_ip.toLowerCase().includes(q) ||
          a.threat_class.toLowerCase().includes(q) ||
          (a.subtype && a.subtype.toLowerCase().includes(q))
      );
    }
    setFilteredAlerts(res);
  }, [selectedSeverity, selectedThreat, searchQuery, alerts]);

  const handleResolveAlert = async (id: string) => {
    try {
      await api.resolveAlert(id);
      setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'RESOLVED' } : a)));
    } catch (e) {
      console.error(e);
    }
  };

  const threatClasses = Array.from(new Set(alerts.map((a) => a.threat_class)));

  return (
    <div id="tour-alerts-tab" className="space-y-4 animate-fadeIn pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <span>Passive Threat Alerts Explorer</span>
          </h1>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Structured forensic alerts with quantitative evidence, risk scores, and model provenance.
          </p>
        </div>

        <button
          onClick={loadAlerts}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 flex items-center space-x-1.5 transition-colors self-start sm:self-auto shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm text-xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search IP, threat class, subtype..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 text-xs font-medium"
          />
        </div>

        {/* Severity Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-slate-500 font-medium">Severity:</span>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-red-500 text-xs font-medium"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        {/* Threat Class Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-slate-500 font-medium">Category:</span>
          <select
            value={selectedThreat}
            onChange={(e) => setSelectedThreat(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-red-500 text-xs font-medium"
          >
            <option value="ALL">All Threat Classes</option>
            {threatClasses.map((tc) => (
              <option key={tc} value={tc}>
                {tc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="soc-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Threat Class</th>
                <th>Severity</th>
                <th>Risk</th>
                <th>Attacker (Src)</th>
                <th>Target (Dst)</th>
                <th>Method</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-400 text-xs font-medium">
                    No alerts match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alert) => (
                  <tr
                    key={alert.id}
                    onClick={() => setSelectedAlert(alert)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="text-slate-500 whitespace-nowrap text-[11px] font-medium">
                      {formatISTTime(alert.timestamp)}
                    </td>
                    <td className="font-semibold text-slate-900 whitespace-nowrap">
                      {alert.threat_class}
                    </td>
                    <td className="whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          alert.severity === 'CRITICAL'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : alert.severity === 'HIGH'
                            ? 'bg-orange-50 text-orange-700 border-orange-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </td>
                    <td className="whitespace-nowrap font-bold text-slate-900">
                      {alert.risk_score.toFixed(0)}
                    </td>
                    <td className="text-slate-900 whitespace-nowrap font-medium">
                      {alert.src_ip}
                    </td>
                    <td className="text-slate-600 whitespace-nowrap font-normal">
                      {alert.dst_ip}
                    </td>
                    <td className="whitespace-nowrap">
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                        {alert.detection_method}
                      </span>
                    </td>
                    <td className="whitespace-nowrap">
                      <span
                        className={`text-[11px] font-semibold ${
                          alert.status === 'RESOLVED' ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        {alert.status}
                      </span>
                    </td>
                    <td className="text-right whitespace-nowrap">
                      <button className="text-red-600 hover:text-red-700 font-semibold text-xs inline-flex items-center space-x-1">
                        <span>Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <AlertDetailModal
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
        onResolve={handleResolveAlert}
      />
    </div>
  );
};
