// 手動新增題目放這裡 / Add hand-written questions here.
// 每題都要符合 Question 型別（4 個選項、中英對照）。
// Every question must follow the Question type (4 bilingual choices).
import type { Question } from "./types";

export const customQuestions: Question[] = [
  {
    id: "K2-CUSTOM-001",
    level: "K2",
    category: "counting",
    topic: "數數 1 至 10",
    topicEn: "Counting 1 to 10",
    difficulty: 1,
    questionZh: "有幾朵花？",
    questionEn: "How many flowers are there?",
    imageType: "objects",
    imageConfig: { kind: "flower", count: 5, color: "purple" },
    choices: [
      { zh: "4", en: "four" },
      { zh: "5", en: "five" },
      { zh: "6", en: "six" },
      { zh: "7", en: "seven" },
    ],
    correctIndex: 1,
    explanationZh: "一朵一朵點算，一共有 5 朵花。",
    explanationEn: "Count one by one. There are 5 flowers.",
    tags: ["counting", "1-10", "custom"],
  },
];
