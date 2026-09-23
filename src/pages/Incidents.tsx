import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Incident } from '../types';
import { Layers, ShieldAlert, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { formatISTTime } from '../utils/time';

export const Incidents: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);

  const loadIncidents = async () => {
    setLoading(true);
    try {
      const data = await api.getIncidents();
      setIncidents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const handleSelectIncident = async (inc: Incident) => {
    try {
      const fullDetail = await api.getIncidentDetail(inc.id);
      setSelectedIncident(fullDetail);
    } catch (e) {
      setSelectedIncident(inc);
    }
  };

  return (
    <div id="tour-incidents-tab" className="space-y-4 animate-fadeIn pb-8 font-sans">
      {/* Header */}
      <div className="border-b border-slate-200 pb-3">
        <h1 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
          <Layers className="w-4 h-4 text-red-600" />
          <span>Multi-Stage Attack Incident Clustering</span>
        </h1>
        <p className="text-xs text-slate-500 font-normal mt-0.5">
          Automatic deduplication and event correlation grouping repetitive attacker flows into clean incident cases.
        </p>
      </div>

      {/* Grid: Incidents List & Incident Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Incidents List (Span 2) */}
        <div className="lg:col-span-2 space-y-2.5">
          {incidents.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
              No active incidents found. Stream an attack PCAP from the PCAP Lab to observe incident clustering.
            </div>
          ) : (
            incidents.map((inc) => (
              <div
                key={inc.id}
                onClick={() => handleSelectIncident(inc)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedIncident?.id === inc.id
                    ? 'border-red-500 bg-red-50/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-600">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900">{inc.id}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-red-50 text-red-700 border border-red-200">
                          {inc.severity}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {inc.alert_count} Alerts Clustered
                        </span>
                      </div>
                      <h3 className="font-semibold text-xs text-slate-900 mt-1">{inc.title}</h3>
                    </div>
                  </div>

                  <span className="text-xs font-extrabold text-slate-900">
                    Risk: {inc.risk_score.toFixed(0)}/100
                  </span>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2 font-medium">
                  <div className="flex items-center space-x-3">
                    <span>Source: <strong className="text-slate-800">{inc.src_ip}</strong></span>
                    {inc.dst_ip && <span>Target: <strong className="text-slate-700">{inc.dst_ip}</strong></span>}
                  </div>
                  <span>{formatISTTime(inc.created_at)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Incident Detail Drawer (Span 1) */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="border-b border-slate-100 pb-2.5">
            <h3 className="text-xs font-bold uppercase text-slate-900 tracking-wider flex items-center space-x-1.5">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>Incident Chronology & Context</span>
            </h3>
          </div>

          {selectedIncident ? (
            <div className="mt-3 space-y-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Case Reference</span>
                <p className="text-xs font-bold text-slate-900 mt-0.5">{selectedIncident.id}</p>
                <p className="text-[11px] text-slate-600 mt-0.5 font-normal">{selectedIncident.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-medium">Status:</span>
                  <p className="text-emerald-700 font-bold">{selectedIncident.status}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-medium">Primary Vector:</span>
                  <p className="text-red-600 font-bold">{selectedIncident.primary_threat_class}</p>
                </div>
              </div>

              {/* Correlated Alerts List */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-500 uppercase font-semibold block">
                  Aggregated Flow Events ({selectedIncident.alerts?.length || selectedIncident.alert_count})
                </span>
                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                  {selectedIncident.alerts && selectedIncident.alerts.length > 0 ? (
                    selectedIncident.alerts.map((a, i) => (
                      <div key={a.id || i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                        <div className="flex justify-between font-semibold text-slate-900">
                          <span>{a.threat_class}</span>
                          <span className="text-red-700 font-bold">{a.severity}</span>
                        </div>
                        <div className="mt-0.5 flex justify-between text-[10px] text-slate-500 font-medium">
                          <span>Confidence: {(a.confidence * 100).toFixed(0)}%</span>
                          <span>{formatISTTime(a.timestamp)}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 text-xs font-medium">
                      {selectedIncident.alert_count} consecutive threat detections aggregated into this case.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs font-medium">
              Select an incident from the left to view multi-stage attack chronology and forensic details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
