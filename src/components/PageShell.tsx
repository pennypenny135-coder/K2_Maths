"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Bi as BiText } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { useSound } from "@/hooks/useSound";
import Bi from "./Bi";
import SoundToggle from "./SoundToggle";

interface Props {
  children: ReactNode;
  /** 返回連結；設為 null 即不顯示（主頁） */
  back?: { href: string; label?: BiText } | null;
  title?: BiText;
  /** 標題旁邊的小字 */
  subtitle?: BiText;
}

export default function PageShell({ children, back = { href: "/" }, title, subtitle }: Props) {
  const sound = useSound();
  return (
    <div className="relative min-h-dvh overflow-x-hidden pb-14">
      <div className="cloud left-0 top-16 h-8 w-28" style={{ animationDuration: "55s" }} aria-hidden="true" />
      <div className="cloud left-0 top-44 h-6 w-20 opacity-70" style={{ animationDuration: "80s", animationDelay: "-30s" }} aria-hidden="true" />
      <div className="relative z-10 mx-auto w-full max-w-md px-4 pt-3 md:max-w-2xl lg:max-w-3xl">
        <header className="flex min-h-16 items-center justify-between gap-2">
          {back ? (
            <Link
              href={back.href}
              onClick={() => sound.tap()}
              className="btn-big gap-2 border-sky-700 bg-white px-5 text-xl text-sky-800 shadow-md"
            >
              <span aria-hidden="true" className="text-2xl">
                ◀
              </span>
              <Bi {...(back.label ?? t.common.back)} />
            </Link>
          ) : (
            <span />
          )}
          <SoundToggle />
        </header>
        {title && (
          <div className="mb-4 mt-3 text-center text-sky-950">
            <h1>
              <Bi {...title} zhClassName="text-3xl md:text-4xl" enClassName="text-lg" />
            </h1>
            {subtitle && (
              <p className="mt-1">
                <Bi {...subtitle} zhClassName="text-base" />
              </p>
            )}
          </div>
        )}
        {children}
      </div>
      <div className="grass" aria-hidden="true" />
    </div>
  );
}
