import type { Category, Level } from "@/data/types";

export interface CategoryTally {
  total: number;
  correct: number;
}

export interface SessionRecord {
  id: string;
  date: string;
  level: Level;
  category: Category | "mix";
  total: number;
  /** 第一次就答對的題數 / correct on the first try */
  correct: number;
  seconds: number;
  stars: number;
  bestCombo: number;
}

export interface Progress {
  version: 1;
  sessions: SessionRecord[];
  totalStars: number;
  bestCombo: number;
  /** 貼紙：`${kind}:${color}` */
  stickers: string[];
  /** 最近出過的題目，用來盡量避免重複 */
  recent: string[];
  /** key: `${level}:${category}` */
  topicStats: Record<string, CategoryTally>;
}

export const emptyProgress = (): Progress => ({
  version: 1,
  sessions: [],
  totalStars: 0,
  bestCombo: 0,
  stickers: [],
  recent: [],
  topicStats: {},
});
