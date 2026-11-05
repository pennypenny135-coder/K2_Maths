"use client";
import { useEffect, useRef, useState } from "react";
import type { Question } from "@/data/types";
import { CATEGORY_INFO, t, type Bi as BiText } from "@/lib/i18n";
import { useSound } from "@/hooks/useSound";
import Bi from "./Bi";
import Visual from "./Visual";

export interface AnswerEvent {
  correct: boolean;
  /** 這是否小朋友第一次作答 / was this the child's first attempt */
  first: boolean;
}

interface Props {
  question: Question;
  onAnswered: (e: AnswerEvent) => void;
  onNext: () => void;
  isLast: boolean;
  /** 吉祥物訊息（稱讚或鼓勵） / mascot message (praise or encouragement) */
  message: BiText;
}

const CHOICE_STYLES = [
  "border-sky-500 bg-sky-50",
  "border-yellow-500 bg-yellow-50",
  "border-pink-500 bg-pink-50",
  "border-emerald-500 bg-emerald-50",
];

function speak(zh: string, en: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const a = new SpeechSynthesisUtterance(zh);
  a.lang = "zh-HK";
  a.rate = 0.85;
  const b = new SpeechSynthesisUtterance(en);
  b.lang = "en-US";
  b.rate = 0.85;
  synth.speak(a);
  synth.speak(b);
}

export default function MathQuestion({ question: q, onAnswered, onNext, isLast, message }: Props) {
  const sound = useSound();
  const [wrong, setWrong] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);
  const [shakeIdx, setShakeIdx] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (solved || wrong.length > 0) {
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [solved, wrong.length]);

  const pick = (i: number) => {
    if (solved || wrong.includes(i)) return;
    const first = wrong.length === 0;
    if (i === q.correctIndex) {
      setSolved(true);
      onAnswered({ correct: true, first });
    } else {
      setWrong((w) => [...w, i]);
      setShakeIdx(i);
      onAnswered({ correct: false, first });
    }
  };

  const category = CATEGORY_INFO[q.category];
  const singleCol = q.choices.some((c) => !c.visual && (c.zh.length > 8 || c.en.length > 15));

  return (
    <section className="animate-slide-up rounded-[2rem] border-4 border-white bg-white/90 p-4 shadow-xl" aria-live="polite">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-sky-900">
          <span aria-hidden="true">{category.emoji}</span>
          <Bi zh={q.topic} en={q.topicEn} align="left" zhClassName="text-sm" enClassName="text-[0.7rem]" />
        </span>
        <button
          type="button"
          onClick={() => {
            sound.tap();
            if (sound.soundOn) speak(q.questionZh, q.questionEn);
          }}
          className="btn-big min-h-16 gap-2 border-violet-600 bg-violet-400 px-4 text-lg text-white"
          aria-label="朗讀題目 Read the question aloud"
        >
          <span aria-hidden="true" className="text-2xl">
            🗣️
          </span>
          <Bi {...t.common.read} />
        </button>
      </div>

      <h2 className="my-2 text-center text-slate-900">
        <Bi zh={q.questionZh} en={q.questionEn} zhClassName="text-[1.7rem] leading-snug" enClassName="text-[1.05rem] font-bold text-slate-700" />
      </h2>

      <div className="mb-4 flex min-h-[150px] items-center justify-center rounded-3xl bg-gradient-to-b from-sky-50 to-emerald-50 p-3">
        <Visual spec={q} />
      </div>

      <div className={`grid gap-3 ${singleCol ? "grid-cols-1" : "grid-cols-2"}`}>
        {q.choices.map((c, i) => {
          const isWrong = wrong.includes(i);
          const isRight = solved && i === q.correctIndex;
          const state = isRight
            ? "border-green-600 bg-green-200 animate-pop ring-4 ring-green-300"
            : isWrong
              ? `border-slate-300 bg-slate-100 opacity-60 ${shakeIdx === i ? "animate-wobble" : ""}`
              : CHOICE_STYLES[i % 4];
          return (
            <button
              key={i}
              type="button"
              onClick={() => pick(i)}
              disabled={solved || isWrong}
              aria-label={`${c.zh} ${c.en}`}
              className={`btn-big relative min-h-[88px] flex-col gap-1 px-2 py-2 text-slate-900 shadow-md disabled:cursor-default ${state}`}
            >
              {c.visual && (
                <span className="flex min-h-[44px] items-center justify-center">
                  <Visual spec={c.visual} compact />
                </span>
              )}
              <span className="flex items-center justify-center gap-2">
                {c.swatch && (
                  <span
                    className="inline-block h-6 w-6 shrink-0 rounded-full border-2 border-black/30"
                    style={{ background: c.swatch }}
                    aria-hidden="true"
                  />
                )}
                <Bi zh={c.zh} en={c.en} zhClassName={c.visual ? "text-xl" : "text-[1.7rem]"} enClassName={c.visual ? "text-sm" : "text-base"} />
              </span>
              {isRight && (
                <span className="absolute -right-2 -top-3 text-3xl" aria-hidden="true">
                  ✅
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div ref={panelRef} className="mt-4">
        {!solved && wrong.length > 0 && (
          <div className="animate-slide-up rounded-3xl border-4 border-orange-300 bg-orange-50 p-3 text-center text-orange-900">
            <span aria-hidden="true" className="mr-1 text-2xl">
              💪
            </span>
            <Bi {...t.quiz.tryAgain} zhClassName="text-2xl" enClassName="text-base" />
          </div>
        )}
        {solved && (
          <div className="animate-slide-up space-y-3">
            <div className="rounded-3xl border-4 border-green-300 bg-green-50 p-3 text-green-900">
              <div className="text-center">
                <Bi {...message} zhClassName="text-2xl" enClassName="text-base" />
              </div>
              <div className="mt-2 rounded-2xl bg-white/80 p-2">
                <div className="mb-1 text-sm font-bold text-green-700">
                  💡 {t.quiz.why.zh} / {t.quiz.why.en}
                </div>
                <Bi zh={q.explanationZh} en={q.explanationEn} align="left" zhClassName="text-lg font-bold" enClassName="text-sm" />
              </div>
            </div>
            <button
              type="button"
              onClick={onNext}
              className="btn-big w-full gap-3 border-pink-700 bg-pink-500 px-6 text-2xl text-white shadow-lg"
            >
              <Bi {...(isLast ? t.common.finish : t.common.next)} />
              <span aria-hidden="true" className="text-3xl">
                ▶
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
