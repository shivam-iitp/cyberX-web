import React, { useState } from 'react';
import { Alert } from '../types';
import { 
  X, 
  ShieldAlert, 
  CheckCircle, 
  Info, 
  Cpu, 
  FileText, 
  Database,
  Copy,
  Check,
  ArrowRight,
  ExternalLink,
  Clock,
  Radio,
  Server
} from 'lucide-react';
import { formatISTDateTime } from '../utils/time';

interface AlertDetailModalProps {
  alert: Alert | null;
  onClose: () => void;
  onResolve?: (id: string) => void;
}

export const AlertDetailModal: React.FC<AlertDetailModalProps> = ({ alert, onClose, onResolve }) => {
  const [copied, setCopied] = useState(false);

  if (!alert) return null;

  const handleCopyReport = () => {
    navigator.clipboard.writeText(JSON.stringify(alert, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'HIGH':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'MEDIUM':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl p-6 text-slate-800">
        
        {/* Header Bar */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 shadow-sm">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">{alert.threat_class}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getSeverityBadge(alert.severity)}`}>
                  {alert.severity}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-800 border border-slate-200">
                  Risk: {alert.risk_score.toFixed(0)}/100
                </span>
              </div>
              <div className="mt-1 flex items-center space-x-3 text-xs text-slate-500 font-medium">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatISTDateTime(alert.timestamp)}</span>
                </span>
                <span>•</span>
                <span>ID: <code className="text-slate-700 font-semibold">{alert.id}</code></span>
              </div>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5-Tuple Network Flow Metadata */}
        <div className="mt-5 space-y-2">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            5-Tuple Passive Flow Signature
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] uppercase text-slate-500 font-semibold block">Attacker (Src IP)</span>
              <p className="font-extrabold text-red-700 text-xs mt-0.5">
                {alert.src_ip}{alert.src_port ? `:${alert.src_port}` : ''}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] uppercase text-slate-500 font-semibold block">Target (Dst IP)</span>
              <p className="font-extrabold text-slate-800 text-xs mt-0.5">
                {alert.dst_ip}{alert.dst_port ? `:${alert.dst_port}` : ''}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] uppercase text-slate-500 font-semibold block">Protocol / Ingest</span>
              <p className="font-extrabold text-slate-800 text-xs mt-0.5">{alert.protocol} (Passive TAP)</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] uppercase text-slate-500 font-semibold block">ML Confidence</span>
              <p className="font-extrabold text-emerald-700 text-xs mt-0.5">
                {(alert.confidence * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Forensic Evidence & Quantitative Comparison */}
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-slate-900">
              <Info className="w-4 h-4 text-red-600" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider">
                Forensic Explainability & Quantitative Triggers
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200">
              {alert.evidence?.length || 1} Trigger Rule(s)
            </span>
          </div>

          <div className="space-y-2">
            {alert.evidence && alert.evidence.length > 0 ? (
              alert.evidence.map((ev, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-start justify-between">
                    <p className="text-xs font-bold text-slate-900">{ev.description}</p>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Metric: {ev.feature}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100 font-medium">
                    <div className="flex items-center justify-between bg-red-50/60 p-2 rounded-lg border border-red-100">
                      <span className="text-slate-600">Observed Value:</span>
                      <strong className="text-red-700 font-extrabold">{String(ev.value)}</strong>
                    </div>
                    <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <span className="text-slate-600">Safety Threshold:</span>
                      <strong className="text-slate-800 font-bold">
                        {ev.threshold !== null && ev.threshold !== undefined ? String(ev.threshold) : 'Dynamic Anomaly'}
                      </strong>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">Heuristic entropy and sliding window thresholds triggered this alert.</p>
            )}
          </div>
        </div>

        {/* Engine Provenance & Model Info */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-2.5">
            <Cpu className="w-4 h-4 text-slate-600 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Detection Method</span>
              <p className="font-bold text-slate-800 text-xs">{alert.detection_method}</p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-2.5">
            <Database className="w-4 h-4 text-slate-600 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Model Classifier</span>
              <p className="font-bold text-slate-800 text-xs">{alert.model_version || 'Random Forest v1.0'}</p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-2.5">
            <FileText className="w-4 h-4 text-slate-600 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Rule Provenance</span>
              <p className="font-bold text-slate-800 text-xs">{alert.rule_version || 'SIG-2026.09'}</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <button
            onClick={handleCopyReport}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center space-x-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied JSON Report' : 'Copy Forensic JSON'}</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Close
            </button>
            {onResolve && alert.status === 'OPEN' && (
              <button
                onClick={() => {
                  onResolve(alert.id);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center space-x-1.5 shadow-sm"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Mark Resolved</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
