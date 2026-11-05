// 規律題用嘅干擾圖形 / Distractor glyphs for pattern questions
import type { Glyph } from "./types";
import { KIND_COLORS } from "./vocab";
import { glyphName, shuffle, type Rng } from "./helpers";

const ALT_POOL: Glyph[] = [
  { kind: "circle", color: "green" },
  { kind: "square", color: "orange" },
  { kind: "triangle", color: "purple" },
  { kind: "star", color: "pink" },
  { kind: "heart", color: "red" },
  { kind: "apple", color: "green" },
  { kind: "fish", color: "purple" },
  { kind: "balloon", color: "yellow" },
  { kind: "flower", color: "orange" },
  { kind: "car", color: "blue" },
];

/** 不同於 exclude 內任何圖形的新圖形 / glyphs different from everything in `exclude` */
export function altGlyphs(exclude: Glyph[], rnd: Rng, n: number): Glyph[] {
  const ex = new Set(exclude.map((g) => glyphName(g).zh));
  return shuffle(ALT_POOL, rnd)
    .filter((g) => !ex.has(glyphName(g).zh))
    .slice(0, n);
}

/** 同一種類但換顏色 / same kind, different color */
export function recolor(g: Glyph): Glyph {
  const opts = KIND_COLORS[g.kind].filter((c) => c !== g.color);
  const all = opts.length ? opts : (["red", "blue", "green"] as const).filter((c) => c !== g.color);
  return { kind: g.kind, color: all[0] };
}
