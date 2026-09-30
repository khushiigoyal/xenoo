import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  RotateCcw, 
  Sun, 
  Moon, 
  User, 
  AlertTriangle, 
  BookOpen, 
  Wifi, 
  Thermometer, 
  Activity, 
  Volume2, 
  VolumeX,
  Key,
  Ticket
} from 'lucide-react';
import { playRailwayChime } from '../../utils/audioAlerts';
import { PassengerProfile } from '../../types/railway';

interface HeaderProps {
  currentMode: 'operations' | 'passenger';
  onModeChange: (mode: 'operations' | 'passenger') => void;
  onSimulateDelay20Min: () => void;
  onOpenDemoTour: () => void;
  onResetAll: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  activeTrainsCount: number;
  delayedTrainsCount: number;
  lastRecalcTime: string;
  isTourOpen?: boolean;
  currentPassenger?: PassengerProfile | null;
  onOpenPassengerLogin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onModeChange,
  onSimulateDelay20Min,
  onOpenDemoTour,
  onResetAll,
  isDarkMode,
  onToggleTheme,
  audioEnabled,
  onToggleAudio,
  activeTrainsCount,
  delayedTrainsCount,
  lastRecalcTime,
  isTourOpen = false,
  currentPassenger,
  onOpenPassengerLogin
}) => {
  const [liveTime, setLiveTime] = useState<string>('17:48:12 IST');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveTime(now.toLocaleTimeString('en-IN', { hour12: false }) + ' IST');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-50 shadow-2xl">
      {/* 1. TOP TELEMETRY STRIP (Identical to reference screenshot) */}
      <div className="bg-[#03060f] border-b border-slate-800/90 px-4 py-1 text-[11px] font-mono text-slate-300 flex flex-wrap items-center justify-between gap-2">
        {/* Left Telemetry Widgets */}
        <div className="flex items-center gap-3 overflow-x-auto">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 font-bold">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
            </span>
            <span>REAL-TIME LIVE</span>
          </div>

          <div className="flex items-center gap-1 text-slate-200">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{liveTime}</span>
          </div>

          <div className="h-3 w-px bg-slate-800" />

          <div className="flex items-center gap-1 text-cyan-400">
            <Wifi className="w-3.5 h-3.5" />
            <span>CRIS Ping: <strong className="text-white">12ms</strong></span>
          </div>

          <div className="h-3 w-px bg-slate-800" />

          <div className="flex items-center gap-1 text-slate-300">
            <span>Active Trains: <strong className="text-white">{activeTrainsCount}</strong></span>
          </div>

          <div className="h-3 w-px bg-slate-800" />

          <div className="flex items-center gap-1 text-amber-300">
            <Thermometer className="w-3.5 h-3.5" />
            <span>Rail Temp: <strong className="text-white">41.6°C</strong></span>
          </div>
        </div>

        {/* Center Live Ticker */}
        <div className="hidden xl:flex items-center gap-2 text-slate-400 text-[11px] truncate max-w-md">
          <Activity className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="truncate">
            <strong className="text-indigo-300">[CRIS-GWL-SIG]:</strong> Automatic Block Signaling Section GWL-MRA Down Line clear • High-speed monitoring active
          </span>
        </div>

        {/* Right Status Badges & Operator */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 px-2 py-0.5 rounded text-[11px]">
            <User className="w-3 h-3 text-slate-400" />
            <span className="text-slate-200 font-sans font-medium">Rajesh Sharma</span>
            <span className="text-[9px] font-mono px-1 py-0.2 bg-blue-900/80 text-blue-300 rounded font-bold">
              OPERATOR
            </span>
          </div>

          <span className="bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase font-mono shadow-sm">
            SIMULATED ENVIRONMENT
          </span>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-700/50 text-emerald-400 text-[10px] font-mono font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>AI SYSTEM ONLINE</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAV COMMAND BAR (Deep Navy / Sleek Black) */}
      <div className="bg-[#080d1a] border-b border-slate-800 text-white px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#3b49df] text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-900/50">
              R
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg tracking-tight flex items-center gap-1.5">
                  RAILETA AI
                </h1>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
                  v1.0.4
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono tracking-wide uppercase">
                DYNAMIC RAILWAY ETA FORECASTING SYSTEM
              </div>
            </div>
          </div>

          {/* Mode Switcher + Action Controls */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Passenger / Operations Mode Pill Switcher */}
            <div className="bg-[#03060f] p-1 rounded-lg border border-slate-800 flex items-center text-xs font-semibold">
              <button
                onClick={() => onModeChange('passenger')}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                  currentMode === 'passenger'
                    ? 'bg-[#3b49df] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>PASSENGER MODE</span>
                {currentPassenger ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                ) : (
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-700">
                    LOGIN
                  </span>
                )}
              </button>
              <button
                onClick={() => onModeChange('operations')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  currentMode === 'operations'
                    ? 'bg-[#3b49df] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                OPERATIONS MODE
              </button>
            </div>

            {/* Passenger Portal / Login Button (Accessible in both modes) */}
            <button
              onClick={onOpenPassengerLogin}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                currentPassenger
                  ? 'bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 hover:bg-emerald-900/80'
                  : currentMode === 'passenger'
                  ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/50'
                  : 'bg-indigo-950/90 border border-indigo-700/80 text-indigo-300 hover:bg-indigo-900 hover:text-white'
              }`}
              title={
                currentPassenger
                  ? `Logged in as ${currentPassenger.name} (${currentPassenger.pnr}). Click to view journey ticket.`
                  : 'Click to open Passenger Login Portal (PNR, Mobile OTP, IRCTC)'
              }
            >
              {currentPassenger ? (
                <>
                  <User className="w-3.5 h-3.5" />
                  <span className="font-bold">{currentPassenger.name.split(' ')[0]}</span>
                  <span className="text-[10px] font-mono text-emerald-400/90">({currentPassenger.pnr})</span>
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-800 text-white font-bold ml-0.5">
                    PASS
                  </span>
                </>
              ) : (
                <>
                  <Key className="w-3.5 h-3.5" />
                  <span>Passenger Login</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-extrabold">
                    PORTAL
                  </span>
                </>
              )}
            </button>

            {/* Red Simulate Delay Action Button */}
            <button
              onClick={onSimulateDelay20Min}
              className="bg-[#e11d48] hover:bg-[#be123c] text-white font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-md shadow-rose-950 transition-all hover:scale-105 active:scale-95"
            >
              <AlertTriangle className="w-3.5 h-3.5 fill-white text-[#e11d48]" />
              <span>SIMULATE DELAY (+20m)</span>
            </button>

            {/* Demo Guide Button */}
            <button
              onClick={onOpenDemoTour}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                isTourOpen 
                  ? 'bg-amber-500 text-slate-950 font-bold ring-2 ring-amber-400 shadow-amber-500/20' 
                  : 'bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/80 text-indigo-300 hover:text-white'
              }`}
              title="Open 9-Step Smart India Hackathon Demo Guide"
            >
              <BookOpen className={`w-3.5 h-3.5 ${isTourOpen ? 'text-slate-950' : 'text-amber-400'}`} />
              <span>{isTourOpen ? 'Demo Guide (Active)' : '✨ Demo Guide'}</span>
            </button>

            {/* Audio Chime Toggle Button */}
            <button
              onClick={() => {
                onToggleAudio();
                if (!audioEnabled) playRailwayChime();
              }}
              className={`p-2 rounded-lg border text-xs transition-colors flex items-center gap-1.5 ${
                audioEnabled 
                  ? 'bg-indigo-950/80 border-indigo-700 text-indigo-300' 
                  : 'bg-slate-800/80 border-slate-700 text-slate-400'
              }`}
              title={audioEnabled ? 'Station PA Audio Enabled (Click to mute)' : 'Station PA Audio Muted (Click to enable)'}
            >
              {audioEnabled ? <Volume2 className="w-3.5 h-3.5 text-indigo-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
              <span className="hidden sm:inline text-[10px] font-mono">{audioEnabled ? 'Audio ON' : 'Muted'}</span>
            </button>

            {/* Theme Toggle (Dark Mode / Light Mode) */}
            <button
              onClick={onToggleTheme}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono font-medium transition-colors flex items-center gap-1.5"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Completely Dark Mode'}
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-400 text-[11px]">Dark ON</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-cyan-300" />
                  <span className="text-cyan-300 text-[11px]">Light ON</span>
                </>
              )}
            </button>

            {/* Reset Button */}
            <button
              onClick={onResetAll}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Reset all events to nominal timetable"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
