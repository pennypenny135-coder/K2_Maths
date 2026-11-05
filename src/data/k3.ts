// K3 題庫（5–6 歲）/ K3 question generators (ages 5–6)
import type { Color, Glyph, GlyphKind, ObjectKind, Question, ShapeName, SolidName } from "./types";
import {
  COLOR_INFO,
  KINDS,
  KIND_COLORS,
  NUM_EN,
  NUM_ZH,
  OBJ_INFO,
  SHAPE_FACT,
  SHAPE_NAME,
  SOLID_FACT,
  SOLID_NAME,
  cnt,
} from "./vocab";
import {
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

const kcol = (kind: GlyphKind, i: number): Color => KIND_COLORS[kind][i % KIND_COLORS[kind].length];

const T = {
  count20: { category: "counting", code: "C20", topic: "數數 1 至 20", topicEn: "Counting 1 to 20", tags: ["counting", "1-20"] },
  read: { category: "counting", code: "RD", topic: "認讀 11 至 20", topicEn: "Reading 11 to 20", tags: ["numerals", "11-20"] },
  qty: { category: "counting", code: "QTY", topic: "11 至 20 的數量", topicEn: "Quantities 11 to 20", tags: ["quantity", "11-20", "tens-ones"] },
  seq: { category: "counting", code: "SEQ", topic: "順序數、倒數、相鄰數", topicEn: "Order, Countdown & Neighbors", tags: ["sequence", "backward", "neighbors"] },
  oe: { category: "counting", code: "OE", topic: "單數與雙數", topicEn: "Odd & Even", tags: ["odd", "even"] },
  add: { category: "addsub", code: "AD10", topic: "10 以內加法", topicEn: "Addition within 10", tags: ["addition", "within-10"] },
  sub: { category: "addsub", code: "SB10", topic: "10 以內減法", topicEn: "Subtraction within 10", tags: ["subtraction", "within-10"] },
  word: { category: "addsub", code: "WRD", topic: "簡單應用題", topicEn: "Word Problems", tags: ["word-problem"] },
  sh2: { category: "shapes", code: "SH2", topic: "更多形狀", topicEn: "More Shapes", tags: ["shapes", "rectangle", "oval", "diamond"] },
  solid: { category: "shapes", code: "SLD", topic: "立體形狀", topicEn: "3D Shapes", tags: ["shapes", "3d"] },
  abba: { category: "patterns", code: "ABBA", topic: "ABBA 規律", topicEn: "ABBA Patterns", tags: ["patterns", "ABBA"] },
  aab: { category: "patterns", code: "AAB", topic: "AAB 規律", topicEn: "AAB Patterns", tags: ["patterns", "AAB"] },
  abc: { category: "patterns", code: "ABC", topic: "ABC 規律", topicEn: "ABC Patterns", tags: ["patterns", "ABC"] },
  lr: { category: "space", code: "LR", topic: "左與右", topicEn: "Left & Right", tags: ["space", "left-right"] },
  ufb: { category: "space", code: "UFB", topic: "上下與前後", topicEn: "Up/Down & Front/Back", tags: ["space", "up-down", "front-back"] },
  clock: { category: "timemoney", code: "CLK", topic: "整點時鐘", topicEn: "O'clock Time", tags: ["time", "o'clock"] },
  money: { category: "timemoney", code: "MNY", topic: "認識錢幣", topicEn: "Hong Kong Money", tags: ["money", "coins", "HKD"] },
  chart: { category: "comparison", code: "CHT", topic: "簡單圖表", topicEn: "Simple Bar Charts", tags: ["chart", "most-fewest"] },
} satisfies Record<string, TopicInfo>;

const fourKinds = (s: number): ObjectKind[] => [0, 1, 2, 3].map((j) => KINDS[(s + j * 2) % KINDS.length]);

const plural = (n: number, o: { en: string; pl: string }) => (n === 1 ? o.en : o.pl);

export function buildK3(): Question[] {
  const { rnd, add, list } = createBank("K3", 20250602);

  // ===== 1. 數數 1–20（8）=====
  [7, 9, 12, 13, 15, 16, 18, 20].forEach((n, i) => {
    const kind = KINDS[(i * 2 + 1) % KINDS.length];
    const o = OBJ_INFO[kind];
    add(T.count20, {
      d: n <= 10 ? 1 : 2,
      qz: `有幾${o.m}${o.zh}？`,
      qe: `How many ${o.pl} are there?`,
      v: { imageType: "objects", imageConfig: { kind, count: n, color: kcol(kind, i) } },
      correct: numCh(n),
      wrongs: nearNums(n, 1, 20, rnd).map(numCh),
      ez: `分行點算，不要漏掉。一共有 ${n} ${o.m}${o.zh}。`,
      ee: `Count row by row without missing any. There are ${cnt(n, o)}.`,
    });
  });

  // ===== 2. 認讀 11–20（6）=====
  [11, 13, 14, 16, 17, 19].forEach((n) => {
    add(T.read, {
      d: 2,
      qz: "這個數字怎樣讀？",
      qe: "How do you read this number?",
      v: { imageType: "numberRow", imageConfig: { items: [n] } },
      correct: { zh: NUM_ZH[n], en: NUM_EN[n] },
      wrongs: nearNums(n, 11, 20, rnd).map((m) => ({ zh: NUM_ZH[m], en: NUM_EN[m] })),
      ez: `${n} 讀作「${NUM_ZH[n]}」。`,
      ee: `${n} is read as "${NUM_EN[n]}".`,
    });
  });

  // ===== 3. 11–20 的數量（6）=====
  [12, 13, 15, 16, 18, 19].forEach((n, i) => {
    const kind = KINDS[(i * 2 + 3) % KINDS.length];
    const o = OBJ_INFO[kind];
    const r = n - 10;
    add(T.qty, {
      d: 2,
      qz: `10 ${o.m}${o.zh}再加 ${r} ${o.m}，一共有幾${o.m}？`,
      qe: `${cnt(10, o)} and ${cnt(r, o)} more. How many in all?`,
      v: {
        imageType: "objectGroups",
        imageConfig: {
          op: "+",
          groups: [
            { kind, count: 10, color: kcol(kind, 0) },
            { kind, count: r, color: kcol(kind, 1) },
          ],
        },
      },
      correct: numCh(n),
      wrongs: nearNums(n, 10, 20, rnd).map(numCh),
      ez: `10 加 ${r} 等於 ${n}。`,
      ee: `10 plus ${r} makes ${n}.`,
    });
  });

  // ===== 4. 順序數、倒數、相鄰數（12）=====
  type SeqPlan = { qz: string; qe: string; items: (number | "?")[]; ans: number; ez: string; ee: string };
  const seqPlans: SeqPlan[] = [];
  [8, 13, 17].forEach((x) =>
    seqPlans.push({
      qz: `${x} 後面一個數是幾？`,
      qe: `What number comes after ${x}?`,
      items: [x, "?"],
      ans: x + 1,
      ez: `數到 ${x}，下一個就是 ${x + 1}。`,
      ee: `After ${x} comes ${x + 1}.`,
    }),
  );
  [5, 11, 19].forEach((x) =>
    seqPlans.push({
      qz: `${x} 前面一個數是幾？`,
      qe: `What number comes before ${x}?`,
      items: ["?", x],
      ans: x - 1,
      ez: `${x} 的前面是 ${x - 1}。`,
      ee: `Before ${x} comes ${x - 1}.`,
    }),
  );
  [4, 12, 17].forEach((a) =>
    seqPlans.push({
      qz: `${a} 和 ${a + 2} 中間是幾？`,
      qe: `What number is between ${a} and ${a + 2}?`,
      items: [a, "?", a + 2],
      ans: a + 1,
      ez: `${a}、${a + 1}、${a + 2}，中間是 ${a + 1}。`,
      ee: `${a}, ${a + 1}, ${a + 2}. The number in the middle is ${a + 1}.`,
    }),
  );
  (
    [
      { items: [10, 9, "?", 7], ans: 8 },
      { items: [15, 14, 13, "?"], ans: 12 },
      { items: [20, 19, "?", 17], ans: 18 },
    ] as { items: (number | "?")[]; ans: number }[]
  ).forEach((p) =>
    seqPlans.push({
      qz: "倒數時，「？」是幾？",
      qe: "Counting backward, what number is missing?",
      items: p.items,
      ans: p.ans,
      ez: `倒數是每次少 1，缺少的是 ${p.ans}。`,
      ee: `Counting backward goes down by 1. The missing number is ${p.ans}.`,
    }),
  );
  seqPlans.forEach((p) =>
    add(T.seq, {
      d: 2,
      qz: p.qz,
      qe: p.qe,
      v: { imageType: "numberRow", imageConfig: { items: p.items } },
      correct: numCh(p.ans),
      wrongs: nearNums(p.ans, 1, 20, rnd).map(numCh),
      ez: p.ez,
      ee: p.ee,
    }),
  );

  // ===== 5. 單數與雙數（6）=====
  (
    [
      { even: true, ans: 4, ex: 6 },
      { even: false, ans: 5, ex: 7 },
      { even: true, ans: 8, ex: 2 },
      { even: false, ans: 9, ex: 3 },
      { even: true, ans: 6, ex: 10 },
      { even: false, ans: 7, ex: 9 },
    ] as { even: boolean; ans: number; ex: number }[]
  ).forEach((p, i) => {
    const kind = KINDS[(i * 2 + 2) % KINDS.length];
    const color = kcol(kind, i);
    const vis = (n: number) => ({
      zh: String(n),
      en: NUM_EN[n],
      visual: { imageType: "objects", imageConfig: { kind, count: n, color, layout: "pairs" } },
    }) as const;
    const opposite = shuffle(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((n) => (n % 2 === 0) !== p.even),
      rnd,
    ).slice(0, 3);
    add(T.oe, {
      d: 3,
      qz: p.even
        ? "哪個數字是雙數？（雙數可以兩個兩個剛好配成一對）"
        : "哪個數字是單數？（單數配對後會剩下 1 個）",
      qe: p.even
        ? "Which number is even? (An even number can be paired up with none left over)"
        : "Which number is odd? (An odd number always has 1 left over)",
      v: { imageType: "objects", imageConfig: { kind, count: p.ex, color, layout: "pairs" } },
      correct: vis(p.ans),
      wrongs: opposite.map(vis),
      ez: p.even
        ? `${p.ans} 個可以兩個兩個配對，沒有剩下，所以 ${p.ans} 是雙數。`
        : `${p.ans} 個配對後會剩下 1 個，所以 ${p.ans} 是單數。`,
      ee: p.even
        ? `${p.ans} can be paired up with none left, so ${p.ans} is even.`
        : `${p.ans} has 1 left over after pairing, so ${p.ans} is odd.`,
    });
  });

  // ===== 6. 10 以內加法（6）=====
  (
    [
      [3, 4],
      [5, 2],
      [6, 3],
      [4, 4],
      [7, 2],
      [5, 5],
    ] as [number, number][]
  ).forEach(([a, b], i) => {
    const kind = KINDS[(i * 2 + 5) % KINDS.length];
    const sum = a + b;
    add(T.add, {
      d: 2,
      qz: `${a} + ${b} = ？`,
      qe: `What is ${a} plus ${b}?`,
      v: {
        imageType: "objectGroups",
        imageConfig: {
          op: "+",
          groups: [
            { kind, count: a, color: kcol(kind, 0) },
            { kind, count: b, color: kcol(kind, 1) },
          ],
        },
      },
      correct: numCh(sum),
      wrongs: nearNums(sum, 1, 10, rnd).map(numCh),
      ez: `${a} 加 ${b} 等於 ${sum}。`,
      ee: `${a} plus ${b} equals ${sum}.`,
    });
  });

  // ===== 7. 10 以內減法（6）=====
  (
    [
      [7, 3],
      [9, 4],
      [10, 6],
      [8, 5],
      [6, 2],
      [10, 3],
    ] as [number, number][]
  ).forEach(([a, b], i) => {
    const kind = KINDS[(i * 2 + 6) % KINDS.length];
    const left = a - b;
    add(T.sub, {
      d: 2,
      qz: `${a} − ${b} = ？`,
      qe: `What is ${a} minus ${b}?`,
      v: { imageType: "objects", imageConfig: { kind, count: a, color: kcol(kind, i), crossed: b } },
      correct: numCh(left),
      wrongs: nearNums(left, 0, 10, rnd).map(numCh),
      ez: `${a} 減 ${b} 等於 ${left}。`,
      ee: `${a} minus ${b} equals ${left}.`,
    });
  });

  // ===== 8. 簡單應用題（8）=====
  const words: { kind: ObjectKind; a: number; b: number; plus: boolean; zh: string; en: string }[] = [
    { kind: "apple", a: 3, b: 2, plus: true, zh: "小美有 3 個蘋果，再買 2 個。她現在有幾個蘋果？", en: "Amy has 3 apples and buys 2 more. How many apples does she have?" },
    { kind: "fish", a: 4, b: 3, plus: true, zh: "阿明有 4 條魚，朋友再送他 3 條。他一共有幾條魚？", en: "Ming has 4 fish. A friend gives him 3 more. How many fish does he have now?" },
    { kind: "balloon", a: 5, b: 3, plus: true, zh: "小欣有 5 個氣球，又收到 3 個。她現在有幾個氣球？", en: "Sophie has 5 balloons and gets 3 more. How many balloons does she have now?" },
    { kind: "block", a: 6, b: 2, plus: true, zh: "家樂有 6 塊積木，又找到 2 塊。他一共有幾塊積木？", en: "Ken has 6 blocks and finds 2 more. How many blocks does he have in all?" },
    { kind: "balloon", a: 8, b: 3, plus: false, zh: "阿明有 8 個氣球，飛走了 3 個。還剩下幾個氣球？", en: "Ming has 8 balloons. 3 fly away. How many balloons are left?" },
    { kind: "banana", a: 6, b: 2, plus: false, zh: "小美有 6 條香蕉，吃了 2 條。還剩下幾條香蕉？", en: "Amy has 6 bananas and eats 2. How many bananas are left?" },
    { kind: "car", a: 7, b: 3, plus: false, zh: "家樂有 7 輛小汽車，借了 3 輛給朋友。他還有幾輛小汽車？", en: "Ken has 7 cars and lends 3 to a friend. How many cars does he have left?" },
    { kind: "apple", a: 10, b: 4, plus: false, zh: "小欣有 10 個蘋果，分了 4 個給同學。她還有幾個蘋果？", en: "Sophie has 10 apples and gives 4 to classmates. How many apples does she have left?" },
  ];
  words.forEach((w, i) => {
    const ans = w.plus ? w.a + w.b : w.a - w.b;
    add(T.word, {
      d: 3,
      qz: w.zh,
      qe: w.en,
      v: w.plus
        ? {
            imageType: "objectGroups",
            imageConfig: {
              op: "+",
              groups: [
                { kind: w.kind, count: w.a, color: kcol(w.kind, 0) },
                { kind: w.kind, count: w.b, color: kcol(w.kind, 1) },
              ],
            },
          }
        : { imageType: "objects", imageConfig: { kind: w.kind, count: w.a, color: kcol(w.kind, i), crossed: w.b } },
      correct: numCh(ans),
      wrongs: nearNums(ans, 1, 10, rnd).map(numCh),
      ez: w.plus ? `要合起來，用加法：${w.a} + ${w.b} = ${ans}。` : `要拿走，用減法：${w.a} − ${w.b} = ${ans}。`,
      ee: w.plus
        ? `Putting together means adding: ${w.a} + ${w.b} = ${ans}.`
        : `Taking away means subtracting: ${w.a} − ${w.b} = ${ans}.`,
    });
  });

  // ===== 9. 更多形狀（9）=====
  const confuse: Record<string, ShapeName> = { rectangle: "square", oval: "circle", diamond: "square" };
  const shName = (s: ShapeName) => ({ zh: SHAPE_NAME[s].zh, en: SHAPE_NAME[s].en });
  const allShapes: ShapeName[] = ["circle", "square", "triangle", "rectangle", "oval", "diamond"];
  const newShapes: ShapeName[] = ["rectangle", "oval", "diamond", "rectangle", "oval", "diamond"];
  newShapes.forEach((s, i) => {
    const others = shuffle(
      allShapes.filter((x) => x !== s && x !== confuse[s]),
      rnd,
    ).slice(0, 2);
    add(T.sh2, {
      d: 2,
      qz: "這是什麼形狀？",
      qe: "What shape is this?",
      v: { imageType: "shape", imageConfig: { shape: s, color: KIND_COLORS[s][i < 3 ? 0 : 1] } },
      correct: shName(s),
      wrongs: [confuse[s], ...others].map(shName),
      ez: `這是${SHAPE_NAME[s].zh}。${SHAPE_FACT[s].zh}`,
      ee: `This is a ${SHAPE_NAME[s].en.toLowerCase()}. ${SHAPE_FACT[s].en}`,
    });
  });
  (["rectangle", "oval", "diamond"] as ShapeName[]).forEach((s, i) => {
    const color: Color = (["green", "orange", "purple"] as Color[])[i];
    const others = shuffle(
      allShapes.filter((x) => x !== s && x !== confuse[s]),
      rnd,
    ).slice(0, 2);
    const vis = (x: ShapeName) => visualChoice({ imageType: "shape", imageConfig: { shape: x, color } });
    add(T.sh2, {
      d: 2,
      qz: `哪一個是${SHAPE_NAME[s].zh}？`,
      qe: `Which one is a ${SHAPE_NAME[s].en.toLowerCase()}?`,
      v: { imageType: "emoji", imageConfig: { emoji: "🔎" } },
      correct: vis(s),
      wrongs: [confuse[s], ...others].map(vis),
      label: true,
      ez: SHAPE_FACT[s].zh,
      ee: SHAPE_FACT[s].en,
    });
  });

  // ===== 10. 立體形狀（12）=====
  const solids: SolidName[] = ["sphere", "cube", "cylinder"];
  const planeFor: Record<SolidName, ShapeName[]> = {
    sphere: ["circle", "oval"],
    cube: ["square", "rectangle"],
    cylinder: ["rectangle", "circle"],
  };
  const solidChoices = (s: SolidName, variant: number) => ({
    correct: { zh: SOLID_NAME[s].zh, en: SOLID_NAME[s].en },
    wrongs: [
      ...solids.filter((x) => x !== s).map((x) => ({ zh: SOLID_NAME[x].zh, en: SOLID_NAME[x].en })),
      shName(planeFor[s][variant % 2]),
    ],
  });
  const solidColors: Color[] = ["red", "blue", "green", "orange", "purple", "pink"];
  [...solids, ...solids].forEach((s, i) => {
    const ch = solidChoices(s, i < 3 ? 0 : 1);
    add(T.solid, {
      d: 2,
      qz: "這是什麼立體形狀？",
      qe: "What 3D shape is this?",
      v: { imageType: "solid", imageConfig: { solid: s, color: solidColors[i] } },
      correct: ch.correct,
      wrongs: ch.wrongs,
      ez: `這是${SOLID_NAME[s].zh}。${SOLID_FACT[s].zh}`,
      ee: `This is a ${SOLID_NAME[s].en.toLowerCase()}. ${SOLID_FACT[s].en}`,
    });
  });
  (
    [
      { e: "⚽", s: "sphere", zh: "足球", en: "football" },
      { e: "🎲", s: "cube", zh: "骰仔", en: "dice" },
      { e: "🥫", s: "cylinder", zh: "罐頭", en: "tin can" },
      { e: "🏀", s: "sphere", zh: "籃球", en: "basketball" },
      { e: "🎁", s: "cube", zh: "禮物盒", en: "gift box" },
      { e: "🔋", s: "cylinder", zh: "電池", en: "battery" },
    ] as { e: string; s: SolidName; zh: string; en: string }[]
  ).forEach((r, i) => {
    const ch = solidChoices(r.s, i);
    add(T.solid, {
      d: 3,
      qz: `${r.zh}最像哪個立體形狀？`,
      qe: `Which 3D shape does a ${r.en} look like?`,
      v: { imageType: "emoji", imageConfig: { emoji: r.e } },
      correct: ch.correct,
      wrongs: ch.wrongs,
      ez: `${r.zh}像${SOLID_NAME[r.s].zh}。${SOLID_FACT[r.s].zh}`,
      ee: `A ${r.en} looks like a ${SOLID_NAME[r.s].en.toLowerCase()}. ${SOLID_FACT[r.s].en}`,
    });
  });

  // ===== 11. ABBA / AAB / ABC 規律（各 5）=====
  const sets: Glyph[][] = [
    [{ kind: "circle", color: "red" }, { kind: "circle", color: "blue" }, { kind: "circle", color: "yellow" }],
    [{ kind: "square", color: "green" }, { kind: "square", color: "pink" }, { kind: "square", color: "orange" }],
    [{ kind: "apple", color: "red" }, { kind: "banana", color: "yellow" }, { kind: "fish", color: "blue" }],
    [{ kind: "star", color: "yellow" }, { kind: "heart", color: "pink" }, { kind: "circle", color: "blue" }],
    [{ kind: "triangle", color: "red" }, { kind: "triangle", color: "green" }, { kind: "triangle", color: "purple" }],
    [{ kind: "balloon", color: "red" }, { kind: "balloon", color: "blue" }, { kind: "balloon", color: "green" }],
    [{ kind: "flower", color: "pink" }, { kind: "star", color: "yellow" }, { kind: "car", color: "red" }],
    [{ kind: "block", color: "blue" }, { kind: "block", color: "orange" }, { kind: "block", color: "green" }],
    [{ kind: "fish", color: "blue" }, { kind: "fish", color: "orange" }, { kind: "fish", color: "purple" }],
    [{ kind: "heart", color: "red" }, { kind: "star", color: "orange" }, { kind: "circle", color: "green" }],
  ];
  const patPlans: { info: TopicInfo; unit: number[]; lens: number[]; off: number; name: string }[] = [
    { info: T.abba, unit: [0, 1, 1, 0], lens: [5, 6, 7, 7, 6], off: 0, name: "ABBA" },
    { info: T.aab, unit: [0, 0, 1], lens: [7, 8, 6, 7, 8], off: 1, name: "AAB" },
    { info: T.abc, unit: [0, 1, 2], lens: [6, 7, 8, 7, 8], off: 2, name: "ABC" },
  ];
  patPlans.forEach((plan) => {
    plan.lens.forEach((len, i) => {
      const set = sets[(i * 2 + plan.off + (i >= 5 ? 1 : 0)) % sets.length];
      const seq = Array.from({ length: len }, (_, j) => set[plan.unit[j % plan.unit.length]]);
      const ans = set[plan.unit[len % plan.unit.length]];
      const used = [...new Set(plan.unit)].map((u) => set[u]);
      const others = used.filter((g) => glyphName(g).zh !== glyphName(ans).zh);
      const wrongs = [...others, recolor(ans), ...altGlyphs(used, rnd, 2)].map(glyphChoice);
      const unitNames = plan.unit.map((u) => glyphName(set[u]));
      add(plan.info, {
        d: 3,
        qz: "下一個是哪一個？",
        qe: "What comes next?",
        v: { imageType: "pattern", imageConfig: { sequence: seq, blanks: 1 } },
        correct: glyphChoice(ans),
        wrongs,
        ez: `規律是 ${plan.name}：${unitNames.map((n) => n.zh).join("、")} 一直重複，下一個是${glyphName(ans).zh}。`,
        ee: `The ${plan.name} pattern repeats: ${unitNames.map((n) => n.en.toLowerCase()).join(", ")}. Next is the ${glyphName(ans).en.toLowerCase()}.`,
      });
    });
  });

  // ===== 12. 左與右（6）=====
  const posChoices = (kinds: ObjectKind[], t: number) => ({
    correct: kindChoice(kinds[t]),
    wrongs: kinds.filter((_, j) => j !== t).map(kindChoice),
  });
  const lrPlans: { qz: (k: ObjectKind[]) => string; qe: (k: ObjectKind[]) => string; t: number; ez: string; ee: string }[] = [
    { qz: () => "哪一個在最左邊？", qe: () => "Which one is on the far left?", t: 0, ez: "最左邊是左手那一邊最盡頭的一個。", ee: "The far left is the one at the end on your left-hand side." },
    { qz: () => "哪一個在最右邊？", qe: () => "Which one is on the far right?", t: 3, ez: "最右邊是右手那一邊最盡頭的一個。", ee: "The far right is the one at the end on your right-hand side." },
    { qz: (k) => `${OBJ_INFO[k[1]].zh}的右邊是哪一個？`, qe: (k) => `What is on the right of the ${OBJ_INFO[k[1]].en}?`, t: 2, ez: "向右邊看，緊貼著的就是答案。", ee: "Look to the right. The one right next to it is the answer." },
    { qz: (k) => `${OBJ_INFO[k[2]].zh}的左邊是哪一個？`, qe: (k) => `What is on the left of the ${OBJ_INFO[k[2]].en}?`, t: 1, ez: "向左邊看，緊貼著的就是答案。", ee: "Look to the left. The one right next to it is the answer." },
    { qz: () => "從左邊數起，第 2 個是哪一個？", qe: () => "Counting from the left, which one is 2nd?", t: 1, ez: "由左邊開始數：1、2。", ee: "Start from the left: 1, 2." },
    { qz: () => "從右邊數起，第 2 個是哪一個？", qe: () => "Counting from the right, which one is 2nd?", t: 2, ez: "由右邊開始數：1、2。", ee: "Start from the right: 1, 2." },
  ];
  lrPlans.forEach((p, i) => {
    const kinds = fourKinds(i * 2 + 1);
    const c = posChoices(kinds, p.t);
    add(T.lr, {
      d: 2,
      qz: p.qz(kinds),
      qe: p.qe(kinds),
      v: { imageType: "position", imageConfig: { scene: "leftright", items: kinds.map((k) => ({ kind: k })) } },
      correct: c.correct,
      wrongs: c.wrongs,
      ez: `${p.ez}答案是${OBJ_INFO[kinds[p.t]].zh}。`,
      ee: `${p.ee} The answer is the ${OBJ_INFO[kinds[p.t]].en}.`,
    });
  });

  // ===== 13. 上下與前後（6）=====
  const ufbPlans: {
    scene: "updown" | "frontback";
    qz: (k: ObjectKind[]) => string;
    qe: (k: ObjectKind[]) => string;
    t: number;
    ez: string;
    ee: string;
  }[] = [
    { scene: "updown", qz: (k) => `${OBJ_INFO[k[1]].zh}的下面是哪一個？`, qe: (k) => `What is below the ${OBJ_INFO[k[1]].en}?`, t: 2, ez: "向下看，緊貼著的就是答案。", ee: "Look down. The one right below is the answer." },
    { scene: "updown", qz: (k) => `${OBJ_INFO[k[2]].zh}的上面是哪一個？`, qe: (k) => `What is above the ${OBJ_INFO[k[2]].en}?`, t: 1, ez: "向上看，緊貼著的就是答案。", ee: "Look up. The one right above is the answer." },
    { scene: "updown", qz: () => "從上面數起，第 2 個是哪一個？", qe: () => "Counting from the top, which one is 2nd?", t: 1, ez: "由上面開始數：1、2。", ee: "Start from the top: 1, 2." },
    { scene: "frontback", qz: (k) => `${OBJ_INFO[k[1]].zh}的前面是哪一個？（向旗子的方向）`, qe: (k) => `What is in front of the ${OBJ_INFO[k[1]].en}? (toward the flag)`, t: 2, ez: "向旗子的方向看，前面緊貼著的就是答案。", ee: "Look toward the flag. The one just ahead is the answer." },
    { scene: "frontback", qz: (k) => `${OBJ_INFO[k[2]].zh}的後面是哪一個？（離開旗子的方向）`, qe: (k) => `What is behind the ${OBJ_INFO[k[2]].en}? (away from the flag)`, t: 1, ez: "向離開旗子的方向看，後面緊貼著的就是答案。", ee: "Look away from the flag. The one just behind is the answer." },
    { scene: "frontback", qz: () => "從最前面數起，第 2 個是哪一個？", qe: () => "Counting from the front, which one is 2nd?", t: 2, ez: "由最接近旗子的開始數：1、2。", ee: "Start from the one closest to the flag: 1, 2." },
  ];
  ufbPlans.forEach((p, i) => {
    const kinds = fourKinds(i * 2 + 4);
    const c = posChoices(kinds, p.t);
    add(T.ufb, {
      d: 2,
      qz: p.qz(kinds),
      qe: p.qe(kinds),
      v: { imageType: "position", imageConfig: { scene: p.scene, items: kinds.map((k) => ({ kind: k })) } },
      correct: c.correct,
      wrongs: c.wrongs,
      ez: `${p.ez}答案是${OBJ_INFO[kinds[p.t]].zh}。`,
      ee: `${p.ee} The answer is the ${OBJ_INFO[kinds[p.t]].en}.`,
    });
  });

  // ===== 14. 整點時鐘（12）=====
  const hourCh = (h: number) => ({ zh: `${h} 點`, en: `${h} o'clock` });
  [3, 6, 9, 12, 1, 5, 8, 10].forEach((h) => {
    add(T.clock, {
      d: h % 3 === 0 ? 1 : 2,
      qz: "現在是幾點鐘？",
      qe: "What time is it?",
      v: { imageType: "clock", imageConfig: { hour: h, minute: 0 } },
      correct: hourCh(h),
      wrongs: nearNums(h, 1, 12, rnd).map(hourCh),
      ez: `長針指著 12，短針指著 ${h}，就是 ${h} 點鐘。`,
      ee: `The long hand points to 12 and the short hand points to ${h}: it is ${h} o'clock.`,
    });
  });
  [2, 4, 7, 11].forEach((h) => {
    const vis = (x: number) => visualChoice({ imageType: "clock", imageConfig: { hour: x, minute: 0 } });
    add(T.clock, {
      d: 3,
      qz: `哪個鐘顯示 ${h} 點？`,
      qe: `Which clock shows ${h} o'clock?`,
      v: { imageType: "numberRow", imageConfig: { items: [h] } },
      correct: vis(h),
      wrongs: nearNums(h, 1, 12, rnd).map(vis),
      label: true,
      ez: `${h} 點鐘：長針指著 12，短針指著 ${h}。`,
      ee: `For ${h} o'clock, the long hand points to 12 and the short hand points to ${h}.`,
    });
  });

  // ===== 15. 認識錢幣（10）=====
  const coinCh = (v: number) => ({ zh: `$${v}`, en: `${v} ${v === 1 ? "dollar" : "dollars"}` });
  const coinVals = [1, 2, 5, 10];
  coinVals.forEach((v) => {
    add(T.money, {
      d: 1,
      qz: "這個硬幣值多少錢？",
      qe: "How much is this coin worth?",
      v: { imageType: "money", imageConfig: { coins: [v] } },
      correct: coinCh(v),
      wrongs: coinVals.filter((x) => x !== v).map(coinCh),
      ez: `硬幣上寫著 $${v}，就是 ${v} 元。`,
      ee: `The coin says $${v}, so it is worth ${v} ${v === 1 ? "dollar" : "dollars"}.`,
    });
  });
  (
    [
      [2, 1],
      [5, 2],
      [5, 2, 1],
      [5, 5],
    ] as number[][]
  ).forEach((coins) => {
    const sum = coins.reduce((a, b) => a + b, 0);
    add(T.money, {
      d: 2,
      qz: "一共有多少錢？",
      qe: "How much money is there in all?",
      v: { imageType: "money", imageConfig: { coins } },
      correct: coinCh(sum),
      wrongs: nearNums(sum, 1, 12, rnd).map(coinCh),
      ez: `${coins.map((c) => "$" + c).join(" + ")} = $${sum}。`,
      ee: `${coins.map((c) => "$" + c).join(" + ")} = $${sum}.`,
    });
  });
  (
    [
      { coins: [1, 5, 2, 10], most: true },
      { coins: [10, 2, 5, 1], most: false },
    ] as { coins: number[]; most: boolean }[]
  ).forEach((p) => {
    const t = p.most ? 10 : 1;
    add(T.money, {
      d: 2,
      qz: p.most ? "哪個硬幣最值錢？" : "哪個硬幣價值最少？",
      qe: p.most ? "Which coin is worth the most?" : "Which coin is worth the least?",
      v: { imageType: "money", imageConfig: { coins: p.coins } },
      correct: coinCh(t),
      wrongs: coinVals.filter((x) => x !== t).map(coinCh),
      ez: `$${t} 的${p.most ? "數目最大" : "數目最小"}，所以${p.most ? "最值錢" : "價值最少"}。`,
      ee: `$${t} is the ${p.most ? "biggest" : "smallest"} number, so it is worth the ${p.most ? "most" : "least"}.`,
    });
  });

  // ===== 16. 簡單圖表（8）=====
  const chartModes = ["most", "most", "most", "fewest", "fewest", "fewest", "read", "read"] as const;
  chartModes.forEach((mode, i) => {
    const kinds = fourKinds(i + 1);
    const values = shuffle([1, 2, 3, 4, 5, 6, 7, 8], rnd).slice(0, 4);
    const bars = kinds.map((k, j) => ({ kind: k, color: kcol(k, 0) === "pink" ? "pink" : (kcol(k, 0) as Color), value: values[j] }));
    const v = { imageType: "barChart", imageConfig: { bars, max: 8 } } as const;
    if (mode === "read") {
      const t = i % 4;
      const o = OBJ_INFO[kinds[t]];
      add(T.chart, {
        d: 2,
        qz: `${o.zh}有幾${o.m}？`,
        qe: `How many ${o.pl} are there?`,
        v,
        correct: numCh(values[t]),
        wrongs: nearNums(values[t], 1, 8, rnd).map(numCh),
        ez: `看${o.zh}那一欄，它的頂端對著 ${values[t]}。`,
        ee: `Look at the ${o.en} column. Its top is at ${values[t]}.`,
      });
    } else {
      const most = mode === "most";
      const t = values.indexOf(most ? Math.max(...values) : Math.min(...values));
      const o = OBJ_INFO[kinds[t]];
      add(T.chart, {
        d: 2,
        qz: most ? "哪一欄最多？" : "哪一欄最少？",
        qe: most ? "Which column has the most?" : "Which column has the fewest?",
        v,
        correct: kindChoice(kinds[t]),
        wrongs: kinds.filter((_, j) => j !== t).map(kindChoice),
        ez: `${o.zh}那一欄${most ? "最高" : "最矮"}，所以${most ? "最多" : "最少"}。`,
        ee: `The ${o.en} column is the ${most ? "tallest" : "shortest"}, so it has the ${most ? "most" : "fewest"}.`,
      });
    }
  });

  void COLOR_INFO;
  void plural;
  return list;
}
