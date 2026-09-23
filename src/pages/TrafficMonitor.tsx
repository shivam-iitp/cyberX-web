import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { TrafficSummary } from '../types';
import { Radio, ArrowUpDown } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export const TrafficMonitor: React.FC = () => {
  const [summary, setSummary] = useState<TrafficSummary | null>(null);

  useEffect(() => {
    const fetchTraffic = async () => {
      try {
        const res = await api.getTrafficSummary();
        setSummary(res);
      } catch (e) {
        console.error(e);
      }
    };
    fetchTraffic();
  }, []);

  return (
    <div id="tour-traffic-tab" className="space-y-4 animate-fadeIn pb-8 font-sans">
      {/* Header */}
      <div className="border-b border-slate-200 pb-3">
        <h1 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
          <Radio className="w-4 h-4 text-emerald-600" />
          <span>Passive Network Flows & Protocol Traffic</span>
        </h1>
        <p className="text-xs text-slate-500 font-normal mt-0.5">
          Real-time flow aggregation, protocol telemetry, and bidirectional bandwidth dynamics.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-sm">
          <span className="text-[10px] text-slate-500 uppercase font-semibold">Monitored Flows</span>
          <p className="text-xl font-extrabold text-slate-900 mt-0.5">
            {summary?.total_flows.toLocaleString() || '0'}
          </p>
        </div>
        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-sm">
          <span className="text-[10px] text-slate-500 uppercase font-semibold">Observed Volume</span>
          <p className="text-xl font-extrabold text-emerald-700 mt-0.5">
            {summary ? `${(summary.total_bytes / (1024 * 1024)).toFixed(1)} MB` : '0 MB'}
          </p>
        </div>
        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-sm">
          <span className="text-[10px] text-slate-500 uppercase font-semibold">Active Subnet Sources</span>
          <p className="text-xl font-extrabold text-slate-900 mt-0.5">
            {summary?.active_sources || '0'}
          </p>
        </div>
        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-sm">
          <span className="text-[10px] text-slate-500 uppercase font-semibold">Target Endpoints</span>
          <p className="text-xl font-extrabold text-slate-900 mt-0.5">
            {summary?.active_destinations || '0'}
          </p>
        </div>
      </div>

      {/* Bandwidth Chart */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
            <ArrowUpDown className="w-4 h-4 text-emerald-600" />
            <span>Ingress / Egress Bandwidth Timeline (Mbps)</span>
          </h3>
          <div className="flex items-center space-x-3 text-xs">
            <span className="text-red-600 flex items-center space-x-1 font-semibold">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              <span>Outbound</span>
            </span>
            <span className="text-emerald-700 flex items-center space-x-1 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>Inbound</span>
            </span>
          </div>
        </div>

        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={summary?.bandwidth_timeline || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} />
              <YAxis stroke="#94a3b8" fontSize={10} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '8px',
                  fontSize: '11px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area type="monotone" dataKey="outbound_mbps" stroke="#dc2626" fill="#dc2626" fillOpacity={0.15} />
              <Area type="monotone" dataKey="inbound_mbps" stroke="#16a34a" fill="#16a34a" fillOpacity={0.15} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Talkers Table */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
            Top Outbound Source Endpoints
          </h3>
          <div className="space-y-1.5">
            {summary?.top_sources?.map((s, i) => (
              <div key={i} className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-medium">
                <span className="text-red-700 font-bold">{s.ip}</span>
                <span className="text-slate-600">{(s.bytes / 1024 / 1024).toFixed(1)} MB ({s.flows} flows)</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
            Top Destination Endpoints
          </h3>
          <div className="space-y-1.5">
            {summary?.top_destinations?.map((d, i) => (
              <div key={i} className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-medium">
                <span className="text-slate-800 font-bold">{d.ip}</span>
                <span className="text-slate-600">{(d.bytes / 1024 / 1024).toFixed(1)} MB ({d.flows} flows)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
