import React from 'react';
import { TrainStop, Train } from '../../types/railway';
import { CheckCircle2, Clock, MapPin, Sparkles } from 'lucide-react';

interface DynamicTimelineProps {
  train: Train;
}

export const DynamicTimeline: React.FC<DynamicTimelineProps> = ({ train }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              DYNAMIC ETA TIMELINE & CASCADE RECALCULATION
            </h2>
            <span className="text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded">
              STATION-BY-STATION DYNAMIC RIPPLE
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Notice how delays propagate and buffer dynamically at downstream junctions.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <span>Train: <strong className="text-slate-900 dark:text-white">{train.number}</strong> ({train.name})</span>
        </div>
      </div>

      <div className="p-5">
        {/* Timeline nodes */}
        <div className="relative">
          {/* Vertical connecting line */}
          <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-slate-200 dark:bg-slate-800" />

          <div className="space-y-4">
            {train.stops.map((stop, index) => {
              const isDeparted = stop.status === 'departed';
              const isNext = stop.status === 'next';

              return (
                <div
                  key={stop.stationCode}
                  className={`relative flex items-start gap-4 p-3.5 rounded-xl border transition-all ${
                    isNext
                      ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-400 dark:border-blue-700 shadow-sm ring-1 ring-blue-500/20'
                      : isDeparted
                      ? 'bg-slate-50/70 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/60 opacity-75'
                      : 'bg-white dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {/* Status Node Circle */}
                  <div className="relative z-10 shrink-0 mt-0.5">
                    {isDeparted ? (
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    ) : isNext ? (
                      <div className="w-8 h-8 rounded-full bg-[#3b49df] text-white font-bold flex items-center justify-center shadow-md ring-4 ring-blue-500/20 animate-pulse">
                        <MapPin className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 font-mono text-xs">
                        {index + 1}
                      </div>
                    )}
                  </div>

                  {/* Stop Details Content */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                    {/* Station Name & Platform */}
                    <div className="sm:col-span-1">
                      <div className="flex items-center gap-2">
                        <h4 className={`font-bold text-sm ${
                          isNext ? 'text-blue-700 dark:text-blue-300' : 'text-slate-900 dark:text-white'
                        }`}>
                          {stop.stationName}
                        </h4>
                        {isNext && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800 uppercase font-bold">
                            NEXT
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                        <span>{stop.stationCode}</span>
                        <span>•</span>
                        <span>{stop.platform}</span>
                        <span>•</span>
                        <span>{stop.distanceFromStartKm} km</span>
                      </div>
                    </div>

                    {/* Scheduled Timings */}
                    <div className="sm:col-span-1">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Timetable</span>
                      <div className="text-xs font-mono text-slate-600 dark:text-slate-400">
                        Arr: <strong className="text-slate-800 dark:text-slate-200">{stop.scheduledArrival}</strong>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        Dep: {stop.scheduledDeparture}
                      </div>
                    </div>

                    {/* Dynamic AI Predicted Arrival */}
                    <div className="sm:col-span-1">
                      <span className="text-[10px] text-blue-600 dark:text-cyan-400 uppercase font-mono flex items-center gap-1 font-bold">
                        <Sparkles className="w-3 h-3" />
                        AI Dynamic ETA
                      </span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="font-mono-tech font-bold text-lg text-slate-900 dark:text-white">
                          {isDeparted ? stop.scheduledArrival : stop.predictedArrival}
                        </span>
                        {stop.delayMinutes > 0 ? (
                          <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                            +{stop.delayMinutes} min
                          </span>
                        ) : (
                          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            On Time
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status badge & Confidence */}
                    <div className="sm:col-span-1 sm:text-right">
                      {isDeparted ? (
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>Departed</span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            <span>Confidence: {stop.confidence}%</span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {stop.delayMinutes > 0 
                              ? `Delay propagated (+${stop.delayMinutes}m)` 
                              : 'Nominal schedule'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
