import React, { useState, useEffect } from 'react';
import { 
  Ticket, 
  Smartphone, 
  Lock, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  User, 
  CheckCircle2, 
  RefreshCw, 
  AlertCircle, 
  Train, 
  Calendar, 
  MapPin, 
  Key, 
  QrCode,
  Fingerprint,
  ChevronRight,
  ExternalLink,
  Info
} from 'lucide-react';
import { PassengerProfile } from '../../types/railway';
import { DEFAULT_PASSENGERS } from '../../data/mockRailwayData';
import { playRailwayChime } from '../../utils/audioAlerts';

interface PassengerLoginPageProps {
  onLoginSuccess: (passenger: PassengerProfile) => void;
  onContinueAsGuest: () => void;
  isDarkMode?: boolean;
}

type LoginTab = 'pnr' | 'otp' | 'irctc' | 'digiyatra';

export const PassengerLoginPage: React.FC<PassengerLoginPageProps> = ({
  onLoginSuccess,
  onContinueAsGuest,
  isDarkMode = true
}) => {
  const [activeTab, setActiveTab] = useState<LoginTab>('pnr');

  // PNR State
  const [pnrInput, setPnrInput] = useState('245-8912048');
  const [pnrError, setPnrError] = useState<string | null>(null);

  // OTP State
  const [mobileInput, setMobileInput] = useState('9876543210');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpTimer, setOtpTimer] = useState(30);
  const [simulatedSmsToast, setSimulatedSmsToast] = useState<string | null>(null);

  // IRCTC State
  const [irctcUsername, setIrctcUsername] = useState('rahul_s_irctc');
  const [irctcPassword, setIrctcPassword] = useState('••••••••••••');
  const [generatedCaptcha, setGeneratedCaptcha] = useState('R8K4P');
  const [captchaInput, setCaptchaInput] = useState('R8K4P');
  const [captchaError, setCaptchaError] = useState<string | null>(null);

  // DigiYatra State
  const [isVerifyingBiometric, setIsVerifyingBiometric] = useState(false);

  // Global Loading State
  const [isLoading, setIsLoading] = useState(false);

  // Countdown timer for OTP
  useEffect(() => {
    let interval: any;
    if (otpSent && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, otpTimer]);

  const refreshCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedCaptcha(code);
    setCaptchaInput('');
    setCaptchaError(null);
  };

  // PNR format helper
  const handlePnrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length > 10) val = val.slice(0, 10);
    if (val.length > 3) {
      val = `${val.slice(0, 3)}-${val.slice(3)}`;
    }
    setPnrInput(val);
    setPnrError(null);
  };

  // Submit PNR Login
  const handlePnrLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    let currentInput = pnrInput.trim();
    if (!currentInput) {
      currentInput = '245-8912048';
      setPnrInput('245-8912048');
    }
    const cleanPnr = currentInput.replace(/[^0-9]/g, '');
    if (cleanPnr.length < 10) {
      setPnrError('Please enter a valid 10-digit Indian Railways PNR number');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Check if match in presets
      const matched = DEFAULT_PASSENGERS.find(p => p.pnr.replace(/[^0-9]/g, '') === cleanPnr);
      if (matched) {
        playRailwayChime();
        onLoginSuccess(matched);
      } else {
        // Generate valid passenger object for custom PNR
        const customPassenger: PassengerProfile = {
          id: `pass-custom-${Date.now()}`,
          name: 'Confirmed Passenger',
          pnr: currentInput,
          trainNumber: '12806',
          trainName: 'AP Express',
          source: 'Gwalior Junction',
          destination: 'New Delhi',
          sourceCode: 'GWL',
          destinationCode: 'NDLS',
          journeyDate: '05-09-2026',
          coach: 'B3',
          berth: '38',
          berthType: 'Middle Berth (MB)',
          bookingStatus: 'CONFIRMED',
          mobileNumber: '+91 98765 00000',
          email: 'passenger@railways.in',
          authMethod: 'PNR',
          platform: 'PF 1 (Gwalior)',
          alertsEnabled: {
            sms: true,
            whatsapp: true,
            voiceCall: false,
            appPush: true
          }
        };
        playRailwayChime();
        onLoginSuccess(customPassenger);
      }
    }, 600);
  };

  // Send Mobile OTP
  const handleSendOtp = () => {
    if (mobileInput.length < 10) return;
    setOtpSent(true);
    setOtpTimer(30);
    setOtpCode('2602');
    setSimulatedSmsToast('SMS from IRCTC-ALERT: 2602 is your verification OTP for RAILETA AI live journey pass. Valid for 5 min.');
    setTimeout(() => setSimulatedSmsToast(null), 8000);
  };

  // Submit OTP Login
  const handleOtpLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!otpSent) {
      setOtpSent(true);
      setOtpCode('2602');
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const matched = DEFAULT_PASSENGERS[3] || DEFAULT_PASSENGERS[0];
      playRailwayChime();
      onLoginSuccess({
        ...matched,
        authMethod: 'OTP',
        mobileNumber: `+91 ${mobileInput || '9876543210'}`
      });
    }, 600);
  };

  // Submit IRCTC Login
  const handleIrctcLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const inputCode = captchaInput.trim() || generatedCaptcha;
    if (inputCode.toUpperCase() !== generatedCaptcha.toUpperCase()) {
      setCaptchaError('Incorrect Captcha code. Click Auto-fill Demo Credentials below.');
      return;
    }
    setCaptchaError(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const matched = DEFAULT_PASSENGERS.find(p => p.irctcUsername === irctcUsername) || DEFAULT_PASSENGERS[0];
      playRailwayChime();
      onLoginSuccess({
        ...matched,
        authMethod: 'IRCTC'
      });
    }, 600);
  };

  // DigiYatra One-Tap Login
  const handleDigiYatraLogin = () => {
    setIsVerifyingBiometric(true);
    setTimeout(() => {
      setIsVerifyingBiometric(false);
      const matched = DEFAULT_PASSENGERS[1]; // Dr. Priya Patel
      playRailwayChime();
      onLoginSuccess({
        ...matched,
        authMethod: 'DIGIYATRA'
      });
    }, 1200);
  };

  // 1-Click Quick Demo Login helper
  const handleSelectQuickPassenger = (passenger: PassengerProfile) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      playRailwayChime();
      onLoginSuccess(passenger);
    }, 350);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-2">
      {/* Simulated SMS Push Toast */}
      {simulatedSmsToast && (
        <div className="fixed top-20 right-4 z-50 max-w-sm bg-slate-900 border-2 border-emerald-500 text-white p-4 rounded-xl shadow-2xl animate-bounce">
          <div className="flex items-start gap-2.5">
            <Smartphone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-emerald-400 font-mono uppercase">
                Incoming SMS • IRCTC-ALERT
              </div>
              <p className="text-xs text-slate-200 mt-1 font-mono">
                {simulatedSmsToast}
              </p>
              <button
                onClick={() => setOtpCode('2602')}
                className="mt-2 text-[10px] font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-2 py-1 rounded cursor-pointer"
              >
                Auto-fill OTP (2602)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Passenger Portal Header */}
      <div className="bg-[#080e1e] text-white p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Subtle grid backdrop */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-900/50">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-400 uppercase bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800">
                  CENTRE FOR RAILWAY INFORMATION SYSTEMS (CRIS)
                </span>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                  <ShieldCheck className="w-3 h-3" />
                  <span>256-Bit SSL Encrypted</span>
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight mt-1 flex items-center gap-2">
                RAILETA AI Passenger Portal
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Sign in with your PNR, Mobile OTP, or IRCTC account for proactive journey forecasts & early disruption alerts.
              </p>
            </div>
          </div>

          <button
            onClick={onContinueAsGuest}
            className="px-3.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <span>Browse as Guest</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Auth Method Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('pnr')}
            className={`flex-1 min-w-[140px] py-3.5 px-4 flex items-center justify-center gap-2 transition-all border-b-2 cursor-pointer ${
              activeTab === 'pnr'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>PNR / Ticket Login</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono">
              Fast
            </span>
          </button>

          <button
            onClick={() => setActiveTab('otp')}
            className={`flex-1 min-w-[140px] py-3.5 px-4 flex items-center justify-center gap-2 transition-all border-b-2 cursor-pointer ${
              activeTab === 'otp'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile OTP</span>
          </button>

          <button
            onClick={() => setActiveTab('irctc')}
            className={`flex-1 min-w-[140px] py-3.5 px-4 flex items-center justify-center gap-2 transition-all border-b-2 cursor-pointer ${
              activeTab === 'irctc'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>IRCTC Account</span>
          </button>

          <button
            onClick={() => setActiveTab('digiyatra')}
            className={`flex-1 min-w-[140px] py-3.5 px-4 flex items-center justify-center gap-2 transition-all border-b-2 cursor-pointer ${
              activeTab === 'digiyatra'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Fingerprint className="w-4 h-4 text-purple-400" />
            <span>DigiYatra Fast Pass</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 md:p-8">
          {/* TAB 1: PNR LOGIN */}
          {activeTab === 'pnr' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-blue-600" />
                  <span>Enter 10-Digit Indian Railways PNR</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Printed on the top-left corner of your IRCTC electronic reservation slip (ERS) or SMS confirmation.
                </p>
              </div>

              <form onSubmit={handlePnrLogin} className="space-y-4 max-w-lg">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    PNR Number (10 Digits)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={pnrInput}
                      onChange={handlePnrChange}
                      placeholder="e.g. 245-8912048"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-base font-mono font-bold tracking-widest text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="absolute right-3 top-3 text-xs font-mono text-slate-400">
                      {pnrInput.replace(/[^0-9]/g, '').length}/10
                    </div>
                  </div>
                  {pnrError && (
                    <p className="text-xs text-rose-500 flex items-center gap-1 mt-1.5 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{pnrError}</span>
                    </p>
                  )}

                  {/* Fast 1-Click PNR Pre-fill chips */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 font-mono">Sample PNRs:</span>
                    <button
                      type="button"
                      onClick={() => setPnrInput('245-8912048')}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer"
                    >
                      245-8912048 (Rahul • 3AC)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPnrInput('812-4091823')}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900 cursor-pointer"
                    >
                      812-4091823 (Dr. Priya • EC)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPnrInput('631-9028312')}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900 cursor-pointer"
                    >
                      631-9028312 (Col. Vikram • 1AC)
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-[#3b49df] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Retrieving Booking & Dynamic ETA...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In & Access Live Journey Pass</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Verified PNR Features Preview */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-start gap-2 bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white block">Auto Coach & Berth</strong>
                    Direct seat status & confirmed chart sync.
                  </div>
                </div>
                <div className="flex items-start gap-2 bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white block">Dynamic AI Alerts</strong>
                    Downstream delay warnings before arrival.
                  </div>
                </div>
                <div className="flex items-start gap-2 bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white block">Platform Prediction</strong>
                    AI-forecasted arrival platform assignment.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MOBILE OTP LOGIN */}
          {activeTab === 'otp' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-500" />
                  <span>Mobile OTP Verification</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Authenticate securely using the mobile number registered on your Indian Railways / IRCTC ticket.
                </p>
              </div>

              <form onSubmit={handleOtpLogin} className="space-y-4 max-w-lg">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Mobile Number
                  </label>
                  <div className="flex gap-2">
                    <span className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center">
                      🇮🇳 +91
                    </span>
                    <input
                      type="text"
                      value={mobileInput}
                      onChange={(e) => setMobileInput(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                      placeholder="98765 43210"
                      className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors shrink-0"
                    >
                      {otpSent ? 'Resend' : 'Send OTP'}
                    </button>
                  </div>
                </div>

                {otpSent && (
                  <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>OTP dispatched via SMS</span>
                      </span>
                      <span className="font-mono text-slate-400 text-[11px]">
                        Resend in {otpTimer}s
                      </span>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Enter 4-Digit Verification Code
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                          placeholder="2602"
                          maxLength={4}
                          className="w-36 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 text-center text-lg font-mono font-extrabold tracking-widest text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => setOtpCode('2602')}
                          className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all"
                        >
                          Auto-fill Demo Code (2602)
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying Mobile OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify & Continue to Passenger Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: IRCTC ACCOUNT LOGIN */}
          {activeTab === 'irctc' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <span>IRCTC Passenger eTicketing Credentials</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Connect your official IRCTC account to automatically synchronize all booked tickets & live travel passes.
                </p>
              </div>

              <form onSubmit={handleIrctcLogin} className="space-y-4 max-w-lg">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    IRCTC User ID
                  </label>
                  <input
                    type="text"
                    value={irctcUsername}
                    onChange={(e) => setIrctcUsername(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={irctcPassword}
                    onChange={(e) => setIrctcPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Captcha Box */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Security Captcha Verification
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 border border-slate-400 dark:border-slate-600 rounded-xl text-lg font-mono font-black tracking-widest text-slate-800 dark:text-white select-none line-through decoration-slate-400">
                      {generatedCaptcha}
                    </div>
                    <button
                      type="button"
                      onClick={refreshCaptcha}
                      className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                      title="Generate new Captcha"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <input
                      type="text"
                      placeholder="Type Captcha"
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono font-bold uppercase text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {captchaError && (
                    <p className="text-xs text-rose-500 mt-1 font-medium">{captchaError}</p>
                  )}
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIrctcUsername('rahul_s_irctc');
                      setCaptchaInput(generatedCaptcha);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Auto-fill Demo Credentials
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-[#3b49df] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Authenticating IRCTC Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to IRCTC Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: DIGIYATRA FAST PASS */}
          {activeTab === 'digiyatra' && (
            <div className="space-y-6 max-w-lg">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-purple-500" />
                  <span>DigiYatra Rail Pass • Instant Biometric SSO</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  One-tap contactless verification linked with your Aadhaar / DigiLocker digital travel credentials.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-950/30 to-indigo-950/30 border border-purple-800/40 rounded-2xl p-6 text-center space-y-4">
                <div className="w-20 h-20 rounded-full mx-auto bg-purple-900/40 border-2 border-purple-500 flex items-center justify-center text-purple-400 relative">
                  <Fingerprint className={`w-10 h-10 ${isVerifyingBiometric ? 'animate-pulse text-emerald-400' : ''}`} />
                  {isVerifyingBiometric && (
                    <span className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping" />
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    DigiYatra Verified ID Available
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Pre-cleared digital boarding pass ready for instant gate-entry simulation.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDigiYatraLogin}
                  disabled={isVerifyingBiometric}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
                >
                  {isVerifyingBiometric ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying Biometric Facial Match...</span>
                    </>
                  ) : (
                    <>
                      <Fingerprint className="w-4 h-4" />
                      <span>One-Tap DigiYatra Fast Login</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 1-Click Quick Demo Passengers Selector (Crucial for SIH Hackathon Evaluators) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              1-Click Demo Passenger Profiles (For Evaluators & Judges)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Click any profile below to immediately log in
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {DEFAULT_PASSENGERS.map((pass) => (
            <button
              key={pass.id}
              onClick={() => handleSelectQuickPassenger(pass)}
              className="text-left p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50 dark:bg-slate-950/60 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {pass.name}
                </span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                  {pass.bookingStatus}
                </span>
              </div>

              <div className="text-[11px] font-mono text-blue-600 dark:text-blue-400 mt-1 font-semibold">
                PNR: {pass.pnr}
              </div>

              <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
                Train {pass.trainNumber} ({pass.coach}/{pass.berth})
              </div>

              <div className="text-[10px] text-slate-400 font-mono mt-1 flex items-center justify-between">
                <span>{pass.sourceCode} ➔ {pass.destinationCode}</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-slate-400 group-hover:text-blue-500" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
