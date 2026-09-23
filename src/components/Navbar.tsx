import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ShieldAlert, 
  Activity, 
  Layers, 
  PlayCircle, 
  MoreHorizontal,
  BarChart3, 
  Radio, 
  Sliders, 
  Cpu, 
  Compass, 
  ChevronDown,
  Menu,
  X,
  Flame,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useTour } from '../context/TourContext';
import { audioAlarm } from '../utils/audioAlarm';

export const Navbar: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSoundActive, setIsSoundActive] = useState(audioAlarm.isSoundEnabled);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { startTour } = useTour();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const primaryLinks = [
    { to: '/', label: 'Command Center', icon: Activity },
    { to: '/alerts', label: 'Live Alerts', icon: ShieldAlert },
    { to: '/incidents', label: 'Incidents', icon: Layers },
    { to: '/replay', label: 'PCAP Lab', icon: PlayCircle },
  ];

  const dropdownLinks = [
    { to: '/threats', label: 'Threat Analytics', icon: BarChart3, desc: 'Pattern distributions & timeline charts' },
    { to: '/traffic', label: 'Traffic Flows', icon: Radio, desc: 'Protocol breakdown & bandwidth rates' },
    { to: '/models', label: 'ML Models & Rules', icon: Sliders, desc: 'Classifier metrics & threshold configs' },
    { to: '/system', label: 'System Health', icon: Cpu, desc: 'Hardware status & measured benchmarks' },
    { to: '/tutorial', label: 'Interactive Guide', icon: Compass, desc: 'Guided onboarding & demo instructions' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          
          {/* CyberX Brand Logo */}
          <NavLink to="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-sm shadow-red-500/20 group-hover:bg-red-700 transition-colors">
              <Flame className="w-4 h-4 fill-white" />
            </div>
            <div className="flex items-baseline">
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">Cyber</span>
              <span className="font-extrabold text-lg text-red-600 tracking-tight">X</span>
            </div>
          </NavLink>

          {/* 4 Primary Nav Links + 5th Dropdown Item */}
          <nav className="hidden md:flex items-center space-x-1">
            {primaryLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    isActive
                      ? 'bg-red-50 text-red-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </NavLink>
            ))}

            {/* 5th Item: 3-Dot Dropdown with Hover & Click Support */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                  dropdownOpen
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
                }`}
                title="More Navigation Sections"
              >
                <MoreHorizontal className="w-4 h-4 text-slate-700" />
                <span className="hidden sm:inline">More</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-1 w-64 rounded-xl bg-white border border-slate-200 shadow-xl py-1.5 z-50 animate-fadeIn">
                  <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    Extended Capabilities
                  </div>
                  {dropdownLinks.map(({ to, label, icon: Icon, desc }) => (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={() => setDropdownOpen(false)}
                      className={({ isActive }) =>
                        `flex items-start space-x-2.5 px-3 py-2 text-xs transition-colors ${
                          isActive
                            ? 'bg-red-50 text-red-700 font-semibold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`
                      }
                    >
                      <div className="p-1 rounded-md bg-slate-100 text-slate-700 mt-0.5">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{label}</p>
                        <p className="text-[11px] text-slate-500 font-normal">{desc}</p>
                      </div>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right Action: Sound Toggle & Guided Tour Launcher */}
          <div className="hidden sm:flex items-center space-x-2">
            <button
              onClick={() => {
                const enabled = audioAlarm.toggleSound();
                setIsSoundActive(enabled);
              }}
              className={`p-1.5 rounded-lg border text-xs transition-colors flex items-center space-x-1 ${
                isSoundActive
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
              }`}
              title={isSoundActive ? 'Threat Alarm Sound: ON (Click to mute)' : 'Threat Alarm Sound: MUTED (Click to activate)'}
            >
              {isSoundActive ? <Volume2 className="w-3.5 h-3.5 text-emerald-600" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            <button
              onClick={startTour}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-colors flex items-center space-x-1.5"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Interactive Tour</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={startTour}
              className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-900 text-white"
            >
              Tour
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-md text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-2 space-y-1 shadow-lg">
          {[...primaryLinks, ...dropdownLinks].map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium ${
                  isActive ? 'bg-red-50 text-red-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
};
