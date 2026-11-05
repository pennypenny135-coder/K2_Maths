import type { Question } from "@/data/types";

export const QUIZ_LENGTH = 10;
export const MILESTONE = 5;

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 隨機抽題；最近玩過的題目排後，混合練習會平均抽各主題。 */
export function pickQuestions(pool: Question[], n: number, recent: string[]): Question[] {
  const recentSet = new Set(recent);
  const order = (list: Question[]) =>
    list
      .map((q) => ({ q, s: (recentSet.has(q.id) ? 1 : 0) + Math.random() * 0.9 }))
      .sort((a, b) => a.s - b.s)
      .map((x) => x.q);

  const cats = [...new Set(pool.map((q) => q.category))];
  let picked: Question[];
  if (cats.length > 1) {
    // 混合：輪流由每個主題抽題 / mixed: round-robin across categories
    const buckets = shuffled(cats).map((c) => order(pool.filter((q) => q.category === c)));
    picked = [];
    let i = 0;
    while (picked.length < n && buckets.some((b) => b.length > 0)) {
      const b = buckets[i % buckets.length];
      const q = b.shift();
      if (q) picked.push(q);
      i++;
    }
  } else {
    picked = order(pool).slice(0, n);
  }
  return shuffled(picked);
}
