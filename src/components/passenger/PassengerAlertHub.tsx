import React, { useState } from 'react';
import { PassengerNotification } from '../../types/railway';
import { Bell, Send, CheckCircle2, Smartphone, MessageSquare, AlertCircle, Info } from 'lucide-react';

interface PassengerAlertHubProps {
  notifications: PassengerNotification[];
  onSendCustomAlert?: (message: string) => void;
}

export const PassengerAlertHub: React.FC<PassengerAlertHubProps> = ({
  notifications,
  onSendCustomAlert
}) => {
  const [phoneNumber, setPhoneNumber] = useState('+91 98765 43210');
  const [showModal, setShowModal] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSimulateSend = () => {
    setSentSuccess(true);
    if (onSendCustomAlert) {
      onSendCustomAlert(`Live Alert dispatched to ${phoneNumber}: Train 12806 AP Express dynamic ETA updated. Expected arrival revised.`);
    }
    setTimeout(() => {
      setShowModal(false);
      setSentSuccess(false);
    }, 2200);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="p-4 border-b border-slate-800 bg-slate-900 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-400">
            <Bell className="w-4 h-4 animate-bounce" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-white">
              PASSENGER LIVE ALERT HUB
            </h3>
            <p className="text-xs text-slate-400">
              Proactive SMS & WhatsApp notifications triggered whenever train ETA deviates
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-sm transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          <span>SIMULATE PASSENGER ALERT</span>
        </button>
      </div>

      {/* Notification Stream Cards */}
      <div className="p-4 space-y-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 flex items-start gap-3 hover:border-slate-700 transition-colors"
          >
            <div className={`p-2 rounded-full mt-0.5 shrink-0 ${
              notif.type === 'CRITICAL' ? 'bg-rose-950 text-rose-400' :
              notif.type === 'WARNING' ? 'bg-amber-950 text-amber-400' :
              notif.type === 'SUCCESS' ? 'bg-emerald-950 text-emerald-400' : 'bg-indigo-950 text-indigo-400'
            }`}>
              <MessageSquare className="w-3.5 h-3.5" />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-xs text-white">
                  Train {notif.trainNumber} • {notif.trainName}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {notif.timestamp}
                </span>
              </div>

              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {notif.message}
              </p>

              {notif.revisedEta && (
                <div className="mt-2 inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono">
                  <span className="text-slate-400">Station: <strong className="text-white">{notif.stationName}</strong></span>
                  <span>•</span>
                  <span className="text-slate-400">Revised ETA: <strong className="text-cyan-300">{notif.revisedEta}</strong></span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Simulated Phone Alert Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-5 shadow-2xl relative">
            <div className="flex items-center gap-2 mb-3">
              <Smartphone className="w-5 h-5 text-indigo-400" />
              <h4 className="font-display font-bold text-base text-white">
                Simulate Passenger SMS / WhatsApp
              </h4>
            </div>

            {sentSuccess ? (
              <div className="p-6 text-center space-y-2 bg-slate-950 rounded-xl border border-emerald-800/60">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                <h5 className="font-bold text-white text-sm">SMS Alert Dispatched!</h5>
                <p className="text-xs text-slate-400">
                  Simulated dynamic ETA alert sent to {phoneNumber} via Indian Railways SMS Gateway API.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-400">
                  In production, this module connects to the CRIS National Train Enquiry System (NTES) SMS/WhatsApp API to notify ticket-holding passengers.
                </p>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Passenger Mobile Number</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 font-mono">
                  <div className="text-[10px] text-slate-500 mb-1">SAMPLE MESSAGE PAYLOAD:</div>
                  "RAIL-INFO: Train 12806 AP Express dynamic ETA updated. Expected arrival at your boarding station is revised due to line clearance. Track live: raileta.gov.in"
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSimulateSend}
                    className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm"
                  >
                    Send Test SMS
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
