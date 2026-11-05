"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { getQuestions, type SelectableCategory } from "@/data/questions";
import type { Category, Level, Question } from "@/data/types";
import { useProgress, readProgress, type SessionResult } from "@/hooks/useProgress";
import { useSound } from "@/hooks/useSound";
import { CATEGORY_INFO, t, type Bi as BiText } from "@/lib/i18n";
import { MILESTONE, QUIZ_LENGTH, pickQuestions } from "@/lib/quiz";
import Bi from "./Bi";
import CharacterMascot, { type Mood } from "./CharacterMascot";
import Confetti from "./Confetti";
import { GlyphIcon } from "./Glyph";
import MathQuestion, { type AnswerEvent } from "./MathQuestion";
import PageShell from "./PageShell";
import ProgressBar from "./ProgressBar";
import ResultCard from "./ResultCard";

type Phase = "play" | "milestone" | "done";

interface Outcome {
  id: string;
  category: Category;
  first: boolean;
}

interface Finished extends SessionResult {
  correct: number;
  total: number;
  seconds: number;
}

const CATEGORIES = Object.keys(CATEGORY_INFO) as Category[];

export default function QuizGame() {
  const params = useSearchParams();
  const level: Level = params.get("level") === "K3" ? "K3" : "K2";
  const catParam = params.get("cat") ?? "mix";
  const cat: SelectableCategory = (CATEGORIES as string[]).includes(catParam) ? (catParam as Category) : "mix";

  const sound = useSound();
  const { addSession } = useProgress();

  const [round, setRound] = useState(0);
  const [qs, setQs] = useState<Question[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [solved, setSolved] = useState(false);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [mood, setMood] = useState<Mood>("idle");
  const [moodTick, setMoodTick] = useState(0);
  const [msg, setMsg] = useState<BiText>(t.quiz.pickAnswer);
  const [burst, setBurst] = useState(0);
  const [phase, setPhase] = useState<Phase>("play");
  const [result, setResult] = useState<Finished | null>(null);
  const startRef = useRef(0);
  const savedRef = useRef(false);

  // 開始新一輪：隨機抽 10 題 / start a round: randomly pick 10 questions
  useEffect(() => {
    const p = readProgress();
    setQs(pickQuestions(getQuestions(level, cat), QUIZ_LENGTH, p.recent));
    setIdx(0);
    setOutcomes([]);
    setSolved(false);
    setCombo(0);
    setBestCombo(0);
    setMood("idle");
    setMsg(t.quiz.pickAnswer);
    setPhase("play");
    setResult(null);
    setBurst(0);
    savedRef.current = false;
    startRef.current = Date.now();
  }, [level, cat, round]);

  // 背景音樂只在答題時播放 / background music only while playing
  useEffect(() => {
    if (phase === "play") sound.startMusic();
    else sound.stopMusic();
    return () => sound.stopMusic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const total = qs?.length ?? QUIZ_LENGTH;
  const backHref = level === "K3" ? "/k3" : "/k2";

  const handleAnswered = useCallback(
    ({ correct, first }: AnswerEvent) => {
      if (!qs) return;
      const q = qs[idx];
      if (correct) {
        sound.correct();
        setSolved(true);
        setOutcomes((o) => [...o, { id: q.id, category: q.category, first }]);
        let praise: BiText = t.quiz.praises[Math.floor(Math.random() * t.quiz.praises.length)];
        if (first) {
          const c = combo + 1;
          setCombo(c);
          setBestCombo((b) => Math.max(b, c));
          setTimeout(() => sound.star(), 250);
          if (c >= 2) setTimeout(() => sound.combo(c), 500);
        } else {
          praise = t.quiz.praiseRetry;
        }
        setMood("happy");
        setMoodTick((n) => n + 1);
        setMsg(praise);
        setBurst((n) => n + 1);
      } else {
        sound.wrong();
        if (first) setCombo(0);
        setMood("sad");
        setMoodTick((n) => n + 1);
        setMsg(t.quiz.tryAgain);
      }
    },
    [qs, idx, combo, sound],
  );

  const advance = () => {
    setIdx((i) => i + 1);
    setSolved(false);
    setMood("idle");
    setMsg(t.quiz.pickAnswer);
    setPhase("play");
  };

  const finish = () => {
    if (!qs || savedRef.current) return;
    savedRef.current = true;
    const seconds = Math.max(1, Math.round((Date.now() - startRef.current) / 1000));
    const correct = outcomes.filter((o) => o.first).length;
    const byCategory: Partial<Record<Category, { total: number; correct: number }>> = {};
    for (const o of outcomes) {
      const cur = byCategory[o.category] ?? { total: 0, correct: 0 };
      byCategory[o.category] = { total: cur.total + 1, correct: cur.correct + (o.first ? 1 : 0) };
    }
    const res = addSession({
      level,
      category: cat,
      total: qs.length,
      correct,
      seconds,
      bestCombo,
      byCategory,
      questionIds: qs.map((q) => q.id),
    });
    setResult({ ...res, correct, total: qs.length, seconds });
    setPhase("done");
    setMood("cheer");
    sound.complete();
    setBurst((n) => n + 1);
  };

  const handleNext = () => {
    sound.tap();
    if (idx + 1 >= total) {
      finish();
      return;
    }
    if (idx + 1 === MILESTONE) {
      setPhase("milestone");
      sound.star();
      setBurst((n) => n + 1);
      return;
    }
    advance();
  };

  if (!qs) {
    return (
      <PageShell back={{ href: backHref }}>
        <div className="mt-20 text-center text-sky-900">
          <Bi {...t.quiz.loading} zhClassName="text-3xl" />
        </div>
      </PageShell>
    );
  }
  if (qs.length === 0) {
    return (
      <PageShell back={{ href: backHref }}>
        <div className="mt-20 text-center text-sky-900">
          <Bi {...t.quiz.noQuestions} zhClassName="text-3xl" />
        </div>
      </PageShell>
    );
  }

  const stars = outcomes.filter((o) => o.first).length;
  const done = phase === "done" ? total : idx + (solved ? 1 : 0);
  const catLabel = cat === "mix" ? t.topics.mix : CATEGORY_INFO[cat];

  return (
    <PageShell back={{ href: backHref }}>
      <Confetti trigger={burst} big={phase === "done"} />

      {phase !== "done" && (
        <>
          <div className="mb-2 flex items-center justify-between gap-2 text-sky-950">
            <span className="rounded-full bg-white/80 px-3 py-1">
              <Bi zh={`${level} · ${catLabel.zh}`} en={`${level} · ${catLabel.en}`} align="left" zhClassName="text-base" enClassName="text-xs" />
            </span>
            <span className="flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-2xl font-black text-yellow-600">
              <GlyphIcon kind="star" size={28} />
              {stars}
            </span>
          </div>
          <ProgressBar done={done} total={total} milestone={MILESTONE} />

          <div className="my-2 flex items-center gap-2">
            <CharacterMascot mood={mood} tick={moodTick} size={84} />
            <div
              key={`${msg.zh}-${moodTick}`}
              className={`animate-slide-up relative flex-1 rounded-3xl border-4 px-3 py-2 text-center ${
                mood === "sad"
                  ? "border-orange-300 bg-orange-50 text-orange-900"
                  : mood === "happy"
                    ? "border-green-300 bg-green-50 text-green-900"
                    : "border-white bg-white/90 text-sky-900"
              }`}
              aria-live="polite"
            >
              <Bi {...msg} zhClassName="text-xl" enClassName="text-sm" />
            </div>
            {combo >= 2 && (
              <div
                key={combo}
                className="animate-combo rounded-3xl border-4 border-pink-400 bg-gradient-to-b from-yellow-200 to-pink-200 px-3 py-2 text-center text-pink-700 shadow-lg"
              >
                <div className="text-2xl" aria-hidden="true">
                  🔥
                </div>
                <Bi {...t.quiz.combo(combo)} zhClassName="text-base" enClassName="text-xs" />
              </div>
            )}
          </div>

          <MathQuestion
            key={qs[idx].id}
            question={qs[idx]}
            onAnswered={handleAnswered}
            onNext={handleNext}
            isLast={idx + 1 >= total}
            message={msg}
          />
        </>
      )}

      {phase === "milestone" && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-sky-900/50 p-4">
          <div className="animate-pop w-full max-w-sm rounded-[2rem] border-4 border-white bg-white p-6 text-center shadow-2xl">
            <CharacterMascot mood="cheer" size={110} />
            <div className="my-2 flex justify-center">
              <GlyphIcon kind="star" size={84} className="animate-pulse-soft" />
            </div>
            <h2 className="text-pink-600">
              <Bi {...t.quiz.midTitle} zhClassName="text-3xl" enClassName="text-lg" />
            </h2>
            <p className="mt-1 text-slate-700">
              <Bi {...t.quiz.midText} zhClassName="text-lg" enClassName="text-sm" />
            </p>
            <button
              type="button"
              onClick={() => {
                sound.tap();
                advance();
              }}
              className="btn-big mt-5 w-full border-pink-700 bg-pink-500 px-6 text-2xl text-white"
            >
              <Bi {...t.common.continue} />
            </button>
          </div>
        </div>
      )}

      {phase === "done" && result && (
        <ResultCard
          stars={result.stars}
          correct={result.correct}
          total={result.total}
          seconds={result.seconds}
          sticker={result.sticker}
          newBadges={result.newBadges}
          onAgain={() => setRound((r) => r + 1)}
        />
      )}

      {phase === "done" && (
        <p className="mt-4 text-center">
          <Link href="/report" className="inline-flex min-h-16 items-center rounded-2xl px-4 text-sky-900 underline">
            <Bi {...t.home.parent} zhClassName="text-lg" enClassName="text-sm" />
          </Link>
        </p>
      )}
    </PageShell>
  );
}
