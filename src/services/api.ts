import axios from 'axios';
import {
  Alert,
  Incident,
  ThreatAnalytics,
  TrafficSummary,
  SystemHealth,
  ModelVersion,
  DetectionRule,
  PcapFileItem,
  ReplayStatus
} from '../types';

const API_BASE = `${import.meta.env.VITE_API_URL || ''}/api/v1`;

export const api = {
  // Alerts
  getAlerts: async (params?: { threat_class?: string; severity?: string; src_ip?: string; limit?: number }) => {
    const res = await axios.get<Alert[]>(`${API_BASE}/alerts`, { params });
    return res.data;
  },
  getAlertDetail: async (id: string) => {
    const res = await axios.get<Alert>(`${API_BASE}/alerts/${id}`);
    return res.data;
  },
  resolveAlert: async (id: string) => {
    const res = await axios.post(`${API_BASE}/alerts/${id}/resolve`);
    return res.data;
  },

  // Incidents
  getIncidents: async (params?: { status?: string; severity?: string }) => {
    const res = await axios.get<Incident[]>(`${API_BASE}/incidents`, { params });
    return res.data;
  },
  getIncidentDetail: async (id: string) => {
    const res = await axios.get<Incident>(`${API_BASE}/incidents/${id}`);
    return res.data;
  },

  // Threats & Statistics
  getThreats: async () => {
    const res = await axios.get<ThreatAnalytics>(`${API_BASE}/threats`);
    return res.data;
  },
  getStatistics: async () => {
    const res = await axios.get(`${API_BASE}/statistics`);
    return res.data;
  },
  getTrafficSummary: async () => {
    const res = await axios.get<TrafficSummary>(`${API_BASE}/traffic/summary`);
    return res.data;
  },

  // PCAP Replay
  getPcapsList: async () => {
    const res = await axios.get<PcapFileItem[]>(`${API_BASE}/replay/list`);
    return res.data;
  },
  getReplayStatus: async () => {
    const res = await axios.get<ReplayStatus>(`${API_BASE}/replay/status`);
    return res.data;
  },
  startReplay: async (pcap_filename: string, speed: number = 1.0) => {
    const res = await axios.post<ReplayStatus>(`${API_BASE}/replay/start`, { pcap_filename, speed });
    return res.data;
  },
  pauseReplay: async () => {
    const res = await axios.post<ReplayStatus>(`${API_BASE}/replay/pause`);
    return res.data;
  },
  resumeReplay: async () => {
    const res = await axios.post<ReplayStatus>(`${API_BASE}/replay/resume`);
    return res.data;
  },
  stopReplay: async () => {
    const res = await axios.post<ReplayStatus>(`${API_BASE}/replay/stop`);
    return res.data;
  },
  setReplaySpeed: async (speed: number) => {
    const res = await axios.post<ReplayStatus>(`${API_BASE}/replay/speed?speed=${speed}`);
    return res.data;
  },

  // Models & Rules
  getModels: async () => {
    const res = await axios.get<ModelVersion[]>(`${API_BASE}/models`);
    return res.data;
  },
  getRules: async () => {
    const res = await axios.get<DetectionRule[]>(`${API_BASE}/rules`);
    return res.data;
  },
  updateRule: async (id: string, data: Partial<DetectionRule>) => {
    const res = await axios.patch<DetectionRule>(`${API_BASE}/rules/${id}`, data);
    return res.data;
  },

  // System & Benchmarking
  getSystemStatus: async () => {
    const res = await axios.get<SystemHealth>(`${API_BASE}/system/status`);
    return res.data;
  },
  getPerformanceMetrics: async () => {
    const res = await axios.get(`${API_BASE}/performance`);
    return res.data;
  },
  runBenchmark: async (event_count: number = 1500) => {
    const res = await axios.post(`${API_BASE}/benchmark/run?event_count=${event_count}`);
    return res.data;
  }
};
