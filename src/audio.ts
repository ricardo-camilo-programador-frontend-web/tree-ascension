const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
let audioCtx: AudioContext | null = null;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

function playTone(freq: number, type: OscillatorType, duration: number, vol: number) {
  try {
    const ctx = initAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Ignore audio errors (e.g. if user hasn't interacted yet)
  }
}

export const playShootSound = () => playTone(800, 'square', 0.1, 0.02);
export const playHitSound = () => playTone(200, 'sawtooth', 0.1, 0.02);
export const playDeathSound = () => {
  try {
    const ctx = initAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {}
};
export const playSunSound = () => {
  playTone(600, 'sine', 0.1, 0.05);
  setTimeout(() => playTone(800, 'sine', 0.2, 0.05), 100);
};
export const playSunBurstSound = () => {
  playTone(300, 'square', 0.5, 0.05);
  playTone(400, 'sawtooth', 0.5, 0.05);
};
export const playPortalSound = () => playTone(100, 'sine', 0.3, 0.05);
