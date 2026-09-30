import React from 'react';

interface KPICardsProps {
  activeCount: number;
  delayedCount: number;
  avgError: number;
  totalDelayMinutes: number;
}

export const KPICards: React.FC<KPICardsProps> = ({
  activeCount,
  delayedCount,
  avgError,
  totalDelayMinutes
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
      {/* 1. ACTIVE TRAINS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            ACTIVE TRAINS
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            SIMULATED
          </span>
        </div>
        <div className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white font-mono-tech tracking-tight">
          {activeCount}
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Network Active
          </span>
          <span className="font-mono text-[11px]">Gwalior Div</span>
        </div>
      </div>

      {/* 2. ACTIVE BLOCKS / DELAYED */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            TRAINS DELAYED
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            PENDING
          </span>
        </div>
        <div className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white font-mono-tech tracking-tight">
          {delayedCount}
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Waiting Window
          </span>
          <span className="font-mono text-[11px]">Corridor Slot</span>
        </div>
      </div>

      {/* 3. AVERAGE ETA ERROR (MAE) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            AVERAGE ETA ERROR
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
            HIGH PRIORITY
          </span>
        </div>
        <div className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white font-mono-tech tracking-tight">
          {avgError} <span className="text-lg font-normal text-slate-500 dark:text-slate-400">MIN</span>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            87.4% Within ±5m
          </span>
          <span className="font-mono text-[11px]">MAE Accuracy</span>
        </div>
      </div>

      {/* 4. PREDICTED DISRUPTIONS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            PREDICTED DISRUPTIONS
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
            -89% AI OPT
          </span>
        </div>
        <div className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white font-mono-tech tracking-tight">
          {totalDelayMinutes} <span className="text-lg font-normal text-slate-500 dark:text-slate-400">MIN DELAY</span>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            Continuous AI Online
          </span>
          <span className="font-mono text-[11px]">Dynamic Re-sync</span>
        </div>
      </div>
    </div>
  );
};
