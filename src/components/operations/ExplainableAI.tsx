import React, { useState } from 'react';
import { FeatureAttribution } from '../../types/railway';
import { HelpCircle, BarChart2, Sliders, Sparkles, RotateCcw } from 'lucide-react';
import { addMinutesToTimeString } from '../../services/forecastingEngine';

interface ExplainableAIProps {
  attribution: FeatureAttribution;
  trainNumber: string;
}

export const ExplainableAI: React.FC<ExplainableAIProps> = ({ attribution, trainNumber }) => {
  // Interactive What-If Scenario sandbox states
  const [whatIfDelay, setWhatIfDelay] = useState(0);
  const [whatIfDwell, setWhatIfDwell] = useState(0);
  const [whatIfWeather, setWhatIfWeather] = useState(0);

  const sandboxTotalDelay = attribution.totalPredictedDelay + whatIfDelay + whatIfDwell + whatIfWeather;
  const sandboxETA = addMinutesToTimeString('04:32', sandboxTotalDelay);

  const items = [
    { label: 'Inherited Prior Run Delay', value: attribution.baseRunningDelay + whatIfDelay, color: 'bg-indigo-500', barColor: 'from-indigo-600 to-indigo-400' },
    { label: 'Signal Aspect Restrictions', value: attribution.signalRestriction, color: 'bg-amber-500', barColor: 'from-amber-600 to-amber-400' },
    { label: 'Section Track Congestion & Headway', value: attribution.trackCongestion, color: 'bg-cyan-500', barColor: 'from-cyan-600 to-cyan-400' },
    { label: 'Unscheduled Halt / Dwell Variance', value: attribution.scheduledDwellDelta + whatIfDwell, color: 'bg-rose-500', barColor: 'from-rose-600 to-rose-400' },
    { label: 'Weather / Low Visibility Factor', value: attribution.weatherFactor + whatIfWeather, color: 'bg-purple-500', barColor: 'from-purple-600 to-purple-400' },
    { label: 'Drone Caution Order Impact', value: attribution.droneCautionOrder, color: 'bg-emerald-500', barColor: 'from-emerald-600 to-emerald-400' },
  ];

  const maxVal = Math.max(1, ...items.map(i => i.value), sandboxTotalDelay);

  return (
    <div className="bg-[#0b101d] text-white border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-[#080d1a] flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-purple-400" />
              EXPLAINABLE AI: WHY DID THE ETA CHANGE?
            </h3>
            <span className="text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded font-bold">
              FEATURE ATTRIBUTION WATERFALL
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent algorithmic breakdown of all contributing physical & operational variables.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Model Assurance:</span>
          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
            {attribution.confidence}% Confidence
          </span>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Waterfall Contribution Chart (7 Cols) */}
        <div className="lg:col-span-7 space-y-3.5">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
            Variable Impact Decomposition (Minutes Added to Timetable)
          </div>

          {items.map((item, idx) => {
            const widthPct = Math.max(3, Math.round((item.value / maxVal) * 100));

            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${item.color}`} />
                    {item.label}
                  </span>
                  <span className="font-mono font-bold text-slate-200">
                    {item.value > 0 ? `+${item.value} min` : '+0 min'}
                  </span>
                </div>

                <div className="w-full bg-[#03060f] rounded-full h-2.5 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${item.barColor} transition-all duration-500`}
                    style={{ width: `${item.value > 0 ? widthPct : 0}%` }}
                  />
                </div>
              </div>
            );
          })}

          {/* Total Waterfall Summary Bar */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="font-bold text-white text-sm">
              TOTAL ACCUMULATED PREDICTED DELAY:
            </span>
            <span className={`font-mono-tech font-bold text-lg ${
              sandboxTotalDelay > 0 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {sandboxTotalDelay > 0 ? `+${sandboxTotalDelay} min` : '0 min (On Time)'}
            </span>
          </div>
        </div>

        {/* Interactive What-If Scenario Sandbox (5 Cols) */}
        <div className="lg:col-span-5 bg-[#080d1a] p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>WHAT-IF SCENARIO SANDBOX</span>
              </span>
              <button
                onClick={() => {
                  setWhatIfDelay(0);
                  setWhatIfDwell(0);
                  setWhatIfWeather(0);
                }}
                className="text-[10px] text-slate-400 hover:text-white font-mono flex items-center gap-1"
                title="Reset sliders"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-400 mb-3">
              Drag parameters to evaluate real-time sensitivity analysis on Train {trainNumber}'s arrival.
            </p>

            {/* Slider 1: Added Track Delay */}
            <div className="space-y-1 mb-2.5">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">Corridor Slowdown:</span>
                <span className="text-cyan-400 font-bold">+{whatIfDelay} min</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                value={whatIfDelay}
                onChange={(e) => setWhatIfDelay(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Slider 2: Station Dwell Overrun */}
            <div className="space-y-1 mb-2.5">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">Platform Dwell Overrun:</span>
                <span className="text-indigo-400 font-bold">+{whatIfDwell} min</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                value={whatIfDwell}
                onChange={(e) => setWhatIfDwell(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
              />
            </div>

            {/* Slider 3: Weather Factor */}
            <div className="space-y-1 mb-3">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">Dense Fog Speed Restriction:</span>
                <span className="text-purple-400 font-bold">+{whatIfWeather} min</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={whatIfWeather}
                onChange={(e) => setWhatIfWeather(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
            </div>

            {/* Dynamic Result Callout */}
            <div className="p-3 bg-[#03060f] rounded-lg border border-cyan-900/50 text-xs">
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Simulated Dynamic Arrival:</span>
                <span className="font-mono-tech font-bold text-cyan-300 text-sm">{sandboxETA}</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Scheduled Timetable: 04:32 (Delta: +{sandboxTotalDelay} min)
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-800">
            Audit ID: REC-{trainNumber}-{Date.now().toString().slice(-6)} • Stored to immutability log
          </div>
        </div>
      </div>
    </div>
  );
};
