import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  Clock,
  CheckCircle2
} from 'lucide-react';
import { formatISTDateTime } from '../utils/time';

interface AlertDetailModalProps {
  alert: Alert | null;
  onClose: () => void;
  onResolve?: (id: string) => void;
}

export const AlertDetailModal: React.FC<AlertDetailModalProps> = ({ alert, onClose, onResolve }) => {
  const [copied, setCopied] = useState(false);
  const [isResolving, setIsResolving] = useState(false);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (alert) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [alert]);

  if (!alert) return null;

  const isResolved = alert.status === 'RESOLVED';

  const handleCopyReport = () => {
    navigator.clipboard.writeText(JSON.stringify(alert, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResolveClick = async () => {
    if (!onResolve || isResolved) return;
    setIsResolving(true);
    try {
      await onResolve(alert.id);
    } finally {
      setIsResolving(false);
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[99999] w-screen h-screen bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn"
      style={{ top: 0, left: 0, right: 0, bottom: 0, margin: 0 }}
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl max-h-[88vh] overflow-y-auto rounded-2xl bg-white border border-slate-200 shadow-2xl p-5 sm:p-6 text-slate-800 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-xl border ${
              alert.severity === 'CRITICAL' 
                ? 'bg-red-50 border-red-200 text-red-600'
                : alert.severity === 'HIGH'
                ? 'bg-orange-50 border-orange-200 text-orange-600'
                : 'bg-amber-50 border-amber-200 text-amber-600'
            }`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  {alert.threat_class}
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  alert.severity === 'CRITICAL' 
                    ? 'bg-red-50 text-red-700 border-red-200' 
                    : alert.severity === 'HIGH'
                    ? 'bg-orange-50 text-orange-700 border-orange-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {alert.severity}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  isResolved 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  {isResolved ? 'RESOLVED' : 'OPEN'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium flex items-center space-x-1.5">
                <Clock className="w-3 h-3" />
                <span>{formatISTDateTime(alert.timestamp)}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 5-Tuple Network Flow Details */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] uppercase text-slate-400 font-semibold block">Attacker IP</span>
            <p className="font-bold text-red-700 mt-0.5 truncate">{alert.src_ip}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] uppercase text-slate-400 font-semibold block">Target IP</span>
            <p className="font-bold text-slate-800 mt-0.5 truncate">{alert.dst_ip}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] uppercase text-slate-400 font-semibold block">Protocol</span>
            <p className="font-bold text-slate-800 mt-0.5 truncate">{alert.protocol}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] uppercase text-slate-400 font-semibold block">ML Confidence</span>
            <p className="font-bold text-emerald-700 mt-0.5">{(alert.confidence * 100).toFixed(1)}%</p>
          </div>
        </div>

        {/* Forensic Evidence & Quantitative Comparison */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
              <Info className="w-3.5 h-3.5 text-red-600" />
              <span>Quantitative Evidence & Rule Match</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              Risk: {alert.risk_score.toFixed(0)}/100
            </span>
          </div>

          <div className="space-y-2">
            {alert.evidence && alert.evidence.length > 0 ? (
              alert.evidence.map((ev, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs space-y-1.5 shadow-2xs">
                  <p className="font-medium text-slate-800 leading-snug">{ev.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-100">
                    <div className="flex items-center justify-between bg-red-50/50 px-2 py-1 rounded">
                      <span className="text-slate-500">Observed:</span>
                      <strong className="text-red-700 font-bold">{String(ev.value)}</strong>
                    </div>
                    <div className="flex items-center justify-between bg-slate-50 px-2 py-1 rounded">
                      <span className="text-slate-500">Threshold:</span>
                      <strong className="text-slate-700 font-semibold">
                        {ev.threshold !== null && ev.threshold !== undefined ? String(ev.threshold) : 'Dynamic'}
                      </strong>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">Heuristic flow anomalies triggered this forensic detection.</p>
            )}
          </div>
        </div>

        {/* Engine Provenance */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
            <span className="text-[10px] uppercase text-slate-400 font-semibold block">Method</span>
            <p className="font-bold text-slate-800 mt-0.5 text-[11px]">{alert.detection_method}</p>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
            <span className="text-[10px] uppercase text-slate-400 font-semibold block">Model</span>
            <p className="font-bold text-slate-800 mt-0.5 text-[11px]">{alert.model_version || 'rf-v1.0'}</p>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
            <span className="text-[10px] uppercase text-slate-400 font-semibold block">Rule ID</span>
            <p className="font-bold text-slate-800 mt-0.5 text-[11px]">{alert.rule_version || 'rules-v1.0'}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={handleCopyReport}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center space-x-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Close
            </button>

            {isResolved ? (
              <span className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Resolved</span>
              </span>
            ) : (
              <button
                onClick={handleResolveClick}
                disabled={isResolving}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all flex items-center space-x-1.5 shadow-sm disabled:opacity-50"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{isResolving ? 'Resolving...' : 'Mark Resolved'}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
