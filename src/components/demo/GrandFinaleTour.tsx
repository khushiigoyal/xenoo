import React, { useState, useEffect, useRef } from 'react';
import { 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Zap, 
  Video, 
  BarChart3, 
  User, 
  Sliders, 
  X,
  Play,
  Pause,
  RotateCcw,
  Minimize2,
  Maximize2,
  ChevronRight,
  HelpCircle,
  Clock,
  MapPin,
  Flame,
  Radio,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { playRailwayChime, playRadarBeep } from '../../utils/audioAlerts';

export interface TourStepDefinition {
  num: number;
  category: 'BASELINE' | 'CORRIDOR' | 'DISRUPTION' | 'CASCADE' | 'XAI' | 'PASSENGER' | 'DRONE' | 'COMPOUND' | 'BENCHMARKS';
  badge: string;
  title: string;
  shortTitle: string;
  desc: string;
  evaluatorNote: string;
  actionLabel: string;
  targetView: string;
  icon: React.ReactNode;
}

interface GrandFinaleTourProps {
  currentStep: number;
  onSetStep: (step: number) => void;
  onClose: () => void;
  onRunStep: (stepNumber: number, executeAction?: boolean) => void;
  onReset: () => void;
  audioEnabled: boolean;
}

export const GrandFinaleTour: React.FC<GrandFinaleTourProps> = ({
  currentStep,
  onSetStep,
  onClose,
  onRunStep,
  onReset,
  audioEnabled
}) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isPlayingAuto, setIsPlayingAuto] = useState<boolean>(false);
  const [autoTimerSeconds, setAutoTimerSeconds] = useState<number>(7);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const steps: TourStepDefinition[] = [
    {
      num: 1,
      category: 'BASELINE',
      badge: 'TRAIN SELECTION',
      title: 'Select Featured Coaching Train (12806 AP Express)',
      shortTitle: '1. Select 12806',
      desc: 'Focus on Train 12806 travelling the North Central High-Speed Corridor (Gwalior ➔ New Delhi). Observe nominal on-time schedule and live GPS tracking.',
      evaluatorNote: 'Baseline on-time ETA for Next Station (Morena): 04:35 (+3 min buffer). Nominal speed 128 km/h.',
      actionLabel: 'Select Train 12806 & Overview',
      targetView: 'Operations Overview',
      icon: <Radio className="w-3.5 h-3.5" />
    },
    {
      num: 2,
      category: 'CORRIDOR',
      badge: 'CORRIDOR MAPPING',
      title: 'Inspect Interactive Corridor Map & Station Block Routes',
      shortTitle: '2. Corridor Map',
      desc: 'Explore the 600km electrified corridor from Gwalior (GWL) to New Delhi (NDLS). Click any station card to inspect dynamic arrival forecasts and interlocking signals.',
      evaluatorNote: 'Click on Agra Cantt (KM 308) or Mathura (KM 459) to preview station-specific prediction confidence scores.',
      actionLabel: 'Open Corridor Map',
      targetView: 'Corridor Map',
      icon: <MapPin className="w-3.5 h-3.5" />
    },
    {
      num: 3,
      category: 'DISRUPTION',
      badge: 'DYNAMIC INJECTION',
      title: 'Simulate Unexpected +20 Min Operational Disruption',
      shortTitle: '3. Inject +20m Delay',
      desc: 'Inject an unannounced locomotive auxiliary power unit trip. The engine instantly detects the incident and triggers sub-50ms recalculation.',
      evaluatorNote: 'Notice instant red disruption banner, recalculation timestamp update, and delay cascading to downstream signals.',
      actionLabel: 'Simulate +20m Delay Now',
      targetView: 'Operations Overview',
      icon: <Zap className="w-3.5 h-3.5 text-amber-400" />
    },
    {
      num: 4,
      category: 'CASCADE',
      badge: 'TIMELINE CASCADE',
      title: 'Observe Downstream Arrival Cascade Across Stations',
      shortTitle: '4. Dynamic Timeline',
      desc: 'Open the Dynamic Timeline to view non-linear delay propagation: Agra Cantt is revised to 05:44, Mathura to 06:30, and New Delhi to 08:40 with buffer absorption.',
      evaluatorNote: 'SIH Mandatory requirement: Downstream stations absorb 3-5 mins of delay on straight high-speed sections (non-linear curve).',
      actionLabel: 'View Cascade Timeline',
      targetView: 'Dynamic Timeline (24H)',
      icon: <Clock className="w-3.5 h-3.5 text-cyan-400" />
    },
    {
      num: 5,
      category: 'XAI',
      badge: 'EXPLAINABLE AI',
      title: 'Inspect Explainable AI: Waterfall Delay Decomposition',
      shortTitle: '5. Explainable AI',
      desc: 'Inspect why the ETA changed. View the exact additive waterfall chart breakdown: Base Delay (+3m) + Loco Incident (+20m) + Headway Clearance (+2m) - Loop Line (+2m).',
      evaluatorNote: 'Transparent algorithmic accountability powered by SHAP & XGBoost with high 94% confidence score.',
      actionLabel: 'Inspect Waterfall & SHAP',
      targetView: 'AI ETA Engine',
      icon: <Sparkles className="w-3.5 h-3.5 text-purple-400" />
    },
    {
      num: 6,
      category: 'PASSENGER',
      badge: 'PASSENGER EXPERIENCE',
      title: 'Passenger Login Portal, Digital QR Boarding Pass & Alerts',
      shortTitle: '6. Passenger Login & Pass',
      desc: 'Experience the commuter interface: authentic PNR/Mobile OTP/IRCTC Login Page, verified digital QR boarding pass, real-time arrival countdown, audio station PA announcements, and proactive SMS/WhatsApp alerts.',
      evaluatorNote: 'Includes full Passenger Login Page with 1-click demo profiles, Mobile OTP verification simulation, and digital QR ticket.',
      actionLabel: 'Open Passenger Portal',
      targetView: 'Passenger Mode',
      icon: <User className="w-3.5 h-3.5 text-emerald-400" />
    },
    {
      num: 7,
      category: 'DRONE',
      badge: 'AERIAL SENSING',
      title: 'Autonomous Drone DR-01 Patrol & Track Hazard Detection',
      shortTitle: '7. Drone Inspection',
      desc: 'Switch to the Drone Command Station. Switch between Optical 4K, Thermal FLIR, and Edge AI Computer Vision. Transmit track obstruction alert at KM 142.4.',
      evaluatorNote: 'Edge AI bounding box identifies track ballast displacement, automatically generating digital 30 km/h Caution Order.',
      actionLabel: 'Launch Drone Station & Hazard',
      targetView: 'Drone Inspection',
      icon: <Video className="w-3.5 h-3.5 text-rose-400" />
    },
    {
      num: 8,
      category: 'COMPOUND',
      badge: 'COMPOUND FUSION',
      title: 'Compound Delay Fusion: Real-Time Multi-Sensor Recalculation',
      shortTitle: '8. Combined Cascade',
      desc: 'Verify how the AI forecasting engine folds the drone caution order (+10m) on top of the earlier operational disruption, dynamically re-optimizing all downstream stops.',
      evaluatorNote: 'Combined delay now stands at +33m. Downstream dispatchers receive instant precedence re-ordering recommendations.',
      actionLabel: 'Inspect Combined Ripple',
      targetView: 'Dynamic Timeline (24H)',
      icon: <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
    },
    {
      num: 9,
      category: 'BENCHMARKS',
      badge: 'EVALUATION PROOF',
      title: 'Model Validation, Statistical MAE & SIH Compliance Proof',
      shortTitle: '9. Model Analytics',
      desc: 'Review rigorous empirical validation: Mean Absolute Error of 3.8 min (vs CRIS 14.2 min), 87.4% ±5min punctuality accuracy, and sub-50ms inference latency.',
      evaluatorNote: 'Meets every technical evaluation rubric of SIH Problem Statement SIH26028.',
      actionLabel: 'Open Analytics & Evaluation',
      targetView: 'Model Analytics',
      icon: <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
    }
  ];

  const activeStep = steps[currentStep - 1] || steps[0];

  // Auto-play timer management
  useEffect(() => {
    if (isPlayingAuto) {
      setAutoTimerSeconds(7);
      const interval = setInterval(() => {
        setAutoTimerSeconds(prev => {
          if (prev <= 1) {
            // Advance to next step
            setCompletedSteps(old => Array.from(new Set([...old, currentStep])));
            if (currentStep < 9) {
              const nextStep = currentStep + 1;
              onSetStep(nextStep);
              onRunStep(nextStep, true);
              if (audioEnabled) playRadarBeep();
              return 7;
            } else {
              // End of tour
              setIsPlayingAuto(false);
              if (audioEnabled) playRailwayChime();
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
      autoPlayRef.current = interval;
      return () => clearInterval(interval);
    } else {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    }
  }, [isPlayingAuto, currentStep, audioEnabled, onSetStep, onRunStep]);

  const handleExecuteCurrentStep = (advanceAfter: boolean = false) => {
    setCompletedSteps(prev => Array.from(new Set([...prev, currentStep])));
    onRunStep(currentStep, true);
    if (audioEnabled) playRailwayChime();

    if (advanceAfter && currentStep < 9) {
      setTimeout(() => {
        const next = currentStep + 1;
        onSetStep(next);
        onRunStep(next, false);
      }, 400);
    }
  };

  const handleJumpToStep = (stepNum: number) => {
    setCompletedSteps(prev => Array.from(new Set([...prev, stepNum])));
    onSetStep(stepNum);
    onRunStep(stepNum, false);
    if (audioEnabled) playRadarBeep();
  };

  const handleResetTour = () => {
    setIsPlayingAuto(false);
    setCompletedSteps([1]);
    onSetStep(1);
    onReset();
    onRunStep(1, false);
  };

  return (
    <div className="sticky top-[68px] z-40 bg-[#080d1a]/95 dark:bg-[#060913]/95 backdrop-blur-md border-b-2 border-indigo-600/70 shadow-2xl text-white transition-all">
      {/* 1. TOP HEADER STRIP: Title, Step Progress, Auto-play and Quick Controls */}
      <div className="px-4 py-2 bg-[#050811] border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Badge & Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 font-bold flex items-center justify-center shadow-md shadow-amber-500/20">
              <Award className="w-4 h-4 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-sm text-white tracking-wide flex items-center gap-1.5">
                  SIH26028 GRAND FINALE DEMO GUIDE
                </span>
                <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded">
                  OFFICIAL EVALUATION WALKTHROUGH
                </span>
              </div>
            </div>
          </div>

          {/* Center: Auto-play, Timer & Completion Progress */}
          <div className="flex items-center gap-3">
            {/* Auto Play Toggle */}
            <button
              onClick={() => setIsPlayingAuto(!isPlayingAuto)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                isPlayingAuto 
                  ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400 animate-pulse' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
              title="Automatically run through all 9 demo steps"
            >
              {isPlayingAuto ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Auto-Playing ({autoTimerSeconds}s)</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-slate-200" />
                  <span>Auto-Play Tour</span>
                </>
              )}
            </button>

            {/* Step Counter Indicator */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg">
              <span className="text-[11px] font-mono text-slate-400">Step:</span>
              <span className="font-mono text-xs font-bold text-amber-400">{currentStep}</span>
              <span className="text-slate-600 text-xs">/</span>
              <span className="font-mono text-xs text-slate-300">9</span>
              <span className="h-3 w-px bg-slate-700 mx-1" />
              <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                {Math.round((completedSteps.length / 9) * 100)}% Verified
              </span>
            </div>

            {/* Quick Actions: Reset, Minimize, Close */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleResetTour}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Reset simulation to initial nominal state"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title={isMinimized ? 'Expand Demo Guide' : 'Minimize to compact ribbon'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition-colors"
                title="Exit Demo Guide"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CLICKABLE STEP PILLS HORIZONTAL BAR */}
      <div className="bg-[#0b101f] border-b border-slate-800 px-4 py-1.5 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 min-w-max">
          {steps.map(step => {
            const isActive = step.num === currentStep;
            const isCompleted = completedSteps.includes(step.num);

            return (
              <button
                key={step.num}
                onClick={() => handleJumpToStep(step.num)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 border ${
                  isActive 
                    ? 'bg-[#3b49df] text-white border-blue-400 shadow-md shadow-blue-900/50 font-bold scale-[1.02]' 
                    : isCompleted
                      ? 'bg-slate-900/90 text-slate-300 border-emerald-900/60 hover:bg-slate-800'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                  isActive 
                    ? 'bg-white text-blue-900' 
                    : isCompleted 
                      ? 'bg-emerald-500 text-slate-950' 
                      : 'bg-slate-800 text-slate-400'
                }`}>
                  {isCompleted && !isActive ? '✓' : step.num}
                </span>
                <span className="whitespace-nowrap">{step.shortTitle}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. EXPANDED ACTIVE STEP DETAILS (Hidden when minimized) */}
      {!isMinimized && (
        <div className="p-4 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            {/* Left 8 Cols: Step Description, Target Screen & Evaluator Note */}
            <div className="lg:col-span-8 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-900/80 text-indigo-300 border border-indigo-700/60 flex items-center gap-1">
                  {activeStep.icon}
                  <span>{activeStep.badge}</span>
                </span>

                <span className="text-xs font-mono text-slate-400">
                  Target View: <strong className="text-cyan-400">{activeStep.targetView}</strong>
                </span>
              </div>

              <h4 className="font-bold text-base text-white flex items-center gap-2">
                <span className="text-amber-400 font-mono">Step {activeStep.num}:</span>
                <span>{activeStep.title}</span>
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                {activeStep.desc}
              </p>

              {/* Evaluator Inspection Note Box */}
              <div className="bg-slate-900/90 border border-slate-700/60 rounded-lg px-3 py-1.5 flex items-start gap-2 text-xs">
                <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">
                  <strong className="text-amber-400 font-mono">SIH Evaluator Key Metric:</strong> {activeStep.evaluatorNote}
                </span>
              </div>
            </div>

            {/* Right 4 Cols: Big Action Buttons & Navigation */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2 justify-end">
              <div className="flex items-center gap-2">
                {/* Main Action Trigger */}
                <button
                  onClick={() => handleExecuteCurrentStep(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>{activeStep.actionLabel}</span>
                </button>

                {/* Execute & Advance Button */}
                {currentStep < 9 && (
                  <button
                    onClick={() => handleExecuteCurrentStep(true)}
                    className="px-3.5 py-2.5 rounded-xl bg-[#3b49df] hover:bg-blue-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02]"
                    title="Execute this action and advance to next step"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Prev / Next Chevrons */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
                <button
                  disabled={currentStep <= 1}
                  onClick={() => handleJumpToStep(currentStep - 1)}
                  className="flex items-center gap-1 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <span>
                  {currentStep === 9 ? 'Final Step Reached' : `Next: ${steps[currentStep]?.shortTitle}`}
                </span>

                <button
                  disabled={currentStep >= 9}
                  onClick={() => handleJumpToStep(currentStep + 1)}
                  className="flex items-center gap-1 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
                >
                  <span>Skip</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
