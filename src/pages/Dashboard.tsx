import React, { useState, useEffect } from 'react';
import { MetricsHUD } from '../components/MetricsHUD';
import { LiveThreatFeed } from '../components/LiveThreatFeed';
import { AlertDetailModal } from '../components/AlertDetailModal';
import { api } from '../services/api';
import { wsStream } from '../services/websocket';
import { Alert, ThreatAnalytics } from '../types';
import { 
  ShieldAlert, 
  Play, 
  Activity, 
  PieChart as PieIcon, 
  Radio, 
  Sliders, 
  ArrowUpRight,
  TrendingUp,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip 
} from 'recharts';
import { useTour } from '../context/TourContext';

export const Dashboard: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [threatData, setThreatData] = useState<ThreatAnalytics | null>(null);
  const [stats, setStats] = useState({
    total_alerts: 0,
    critical_alerts: 0,
    high_alerts: 0,
    active_incidents: 0
  });
  const [telemetry, setTelemetry] = useState({
    events_per_sec: 0.0,
    flows_per_sec: 0.0,
    avg_inference_latency_ms: 1.15,
    p95_detection_latency_ms: 2.40
  });

  const { startTour } = useTour();

  const loadInitialData = async () => {
    try {
      const [alertsRes, statsRes, threatsRes] = await Promise.all([
        api.getAlerts({ limit: 50 }),
        api.getStatistics(),
        api.getThreats()
      ]);
      setAlerts(alertsRes);
      setStats(statsRes);
      setThreatData(threatsRes);
    } catch (e) {
      console.warn('Could not fetch initial data:', e);
    }
  };

  useEffect(() => {
    loadInitialData();

    // Subscribe to real-time WebSocket events
    const unsubscribe = wsStream.subscribe((message) => {
      if (message.type === 'NEW_ALERT' && message.data) {
        setAlerts((prev) => [message.data, ...prev.slice(0, 99)]);
        setStats((prev) => ({
          ...prev,
          total_alerts: prev.total_alerts + 1,
          critical_alerts: message.data.severity === 'CRITICAL' ? prev.critical_alerts + 1 : prev.critical_alerts,
          high_alerts: message.data.severity === 'HIGH' ? prev.high_alerts + 1 : prev.high_alerts
        }));
      } else if (message.type === 'PERFORMANCE_UPDATE' && message.data) {
        setTelemetry(message.data);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleResolveAlert = async (id: string) => {
    try {
      await api.resolveAlert(id);
      setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'RESOLVED' } : a)));
      setSelectedAlert((prev) => (prev && prev.id === id ? { ...prev, status: 'RESOLVED' } : prev));
    } catch (e) {
      console.error(e);
    }
  };

  // Red & Green focused palette for chart
  const PIE_COLORS = ['#dc2626', '#ea580c', '#16a34a', '#0284c7', '#7c3aed', '#ca8a04'];
  const threatPieData = threatData?.threat_breakdown && Object.keys(threatData.threat_breakdown).length > 0
    ? Object.entries(threatData.threat_breakdown).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="space-y-4 animate-fadeIn pb-8 font-sans">
      {/* Top Banner / Passive Assurance */}
      <div 
        id="tour-passive-banner" 
        className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
      >
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
              STRICTLY PASSIVE INGEST
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Isolated SPAN / Optical TAP Monitoring Enclave</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Real-Time Passive Network Threat Detection SOC
          </h1>
          <p className="text-xs text-slate-600 max-w-2xl font-normal">
            Analyzing one-way network metadata streams with zero return-path transmissions, zero active probes, and zero payload decryption.
          </p>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0 self-start sm:self-auto">
          <button
            onClick={startTour}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors flex items-center space-x-1"
          >
            <Compass className="w-3.5 h-3.5 text-red-600" />
            <span>Interactive Tour</span>
          </button>
          <a
            href="/replay"
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shadow-sm transition-colors flex items-center space-x-1.5"
          >
            <Play className="w-3.5 h-3.5" />
            <span>PCAP Lab</span>
          </a>
        </div>
      </div>

      {/* Real-time Measured Metrics HUD */}
      <MetricsHUD stats={stats} telemetry={telemetry} />

      {/* Main Grid: Live Feed & Threat Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Live Threat Feed (Span 2) */}
        <div className="lg:col-span-2">
          <LiveThreatFeed alerts={alerts} onSelectAlert={(a) => setSelectedAlert(a)} />
        </div>

        {/* Threat Distribution & Vectors (Span 1) */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center space-x-1.5">
                <PieIcon className="w-4 h-4 text-red-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Threat Classification Breakdown
                </h3>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold">Hybrid ML</span>
            </div>

            {threatPieData.length > 0 ? (
              <>
                <div className="h-44 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={threatPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={65}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {threatPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          borderColor: '#e2e8f0',
                          borderRadius: '8px',
                          fontSize: '11px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-1.5 mt-1 text-[11px]">
                  {threatPieData.slice(0, 4).map((entry, idx) => (
                    <div key={idx} className="flex items-center space-x-1.5">
                      <div
                        className="w-2 h-2 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                      ></div>
                      <span className="text-slate-600 truncate font-medium">{entry.name}:</span>
                      <span className="font-bold text-slate-900">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                No active threats recorded yet. Replay an attack PCAP from the PCAP Lab to observe live classification.
              </div>
            )}
          </div>

          {/* Active Attack Vectors Tracked */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center space-x-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Monitored Threat Vectors
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                6 Primary Classes
              </span>
            </div>

            <div className="mt-2.5 space-y-1.5 text-xs">
              <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 font-medium">
                <span className="text-slate-600">1. Volumetric DDoS:</span>
                <span className="text-red-600 font-bold">SYN/UDP Floods</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 font-medium">
                <span className="text-slate-600">2. Botnet C2 Beaconing:</span>
                <span className="text-red-600 font-bold">IAT Jitter & CV</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 font-medium">
                <span className="text-slate-600">3. DGA Domains:</span>
                <span className="text-red-600 font-bold">Entropy &gt; 3.5</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 font-medium">
                <span className="text-slate-600">4. DNS Tunnelling:</span>
                <span className="text-red-600 font-bold">Label & TXT Anomalies</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 font-medium">
                <span className="text-slate-600">5. Port Reconnaissance:</span>
                <span className="text-red-600 font-bold">Port/Host Fanout</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 font-medium">
                <span className="text-slate-600">6. Data Exfiltration:</span>
                <span className="text-red-600 font-bold">Asymmetric Egress</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forensic Evidence & Alert Inspection Modal */}
      <AlertDetailModal
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
        onResolve={handleResolveAlert}
      />
    </div>
  );
};
