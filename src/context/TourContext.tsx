import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export interface TourStep {
  id: string;
  title: string;
  targetSelector: string;
  route: string;
  description: string;
  badge: string;
  tip?: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'passive-guarantee',
    title: '1. Passive Ingest & Zero-Return Guarantee',
    targetSelector: '#tour-passive-banner',
    route: '/',
    badge: 'Core Architectural Invariant',
    description: 'The system operates strictly on a one-way optical TAP / SPAN mirror copy. It never sends packets back, never probes IP addresses, and never decrypts payloads.',
    tip: 'Notice the READ-ONLY TAP badge indicating complete network isolation.'
  },
  {
    id: 'metrics-hud',
    title: '2. Real-Time Operational Telemetry HUD',
    targetSelector: '#tour-metrics-hud',
    route: '/',
    badge: 'Live Measured Metrics',
    description: 'Displays actual measured event throughput, flow rates, and sub-millisecond ML inference / detection latencies in real time without fabricated statistics.',
    tip: 'Green cards represent operational health; Red indicates active threat volume.'
  },
  {
    id: 'live-threat-feed',
    title: '3. Live Threat Feed & Forensic Scoring',
    targetSelector: '#tour-threat-feed',
    route: '/',
    badge: 'WebSocket Streaming Feed',
    description: 'Every incoming packet stream is normalized and evaluated by our hybrid 3-tier engine. Alerts appear instantly with calculated severity and normalized risk scores (0–100).',
    tip: 'Click any alert row to open the complete forensic evidence drawer!'
  },
  {
    id: 'pcap-replay-lab',
    title: '4. PCAP Replay Lab & Attack Simulator',
    targetSelector: '#tour-replay-tab',
    route: '/replay',
    badge: 'Attack Scenario Laboratory',
    description: 'Select from 7 pre-generated attack PCAPs (SYN flood DDoS, Botnet C2 beaconing, DGA domains, DNS tunnelling, Port scans, Exfiltration) and stream them at configurable speeds (0.5x to 10x).',
    tip: 'Use this during SIH jury demonstrations to showcase real-time threat response.'
  },
  {
    id: 'incident-correlation',
    title: '5. Multi-Stage Attack Incident Clustering',
    targetSelector: '#tour-incidents-tab',
    route: '/incidents',
    badge: 'SOC Case Correlator',
    description: 'Prevents alert fatigue by grouping repetitive and multi-stage attacker actions into correlated incident cases (INC-xxxx) with complete chronological timelines.',
    tip: 'Click on any incident card to see all clustered attack events.'
  },
  {
    id: 'threat-analytics',
    title: '6. Threat Intelligence & Pattern Analytics',
    targetSelector: '#tour-analytics-tab',
    route: '/threats',
    badge: 'Behavioral Insights',
    description: 'Deep-dive visual analysis of anomaly risk progressions, threat category distributions, top adversary sources, and targeted internal endpoints.',
    tip: 'All charts update dynamically as network traffic flows through the pipeline.'
  },
  {
    id: 'models-rules',
    title: '7. AI/ML Models & Detection Rules Registry',
    targetSelector: '#tour-models-tab',
    route: '/models',
    badge: 'Provenance & Calibration',
    description: 'Inspect active Random Forest classifiers and Isolation Forest anomaly detectors (F1 scores, precision, recall, latency) and adjust detection rule thresholds on the fly.',
    tip: 'You can edit thresholds directly and click Save to re-calibrate detection sensitivity.'
  },
  {
    id: 'system-health-benchmark',
    title: '8. System Health & Measured Benchmark',
    targetSelector: '#tour-system-tab',
    route: '/system',
    badge: 'Hardware & SLA Verification',
    description: 'Monitor individual subsystem status, memory footprint, and CPU utilization. Run a live stress-test benchmark on 2,000 real flows to verify measured throughput (>10,000 events/sec).',
    tip: 'Click "Run Measured Benchmark" to demonstrate actual verified performance to judges.'
  }
];

interface TourContextType {
  isTourActive: boolean;
  currentStepIndex: number;
  currentStep: TourStep;
  startTour: () => void;
  endTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const currentStep = TOUR_STEPS[currentStepIndex];

  const startTour = () => {
    setCurrentStepIndex(0);
    setIsTourActive(true);
    if (location.pathname !== TOUR_STEPS[0].route) {
      navigate(TOUR_STEPS[0].route);
    }
  };

  const endTour = () => {
    setIsTourActive(false);
    // Remove highlight classes
    document.querySelectorAll('.tour-target-highlight').forEach((el) => {
      el.classList.remove('tour-target-highlight');
    });
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < TOUR_STEPS.length) {
      setCurrentStepIndex(index);
      const step = TOUR_STEPS[index];
      if (location.pathname !== step.route) {
        navigate(step.route);
      }
    }
  };

  const nextStep = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      goToStep(currentStepIndex + 1);
    } else {
      endTour();
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      goToStep(currentStepIndex - 1);
    }
  };

  // Sync highlighting when step or route changes
  useEffect(() => {
    if (!isTourActive) return;

    const step = TOUR_STEPS[currentStepIndex];
    if (location.pathname !== step.route) {
      navigate(step.route);
      return;
    }

    const timer = setTimeout(() => {
      // Clear previous highlights
      document.querySelectorAll('.tour-target-highlight').forEach((el) => {
        el.classList.remove('tour-target-highlight');
      });

      // Highlight target element
      const targetEl = document.querySelector(step.targetSelector);
      if (targetEl) {
        targetEl.classList.add('tour-target-highlight');
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [isTourActive, currentStepIndex, location.pathname]);

  return (
    <TourContext.Provider
      value={{
        isTourActive,
        currentStepIndex,
        currentStep,
        startTour,
        endTour,
        nextStep,
        prevStep,
        goToStep
      }}
    >
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};
