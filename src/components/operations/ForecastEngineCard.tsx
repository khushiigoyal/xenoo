import React, { useState } from 'react';
import { Train } from '../../types/railway';
import { 
  Sparkles, 
  Cpu, 
  Clock, 
  ShieldCheck, 
  Layers, 
  Volume2, 
  Sliders, 
  Gauge, 
  Activity 
} from 'lucide-react';
import { speakStationAnnouncement } from '../../utils/audioAlerts';

interface ForecastEngineCardProps {
  train: Train;
  lastRecalcTime: string;
}

export const ForecastEngineCard: React.FC<ForecastEngineCardProps> = ({
  train,
  lastRecalcTime
}) => {
  const attribution = train.featureAttribution;
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    setIsSpeaking(true);
    const delayNotice = train.currentDelayMinutes > 0
      ? `is running late by ${train.currentDelayMinutes} minutes. Revised expected arrival at ${train.nextStation} is ${train.predictedArrivalNext}.`
      : `is running on time. Expected arrival at ${train.nextStation} is ${train.predictedArrivalNext}.`;
    
    speakStationAnnouncement(`May I have your attention please. Train ${train.number}, ${train.name}, ${delayNotice}`);
    setTimeout(() => setIsSpeaking(false), 5000);
  };

  return (
    <div className="bg-[#0b101d] text-white border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
      {/* Top Banner */}
      <div className="p-4 border-b border-slate-800 bg-[#080d1a] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide">
                AI ETA FORECAST ENGINE
              </h2>
              <span className="text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded font-bold">
                PROTOTYPE FORECASTING ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Multi-source dynamic regression: Telemetry + Signal state + Section headway + Drone anomalies
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Station PA Synthesizer Button */}
          <button
            onClick={handleSpeak}
            className="px-3 py-1.5 rounded-lg bg-indigo-900/80 hover:bg-indigo-800 border border-indigo-700/80 text-indigo-200 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            title="Listen to official Station PA audio announcement"
          >
            <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce text-cyan-400' : ''}`} />
            <span>{isSpeaking ? 'Announcing...' : 'Broadcast Station PA'}</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-[#03060f] px-2.5 py-1.5 rounded border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>RECALC: <strong className="text-cyan-300">{lastRecalcTime}</strong></span>
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* Three Big Outputs Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* 1. Dynamic Predicted ETA */}
          <div className="bg-gradient-to-br from-blue-950/50 to-[#03060f] border border-blue-800/60 rounded-xl p-4 relative overflow-hidden shadow-inner">
            <div className="flex items-center justify-between text-xs text-cyan-400 font-mono font-bold mb-1">
              <span>PREDICTED ETA ({train.nextStation.split(' ')[0]})</span>
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-mono-tech font-extrabold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-300 tracking-tight">
                {train.predictedArrivalNext}
              </span>
              <span className="text-xs font-mono text-slate-400">
                (Sched: {train.scheduledArrivalNext})
              </span>
            </div>
            <div className="mt-2 text-[11px] text-cyan-300/90 flex items-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>Dynamically recalculated on live events</span>
            </div>
          </div>

          {/* 2. Model Confidence Score */}
          <div className="bg-gradient-to-br from-indigo-950/50 to-[#03060f] border border-indigo-800/60 rounded-xl p-4 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-indigo-300 font-mono font-bold mb-1">
              <span>PREDICTION CONFIDENCE</span>
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className={`font-mono-tech font-extrabold text-4xl tracking-tight ${
                train.confidencePercentage >= 90 ? 'text-emerald-400' :
                train.confidencePercentage >= 75 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {train.confidencePercentage}%
              </span>
              <span className="text-xs font-mono text-slate-400">
                {train.confidencePercentage >= 90 ? 'HIGH ASSURANCE' : 'MODERATE UNCERTAINTY'}
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  train.confidencePercentage >= 90 ? 'bg-emerald-400' :
                  train.confidencePercentage >= 75 ? 'bg-amber-400' : 'bg-rose-400'
                }`}
                style={{ width: `${train.confidencePercentage}%` }}
              />
            </div>
          </div>

          {/* 3. Expected Delay */}
          <div className="bg-gradient-to-br from-slate-900 to-[#03060f] border border-slate-800 rounded-xl p-4 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono font-bold mb-1">
              <span>EXPECTED DELAY (CUMULATIVE)</span>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className={`font-mono-tech font-extrabold text-4xl tracking-tight ${
                train.currentDelayMinutes <= 0 ? 'text-emerald-400' :
                train.currentDelayMinutes >= 15 ? 'text-rose-400' : 'text-amber-400'
              }`}>
                {train.currentDelayMinutes <= 0 ? '0' : `+${train.currentDelayMinutes}`}
              </span>
              <span className="text-sm font-sans text-slate-400 font-normal">minutes</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400 font-mono">
              Status: <span className={
                train.status === 'ON_TIME' ? 'text-emerald-400 font-bold' :
                train.status === 'SLIGHT_DELAY' ? 'text-amber-400 font-bold' : 'text-rose-400 font-bold'
              }>{train.status.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        {/* Feature Pipeline Inputs Grid */}
        <div className="border border-slate-800 rounded-xl p-4 bg-[#050814]">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>LIVE FEATURE EXTRACTION PIPELINE (INPUTS ➔ MODEL)</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Weighted Normalized Vector</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
            {/* Speed */}
            <div className="bg-[#0b101d] p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Train Speed</span>
              <span className="font-mono-tech font-bold text-base text-white">
                {train.currentSpeedKmH} km/h
              </span>
              <span className="text-[10px] text-slate-500 block">Cap: {train.maxPermissibleSpeedKmH} km/h</span>
            </div>

            {/* Signal */}
            <div className="bg-[#0b101d] p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Signal Aspect</span>
              <span className={`font-mono-tech font-bold text-base ${
                train.signalStatus === 'GREEN' ? 'text-emerald-400' :
                train.signalStatus === 'RED' ? 'text-rose-400' : 'text-amber-400'
              }`}>
                {train.signalStatus}
              </span>
              <span className="text-[10px] text-slate-500 block">Continuous Automatic</span>
            </div>

            {/* Prior Run Delay */}
            <div className="bg-[#0b101d] p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Prior Run Delay</span>
              <span className="font-mono-tech font-bold text-base text-slate-200">
                +{attribution.baseRunningDelay} min
              </span>
              <span className="text-[10px] text-slate-500 block">Historical variance 1.2m</span>
            </div>

            {/* Headway */}
            <div className="bg-[#0b101d] p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Section Density</span>
              <span className={`font-mono-tech font-bold text-base ${
                attribution.trackCongestion > 0 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {attribution.trackCongestion > 0 ? `+${attribution.trackCongestion}m Headway` : 'Clear Block'}
              </span>
              <span className="text-[10px] text-slate-500 block">4.2 km spacing</span>
            </div>

            {/* Drone / Caution */}
            <div className="bg-[#0b101d] p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Drone Anomaly Penalty</span>
              <span className={`font-mono-tech font-bold text-base ${
                attribution.droneCautionOrder > 0 ? 'text-rose-400' : 'text-slate-300'
              }`}>
                {attribution.droneCautionOrder > 0 ? `+${attribution.droneCautionOrder}m Caution` : '0 min'}
              </span>
              <span className="text-[10px] text-slate-500 block">DR-01 Live Aerial Patrol</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
