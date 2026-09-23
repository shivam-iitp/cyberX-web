import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ThreatAnalytics as ThreatAnalyticsType } from '../types';
import { BarChart3, TrendingUp, ShieldAlert, Target, Users } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';

export const ThreatAnalytics: React.FC = () => {
  const [data, setData] = useState<ThreatAnalyticsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.getThreats();
        setData(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const breakdownData = data?.threat_breakdown && Object.keys(data.threat_breakdown).length > 0
    ? Object.entries(data.threat_breakdown).map(([name, count]) => ({ name, count }))
    : [];

  const timelineData = data?.timeline && data.timeline.length > 0
    ? data.timeline
    : [];

  const BAR_COLORS = ['#dc2626', '#ea580c', '#16a34a', '#0284c7', '#7c3aed', '#ca8a04'];

  return (
    <div id="tour-analytics-tab" className="space-y-4 animate-fadeIn pb-8 font-sans">
      {/* Header */}
      <div className="border-b border-slate-200 pb-3">
        <h1 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
          <BarChart3 className="w-4 h-4 text-red-600" />
          <span>Threat Intelligence & Pattern Analytics</span>
        </h1>
        <p className="text-xs text-slate-500 font-normal mt-0.5">
          Dynamic distributions, adversary source IP concentrations, and time-series anomaly risk scores.
        </p>
      </div>

      {/* Grid: Timeline & Threat Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Threat Timeline Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
              <TrendingUp className="w-4 h-4 text-red-600" />
              <span>Anomaly Risk Score Timeline</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-semibold">Time-Series</span>
          </div>

          <div className="h-56">
            {timelineData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData}>
                  <defs>
                    <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc2626" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={10} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e2e8f0',
                      borderRadius: '8px',
                      fontSize: '11px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area type="monotone" dataKey="risk_score" stroke="#dc2626" strokeWidth={2} fillOpacity={1} fill="url(#riskGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs font-medium">
                Awaiting active threat data from stream...
              </div>
            )}
          </div>
        </div>

        {/* Threat Categories Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>Detections by Threat Category</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-semibold">Total: {data?.total_alerts || 0}</span>
          </div>

          <div className="h-56">
            {breakdownData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={breakdownData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} interval={0} angle={-10} textAnchor="end" height={35} />
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
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {breakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs font-medium">
                No threat categories recorded yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Attackers and Targets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5 mb-2.5">
            <Users className="w-4 h-4 text-red-600" />
            <span>Top Adversary Source IPs</span>
          </h3>
          <div className="space-y-1.5">
            {data?.top_attackers && data.top_attackers.length > 0 ? (
              data.top_attackers.map((att, i) => (
                <div key={i} className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-medium">
                  <span className="text-red-700 font-bold">{att.ip}</span>
                  <span className="text-slate-600">{att.count} detections</span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-xs py-4 text-center font-medium">No adversary source IPs recorded.</p>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5 mb-2.5">
            <Target className="w-4 h-4 text-emerald-600" />
            <span>Top Targeted Internal Endpoints</span>
          </h3>
          <div className="space-y-1.5">
            {data?.top_targets && data.top_targets.length > 0 ? (
              data.top_targets.map((tgt, i) => (
                <div key={i} className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-medium">
                  <span className="text-slate-900 font-bold">{tgt.ip}</span>
                  <span className="text-slate-600">{tgt.count} incidents</span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-xs py-4 text-center font-medium">No targeted endpoints recorded.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
