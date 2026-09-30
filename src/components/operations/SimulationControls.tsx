import React, { useState } from 'react';
import { 
  Zap, 
  AlertTriangle, 
  Radio, 
  CloudRain, 
  RotateCcw, 
  Flame, 
  Clock, 
  Video,
  Sparkles,
  CheckCircle2,
  Sliders,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface SimulationControlsProps {
  onSimulate: (
    type: 'DELAY' | 'SIGNAL' | 'CONGESTION' | 'UNSCHEDULED_STOP' | 'WEATHER' | 'DRONE',
    customMinutes?: number,
    customTitle?: string
  ) => void;
  onReset: () => void;
  selectedTrainNumber: string;
  activeEventsCount: number;
  lastSimulatedEvent: string | null;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  onSimulate,
  onReset,
  selectedTrainNumber,
  activeEventsCount,
  lastSimulatedEvent
}) => {
  const [showCustomSlider, setShowCustomSlider] = useState(false);
  const [customDelayMinutes, setCustomDelayMinutes] = useState(25);
  const [customReason, setCustomReason] = useState('Overhead Catenary Sag at Junction');

  const handleInjectCustom = () => {
    onSimulate('DELAY', customDelayMinutes, `Custom Disruption (+${customDelayMinutes} min): ${customReason}`);
  };

  return (
    <div className="bg-white dark:bg-[#0b101d] border-2 border-indigo-200 dark:border-indigo-800/60 rounded-xl overflow-hidden shadow-sm">
      {/* Simulation Banner */}
      <div className="p-3.5 bg-indigo-50/60 dark:bg-slate-950 border-b border-indigo-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            <Zap className="w-4 h-4 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                DYNAMIC DELAY SIMULATION SUITE
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-400 text-slate-950 font-bold">
                SIH DEMO CONTROLS
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Inject real-world disruptions to trigger instantaneous AI recalculation downstream for Train {selectedTrainNumber}.
            </p>
          </div>
        </div>

        {/* Right side toggles & Active count badge */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCustomSlider(!showCustomSlider)}
            className="px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 text-xs font-mono font-bold flex items-center gap-1.5 hover:bg-indigo-200 dark:hover:bg-indigo-900 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Custom Delay Slider</span>
            {showCustomSlider ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {activeEventsCount > 0 ? (
            <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 font-mono text-xs flex items-center gap-1.5 font-bold animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{activeEventsCount} Active Disruption{activeEventsCount > 1 ? 's' : ''}</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-mono text-xs flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Schedule Clear (Nominal)</span>
            </span>
          )}
        </div>
      </div>

      {/* Optional Interactive Custom Slider Drawer */}
      {showCustomSlider && (
        <div className="p-4 bg-indigo-950/20 dark:bg-[#060914] border-b border-indigo-200 dark:border-slate-800 animate-in slide-in-from-top-2 duration-150">
          <div className="max-w-2xl mx-auto space-y-3">
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className="text-slate-700 dark:text-indigo-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                <span>INJECT ANY CUSTOM DELAY TO TEST AI MODEL RESILIENCE</span>
              </span>
              <span className="text-rose-600 dark:text-rose-400 text-sm font-extrabold font-mono-tech">
                +{customDelayMinutes} MINUTES
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-slate-400 shrink-0">+1m</span>
              <input
                type="range"
                min="1"
                max="90"
                value={customDelayMinutes}
                onChange={(e) => setCustomDelayMinutes(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#3b49df]"
              />
              <span className="text-[11px] font-mono text-slate-400 shrink-0">+90m</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <input
                type="text"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Reason (e.g. Signal failure, Track repair, Cattle on track...)"
                className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleInjectCustom}
                className="px-4 py-1.5 bg-[#3b49df] hover:bg-blue-600 text-white font-bold text-xs rounded-lg font-mono flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Recalculate +{customDelayMinutes}m Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recalculation Notification Alert Bar if an event just occurred */}
      {lastSimulatedEvent && (
        <div className="bg-blue-50 dark:bg-slate-950 px-4 py-2 border-b border-blue-200 dark:border-blue-900/40 flex items-center justify-between text-xs text-blue-900 dark:text-cyan-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-cyan-400 animate-spin" />
            <span className="font-mono font-bold">
              ⚡ {lastSimulatedEvent}
            </span>
          </div>
          <span className="text-[10px] font-mono text-blue-600 dark:text-cyan-400 hidden sm:inline">
            Downstream ETAs & Passenger Alerts Recalculated
          </span>
        </div>
      )}

      {/* Action Buttons Grid */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 bg-slate-50/50 dark:bg-slate-950/70">
        {/* 1. Simulate +20 Min Delay */}
        <button
          onClick={() => onSimulate('DELAY')}
          className="flex flex-col items-center justify-center p-3 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-700/60 hover:border-rose-500 text-rose-900 dark:text-white font-medium text-xs shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all group"
        >
          <Flame className="w-4 h-4 text-rose-600 dark:text-rose-400 group-hover:animate-bounce mb-1" />
          <span className="font-bold text-center leading-tight">
            +20 MIN DELAY
          </span>
          <span className="text-[9px] text-rose-600 dark:text-rose-300 font-mono mt-0.5">
            Loco Aux Trip
          </span>
        </button>

        {/* 2. Simulate Signal Delay */}
        <button
          onClick={() => onSimulate('SIGNAL')}
          className="flex flex-col items-center justify-center p-3 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/60 hover:border-amber-500 text-amber-900 dark:text-white font-medium text-xs shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all group"
        >
          <Radio className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover:animate-pulse mb-1" />
          <span className="font-bold text-center leading-tight">
            SIGNAL DELAY
          </span>
          <span className="text-[9px] text-amber-600 dark:text-amber-300 font-mono mt-0.5">
            +7 min Caution
          </span>
        </button>

        {/* 3. Simulate Congestion */}
        <button
          onClick={() => onSimulate('CONGESTION')}
          className="flex flex-col items-center justify-center p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-300 dark:border-indigo-700/60 hover:border-indigo-500 text-indigo-900 dark:text-white font-medium text-xs shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all group"
        >
          <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 mb-1" />
          <span className="font-bold text-center leading-tight">
            CONGESTION
          </span>
          <span className="text-[9px] text-indigo-600 dark:text-indigo-300 font-mono mt-0.5">
            +12 min Headway
          </span>
        </button>

        {/* 4. Simulate Unscheduled Stop */}
        <button
          onClick={() => onSimulate('UNSCHEDULED_STOP')}
          className="flex flex-col items-center justify-center p-3 rounded-lg bg-orange-50 dark:bg-orange-950/60 border border-orange-300 dark:border-orange-700/60 hover:border-orange-500 text-orange-900 dark:text-white font-medium text-xs shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all group"
        >
          <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400 group-hover:rotate-12 mb-1" />
          <span className="font-bold text-center leading-tight">
            UNSCHEDULED
          </span>
          <span className="text-[9px] text-orange-600 dark:text-orange-300 font-mono mt-0.5">
            +15 min Loop Halt
          </span>
        </button>

        {/* 5. Simulate Weather Impact */}
        <button
          onClick={() => onSimulate('WEATHER')}
          className="flex flex-col items-center justify-center p-3 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-700/60 hover:border-purple-500 text-purple-900 dark:text-white font-medium text-xs shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all group"
        >
          <CloudRain className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:animate-bounce mb-1" />
          <span className="font-bold text-center leading-tight">
            WEATHER / FOG
          </span>
          <span className="text-[9px] text-purple-600 dark:text-purple-300 font-mono mt-0.5">
            +18 min (60 km/h)
          </span>
        </button>

        {/* 6. Simulate Drone Event */}
        <button
          onClick={() => onSimulate('DRONE')}
          className="flex flex-col items-center justify-center p-3 rounded-lg bg-blue-50 dark:bg-cyan-950/60 border border-blue-300 dark:border-cyan-700/60 hover:border-blue-500 text-blue-900 dark:text-white font-medium text-xs shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all group"
        >
          <Video className="w-4 h-4 text-blue-600 dark:text-cyan-400 group-hover:scale-125 mb-1" />
          <span className="font-bold text-center leading-tight">
            DRONE ANOMALY
          </span>
          <span className="text-[9px] text-blue-600 dark:text-cyan-300 font-mono mt-0.5">
            +10 min Caution
          </span>
        </button>

        {/* 7. Clear Events / Reset */}
        <button
          onClick={onReset}
          className="flex flex-col items-center justify-center p-3 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-slate-400 text-slate-700 dark:text-slate-300 font-medium text-xs shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all group"
        >
          <RotateCcw className="w-4 h-4 text-slate-500 group-hover:-rotate-90 transition-transform mb-1" />
          <span className="font-bold text-center leading-tight">
            CLEAR / RESET
          </span>
          <span className="text-[9px] text-slate-400 font-mono mt-0.5">
            Nominal Timetable
          </span>
        </button>
      </div>
    </div>
  );
};
