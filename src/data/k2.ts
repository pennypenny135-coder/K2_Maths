// K2 題庫（4–5 歲）/ K2 question generators (ages 4–5)
import type { Color, Glyph, GlyphKind, ObjectKind, Question, ShapeName } from "./types";
import {
  COLOR_INFO,
  KINDS,
  KIND_COLORS,
  OBJ_INFO,
  SHAPE_FACT,
  SHAPE_NAME,
  cnt,
} from "./vocab";
import {
  cap,
  colorChoice,
  createBank,
  glyphChoice,
  glyphName,
  kindChoice,
  nearNums,
  numCh,
  shuffle,
  visualChoice,
  type TopicInfo,
} from "./helpers";
import { altGlyphs, recolor } from "./pool";

const SIX: Color[] = ["red", "blue", "yellow", "green", "orange", "purple"];
const kcol = (kind: GlyphKind, i: number): Color => KIND_COLORS[kind][i % KIND_COLORS[kind].length];

const T = {
  count: { category: "counting", code: "CNT", topic: "數數 1 至 10", topicEn: "Counting 1 to 10", tags: ["counting", "1-10"] },
  match: { category: "counting", code: "MAT", topic: "數字配對", topicEn: "Matching Numbers", tags: ["numerals", "matching"] },
  more: { category: "comparison", code: "MOR", topic: "多與少", topicEn: "More or Fewer", tags: ["compare", "more-fewer"] },
  size: { category: "comparison", code: "SIZ", topic: "大與小", topicEn: "Big & Small", tags: ["compare", "size"] },
  length: { category: "comparison", code: "LEN", topic: "長與短", topicEn: "Long & Short", tags: ["compare", "length"] },
  order: { category: "comparison", code: "ORD", topic: "簡單排序", topicEn: "Simple Ordering", tags: ["ordering"] },
  shape: { category: "shapes", code: "SHP", topic: "基本形狀", topicEn: "Basic Shapes", tags: ["shapes", "2d"] },
  sort: { category: "comparison", code: "SRT", topic: "顏色與物件分類", topicEn: "Sorting by Color & Type", tags: ["sorting", "color"] },
  abab: { category: "patterns", code: "PAT", topic: "ABAB 規律", topicEn: "ABAB Patterns", tags: ["patterns", "ABAB"] },
  updown: { category: "space", code: "UPD", topic: "上下", topicEn: "Up & Down", tags: ["space", "up-down"] },
  fb: { category: "space", code: "FRB", topic: "前後", topicEn: "Front & Back", tags: ["space", "front-back"] },
  inout: { category: "space", code: "INO", topic: "裡面與外面", topicEn: "Inside & Outside", tags: ["space", "inside-outside"] },
  add: { category: "addsub", code: "ADD", topic: "5 以內加法", topicEn: "Addition within 5", tags: ["addition", "within-5"] },
  sub: { category: "addsub", code: "SUB", topic: "5 以內減法", topicEn: "Subtraction within 5", tags: ["subtraction", "within-5"] },
} satisfies Record<string, TopicInfo>;

function perms3(a: Color[]): Color[][] {
  const [x, y, z] = a;
  return [
    [x, y, z],
    [x, z, y],
    [y, x, z],
    [y, z, x],
    [z, x, y],
    [z, y, x],
  ];
}

const seqChoice = (cols: Color[]) => ({
  zh: cols.map((c) => COLOR_INFO[c].dot + COLOR_INFO[c].zh).join(" → "),
  en: cols.map((c) => COLOR_INFO[c].dot + COLOR_INFO[c].en).join(" → "),
});

const fourKinds = (s: number): ObjectKind[] => [0, 1, 2, 3].map((j) => KINDS[(s + j * 2) % KINDS.length]);

export function buildK2(): Question[] {
  const { rnd, add, list } = createBank("K2", 20250601);

  // ===== 1. 數數 1–10（14）=====
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 2, 4, 6, 8].forEach((n, i) => {
    const kind = KINDS[(i < 9 ? i : i + 4) % KINDS.length];
    const o = OBJ_INFO[kind];
    const color = kcol(kind, i);
    add(T.count, {
      d: n <= 5 ? 1 : 2,
      qz: `有幾${o.m}${o.zh}？`,
      qe: `How many ${o.pl} are there?`,
      v: { imageType: "objects", imageConfig: { kind, count: n, color } },
      correct: numCh(n),
      wrongs: nearNums(n, 1, 10, rnd).map(numCh),
      ez: `一個一個點算，一共有 ${n} ${o.m}${o.zh}。`,
      ee: `Count one by one. There ${n === 1 ? "is" : "are"} ${cnt(n, o)}.`,
    });
  });

  // ===== 2. 數字配對（8）=====
  [2, 3, 4, 5, 6, 7, 8, 9].forEach((n, i) => {
    const kind = KINDS[(i + 2) % KINDS.length];
    const color = kcol(kind, i);
    const vis = (c: number) =>
      visualChoice({ imageType: "objects", imageConfig: { kind, count: c, color } });
    add(T.match, {
      d: n <= 5 ? 1 : 2,
      qz: `哪一組和數字 ${n} 一樣多？`,
      qe: `Which group has the same amount as the number ${n}?`,
      v: { imageType: "numberRow", imageConfig: { items: [n] } },
      correct: vis(n),
      wrongs: nearNums(n, 1, 10, rnd).map(vis),
      label: true,
      ez: `數字 ${n} 就是 ${n} 個，數一數哪一組有 ${n} 個${OBJ_INFO[kind].zh}。`,
      ee: `The number ${n} means ${cnt(n, OBJ_INFO[kind])}. Find the group with exactly ${n}.`,
    });
  });

  // ===== 3. 多與少（8）=====
  for (let i = 0; i < 8; i++) {
    const kinds = fourKinds(i + 1);
    const counts = shuffle([1, 2, 3, 4, 5, 6, 7], rnd).slice(0, 4);
    const most = i < 4;
    const target = counts.indexOf(most ? Math.max(...counts) : Math.min(...counts));
    const o = OBJ_INFO[kinds[target]];
    add(T.more, {
      d: 2,
      qz: most ? "哪一種最多？" : "哪一種最少？",
      qe: most ? "Which one has the most?" : "Which one has the fewest?",
      v: {
        imageType: "objectGroups",
        imageConfig: { op: "vs", groups: kinds.map((k, j) => ({ kind: k, count: counts[j] })) },
      },
      correct: kindChoice(kinds[target]),
      wrongs: kinds.filter((_, j) => j !== target).map(kindChoice),
      ez: `${o.zh}有 ${counts[target]} 個，${most ? "最多" : "最少"}。`,
      ee: `There ${counts[target] === 1 ? "is" : "are"} ${cnt(counts[target], o)}. That is the ${most ? "most" : "fewest"}.`,
    });
  }

  // ===== 4. 大與小（6）=====
  (["apple", "star", "fish", "balloon", "car", "heart"] as ObjectKind[]).forEach((kind, i) => {
    const cols = shuffle(SIX, rnd).slice(0, 4);
    const sizes = shuffle([0.55, 0.8, 1.05, 1.35], rnd);
    const big = i < 3;
    const t = sizes.indexOf(big ? 1.35 : 0.55);
    const glyphs: Glyph[] = cols.map((c, j) => ({ kind, color: c, size: sizes[j] }));
    const nm = glyphName(glyphs[t]);
    add(T.size, {
      d: 1,
      qz: big ? "哪一個最大？" : "哪一個最小？",
      qe: big ? "Which one is the biggest?" : "Which one is the smallest?",
      v: { imageType: "glyphs", imageConfig: { glyphs, align: "bottom" } },
      correct: colorChoice(cols[t]),
      wrongs: cols.filter((_, j) => j !== t).map(colorChoice),
      ez: `${nm.zh}${big ? "最大" : "最小"}。`,
      ee: `The ${nm.en.toLowerCase()} is the ${big ? "biggest" : "smallest"}.`,
    });
  });

  // ===== 5. 長與短（6）=====
  for (let i = 0; i < 6; i++) {
    const cols = shuffle(SIX, rnd).slice(0, 4);
    const lens = shuffle([2, 4, 6, 8, 10], rnd).slice(0, 4);
    const longest = i < 3;
    const t = lens.indexOf(longest ? Math.max(...lens) : Math.min(...lens));
    add(T.length, {
      d: 1,
      qz: longest ? "哪一條最長？" : "哪一條最短？",
      qe: longest ? "Which bar is the longest?" : "Which bar is the shortest?",
      v: { imageType: "lengthBars", imageConfig: { bars: cols.map((c, j) => ({ color: c, length: lens[j] })) } },
      correct: colorChoice(cols[t]),
      wrongs: cols.filter((_, j) => j !== t).map(colorChoice),
      ez: `${COLOR_INFO[cols[t]].zh}那條${longest ? "最長" : "最短"}。`,
      ee: `The ${COLOR_INFO[cols[t]].en.toLowerCase()} bar is the ${longest ? "longest" : "shortest"}.`,
    });
  }

  // ===== 6. 簡單排序（6）=====
  const orderPlans: { mode: "size" | "len"; asc: boolean; kind: ObjectKind }[] = [
    { mode: "size", asc: true, kind: "apple" },
    { mode: "size", asc: true, kind: "fish" },
    { mode: "size", asc: false, kind: "balloon" },
    { mode: "len", asc: true, kind: "apple" },
    { mode: "len", asc: true, kind: "apple" },
    { mode: "len", asc: false, kind: "apple" },
  ];
  orderPlans.forEach((p) => {
    const cols = shuffle(SIX, rnd).slice(0, 3);
    const vals = shuffle([1, 2, 3], rnd);
    const sorted = cols
      .map((c, j) => ({ c, v: vals[j] }))
      .sort((a, b) => (p.asc ? a.v - b.v : b.v - a.v))
      .map((x) => x.c);
    const sizeMap = [0.6, 0.95, 1.35];
    const v =
      p.mode === "size"
        ? ({
            imageType: "glyphs",
            imageConfig: {
              glyphs: cols.map((c, j) => ({ kind: p.kind, color: c, size: sizeMap[vals[j] - 1] })),
              align: "bottom",
            },
          } as const)
        : ({
            imageType: "lengthBars",
            imageConfig: { bars: cols.map((c, j) => ({ color: c, length: vals[j] * 3 })) },
          } as const);
    const wrongs = perms3(cols)
      .filter((pm) => pm.join() !== sorted.join())
      .map(seqChoice);
    const wz = p.mode === "size" ? (p.asc ? "由小到大" : "由大到小") : p.asc ? "由短到長" : "由長到短";
    const we =
      p.mode === "size"
        ? p.asc ? "small to big" : "big to small"
        : p.asc ? "short to long" : "long to short";
    add(T.order, {
      d: 2,
      qz: `${wz}排，哪個次序啱？`,
      qe: `Which order goes from ${we}?`,
      v,
      correct: seqChoice(sorted),
      wrongs: shuffle(wrongs, rnd),
      ez: `${wz}排：${sorted.map((c) => COLOR_INFO[c].zh).join("、")}。`,
      ee: `From ${we}: ${sorted.map((c) => COLOR_INFO[c].en.toLowerCase()).join(", ")}.`,
    });
  });

  // ===== 7. 基本形狀（16）=====
  const S5: ShapeName[] = ["circle", "square", "triangle", "star", "heart"];
  const idList: ShapeName[] = ["circle", "square", "triangle", "star", "heart", "circle", "triangle", "heart"];
  idList.forEach((s, i) => {
    const color = KIND_COLORS[s][(i < 5 ? 0 : 1) % KIND_COLORS[s].length];
    add(T.shape, {
      d: 1,
      qz: "這是什麼形狀？",
      qe: "What shape is this?",
      v: { imageType: "shape", imageConfig: { shape: s, color } },
      correct: { zh: SHAPE_NAME[s].zh, en: SHAPE_NAME[s].en },
      wrongs: S5.filter((x) => x !== s).map((x) => ({ zh: SHAPE_NAME[x].zh, en: SHAPE_NAME[x].en })),
      ez: `這是${SHAPE_NAME[s].zh}。${SHAPE_FACT[s].zh}`,
      ee: `This is a ${SHAPE_NAME[s].en.toLowerCase()}. ${SHAPE_FACT[s].en}`,
    });
  });
  const findList: ShapeName[] = ["circle", "square", "triangle", "star", "heart", "square", "star", "triangle"];
  findList.forEach((s, i) => {
    const color = SIX[(i * 2 + 1) % SIX.length];
    const vis = (x: ShapeName) => visualChoice({ imageType: "shape", imageConfig: { shape: x, color } });
    add(T.shape, {
      d: 1,
      qz: `哪一個是${SHAPE_NAME[s].zh}？`,
      qe: `Which one is a ${SHAPE_NAME[s].en.toLowerCase()}?`,
      v: { imageType: "emoji", imageConfig: { emoji: "🔎" } },
      correct: vis(s),
      wrongs: S5.filter((x) => x !== s).map(vis),
      label: true,
      ez: SHAPE_FACT[s].zh,
      ee: SHAPE_FACT[s].en,
    });
  });

  // ===== 8. 顏色與物件分類（10）=====
  // 8a 顏色分類
  (["balloon", "block", "flower", "car", "star"] as ObjectKind[]).forEach((kind, i) => {
    const cols = shuffle(KIND_COLORS[kind], rnd).slice(0, 3);
    const counts = shuffle([1, 2, 3, 4, 5], rnd).slice(0, 3);
    const t = i % 3;
    const o = OBJ_INFO[kind];
    const glyphs = shuffle(
      cols.flatMap((c, j) => Array.from({ length: counts[j] }, () => ({ kind, color: c }) as Glyph)),
      rnd,
    );
    add(T.sort, {
      d: 2,
      qz: `有幾${o.m}${COLOR_INFO[cols[t]].zh}${o.zh}？`,
      qe: `How many ${COLOR_INFO[cols[t]].en.toLowerCase()} ${o.pl} are there?`,
      v: { imageType: "glyphs", imageConfig: { glyphs } },
      correct: numCh(counts[t]),
      wrongs: nearNums(counts[t], 1, 6, rnd).map(numCh),
      ez: `只數${COLOR_INFO[cols[t]].zh}的${o.zh}，有 ${counts[t]} ${o.m}。`,
      ee: `Count only the ${COLOR_INFO[cols[t]].en.toLowerCase()} ones: ${counts[t]}.`,
    });
  });
  // 8b 物件分類
  const typeSets: ObjectKind[][] = [
    ["apple", "banana", "fish"],
    ["star", "car", "balloon"],
    ["block", "heart", "flower"],
  ];
  typeSets.forEach((ks, i) => {
    const counts = shuffle([2, 3, 4, 5], rnd).slice(0, 3);
    const t = i;
    const o = OBJ_INFO[ks[t]];
    const glyphs = shuffle(
      ks.flatMap((k, j) => Array.from({ length: counts[j] }, () => ({ kind: k }) as Glyph)),
      rnd,
    );
    add(T.sort, {
      d: 2,
      qz: `有幾${o.m}${o.zh}？`,
      qe: `How many ${o.pl} are there?`,
      v: { imageType: "glyphs", imageConfig: { glyphs } },
      correct: numCh(counts[t]),
      wrongs: nearNums(counts[t], 1, 6, rnd).map(numCh),
      ez: `把${o.zh}分出來數，有 ${counts[t]} ${o.m}。`,
      ee: `Sort out the ${o.pl} and count: ${counts[t]}.`,
    });
  });
  // 8c 哪一種最多
  [
    ["apple", "fish", "car", "star"],
    ["banana", "balloon", "block", "heart"],
  ].forEach((ks) => {
    const kinds = ks as ObjectKind[];
    const counts = shuffle([1, 2, 3, 5], rnd);
    const t = counts.indexOf(5);
    const glyphs = shuffle(
      kinds.flatMap((k, j) => Array.from({ length: counts[j] }, () => ({ kind: k }) as Glyph)),
      rnd,
    );
    add(T.sort, {
      d: 2,
      qz: "哪一種物件最多？",
      qe: "Which kind of thing is the most?",
      v: { imageType: "glyphs", imageConfig: { glyphs } },
      correct: kindChoice(kinds[t]),
      wrongs: kinds.filter((_, j) => j !== t).map(kindChoice),
      ez: `把相同的物件放在一起，${OBJ_INFO[kinds[t]].zh}最多。`,
      ee: `Group the same things together. There are the most ${OBJ_INFO[kinds[t]].pl}.`,
    });
  });

  // ===== 9. ABAB 規律（10）=====
  const pairs: [Glyph, Glyph][] = [
    [{ kind: "circle", color: "red" }, { kind: "circle", color: "blue" }],
    [{ kind: "circle", color: "yellow" }, { kind: "circle", color: "green" }],
    [{ kind: "square", color: "pink" }, { kind: "square", color: "orange" }],
    [{ kind: "circle", color: "purple" }, { kind: "circle", color: "orange" }],
    [{ kind: "triangle", color: "red" }, { kind: "triangle", color: "blue" }],
    [{ kind: "star", color: "yellow" }, { kind: "star", color: "pink" }],
    [{ kind: "heart", color: "pink" }, { kind: "heart", color: "purple" }],
    [{ kind: "apple", color: "red" }, { kind: "banana", color: "yellow" }],
    [{ kind: "fish", color: "blue" }, { kind: "star", color: "yellow" }],
    [{ kind: "balloon", color: "red" }, { kind: "balloon", color: "blue" }],
  ];
  const shown = [5, 4, 5, 6, 5, 4, 5, 4, 6, 5];
  pairs.forEach(([a, b], i) => {
    const len = shown[i];
    const seq = Array.from({ length: len }, (_, j) => (j % 2 === 0 ? a : b));
    const ans = len % 2 === 0 ? a : b;
    const other = len % 2 === 0 ? b : a;
    const wrongs = [other, recolor(ans), ...altGlyphs([a, b], rnd, 2)].map(glyphChoice);
    const nm = glyphName(ans);
    add(T.abab, {
      d: len === 5 ? 1 : 2,
      qz: "下一個是哪一個？",
      qe: "What comes next?",
      v: { imageType: "pattern", imageConfig: { sequence: seq, blanks: 1 } },
      correct: glyphChoice(ans),
      wrongs,
      ez: `規律是 ${glyphName(a).zh}、${glyphName(b).zh} 一直重複，下一個是${nm.zh}。`,
      ee: `The pattern repeats ${glyphName(a).en.toLowerCase()}, ${glyphName(b).en.toLowerCase()}. Next is the ${nm.en.toLowerCase()}.`,
    });
  });

  // ===== 10. 上下 / 前後 / 裡外（各 5）=====
  for (let i = 0; i < 5; i++) {
    const kinds = fourKinds(i * 3 + 1);
    const top = i < 3;
    const t = top ? 0 : 3;
    const o = OBJ_INFO[kinds[t]];
    add(T.updown, {
      d: 1,
      qz: top ? "哪一個在最上面？" : "哪一個在最下面？",
      qe: top ? "Which one is at the very top?" : "Which one is at the very bottom?",
      v: { imageType: "position", imageConfig: { scene: "updown", items: kinds.map((k) => ({ kind: k })) } },
      correct: kindChoice(kinds[t]),
      wrongs: kinds.filter((_, j) => j !== t).map(kindChoice),
      ez: `${o.zh}在最${top ? "上" : "下"}面。`,
      ee: `The ${o.en} is at the ${top ? "top" : "bottom"}.`,
    });
  }
  for (let i = 0; i < 5; i++) {
    const kinds = fourKinds(i * 3 + 2);
    const front = i < 3;
    const t = front ? 3 : 0;
    const o = OBJ_INFO[kinds[t]];
    add(T.fb, {
      d: 1,
      qz: front ? "哪一個排在最前面？（最接近旗子）" : "哪一個排在最後面？（離旗子最遠）",
      qe: front ? "Which one is at the front? (closest to the flag)" : "Which one is at the back? (farthest from the flag)",
      v: { imageType: "position", imageConfig: { scene: "frontback", items: kinds.map((k) => ({ kind: k })) } },
      correct: kindChoice(kinds[t]),
      wrongs: kinds.filter((_, j) => j !== t).map(kindChoice),
      ez: `${o.zh}${front ? "最接近旗子，排在最前面" : "離旗子最遠，排在最後面"}。`,
      ee: `The ${o.en} is ${front ? "closest to the flag, so it is at the front" : "farthest from the flag, so it is at the back"}.`,
    });
  }
  for (let i = 0; i < 5; i++) {
    const kinds = fourKinds(i * 3 + 3);
    const askInside = i < 3;
    const t = i % 4;
    const inside = kinds.map((_, j) => (askInside ? j === t : j !== t));
    const o = OBJ_INFO[kinds[t]];
    add(T.inout, {
      d: 1,
      qz: askInside ? "哪一個在盒子裡面？" : "哪一個在盒子外面？",
      qe: askInside ? "Which one is inside the box?" : "Which one is outside the box?",
      v: { imageType: "position", imageConfig: { scene: "inout", items: kinds.map((k) => ({ kind: k })), inside } },
      correct: kindChoice(kinds[t]),
      wrongs: kinds.filter((_, j) => j !== t).map(kindChoice),
      ez: `${o.zh}在盒子${askInside ? "裡面" : "外面"}。`,
      ee: `The ${o.en} is ${askInside ? "inside" : "outside"} the box.`,
    });
  }

  // ===== 11. 5 以內加法（8）=====
  (
    [
      [1, 1],
      [1, 2],
      [2, 2],
      [1, 3],
      [3, 1],
      [2, 3],
      [1, 4],
      [3, 2],
    ] as [number, number][]
  ).forEach(([a, b], i) => {
    const kind = KINDS[(i * 2 + 1) % KINDS.length];
    const o = OBJ_INFO[kind];
    const color = kcol(kind, i);
    const sum = a + b;
    add(T.add, {
      d: sum <= 3 ? 1 : 2,
      qz: `有${a}${o.m}${o.zh}，再加${b}${o.m}，一共有幾${o.m}？`,
      qe: `There ${a === 1 ? "is" : "are"} ${cnt(a, o)}. ${b} more ${b === 1 ? "comes" : "come"}. How many in all?`,
      v: {
        imageType: "objectGroups",
        imageConfig: { op: "+", groups: [{ kind, count: a, color }, { kind, count: b, color }] },
      },
      correct: numCh(sum),
      wrongs: nearNums(sum, 1, 6, rnd).map(numCh),
      ez: `${a} 加 ${b} 等於 ${sum}。把兩邊合起來數一數。`,
      ee: `${a} plus ${b} makes ${sum}. Put both groups together and count.`,
    });
  });

  // ===== 12. 5 以內減法（8）=====
  (
    [
      [2, 1],
      [3, 1],
      [3, 2],
      [4, 1],
      [4, 2],
      [4, 3],
      [5, 2],
      [5, 3],
    ] as [number, number][]
  ).forEach(([a, b], i) => {
    const kind = KINDS[(i * 2 + 4) % KINDS.length];
    const o = OBJ_INFO[kind];
    const color = kcol(kind, i + 1);
    const left = a - b;
    add(T.sub, {
      d: a <= 3 ? 1 : 2,
      qz: `有${a}${o.m}${o.zh}，拿走${b}${o.m}，剩下幾${o.m}？`,
      qe: `There ${a === 1 ? "is" : "are"} ${cnt(a, o)}. ${b} ${b === 1 ? "is" : "are"} taken away. How many are left?`,
      v: { imageType: "objects", imageConfig: { kind, count: a, color, crossed: b } },
      correct: numCh(left),
      wrongs: nearNums(left, 0, 5, rnd).map(numCh),
      ez: `${a} 減 ${b} 等於 ${left}。看看沒有被劃走的${o.zh}。`,
      ee: `${a} minus ${b} leaves ${left}. Count the ones that are not crossed out.`,
    });
  });

  void cap;
  return list;
}
