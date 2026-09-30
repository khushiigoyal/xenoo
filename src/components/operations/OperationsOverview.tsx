import React from 'react';
import { Train, DroneFeedData } from '../../types/railway';
import { 
  Video, 
  Sparkles, 
  Activity, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  Check, 
  Calendar,
  Layers,
  ShieldCheck,
  TrendingDown
} from 'lucide-react';

interface OperationsOverviewProps {
  trains: Train[];
  selectedTrain: Train;
  droneData: DroneFeedData;
  onSelectTrain: (trainId: string) => void;
  onTriggerDroneAnomaly: () => void;
  onGoToTab: (tab: string) => void;
  onApproveForecast: () => void;
  approvedForecast: boolean;
}

export const OperationsOverview: React.FC<OperationsOverviewProps> = ({
  trains,
  selectedTrain,
  droneData,
  onSelectTrain,
  onTriggerDroneAnomaly,
  onGoToTab,
  onApproveForecast,
  approvedForecast
}) => {
  return (
    <div className="space-y-6">
      {/* 3-Column Top Operations Grid (Matching Screenshot 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Drone Inspection (AI Feed) - 4 Cols */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-rose-500" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                  DRONE INSPECTION (AI FEED)
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800 animate-pulse">
                LIVE FEED
              </span>
            </div>

            {/* Simulated Aerial Camera View */}
            <div className="bg-[#060913] rounded-lg p-3 relative border border-slate-800 overflow-hidden min-h-[175px] flex flex-col justify-between">
              {/* Header stats */}
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>CAM-04 • GWALIOR SOUTH</span>
                <span>ALT: 42M • HD-AI</span>
              </div>

              {/* Anomaly Detection Bounding Box */}
              <div className="border border-dashed border-rose-500 bg-rose-950/40 p-2.5 rounded text-center my-2">
                <div className="text-[11px] font-mono font-bold text-rose-400">
                  [ TRACK ANOMALY DETECTED ]
                </div>
                <div className="text-[10px] font-mono text-slate-300 mt-0.5">
                  ID: A17-GWL • CONFIDENCE: 94%
                </div>
                <div className="text-[9px] text-slate-400 font-mono mt-1">
                  KM 142.4 • Ballast Obstruction & Micro-crack
                </div>
              </div>

              {/* Status footer */}
              <p className="text-[10px] text-slate-400 leading-tight">
                High mechanical fatigue detected on rail line. AI recommends immediate dynamic speed restriction.
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-3 pt-2">
            <button
              onClick={onTriggerDroneAnomaly}
              className="flex-1 py-2 px-3 rounded-lg bg-[#3b49df] hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <span>Plan Maintenance (A17)</span>
            </button>
            <button
              onClick={() => onGoToTab('drone')}
              className="py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
            >
              Inspect
            </button>
          </div>
        </div>

        {/* Center Column: AI Automatic Block Planner / ETA Engine - 5 Cols */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                  AI AUTOMATIC BLOCK PLANNER & ETA ENGINE
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-800">
                AI RECOMMENDED
              </span>
            </div>

            {/* Optimal Safety Window Box */}
            <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide">
                  OPTIMAL SAFETY WINDOW
                </span>
                <span className="px-2 py-0.5 rounded bg-indigo-600 text-white text-[10px] font-bold font-mono">
                  SCORE: 98
                </span>
              </div>
              <div className="text-xl font-bold font-mono-tech text-slate-900 dark:text-white">
                03:00 — 04:00 (Track A17 / Train {selectedTrain.number})
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Multi-objective optimization: 0 passenger conflict overlaps, +18.4% corridor asset availability gain.
              </p>
            </div>

            {/* Three Micro KPIs */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-50 dark:bg-slate-950/80 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Train Conflicts</div>
                <div className="font-mono-tech font-bold text-sm text-slate-900 dark:text-white">
                  0 Trains
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950/80 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Avg Delay</div>
                <div className="font-mono-tech font-bold text-sm text-emerald-600 dark:text-emerald-400">
                  +{selectedTrain.currentDelayMinutes} min
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950/80 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Cascade Index</div>
                <div className="font-mono-tech font-bold text-sm text-blue-600 dark:text-blue-400">
                  0.02 (MIN)
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2">
            <button
              onClick={onApproveForecast}
              className={`w-full py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                approvedForecast
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-sm'
              }`}
            >
              {approvedForecast ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>DISPATCH & ETA APPROVED</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>APPROVE RECALCULATED ETA & DISPATCH</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Real-Time Impact - 3 Cols */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-500" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                  REAL-TIME IMPACT
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">GWL-NDLS</span>
            </div>

            {/* Train Status Pills */}
            <div className="space-y-2">
              {trains.slice(0, 4).map((t) => (
                <div
                  key={t.id}
                  onClick={() => onSelectTrain(t.id)}
                  className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer text-xs transition-colors ${
                    t.id === selectedTrain.id
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 border-slate-100 dark:border-slate-800'
                  }`}
                >
                  <span className="font-mono-tech font-bold text-slate-800 dark:text-slate-200">
                    {t.number}
                  </span>
                  {t.currentDelayMinutes === 0 ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      ON TIME
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      +{t.currentDelayMinutes}m LATE
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>CORRIDOR FLOW:</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                NORMAL RESILIENCE
              </span>
            </div>
          </div>

          <div className="mt-3">
            <button
              onClick={() => onGoToTab('trains')}
              className="w-full py-1.5 text-center text-xs font-semibold text-[#3b49df] hover:underline"
            >
              View All Trains Table &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Visual Railway Timeline (24H) (Matching Screenshot 3) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>VISUAL RAILWAY TIMELINE (24H)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Synchronized track occupancy vs maintenance window slots (00:00 — 08:00)
            </p>
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            Resolution: 1 min • Sector: Gwalior Yard
          </div>
        </div>

        {/* Time Header Scale */}
        <div className="relative pt-2 pb-6 border-b border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-400 flex justify-between px-20">
          <span>00:00</span>
          <span>01:00</span>
          <span>02:00</span>
          <span>03:00</span>
          <span>04:00</span>
          <span>05:00</span>
          <span>06:00</span>
          <span>07:00</span>
          <span>08:00</span>
        </div>

        {/* Gantt Rows */}
        <div className="space-y-3 mt-4">
          {/* Train 12806 */}
          <div className="flex items-center gap-4">
            <div className="w-24 text-xs font-bold font-mono text-slate-700 dark:text-slate-300">
              🚆 Train 12806
            </div>
            <div className="flex-1 bg-slate-100 dark:bg-slate-950 h-8 rounded-lg relative overflow-hidden flex items-center">
              <div 
                className="absolute left-[48%] h-6 rounded bg-[#3b49df] text-white text-[11px] font-mono font-bold flex items-center px-2.5 shadow-sm"
                style={{ width: '85px' }}
              >
                12806 03:15
              </div>
            </div>
          </div>

          {/* Train 12952 */}
          <div className="flex items-center gap-4">
            <div className="w-24 text-xs font-bold font-mono text-slate-700 dark:text-slate-300">
              🚆 Train 12952
            </div>
            <div className="flex-1 bg-slate-100 dark:bg-slate-950 h-8 rounded-lg relative overflow-hidden flex items-center">
              <div 
                className="absolute left-[62%] h-6 rounded bg-purple-600 text-white text-[11px] font-mono font-bold flex items-center px-2.5 shadow-sm"
                style={{ width: '80px' }}
              >
                12952 04:15
              </div>
            </div>
          </div>

          {/* Train 12259 */}
          <div className="flex items-center gap-4">
            <div className="w-24 text-xs font-bold font-mono text-slate-700 dark:text-slate-300">
              🚆 Train 12259
            </div>
            <div className="flex-1 bg-slate-100 dark:bg-slate-950 h-8 rounded-lg relative overflow-hidden flex items-center">
              <div 
                className="absolute left-[24%] h-6 rounded bg-indigo-600 text-white text-[11px] font-mono font-bold flex items-center px-2.5 shadow-sm"
                style={{ width: '80px' }}
              >
                12259 01:20
              </div>
            </div>
          </div>

          {/* Train 12001 */}
          <div className="flex items-center gap-4">
            <div className="w-24 text-xs font-bold font-mono text-slate-700 dark:text-slate-300">
              🚆 Train 12001
            </div>
            <div className="flex-1 bg-slate-100 dark:bg-slate-950 h-8 rounded-lg relative overflow-hidden flex items-center">
              <div 
                className="absolute left-[84%] h-6 rounded bg-emerald-600 text-white text-[11px] font-mono font-bold flex items-center px-2.5 shadow-sm"
                style={{ width: '85px' }}
              >
                12001 07:20
              </div>
            </div>
          </div>

          {/* Maintenance Slot */}
          <div className="flex items-center gap-4 pt-1">
            <div className="w-24 text-xs font-bold font-mono text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <span>🔧 Slot A17</span>
            </div>
            <div className="flex-1 bg-slate-100 dark:bg-slate-950 h-8 rounded-lg relative overflow-hidden flex items-center">
              <div 
                className="absolute left-[44%] h-6 rounded bg-amber-500 text-slate-950 text-[11px] font-mono font-bold flex items-center px-2.5 shadow-sm"
                style={{ width: '120px' }}
              >
                Block A17 (Proposed)
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-2 text-[11px] text-slate-400 font-mono flex justify-between">
          <span>Timeline automatically updates when AI re-allocates maintenance slots or train delay changes.</span>
          <span className="text-indigo-500">Live corridor scheduler active</span>
        </div>
      </div>

      {/* Impact Benchmark Matrix (Matching Screenshot 3) */}
      <div className="bg-[#0b101d] text-white rounded-xl p-5 border border-slate-800 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <div className="text-xs font-mono text-indigo-400 font-semibold uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>IMPACT BENCHMARK MATRIX</span>
            </div>
            <h3 className="font-bold text-base mt-0.5">
              Traditional vs AI-Optimized Block Planning & ETA Forecasting
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-1 rounded">
            "Illustrative simulation result — not real railway performance data."
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Traditional Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-xs text-slate-300">
                TRADITIONAL / NON-OPTIMIZED PLAN
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-800">
                Fixed Manual Window
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-xs text-slate-400 block">Estimated disruption:</span>
                <span className="text-2xl font-bold font-mono-tech text-rose-400">38 min</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Affected trains:</span>
                <span className="text-xl font-bold font-mono-tech text-slate-200">3 trains</span>
              </div>
              <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                Conventional static maintenance blocks force multiple trains to hold in loop lines without dynamic rescheduling.
              </p>
            </div>
          </div>

          {/* AI Optimized Card */}
          <div className="bg-slate-900/90 border border-emerald-900/40 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-xs text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI OPTIMIZED PLAN
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                  RAILETA AI Engine
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-xs text-slate-400 block">Estimated disruption:</span>
                  <span className="text-2xl font-bold font-mono-tech text-emerald-400">4 min</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Affected trains:</span>
                  <span className="text-xl font-bold font-mono-tech text-slate-200">1 train</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-2">
              <div className="w-full py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-center font-bold text-xs flex items-center justify-center gap-1.5">
                <TrendingDown className="w-4 h-4" />
                <span>↓ 89% LOWER SIMULATED DISRUPTION</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Pillars Footer (Matching Screenshot 4) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
            PILLAR 01 • CASCADE PREVENTION
          </div>
          <div className="font-bold text-sm text-slate-900 dark:text-white mt-1">
            ● MINIMUM DISRUPTION
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-1">
            Dynamic multi-window scoring calculates lowest passenger delay impact and corridor cascade suppression.
          </p>
          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between font-mono text-[10px] text-slate-400">
            <span>TARGET DELAY</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">&lt; 5 MIN AVG</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
            PILLAR 02 • SAFETY WINDOWS
          </div>
          <div className="font-bold text-sm text-slate-900 dark:text-white mt-1">
            ● MAXIMUM ASSET AVAILABILITY
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-1">
            Protects crucial track, signal, bridge, and OHE maintenance windows (+18% simulated asset availability).
          </p>
          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between font-mono text-[10px] text-slate-400">
            <span>UPTIME GAIN</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">+18.4% SIM</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
            PILLAR 03 • PROACTIVE ALERTS
          </div>
          <div className="font-bold text-sm text-slate-900 dark:text-white mt-1">
            ● PASSENGER EARLY WARNING
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-1">
            Disruption intelligence pushes alternate trains to registered passengers before station congestion occurs.
          </p>
          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between font-mono text-[10px] text-slate-400">
            <span>DISPATCH LEAD</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">45 MIN EARLY</span>
          </div>
        </div>
      </div>
    </div>
  );
};
