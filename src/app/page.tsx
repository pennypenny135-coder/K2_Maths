"use client";
import Link from "next/link";
import Bi from "@/components/Bi";
import CharacterMascot from "@/components/CharacterMascot";
import PageShell from "@/components/PageShell";
import { useSound } from "@/hooks/useSound";
import { t } from "@/lib/i18n";

export default function HomePage() {
  const sound = useSound();
  const tap = () => sound.tap();

  return (
    <PageShell back={null}>
      <div className="mt-2 text-center">
        <div className="flex justify-center">
          <CharacterMascot mood="idle" size={150} />
        </div>
        <h1 className="mt-1 text-sky-950 drop-shadow-sm">
          <Bi {...t.appName} zhClassName="text-4xl md:text-5xl" enClassName="text-xl" />
        </h1>
        <p className="mt-1 text-pink-600">
          <Bi {...t.tagline} zhClassName="text-xl" enClassName="text-base" />
        </p>
      </div>

      <nav className="mt-6 grid gap-4" aria-label="Main menu 主選單">
        <Link
          href="/k2"
          onClick={tap}
          className="btn-big min-h-24 justify-between border-sky-700 bg-sky-500 px-6 text-white shadow-lg"
        >
          <Bi {...t.home.startK2} zhClassName="text-3xl" enClassName="text-lg" />
          <span className="rounded-full bg-white/90 px-3 py-1 text-sky-700">
            <Bi {...t.home.ageK2} zhClassName="text-sm" enClassName="text-xs" />
          </span>
        </Link>
        <Link
          href="/k3"
          onClick={tap}
          className="btn-big min-h-24 justify-between border-green-700 bg-green-500 px-6 text-white shadow-lg"
        >
          <Bi {...t.home.startK3} zhClassName="text-3xl" enClassName="text-lg" />
          <span className="rounded-full bg-white/90 px-3 py-1 text-green-700">
            <Bi {...t.home.ageK3} zhClassName="text-sm" enClassName="text-xs" />
          </span>
        </Link>
        <Link
          href="/rewards"
          onClick={tap}
          className="btn-big min-h-20 gap-3 border-yellow-600 bg-yellow-300 px-6 text-yellow-950 shadow-lg"
        >
          <span className="text-4xl" aria-hidden="true">
            ⭐
          </span>
          <Bi {...t.home.stars} zhClassName="text-2xl" enClassName="text-base" />
        </Link>
        <Link
          href="/report"
          onClick={tap}
          className="btn-big min-h-20 gap-3 border-pink-600 bg-pink-300 px-6 text-pink-950 shadow-lg"
        >
          <span className="text-4xl" aria-hidden="true">
            👨‍👩‍👧
          </span>
          <Bi {...t.home.parent} zhClassName="text-2xl" enClassName="text-base" />
        </Link>
      </nav>
    </PageShell>
  );
}
