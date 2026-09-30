import React, { useState } from 'react';
import { 
  PassengerProfile, 
  Train, 
  PassengerNotification 
} from '../../types/railway';
import { 
  Ticket, 
  Train as TrainIcon, 
  Clock, 
  MapPin, 
  QrCode, 
  AlertTriangle, 
  CheckCircle2, 
  Bell, 
  Share2, 
  Download, 
  Utensils, 
  HelpCircle, 
  Volume2, 
  Sparkles, 
  Smartphone, 
  ExternalLink, 
  Info, 
  LogOut, 
  ChevronRight, 
  ShieldCheck,
  Check,
  Coffee,
  ShoppingBag,
  PhoneCall,
  X
} from 'lucide-react';
import { playRailwayChime, speakRailwayAnnouncement } from '../../utils/audioAlerts';

interface PassengerBoardingPassProps {
  passenger: PassengerProfile;
  train: Train;
  notifications: PassengerNotification[];
  onLogOut: () => void;
  onSimulateDelay: () => void;
  onSearchOtherTrains: () => void;
  audioEnabled?: boolean;
}

export const PassengerBoardingPass: React.FC<PassengerBoardingPassProps> = ({
  passenger,
  train,
  notifications,
  onLogOut,
  onSimulateDelay,
  onSearchOtherTrains,
  audioEnabled = true
}) => {
  const [showQrModal, setShowQrModal] = useState(false);
  const [showCateringModal, setShowCateringModal] = useState(false);
  const [showRailMadadModal, setShowRailMadadModal] = useState(false);
  const [cateringOrdered, setCateringOrdered] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState('Standard North Indian Thali');
  const [railMadadSubmitted, setRailMadadSubmitted] = useState(false);
  const [grievanceType, setGrievanceType] = useState('Coach Cleanliness & OBHS');
  const [alertsState, setAlertsState] = useState(passenger.alertsEnabled);
  const [alertSavedToast, setAlertSavedToast] = useState(false);
  const [activeTab, setActiveTab] = useState<'journey' | 'alerts' | 'services'>('journey');

  const handleToggleAlert = (key: keyof typeof alertsState) => {
    setAlertsState(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      setAlertSavedToast(true);
      setTimeout(() => setAlertSavedToast(false), 2000);
      return updated;
    });
  };

  const handlePlayAnnouncement = () => {
    if (audioEnabled) {
      playRailwayChime();
      setTimeout(() => {
        speakRailwayAnnouncement(
          train.number,
          train.name,
          train.currentDelayMinutes,
          train.nextStation,
          train.stops.find(s => s.status === 'next')?.platform || 'Platform 1'
        );
      }, 700);
    }
  };

  // Find relevant stops for passenger
  const destinationStop = train.stops.find(s => s.stationCode === passenger.destinationCode) || train.stops[train.stops.length - 1];

  return (
    <div className="space-y-5">
      {/* Top Passenger Session Bar */}
      <div className="bg-[#080d1a] text-white p-4 rounded-2xl border border-slate-800 shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-500/50 flex items-center justify-center font-bold text-blue-400">
            {passenger.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">{passenger.name}</span>
              <span className="px-2 py-0.2 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                VERIFIED PASSENGER
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                via {passenger.authMethod}
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono mt-0.5 flex flex-wrap items-center gap-3">
              <span>PNR: <strong className="text-white font-mono">{passenger.pnr}</strong></span>
              <span>•</span>
              <span>Train: <strong className="text-white">{passenger.trainNumber} {passenger.trainName}</strong></span>
              <span>•</span>
              <span>Coach: <strong className="text-white">{passenger.coach}</strong> / Berth: <strong className="text-white">{passenger.berth}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSearchOtherTrains}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <span>Search All Trains</span>
          </button>
          <button
            onClick={onLogOut}
            className="px-3 py-1.5 rounded-lg border border-rose-900/60 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Log out and return to Passenger Login page"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Switch / Logout</span>
          </button>
        </div>
      </div>

      {/* Main Digital Boarding Pass Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 7 Cols: Official IRCTC Ticket Pass Card */}
        <div className="lg:col-span-7 space-y-5">
          {/* Authentic IRCTC Digital Ticket Card */}
          <div className="bg-gradient-to-br from-slate-900 via-[#0a1020] to-[#040814] text-white rounded-2xl border-2 border-blue-500/40 shadow-2xl overflow-hidden relative">
            {/* Top Brand Header */}
            <div className="bg-[#03060f] px-5 py-3 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-bold text-blue-400">IRCTC ELECTRONIC RESERVATION SLIP</span>
              </div>
              <span className="text-[10px] text-slate-400">
                CLASS: 3A (AC 3 TIER)
              </span>
            </div>

            {/* Ticket Content */}
            <div className="p-6 space-y-5">
              {/* Route Banner */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Boarding Station</div>
                  <div className="text-xl font-bold tracking-tight text-white mt-0.5">
                    {passenger.source}
                  </div>
                  <div className="text-xs font-mono text-blue-400 font-semibold">
                    Code: {passenger.sourceCode} • {passenger.platform}
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-mono text-slate-400">TRAIN {passenger.trainNumber}</span>
                  <div className="flex items-center gap-1.5 my-1 text-slate-600">
                    <div className="h-0.5 w-10 bg-blue-500"></div>
                    <TrainIcon className="w-4 h-4 text-blue-400" />
                    <div className="h-0.5 w-10 bg-blue-500"></div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    {train.currentSpeedKmH} km/h • LIVE
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Destination</div>
                  <div className="text-xl font-bold tracking-tight text-white mt-0.5">
                    {passenger.destination}
                  </div>
                  <div className="text-xs font-mono text-blue-400 font-semibold">
                    Code: {passenger.destinationCode}
                  </div>
                </div>
              </div>

              {/* Passenger Seat & Coach Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-center">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">COACH</span>
                  <span className="text-lg font-mono font-bold text-white">{passenger.coach}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">BERTH / SEAT</span>
                  <span className="text-lg font-mono font-bold text-blue-400">{passenger.berth}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">BERTH TYPE</span>
                  <span className="text-xs font-medium text-slate-300 mt-1 block">{passenger.berthType}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">BOOKING STATUS</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono mt-1 block">
                    {passenger.bookingStatus} (CNF)
                  </span>
                </div>
              </div>

              {/* Dynamic ETA & Delay Forecast Synced with RAILETA AI */}
              <div className="bg-blue-950/30 border border-blue-800/40 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="font-bold text-xs text-white">
                      RAILETA DYNAMIC AI ARRIVAL FORECAST
                    </span>
                  </div>
                  {train.currentDelayMinutes === 0 ? (
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      ON SCHEDULE
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800">
                      +{train.currentDelayMinutes} MIN DELAY PREDICTED
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Scheduled Arrival ({passenger.destinationCode}):</span>
                    <span className="font-mono font-semibold text-slate-300">
                      {destinationStop.scheduledArrival} IST
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Revised Dynamic ETA:</span>
                    <span className={`font-mono font-bold text-sm ${
                      train.currentDelayMinutes > 0 ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {destinationStop.predictedArrival} IST
                    </span>
                  </div>
                </div>

                {train.currentDelayMinutes > 0 && (
                  <div className="p-2 rounded bg-slate-900/90 border border-rose-900/50 text-[11px] text-slate-300 flex items-start gap-2 mt-2">
                    <Info className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Explainable AI Root Cause: </strong>
                      {train.featureAttribution.rationale || 'Track speed restriction downstream. Schedule automatically revised.'}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons on Pass */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowQrModal(true)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <QrCode className="w-3.5 h-3.5 text-blue-400" />
                    <span>Show Digital QR Ticket</span>
                  </button>
                  <button
                    onClick={handlePlayAnnouncement}
                    className="px-3 py-1.5 rounded-lg bg-indigo-950 hover:bg-indigo-900 border border-indigo-700 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen PA Announcement</span>
                  </button>
                </div>

                <button
                  onClick={onSimulateDelay}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <AlertTriangle className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Simulate Delay (+20m)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Notification Channels & Real-time Services */}
        <div className="lg:col-span-5 space-y-5">
          {/* Notification Preferences Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                  Real-time Alert Delivery Channels
                </h3>
              </div>
              {alertSavedToast && (
                <span className="text-[10px] font-mono text-emerald-500 font-bold animate-pulse">
                  Settings Saved
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              RAILETA AI will proactively dispatch alerts before downstream speed restrictions affect your journey.
            </p>

            <div className="space-y-3 pt-1">
              <div 
                onClick={() => handleToggleAlert('whatsapp')}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 cursor-pointer hover:border-emerald-500 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    WA
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      WhatsApp Push Notifications
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      To {passenger.mobileNumber}
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={alertsState.whatsapp}
                  onChange={() => {}}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
              </div>

              <div 
                onClick={() => handleToggleAlert('sms')}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 cursor-pointer hover:border-blue-500 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                    SMS
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      CRIS Emergency SMS Gateway
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      High-priority telecom route
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={alertsState.sms}
                  onChange={() => {}}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
              </div>

              <div 
                onClick={() => handleToggleAlert('appPush')}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 cursor-pointer hover:border-indigo-500 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                    AI
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      In-App Dynamic Disruption Warnings
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Real-time telemetry stream
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={alertsState.appPush}
                  onChange={() => {}}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Passenger Services: eCatering & RailMadad */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Utensils className="w-4 h-4 text-amber-500" />
              <span>Smart On-Board Passenger Services</span>
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  if (audioEnabled) playRailwayChime();
                  setShowCateringModal(true);
                }}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:border-amber-400 dark:hover:border-amber-500 hover:bg-amber-50/40 dark:hover:bg-amber-950/20 text-left transition-all cursor-pointer group"
              >
                <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-amber-500" />
                    <span>IRCTC eCatering</span>
                  </span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 group-hover:translate-x-0.5 transition-transform">
                    Order →
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Delivery to Coach {passenger.coach}, Berth {passenger.berth} at next junction.
                </p>
                <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 mt-2 block font-semibold">
                  {cateringOrdered ? '✓ 1 Meal Ordered' : 'ETA-Synced Delivery'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (audioEnabled) playRailwayChime();
                  setShowRailMadadModal(true);
                }}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:border-rose-400 dark:hover:border-rose-500 hover:bg-rose-50/40 dark:hover:bg-rose-950/20 text-left transition-all cursor-pointer group"
              >
                <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-rose-500" />
                    <span>RailMadad 139</span>
                  </span>
                  <span className="text-[10px] text-rose-600 dark:text-rose-400 group-hover:translate-x-0.5 transition-transform">
                    Help →
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  On-board grievance, medical aid, or coach cleanliness assistance.
                </p>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 mt-2 block font-semibold">
                  {railMadadSubmitted ? '✓ Ticket Dispatched' : 'Active 24x7 Helpline'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="font-bold text-xs uppercase font-mono text-slate-900 dark:text-white">
                IRCTC DIGITAL BOARDING QR
              </span>
              <button
                onClick={() => setShowQrModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="p-4 bg-white rounded-xl inline-block border-2 border-slate-900 shadow-md">
              <QrCode className="w-48 h-48 text-slate-900 mx-auto" />
            </div>

            <div>
              <div className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                PNR: {passenger.pnr}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {passenger.name} • Train {passenger.trainNumber} ({passenger.coach}/{passenger.berth})
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-2 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Digitally Signed by CRIS PKI Certificate</span>
              </div>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* IRCTC eCatering Modal */}
      {showCateringModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-amber-500" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  IRCTC Smart e-Catering Order
                </h4>
              </div>
              <button
                onClick={() => {
                  setShowCateringModal(false);
                  setCateringOrdered(false);
                }}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {cateringOrdered ? (
              <div className="p-6 text-center space-y-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-300 dark:border-emerald-800">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h5 className="font-bold text-base text-slate-900 dark:text-white">
                  Order Confirmed & Synced with Train ETA!
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Your <strong>{selectedMeal}</strong> will be freshly delivered right to <strong>Coach {passenger.coach}, Berth {passenger.berth}</strong> when Train {train.number} arrives at the next platform ({train.predictedArrivalNext}).
                </p>
                <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                  Order Token: #IRCTC-ETA-{Date.now().toString().slice(-6)}
                </div>
                <button
                  onClick={() => setShowCateringModal(false)}
                  className="mt-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  Return to Boarding Pass
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  <span className="text-slate-500 block text-[10px] font-mono uppercase">Delivery Location:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    Train {passenger.trainNumber} ({passenger.trainName}) • Coach {passenger.coach}, Seat {passenger.berth}
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 block text-[11px] mt-0.5 font-medium">
                    AI Guaranteed Delivery: Synchronized with dynamic delay revisions.
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    Select Fresh Pantry / Station Meal
                  </label>
                  {[
                    { id: 'thali', name: 'Standard North Indian Thali', desc: 'Dal makhani, paneer butter masala, 2 parathas, rice & gulab jamun', price: '₹180' },
                    { id: 'biryani', name: 'Hyderabadi Veg Dum Biryani', desc: 'Aromatic basmati rice with spiced vegetables, mirchi salan & raita', price: '₹160' },
                    { id: 'snacks', name: 'Railway Cutlets & Ginger Masala Chai', desc: '2 crispy vegetable cutlets with ketchup & piping hot tea', price: '₹75' },
                    { id: 'water', name: 'Rail Neer Packaged Drinking Water (1L)', desc: 'BIS-certified chilled railway spring water', price: '₹15' }
                  ].map((meal) => (
                    <div
                      key={meal.id}
                      onClick={() => setSelectedMeal(meal.name)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        selectedMeal === meal.name
                          ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/30'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white">
                          {meal.name}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {meal.desc}
                        </div>
                      </div>
                      <span className="font-mono font-bold text-xs text-amber-600 dark:text-amber-400">
                        {meal.price}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (audioEnabled) playRailwayChime();
                    setCateringOrdered(true);
                  }}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Confirm Order ({selectedMeal.slice(0, 24)}...)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RailMadad 139 Assistance Modal */}
      {showRailMadadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-rose-500" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  RailMadad 139 Grievance & Aid Hotline
                </h4>
              </div>
              <button
                onClick={() => {
                  setShowRailMadadModal(false);
                  setRailMadadSubmitted(false);
                }}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {railMadadSubmitted ? (
              <div className="p-6 text-center space-y-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-300 dark:border-emerald-800">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h5 className="font-bold text-base text-slate-900 dark:text-white">
                  Grievance Dispatched to On-Board Train Captain
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Ticket <strong>#RM-2026-{Date.now().toString().slice(-5)}</strong> has been assigned to the Coach Attendant and Train Ticket Examiner (TTE) for Coach {passenger.coach}, Berth {passenger.berth}.
                </p>
                <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                  Priority: HIGH • Status: STAFF EN ROUTE
                </div>
                <button
                  onClick={() => setShowRailMadadModal(false)}
                  className="mt-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs">
                    <PhoneCall className="w-4 h-4 animate-pulse" />
                    <span>Emergency Toll-Free Helpline: <strong>139</strong></span>
                  </div>
                  <button
                    onClick={() => {
                      if (audioEnabled) playRailwayChime();
                      setRailMadadSubmitted(true);
                    }}
                    className="px-2.5 py-1 rounded bg-rose-600 text-white font-bold text-[10px]"
                  >
                    Quick SOS (139)
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    Assistance Category
                  </label>
                  {[
                    'Coach Cleanliness & Bio-Toilet Service',
                    'Medical Emergency / Doctor on Next Station',
                    'AC / Electrical / Charging Socket Issue',
                    'Security / RPF Women Safety Assistance'
                  ].map((cat) => (
                    <div
                      key={cat}
                      onClick={() => setGrievanceType(cat)}
                      className={`p-2.5 rounded-lg border cursor-pointer text-xs transition-colors flex items-center justify-between ${
                        grievanceType === cat
                          ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 font-bold text-slate-900 dark:text-white'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <span>{cat}</span>
                      {grievanceType === cat && <Check className="w-3.5 h-3.5 text-rose-500" />}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (audioEnabled) playRailwayChime();
                    setRailMadadSubmitted(true);
                  }}
                  className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Dispatch Request to Train Staff</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
