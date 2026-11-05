// 集中管理中英對照文字 / Central bilingual text dictionary
import type { Category } from "@/data/types";

export interface Bi {
  zh: string;
  en: string;
}

export const t = {
  appName: { zh: "開心數學樂園", en: "Happy Math Playground" },
  tagline: { zh: "一齊玩數學！", en: "Let's play with math!" },
  mascotName: { zh: "數學熊", en: "Math Bear" },

  home: {
    startK2: { zh: "K2 開始", en: "Start K2" },
    startK3: { zh: "K3 開始", en: "Start K3" },
    stars: { zh: "我的星星與獎章", en: "My Stars & Badges" },
    parent: { zh: "家長報告", en: "Parent Report" },
    ageK2: { zh: "4–5 歲", en: "Ages 4–5" },
    ageK3: { zh: "5–6 歲", en: "Ages 5–6" },
  },

  common: {
    back: { zh: "返回", en: "Back" },
    home: { zh: "返回主頁", en: "Back to Home" },
    playAgain: { zh: "再玩一次", en: "Play Again" },
    next: { zh: "下一題", en: "Next" },
    finish: { zh: "完成", en: "Finish" },
    continue: { zh: "繼續", en: "Continue" },
    soundOn: { zh: "音效：開", en: "Sound: On" },
    soundOff: { zh: "音效：關", en: "Sound: Off" },
    musicOn: { zh: "音樂：開", en: "Music: On" },
    musicOff: { zh: "音樂：關", en: "Music: Off" },
    read: { zh: "朗讀", en: "Read aloud" },
    questions: { zh: "題", en: "questions" },
  },

  topics: {
    title: (level: string): Bi => ({ zh: `${level} 數學主題`, en: `${level} Math Topics` }),
    pick: { zh: "揀一個主題啦！", en: "Pick a topic!" },
    mix: { zh: "綜合練習", en: "Mixed Practice" },
    mixHint: { zh: "每個主題都玩一點", en: "A bit of everything" },
  },

  quiz: {
    pickAnswer: { zh: "揀出答案啦！", en: "Pick your answer!" },
    tryAgain: { zh: "再試一次，你得嘅！", en: "Try again, you can do it!" },
    praises: [
      { zh: "好叻呀！", en: "Great job!" },
      { zh: "答啱喇！", en: "Correct!" },
      { zh: "你真棒！", en: "You are awesome!" },
      { zh: "太厲害啦！", en: "Fantastic!" },
      { zh: "做得好！", en: "Well done!" },
    ] as Bi[],
    praiseRetry: { zh: "答啱喇！下次一定更快！", en: "Correct! You will be even faster next time!" },
    combo: (n: number): Bi => ({ zh: `連續答對 ×${n}`, en: `Combo ×${n}` }),
    progress: (done: number, total: number): Bi => ({ zh: `已完成 ${done} / ${total} 題`, en: `${done} / ${total} done` }),
    why: { zh: "小提示", en: "Little tip" },
    midTitle: { zh: "太棒了！完成 5 題！", en: "Awesome! 5 done!" },
    midText: { zh: "你得到一粒小星星，再接再厲！", en: "You earned a little star. Keep going!" },
    topicLabel: { zh: "主題", en: "Topic" },
    exit: { zh: "返回", en: "Back" },
    loading: { zh: "載入中…", en: "Loading…" },
    noQuestions: { zh: "暫時未有題目", en: "No questions yet" },
  },

  result: {
    title: { zh: "完成啦！", en: "All done!" },
    stars: { zh: "星星", en: "Stars" },
    accuracy: { zh: "正確率", en: "Accuracy" },
    time: { zh: "用時", en: "Time" },
    score: { zh: "首次答對", en: "First-try correct" },
    newSticker: { zh: "新貼紙！", en: "New sticker!" },
    newBadge: { zh: "新獎章！", en: "New badge!" },
    msg3: { zh: "你好叻呀！", en: "You are amazing!" },
    msg2: { zh: "做得好！繼續加油！", en: "Well done! Keep it up!" },
    msg1: { zh: "好努力！再玩一次會更好！", en: "Great effort! Try once more!" },
    minSec: (s: number): Bi => {
      const m = Math.floor(s / 60);
      const r = s % 60;
      return m > 0
        ? { zh: `${m} 分 ${r} 秒`, en: `${m} min ${r} sec` }
        : { zh: `${r} 秒`, en: `${r} sec` };
    },
  },

  rewards: {
    title: { zh: "我的星星與獎章", en: "My Stars & Badges" },
    totalStars: { zh: "我的星星", en: "My stars" },
    badges: { zh: "獎章", en: "Badges" },
    stickers: { zh: "貼紙", en: "Stickers" },
    locked: { zh: "未解鎖", en: "Locked" },
    noStickers: { zh: "完成 10 題就有貼紙！", en: "Finish 10 questions to get a sticker!" },
    play: { zh: "去玩遊戲", en: "Go and play" },
  },

  report: {
    title: { zh: "家長報告", en: "Parent Report" },
    intro: {
      zh: "以下資料只儲存在這部裝置的瀏覽器內。",
      en: "This information is stored only in this device's browser.",
    },
    summary: { zh: "整體概覽", en: "Overview" },
    sessions: { zh: "練習次數", en: "Sessions" },
    totalStars: { zh: "星星總數", en: "Total stars" },
    bestCombo: { zh: "最高連續答對", en: "Best combo" },
    overall: { zh: "整體正確率", en: "Overall accuracy" },
    focus: { zh: "建議多練習", en: "Practice focus" },
    focusNone: { zh: "暫時沒有較弱主題，繼續保持！", en: "No weak topics for now. Keep it up!" },
    byTopic: { zh: "各主題正確率", en: "Accuracy by topic" },
    recent: { zh: "最近 10 次練習", en: "Last 10 sessions" },
    noRecords: { zh: "還沒有練習紀錄", en: "No practice records yet" },
    weak: { zh: "建議再練習", en: "Practice recommended" },
    ok: { zh: "繼續加油", en: "Keep going" },
    good: { zh: "表現良好", en: "Doing great" },
    notTried: { zh: "未練習", en: "Not tried yet" },
    firstTry: { zh: "首次答對率", en: "First-try accuracy" },
    note: {
      zh: "正確率只計算「第一次就答對」的題目。",
      en: "Accuracy counts only questions answered correctly on the first try.",
    },
    clear: { zh: "清除紀錄", en: "Clear Records" },
    confirmTitle: { zh: "確定要清除所有紀錄嗎？", en: "Clear all records?" },
    confirmText: {
      zh: "星星、獎章和成績都會被刪除，無法還原。",
      en: "Stars, badges and scores will be deleted and cannot be restored.",
    },
    confirmYes: { zh: "確定清除", en: "Yes, clear" },
    confirmNo: { zh: "取消", en: "Cancel" },
    cleared: { zh: "紀錄已清除", en: "Records cleared" },
    bank: (n: number): Bi => ({ zh: `題庫共 ${n} 題`, en: `Question bank: ${n} questions` }),
    attempts: (n: number): Bi => ({ zh: `共 ${n} 題`, en: `${n} questions` }),
  },
};

export interface CategoryInfo extends Bi {
  emoji: string;
  /** Tailwind classes (literal strings so Tailwind can see them) */
  card: string;
  bar: string;
}

export const CATEGORY_INFO: Record<Category, CategoryInfo> = {
  counting: { zh: "數數", en: "Counting", emoji: "🍎", card: "bg-rose-400 border-rose-600", bar: "bg-rose-400" },
  addsub: { zh: "加減", en: "Add & Subtract", emoji: "➕", card: "bg-orange-400 border-orange-600", bar: "bg-orange-400" },
  shapes: { zh: "形狀", en: "Shapes", emoji: "🔷", card: "bg-sky-500 border-sky-700", bar: "bg-sky-500" },
  patterns: { zh: "規律", en: "Patterns", emoji: "🌈", card: "bg-fuchsia-400 border-fuchsia-600", bar: "bg-fuchsia-400" },
  comparison: { zh: "比較", en: "Compare", emoji: "⚖️", card: "bg-emerald-500 border-emerald-700", bar: "bg-emerald-500" },
  space: { zh: "空間", en: "Space", emoji: "🧭", card: "bg-indigo-400 border-indigo-600", bar: "bg-indigo-400" },
  timemoney: { zh: "時間金錢", en: "Time & Money", emoji: "⏰", card: "bg-amber-400 border-amber-600", bar: "bg-amber-400" },
};
