"use client";
import { useSound } from "@/hooks/useSound";
import { t } from "@/lib/i18n";

/** 音效與音樂開關（預設開啟） / sound & music toggles (on by default) */
export default function SoundToggle() {
  const s = useSound();
  const soundLabel = s.soundOn ? t.common.soundOn : t.common.soundOff;
  const musicLabel = s.musicOn ? t.common.musicOn : t.common.musicOff;
  const base =
    "flex h-16 w-16 items-center justify-center rounded-2xl border-b-4 text-3xl shadow-md transition active:translate-y-0.5";
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => {
          s.toggleSound();
          // 開啟時播一下聲音確認 / confirm with a tap when turning on
          if (!s.soundOn) setTimeout(() => s.tap(), 30);
        }}
        aria-pressed={s.soundOn}
        aria-label={`${soundLabel.zh} / ${soundLabel.en}`}
        title={`${soundLabel.zh} / ${soundLabel.en}`}
        className={`${base} ${s.soundOn ? "border-yellow-500 bg-yellow-300" : "border-slate-400 bg-slate-200"}`}
      >
        <span aria-hidden="true">{s.soundOn ? "🔊" : "🔇"}</span>
      </button>
      <button
        type="button"
        onClick={() => {
          s.tap();
          s.toggleMusic();
        }}
        aria-pressed={s.musicOn}
        aria-label={`${musicLabel.zh} / ${musicLabel.en}`}
        title={`${musicLabel.zh} / ${musicLabel.en}`}
        className={`${base} ${s.musicOn ? "border-pink-500 bg-pink-300" : "border-slate-400 bg-slate-200"}`}
      >
        <span aria-hidden="true">{s.musicOn ? "🎵" : "🔕"}</span>
      </button>
    </div>
  );
}
