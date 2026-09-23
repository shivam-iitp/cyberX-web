import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Alerts } from './pages/Alerts';
import { Incidents } from './pages/Incidents';
import { ThreatAnalytics } from './pages/ThreatAnalytics';
import { TrafficMonitor } from './pages/TrafficMonitor';
import { PCAPReplay } from './pages/PCAPReplay';
import { ModelsRegistry } from './pages/ModelsRegistry';
import { SystemHealth } from './pages/SystemHealth';
import { Tutorial } from './pages/Tutorial';
import { TourProvider } from './context/TourContext';
import { InteractiveTourOverlay } from './components/InteractiveTourOverlay';

export const App: React.FC = () => {
  return (
    <Router>
      <TourProvider>
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-red-500 selection:text-white">
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/incidents" element={<Incidents />} />
              <Route path="/threats" element={<ThreatAnalytics />} />
              <Route path="/traffic" element={<TrafficMonitor />} />
              <Route path="/replay" element={<PCAPReplay />} />
              <Route path="/models" element={<ModelsRegistry />} />
              <Route path="/system" element={<SystemHealth />} />
              <Route path="/tutorial" element={<Tutorial />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <InteractiveTourOverlay />
        </div>
      </TourProvider>
    </Router>
  );
};

export default App;
