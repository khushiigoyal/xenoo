import React from 'react';
import { RailwayBlock } from '../../types/railway';
import { 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Sparkles, 
  Check, 
  RotateCcw,
  Navigation,
  Train as TrainIcon 
} from 'lucide-react';

interface BlocksViewProps {
  blocks: RailwayBlock[];
  onToggleApproveBlock: (blockId: string) => void;
}

export const BlocksView: React.FC<BlocksViewProps> = ({ blocks, onToggleApproveBlock }) => {
  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="bg-white dark:bg-[#0b101d] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>CORRIDOR TRACK BLOCKAGES & MAINTENANCE SLOTS</span>
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
              5 RECORDED
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Coordinated maintenance windows, structural testing blocks, and AI dynamic alternate routings.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 px-3 py-1.5 rounded-lg font-bold">
            2 ACTIVE BLOCKS
          </div>
          <div className="bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800 px-3 py-1.5 rounded-lg font-bold">
            2 PLANNED WINDOWS
          </div>
        </div>
      </div>

      {/* Blocks List */}
      <div className="space-y-4">
        {blocks.map((block) => {
          const isPlanned = block.status === 'PLANNED';
          const isActive = block.status === 'ACTIVE';
          const isCleared = block.status === 'CLEARED';

          return (
            <div
              key={block.id}
              className={`bg-white dark:bg-[#0b101d] border rounded-xl p-5 shadow-sm transition-all ${
                block.approvedByController 
                  ? 'border-emerald-300 dark:border-emerald-800/80 ring-1 ring-emerald-500/20'
                  : isActive
                  ? 'border-rose-300 dark:border-rose-800/80'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold ${
                    isPlanned ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800' :
                    isActive ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 animate-pulse' :
                    'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {block.trackCode}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {block.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {block.approvedByController ? (
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      CONTROLLER APPROVED
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      PENDING APPROVAL
                    </span>
                  )}
                </div>
              </div>

              {/* Grid with Details */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 my-3 text-xs">
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Corridor Section</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{block.section}</span>
                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{block.railKm}</span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Block Window</span>
                  <span className="font-mono-tech font-bold text-slate-900 dark:text-white text-sm">
                    {block.startTime} — {block.endTime}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Duration: 60 minutes</span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Affected Trains</span>
                  <div className="flex items-center gap-1 font-mono-tech font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                    <TrainIcon className="w-3.5 h-3.5 text-blue-600" />
                    <span>Train {block.affectedTrainNumbers.join(', ')}</span>
                  </div>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 block mt-0.5">
                    Est. Delay: +{block.impactMinutes} min
                  </span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">AI Bypass Routing</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-xs">
                    {block.bypassRouteAvailable ? '✓ Alternate Loop Active' : 'Hold at Signal Required'}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Pre-tested clearance</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-white">Maintenance Work Description:</strong> {block.reason}
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="text-[11px] text-slate-400 font-mono">
                  {block.bypassRouteAvailable ? 'AI has verified alternate track slot with 0 conflict overlaps' : 'High priority track block'}
                </span>

                <button
                  onClick={() => onToggleApproveBlock(block.id)}
                  className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
                    block.approvedByController
                      ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                      : 'bg-[#3b49df] hover:bg-blue-700 text-white'
                  }`}
                >
                  {block.approvedByController ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Revoke / Reschedule Block</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve Block & Dispatch AI Alternate Route</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
