import { t } from "@/lib/i18n";
import Bi from "./Bi";
import { GlyphIcon } from "./Glyph";

interface Props {
  done: number;
  total?: number;
  /** 每 5 題一個小獎勵 / small reward every 5 questions */
  milestone?: number;
}

export default function ProgressBar({ done, total = 10, milestone = 5 }: Props) {
  const label = t.quiz.progress(done, total);
  return (
    <div className="w-full" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={done}>
      <div className="mb-1 flex items-center justify-between text-base text-sky-950">
        <Bi {...label} align="left" />
        <div className="flex items-center gap-1">
          <GlyphIcon kind="star" size={26} muted={done < milestone} className={done >= milestone ? "animate-pulse-soft" : ""} />
          <GlyphIcon kind="star" size={26} color="orange" muted={done < total} className={done >= total ? "animate-pulse-soft" : ""} />
        </div>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`h-5 flex-1 rounded-full border-2 transition-colors duration-500 ${
              i < done
                ? i + 1 === milestone || i + 1 === total
                  ? "border-pink-500 bg-pink-400"
                  : "border-yellow-500 bg-yellow-300"
                : "border-sky-300 bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
