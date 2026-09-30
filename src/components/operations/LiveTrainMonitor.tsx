import React, { useState } from 'react';
import { Train } from '../../types/railway';
import { Search, Gauge, Sparkles, CheckCircle2 } from 'lucide-react';

interface LiveTrainMonitorProps {
  trains: Train[];
  selectedTrainId: string;
  onSelectTrain: (trainId: string) => void;
}

export const LiveTrainMonitor: React.FC<LiveTrainMonitorProps> = ({
  trains,
  selectedTrainId,
  onSelectTrain
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ON_TIME' | 'DELAYED'>('ALL');

  const filteredTrains = trains.filter(t => {
    const matchesSearch = 
      t.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.currentStation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.nextStation.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === 'ON_TIME') return t.status === 'ON_TIME';
    if (statusFilter === 'DELAYED') return t.status !== 'ON_TIME';
    return true;
  });

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      {/* Header bar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              LIVE TRAIN MONITOR
            </h2>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {filteredTrains.length} TRACKED IN CORRIDOR
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time GPS telemetry, dynamic AI predicted arrival, and delay propagation
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search train..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 w-44"
            />
          </div>

          {/* Quick status tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-950 rounded-lg p-0.5 border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                statusFilter === 'ALL'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-bold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              All ({trains.length})
            </button>
            <button
              onClick={() => setStatusFilter('ON_TIME')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                statusFilter === 'ON_TIME'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              On Time ({trains.filter(t => t.status === 'ON_TIME').length})
            </button>
            <button
              onClick={() => setStatusFilter('DELAYED')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                statusFilter === 'DELAYED'
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Delayed ({trains.filter(t => t.status !== 'ON_TIME').length})
            </button>
          </div>
        </div>
      </div>

      {/* Train list table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-mono text-[10px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-2.5 px-3">Train</th>
              <th className="py-2.5 px-3">Location</th>
              <th className="py-2.5 px-3">Next Stop</th>
              <th className="py-2.5 px-3">Speed</th>
              <th className="py-2.5 px-3">Sched</th>
              <th className="py-2.5 px-3 text-blue-600 dark:text-blue-400 font-bold">Dynamic ETA</th>
              <th className="py-2.5 px-3">Delay</th>
              <th className="py-2.5 px-3">Confidence</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
            {filteredTrains.map((train) => {
              const isSelected = train.id === selectedTrainId;

              return (
                <tr
                  key={train.id}
                  onClick={() => onSelectTrain(train.id)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-50/70 dark:bg-blue-950/40 border-l-4 border-l-blue-600'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {/* Train number & name */}
                  <td className="py-3 px-3">
                    <span className="font-mono-tech font-bold text-sm text-slate-900 dark:text-white">
                      {train.number}
                    </span>
                    <div className="text-[11px] text-slate-600 dark:text-slate-300 font-medium truncate max-w-[140px]">
                      {train.name}
                    </div>
                  </td>

                  {/* Current station */}
                  <td className="py-3 px-3">
                    <div className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-[110px]">
                      {train.currentStation}
                    </div>
                  </td>

                  {/* Next station */}
                  <td className="py-3 px-3">
                    <div className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-[110px]">
                      {train.nextStation}
                    </div>
                  </td>

                  {/* Speed */}
                  <td className="py-3 px-3 font-mono">
                    <div className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                      <span>{train.currentSpeedKmH}</span>
                      <span className="text-[10px] text-slate-400 font-normal">km/h</span>
                    </div>
                  </td>

                  {/* Scheduled */}
                  <td className="py-3 px-3 font-mono text-slate-500">
                    {train.scheduledArrivalNext}
                  </td>

                  {/* AI Predicted */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1 font-mono-tech font-bold text-sm text-blue-600 dark:text-cyan-300">
                      <Sparkles className="w-3 h-3 text-blue-600 dark:text-cyan-400 shrink-0" />
                      <span>{train.predictedArrivalNext}</span>
                    </div>
                  </td>

                  {/* Delay */}
                  <td className="py-3 px-3">
                    {train.currentDelayMinutes <= 0 ? (
                      <span className="inline-flex items-center gap-1 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        On Time
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-600 dark:text-amber-400">
                        +{train.currentDelayMinutes} min
                      </span>
                    )}
                  </td>

                  {/* Confidence */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1 font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      <span>{train.confidencePercentage}%</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3 text-center">
                    {train.status === 'ON_TIME' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                        ON TIME
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                        DELAYED
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTrain(train.id);
                      }}
                      className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-[#3b49df] text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {isSelected ? 'Focused' : 'Inspect'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
