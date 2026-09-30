import React from 'react';
import { 
  Network, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  Video, 
  Radio, 
  Database, 
  CheckCircle2, 
  ArrowDown, 
  Server, 
  Globe, 
  Lock, 
  FileText,
  Sparkles
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 text-xs font-semibold uppercase tracking-wider font-mono">
            System Design & Engineering Architecture
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
          End-to-End Dynamic ETA Forecasting Architecture
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
          Designed for real-world deployment in the Indian Railways Center for Railway Information Systems (CRIS) ecosystem, bridging loco telemetry, electronic interlocking, and autonomous aerial sensors.
        </p>
      </div>

      {/* Visual Pipeline Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
        <h3 className="font-display font-bold text-lg text-white mb-6 flex items-center gap-2">
          <Network className="w-5 h-5 text-cyan-400" />
          <span>DATA FLOW & INFERENCE PIPELINE</span>
        </h3>

        {/* Vertical/Horizontal Flow Stepper */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Step 1: Ingestion */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 relative group hover:border-cyan-500/50 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400 font-bold flex items-center justify-center text-xs mb-3">
              01
            </div>
            <h4 className="font-bold text-white text-sm">Data Ingestion Layer</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Real-time RTIS (Real-Time Train Information System) GPS feed, signaling interlocking aspects, section density & supplementary drone hazard telemetry.
            </p>
            <div className="mt-3 text-[10px] font-mono text-cyan-400 bg-slate-900 p-1.5 rounded">
              Input: Kafka / MQTT / REST
            </div>
          </div>

          {/* Step 2: Feature Engineering */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 relative group hover:border-indigo-500/50 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-400 font-bold flex items-center justify-center text-xs mb-3">
              02
            </div>
            <h4 className="font-bold text-white text-sm">Feature Engineering</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Temporal window aggregation: rolling headway velocity, dwell variance per platform, gradient curve resistance, and caution order speed penalties.
            </p>
            <div className="mt-3 text-[10px] font-mono text-indigo-400 bg-slate-900 p-1.5 rounded">
              Pipeline: NumPy / Pandas Feature Vector
            </div>
          </div>

          {/* Step 3: AI Forecasting Engine */}
          <div className="bg-slate-950 p-4 rounded-xl border border-indigo-700/60 relative group hover:border-purple-500/50 transition-colors shadow-lg shadow-purple-950/20">
            <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-800 text-purple-400 font-bold flex items-center justify-center text-xs mb-3">
              03
            </div>
            <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
              <span>ETA ML Engine</span>
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Gradient Boosted Regressor (XGBoost / LightGBM) outputs point prediction, epistemic confidence intervals & SHAP explainability weights.
            </p>
            <div className="mt-3 text-[10px] font-mono text-purple-400 bg-slate-900 p-1.5 rounded">
              Latency: &lt; 45ms per train
            </div>
          </div>

          {/* Step 4: Dissemination */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 relative group hover:border-emerald-500/50 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400 font-bold flex items-center justify-center text-xs mb-3">
              04
            </div>
            <h4 className="font-bold text-white text-sm">Dual Dissemination</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              WebSocket & SSE broadcast to Section Controllers (Operations Command) and sanitized timetable feeds to Passenger mobile apps & station displays.
            </p>
            <div className="mt-3 text-[10px] font-mono text-emerald-400 bg-slate-900 p-1.5 rounded">
              Output: REST API / SSE / SMS Hub
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-cyan-400" />
            <h4 className="font-display font-bold text-base text-white">Frontend & UI/UX</h4>
          </div>
          <ul className="space-y-2 text-xs text-slate-300 font-mono">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              React 19 + TypeScript (Strict)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Tailwind CSS v4 (Command Center theme)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Lucide Railway Icons & SVG Canvas
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Motion Smooth State Transitions
            </li>
          </ul>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Server className="w-4 h-4 text-indigo-400" />
            <h4 className="font-display font-bold text-base text-white">Backend & Microservices</h4>
          </div>
          <ul className="space-y-2 text-xs text-slate-300 font-mono">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              Node.js + Express REST API Gateway
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              Server-Sent Events (SSE) for live push
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              Python ML inference daemon (FastAPI/Scikit)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              MongoDB Time-Series / Redis Cache
            </li>
          </ul>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Video className="w-4 h-4 text-purple-400" />
            <h4 className="font-display font-bold text-base text-white">Sensors & Drone Layer</h4>
          </div>
          <ul className="space-y-2 text-xs text-slate-300 font-mono">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              ISRO NavIC / GPS Dual-Band Telemetry
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              Autonomous Drone Corridor Camera (DR-01)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              Edge CV model for track obstacle detection
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              Caution Order Automatic Ingestion API
            </li>
          </ul>
        </div>
      </div>

      {/* Safety & Reliability Governance Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="font-display font-bold text-lg text-white">
            SAFETY, RELIABILITY & FAILSAFE PROTOCOLS
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Decision Support, Not Autonomous Interlocking</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              RAILETA AI provides advisory forecasting intelligence. It does not alter railway block signaling, switch points, or locomotive brake controls.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>Confidence Threshold Fallback (&lt; 60%)</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              If epistemic confidence drops below 60% (due to telemetry gaps or sensor outage), the system automatically defaults to latest verified manual station departure records.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-purple-400" />
              <span>Cryptographic Immutable Audit Trail</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Every single ETA recalculation is logged with timestamp, input telemetry vector, model version, and exact explainability delta for accident and dispute inquiries.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-amber-400" />
              <span>Human Section Controller Validation</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Rail division traffic controllers have override capability to manually modify delay factors or suspend public notifications during emergency block operations.
            </p>
          </div>
        </div>
      </div>

      {/* Why RAILETA AI? 10-Point Differentiator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
        <h3 className="font-display font-bold text-lg text-white mb-4">
          KEY DIFFERENTIATORS: WHY RAILETA AI WINS FOR INDIAN RAILWAYS
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {[
            { num: '01', title: 'Dynamic vs Static', desc: 'Recalculates continuously instead of showing frozen timetable values.' },
            { num: '02', title: 'Explainable AI', desc: 'Provides transparent breakdown (signal, weather, congestion) of delay causes.' },
            { num: '03', title: 'Confidence-Aware', desc: 'Attaches epistemic reliability score to prevent passenger misinformation.' },
            { num: '04', title: 'Multi-Source Fusion', desc: 'Combines GPS, interlocking signals, station turnaround & drone telemetry.' },
            { num: '05', title: 'Drone Integration', desc: 'Aerial patrol feeds instant caution orders into the mathematical ETA model.' },
            { num: '06', title: 'Downstream Ripple', desc: 'Calculates cascading delay and buffer recovery across all upcoming junctions.' },
            { num: '07', title: 'Dual-Persona UI', desc: 'Technical Command Center for controllers + crystal clear portal for passengers.' },
            { num: '08', title: 'Sub-50ms Latency', desc: 'High-throughput event engine capable of managing 13,000 daily trains.' },
            { num: '09', title: 'Open API Architecture', desc: 'Modular microservice designed to plug straight into CRIS NTES servers.' },
            { num: '10', title: 'Failsafe Safety First', desc: 'Strict fallback protocol ensures 100% adherence to railway safety standards.' }
          ].map((diff) => (
            <div key={diff.num} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="font-mono text-cyan-400 font-bold text-sm">{diff.num}</span>
              <h5 className="font-bold text-white mt-1 mb-0.5">{diff.title}</h5>
              <p className="text-[11px] text-slate-400 leading-relaxed">{diff.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
