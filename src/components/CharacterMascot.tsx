"use client";
// 數學熊 Math Bear — 純 SVG + CSS 動畫 / pure SVG + CSS animation

export type Mood = "idle" | "happy" | "sad" | "cheer";

interface Props {
  mood?: Mood;
  /** 改變 tick 會重新播放動畫 / change `tick` to replay the animation */
  tick?: number;
  size?: number;
  className?: string;
}

export default function CharacterMascot({ mood = "idle", tick = 0, size = 110, className = "" }: Props) {
  const anim =
    mood === "happy" ? "animate-jump" : mood === "sad" ? "animate-shake" : mood === "cheer" ? "animate-jump" : "animate-floaty";
  const happy = mood === "happy" || mood === "cheer";
  const sad = mood === "sad";
  return (
    <div
      key={`${mood}-${tick}`}
      className={`${anim} inline-block ${mood === "cheer" ? "[animation-iteration-count:infinite]" : ""} ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Math Bear 數學熊"
    >
      <svg viewBox="0 0 120 120" width={size} height={size}>
        {/* 耳仔 */}
        <circle cx="26" cy="30" r="16" fill="#b9743a" />
        <circle cx="26" cy="30" r="8" fill="#f9c9a8" />
        <circle cx="94" cy="30" r="16" fill="#b9743a" />
        <circle cx="94" cy="30" r="8" fill="#f9c9a8" />
        {/* 手 */}
        {happy ? (
          <>
            <ellipse cx="22" cy="78" rx="9" ry="14" fill="#c98544" transform="rotate(-30 22 78)" />
            <ellipse cx="98" cy="78" rx="9" ry="14" fill="#c98544" transform="rotate(30 98 78)" />
          </>
        ) : (
          <>
            <ellipse cx="26" cy="100" rx="9" ry="14" fill="#c98544" transform="rotate(12 26 100)" />
            <ellipse cx="94" cy="100" rx="9" ry="14" fill="#c98544" transform="rotate(-12 94 100)" />
          </>
        )}
        {/* 身體（藍色衫） */}
        <ellipse cx="60" cy="102" rx="30" ry="20" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
        <text x="60" y="110" textAnchor="middle" fontSize="20" fontWeight="900" fill="#fff">
          +
        </text>
        {/* 頭 */}
        <circle cx="60" cy="58" r="40" fill="#d49455" />
        <ellipse cx="60" cy="72" rx="17" ry="13" fill="#f8dcb8" />
        {/* 面頰 */}
        <circle cx="36" cy="68" r="6.5" fill="#f9a8d4" opacity=".7" />
        <circle cx="84" cy="68" r="6.5" fill="#f9a8d4" opacity=".7" />
        {/* 眼 */}
        {happy ? (
          <>
            <path d="M38 56q7-10 14 0" stroke="#3b2415" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M68 56q7-10 14 0" stroke="#3b2415" strokeWidth="4" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <g className="animate-blink">
            <circle cx="45" cy="55" r="5" fill="#3b2415" />
            <circle cx="75" cy="55" r="5" fill="#3b2415" />
            <circle cx="46.6" cy="53.2" r="1.7" fill="#fff" />
            <circle cx="76.6" cy="53.2" r="1.7" fill="#fff" />
          </g>
        )}
        {sad && (
          <>
            <path d="M37 45q8-4 15 0" stroke="#7a4a22" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M68 45q8-4 15 0" stroke="#7a4a22" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        )}
        {/* 鼻同嘴 */}
        <ellipse cx="60" cy="67" rx="5.5" ry="4" fill="#4b2e1a" />
        {happy ? (
          <path d="M50 75q10 12 20 0z" fill="#b91c1c" stroke="#4b2e1a" strokeWidth="2" strokeLinejoin="round" />
        ) : sad ? (
          <path d="M53 79q7-5 14 0" stroke="#4b2e1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M52 75q8 7 16 0" stroke="#4b2e1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        )}
        <line x1="60" y1="71" x2="60" y2="75" stroke="#4b2e1a" strokeWidth="2" />
        {/* 蝴蝶結 */}
        <polygon points="60,86 48,80 48,92" fill="#f472b6" stroke="#be185d" strokeWidth="1.5" strokeLinejoin="round" />
        <polygon points="60,86 72,80 72,92" fill="#f472b6" stroke="#be185d" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="60" cy="86" r="4" fill="#ec4899" />
      </svg>
    </div>
  );
}
