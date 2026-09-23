import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { wsStream } from '../services/websocket';
import { PcapFileItem, ReplayStatus } from '../types';
import { audioAlarm } from '../utils/audioAlarm';
import { 
  PlayCircle, 
  Pause, 
  Play, 
  Square, 
  FileCode, 
  CheckCircle2, 
  Zap,
  Gauge,
  ChevronDown,
  Layers,
  Sparkles,
  Volume2,
  VolumeX,
  BellRing
} from 'lucide-react';

const FALLBACK_PCAPS: PcapFileItem[] = [
  { filename: 'syn_flood_ddos.pcap', size_kb: 450.2, threat_category: 'Volumetric DDoS', packet_count: 5000 },
  { filename: 'c2_beaconing.pcap', size_kb: 280.6, threat_category: 'Botnet C2 Beaconing', packet_count: 2400 },
  { filename: 'dga_domain.pcap', size_kb: 195.4, threat_category: 'DGA Domain', packet_count: 1800 },
  { filename: 'dns_tunneling.pcap', size_kb: 320.1, threat_category: 'DNS Tunnelling', packet_count: 3100 },
  { filename: 'port_scan.pcap', size_kb: 150.8, threat_category: 'Reconnaissance', packet_count: 1200 },
  { filename: 'data_exfiltration.pcap', size_kb: 512.0, threat_category: 'Data Exfiltration', packet_count: 4200 },
  { filename: 'encrypted_malware_tls.pcap', size_kb: 390.5, threat_category: 'Malware in Encrypted Sessions', packet_count: 2900 }
];

export const PCAPReplay: React.FC = () => {
  const [pcaps, setPcaps] = useState<PcapFileItem[]>(FALLBACK_PCAPS);
  const [selectedPcap, setSelectedPcap] = useState<string>('syn_flood_ddos.pcap');
  const [speed, setSpeed] = useState<number>(2.0);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(!audioAlarm.isSoundEnabled);
  const [lastAlarmTime, setLastAlarmTime] = useState<number>(0);
  const prevAlertCount = useRef<number>(0);

  const [replayStatus, setReplayStatus] = useState<ReplayStatus>({
    status: 'IDLE',
    total_packets: 0,
    processed_packets: 0,
    total_flows: 0,
    alerts_triggered: 0,
    replay_speed: 1.0,
    progress_percentage: 0.0,
    elapsed_seconds: 0.0
  });

  const updateReplayAndCheckAudio = (st: ReplayStatus) => {
    setReplayStatus(st);
    if (st.alerts_triggered > prevAlertCount.current) {
      audioAlarm.playThreatAlarm('CRITICAL');
      prevAlertCount.current = st.alerts_triggered;
      setLastAlarmTime(Date.now());
    }
  };

  const loadPcaps = async () => {
    try {
      const list = await api.getPcapsList();
      if (list && list.length > 0) {
        setPcaps(list);
        if (!selectedPcap) setSelectedPcap(list[0].filename);
      }
    } catch (e) {
      console.warn('Using built-in sample PCAPs:', e);
    }
  };

  const loadStatus = async () => {
    try {
      const st = await api.getReplayStatus();
      setReplayStatus(st);
      prevAlertCount.current = st.alerts_triggered;
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadPcaps();
    loadStatus();

    // Listen to real-time progress via WebSocket
    const unsubscribe = wsStream.subscribe((msg) => {
      if (msg.type === 'REPLAY_PROGRESS' || msg.type === 'REPLAY_COMPLETED') {
        updateReplayAndCheckAudio(msg.data);
      }
    });

    // Fallback polling to guarantee smooth real-time progress bar animation
    const interval = setInterval(async () => {
      try {
        const st = await api.getReplayStatus();
        if (st.status === 'RUNNING' || st.status === 'PAUSED') {
          updateReplayAndCheckAudio(st);
        }
      } catch {}
    }, 400);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const handleStart = async () => {
    try {
      // Unlock audio context explicitly on user click
      audioAlarm.unlock();
      prevAlertCount.current = 0;
      const res = await api.startReplay(selectedPcap, speed);
      updateReplayAndCheckAudio(res);
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleSound = () => {
    const enabled = audioAlarm.toggleSound();
    setIsAudioMuted(!enabled);
  };

  const handleTestAlarm = () => {
    audioAlarm.testAlarm();
    setLastAlarmTime(Date.now());
  };

  const handlePause = async () => {
    try {
      const res = await api.pauseReplay();
      setReplayStatus(res);
    } catch (e) {
      console.error(e);
    }
  };

  const handleResume = async () => {
    try {
      const res = await api.resumeReplay();
      setReplayStatus(res);
    } catch (e) {
      console.error(e);
    }
  };

  const handleStop = async () => {
    try {
      const res = await api.stopReplay();
      setReplayStatus(res);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSpeedChange = async (newSpeed: number) => {
    setSpeed(newSpeed);
    if (replayStatus.status === 'RUNNING') {
      try {
        const res = await api.setReplaySpeed(newSpeed);
        setReplayStatus(res);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const currentPcapMeta = pcaps.find(p => p.filename === selectedPcap) || pcaps[0];

  return (
    <div id="tour-replay-tab" className="space-y-4 animate-fadeIn pb-8 font-sans">
      {/* Header */}
      <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
            <PlayCircle className="w-5 h-5 text-red-600" />
            <span>Passive PCAP Replay & Attack Simulator</span>
          </h1>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Stream synthetic and genuine attack datasets through the real-time detection pipeline to observe live threat alarms.
          </p>
        </div>

        {/* Audio Alarm Quick Controls */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={handleToggleSound}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all border ${
              !isAudioMuted
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
            title="Toggle Threat Alarm Audio"
          >
            {!isAudioMuted ? <Volume2 className="w-3.5 h-3.5 text-emerald-600" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
            <span>Alarm Audio: {!isAudioMuted ? 'ON' : 'MUTED'}</span>
          </button>

          <button
            onClick={handleTestAlarm}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 flex items-center space-x-1.5 shadow-2xs transition-all active:scale-95"
            title="Test SOC Threat Alarm Siren"
          >
            <BellRing className={`w-3.5 h-3.5 text-red-600 ${Date.now() - lastAlarmTime < 1500 ? 'animate-bounce' : ''}`} />
            <span>Test Sound 🔔</span>
          </button>
        </div>
      </div>

      {/* Main Replay Console */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-5">
        
        {/* Top Control Form: Dropdown, Speed & Start Stream perfectly aligned */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          
          {/* 1. Attack Dataset Dropdown (Span 6) */}
          <div className="md:col-span-6 space-y-1.5">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block flex items-center justify-between">
              <span>1. Select Attack Scenario Dataset</span>
              <span className="text-[10px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                {currentPcapMeta?.threat_category || 'Synthetic Attack'}
              </span>
            </label>
            <div className="relative">
              <select
                id="tour-pcap-select"
                value={selectedPcap}
                onChange={(e) => setSelectedPcap(e.target.value)}
                disabled={replayStatus.status === 'RUNNING'}
                className="w-full appearance-none bg-slate-50 hover:bg-slate-100/80 border border-slate-300 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-red-500 transition-colors cursor-pointer"
              >
                {pcaps.map((p) => (
                  <option key={p.filename} value={p.filename}>
                    {p.filename} — [{p.threat_category}] ({p.size_kb} KB)
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-3 pointer-events-none text-slate-500">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* 2. Speed Multiplier (Span 3) */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              2. Replay Speed: <strong className="text-red-600 font-extrabold">{speed}x</strong>
            </label>
            <div className="flex items-center space-x-1">
              {[0.5, 1.0, 2.0, 5.0, 10.0].map((s) => (
                <button
                  key={s}
                  onClick={() => handleSpeedChange(s)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    speed === s
                      ? 'bg-red-600 text-white border border-red-600 shadow-sm'
                      : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* 3. Action Buttons (Span 3) */}
          <div className="md:col-span-3 flex items-center space-x-2">
            {replayStatus.status === 'RUNNING' ? (
              <button
                onClick={handlePause}
                className="flex-1 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center space-x-1.5 shadow-sm transition-all text-xs"
              >
                <Pause className="w-4 h-4 fill-white" />
                <span>Pause</span>
              </button>
            ) : replayStatus.status === 'PAUSED' ? (
              <button
                onClick={handleResume}
                className="flex-1 py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center space-x-1.5 shadow-sm transition-all text-xs"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Resume</span>
              </button>
            ) : (
              <button
                id="tour-pcap-start-btn"
                onClick={handleStart}
                className="flex-1 py-2.5 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white flex items-center justify-center space-x-1.5 shadow-sm transition-all text-xs hover:shadow-md"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start Stream</span>
              </button>
            )}

            {(replayStatus.status === 'RUNNING' || replayStatus.status === 'PAUSED') && (
              <button
                onClick={handleStop}
                className="px-3.5 py-2.5 rounded-xl font-bold bg-slate-800 hover:bg-slate-900 text-white flex items-center justify-center space-x-1.5 shadow-sm transition-all text-xs"
                title="Stop Replay"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>Stop</span>
              </button>
            )}
          </div>

        </div>

        {/* Live Replay Progress HUD */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-700 uppercase flex items-center space-x-2">
              <span className={`w-2.5 h-2.5 rounded-full ${replayStatus.status === 'RUNNING' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
              <span>Status: <strong className="text-slate-900 font-extrabold">{replayStatus.status}</strong></span>
            </span>
            <span className="text-slate-800 font-bold text-xs">
              {replayStatus.processed_packets.toLocaleString()} / {replayStatus.total_packets.toLocaleString()} Packets ({replayStatus.progress_percentage.toFixed(0)}%)
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
            <div
              className="bg-red-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${replayStatus.progress_percentage}%` }}
            ></div>
          </div>

          {/* Telemetry counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 text-[10px] uppercase font-semibold">Streamed Packets</span>
              <p className="text-lg font-extrabold text-slate-900 mt-0.5">{replayStatus.processed_packets.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 text-[10px] uppercase font-semibold">Alarms Triggered</span>
              <p className="text-lg font-extrabold text-red-600 mt-0.5">{replayStatus.alerts_triggered}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 text-[10px] uppercase font-semibold">Active Speed</span>
              <p className="text-lg font-extrabold text-slate-800 mt-0.5">{replayStatus.replay_speed}x</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 text-[10px] uppercase font-semibold">Elapsed Duration</span>
              <p className="text-lg font-extrabold text-emerald-700 mt-0.5">{replayStatus.elapsed_seconds.toFixed(1)}s</p>
            </div>
          </div>
        </div>

      </div>

      {/* Dataset Directory & Attack Descriptions */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm text-xs">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
          <Layers className="w-4 h-4 text-red-600" />
          <span>Available Attack Scenarios in Library ({pcaps.length})</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {pcaps.map((p) => (
            <div
              key={p.filename}
              onClick={() => {
                if (replayStatus.status !== 'RUNNING') setSelectedPcap(p.filename);
              }}
              className={`p-3 rounded-xl border flex items-center justify-between font-medium cursor-pointer transition-colors ${
                selectedPcap === p.filename
                  ? 'border-red-500 bg-red-50/30'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70'
              }`}
            >
              <div>
                <span className="text-slate-900 font-bold block">{p.filename}</span>
                <p className="text-[11px] text-slate-500 mt-0.5">{p.size_kb} KB • {p.packet_count || 3000} packets</p>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200 font-semibold shadow-2xs">
                {p.threat_category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
