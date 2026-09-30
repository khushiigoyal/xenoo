/**
 * Native Browser Web Audio API Synthesizer for Railway Chimes
 * No external MP3 downloads required - completely offline capable!
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play authentic two-tone Indian Railways station arrival/announcement chime (Ding-Dong!)
 */
export function playRailwayChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Tone 1: High note (A4 440Hz / C5 523Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now); // C5
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.18, now + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.6);

    // Tone 2: Lower resolution note (G4 392Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(392.00, now + 0.45); // G4
    gain2.gain.setValueAtTime(0, now + 0.45);
    gain2.gain.linearRampToValueAtTime(0.22, now + 0.5);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.45);
    osc2.stop(now + 1.25);
  } catch (e) {
    console.warn('Audio chime play failed', e);
  }
}

/**
 * Play drone caution order beep / radar blip sound
 */
export function playRadarBeep() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.25);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  } catch (e) {
    console.warn('Radar sound error', e);
  }
}

/**
 * Synthesizes official Indian Railways announcement speech using browser Web Speech API
 */
export function speakStationAnnouncement(message: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    playRailwayChime();

    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 0.92; // Slightly formal pacing
      utterance.pitch = 1.05;
      utterance.volume = 0.85;
      window.speechSynthesis.speak(utterance);
    }, 650);
  } catch (e) {
    console.warn('Speech synthesis error', e);
  }
}

/**
 * Standard bilingual Indian Railways PA announcement synthesizer
 */
export function speakRailwayAnnouncement(
  trainNumber: string,
  trainName: string,
  delayMinutes: number,
  nextStation: string,
  platform: string
) {
  const statusPhrase = delayMinutes > 0 
    ? `running late by ${delayMinutes} minutes` 
    : 'running on schedule';
  const msg = `Attention please! Train number ${trainNumber}, ${trainName}, is ${statusPhrase}. Arriving at ${nextStation} on ${platform}.`;
  speakStationAnnouncement(msg);
}
