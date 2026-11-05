"use client";
import Link from "next/link";
import { t } from "@/lib/i18n";
import type { BadgeDef } from "@/lib/rewards";
import { useSound } from "@/hooks/useSound";
import type { Color, ObjectKind } from "@/data/types";
import Bi from "./Bi";
import CharacterMascot from "./CharacterMascot";
import { GlyphIcon } from "./Glyph";

interface Props {
  stars: number;
  correct: number;
  total: number;
  seconds: number;
  sticker?: string;
  newBadges: BadgeDef[];
  onAgain: () => void;
}

export function StickerIcon({ value, size = 72 }: { value: string; size?: number }) {
  const [kind, color] = value.split(":") as [ObjectKind, Color];
  return (
    <span
      className="inline-flex items-center justify-center rounded-full border-4 border-dashed border-pink-300 bg-white shadow"
      style={{ width: size + 16, height: size + 16 }}
    >
      <GlyphIcon kind={kind} color={color} size={size} />
    </span>
  );
}

export default function ResultCard({ stars, correct, total, seconds, sticker, newBadges, onAgain }: Props) {
  const sound = useSound();
  const accuracy = total === 0 ? 0 : Math.round((correct / total) * 100);
  const time = t.result.minSec(seconds);
  const msg = stars >= 3 ? t.result.msg3 : stars === 2 ? t.result.msg2 : t.result.msg1;

  return (
    <section className="animate-slide-up rounded-[2rem] border-4 border-white bg-white/90 p-5 text-center shadow-xl">
      <div className="flex justify-center">
        <CharacterMascot mood="cheer" size={130} />
      </div>
      <h2 className="text-sky-950">
        <Bi {...t.result.title} zhClassName="text-4xl" enClassName="text-xl" />
      </h2>
      <p className="mt-1 text-pink-600">
        <Bi {...msg} zhClassName="text-xl" enClassName="text-base" />
      </p>

      <div className="my-4 flex items-end justify-center gap-2" aria-label={`${stars} stars`}>
        {[1, 2, 3].map((n) => (
          <GlyphIcon
            key={n}
            kind="star"
            size={n === 2 ? 92 : 72}
            muted={n > stars}
            className={n <= stars ? "animate-pop" : ""}
            style={{ animationDelay: `${n * 250}ms` }}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 text-slate-900">
        <div className="rounded-2xl bg-yellow-100 p-2">
          <Bi {...t.result.score} zhClassName="text-sm" enClassName="text-xs" />
          <div className="text-3xl font-black text-yellow-700">
            {correct}/{total}
          </div>
        </div>
        <div className="rounded-2xl bg-emerald-100 p-2">
          <Bi {...t.result.accuracy} zhClassName="text-sm" enClassName="text-xs" />
          <div className="text-3xl font-black text-emerald-700">{accuracy}%</div>
        </div>
        <div className="rounded-2xl bg-sky-100 p-2">
          <Bi {...t.result.time} zhClassName="text-sm" enClassName="text-xs" />
          <div className="mt-1 text-sky-800">
            <Bi {...time} zhClassName="text-lg" enClassName="text-xs" />
          </div>
        </div>
      </div>

      {sticker && (
        <div className="mt-4 flex items-center justify-center gap-3 rounded-3xl bg-pink-50 p-3 text-pink-700">
          <StickerIcon value={sticker} />
          <Bi {...t.result.newSticker} zhClassName="text-2xl" enClassName="text-base" />
        </div>
      )}

      {newBadges.map((b) => (
        <div key={b.id} className="mt-3 flex items-center justify-center gap-3 rounded-3xl bg-amber-50 p-3 text-amber-800">
          <span className="animate-pop text-5xl" aria-hidden="true">
            {b.emoji}
          </span>
          <div className="text-left">
            <Bi {...t.result.newBadge} align="left" zhClassName="text-lg" enClassName="text-sm" />
            <div>
              <Bi {...b.name} align="left" zhClassName="text-xl" enClassName="text-sm" />
            </div>
          </div>
        </div>
      ))}

      <div className="mt-5 grid gap-3">
        <button
          type="button"
          onClick={() => {
            sound.tap();
            onAgain();
          }}
          className="btn-big w-full gap-3 border-pink-700 bg-pink-500 px-6 text-2xl text-white shadow-lg"
        >
          <span aria-hidden="true" className="text-3xl">
            🔄
          </span>
          <Bi {...t.common.playAgain} />
        </button>
        <Link
          href="/"
          onClick={() => sound.tap()}
          className="btn-big w-full gap-3 border-sky-700 bg-sky-500 px-6 text-2xl text-white shadow-lg"
        >
          <span aria-hidden="true" className="text-3xl">
            🏠
          </span>
          <Bi {...t.common.home} />
        </Link>
      </div>
    </section>
  );
}
