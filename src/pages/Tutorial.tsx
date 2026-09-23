import React from 'react';
import { useTour, TOUR_STEPS } from '../context/TourContext';
import { 
  Compass, 
  Play, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Sliders, 
  Layers, 
  Cpu, 
  ArrowRight,
  Sparkles,
  HelpCircle,
  Eye,
  CheckCircle2
} from 'lucide-react';

export const Tutorial: React.FC = () => {
  const { startTour, goToStep } = useTour();

  const chapters = [
    {
      stepIndex: 0,
      title: '1. One-Way Passive Architecture',
      badge: 'Zero-Return Invariant',
      icon: ShieldCheck,
      color: 'text-red-600 bg-red-50 border-red-200',
      description: 'Understand how the system receives optical SPAN/TAP copies without ever emitting network packets or performing active scans to observed endpoints.'
    },
    {
      stepIndex: 1,
      title: '2. Real-Time Telemetry HUD',
      badge: 'Non-Fabricated Metrics',
      icon: Zap,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      description: 'Learn how measured event rates (events/s), active flows, and sub-millisecond detection latency are computed live from internal pipeline meters.'
    },
    {
      stepIndex: 2,
      title: '3. Live Threat Feed & Forensic Scoring',
      badge: 'Real-Time Streaming',
      icon: Activity,
      color: 'text-red-600 bg-red-50 border-red-200',
      description: 'Discover how multi-stage threat events are classified, assigned risk scores (0–100), and displayed with explainable evidence.'
    },
    {
      stepIndex: 3,
      title: '4. PCAP Replay Lab & Attack Simulator',
      badge: 'SIH Demo Core',
      icon: Play,
      color: 'text-red-600 bg-red-50 border-red-200',
      description: 'Step-by-step instructions on streaming pre-configured attack datasets (DDoS, C2 beaconing, DGA, tunnels, scans, exfil) at 0.5x to 10x speeds.'
    },
    {
      stepIndex: 4,
      title: '5. Multi-Stage Incident Correlator',
      badge: 'Case Management',
      icon: Layers,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      description: 'See how the deduplication engine prevents alert flooding and clusters related attacker actions into clean incident cases.'
    },
    {
      stepIndex: 6,
      title: '6. AI/ML Models & Rule Calibration',
      badge: 'Decision Intelligence',
      icon: Sliders,
      color: 'text-red-600 bg-red-50 border-red-200',
      description: 'Explore the Random Forest classifier, Isolation Forest anomaly detector, and live threshold configuration tools.'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12 font-sans max-w-6xl mx-auto">
      {/* Top Hero Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
              INTERACTIVE USER GUIDE
            </span>
            <span className="text-xs text-slate-500 font-medium">Smart India Hackathon Working Prototype</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            How to Use & Demonstrate the Passive SOC System
          </h1>

          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            New to the platform? Start the guided interactive tour to explore every screen, tab, and forensic engine section-by-section with live pointer animations.
          </p>
        </div>

        <button
          onClick={startTour}
          className="px-6 py-3 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transition-all flex items-center space-x-2 flex-shrink-0"
        >
          <Compass className="w-4 h-4" />
          <span>Launch Screen-by-Screen Tour</span>
        </button>
      </div>

      {/* Chapters Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Interactive Walkthrough Modules ({chapters.length})
          </h2>
          <span className="text-xs text-slate-400 font-medium">Click any module to jump directly to its tour step</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chapters.map((ch, i) => {
            const Icon = ch.icon;
            return (
              <div
                key={i}
                onClick={() => goToStep(ch.stepIndex)}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-red-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg border ${ch.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {ch.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                    {ch.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {ch.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-red-600">
                  <span>Start Step {ch.stepIndex + 1}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SIH Presentation Cheatsheet */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Quick 5-Minute Jury Demonstration Script
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <strong className="text-slate-900 block mb-1 font-bold">1. Explain Isolation</strong>
            <p className="text-slate-600">Show the passive header indicator. Clarify zero return-path, zero active probes, zero payload decryption.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <strong className="text-slate-900 block mb-1 font-bold">2. Run PCAP Replay</strong>
            <p className="text-slate-600">Go to PCAP Lab, pick `syn_flood_ddos.pcap`, and watch real-time alert trigger instantly on the live feed.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <strong className="text-slate-900 block mb-1 font-bold">3. Show Evidence & Benchmark</strong>
            <p className="text-slate-600">Open the alert evidence drawer to show quantitative thresholds, then click Run Benchmark in System Health.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
