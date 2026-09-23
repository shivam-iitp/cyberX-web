import React from 'react';
import { Alert } from '../types';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import { formatISTTime } from '../utils/time';

interface LiveThreatFeedProps {
  alerts: Alert[];
  onSelectAlert: (alert: Alert) => void;
}

export const LiveThreatFeed: React.FC<LiveThreatFeedProps> = ({ alerts, onSelectAlert }) => {
  const getSeverityBadge = (severity: string) => {
    switch (severity.toUpperCase()) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 mr-1.5 animate-pulse"></span>
            CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-orange-50 text-orange-700 border border-orange-200">
            HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
            MEDIUM
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
            LOW
          </span>
        );
    }
  };

  const getRiskScorePill = (score: number) => {
    let style = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 85) style = 'text-red-700 bg-red-50 border-red-200';
    else if (score >= 70) style = 'text-orange-700 bg-orange-50 border-orange-200';
    else if (score >= 50) style = 'text-amber-700 bg-amber-50 border-amber-200';

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border ${style}`}>
        {score.toFixed(0)}
      </span>
    );
  };

  return (
    <div id="tour-threat-feed" className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-red-600 animate-ping"></div>
          <h2 className="text-xs font-bold text-slate-900 tracking-wider uppercase">
            Live Streamed Threat Feed
          </h2>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          {alerts.length} Events Detected
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="soc-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Threat Vector</th>
              <th>Severity</th>
              <th>Risk</th>
              <th>Attacker (Src)</th>
              <th>Target (Dst)</th>
              <th>Confidence</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {alerts.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-slate-400 text-xs font-medium">
                  Awaiting passive traffic or PCAP replay streaming...
                </td>
              </tr>
            ) : (
              alerts.slice(0, 15).map((alert) => (
                <tr
                  key={alert.id}
                  onClick={() => onSelectAlert(alert)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                >
                  <td className="text-slate-500 whitespace-nowrap text-[11px] font-medium">
                    {formatISTTime(alert.timestamp)}
                  </td>
                  <td className="font-semibold text-slate-900 whitespace-nowrap">
                    <div className="flex items-center space-x-1.5">
                      <span>{alert.threat_class}</span>
                      {alert.subtype && alert.subtype !== alert.threat_class && (
                        <span className="text-[11px] text-slate-400 font-normal">({alert.subtype})</span>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap">
                    {getSeverityBadge(alert.severity)}
                  </td>
                  <td className="whitespace-nowrap">
                    {getRiskScorePill(alert.risk_score)}
                  </td>
                  <td className="text-slate-900 whitespace-nowrap font-medium">
                    {alert.src_ip}
                    {alert.src_port ? `:${alert.src_port}` : ''}
                  </td>
                  <td className="text-slate-600 whitespace-nowrap font-normal">
                    {alert.dst_ip}
                    {alert.dst_port ? `:${alert.dst_port}` : ''}
                  </td>
                  <td className="text-emerald-700 font-semibold whitespace-nowrap">
                    {(alert.confidence * 100).toFixed(0)}%
                  </td>
                  <td className="text-right whitespace-nowrap">
                    <button className="inline-flex items-center space-x-1 text-red-600 hover:text-red-700 text-xs font-semibold group-hover:translate-x-0.5 transition-transform">
                      <span>Evidence</span>
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
  );
};
