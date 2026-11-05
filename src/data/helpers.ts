// 題庫產生輔助工具 / Helpers for building the question bank
import type { Category, Choice, Color, Glyph, GlyphKind, Level, Question, VisualSpec } from "./types";
import { COLOR_INFO, DEFAULT_COLOR, NUM_EN, OBJ_INFO } from "./vocab";

export type Rng = () => number;

/** 固定種子的亂數，令題庫每次建置都一樣 / seeded RNG so the bank is stable */
export function makeRng(seed: number): Rng {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(arr: readonly T[], rnd: Rng): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** 取接近 n 的錯誤數字作干擾選項 / near numbers as plausible distractors */
export function nearNums(n: number, min: number, max: number, rnd: Rng, count = 3): number[] {
  const cands: number[] = [];
  for (let d = 1; d <= max - min; d++) {
    if (n - d >= min) cands.push(n - d);
    if (n + d <= max) cands.push(n + d);
  }
  const near = cands.slice(0, Math.max(count + 1, 5));
  return shuffle(near, rnd).slice(0, count);
}

// ---------- Choice builders ----------

export const numCh = (n: number): Choice => ({ zh: String(n), en: NUM_EN[n] ?? String(n) });

export const kindChoice = (k: GlyphKind): Choice => ({
  zh: OBJ_INFO[k].zh,
  en: cap(OBJ_INFO[k].en),
});

export const colorChoice = (c: Color): Choice => ({
  zh: COLOR_INFO[c].zh,
  en: COLOR_INFO[c].en,
  swatch: COLOR_INFO[c].hex,
});

export function glyphName(g: Glyph): { zh: string; en: string } {
  const c = COLOR_INFO[g.color ?? DEFAULT_COLOR[g.kind]];
  const o = OBJ_INFO[g.kind];
  return { zh: `${c.zh}${o.zh}`, en: `${c.en} ${o.en}` };
}

/** 圖形選項（附名稱） / glyph shown as a choice with its name */
export function glyphChoice(g: Glyph): Choice {
  const n = glyphName(g);
  return { zh: n.zh, en: n.en, visual: { imageType: "glyphs", imageConfig: { glyphs: [g] } } };
}

/** 純圖形選項，文字由 label 自動補上 / visual-only choice, label added automatically */
export const visualChoice = (visual: VisualSpec): Choice => ({ zh: "", en: "", visual });

// ---------- Bank builder ----------

export interface TopicInfo {
  category: Category;
  code: string;
  topic: string;
  topicEn: string;
  tags: string[];
}

export interface Spec {
  d: 1 | 2 | 3;
  qz: string;
  qe: string;
  v: VisualSpec;
  correct: Choice;
  wrongs: Choice[];
  ez: string;
  ee: string;
  /** 為圖形選項加上「第 N 個」標籤 / add "No. N" labels to visual choices */
  label?: boolean;
}

export function createBank(level: Level, seed: number) {
  const rnd = makeRng(seed);
  const list: Question[] = [];
  const counters: Record<string, number> = {};

  function add(info: TopicInfo, s: Spec) {
    counters[info.code] = (counters[info.code] ?? 0) + 1;
    const id = `${level}-${info.code}-${String(counters[info.code]).padStart(3, "0")}`;

    const seen = new Set<string>([JSON.stringify(s.correct)]);
    const wrongs: Choice[] = [];
    for (const w of s.wrongs) {
      const key = JSON.stringify(w);
      if (!seen.has(key)) {
        seen.add(key);
        wrongs.push(w);
      }
    }
    if (wrongs.length < 3) throw new Error(`Not enough distractors for ${id}`);

    const all = shuffle(
      [{ c: s.correct, ok: true }, ...wrongs.slice(0, 3).map((c) => ({ c, ok: false }))],
      rnd,
    );
    let choices = all.map((x) => x.c);
    if (s.label) {
      choices = choices.map((c, i) => ({ ...c, zh: `第${i + 1}個`, en: `No. ${i + 1}` }));
    }

    const q = {
      id,
      level,
      category: info.category,
      topic: info.topic,
      topicEn: info.topicEn,
      difficulty: s.d,
      questionZh: s.qz,
      questionEn: s.qe,
      ...s.v,
      choices,
      correctIndex: all.findIndex((x) => x.ok),
      explanationZh: s.ez,
      explanationEn: s.ee,
      tags: info.tags,
    } as Question;
    list.push(q);
  }

  return { rnd, add, list };
}
