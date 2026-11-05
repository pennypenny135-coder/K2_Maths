"use client";
// 全部音效與背景音樂都由 Web Audio API 即時產生，沒有任何外部音檔。
// All sounds and music are synthesized live with the Web Audio API — no audio files.
import { useSyncExternalStore } from "react";

const KEY = "happy-math-sound-v1";

interface SoundState {
  sound: boolean;
  music: boolean;
}

const DEFAULT_STATE: SoundState = { sound: true, music: true };
let state: SoundState = DEFAULT_STATE;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw) as Partial<SoundState>;
      state = { sound: p.sound !== false, music: p.music !== false };
    }
  } catch {
    /* ignore */
  }
}

function setState(next: SoundState) {
  state = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  syncMusic();
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  load();
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

const getSnapshot = () => {
  load();
  return state;
};
const getServerSnapshot = () => DEFAULT_STATE;

// ---------- Audio engine ----------

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let musicBus: GainNode | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);
    musicBus = ctx.createGain();
    musicBus.gain.value = 0.55;
    musicBus.connect(master);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

interface ToneOpts {
  type?: OscillatorType;
  gain?: number;
  slideTo?: number;
  dest?: AudioNode | null;
}

function tone(freq: number, start: number, dur: number, opts: ToneOpts = {}) {
  const c = ctx;
  if (!c) return;
  const { type = "sine", gain = 0.18, slideTo, dest = master } = opts;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, start + dur);
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(gain, start + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  osc.connect(g);
  g.connect(dest ?? c.destination);
  osc.start(start);
  osc.stop(start + dur + 0.05);
}

function play(fn: (t: number) => void) {
  load();
  if (!state.sound) return;
  const c = getCtx();
  if (!c) return;
  fn(c.currentTime + 0.01);
}

const NOTE = {
  C4: 261.63, D4: 293.66, E4: 329.63, G4: 392.0, A4: 440.0,
  C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880.0,
  C6: 1046.5, D6: 1174.66, E6: 1318.51, G6: 1567.98, C7: 2093.0,
};

const sfx = {
  /** 按鈕點擊 / button tap */
  tap: () =>
    play((t) => {
      tone(660, t, 0.07, { type: "triangle", gain: 0.12 });
      tone(880, t + 0.04, 0.08, { type: "triangle", gain: 0.1 });
    }),
  /** 答對：清脆上升「叮」 / correct: crisp rising ding */
  correct: () =>
    play((t) => {
      tone(NOTE.G5, t, 0.18, { gain: 0.16 });
      tone(NOTE.C6, t + 0.09, 0.2, { gain: 0.16 });
      tone(NOTE.E6, t + 0.18, 0.4, { gain: 0.16 });
    }),
  /** 答錯：柔和低音 / wrong: soft, gentle low tone */
  wrong: () =>
    play((t) => {
      tone(311, t, 0.28, { type: "sine", gain: 0.1, slideTo: 262 });
      tone(247, t + 0.2, 0.32, { type: "sine", gain: 0.08, slideTo: 220 });
    }),
  /** 獲得星星 / star earned */
  star: () =>
    play((t) => {
      [NOTE.E6, NOTE.G6, NOTE.C7].forEach((f, i) => tone(f, t + i * 0.07, 0.25, { type: "triangle", gain: 0.1 }));
    }),
  /** 連續答對：音調隨 combo 升高 / combo: pitch rises with combo */
  combo: (n: number) =>
    play((t) => {
      const base = 520 * Math.pow(1.0595, Math.min(n, 10) * 2);
      tone(base, t, 0.12, { type: "square", gain: 0.05 });
      tone(base * 1.5, t + 0.08, 0.2, { type: "square", gain: 0.05 });
    }),
  /** 完成關卡：勝利旋律 / level complete: victory melody */
  complete: () =>
    play((t) => {
      const seq: [number, number, number][] = [
        [NOTE.C5, 0, 0.16],
        [NOTE.E5, 0.16, 0.16],
        [NOTE.G5, 0.32, 0.16],
        [NOTE.C6, 0.48, 0.3],
        [NOTE.G5, 0.82, 0.14],
        [NOTE.C6, 0.96, 0.14],
        [NOTE.E6, 1.1, 0.6],
      ];
      seq.forEach(([f, d, len]) => {
        tone(f, t + d, len + 0.1, { type: "triangle", gain: 0.16 });
        tone(f / 2, t + d, len + 0.1, { type: "sine", gain: 0.08 });
      });
    }),
};

// ---------- Background music (short, loopable, synthesized) ----------

const M = NOTE;
// 32 個八分音符，C 大調五聲音階 / 32 eighth-notes in C major pentatonic
const MELODY: number[] = [
  M.E5, M.G5, M.A5, M.G5, M.E5, M.D5, M.C5, 0,
  M.D5, M.E5, M.G5, M.E5, M.D5, M.C5, M.D5, 0,
  M.G5, M.A5, M.C6, M.A5, M.G5, M.E5, M.G5, 0,
  M.A5, M.G5, M.E5, M.D5, M.C5, M.D5, M.C5, 0,
];
const BASS: Record<number, number> = { 0: 130.81, 8: 130.81, 16: 174.61, 24: 196.0 };

let wantMusic = false;
let timer: number | null = null;
let nextTime = 0;
let step = 0;

function schedule() {
  const c = ctx;
  if (!c || !musicBus) return;
  while (nextTime < c.currentTime + 0.45) {
    const i = step % MELODY.length;
    const f = MELODY[i];
    if (f) tone(f, nextTime, 0.22, { type: "triangle", gain: 0.07, dest: musicBus });
    const b = BASS[i];
    if (b) tone(b, nextTime, 1.6, { type: "sine", gain: 0.07, dest: musicBus });
    if (i % 4 === 2) tone(NOTE.C4, nextTime, 0.08, { type: "sine", gain: 0.03, dest: musicBus });
    nextTime += 0.26;
    step++;
  }
}

function syncMusic() {
  if (typeof window === "undefined") return;
  const should = wantMusic && state.sound && state.music;
  if (should && timer === null) {
    const c = getCtx();
    if (!c) return;
    nextTime = c.currentTime + 0.1;
    step = 0;
    timer = window.setInterval(schedule, 120);
    schedule();
  } else if (!should && timer !== null) {
    window.clearInterval(timer);
    timer = null;
  }
}

if (typeof window !== "undefined") {
  // 瀏覽器要求用戶先點擊才可播放聲音 / browsers need a user gesture before audio can start
  const unlock = () => {
    load();
    if (state.sound) getCtx();
    syncMusic();
  };
  window.addEventListener("pointerdown", unlock, { passive: true });
  window.addEventListener("keydown", unlock, { passive: true });
}

const startMusic = () => {
  wantMusic = true;
  load();
  syncMusic();
};
const stopMusic = () => {
  wantMusic = false;
  syncMusic();
};
const toggleSound = () => {
  load();
  setState({ ...state, sound: !state.sound });
};
const toggleMusic = () => {
  load();
  setState({ ...state, music: !state.music });
};

export function useSound() {
  const s = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    soundOn: s.sound,
    musicOn: s.music,
    toggleSound,
    toggleMusic,
    startMusic,
    stopMusic,
    ...sfx,
  };
}
