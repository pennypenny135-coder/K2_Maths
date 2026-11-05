"use client";
import Link from "next/link";
import { getCategoriesForLevel } from "@/data/questions";
import type { Level } from "@/data/types";
import { useSound } from "@/hooks/useSound";
import { CATEGORY_INFO, t } from "@/lib/i18n";
import Bi from "./Bi";
import CharacterMascot from "./CharacterMascot";
import PageShell from "./PageShell";

export default function TopicSelect({ level }: { level: Level }) {
  const sound = useSound();
  const cats = getCategoriesForLevel(level);
  const lv = level.toLowerCase();

  return (
    <PageShell back={{ href: "/" }} title={t.topics.title(level)}>
      <div className="mb-4 flex items-center justify-center gap-3 text-sky-950">
        <CharacterMascot mood="idle" size={90} />
        <div className="rounded-3xl border-4 border-white bg-white/90 px-4 py-2">
          <Bi {...t.topics.pick} zhClassName="text-2xl" enClassName="text-base" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {cats.map((c) => {
          const info = CATEGORY_INFO[c];
          return (
            <Link
              key={c}
              href={`/quiz?level=${level}&cat=${c}`}
              onClick={() => sound.tap()}
              className={`btn-big min-h-[120px] flex-col gap-1 px-2 text-white shadow-lg ${info.card}`}
            >
              <span className="text-5xl drop-shadow" aria-hidden="true">
                {info.emoji}
              </span>
              <Bi zh={info.zh} en={info.en} zhClassName="text-2xl" enClassName="text-base" />
            </Link>
          );
        })}
        <Link
          href={`/quiz?level=${level}&cat=mix`}
          onClick={() => sound.tap()}
          className="btn-big col-span-2 min-h-[100px] gap-4 border-purple-700 bg-gradient-to-r from-purple-500 to-pink-500 px-4 text-white shadow-lg md:col-span-3"
          data-level={lv}
        >
          <span className="text-5xl" aria-hidden="true">
            🎲
          </span>
          <span className="flex flex-col items-start">
            <Bi {...t.topics.mix} align="left" zhClassName="text-2xl" enClassName="text-base" />
            <span className="text-sm font-semibold opacity-90">
              {t.topics.mixHint.zh} · {t.topics.mixHint.en}
            </span>
          </span>
        </Link>
      </div>
    </PageShell>
  );
}
