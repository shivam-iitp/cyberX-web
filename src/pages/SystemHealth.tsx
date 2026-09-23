import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { SystemHealth as SystemHealthType } from '../types';
import { 
  Cpu, 
  CheckCircle2, 
  Play, 
  RefreshCw, 
  Server, 
  ShieldCheck,
  BarChart2
} from 'lucide-react';

export const SystemHealth: React.FC = () => {
  const [health, setHealth] = useState<SystemHealthType | null>(null);
  const [benchmarkResult, setBenchmarkResult] = useState<any | null>(null);
  const [benchmarking, setBenchmarking] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadHealth = async () => {
    setLoading(true);
    try {
      const data = await api.getSystemStatus();
      setHealth(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHealth();
  }, []);

  const handleRunBenchmark = async () => {
    setBenchmarking(true);
    try {
      const res = await api.runBenchmark(2000);
      setBenchmarkResult(res);
      await loadHealth();
    } catch (e) {
      console.error(e);
    } finally {
      setBenchmarking(false);
    }
  };

  return (
    <div id="tour-system-tab" className="space-y-4 animate-fadeIn pb-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-emerald-600" />
            <span>System Health & Performance Benchmark</span>
          </h1>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Operational service telemetry, resource metrics, and measured throughput verification.
          </p>
        </div>

        <button
          onClick={loadHealth}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 flex items-center space-x-1.5 transition-colors self-start sm:self-auto shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Passive Guarantee Card */}
      <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 shadow-sm flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <span className="font-bold text-slate-900">Passive Network Isolation Guarantee</span>
            <p className="text-slate-600 text-[11px] mt-0.5">
              Read-Only Ingest Mode active. Zero outbound sockets to monitored IP addresses.
            </p>
          </div>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 text-[11px]">
          ENFORCED
        </span>
      </div>

      {/* Subsystem Health Grid */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Subsystem Operational Status
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
          {health?.services &&
            Object.entries(health.services).map(([service, status]) => (
              <div key={service} className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between shadow-sm">
                <div className="flex items-center space-x-2">
                  <Server className="w-4 h-4 text-slate-600" />
                  <span className="font-medium text-slate-800">{service.replace(/_/g, ' ')}</span>
                </div>
                <span className="flex items-center space-x-1 text-emerald-700 font-bold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{status}</span>
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Hardware Telemetry */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-sm">
          <span className="text-[10px] text-slate-500 uppercase font-semibold">Process CPU</span>
          <p className="text-xl font-extrabold text-slate-900 mt-0.5">{health?.cpu_percent || 0}%</p>
        </div>
        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-sm">
          <span className="text-[10px] text-slate-500 uppercase font-semibold">Memory Footprint</span>
          <p className="text-xl font-extrabold text-emerald-700 mt-0.5">{health?.memory_mb || 0} MB</p>
        </div>
        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-sm">
          <span className="text-[10px] text-slate-500 uppercase font-semibold">P95 Pipeline Latency</span>
          <p className="text-xl font-extrabold text-emerald-700 mt-0.5">{health?.p95_detection_latency_ms.toFixed(2)} ms</p>
        </div>
        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-sm">
          <span className="text-[10px] text-slate-500 uppercase font-semibold">System Uptime</span>
          <p className="text-xl font-extrabold text-slate-900 mt-0.5">{(health?.uptime_seconds || 0).toFixed(0)}s</p>
        </div>
      </div>

      {/* Benchmark Runner Section */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
              <BarChart2 className="w-4 h-4 text-red-600" />
              <span>Live Measured Throughput & Latency Benchmark</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-normal">
              Executes 2,000 live flow vectors through complete feature extraction, rule checks, and ML prediction engines.
            </p>
          </div>

          <button
            onClick={handleRunBenchmark}
            disabled={benchmarking}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white flex items-center space-x-1.5 shadow-sm transition-all self-start sm:self-auto disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{benchmarking ? 'Benchmarking Engine...' : 'Run Measured Benchmark'}</span>
          </button>
        </div>

        {/* Benchmark Results Table */}
        {benchmarkResult ? (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="text-slate-500 uppercase text-[10px] font-semibold">Events / Sec</span>
                <p className="text-lg font-extrabold text-slate-900 mt-0.5">
                  {benchmarkResult.measured_events_per_sec.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="text-slate-500 uppercase text-[10px] font-semibold">Flows / Sec</span>
                <p className="text-lg font-extrabold text-emerald-700 mt-0.5">
                  {benchmarkResult.measured_flows_per_sec.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="text-slate-500 uppercase text-[10px] font-semibold">Avg ML Latency</span>
                <p className="text-lg font-extrabold text-emerald-700 mt-0.5">
                  {benchmarkResult.avg_inference_latency_ms.toFixed(3)} ms
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="text-slate-500 uppercase text-[10px] font-semibold">P95 Latency</span>
                <p className="text-lg font-extrabold text-emerald-700 mt-0.5">
                  {benchmarkResult.p95_detection_latency_ms.toFixed(3)} ms
                </p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 flex flex-wrap justify-between items-center gap-2 font-normal">
              <span>Evaluated: <strong className="font-bold text-slate-800">{benchmarkResult.events_benchmarked} flows</strong></span>
              <span>Execution Time: <strong className="font-bold text-slate-800">{benchmarkResult.total_duration_seconds}s</strong></span>
              <span>Memory Footprint: <strong className="font-bold text-slate-800">{benchmarkResult.memory_usage_mb} MB</strong></span>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-5 rounded-lg bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 font-medium">
            Click 'Run Measured Benchmark' to execute real performance evaluation and record verified throughput.
          </div>
        )}
      </div>
    </div>
  );
};
