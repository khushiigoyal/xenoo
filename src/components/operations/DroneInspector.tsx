import React, { useState, useEffect } from 'react';
import { DroneFeedData } from '../../types/railway';
import { 
  Video, 
  Crosshair, 
  Compass, 
  Battery, 
  Radio, 
  Send, 
  Pause, 
  Play, 
  AlertTriangle, 
  CheckCircle2, 
  Eye, 
  Layers, 
  Sparkles,
  Sliders,
  Flame,
  ShieldAlert,
  RotateCw,
  Navigation,
  Volume2
} from 'lucide-react';
import { playRadarBeep } from '../../utils/audioAlerts';

interface DroneInspectorProps {
  droneData: DroneFeedData;
  onTriggerDroneEvent: (anomalyTitle: string, impactMin: number) => void;
  onClearDroneAnomaly: () => void;
  hasActiveDroneAnomaly: boolean;
}

export const DroneInspector: React.FC<DroneInspectorProps> = ({
  droneData,
  onTriggerDroneEvent,
  onClearDroneAnomaly,
  hasActiveDroneAnomaly
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [cameraMode, setCameraMode] = useState<'OPTICAL' | 'THERMAL_FLIR' | 'EDGE_AI'>('EDGE_AI');
  const [altitude, setAltitude] = useState(42);
  const [flightSpeed, setFlightSpeed] = useState(34);
  const [selectedCorridorSector, setSelectedCorridorSector] = useState('Chambal River Bridge (KM 142.4)');
  const [hudScanLine, setHudScanLine] = useState(25);
  const [radarDegree, setRadarDegree] = useState(0);

  // Simulated scanline and radar sweep
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setHudScanLine(prev => (prev >= 85 ? 12 : prev + 2.5));
      setRadarDegree(prev => (prev + 6) % 360);
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const anomalyPresets = [
    {
      title: 'Track Anomaly: Rail Micro-Crack & Loose Catenary Mast',
      type: 'OBSTRUCTION' as const,
      impactMin: 10,
      description: 'Ultrasonic eddy-current sensor detected 4.2mm rail head surface fracture at KM 142.4. Caution speed 30 km/h.',
      confidence: 96,
      sector: 'Gwalior South (KM 142.4)'
    },
    {
      title: 'Track Obstruction: Heavy Ballast Debris on UP Line',
      type: 'OBSTRUCTION' as const,
      impactMin: 12,
      description: 'Foreign stones displaced onto running rail head. Pilot caution order mandated before train approach.',
      confidence: 98,
      sector: 'Chambal River Bridge'
    },
    {
      title: 'Thermal Hot-Spot: Overhead Catenary Cable Overheating',
      type: 'TRACK_WORK' as const,
      impactMin: 8,
      description: 'FLIR Thermal sensor flagged 84°C localized contact wire temperature rise. Electrical block advised.',
      confidence: 91,
      sector: 'Morena Approach Curve'
    }
  ];

  const [selectedAnomalyIdx, setSelectedAnomalyIdx] = useState(0);
  const currentAnomaly = anomalyPresets[selectedAnomalyIdx];

  const handleTrigger = () => {
    playRadarBeep();
    onTriggerDroneEvent(currentAnomaly.title, currentAnomaly.impactMin);
  };

  return (
    <div className="bg-[#0b101d] text-white border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-800 bg-[#080d1a] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800 text-purple-400 flex items-center justify-center shadow-lg shadow-purple-950/60">
            <Video className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                AUTONOMOUS DRONE PATROL STATION
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800">
                DRONE {droneData.id.toUpperCase()} (QUAD-ROTOR V3)
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Autonomous aerial rail patrol feeding real-world corridor anomalies into the AI ETA engine
            </p>
          </div>
        </div>

        {/* Telemetry Pills */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800/60">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>4K FLIR LIVE</span>
          </div>
          <div className="flex items-center gap-1 text-slate-300 bg-slate-900 px-2 py-1 rounded border border-slate-800">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>GPS 3D FIX (12 SATS)</span>
          </div>
          <div className="flex items-center gap-1 text-slate-300 bg-slate-900 px-2 py-1 rounded border border-slate-800">
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
            <span>{droneData.batteryPercent}%</span>
          </div>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Simulated Drone Camera HUD View (7 Cols) */}
        <div className="lg:col-span-7 bg-[#03060f] rounded-xl border border-slate-800 overflow-hidden relative min-h-[440px] flex flex-col justify-between p-4 select-none">
          {/* Background Aerial Camera Canvas */}
          <div className={`absolute inset-0 pointer-events-none transition-all duration-300 ${
            cameraMode === 'THERMAL_FLIR' 
              ? 'bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950 flir-scanlines' 
              : 'bg-[#030712]'
          }`}>
            {/* Aerial perspective railway SVG */}
            <svg className="absolute inset-0 w-full h-full opacity-40" preserveAspectRatio="none" viewBox="0 0 400 300">
              {/* Ballast bed */}
              <polygon points="175,0 225,0 290,300 110,300" fill={cameraMode === 'THERMAL_FLIR' ? '#311042' : '#1e293b'} />
              {/* Sleepers */}
              {[...Array(14)].map((_, i) => {
                const y = 20 + i * 20;
                const width = 50 + i * 11;
                const x = 200 - width / 2;
                return (
                  <line 
                    key={i} 
                    x1={x} 
                    y1={y} 
                    x2={x + width} 
                    y2={y} 
                    stroke={cameraMode === 'THERMAL_FLIR' ? '#ea580c' : '#334155'} 
                    strokeWidth="3" 
                  />
                );
              })}
              {/* Hot steel rails */}
              <line x1="185" y1="0" x2="140" y2="300" stroke={cameraMode === 'THERMAL_FLIR' ? '#facc15' : '#94a3b8'} strokeWidth="3" />
              <line x1="215" y1="0" x2="260" y2="300" stroke={cameraMode === 'THERMAL_FLIR' ? '#facc15' : '#94a3b8'} strokeWidth="3" />
              {/* Overhead wire */}
              <line x1="200" y1="0" x2="200" y2="300" stroke="#38bdf8" strokeWidth="1" strokeDasharray="6,6" opacity="0.6" />
            </svg>

            {/* Radar scanline */}
            {isPlaying && (
              <div 
                className="absolute left-0 right-0 h-1 bg-cyan-400/50 shadow-sm shadow-cyan-400 pointer-events-none transition-all duration-100"
                style={{ top: `${hudScanLine}%` }}
              />
            )}
          </div>

          {/* HUD Top Overlay */}
          <div className="relative z-10 flex justify-between items-start text-[11px] font-mono text-cyan-400 bg-slate-950/80 p-2.5 rounded-lg border border-cyan-900/50 backdrop-blur-sm">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-white">
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>{droneData.callsign}</span>
                <span className="text-[9px] px-1 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded font-bold">
                  {cameraMode}
                </span>
              </div>
              <div className="text-slate-400 text-[10px] mt-0.5">
                SECTOR: {selectedCorridorSector}
              </div>
            </div>

            <div className="text-right space-y-0.5">
              <div>ALT: <span className="text-white font-bold">{altitude}m AGL</span></div>
              <div>SPD: <span className="text-white font-bold">{flightSpeed} km/h</span></div>
              <div className="text-[10px] text-slate-400">
                LAT: 27.2841 N | LNG: 77.9412 E
              </div>
            </div>
          </div>

          {/* Center Target Crosshair & Active Anomaly Bounding Box */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto">
            {hasActiveDroneAnomaly ? (
              <div className="border-2 border-dashed border-rose-500 bg-rose-950/60 p-4 rounded-xl flex flex-col items-center animate-pulse shadow-2xl shadow-rose-950 max-w-sm text-center">
                <div className="flex items-center gap-1.5 text-rose-400 font-mono font-bold text-xs">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                  <span>AI EDGE DETECTED: {currentAnomaly.title}</span>
                </div>
                <div className="text-[11px] font-mono text-rose-200 mt-1">
                  Confidence: {currentAnomaly.confidence}% • Caution Order +{currentAnomaly.impactMin} min Active
                </div>
                <div className="mt-2 text-[10px] text-slate-300 font-mono">
                  Transmitted to Central Dispatch: Speed restricted to 30 km/h
                </div>
              </div>
            ) : (
              <div className="relative flex flex-col items-center justify-center">
                <Crosshair className="w-20 h-20 text-cyan-500/70" />
                <div className="text-[10px] font-mono text-cyan-400 tracking-wider mt-1 bg-slate-950/80 px-2 py-0.5 rounded border border-cyan-900/50">
                  AI SCANNING CORRIDOR INFRASTRUCTURE
                </div>
              </div>
            )}
          </div>

          {/* HUD Bottom Controls Bar */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono bg-slate-950/90 p-2.5 rounded-lg border border-slate-800">
            {/* Camera View Mode Toggles */}
            <div className="flex items-center gap-1">
              <span className="text-slate-400 mr-1 text-[10px]">LENS:</span>
              <button
                onClick={() => setCameraMode('OPTICAL')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  cameraMode === 'OPTICAL' ? 'bg-[#3b49df] text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Optical 4K
              </button>
              <button
                onClick={() => setCameraMode('THERMAL_FLIR')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  cameraMode === 'THERMAL_FLIR' ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Thermal FLIR
              </button>
              <button
                onClick={() => setCameraMode('EDGE_AI')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  cameraMode === 'EDGE_AI' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Edge AI CV
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 text-[10px]"
              >
                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{isPlaying ? 'Pause Feed' : 'Resume Feed'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Drone Command & Flight Controls (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            {/* Interactive Flight Telemetry Controls */}
            <div className="bg-[#080d1a] p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>DRONE FLIGHT PARAMETERS</span>
                </span>
                <span className="text-[10px] text-emerald-400">AUTONOMOUS WAYPOINT</span>
              </div>

              {/* Altitude Slider */}
              <div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>Flight Altitude (AGL)</span>
                  <span className="text-white font-bold">{altitude} meters</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="120"
                  value={altitude}
                  onChange={(e) => setAltitude(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#3b49df]"
                />
              </div>

              {/* Speed Slider */}
              <div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>Cruising Velocity</span>
                  <span className="text-white font-bold">{flightSpeed} km/h</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={flightSpeed}
                  onChange={(e) => setFlightSpeed(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#3b49df]"
                />
              </div>

              {/* Patrol Waypoint Selector */}
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                  Fly Drone to Sector
                </span>
                <select
                  value={selectedCorridorSector}
                  onChange={(e) => setSelectedCorridorSector(e.target.value)}
                  className="w-full bg-[#03060f] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                >
                  <option value="Chambal River Bridge (KM 142.4)">Chambal River Bridge (KM 142.4)</option>
                  <option value="Gwalior South Approach Yard">Gwalior South Approach Yard</option>
                  <option value="Morena Mainline Curve B04">Morena Mainline Curve B04</option>
                  <option value="Agra Cantt Traction Section">Agra Cantt Traction Section</option>
                </select>
              </div>
            </div>

            {/* Simulated Anomaly Trigger Options */}
            <div className="bg-[#080d1a] p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-300 mb-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>CHOOSE ANOMALY TO INJECT INTO RAILWAY MODEL</span>
              </div>

              <div className="space-y-2">
                {anomalyPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedAnomalyIdx(idx)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all ${
                      selectedAnomalyIdx === idx
                        ? 'bg-purple-950/70 border-purple-500 text-white shadow-md'
                        : 'bg-[#03060f] border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>{preset.title.split(':')[0]}</span>
                      <span className="font-mono text-purple-400 font-bold">+{preset.impactMin}m</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                      {preset.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div>
              {hasActiveDroneAnomaly ? (
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-200 text-xs">
                    <div className="font-bold flex items-center gap-1.5 mb-1">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>Caution Order Active across Sector</span>
                    </div>
                    <p className="text-[11px] text-rose-300">
                      ETA engine has added +{currentAnomaly.impactMin} min delay to downstream arrivals.
                    </p>
                  </div>

                  <button
                    onClick={onClearDroneAnomaly}
                    className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>CLEAR TRACK ANOMALY / RESTORE NORMAL SPEED</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleTrigger}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-[#3b49df] hover:from-purple-500 hover:to-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-[1.01]"
                >
                  <Send className="w-4 h-4" />
                  <span>TRANSMIT DRONE ANOMALY ➔ RECALCULATE DOWNSTREAM ETAS</span>
                </button>
              )}
            </div>
          </div>

          {/* Architecture Note for Jury */}
          <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-[11px] text-indigo-200/90 leading-relaxed font-sans">
            <strong>SIH26028 Innovation Highlight:</strong> The drone acts as an autonomous aerial event sensor. When an obstruction or micro-crack is flagged, it generates a digital Caution Order that automatically recalculates train arrival times downstream.
          </div>
        </div>
      </div>
    </div>
  );
};
