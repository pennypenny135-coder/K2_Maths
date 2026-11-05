"use client";
import { useState } from "react";
import Bi from "@/components/Bi";
import PageShell from "@/components/PageShell";
import { getCategoriesForLevel, questionStats } from "@/data/questions";
import type { Category, Level } from "@/data/types";
import { useProgress } from "@/hooks/useProgress";
import { useSound } from "@/hooks/useSound";
import { CATEGORY_INFO, t } from "@/lib/i18n";
import type { Progress } from "@/lib/progressTypes";

const MIN_ATTEMPTS = 3;
const LEVELS: Level[] = ["K2", "K3"];

function Ring({ percent, label, color }: { percent: number | null; label: string; color: string }) {
  const r = 38;
  const c = 2 * Math.PI * r;
  const p = percent ?? 0;
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 100 100" width="104" height="104" role="img" aria-label={`${label} ${percent ?? 0}%`}>
        <circle cx="50" cy="50" r={r} fill="none" stroke="#e2e8f0" strokeWidth="12" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${(c * p) / 100} ${c}`}
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="54" textAnchor="middle" fontSize="20" fontWeight="900" fill="#334155">
          {percent === null ? "–" : `${percent}%`}
        </text>
      </svg>
      <span className="text-lg font-extrabold text-slate-800">{label}</span>
    </div>
  );
}

type Status = "weak" | "ok" | "good" | "none";

function statusOf(total: number, correct: number): { status: Status; pct: number | null } {
  if (total < MIN_ATTEMPTS) return { status: "none", pct: total === 0 ? null : Math.round((correct / total) * 100) };
  const pct = Math.round((correct / total) * 100);
  return { status: pct < 60 ? "weak" : pct >= 80 ? "good" : "ok", pct };
}

const STATUS_STYLE: Record<Status, { bar: string; chip: string }> = {
  weak: { bar: "bg-orange-400", chip: "bg-orange-100 text-orange-800" },
  ok: { bar: "bg-sky-400", chip: "bg-sky-100 text-sky-800" },
  good: { bar: "bg-green-500", chip: "bg-green-100 text-green-800" },
  none: { bar: "bg-slate-300", chip: "bg-slate-100 text-slate-600" },
};

function levelTotals(p: Progress, level: Level) {
  let total = 0;
  let correct = 0;
  for (const [k, v] of Object.entries(p.topicStats)) {
    if (k.startsWith(`${level}:`)) {
      total += v.total;
      correct += v.correct;
    }
  }
  return { total, correct };
}

export default function ReportPage() {
  const { progress, clearAll } = useProgress();
  const sound = useSound();
  const [confirming, setConfirming] = useState(false);
  const [cleared, setCleared] = useState(false);

  const weak: { level: Level; cat: Category }[] = [];
  for (const level of LEVELS) {
    for (const cat of getCategoriesForLevel(level)) {
      const s = progress.topicStats[`${level}:${cat}`] ?? { total: 0, correct: 0 };
      if (statusOf(s.total, s.correct).status === "weak") weak.push({ level, cat });
    }
  }

  const all = LEVELS.map((l) => levelTotals(progress, l));
  const grandTotal = all.reduce((a, b) => a + b.total, 0);
  const grandCorrect = all.reduce((a, b) => a + b.correct, 0);
  const overallPct = grandTotal ? Math.round((grandCorrect / grandTotal) * 100) : null;
  const recent = progress.sessions.slice(0, 10);

  const fmtDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  return (
    <PageShell back={{ href: "/" }} title={t.report.title} subtitle={t.report.intro}>
      {/* 概覽 */}
      <section className="rounded-[2rem] border-4 border-white bg-white/90 p-4 shadow-xl">
        <h2 className="mb-3 text-center text-sky-950">
          <Bi {...t.report.summary} zhClassName="text-2xl" enClassName="text-base" />
        </h2>
        <div className="flex flex-wrap items-center justify-around gap-3">
          <Ring percent={overallPct} label={`${t.report.overall.zh}`} color="#22c55e" />
          {LEVELS.map((l, i) => {
            const a = all[i];
            return (
              <Ring
                key={l}
                percent={a.total ? Math.round((a.correct / a.total) * 100) : null}
                label={l}
                color={l === "K2" ? "#38bdf8" : "#f472b6"}
              />
            );
          })}
        </div>
        <p className="mt-1 text-center text-xs font-semibold text-slate-500">{t.report.overall.en}</p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-slate-900">
          {[
            { label: t.report.sessions, value: progress.sessions.length, bg: "bg-sky-100" },
            { label: t.report.totalStars, value: progress.totalStars, bg: "bg-yellow-100" },
            { label: t.report.bestCombo, value: progress.bestCombo, bg: "bg-pink-100" },
          ].map((x) => (
            <div key={x.label.en} className={`rounded-2xl p-2 ${x.bg}`}>
              <Bi {...x.label} zhClassName="text-sm" enClassName="text-xs" />
              <div className="text-3xl font-black">{x.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 較弱主題 */}
      <section className="mt-4 rounded-[2rem] border-4 border-white bg-white/90 p-4 shadow-xl">
        <h2 className="mb-2 text-center text-sky-950">
          <Bi {...t.report.focus} zhClassName="text-2xl" enClassName="text-base" />
        </h2>
        {weak.length === 0 ? (
          <p className="text-center text-green-700">
            <Bi {...t.report.focusNone} zhClassName="text-base" enClassName="text-sm" />
          </p>
        ) : (
          <ul className="space-y-2">
            {weak.map(({ level, cat }) => (
              <li key={`${level}${cat}`} className="rounded-2xl bg-orange-50 p-3 text-orange-900">
                <Bi
                  zh={`${level} ${CATEGORY_INFO[cat].zh}：${t.report.weak.zh}`}
                  en={`${level} ${CATEGORY_INFO[cat].en}: ${t.report.weak.en}`}
                  align="left"
                  zhClassName="text-lg"
                  enClassName="text-sm"
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 各主題正確率 */}
      <section className="mt-4 rounded-[2rem] border-4 border-white bg-white/90 p-4 shadow-xl">
        <h2 className="mb-1 text-center text-sky-950">
          <Bi {...t.report.byTopic} zhClassName="text-2xl" enClassName="text-base" />
        </h2>
        <p className="mb-3 text-center text-slate-500">
          <Bi {...t.report.note} zhClassName="text-xs" enClassName="text-[0.65rem]" />
        </p>
        {LEVELS.map((level) => (
          <div key={level} className="mb-4 last:mb-0">
            <h3 className={`mb-2 inline-block rounded-full px-4 py-1 text-xl font-black text-white ${level === "K2" ? "bg-sky-500" : "bg-pink-500"}`}>
              {level}
            </h3>
            <ul className="space-y-2">
              {getCategoriesForLevel(level).map((cat) => {
                const s = progress.topicStats[`${level}:${cat}`] ?? { total: 0, correct: 0 };
                const { status, pct } = statusOf(s.total, s.correct);
                const info = CATEGORY_INFO[cat];
                const label = status === "none" ? t.report.notTried : t.report[status];
                const st = STATUS_STYLE[status];
                return (
                  <li key={cat} className="rounded-2xl bg-slate-50 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2">
                        <span className="text-2xl" aria-hidden="true">
                          {info.emoji}
                        </span>
                        <Bi zh={info.zh} en={info.en} align="left" zhClassName="text-lg" enClassName="text-xs" />
                      </span>
                      <span className="text-2xl font-black text-slate-700">{pct === null ? "–" : `${pct}%`}</span>
                    </div>
                    <div className="mt-2 h-4 overflow-hidden rounded-full bg-slate-200">
                      <div className={`h-full rounded-full transition-all duration-700 ${st.bar}`} style={{ width: `${pct ?? 0}%` }} />
                    </div>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-1">
                      <span className={`rounded-full px-3 py-1 ${st.chip}`}>
                        <Bi
                          zh={status === "weak" ? `${info.zh}：${label.zh}` : label.zh}
                          en={status === "weak" ? `${info.en}: ${label.en}` : label.en}
                          align="left"
                          zhClassName="text-sm"
                          enClassName="text-xs"
                        />
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {t.report.attempts(s.total).zh} / {t.report.attempts(s.total).en}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </section>

      {/* 最近 10 次 */}
      <section className="mt-4 rounded-[2rem] border-4 border-white bg-white/90 p-4 shadow-xl">
        <h2 className="mb-3 text-center text-sky-950">
          <Bi {...t.report.recent} zhClassName="text-2xl" enClassName="text-base" />
        </h2>
        {recent.length === 0 ? (
          <p className="text-center text-slate-600">
            <Bi {...t.report.noRecords} zhClassName="text-lg" enClassName="text-sm" />
          </p>
        ) : (
          <ul className="space-y-2">
            {recent.map((s) => {
              const pct = s.total ? Math.round((s.correct / s.total) * 100) : 0;
              const catLabel = s.category === "mix" ? t.topics.mix : CATEGORY_INFO[s.category];
              const time = t.result.minSec(s.seconds);
              return (
                <li key={s.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-2 text-slate-800">
                  <span className={`rounded-xl px-2 py-1 text-lg font-black text-white ${s.level === "K2" ? "bg-sky-500" : "bg-pink-500"}`}>
                    {s.level}
                  </span>
                  <div className="min-w-0 flex-1">
                    <Bi {...catLabel} align="left" zhClassName="text-base" enClassName="text-xs" />
                    <div className="text-xs font-semibold text-slate-500">
                      {fmtDate(s.date)} · {time.zh} / {time.en}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black">
                      {s.correct}/{s.total} <span className="text-sm text-slate-500">({pct}%)</span>
                    </div>
                    <div className="text-sm" aria-label={`${s.stars} stars`}>
                      {"⭐".repeat(s.stars)}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* 清除紀錄 */}
      <section className="mt-4 rounded-[2rem] border-4 border-white bg-white/90 p-4 text-center shadow-xl">
        {cleared && !confirming && (
          <p className="mb-3 text-green-700">
            <Bi {...t.report.cleared} zhClassName="text-lg" enClassName="text-sm" />
          </p>
        )}
        {!confirming ? (
          <button
            type="button"
            onClick={() => {
              sound.tap();
              setConfirming(true);
              setCleared(false);
            }}
            className="btn-big w-full gap-2 border-rose-700 bg-rose-400 px-6 text-xl text-white"
          >
            <span aria-hidden="true">🗑️</span>
            <Bi {...t.report.clear} />
          </button>
        ) : (
          <div role="alertdialog" aria-label="確認清除 Confirm clear" className="animate-slide-up rounded-3xl border-4 border-rose-300 bg-rose-50 p-4 text-rose-900">
            <Bi {...t.report.confirmTitle} zhClassName="text-2xl" enClassName="text-base" />
            <p className="mt-2">
              <Bi {...t.report.confirmText} zhClassName="text-sm" enClassName="text-xs" />
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  sound.tap();
                  setConfirming(false);
                }}
                className="btn-big border-sky-700 bg-sky-500 px-2 text-lg text-white"
              >
                <Bi {...t.report.confirmNo} />
              </button>
              <button
                type="button"
                onClick={() => {
                  clearAll();
                  setConfirming(false);
                  setCleared(true);
                }}
                className="btn-big border-rose-800 bg-rose-600 px-2 text-lg text-white"
              >
                <Bi {...t.report.confirmYes} />
              </button>
            </div>
          </div>
        )}
      </section>

      <p className="mt-4 text-center text-sky-900">
        <Bi {...t.report.bank(questionStats.total)} zhClassName="text-sm" enClassName="text-xs" />
      </p>
    </PageShell>
  );
}
