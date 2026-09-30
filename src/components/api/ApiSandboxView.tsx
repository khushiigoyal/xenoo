import React, { useState } from 'react';
import { Train, OperationalEvent } from '../../types/railway';
import { Code2, Send, Copy, Check, Play, Terminal, Database, Sparkles } from 'lucide-react';

interface ApiSandboxViewProps {
  trains: Train[];
  activeEvents: OperationalEvent[];
}

export const ApiSandboxView: React.FC<ApiSandboxViewProps> = ({ trains, activeEvents }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/api/trains/12806/eta');
  const [copied, setCopied] = useState(false);
  const [lastExecuted, setLastExecuted] = useState<string>('Just now');
  const [latencyMs, setLatencyMs] = useState<number>(38);

  const train12806 = trains.find(t => t.number === '12806') || trains[0];

  const getResponsePayload = () => {
    switch (selectedEndpoint) {
      case '/api/trains/live':
        return {
          status: 'success',
          timestamp: new Date().toISOString(),
          totalTracked: trains.length,
          fleet: trains.map(t => ({
            number: t.number,
            name: t.name,
            currentStation: t.currentStation,
            nextStation: t.nextStation,
            speedKmH: t.currentSpeedKmH,
            delayMin: t.currentDelayMinutes,
            predictedETA: t.predictedArrivalNext,
            status: t.status
          }))
        };
      case '/api/trains/12806/eta':
        return {
          status: 'success',
          timestamp: new Date().toISOString(),
          trainNumber: train12806.number,
          trainName: train12806.name,
          currentLocation: train12806.currentStation,
          nextStop: {
            station: train12806.nextStation,
            scheduledArrival: train12806.scheduledArrivalNext,
            aiPredictedArrival: train12806.predictedArrivalNext,
            delayMinutes: train12806.currentDelayMinutes,
            confidence: train12806.confidencePercentage
          },
          downstreamProgression: train12806.stops.map(s => ({
            station: s.stationName,
            code: s.stationCode,
            scheduled: s.scheduledArrival,
            predictedETA: s.predictedArrival,
            delay: s.delayMinutes,
            confidence: s.confidence,
            platform: s.platform
          })),
          explainableAttribution: train12806.featureAttribution
        };
      case '/api/stations/AGC/eta':
        return {
          status: 'success',
          stationCode: 'AGC',
          stationName: 'Agra Cantt',
          zone: 'NCR',
          inboundTrains: trains.filter(t => t.stops.some(s => s.stationCode === 'AGC')).map(t => {
            const stop = t.stops.find(s => s.stationCode === 'AGC')!;
            return {
              trainNumber: t.number,
              trainName: t.name,
              scheduledArrival: stop.scheduledArrival,
              dynamicETA: stop.predictedArrival,
              delayMinutes: stop.delayMinutes,
              platform: stop.platform
            };
          })
        };
      case '/api/events':
        return {
          status: 'success',
          count: activeEvents.length,
          events: activeEvents
        };
      case '/api/drone/telemetry':
        return {
          droneId: 'DR-01',
          corridor: 'NCR Agra-Mathura Mainline',
          railKm: 'KM 1284 / Post 14',
          coordinates: { lat: 27.2841, lng: 77.9412 },
          altitudeMeters: 42,
          speedKmH: 34,
          battery: '88%',
          status: 'LIVE_PATROL',
          anomalyDetected: activeEvents.some(e => e.type === 'DRONE')
        };
      default:
        return { status: 'unknown_endpoint' };
    }
  };

  const handleExecute = () => {
    setLatencyMs(Math.floor(25 + Math.random() * 25));
    setLastExecuted(new Date().toLocaleTimeString('en-IN', { hour12: false }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(getResponsePayload(), null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-xs font-semibold uppercase tracking-wider font-mono">
            CRIS / NTES Interoperability
          </span>
        </div>
        <h2 className="text-2xl font-display font-bold text-white tracking-tight">
          RAILETA Open Railway Data API Sandbox
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Simulated RESTful endpoints ready for integration with Indian Railways National Train Enquiry System (NTES) and passenger mobility applications.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Endpoint Selector (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
          <div className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>AVAILABLE REST ENDPOINTS</span>
          </div>

          {[
            { path: '/api/trains/12806/eta', method: 'GET', desc: 'Detailed train dynamic forecast & attribution' },
            { path: '/api/trains/live', method: 'GET', desc: 'All active coaching trains in corridor' },
            { path: '/api/stations/AGC/eta', method: 'GET', desc: 'Station arrival board with live ETAs' },
            { path: '/api/events', method: 'GET', desc: 'Active operational delay & caution events' },
            { path: '/api/drone/telemetry', method: 'GET', desc: 'Live aerial patrol drone telemetry & hazards' },
          ].map((ep) => (
            <button
              key={ep.path}
              onClick={() => setSelectedEndpoint(ep.path)}
              className={`w-full text-left p-3 rounded-lg border transition-all text-xs ${
                selectedEndpoint === ep.path
                  ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-sm'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 font-mono">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-900 text-emerald-300">
                  {ep.method}
                </span>
                <span className="font-semibold text-slate-200">{ep.path}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {ep.desc}
              </p>
            </button>
          ))}
        </div>

        {/* Request & Response Live Inspector (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
          {/* Action Bar */}
          <div className="p-4 border-b border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-900 text-emerald-300 font-bold text-[11px]">
                GET
              </span>
              <span className="text-white font-bold">{selectedEndpoint}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px]">Status: <strong className="text-emerald-400">200 OK</strong></span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 text-[11px]">Latency: <strong className="text-cyan-400">{latencyMs}ms</strong></span>

              <button
                onClick={handleExecute}
                className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold flex items-center gap-1.5 transition-colors ml-2"
              >
                <Play className="w-3 h-3 fill-slate-950" />
                <span>Send Request</span>
              </button>

              <button
                onClick={handleCopy}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Copy JSON Payload"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* JSON Viewer */}
          <div className="p-4 bg-slate-950/90 font-mono text-xs text-slate-300 overflow-auto max-h-[460px]">
            <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed">
              {JSON.stringify(getResponsePayload(), null, 2)}
            </pre>
          </div>

          {/* Footer with cURL snippet */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>curl -X GET "https://raileta.cris.gov.in{selectedEndpoint}" -H "Accept: application/json"</span>
            <span className="text-emerald-400">Response verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
