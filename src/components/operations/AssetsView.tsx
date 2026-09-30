import React, { useState } from 'react';
import { RailwayAsset, AssetStatus } from '../../types/railway';
import { 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  Activity, 
  Video, 
  Wrench, 
  Search, 
  CheckCircle2, 
  Calendar,
  Sparkles
} from 'lucide-react';

interface AssetsViewProps {
  assets: RailwayAsset[];
  onInspectWithDrone: (assetName: string) => void;
}

export const AssetsView: React.FC<AssetsViewProps> = ({ assets, onInspectWithDrone }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'GOOD' | 'WARNING' | 'CRITICAL'>('ALL');

  const filteredAssets = assets.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.railKm.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    return true;
  });

  const goodCount = assets.filter(a => a.status === 'GOOD').length;
  const warningCount = assets.filter(a => a.status === 'WARNING').length;
  const criticalCount = assets.filter(a => a.status === 'CRITICAL').length;

  return (
    <div className="space-y-5">
      {/* Top Asset Summary Header */}
      <div className="bg-white dark:bg-[#0b101d] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <span>CORRIDOR ASSET HEALTH & AVAILABILITY INDEX</span>
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              8 MONITORED ASSETS
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time IoT sensors & autonomous drone inspection telemetry along the Gwalior-Agra-Delhi corridor.
          </p>
        </div>

        {/* 3 Quick Status Counts */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{goodCount} GOOD</span>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>{warningCount} WARNING</span>
          </div>
          <div className="bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span>{criticalCount} CRITICAL</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#0b101d] p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search asset, kilometer, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 w-64"
          />
        </div>

        <div className="flex gap-1.5 text-xs">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              statusFilter === 'ALL'
                ? 'bg-[#3b49df] text-white font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            All (8)
          </button>
          <button
            onClick={() => setStatusFilter('CRITICAL')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              statusFilter === 'CRITICAL'
                ? 'bg-rose-600 text-white font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Critical (1)
          </button>
          <button
            onClick={() => setStatusFilter('WARNING')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              statusFilter === 'WARNING'
                ? 'bg-amber-600 text-white font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Warning (2)
          </button>
          <button
            onClick={() => setStatusFilter('GOOD')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              statusFilter === 'GOOD'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Good (5)
          </button>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAssets.map((asset) => {
          const isCritical = asset.status === 'CRITICAL';
          const isWarning = asset.status === 'WARNING';

          return (
            <div
              key={asset.id}
              className={`bg-white dark:bg-[#0b101d] border rounded-xl p-4 shadow-sm flex flex-col justify-between transition-all ${
                isCritical 
                  ? 'border-rose-300 dark:border-rose-800/80 ring-1 ring-rose-500/20'
                  : isWarning 
                  ? 'border-amber-300 dark:border-amber-800/80' 
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                    {asset.category.replace('_', ' ')}
                  </span>
                  
                  {isCritical && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 animate-pulse flex items-center gap-1">
                      <AlertOctagon className="w-3 h-3" />
                      CRITICAL ATTENTION
                    </span>
                  )}
                  {isWarning && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      WARNING
                    </span>
                  )}
                  {asset.status === 'GOOD' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      GOOD
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {asset.name}
                </h3>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  {asset.location} • <strong className="text-blue-600 dark:text-cyan-400">{asset.railKm}</strong>
                </div>

                {/* Health Progress Bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-500 dark:text-slate-400">Health Index</span>
                    <span className={`font-bold ${
                      asset.healthScore < 60 ? 'text-rose-600 dark:text-rose-400' :
                      asset.healthScore < 85 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {asset.healthScore} / 100
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        asset.healthScore < 60 ? 'bg-rose-500' :
                        asset.healthScore < 85 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${asset.healthScore}%` }}
                    />
                  </div>
                </div>

                {/* Telemetry Metric Callout */}
                <div className="mt-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Telemetry Observation:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {asset.telemetryMetric}
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {asset.notes}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-slate-400">
                  Inspected: {asset.lastInspection}
                </span>

                <button
                  onClick={() => onInspectWithDrone(asset.name)}
                  className="px-3 py-1.5 rounded-lg bg-[#3b49df] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Inspect with Drone</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
