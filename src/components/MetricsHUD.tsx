import React from 'react';
import { ShieldAlert, Zap, Layers, Gauge, Activity, Radio, Cpu } from 'lucide-react';

interface MetricsHUDProps {
  stats: {
    total_alerts: number;
    critical_alerts: number;
    high_alerts: number;
    active_incidents: number;
  };
  telemetry: {
    events_per_sec: number;
    flows_per_sec: number;
    avg_inference_latency_ms: number;
    p95_detection_latency_ms: number;
  };
}

export const MetricsHUD: React.FC<MetricsHUDProps> = ({ stats, telemetry }) => {
  const cards = [
    {
      label: 'Active Incidents',
      value: stats.active_incidents,
      unit: 'Correlated attack clusters',
      icon: Layers,
      bg: 'bg-red-50/60 border-red-200',
      countColor: 'text-red-700',
      labelColor: 'text-red-900',
      unitColor: 'text-red-700/80',
      iconBg: 'bg-red-100/80 text-red-700',
      badge: stats.active_incidents > 0 ? 'Active Case' : 'Nominal',
      badgeStyle: 'bg-red-100 text-red-800 border-red-200',
      svgWatermark: (
        <svg className="absolute -right-4 -bottom-4 w-28 h-28 text-red-600/10 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      )
    },
    {
      label: 'Critical Threats',
      value: stats.critical_alerts,
      unit: `Total Alerts: ${stats.total_alerts}`,
      icon: ShieldAlert,
      bg: 'bg-orange-50/60 border-orange-200',
      countColor: 'text-orange-700',
      labelColor: 'text-orange-950',
      unitColor: 'text-orange-700/80',
      iconBg: 'bg-orange-100/80 text-orange-700',
      badge: 'High Severity',
      badgeStyle: 'bg-orange-100 text-orange-800 border-orange-200',
      svgWatermark: (
        <svg className="absolute -right-4 -bottom-4 w-28 h-28 text-orange-600/10 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      )
    },
    {
      label: 'Measured Ingest Rate',
      value: `${telemetry.events_per_sec.toFixed(0)}`,
      unit: `Events/s (${telemetry.flows_per_sec.toFixed(0)} flows/s)`,
      icon: Zap,
      bg: 'bg-emerald-50/60 border-emerald-200',
      countColor: 'text-emerald-700',
      labelColor: 'text-emerald-950',
      unitColor: 'text-emerald-700/80',
      iconBg: 'bg-emerald-100/80 text-emerald-700',
      badge: 'Zero-Lag Pipeline',
      badgeStyle: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      svgWatermark: (
        <svg className="absolute -right-4 -bottom-4 w-28 h-28 text-emerald-600/10 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      )
    },
    {
      label: 'P95 Detection Latency',
      value: `${telemetry.p95_detection_latency_ms.toFixed(1)} ms`,
      unit: `ML Inference: ${telemetry.avg_inference_latency_ms.toFixed(2)} ms`,
      icon: Gauge,
      bg: 'bg-slate-50/90 border-slate-200',
      countColor: 'text-slate-900',
      labelColor: 'text-slate-900',
      unitColor: 'text-slate-600',
      iconBg: 'bg-slate-200/80 text-slate-800',
      badge: 'Sub-Millisecond',
      badgeStyle: 'bg-slate-200 text-slate-800 border-slate-300',
      svgWatermark: (
        <svg className="absolute -right-4 -bottom-4 w-28 h-28 text-slate-900/10 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 14 14" />
        </svg>
      )
    }
  ];

  return (
    <div id="tour-metrics-hud" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className={`relative overflow-hidden rounded-xl border p-4 shadow-sm transition-all hover:shadow-md ${card.bg}`}
          >
            {/* Background Vector SVG Watermark */}
            {card.svgWatermark}

            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-semibold uppercase tracking-wider ${card.labelColor}`}>
                  {card.label}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${card.badgeStyle}`}>
                  {card.badge}
                </span>
              </div>

              <div className="mt-3 flex items-baseline justify-between">
                <div>
                  <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${card.countColor}`}>
                    {card.value}
                  </span>
                  <p className={`mt-0.5 text-xs font-medium ${card.unitColor}`}>{card.unit}</p>
                </div>
                <div className={`p-2.5 rounded-xl ${card.iconBg} shadow-sm`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
