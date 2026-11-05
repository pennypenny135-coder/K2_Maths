# 開心數學樂園 Happy Math Playground

為香港 K2（4–5 歲）及 K3（5–6 歲）小朋友而設的互動數學練習 PWA。
An interactive, bilingual (Traditional Chinese + English) math practice PWA for Hong Kong K2 & K3 children.

- Next.js (App Router) + TypeScript + Tailwind CSS
- 所有資料存在瀏覽器 localStorage，無需登入、無後端 / all data in localStorage, no login, no backend
- 圖形全部用 SVG / CSS 畫出，音效與音樂由 Web Audio API 即時合成，沒有外部圖片或音檔
  All visuals are SVG/CSS; sound & music are synthesized with Web Audio — no external assets
- PWA：可加入主畫面，已載入的頁面和題庫可離線開啟 / installable and works offline after the first visit

## 本機執行 / Run locally

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # 正式建置 / production build
npm run start        # 啟動正式版 / run production build
```

> Service Worker 只會在正式版（`npm run build && npm run start`）註冊。
> The service worker is registered in production builds only.

檢查題庫（不重複、4 個選項、統計）/ validate the question bank:

```bash
npx tsx scripts/check-questions.ts
```

## 部署到 Vercel / Deploy to Vercel

```bash
npm i -g vercel
vercel            # 第一次：預覽部署 / first run: preview deployment
vercel --prod     # 正式上線 / production
```

或把專案推上 GitHub，在 vercel.com 選 “Import Project”，框架選 Next.js 即可（不需任何環境變數）。
Or push to GitHub and import the repo on vercel.com (Next.js preset, no environment variables needed).

## 專案結構 / Structure

| 檔案 / File | 說明 / Description |
| --- | --- |
| `src/app/page.tsx` | 主頁（K2、K3、星星與獎章、家長報告） / Home |
| `src/app/k2/page.tsx`, `src/app/k3/page.tsx` | 主題選擇 / topic selection |
| `src/app/quiz/page.tsx` | 答題頁（隨機 10 題） / quiz (10 random questions) |
| `src/app/report/page.tsx` | 家長報告 / parent report |
| `src/app/rewards/page.tsx` | 我的星星與獎章 / stars, badges & stickers |
| `src/data/questions.ts` | 完整題庫入口、統計 / question bank entry + stats |
| `src/data/k2.ts`, `src/data/k3.ts` | K2、K3 題目產生器 / question generators |
| `src/data/customQuestions.ts` | 手動加題放這裡 / hand-written questions |
| `src/data/types.ts`, `vocab.ts`, `helpers.ts`, `pool.ts` | 型別、詞彙、輔助工具 / types, vocabulary, helpers |
| `src/components/MathQuestion.tsx` | 題目、選項、回饋 / question UI |
| `src/components/Visual.tsx`, `Glyph.tsx` | SVG 圖形（物件、形狀、時鐘、錢幣、柱狀圖…） / SVG visuals |
| `src/components/CharacterMascot.tsx` | 數學熊 Math Bear |
| `src/components/Confetti.tsx` | 彩紙與星星爆開 / confetti + star burst |
| `src/components/ProgressBar.tsx`, `ResultCard.tsx` | 進度條、成績頁 / progress bar, result card |
| `src/hooks/useSound.ts` | Web Audio 音效與背景音樂 / sound engine |
| `src/hooks/useProgress.ts` | localStorage 進度 / progress storage |
| `src/lib/i18n.ts` | 集中管理中英對照文字 / central bilingual dictionary |
| `public/manifest.json`, `public/sw.js` | PWA |

## 題庫 / Question bank

目前共 **252 題**（K2 116 題、K3 136 題），每個細項主題最少 5 題。
**252 questions** (K2 116, K3 136); every fine-grained topic has at least 5 questions.

| Level | Topic | Count |
| --- | --- | --- |
| K2 | 數數 1 至 10 (含 1 題手動題) | 15 |
| K2 | 數字配對 | 8 |
| K2 | 多與少 | 8 |
| K2 | 大與小 | 6 |
| K2 | 長與短 | 6 |
| K2 | 簡單排序 | 6 |
| K2 | 基本形狀 | 16 |
| K2 | 顏色與物件分類 | 10 |
| K2 | ABAB 規律 | 10 |
| K2 | 上下 / 前後 / 裡面與外面 | 5 / 5 / 5 |
| K2 | 5 以內加法 / 減法 | 8 / 8 |
| K3 | 數數 1 至 20 / 認讀 11–20 / 11–20 的數量 | 8 / 6 / 6 |
| K3 | 順序數、倒數、相鄰數 | 12 |
| K3 | 單數與雙數 | 6 |
| K3 | 10 以內加法 / 減法 / 簡單應用題 | 6 / 6 / 8 |
| K3 | 更多形狀 / 立體形狀 | 9 / 12 |
| K3 | ABBA / AAB / ABC 規律 | 5 / 5 / 5 |
| K3 | 左與右 / 上下與前後 | 6 / 6 |
| K3 | 整點時鐘 | 12 |
| K3 | 認識錢幣（$1、$2、$5、$10） | 10 |
| K3 | 簡單圖表 | 8 |

在程式內取得統計 / get the stats in code: `import { questionStats } from "@/data/questions"`。

每題欄位 / fields: `id, level, category, topic, topicEn, difficulty, questionZh, questionEn, imageType, imageConfig, choices(4, 各有 zh/en), correctIndex, explanationZh, explanationEn, tags`。

## 如何新增題目 / How to add questions

**方法 A — 手動加一題（最簡單） / Hand-write a question**

在 `src/data/customQuestions.ts` 的陣列加入一個物件（可參考裡面的範例）：

```ts
{
  id: "K3-CUSTOM-001",          // 必須獨一無二 / must be unique
  level: "K3",
  category: "addsub",           // counting | addsub | shapes | patterns | comparison | space | timemoney
  topic: "10 以內加法", topicEn: "Addition within 10",
  difficulty: 2,
  questionZh: "2 + 6 = ？", questionEn: "What is 2 plus 6?",
  imageType: "objectGroups",
  imageConfig: { op: "+", groups: [{ kind: "apple", count: 2 }, { kind: "apple", count: 6 }] },
  choices: [
    { zh: "7", en: "seven" }, { zh: "8", en: "eight" },
    { zh: "9", en: "nine" },  { zh: "6", en: "six" },
  ],
  correctIndex: 1,
  explanationZh: "2 加 6 等於 8。", explanationEn: "2 plus 6 equals 8.",
  tags: ["addition", "within-10"],
}
```

可用的 `imageType`：`objects`、`objectGroups`、`glyphs`、`lengthBars`、`shape`、`solid`、`pattern`、`position`、`clock`、`money`、`barChart`、`numberRow`、`emoji`。
`imageConfig` 的格式見 `src/data/types.ts`。選項也可以附 `visual`（小圖形）或 `swatch`（顏色點）。

**方法 B — 用產生器批量加題 / Use the generators**

在 `src/data/k2.ts` 或 `src/data/k3.ts` 中，仿照現有區塊呼叫 `add(topicInfo, { ... })`；ID 會自動編號，干擾選項會自動去重並隨機排序（固定種子，每次建置結果一致）。

加完後執行 `npx tsx scripts/check-questions.ts` 檢查是否有重複或格式錯誤。

## 功能簡介 / Feature summary

- 主頁只有四個大按鈕：K2 開始、K3 開始、我的星星與獎章、家長報告
- 7 個主題（K3）／6 個主題（K2）＋綜合練習，每次隨機抽 10 題（盡量避開最近玩過的）
- 4 個大按鈕選項（最少 64px 高）；答錯可重試，只記錄「首次是否答對」
- 答對：數學熊跳躍、星星爆開、彩紙、combo 連擊；答錯：數學熊輕輕搖頭＋鼓勵訊息
- 每 5 題小獎勵、每 10 題成績頁（星星、正確率、用時）＋貼紙＋獎章
- 🗣️ 朗讀題目（瀏覽器內建語音，粵語＋英語）
- 音效／音樂開關（預設開啟），全部由 Web Audio 合成
- 家長報告：最近 10 次練習、K2/K3 各主題正確率（圓形圖＋進度條）、較弱主題提示、二次確認清除紀錄
- 全站中英對照（中文在上、英文在下）
