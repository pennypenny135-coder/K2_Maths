// 星星、貼紙、獎章邏輯 / Stars, stickers and badges
import type { Bi } from "./i18n";
import type { Progress } from "./progressTypes";

/** 一組 10 題：9–10 題 3 星，6–8 題 2 星，其餘 1 星 */
export function starsFor(correct: number, total: number): number {
  const ratio = total === 0 ? 0 : correct / total;
  if (ratio >= 0.9) return 3;
  if (ratio >= 0.6) return 2;
  return 1;
}

export const STICKER_POOL: string[] = [
  "apple:red",
  "banana:yellow",
  "star:yellow",
  "balloon:pink",
  "fish:blue",
  "car:green",
  "block:orange",
  "heart:pink",
  "flower:purple",
  "star:pink",
  "fish:orange",
  "balloon:blue",
];

export interface BadgeDef {
  id: string;
  emoji: string;
  name: Bi;
  desc: Bi;
  earned: (p: Progress) => boolean;
}

export const BADGES: BadgeDef[] = [
  {
    id: "first",
    emoji: "🌱",
    name: { zh: "第一步", en: "First Step" },
    desc: { zh: "完成第 1 次練習", en: "Finish your first practice" },
    earned: (p) => p.sessions.length >= 1,
  },
  {
    id: "perfect",
    emoji: "🏆",
    name: { zh: "滿分小達人", en: "Perfect Score" },
    desc: { zh: "一組 10 題全部第一次就答對", en: "Get all 10 right on the first try" },
    earned: (p) => p.sessions.some((s) => s.total > 0 && s.correct === s.total),
  },
  {
    id: "combo5",
    emoji: "🔥",
    name: { zh: "連勝 5", en: "Combo 5" },
    desc: { zh: "連續答對 5 題", en: "Answer 5 in a row correctly" },
    earned: (p) => p.bestCombo >= 5,
  },
  {
    id: "combo10",
    emoji: "🚀",
    name: { zh: "連勝 10", en: "Combo 10" },
    desc: { zh: "連續答對 10 題", en: "Answer 10 in a row correctly" },
    earned: (p) => p.bestCombo >= 10,
  },
  {
    id: "stars10",
    emoji: "⭐",
    name: { zh: "10 粒星星", en: "10 Stars" },
    desc: { zh: "收集 10 粒星星", en: "Collect 10 stars" },
    earned: (p) => p.totalStars >= 10,
  },
  {
    id: "stars30",
    emoji: "🌟",
    name: { zh: "30 粒星星", en: "30 Stars" },
    desc: { zh: "收集 30 粒星星", en: "Collect 30 stars" },
    earned: (p) => p.totalStars >= 30,
  },
  {
    id: "stars60",
    emoji: "✨",
    name: { zh: "60 粒星星", en: "60 Stars" },
    desc: { zh: "收集 60 粒星星", en: "Collect 60 stars" },
    earned: (p) => p.totalStars >= 60,
  },
  {
    id: "sessions5",
    emoji: "📚",
    name: { zh: "勤力學生", en: "Hard Worker" },
    desc: { zh: "完成 5 次練習", en: "Finish 5 practices" },
    earned: (p) => p.sessions.length >= 5,
  },
  {
    id: "sessions20",
    emoji: "🎓",
    name: { zh: "數學博士", en: "Math Doctor" },
    desc: { zh: "完成 20 次練習", en: "Finish 20 practices" },
    earned: (p) => p.sessions.length >= 20,
  },
  {
    id: "k2fan",
    emoji: "🐻",
    name: { zh: "K2 小達人", en: "K2 Champion" },
    desc: { zh: "完成 3 次 K2 練習", en: "Finish 3 K2 practices" },
    earned: (p) => p.sessions.filter((s) => s.level === "K2").length >= 3,
  },
  {
    id: "k3fan",
    emoji: "🐰",
    name: { zh: "K3 小達人", en: "K3 Champion" },
    desc: { zh: "完成 3 次 K3 練習", en: "Finish 3 K3 practices" },
    earned: (p) => p.sessions.filter((s) => s.level === "K3").length >= 3,
  },
  {
    id: "explorer",
    emoji: "🧭",
    name: { zh: "小小探險家", en: "Explorer" },
    desc: { zh: "試玩 5 個不同主題", en: "Try 5 different topics" },
    earned: (p) => new Set(Object.keys(p.topicStats).map((k) => k.split(":")[1])).size >= 5,
  },
];

export function earnedBadgeIds(p: Progress): Set<string> {
  return new Set(BADGES.filter((b) => b.earned(p)).map((b) => b.id));
}
