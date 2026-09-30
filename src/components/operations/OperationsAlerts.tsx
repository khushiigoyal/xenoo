import React from 'react';
import { OperationsAlert, EventSeverity } from '../../types/railway';
import { AlertOctagon, AlertTriangle, Info, ShieldAlert, CheckCircle2, ChevronRight, Check, CheckCheck } from 'lucide-react';
import { playRailwayChime } from '../../utils/audioAlerts';

interface OperationsAlertsProps {
  alerts: OperationsAlert[];
  onDismissAlert?: (id: string) => void;
  onDismissAllAlerts?: () => void;
}

export const OperationsAlerts: React.FC<OperationsAlertsProps> = ({ 
  alerts, 
  onDismissAlert,
  onDismissAllAlerts 
}) => {
  const getSeverityBadge = (severity: EventSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800 animate-pulse">
            <AlertOctagon className="w-3 h-3" />
            CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
            <AlertTriangle className="w-3 h-3" />
            HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-yellow-950 text-yellow-300 border border-yellow-800">
            <Info className="w-3 h-3" />
            MEDIUM
          </span>
        );
      case 'LOW':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
            <CheckCircle2 className="w-3 h-3" />
            LOW
          </span>
        );
    }
  };

  const handleDismiss = (id: string) => {
    playRailwayChime();
    if (onDismissAlert) {
      onDismissAlert(id);
    }
  };

  const handleDismissAll = () => {
    playRailwayChime();
    if (onDismissAllAlerts) {
      onDismissAllAlerts();
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="p-4 border-b border-slate-800 bg-slate-900 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <h3 className="text-base font-bold font-display text-white tracking-wide">
            OPERATIONS ALERTS & CONTROLLER ADVISORY
          </h3>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] font-mono text-slate-400">
            {alerts.length} Active System Advisories
          </span>
          {alerts.length > 0 && onDismissAllAlerts && (
            <button
              onClick={handleDismissAll}
              className="px-2.5 py-1 rounded text-xs font-mono font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Acknowledge All</span>
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {alerts.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-slate-950 rounded-lg space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="font-semibold text-slate-300">All Operations Advisories Acknowledged</p>
            <p className="text-[11px] text-slate-500">Corridor traffic controllers have confirmed all dispatch orders. Nominal throughput restored.</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    {getSeverityBadge(alert.severity)}
                    <h4 className="font-bold text-xs text-white">
                      {alert.title}
                    </h4>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    {alert.timestamp}
                  </div>
                </div>

                <div className="text-xs text-slate-300 space-y-1.5 mt-2">
                  <div className="flex gap-2">
                    <span className="text-slate-500 text-[11px]">Affected:</span>
                    <span className="font-medium text-cyan-300">{alert.affectedTrain}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">{alert.section}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-slate-500 text-[11px]">Action:</span>
                    <span className="text-amber-300/90 font-medium">{alert.recommendedAction}</span>
                  </div>
                  <div className="flex gap-2 text-[11px]">
                    <span className="text-slate-500">AI Impact:</span>
                    <span className="text-slate-400 font-mono">{alert.confidenceImpact}</span>
                  </div>
                </div>
              </div>

              {onDismissAlert && (
                <div className="pt-2 border-t border-slate-900 flex justify-end">
                  <button
                    onClick={() => handleDismiss(alert.id)}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Acknowledge & Clear</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
