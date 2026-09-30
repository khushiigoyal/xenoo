import React, { useState, useEffect } from 'react';
import { Train, PassengerNotification, PassengerProfile } from '../../types/railway';
import { STATIONS, DEFAULT_PASSENGERS } from '../../data/mockRailwayData';
import { PassengerLoginPage } from './PassengerLoginPage';
import { PassengerBoardingPass } from './PassengerBoardingPass';
import { PassengerAlertHub } from './PassengerAlertHub';
import { playRailwayChime } from '../../utils/audioAlerts';
import { 
  Search, 
  Train as TrainIcon, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Bell, 
  Check, 
  Clock,
  Key,
  Ticket,
  User,
  ShieldCheck,
  LogOut,
  ChevronRight
} from 'lucide-react';

interface PassengerViewProps {
  trains: Train[];
  notifications: PassengerNotification[];
  selectedTrainId: string;
  onSelectTrain: (trainId: string) => void;
  onSimulateDelay: () => void;
  currentPassenger?: PassengerProfile | null;
  onPassengerChange?: (passenger: PassengerProfile | null) => void;
  activeTab?: 'pass' | 'search' | 'alerts';
  onTabChange?: (tab: 'pass' | 'search' | 'alerts') => void;
  onSendCustomAlert?: (message: string) => void;
  isDarkMode?: boolean;
}

export const PassengerView: React.FC<PassengerViewProps> = ({
  trains,
  notifications,
  selectedTrainId,
  onSelectTrain,
  onSimulateDelay,
  currentPassenger = null,
  onPassengerChange,
  activeTab: activeTabProp,
  onTabChange: onTabChangeProp,
  onSendCustomAlert,
  isDarkMode = true
}) => {
  // Passenger session state (internal fallback if not passed from parent)
  const [internalPassenger, setInternalPassenger] = useState<PassengerProfile | null>(currentPassenger || null);
  const activePassenger = currentPassenger !== undefined ? currentPassenger : internalPassenger;

  // Active sub-tab in Passenger View: 'pass' | 'search' | 'alerts'
  // When activePassenger is null, 'pass' renders the PassengerLoginPage!
  const [internalTab, setInternalTab] = useState<'pass' | 'search' | 'alerts'>('pass');
  const activePassengerTab = activeTabProp !== undefined ? activeTabProp : internalTab;

  const setActivePassengerTab = (tab: 'pass' | 'search' | 'alerts') => {
    setInternalTab(tab);
    if (onTabChangeProp) {
      onTabChangeProp(tab);
    }
  };

  // Sync internal passenger if parent prop changes
  useEffect(() => {
    if (currentPassenger !== undefined) {
      setInternalPassenger(currentPassenger);
    }
  }, [currentPassenger]);

  const setPassenger = (pass: PassengerProfile | null) => {
    setInternalPassenger(pass);
    if (onPassengerChange) {
      onPassengerChange(pass);
    }
    if (pass) {
      // Auto-select passenger's train
      const matched = trains.find(t => t.number === pass.trainNumber);
      if (matched) {
        onSelectTrain(matched.id);
        setTrainNumber(matched.number);
      }
      setActivePassengerTab('pass');
    } else {
      setActivePassengerTab('pass'); // will show login page
    }
  };

  // Search Form State
  const [trainNumber, setTrainNumber] = useState('12806');
  const [journeyDate, setJourneyDate] = useState('05-09-2026');
  const [boardingStation, setBoardingStation] = useState('Gwalior Jn (GWL)');
  const [destinationStation, setDestinationStation] = useState('New Delhi (NDLS)');
  const [alertSetSuccess, setAlertSetSuccess] = useState(false);

  // Checkbox states
  const [alerts, setAlerts] = useState({
    delayPredicted: true,
    platformChange: true,
    routeDisruption: true,
    railwayMaintenance: true,
    alternativeTrain: true
  });

  const selectedTrain = trains.find(t => t.number === trainNumber) || trains.find(t => t.id === selectedTrainId) || trains[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = trainNumber.trim().toLowerCase();
    const match = trains.find(t => 
      t.number.toLowerCase() === query || 
      t.name.toLowerCase().includes(query) ||
      t.number.includes(query)
    );
    if (match) {
      playRailwayChime();
      onSelectTrain(match.id);
      setTrainNumber(match.number);
    }
  };

  const handleSetAlert = () => {
    playRailwayChime();
    setAlertSetSuccess(true);
    if (onSendCustomAlert) {
      onSendCustomAlert(`Alert registered: Live delay & platform change SMS will be dispatched for Train ${trainNumber} (${boardingStation} ➔ ${destinationStation}).`);
    }
    setTimeout(() => setAlertSetSuccess(false), 3000);
  };

  return (
    <div className="space-y-5">
      {/* Top Passenger AI Banner */}
      <div className="bg-[#0b101d] text-white p-5 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-mono text-indigo-400 font-bold tracking-wider uppercase mb-1">
              REAL-TIME PASSENGER AI PORTAL
            </div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight">RAILETA AI</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                PASSENGER HUB
              </span>
              {activePassenger ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{activePassenger.name} (PNR: {activePassenger.pnr})</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800">
                  GUEST SESSION
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 italic mt-0.5">
              "Your journey, before the disruption."
            </p>
            <p className="text-[11px] text-slate-400 mt-2">
              Synced with Central Railway Operations Dispatch. Dynamic push alerts active.
            </p>
          </div>

          <div className="text-right space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Monitoring Status</div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Active Telemetry Connected</span>
            </div>
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-400 border border-slate-800">
              SIMULATION DATA
            </span>
          </div>
        </div>
      </div>

      {/* Passenger Navigation Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          {/* Passenger Login / Ticket Tab */}
          <button
            onClick={() => setActivePassengerTab('pass')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              activePassengerTab === 'pass'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {activePassenger ? (
              <>
                <Ticket className="w-4 h-4" />
                <span>My Journey Pass ({activePassenger.coach}/{activePassenger.berth})</span>
              </>
            ) : (
              <>
                <Key className="w-4 h-4" />
                <span>Passenger Login / PNR Access</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-bold">
                  NEW
                </span>
              </>
            )}
          </button>

          {/* Live Train Search & Corridor Status Tab */}
          <button
            onClick={() => setActivePassengerTab('search')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              activePassengerTab === 'search'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Search Train & Corridor Status</span>
          </button>

          {/* Alert Hub Tab */}
          <button
            onClick={() => setActivePassengerTab('alerts')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              activePassengerTab === 'alerts'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Passenger Alerts Hub ({notifications.length})</span>
          </button>
        </div>

        {/* Quick Profile / Session Actions */}
        <div className="flex items-center gap-2">
          {activePassenger ? (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-mono hidden sm:inline">
                Logged in: <strong className="text-slate-900 dark:text-white">{activePassenger.name}</strong>
              </span>
              <button
                onClick={() => setPassenger(null)}
                className="px-2.5 py-1 rounded-md text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 transition-colors flex items-center gap-1"
                title="Log out of passenger account"
              >
                <LogOut className="w-3 h-3" />
                <span>Switch / Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActivePassengerTab('pass')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 flex items-center gap-1.5 transition-colors"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Sign In with PNR</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Passenger Demo Alert Strip */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-800 dark:text-slate-200">
          <span className="text-amber-500 font-bold">⚡ Interactive Passenger Demo:</span>
          <span>Simulate an unexpected railway delay on Train {selectedTrain.number}.</span>
        </div>
        <button
          onClick={onSimulateDelay}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
        >
          <AlertTriangle className="w-3.5 h-3.5 fill-slate-950" />
          <span>Simulate Train {selectedTrain.number} Delay (+20 min)</span>
        </button>
      </div>

      {/* ================= VIEW SWITCHER ================= */}

      {/* VIEW 1: PASSENGER LOGIN PAGE (When not logged in and tab is 'pass') */}
      {activePassengerTab === 'pass' && !activePassenger && (
        <PassengerLoginPage
          onLoginSuccess={(passenger) => setPassenger(passenger)}
          onContinueAsGuest={() => setActivePassengerTab('search')}
          isDarkMode={isDarkMode}
        />
      )}

      {/* VIEW 2: LOGGED-IN PASSENGER BOARDING PASS & JOURNEY (When logged in and tab is 'pass') */}
      {activePassengerTab === 'pass' && activePassenger && (
        <PassengerBoardingPass
          passenger={activePassenger}
          train={selectedTrain}
          notifications={notifications}
          onLogOut={() => setPassenger(null)}
          onSimulateDelay={onSimulateDelay}
          onSearchOtherTrains={() => setActivePassengerTab('search')}
        />
      )}

      {/* VIEW 3: LIVE TRAIN SEARCH & CORRIDOR BLOCKAGES */}
      {activePassengerTab === 'search' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Search Train & Live Corridor Status (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <Search className="w-4 h-4 text-blue-600" />
                  <span>SEARCH TRAIN & LIVE CORRIDOR STATUS</span>
                </h3>

                {!activePassenger && (
                  <button
                    onClick={() => setActivePassengerTab('pass')}
                    className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Have a PNR? Log In →</span>
                  </button>
                )}
              </div>

              {!activePassenger && (
                <div className="mb-4 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/30 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <Ticket className="w-4 h-4 text-blue-400 shrink-0" />
                    <div className="text-xs">
                      <span className="font-bold text-slate-900 dark:text-white block">Have an Indian Railways Ticket or PNR?</span>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">Sign in to view your confirmed coach/berth, live delay warnings & verified boarding pass.</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActivePassengerTab('pass')}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer shrink-0"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Passenger Login →</span>
                  </button>
                </div>
              )}

              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Train Number
                    </label>
                    <input
                      type="text"
                      value={trainNumber}
                      onChange={(e) => setTrainNumber(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Journey Date
                    </label>
                    <input
                      type="text"
                      value={journeyDate}
                      onChange={(e) => setJourneyDate(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Boarding Station
                    </label>
                    <select
                      value={boardingStation}
                      onChange={(e) => setBoardingStation(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Gwalior Jn (GWL)">Gwalior Jn (GWL)</option>
                      <option value="Agra Cantt (AGC)">Agra Cantt (AGC)</option>
                      <option value="Morena (MRA)">Morena (MRA)</option>
                      <option value="Mathura Jn (MTJ)">Mathura Jn (MTJ)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Destination Station
                    </label>
                    <select
                      value={destinationStation}
                      onChange={(e) => setDestinationStation(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="New Delhi (NDLS)">New Delhi (NDLS)</option>
                      <option value="Agra Cantt (AGC)">Agra Cantt (AGC)</option>
                      <option value="Hazrat Nizamuddin (NZM)">Hazrat Nizamuddin (NZM)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-[#3b49df] hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search Train Status</span>
                </button>
              </form>

              {/* Live Search Result Card */}
              <div className="mt-5 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                      {selectedTrain.number}
                    </span>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {selectedTrain.name}
                    </span>
                  </div>

                  {selectedTrain.currentDelayMinutes === 0 ? (
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      ON TIME
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      +{selectedTrain.currentDelayMinutes}m LATE
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono">
                  <span>{selectedTrain.source} ➔ {selectedTrain.destination}</span>
                  <span>Dep: 01:45 • Arr: 08:40</span>
                </div>

                {/* 3 Metrics Row */}
                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">CURRENT DELAY</span>
                    <span className="font-mono-tech font-bold text-sm text-slate-900 dark:text-white">
                      +{selectedTrain.currentDelayMinutes} min
                    </span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">PREDICTED DELAY</span>
                    <span className={`font-mono-tech font-bold text-sm ${
                      selectedTrain.currentDelayMinutes > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                    }`}>
                      +{selectedTrain.currentDelayMinutes} min
                    </span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">ROUTE STATUS</span>
                    <span className="font-mono-tech font-bold text-sm text-blue-600 dark:text-blue-400">
                      Normal
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTIVE CORRIDOR BLOCKAGES */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>ACTIVE CORRIDOR BLOCKAGES (GWALIOR SECTION)</span>
                </h3>
                <span className="text-[11px] font-mono text-slate-400">5 RECORDED</span>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800">
                        ACTIVE BLOCK
                      </span>
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        Chambal River Bridge Pier Span #3
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Reason: Pier ultrasonic structural resonance testing
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <div className="text-slate-700 dark:text-slate-300 font-semibold">01:00—02:00</div>
                    <div className="text-amber-600 dark:text-amber-400 text-[11px]">Est. Impact: +6m</div>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800">
                        ACTIVE BLOCK
                      </span>
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        Palwal High-Speed Catenary Zone
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Reason: Overhead equipment tension calibration
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <div className="text-slate-700 dark:text-slate-300 font-semibold">00:30—01:45</div>
                    <div className="text-emerald-600 dark:text-emerald-400 text-[11px]">Cleared on schedule</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Set Journey Alert */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-indigo-500" />
                  <span>SET JOURNEY ALERT</span>
                </h3>
                <span className="text-[10px] font-mono bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                  Instant Push
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Get notified immediately when railway AI predicts disruption, blockages, or alternative trains.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Train Number:
                  </label>
                  <input
                    type="text"
                    value={trainNumber}
                    readOnly
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Journey:
                  </label>
                  <input
                    type="text"
                    value={`${boardingStation.split(' ')[0]} ➔ ${destinationStation.split(' ')[0]}`}
                    readOnly
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Date:
                  </label>
                  <input
                    type="text"
                    value={journeyDate}
                    readOnly
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>

                {/* Checkboxes */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Alert me when:
                  </span>

                  <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={alerts.delayPredicted}
                      onChange={(e) => setAlerts({ ...alerts, delayPredicted: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Delay predicted</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={alerts.platformChange}
                      onChange={(e) => setAlerts({ ...alerts, platformChange: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Platform change</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={alerts.routeDisruption}
                      onChange={(e) => setAlerts({ ...alerts, routeDisruption: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Route disruption</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={alerts.railwayMaintenance}
                      onChange={(e) => setAlerts({ ...alerts, railwayMaintenance: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Railway maintenance / blockage</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={alerts.alternativeTrain}
                      onChange={(e) => setAlerts({ ...alerts, alternativeTrain: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Alternative train available</span>
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSetAlert}
                    className={`w-full py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      alertSetSuccess
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#3b49df] hover:bg-blue-700 text-white shadow-sm'
                    }`}
                  >
                    {alertSetSuccess ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>ALERT REGISTERED VIA SMS/WHATSAPP</span>
                      </>
                    ) : (
                      <span>[ SET ALERT ]</span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* ACTIVE ALERTS */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-emerald-500" />
                  <span>ACTIVE ALERTS</span>
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  {notifications.length} ACTIVE
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {notifications.slice(0, 3).map((n) => (
                  <div key={n.id} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                    <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                      <span>Train {n.trainNumber}</span>
                      <span className="font-mono text-slate-400 text-[10px]">{n.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {n.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: PASSENGER ALERTS HUB */}
      {activePassengerTab === 'alerts' && (
        <PassengerAlertHub 
          notifications={notifications} 
          onSendCustomAlert={onSendCustomAlert}
        />
      )}
    </div>
  );
};
