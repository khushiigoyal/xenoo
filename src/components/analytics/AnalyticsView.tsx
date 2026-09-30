import React, { useState } from 'react';
import { HistoricalAnalytics, Station } from '../../types/railway';
import { HISTORICAL_ANALYTICS, STATIONS } from '../../data/mockRailwayData';
import { 
  BarChart3, 
  TrendingUp, 
  Gauge, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Zap, 
  ShieldCheck, 
  AlertTriangle,
  Info,
  Layers
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const data = HISTORICAL_ANALYTICS;
  const [selectedStationCode, setSelectedStationCode] = useState<string>('AGC');

  const selectedStationData = data.stationDelayIntelligence.find(
    s => s.stationCode === selectedStationCode
  ) || data.stationDelayIntelligence[0];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-2xl text-white">
              AI MODEL EVALUATION & CORRIDOR ANALYTICS
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-800 font-semibold">
              SIMULATED PROTOTYPE METRICS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Statistical validation comparing dynamic AI regression forecasts against historical ground-truth actual arrival times across 18,450 train movements.
          </p>
        </div>

        <div className="text-right">
          <div className="text-[10px] font-mono text-slate-500 uppercase">Total Forecast Runs</div>
          <div className="font-mono-tech font-bold text-2xl text-cyan-300">
            {data.totalPredictionsToday.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Top 5 Evaluation KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* MAE */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Mean Absolute Error (MAE)</div>
          <div className="mt-1 font-mono-tech font-bold text-3xl text-white">
            {data.maeMinutes} <span className="text-sm text-slate-400 font-sans">min</span>
          </div>
          <div className="mt-2 text-[10px] text-emerald-400 font-mono">
            vs 14.6 min static timetable
          </div>
        </div>

        {/* RMSE */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Root Mean Sq Error (RMSE)</div>
          <div className="mt-1 font-mono-tech font-bold text-3xl text-white">
            {data.rmseMinutes} <span className="text-sm text-slate-400 font-sans">min</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 font-mono">
            Penalizes tail outliers
          </div>
        </div>

        {/* Median Error */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Median Absolute Error</div>
          <div className="mt-1 font-mono-tech font-bold text-3xl text-cyan-300">
            {data.medianAbsoluteError} <span className="text-sm text-slate-400 font-sans">min</span>
          </div>
          <div className="mt-2 text-[10px] text-cyan-400 font-mono">
            50% of runs within 2.7m
          </div>
        </div>

        {/* Within +-5 min */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Within ±5 Minutes</div>
          <div className="mt-1 font-mono-tech font-bold text-3xl text-emerald-400">
            {data.withinFiveMinutesPercent}%
          </div>
          <div className="mt-2 text-[10px] text-emerald-400 font-mono">
            High confidence threshold
          </div>
        </div>

        {/* Latency */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Recalc Engine Latency</div>
          <div className="mt-1 font-mono-tech font-bold text-3xl text-purple-300">
            {data.avgRecalculationLatencyMs} <span className="text-sm text-slate-400 font-sans">ms</span>
          </div>
          <div className="mt-2 text-[10px] text-purple-400 font-mono">
            Real-time SSE event pipeline
          </div>
        </div>
      </div>

      {/* Prediction Error Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                PREDICTION ERROR DISTRIBUTION (FREQUENCY HISTOGRAM)
              </h3>
              <p className="text-xs text-slate-400">
                Distribution of absolute delta between AI forecast and actual arrival time
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-500">n=18,450</span>
          </div>

          {/* Histogram Bars */}
          <div className="space-y-4 pt-2">
            {data.historicalErrorDistribution.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-slate-300 font-semibold">{item.bucket}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-400 text-[11px]">{item.count.toLocaleString()} trains</span>
                    <span className="text-cyan-400 font-bold">{item.percentage}%</span>
                  </div>
                </div>

                <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      idx === 0 ? 'bg-gradient-to-r from-emerald-500 to-cyan-500' :
                      idx === 1 ? 'bg-gradient-to-r from-cyan-500 to-indigo-500' :
                      idx === 2 ? 'bg-gradient-to-r from-indigo-500 to-purple-500' :
                      idx === 3 ? 'bg-gradient-to-r from-purple-500 to-amber-500' : 'bg-gradient-to-r from-amber-500 to-rose-500'
                    }`}
                    style={{ width: `${item.percentage * 2.3}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Accuracy within ±10 minutes: <strong className="text-white font-mono">{data.withinTenMinutesPercent}%</strong></span>
            <span className="text-emerald-400 font-mono">✓ High precision operational reliability</span>
          </div>
        </div>

        {/* Station Delay Intelligence (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  STATION DELAY INTELLIGENCE
                </h3>
                <p className="text-xs text-slate-400">
                  Corridor bottlenecks where delays historically accumulate
                </p>
              </div>
            </div>

            {/* Clickable station list */}
            <div className="space-y-2 mt-4">
              {data.stationDelayIntelligence.map((stn) => (
                <button
                  key={stn.stationCode}
                  onClick={() => setSelectedStationCode(stn.stationCode)}
                  className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between ${
                    selectedStationCode === stn.stationCode
                      ? 'bg-amber-950/40 border-amber-600 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-bold flex items-center gap-2">
                      <span>{stn.stationName} ({stn.stationCode})</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono ${
                        stn.riskLevel === 'HIGH' ? 'bg-rose-950 text-rose-300' :
                        stn.riskLevel === 'MEDIUM' ? 'bg-amber-950 text-amber-300' : 'bg-emerald-950 text-emerald-300'
                      }`}>
                        {stn.riskLevel} RISK
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Cause: {stn.delayType}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono-tech font-bold text-amber-400 text-sm">
                      +{stn.avgDelayImpactMin} min
                    </span>
                    <span className="text-[10px] text-slate-500 block">avg impact</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Station Deep-dive Box */}
          <div className="mt-4 p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <div className="font-bold text-white mb-1">
              Mitigation Feature in AI Model for {selectedStationData.stationName}:
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Model incorporates a non-linear platform dwell buffer (σ = ±{selectedStationData.dwellVarianceSec}s) whenever approaching section block occupancy is above 75%.
            </p>
          </div>
        </div>
      </div>

      {/* Corridor Comparative Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <h3 className="font-display font-bold text-base text-white mb-3">
          Cross-Corridor Model Accuracy Comparison
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 font-mono text-[11px] text-slate-400 uppercase border-b border-slate-800">
              <tr>
                <th className="p-3">Corridor</th>
                <th className="p-3">Sample Movements</th>
                <th className="p-3">MAE (Min)</th>
                <th className="p-3">±5 Min Punctuality Accuracy</th>
                <th className="p-3">Reliability Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-sans">
              {data.modelPerformanceByCorridor.map((c, i) => (
                <tr key={i} className="hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-white">{c.corridor}</td>
                  <td className="p-3 font-mono text-slate-400">{c.sampleSize.toLocaleString()}</td>
                  <td className="p-3 font-mono text-cyan-300 font-bold">{c.mae} min</td>
                  <td className="p-3 font-mono text-emerald-400 font-bold">{c.accuracy}%</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                      TIER 1 PRODUCTION READY
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
