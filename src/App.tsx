/**
 * RAILETA AI
 * Dynamic Railway ETA Forecasting & Operations Intelligence
 * Problem Statement SIH26028 - Smart India Hackathon 2026
 */

import React, { useState, useEffect } from 'react';
import { 
  Train, 
  OperationalEvent, 
  DroneFeedData, 
  OperationsAlert, 
  PassengerNotification, 
  RailwayAsset, 
  RailwayBlock,
  PassengerProfile 
} from './types/railway';
import { 
  INITIAL_TRAINS, 
  INITIAL_DRONE_DATA, 
  INITIAL_OPERATIONS_ALERTS, 
  INITIAL_PASSENGER_NOTIFICATIONS, 
  HISTORICAL_ANALYTICS,
  INITIAL_ASSETS,
  INITIAL_BLOCKS,
  DEFAULT_PASSENGERS
} from './data/mockRailwayData';
import { recalculateTrainETA, createSimulationEvent } from './services/forecastingEngine';
import { playRailwayChime, playRadarBeep } from './utils/audioAlerts';

// Components
import { Header } from './components/common/Header';
import { KPICards } from './components/operations/KPICards';
import { OperationsOverview } from './components/operations/OperationsOverview';
import { LiveTrainMonitor } from './components/operations/LiveTrainMonitor';
import { AssetsView } from './components/operations/AssetsView';
import { BlocksView } from './components/operations/BlocksView';
import { CorridorMap } from './components/operations/CorridorMap';
import { ForecastEngineCard } from './components/operations/ForecastEngineCard';
import { DynamicTimeline } from './components/operations/DynamicTimeline';
import { ExplainableAI } from './components/operations/ExplainableAI';
import { SimulationControls } from './components/operations/SimulationControls';
import { DroneInspector } from './components/operations/DroneInspector';
import { OperationsAlerts } from './components/operations/OperationsAlerts';
import { PassengerView } from './components/passenger/PassengerView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { ArchitectureView } from './components/architecture/ArchitectureView';
import { ApiSandboxView } from './components/api/ApiSandboxView';
import { GrandFinaleTour } from './components/demo/GrandFinaleTour';

// Icons for sub-tabs
import { 
  LayoutDashboard, 
  Train as TrainIcon, 
  Map, 
  Clock, 
  Sparkles, 
  Video, 
  Bell, 
  BarChart3, 
  Network, 
  Code2, 
  AlertTriangle,
  Wrench,
  ShieldAlert
} from 'lucide-react';

export default function App() {
  const [currentMode, setCurrentMode] = useState<'operations' | 'passenger'>('operations');
  const [currentTab, setCurrentTab] = useState<string>('overview');
  
  // Default to COMPLETELY DARK as requested
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);

  // Core Data States
  const [trains, setTrains] = useState<Train[]>(INITIAL_TRAINS);
  const [assets, setAssets] = useState<RailwayAsset[]>(INITIAL_ASSETS);
  const [blocks, setBlocks] = useState<RailwayBlock[]>(INITIAL_BLOCKS);
  const [selectedTrainId, setSelectedTrainId] = useState<string>('tr-12806');
  const [activeEvents, setActiveEvents] = useState<OperationalEvent[]>([]);
  const [droneData, setDroneData] = useState<DroneFeedData>(INITIAL_DRONE_DATA);
  const [operationsAlerts, setOperationsAlerts] = useState<OperationsAlert[]>(INITIAL_OPERATIONS_ALERTS);
  const [passengerNotifications, setPassengerNotifications] = useState<PassengerNotification[]>(INITIAL_PASSENGER_NOTIFICATIONS);
  const [lastRecalcTime, setLastRecalcTime] = useState<string>('17:48:12');
  const [lastSimulatedEventMessage, setLastSimulatedEventMessage] = useState<string | null>(null);
  const [approvedForecast, setApprovedForecast] = useState<boolean>(false);
  const [currentPassenger, setCurrentPassenger] = useState<PassengerProfile | null>(null);
  const [passengerActiveTab, setPassengerActiveTab] = useState<'pass' | 'search' | 'alerts'>('pass');

  // Grand Finale Demo Tour State
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const [tourStep, setTourStep] = useState<number>(1);

  // Sync theme with document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [isDarkMode]);

  // Find currently selected train
  const selectedTrain = trains.find(t => t.id === selectedTrainId) || trains[0];

  // Helper to trigger recalculation for the selected train
  const handleSimulate = (
    type: 'DELAY' | 'SIGNAL' | 'CONGESTION' | 'UNSCHEDULED_STOP' | 'WEATHER' | 'DRONE',
    customMinutes?: number,
    customTitle?: string,
    customDescription?: string
  ) => {
    if (audioEnabled) {
      if (type === 'DRONE') {
        playRadarBeep();
      } else {
        playRailwayChime();
      }
    }

    const newEvent = createSimulationEvent(
      type,
      selectedTrain.number,
      `${selectedTrain.currentStation} - ${selectedTrain.nextStation}`,
      customMinutes,
      customTitle,
      customDescription
    );
    const updatedEvents = [...selectedTrain.activeEvents, newEvent];
    const updatedTrain = recalculateTrainETA(selectedTrain, updatedEvents);

    setTrains(prev => prev.map(t => (t.id === selectedTrain.id ? updatedTrain : t)));
    setActiveEvents(prev => [...prev, newEvent]);
    setApprovedForecast(false);

    const nowStr = new Date().toLocaleTimeString('en-IN', { hour12: false });
    setLastRecalcTime(nowStr);

    const eventNames: Record<string, string> = {
      DELAY: customTitle || `Major +${customMinutes ?? 20} Min Delay Event detected`,
      SIGNAL: customTitle || `Signal Aspect Caution Order (+${customMinutes ?? 7} min) active`,
      CONGESTION: customTitle || `Block Section Headway Congestion (+${customMinutes ?? 12} min) detected`,
      UNSCHEDULED_STOP: customTitle || `Unscheduled Loop Line Hold (+${customMinutes ?? 15} min) logged`,
      WEATHER: customTitle || `Dense Fog Speed Restriction (+${customMinutes ?? 18} min) active`,
      DRONE: customTitle || `Drone DR-01 Aerial Anomaly Detected (+${customMinutes ?? 10} min)`
    };

    setLastSimulatedEventMessage(`${eventNames[type]} ➔ Train ${selectedTrain.number} ETAs recalculated.`);

    // Add Operations Alert
    const newOpAlert: OperationsAlert = {
      id: `oa-${Date.now()}`,
      title: newEvent.title,
      severity: newEvent.severity,
      affectedTrain: `${selectedTrain.number} ${selectedTrain.name}`,
      section: newEvent.location,
      timestamp: nowStr,
      recommendedAction: newEvent.description,
      confidenceImpact: `Confidence updated to ${updatedTrain.confidencePercentage}%. Downstream junctions notified.`
    };
    setOperationsAlerts(prev => [newOpAlert, ...prev]);

    // Add Passenger Notification
    const newPassengerNotif: PassengerNotification = {
      id: `pn-${Date.now()}`,
      trainNumber: selectedTrain.number,
      trainName: selectedTrain.name,
      stationName: selectedTrain.nextStation,
      message: `Dynamic ETA Update: Train ${selectedTrain.number} expected at ${selectedTrain.nextStation} at ${updatedTrain.predictedArrivalNext} (+${updatedTrain.currentDelayMinutes} min vs timetable).`,
      type: updatedTrain.currentDelayMinutes >= 15 ? 'CRITICAL' : 'WARNING',
      timestamp: nowStr,
      revisedEta: updatedTrain.predictedArrivalNext,
      originalEta: selectedTrain.scheduledArrivalNext
    };
    setPassengerNotifications(prev => [newPassengerNotif, ...prev]);
  };

  // Approve Track A17 Block (From Overview & Blocks tabs)
  const handleApproveBlockA17 = () => {
    if (audioEnabled) playRailwayChime();

    setApprovedForecast(true);
    // Mark block A17 as approved
    setBlocks(prev => prev.map(b => b.id === 'blk-1' ? { ...b, approvedByController: true, status: 'ACTIVE' } : b));

    // Re-route Train 12806 via AI Bypass (+4 min nominal diversion)
    const train12806 = trains.find(t => t.number === '12806');
    if (train12806) {
      const bypassEvent: OperationalEvent = {
        id: `ev-bypass-${Date.now()}`,
        title: 'Track A17 Approved: AI Bypass Loop Active (+4 min)',
        type: 'DELAY',
        location: 'Section Gwalior — Morena (Track A17 Bypass)',
        impactMinutes: 4,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }),
        description: 'Train 12806 diverted via cleared bypass loop during scheduled 03:00-04:00 maintenance.',
        severity: 'LOW',
        trainNumber: '12806'
      };

      const updatedTrain = recalculateTrainETA(train12806, [...train12806.activeEvents, bypassEvent]);
      setTrains(prev => prev.map(t => t.id === train12806.id ? updatedTrain : t));
    }

    const nowStr = new Date().toLocaleTimeString('en-IN', { hour12: false });
    setLastRecalcTime(nowStr);
    setLastSimulatedEventMessage('Track A17 Block approved! Train 12806 re-routed via AI Bypass with minimal +4m impact.');

    // Add alert
    const newAlert: OperationsAlert = {
      id: `oa-${Date.now()}`,
      title: 'Track A17 Block Approved & Dispatched',
      severity: 'LOW',
      affectedTrain: '12806 AP Express',
      section: 'Gwalior South — Track A17',
      timestamp: nowStr,
      recommendedAction: 'Authorized AI bypass loop clearance. Safety window guaranteed from 03:00 to 04:00.',
      confidenceImpact: 'High confidence maintained (96%). 0 conflict overlaps.'
    };
    setOperationsAlerts(prev => [newAlert, ...prev]);
  };

  // Toggle approve on any block
  const handleToggleBlock = (blockId: string) => {
    if (audioEnabled) playRailwayChime();
    setBlocks(prev => prev.map(b => {
      if (b.id === blockId) {
        const nextState = !b.approvedByController;
        return { ...b, approvedByController: nextState, status: nextState ? 'ACTIVE' : 'PLANNED' };
      }
      return b;
    }));
  };

  // Inspect specific asset using the drone
  const handleInspectAssetWithDrone = (assetName: string) => {
    setCurrentTab('drone');
    handleTriggerDroneAnomaly();
  };

  // Reset to original nominal state
  const handleResetAll = () => {
    setTrains(INITIAL_TRAINS);
    setAssets(INITIAL_ASSETS);
    setBlocks(INITIAL_BLOCKS);
    setActiveEvents([]);
    setDroneData(INITIAL_DRONE_DATA);
    setOperationsAlerts(INITIAL_OPERATIONS_ALERTS);
    setPassengerNotifications(INITIAL_PASSENGER_NOTIFICATIONS);
    setApprovedForecast(false);
    setCurrentPassenger(null);
    setPassengerActiveTab('pass');
    setLastRecalcTime(new Date().toLocaleTimeString('en-IN', { hour12: false }));
    setLastSimulatedEventMessage('All operational events cleared. Fleet restored to nominal timetables.');
  };

  // Add live custom passenger alert
  const handleAddPassengerNotification = (message: string, trainNum = '12806') => {
    const newNotif: PassengerNotification = {
      id: `pn-user-${Date.now()}`,
      trainNumber: trainNum,
      trainName: 'AP Express',
      stationName: 'Gwalior Jn',
      message: message,
      type: 'WARNING',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }),
      revisedEta: '04:15',
      originalEta: '03:55'
    };
    setPassengerNotifications(prev => [newNotif, ...prev]);
  };

  // Trigger drone event
  const handleTriggerDroneAnomaly = (customTitle?: string, customImpact?: number, customDescription?: string) => {
    const title = customTitle || 'Track Anomaly Detected: Micro-crack & Loose Catenary Mast';
    const impact = customImpact ?? 10;
    const desc = customDescription || 'Ballast displacement / micro-crack. Caution order 30 km/h.';
    setDroneData(prev => ({
      ...prev,
      lastAnomalyDetected: {
        title,
        confidence: 94,
        type: 'OBSTRUCTION',
        railKm: 'KM 142.4',
        detectedAt: new Date().toLocaleTimeString('en-IN', { hour12: false }),
        impactDescription: `${desc} Speed restricted to 30 km/h (+${impact} min).`
      },
      aiEventStatus: `CAUTION ORDER ISSUED: ${title}`
    }));

    handleSimulate('DRONE', impact, title, desc);
  };

  const handleClearDroneAnomaly = () => {
    setDroneData(prev => ({
      ...prev,
      lastAnomalyDetected: undefined,
      aiEventStatus: 'AI Corridor Scan: Nominal - No Obstructions'
    }));

    const updatedEvents = selectedTrain.activeEvents.filter(e => e.type !== 'DRONE');
    const updatedTrain = recalculateTrainETA(selectedTrain, updatedEvents);

    setTrains(prev => prev.map(t => (t.id === selectedTrain.id ? updatedTrain : t)));
    setActiveEvents(prev => prev.filter(e => e.type !== 'DRONE'));
    setLastSimulatedEventMessage('Drone anomaly cleared. Section line speed restored.');
  };

  // Dedicated robust handler for Grand Finale Demo Tour
  const handleRunTourStep = (stepNumber: number, executeAction: boolean = true) => {
    setTourStep(stepNumber);

    switch (stepNumber) {
      case 1:
        // Step 1: Select Train 12806 AP Express & Go to Overview
        setCurrentMode('operations');
        setCurrentTab('overview');
        setSelectedTrainId('tr-12806');
        break;

      case 2:
        // Step 2: Inspect Corridor Map
        setCurrentMode('operations');
        setCurrentTab('corridor');
        setSelectedTrainId('tr-12806');
        break;

      case 3:
        // Step 3: Simulate +20 Min Delay
        setCurrentMode('operations');
        setCurrentTab('overview');
        setSelectedTrainId('tr-12806');
        if (executeAction) {
          handleSimulate('DELAY', 20, 'Major Operational Delay (+20 min)', 'Locomotive power unit auxiliary trip and headway clearance delay.');
        }
        break;

      case 4:
        // Step 4: Cascade Timeline
        setCurrentMode('operations');
        setCurrentTab('timeline');
        setSelectedTrainId('tr-12806');
        break;

      case 5:
        // Step 5: Explainable AI & Waterfall
        setCurrentMode('operations');
        setCurrentTab('engine');
        setSelectedTrainId('tr-12806');
        break;

      case 6:
        // Step 6: Passenger Portal & Login
        setCurrentMode('passenger');
        setPassengerActiveTab('pass');
        setSelectedTrainId('tr-12806');
        if (executeAction) {
          setCurrentPassenger(DEFAULT_PASSENGERS[0]);
        }
        break;

      case 7:
        // Step 7: Drone Inspection & Track Hazard
        setCurrentMode('operations');
        setCurrentTab('drone');
        if (executeAction) {
          handleTriggerDroneAnomaly(
            'Track Obstruction & Catenary Sag at KM 142.4',
            10,
            'Autonomous drone DR-01 detected foreign object & catenary sag near Chambal River Bridge.'
          );
        }
        break;

      case 8:
        // Step 8: Combined Dynamic Timeline
        setCurrentMode('operations');
        setCurrentTab('timeline');
        setSelectedTrainId('tr-12806');
        break;

      case 9:
        // Step 9: Model Analytics & Benchmarks
        setCurrentMode('operations');
        setCurrentTab('analytics');
        break;

      default:
        setCurrentMode('operations');
        setCurrentTab('overview');
    }
  };

  const delayedCount = trains.filter(t => t.status !== 'ON_TIME').length;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-[#030712] text-slate-100' : 'light bg-[#f8fafc] text-slate-900'} font-sans flex flex-col transition-colors duration-200`}>
      {/* Top Application Header */}
      <Header
        currentMode={currentMode}
        onModeChange={setCurrentMode}
        onSimulateDelay20Min={() => handleSimulate('DELAY')}
        onOpenDemoTour={() => {
          setIsTourOpen(prev => {
            const nextState = !prev;
            if (nextState) {
              handleRunTourStep(tourStep, false);
            }
            return nextState;
          });
        }}
        isTourOpen={isTourOpen}
        onResetAll={handleResetAll}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        audioEnabled={audioEnabled}
        onToggleAudio={() => setAudioEnabled(!audioEnabled)}
        activeTrainsCount={124}
        delayedTrainsCount={delayedCount}
        lastRecalcTime={lastRecalcTime}
        currentPassenger={currentPassenger}
        onOpenPassengerLogin={() => {
          setCurrentMode('passenger');
          setPassengerActiveTab('pass');
        }}
      />

      {/* Grand Finale Demo Tour Banner (if active) */}
      {isTourOpen && (
        <GrandFinaleTour
          currentStep={tourStep}
          onSetStep={setTourStep}
          onClose={() => setIsTourOpen(false)}
          onRunStep={handleRunTourStep}
          onReset={handleResetAll}
          audioEnabled={audioEnabled}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {/* OPERATIONS MODE */}
        {currentMode === 'operations' && (
          <div className="space-y-5">
            {/* Sub-heading & Status strip */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-mono text-indigo-400 font-bold tracking-wider uppercase">
                  INTEGRATED DIVISION TRAFFIC COMMAND • SIH-26028 REAL-TIME
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
                  RAILWAY OPERATIONS CENTER
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-semibold border border-emerald-300 dark:border-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>AI SYSTEM ONLINE</span>
                </div>
                <button
                  onClick={() => handleSimulate('DELAY')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 font-mono text-xs font-bold border border-rose-300 dark:border-rose-800 hover:bg-rose-200 dark:hover:bg-rose-900 transition-colors shadow-sm"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Simulate +20m Delay</span>
                </button>
              </div>
            </div>

            {/* Top 4 KPI Cards */}
            <KPICards
              activeCount={124}
              delayedCount={delayedCount}
              avgError={HISTORICAL_ANALYTICS.maeMinutes}
              totalDelayMinutes={selectedTrain.currentDelayMinutes}
            />

            {/* Sub-Navigation Pill Bar with ALL categories from reference screenshot */}
            <div className="bg-white dark:bg-[#0b101d] p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-1 overflow-x-auto text-xs font-semibold">
              <button
                onClick={() => setCurrentTab('overview')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all shrink-0 ${
                  currentTab === 'overview'
                    ? 'bg-[#3b49df] text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Overview</span>
              </button>

              <button
                onClick={() => setCurrentTab('trains')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all shrink-0 ${
                  currentTab === 'trains'
                    ? 'bg-[#3b49df] text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <TrainIcon className="w-3.5 h-3.5" />
                <span>Trains ({trains.length})</span>
              </button>

              <button
                onClick={() => setCurrentTab('assets')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all shrink-0 ${
                  currentTab === 'assets'
                    ? 'bg-[#3b49df] text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Assets ({assets.length})</span>
              </button>

              <button
                onClick={() => setCurrentTab('blocks')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all shrink-0 ${
                  currentTab === 'blocks'
                    ? 'bg-[#3b49df] text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Blocks ({blocks.length})</span>
              </button>

              <button
                onClick={() => setCurrentTab('corridor')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all shrink-0 ${
                  currentTab === 'corridor'
                    ? 'bg-[#3b49df] text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>Corridor Map</span>
              </button>

              <button
                onClick={() => setCurrentTab('timeline')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all shrink-0 ${
                  currentTab === 'timeline'
                    ? 'bg-[#3b49df] text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Dynamic Timeline (24H)</span>
              </button>

              <button
                onClick={() => setCurrentTab('engine')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all shrink-0 ${
                  currentTab === 'engine'
                    ? 'bg-[#3b49df] text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI ETA Engine</span>
              </button>

              <button
                onClick={() => setCurrentTab('drone')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all shrink-0 ${
                  currentTab === 'drone'
                    ? 'bg-[#3b49df] text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Drone Inspection</span>
              </button>

              <button
                onClick={() => setCurrentTab('alerts')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all shrink-0 ${
                  currentTab === 'alerts'
                    ? 'bg-[#3b49df] text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Passenger Alerts (9)</span>
              </button>

              <button
                onClick={() => setCurrentTab('analytics')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all shrink-0 ${
                  currentTab === 'analytics'
                    ? 'bg-[#3b49df] text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Analytics</span>
              </button>

              <button
                onClick={() => setCurrentTab('architecture')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all shrink-0 ${
                  currentTab === 'architecture'
                    ? 'bg-[#3b49df] text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Network className="w-3.5 h-3.5" />
                <span>Architecture</span>
              </button>

              <button
                onClick={() => setCurrentTab('api')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all shrink-0 ${
                  currentTab === 'api'
                    ? 'bg-[#3b49df] text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>API Hub</span>
              </button>
            </div>

            {/* TAB CONTENT RENDERING */}
            {currentTab === 'overview' && (
              <OperationsOverview
                trains={trains}
                selectedTrain={selectedTrain}
                droneData={droneData}
                onSelectTrain={setSelectedTrainId}
                onTriggerDroneAnomaly={handleTriggerDroneAnomaly}
                onGoToTab={setCurrentTab}
                onApproveForecast={handleApproveBlockA17}
                approvedForecast={approvedForecast}
              />
            )}

            {currentTab === 'trains' && (
              <LiveTrainMonitor
                trains={trains}
                selectedTrainId={selectedTrainId}
                onSelectTrain={setSelectedTrainId}
              />
            )}

            {currentTab === 'assets' && (
              <AssetsView
                assets={assets}
                onInspectWithDrone={handleInspectAssetWithDrone}
              />
            )}

            {currentTab === 'blocks' && (
              <BlocksView
                blocks={blocks}
                onToggleApproveBlock={handleToggleBlock}
              />
            )}

            {currentTab === 'corridor' && (
              <CorridorMap
                selectedTrain={selectedTrain}
                allTrains={trains}
                onSelectTrain={setSelectedTrainId}
              />
            )}

            {currentTab === 'timeline' && (
              <DynamicTimeline
                train={selectedTrain}
              />
            )}

            {currentTab === 'engine' && (
              <div className="space-y-6">
                <ForecastEngineCard
                  train={selectedTrain}
                  lastRecalcTime={lastRecalcTime}
                />
                <ExplainableAI
                  attribution={selectedTrain.featureAttribution}
                  trainNumber={selectedTrain.number}
                />
              </div>
            )}

            {currentTab === 'drone' && (
              <DroneInspector
                droneData={droneData}
                onTriggerDroneEvent={handleTriggerDroneAnomaly}
                onClearDroneAnomaly={handleClearDroneAnomaly}
                hasActiveDroneAnomaly={!!droneData.lastAnomalyDetected}
              />
            )}

            {currentTab === 'alerts' && (
              <OperationsAlerts
                alerts={operationsAlerts}
                onDismissAlert={(id) => setOperationsAlerts(prev => prev.filter(a => a.id !== id))}
                onDismissAllAlerts={() => setOperationsAlerts([])}
              />
            )}

            {currentTab === 'analytics' && (
              <AnalyticsView />
            )}

            {currentTab === 'architecture' && (
              <ArchitectureView />
            )}

            {currentTab === 'api' && (
              <ApiSandboxView
                trains={trains}
                activeEvents={activeEvents}
              />
            )}

            {/* Bottom Simulation Suite Bar (Always accessible in operations) */}
            <div className="pt-2">
              <SimulationControls
                onSimulate={handleSimulate}
                onReset={handleResetAll}
                selectedTrainNumber={selectedTrain.number}
                activeEventsCount={selectedTrain.activeEvents.length}
                lastSimulatedEvent={lastSimulatedEventMessage}
              />
            </div>
          </div>
        )}

        {/* PASSENGER MODE */}
        {currentMode === 'passenger' && (
          <PassengerView
            trains={trains}
            notifications={passengerNotifications}
            selectedTrainId={selectedTrainId}
            onSelectTrain={setSelectedTrainId}
            onSimulateDelay={() => handleSimulate('DELAY')}
            currentPassenger={currentPassenger}
            onPassengerChange={setCurrentPassenger}
            activeTab={passengerActiveTab}
            onTabChange={setPassengerActiveTab}
            onSendCustomAlert={handleAddPassengerNotification}
            isDarkMode={isDarkMode}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#040711] py-3.5 px-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-[11px]">
          <div>
            Smarter Maintenance. Fewer Disruptions. <strong className="text-blue-600 dark:text-blue-400 font-semibold">Better Journeys.</strong>
          </div>
          <div className="font-mono">
            SIH-26028 PROTOTYPE • SIMULATED DATA ENVIRONMENT • V1.0.4
          </div>
        </div>
      </footer>

      {/* Floating Demo Guide Quick-Launch Button when closed or minimized */}
      {!isTourOpen && (
        <button
          onClick={() => {
            setIsTourOpen(true);
            handleRunTourStep(tourStep, false);
          }}
          className="fixed bottom-6 right-6 z-40 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-2xl flex items-center gap-2 border-2 border-amber-300 hover:scale-105 active:scale-95 transition-all group ring-4 ring-amber-500/20 cursor-pointer"
          title="Resume SIH 9-Step Demo Walkthrough"
        >
          <Sparkles className="w-4 h-4 fill-slate-950 text-slate-950 animate-spin" />
          <span>Demo Guide (Step {tourStep}/9)</span>
          <span className="w-2 h-2 rounded-full bg-slate-950 group-hover:animate-ping"></span>
        </button>
      )}
    </div>
  );
}
