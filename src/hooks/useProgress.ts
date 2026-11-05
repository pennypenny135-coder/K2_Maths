"use client";
// localStorage 進度儲存 / Progress stored in localStorage (no login, no backend)
import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { Category, Level } from "@/data/types";
import { emptyProgress, type CategoryTally, type Progress, type SessionRecord } from "@/lib/progressTypes";
import { BADGES, STICKER_POOL, earnedBadgeIds, starsFor, type BadgeDef } from "@/lib/rewards";

export const STORAGE_KEY = "happy-math-playground-v1";
const MAX_SESSIONS = 200;
const MAX_RECENT = 90;

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): string {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

const getServerSnapshot = () => "";

export function parseProgress(raw: string): Progress {
  if (!raw) return emptyProgress();
  try {
    const p = JSON.parse(raw) as Partial<Progress>;
    return { ...emptyProgress(), ...p, version: 1 };
  } catch {
    return emptyProgress();
  }
}

export function readProgress(): Progress {
  return parseProgress(getSnapshot());
}

function writeProgress(p: Progress) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* 私人模式或儲存空間已滿 — 忽略 / private mode or quota: ignore */
  }
  emit();
}

export interface SessionInput {
  level: Level;
  category: Category | "mix";
  total: number;
  correct: number;
  seconds: number;
  bestCombo: number;
  byCategory: Partial<Record<Category, CategoryTally>>;
  questionIds: string[];
}

export interface SessionResult {
  stars: number;
  sticker: string;
  newBadges: BadgeDef[];
  session: SessionRecord;
}

export function saveSession(input: SessionInput): SessionResult {
  const before = readProgress();
  const stars = starsFor(input.correct, input.total);
  const sticker = STICKER_POOL[before.stickers.length % STICKER_POOL.length];
  const session: SessionRecord = {
    id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    date: new Date().toISOString(),
    level: input.level,
    category: input.category,
    total: input.total,
    correct: input.correct,
    seconds: input.seconds,
    stars,
    bestCombo: input.bestCombo,
  };

  const topicStats = { ...before.topicStats };
  for (const [cat, tally] of Object.entries(input.byCategory)) {
    if (!tally) continue;
    const key = `${input.level}:${cat}`;
    const old = topicStats[key] ?? { total: 0, correct: 0 };
    topicStats[key] = { total: old.total + tally.total, correct: old.correct + tally.correct };
  }

  const after: Progress = {
    ...before,
    sessions: [session, ...before.sessions].slice(0, MAX_SESSIONS),
    totalStars: before.totalStars + stars,
    bestCombo: Math.max(before.bestCombo, input.bestCombo),
    stickers: [...before.stickers, sticker],
    recent: [...before.recent, ...input.questionIds].slice(-MAX_RECENT),
    topicStats,
  };
  writeProgress(after);

  const had = earnedBadgeIds(before);
  const newBadges = BADGES.filter((b) => b.earned(after) && !had.has(b.id));
  return { stars, sticker, newBadges, session };
}

export function clearProgress() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  emit();
}

export function useProgress() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const progress = useMemo(() => parseProgress(raw), [raw]);
  const addSession = useCallback((input: SessionInput) => saveSession(input), []);
  const clearAll = useCallback(() => clearProgress(), []);
  return { progress, addSession, clearAll };
}
