import React, { useState } from 'react';
import { Train, Station } from '../../types/railway';
import { STATIONS } from '../../data/mockRailwayData';
import { 
  Train as TrainIcon, 
  MapPin, 
  Radio, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Layers,
  X,
  Gauge,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

interface CorridorMapProps {
  selectedTrain: Train;
  allTrains: Train[];
  onSelectTrain: (trainId: string) => void;
}

export const CorridorMap: React.FC<CorridorMapProps> = ({
  selectedTrain,
  allTrains,
  onSelectTrain
}) => {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      {/* Top Header matching Screenshot 2 */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Railway Network Corridor Visualization
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Gwalior — Agra — NDLS
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time track occupancy, maintenance blockades, and AI dynamic alternate routings.
          </p>
        </div>

        {/* Legend from Screenshot 2 */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Normal</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Planned</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>Active Blockage</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span>AI Rec. Route</span>
          </div>
        </div>
      </div>

      {/* Main Track Visualization Canvas (Deep Navy matching Screenshot 2) */}
      <div className="p-6 bg-[#060913] relative overflow-x-auto min-h-[440px] flex flex-col justify-center items-center">
        {/* Subtle grid lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

        <div className="w-full max-w-xl relative py-4">
          {/* Central Vertical Track Line */}
          <div className="absolute left-1/2 top-4 bottom-4 w-1 -translate-x-1/2 bg-slate-800">
            {/* Railroad ties */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(180deg,#334155,#334155_2px,transparent_2px,transparent_14px)]" />
          </div>

          {/* Dotted AI Bypass Line */}
          <div className="absolute left-[62%] top-20 bottom-44 w-12 border-r-2 border-dashed border-blue-500/80 rounded-r-2xl pointer-events-none">
            <span className="absolute top-1/2 -right-16 -translate-y-1/2 text-[10px] font-mono text-blue-400 font-bold bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-800">
              AI Bypass
            </span>
          </div>

          {/* STATION 1: Gwalior Junction */}
          <div className="relative z-10 mb-8">
            <div 
              onClick={() => setSelectedStation(STATIONS[0])}
              className="bg-[#0b101d] border border-slate-700/80 hover:border-cyan-500/60 p-3 rounded-xl shadow-lg flex items-center justify-between cursor-pointer transition-all max-w-md mx-auto"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 font-bold font-mono text-xs flex items-center justify-center border border-slate-700">
                  GWL
                </span>
                <div>
                  <div className="font-bold text-white text-sm">Gwalior Junction</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                    <span>Main Line Down</span>
                    <span>•</span>
                    <span>Signal S23</span>
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="text-emerald-400">Normal</span>
                  </div>
                </div>
              </div>
              <div className="font-mono text-xs font-bold text-cyan-400">
                KM 312
              </div>
            </div>
          </div>

          {/* TRACK A17 BLOCKAGE / PLANNED WINDOW (Matching Screenshot 2) */}
          <div className="relative z-10 my-6 flex justify-center">
            <div className="bg-amber-500 text-slate-950 px-4 py-2 rounded-lg font-mono font-bold text-xs shadow-lg flex flex-col items-center">
              <span>Track A17</span>
              <span className="text-[9px] uppercase tracking-wider font-extrabold bg-amber-600/30 px-1.5 rounded mt-0.5">
                PLANNED
              </span>
            </div>
          </div>

          {/* STATION 2: Morena */}
          <div className="relative z-10 my-8">
            <div 
              onClick={() => setSelectedStation(STATIONS[1])}
              className="bg-[#0b101d] border border-slate-700/80 hover:border-cyan-500/60 p-3 rounded-xl shadow-lg flex items-center justify-between cursor-pointer transition-all max-w-md mx-auto"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 font-bold font-mono text-xs flex items-center justify-center border border-slate-700">
                  MRA
                </span>
                <div>
                  <div className="font-bold text-white text-sm">Morena</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                    <span>Loop lines clear</span>
                    <span>•</span>
                    <span>Bridge B04</span>
                    <span className="inline-block w-2 h-2 rounded-full bg-amber-400"></span>
                    <span className="text-amber-400">Inspection Required</span>
                  </div>
                </div>
              </div>
              <div className="font-mono text-xs font-bold text-cyan-400">
                KM 350
              </div>
            </div>
          </div>

          {/* SPEED BADGE IN CENTER */}
          <div className="relative z-10 my-5 flex justify-center">
            <div className="bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1 rounded text-[10px] font-mono shadow-md flex items-center gap-1.5">
              <span>Speed:</span>
              <strong className="text-white font-bold">{selectedTrain.currentSpeedKmH} km/h</strong>
            </div>
          </div>

          {/* STATION 3: Agra Cantt */}
          <div className="relative z-10 my-8">
            <div 
              onClick={() => setSelectedStation(STATIONS[3])}
              className="bg-[#0b101d] border border-slate-700/80 hover:border-cyan-500/60 p-3 rounded-xl shadow-lg flex items-center justify-between cursor-pointer transition-all max-w-md mx-auto"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 font-bold font-mono text-xs flex items-center justify-center border border-slate-700">
                  AGC
                </span>
                <div>
                  <div className="font-bold text-white text-sm">Agra Cantt</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                    <span>Traction Substation O12</span>
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="text-emerald-400">Normal</span>
                  </div>
                </div>
              </div>
              <div className="font-mono text-xs font-bold text-cyan-400">
                KM 405
              </div>
            </div>
          </div>

          {/* STATION 4: Mathura Junction */}
          <div className="relative z-10 my-8">
            <div 
              onClick={() => setSelectedStation(STATIONS[5])}
              className="bg-[#0b101d] border border-slate-700/80 hover:border-cyan-500/60 p-3 rounded-xl shadow-lg flex items-center justify-between cursor-pointer transition-all max-w-md mx-auto group"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 font-bold font-mono text-xs flex items-center justify-center border border-slate-700 group-hover:bg-cyan-950 group-hover:text-cyan-300 transition-colors">
                  MTJ
                </span>
                <div>
                  <div className="font-bold text-white text-sm">Mathura Junction</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                    <span>Interlocking Route J4</span>
                    <span>•</span>
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="text-emerald-400">Clear</span>
                  </div>
                </div>
              </div>
              <div className="font-mono text-xs font-bold text-cyan-400">
                KM 459
              </div>
            </div>
          </div>

          {/* STATION 5: New Delhi (Terminus) */}
          <div className="relative z-10 my-8">
            <div 
              onClick={() => setSelectedStation(STATIONS[9])}
              className="bg-[#0b101d] border border-indigo-500/50 hover:border-cyan-400 p-3 rounded-xl shadow-lg flex items-center justify-between cursor-pointer transition-all max-w-md mx-auto group ring-1 ring-indigo-500/20"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-900/80 text-indigo-300 font-bold font-mono text-xs flex items-center justify-center border border-indigo-700 group-hover:bg-cyan-950 group-hover:text-cyan-300 transition-colors">
                  NDLS
                </span>
                <div>
                  <div className="font-bold text-white text-sm">New Delhi (Central Terminus)</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                    <span>16 Platforms</span>
                    <span>•</span>
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="text-emerald-400">High Speed Corridor Exit</span>
                  </div>
                </div>
              </div>
              <div className="font-mono text-xs font-bold text-indigo-400">
                KM 601
              </div>
            </div>
          </div>

          <div className="text-center font-mono text-[11px] text-slate-500 my-2">
            ▲ Click any station card to inspect detailed dynamic arrival predictions, confidence score, and algorithmic rationale
          </div>
        </div>
      </div>

      {/* Blockage Details Banner below (Matching Screenshot 2) */}
      <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800">
              BLOCK A17
            </span>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Track A17 Blockage & Maintenance Details
            </h4>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
            Planned Window
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Reason</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Scheduled maintenance (Tie-tamping & rail repair)
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Start Time</span>
            <span className="font-mono-tech font-bold text-slate-800 dark:text-slate-200">
              03:00
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">End Time</span>
            <span className="font-mono-tech font-bold text-slate-800 dark:text-slate-200">
              04:00
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Affected Trains</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {selectedTrain.number} (Impact: +{selectedTrain.currentDelayMinutes} min)
            </span>
          </div>
        </div>
      </div>

      {/* MODAL: CLICKED STATION ETA & PREDICTION DETAILS (Fulfills SIH Requirement) */}
      {selectedStation && (() => {
        const trainStop = selectedTrain.stops.find(s => s.stationCode === selectedStation.code) || selectedTrain.stops[0];
        const isDelay = trainStop.delayMinutes > 0;

        return (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[#0b101d] text-white border border-slate-700 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="p-4 bg-[#080d1a] border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-800 text-blue-300 font-bold font-mono text-sm flex items-center justify-center">
                    {selectedStation.code}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">
                      {selectedStation.name}
                    </h3>
                    <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                      <span>Division: {selectedStation.division}</span>
                      <span>•</span>
                      <span>Zone: {selectedStation.zone}</span>
                      <span>•</span>
                      <span>{selectedStation.platforms} Platforms</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedStation(null)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800">
                  <span>ACTIVE TRAIN INSPECTION:</span>
                  <span className="text-white font-bold">{selectedTrain.number} — {selectedTrain.name}</span>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 font-mono">
                  {/* Scheduled Arrival */}
                  <div className="bg-[#03060f] p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block">Scheduled Arrival</span>
                    <span className="text-xl font-bold text-slate-200">
                      {trainStop.scheduledArrival}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Official Timetable</span>
                  </div>

                  {/* AI Predicted Arrival */}
                  <div className={`p-3 rounded-xl border ${
                    isDelay 
                      ? 'bg-rose-950/30 border-rose-800/80 text-rose-200' 
                      : 'bg-emerald-950/30 border-emerald-800/80 text-emerald-200'
                  }`}>
                    <span className="text-[10px] text-slate-400 uppercase block">AI Predicted Arrival</span>
                    <span className="text-xl font-bold font-mono-tech flex items-center gap-1.5">
                      <span>{trainStop.predictedArrival}</span>
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                    </span>
                    <span className="text-[10px] block mt-0.5 font-bold">
                      {isDelay ? `+${trainStop.delayMinutes} min delay` : 'On Time'}
                    </span>
                  </div>
                </div>

                {/* Confidence & Variance */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#080d1a] p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Prediction Confidence</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-lg font-bold text-emerald-400">
                        {trainStop.confidence}%
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                        HIGH
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#080d1a] p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Historical Punctuality</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-lg font-bold text-cyan-400">
                        {selectedStation.historicalPunctualityScore}%
                      </span>
                      <span className="text-[10px] text-slate-400">
                        ±{selectedStation.averageDelayImpactMin}m variance
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reason for Prediction (Mandatory SIH Requirement) */}
                <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-indigo-300">
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                    <span>REASON FOR PREDICTION:</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {isDelay 
                      ? selectedTrain.featureAttribution.rationale 
                      : 'Corridor section is operating under nominal headway spacing. Automatic block signals indicate Clear aspect. No maintenance blocks or drone obstructions present.'}
                  </p>
                </div>

                {/* Action button */}
                <button
                  onClick={() => setSelectedStation(null)}
                  className="w-full py-2.5 rounded-lg bg-[#3b49df] hover:bg-blue-600 text-white font-bold text-xs transition-colors"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
