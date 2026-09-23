export interface EvidenceItem {
  feature: string;
  value: any;
  threshold?: any;
  baseline?: any;
  description: string;
}

export interface Alert {
  id: string;
  incident_id?: string;
  timestamp: string;
  flow_id?: string;
  threat_class: string;
  subtype?: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  confidence: number;
  risk_score: number;
  src_ip: string;
  src_port?: number;
  dst_ip: string;
  dst_port?: number;
  protocol: string;
  evidence: EvidenceItem[];
  feature_snapshot: Record<string, any>;
  detection_method: 'RULE' | 'STATISTICAL' | 'ML' | 'HYBRID';
  model_version: string;
  rule_version: string;
  status: 'OPEN' | 'RESOLVED' | 'SUPPRESSED';
}

export interface Incident {
  id: string;
  created_at: string;
  updated_at: string;
  status: 'OPEN' | 'INVESTIGATING' | 'MITIGATED' | 'RESOLVED';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  primary_threat_class: string;
  src_ip: string;
  dst_ip?: string;
  title: string;
  summary?: string;
  risk_score: number;
  alert_count: number;
  alerts?: Alert[];
}

export interface DetectionRule {
  id: string;
  name: string;
  threat_class: string;
  description: string;
  threshold: number;
  unit: string;
  severity: string;
  is_enabled: boolean;
  version: string;
}

export interface ModelVersion {
  id: string;
  name: string;
  model_type: string;
  version: string;
  f1_score: number;
  precision: number;
  recall: number;
  inference_latency_ms: number;
  features_used: string[];
  status: string;
  created_at: string;
}

export interface ReplayStatus {
  status: 'IDLE' | 'RUNNING' | 'PAUSED' | 'STOPPED' | 'COMPLETED' | 'FAILED';
  current_pcap?: string;
  total_packets: number;
  processed_packets: number;
  total_flows: number;
  alerts_triggered: number;
  replay_speed: number;
  progress_percentage: number;
  elapsed_seconds: number;
}

export interface PcapFileItem {
  filename: string;
  size_kb: number;
  threat_category: string;
  path?: string;
  packet_count?: number;
}

export interface SystemHealth {
  status: string;
  app_version: string;
  ingest_mode: string;
  passive_guarantee_verified: boolean;
  services: Record<string, string>;
  uptime_seconds: number;
  events_per_sec: number;
  flows_per_sec: number;
  avg_inference_latency_ms: number;
  p95_detection_latency_ms: number;
  cpu_percent: number;
  memory_mb: number;
}

export interface ThreatAnalytics {
  total_alerts: number;
  critical_alerts: number;
  high_alerts: number;
  medium_alerts: number;
  low_alerts: number;
  threat_breakdown: Record<string, number>;
  timeline: Array<{
    time: string;
    threat: string;
    risk_score: number;
    severity: string;
  }>;
  top_attackers: Array<{ ip: string; count: number }>;
  top_targets: Array<{ ip: string; count: number }>;
}

export interface TrafficSummary {
  total_events: number;
  total_flows: number;
  total_bytes: number;
  active_sources: number;
  active_destinations: number;
  protocol_distribution: Record<string, number>;
  top_sources: Array<{ ip: string; bytes: number; flows: number }>;
  top_destinations: Array<{ ip: string; bytes: number; flows: number }>;
  bandwidth_timeline: Array<{ time: string; inbound_mbps: number; outbound_mbps: number }>;
}
