"use client";
import Link from "next/link";
import Bi from "@/components/Bi";
import CharacterMascot from "@/components/CharacterMascot";
import { GlyphIcon } from "@/components/Glyph";
import PageShell from "@/components/PageShell";
import { StickerIcon } from "@/components/ResultCard";
import { useProgress } from "@/hooks/useProgress";
import { useSound } from "@/hooks/useSound";
import { t } from "@/lib/i18n";
import { BADGES, earnedBadgeIds } from "@/lib/rewards";

export default function RewardsPage() {
  const { progress } = useProgress();
  const sound = useSound();
  const earned = earnedBadgeIds(progress);

  return (
    <PageShell back={{ href: "/" }} title={t.rewards.title}>
      <section className="rounded-[2rem] border-4 border-white bg-white/90 p-4 text-center shadow-xl">
        <div className="flex items-center justify-center gap-3">
          <CharacterMascot mood={progress.totalStars > 0 ? "happy" : "idle"} size={96} />
          <div className="text-yellow-700">
            <Bi {...t.rewards.totalStars} zhClassName="text-xl" enClassName="text-sm" />
            <div className="flex items-center justify-center gap-1 text-5xl font-black">
              <GlyphIcon kind="star" size={52} className="animate-pulse-soft" />
              {progress.totalStars}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4 rounded-[2rem] border-4 border-white bg-white/90 p-4 shadow-xl">
        <h2 className="mb-3 text-center text-sky-950">
          <Bi {...t.rewards.badges} zhClassName="text-2xl" enClassName="text-base" />
        </h2>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {BADGES.map((b) => {
            const ok = earned.has(b.id);
            return (
              <li
                key={b.id}
                className={`flex flex-col items-center gap-1 rounded-3xl border-4 p-3 text-center ${
                  ok ? "border-yellow-400 bg-yellow-50 text-amber-900" : "border-slate-200 bg-slate-100 text-slate-500"
                }`}
              >
                <span className={`text-5xl ${ok ? "animate-floaty" : "opacity-30 grayscale"}`} aria-hidden="true">
                  {ok ? b.emoji : "🔒"}
                </span>
                <Bi {...b.name} zhClassName="text-lg" enClassName="text-xs" />
                <Bi {...b.desc} zhClassName="text-xs font-semibold" enClassName="text-[0.65rem]" />
                {!ok && <span className="text-xs font-bold">{t.rewards.locked.zh} / {t.rewards.locked.en}</span>}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-4 rounded-[2rem] border-4 border-white bg-white/90 p-4 shadow-xl">
        <h2 className="mb-3 text-center text-sky-950">
          <Bi {...t.rewards.stickers} zhClassName="text-2xl" enClassName="text-base" />
        </h2>
        {progress.stickers.length === 0 ? (
          <p className="text-center text-slate-600">
            <Bi {...t.rewards.noStickers} zhClassName="text-lg" enClassName="text-sm" />
          </p>
        ) : (
          <div className="flex flex-wrap justify-center gap-3">
            {progress.stickers.map((s, i) => (
              <StickerIcon key={i} value={s} size={56} />
            ))}
          </div>
        )}
      </section>

      <Link
        href="/"
        onClick={() => sound.tap()}
        className="btn-big mt-5 w-full gap-3 border-sky-700 bg-sky-500 px-6 text-2xl text-white shadow-lg"
      >
        <span aria-hidden="true">🎮</span>
        <Bi {...t.rewards.play} />
      </Link>
    </PageShell>
  );
}
