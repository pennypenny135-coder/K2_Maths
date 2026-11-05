// 完整題庫（K2 + K3，合共 220+ 題）/ Complete question bank (K2 + K3, 220+ questions)
//
// 題庫由 k2.ts / k3.ts 的產生器建立，每題都有完整中英對照內容。
// 如要手動加題，請在 customQuestions.ts 加入，詳見 README。
// Questions are produced by the generators in k2.ts / k3.ts. To add hand-written
// questions, append them to customQuestions.ts (see README).

import type { Category, Level, Question } from "./types";
import { buildK2 } from "./k2";
import { buildK3 } from "./k3";
import { customQuestions } from "./customQuestions";

export type { Question, Choice, Level, Category } from "./types";

export const questions: Question[] = [...buildK2(), ...buildK3(), ...customQuestions];

export type SelectableCategory = Category | "mix";

export function getQuestions(level: Level, category: SelectableCategory): Question[] {
  return questions.filter((q) => q.level === level && (category === "mix" || q.category === category));
}

export function getCategoriesForLevel(level: Level): Category[] {
  const order: Category[] = ["counting", "addsub", "shapes", "patterns", "comparison", "space", "timemoney"];
  return order.filter((c) => questions.some((q) => q.level === level && q.category === c));
}

export interface TopicStat {
  level: Level;
  category: Category;
  topic: string;
  topicEn: string;
  count: number;
}

/** 題庫統計：每個細項主題有幾多題 / counts per fine-grained topic */
export function computeStats(list: Question[] = questions) {
  const byTopic = new Map<string, TopicStat>();
  for (const q of list) {
    const key = `${q.level}|${q.topic}`;
    const s = byTopic.get(key);
    if (s) s.count++;
    else byTopic.set(key, { level: q.level, category: q.category, topic: q.topic, topicEn: q.topicEn, count: 1 });
  }
  return {
    total: list.length,
    K2: list.filter((q) => q.level === "K2").length,
    K3: list.filter((q) => q.level === "K3").length,
    topics: [...byTopic.values()],
  };
}

export const questionStats = computeStats();
