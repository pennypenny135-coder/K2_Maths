"use client";
// 題目圖形：全部用 SVG / CSS 即時畫出，不使用外部圖片。
// Question visuals: everything is drawn with SVG/CSS — no external images.
import type {
  BarChartConfig,
  ClockConfig,
  Glyph,
  GlyphsConfig,
  LengthConfig,
  MoneyConfig,
  NumberRowConfig,
  ObjectGroupsConfig,
  ObjectsConfig,
  PatternConfig,
  PositionConfig,
  VisualSpec,
} from "@/data/types";
import { COLOR_INFO } from "@/data/vocab";
import { GlyphIcon, SolidIcon } from "./Glyph";

// ---------- 物件 ----------
function ObjectsView({ cfg, compact }: { cfg: ObjectsConfig; compact: boolean }) {
  const { kind, count, color, crossed = 0, layout = "wrap" } = cfg;
  const pairs = layout === "pairs";
  const perRow = pairs ? 2 : count <= 5 ? Math.max(count, 1) : count <= 10 ? 5 : 10;
  const size = pairs
    ? compact ? 20 : 34
    : compact
      ? count > 10 ? 14 : count > 6 ? 20 : 26
      : count > 10 ? 28 : count > 5 ? 42 : 52;
  return (
    <div
      className="grid justify-center"
      style={{
        gridTemplateColumns: `repeat(${perRow}, ${size}px)`,
        gap: pairs ? `2px ${compact ? 8 : 16}px` : "3px",
      }}
    >
      {Array.from({ length: count }, (_, i) => (
        <GlyphIcon
          key={i}
          kind={kind}
          color={color}
          size={size}
          crossed={i >= count - crossed}
          className="animate-pop"
          style={{ animationDelay: `${i * 45}ms` }}
        />
      ))}
    </div>
  );
}

function GroupsView({ cfg, compact }: { cfg: ObjectGroupsConfig; compact: boolean }) {
  const maxC = Math.max(...cfg.groups.map((g) => g.count));
  if (cfg.op === "vs") {
    const size = compact ? 18 : 30;
    return (
      <div className="flex flex-col items-start gap-1.5">
        {cfg.groups.map((g, gi) => (
          <div key={gi} className="flex gap-1 rounded-xl bg-white/80 px-2 py-1 shadow-sm">
            {Array.from({ length: g.count }, (_, i) => (
              <GlyphIcon
                key={i}
                kind={g.kind}
                color={g.color}
                size={size}
                className="animate-pop"
                style={{ animationDelay: `${(gi * 4 + i) * 40}ms` }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }
  const size = compact ? 18 : maxC > 5 ? 30 : 42;
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {cfg.groups.map((g, gi) => {
        const perRow = g.count <= 5 ? Math.max(g.count, 1) : 5;
        return (
          <div key={gi} className="flex items-center gap-2">
            {gi > 0 && <span className="text-4xl font-black text-pink-500">+</span>}
            <div
              className="grid gap-1 rounded-2xl bg-white/80 p-2 shadow-sm"
              style={{ gridTemplateColumns: `repeat(${perRow}, ${size}px)` }}
            >
              {Array.from({ length: g.count }, (_, i) => (
                <GlyphIcon
                  key={i}
                  kind={g.kind}
                  color={g.color}
                  size={size}
                  className="animate-pop"
                  style={{ animationDelay: `${(gi * 5 + i) * 45}ms` }}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function GlyphsView({ cfg, compact }: { cfg: GlyphsConfig; compact: boolean }) {
  const n = cfg.glyphs.length;
  const base = compact ? 34 : n > 10 ? 36 : n > 5 ? 44 : 50;
  return (
    <div
      className={`flex flex-wrap justify-center gap-1.5 ${cfg.align === "bottom" ? "items-end" : "items-center"}`}
    >
      {cfg.glyphs.map((g, i) => (
        <GlyphIcon
          key={i}
          kind={g.kind}
          color={g.color}
          size={Math.round(base * (g.size ?? 1))}
          className="animate-pop"
          style={{ animationDelay: `${i * 50}ms` }}
        />
      ))}
    </div>
  );
}

function LengthView({ cfg, compact }: { cfg: LengthConfig; compact: boolean }) {
  return (
    <div className={`flex w-full flex-col ${compact ? "max-w-[120px] gap-1" : "max-w-[300px] gap-2.5"}`}>
      {cfg.bars.map((b, i) => (
        <div
          key={i}
          className={`animate-grow-x rounded-full border-2 border-black/20 shadow-sm ${compact ? "h-3" : "h-8"}`}
          style={{
            width: `${b.length * 9 + 8}%`,
            background: COLOR_INFO[b.color].hex,
            animationDelay: `${i * 90}ms`,
          }}
        />
      ))}
    </div>
  );
}

// ---------- 規律 ----------
function PatternView({ cfg }: { cfg: PatternConfig }) {
  const size = cfg.sequence.length >= 7 ? 36 : 46;
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5">
      {cfg.sequence.map((g, i) => (
        <GlyphIcon key={i} kind={g.kind} color={g.color} size={size} className="animate-pop" style={{ animationDelay: `${i * 70}ms` }} />
      ))}
      {Array.from({ length: cfg.blanks }, (_, i) => (
        <div
          key={`b${i}`}
          className="animate-pulse-soft flex items-center justify-center rounded-xl border-4 border-dashed border-pink-400 bg-white font-black text-pink-500"
          style={{ width: size + 6, height: size + 6, fontSize: size * 0.6 }}
        >
          ?
        </div>
      ))}
    </div>
  );
}

// ---------- 位置 ----------
function Flag() {
  return (
    <svg viewBox="0 0 40 64" width="34" height="54" aria-hidden="true">
      <line x1="8" y1="4" x2="8" y2="62" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
      <polygon points="10,6 38,16 10,28" fill="#ef4444" stroke="rgba(30,41,59,.5)" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function PositionView({ cfg, compact }: { cfg: PositionConfig; compact: boolean }) {
  const { scene, items, inside } = cfg;
  const size = compact ? 26 : 44;
  const icon = (g: Glyph, i: number, s = size) => (
    <GlyphIcon key={i} kind={g.kind} color={g.color} size={s} className="animate-pop" style={{ animationDelay: `${i * 80}ms` }} />
  );

  if (scene === "leftright") {
    return (
      <div className="flex flex-col items-center">
        <div className="flex items-end gap-3">{items.map((g, i) => icon(g, i, compact ? 26 : 50))}</div>
        <div className="mt-1 h-3 w-full rounded-full bg-emerald-500" />
      </div>
    );
  }
  if (scene === "updown") {
    const s = compact ? 22 : 36;
    return (
      <div className="flex flex-col items-center gap-0.5">
        {items.map((g, i) => (
          <div key={i} className="flex flex-col items-center">
            {icon(g, i, s)}
            <div className="h-2 w-28 rounded-full bg-amber-500" />
          </div>
        ))}
      </div>
    );
  }
  if (scene === "frontback") {
    return (
      <div className="flex flex-col items-center">
        <div className="flex items-end gap-3">
          {items.map((g, i) => icon(g, i, compact ? 26 : 44))}
          <Flag />
        </div>
        <div className="mt-1 h-3 w-full rounded-full bg-slate-500" style={{ backgroundImage: "repeating-linear-gradient(90deg,transparent 0 14px,rgba(255,255,255,.7) 14px 24px)" }} />
        <div className="mt-1 flex items-center gap-1 text-sm font-bold text-slate-600">
          <span>→</span>
        </div>
      </div>
    );
  }
  // inout
  const ins = items.filter((_, i) => inside?.[i]);
  const outs = items.filter((_, i) => !inside?.[i]);
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`relative flex flex-wrap items-center justify-center gap-2 rounded-2xl border-4 border-dashed border-amber-500 bg-amber-100 ${
          compact ? "min-h-[50px] min-w-[80px] px-2 pt-3 pb-1" : "min-h-[92px] min-w-[170px] px-4 pb-3 pt-6"
        }`}
      >
        <span className="absolute -top-3 left-3 rounded-full bg-amber-500 px-2 py-0.5 text-xs font-extrabold text-white">
          盒子 Box
        </span>
        {ins.map((g, i) => icon(g, i))}
      </div>
      <div className="flex flex-wrap items-end justify-center gap-3">{outs.map((g, i) => icon(g, i + 5))}</div>
    </div>
  );
}

// ---------- 時鐘 ----------
function ClockView({ cfg, compact }: { cfg: ClockConfig; compact: boolean }) {
  const { hour, minute = 0 } = cfg;
  const hAngle = ((hour % 12) + minute / 60) * 30;
  const mAngle = minute * 6;
  const px = compact ? 84 : 150;
  const pt = (angle: number, r: number) => ({
    x: 60 + r * Math.sin((angle * Math.PI) / 180),
    y: 60 - r * Math.cos((angle * Math.PI) / 180),
  });
  const h = pt(hAngle, 28);
  const m = pt(mAngle, 40);
  return (
    <svg viewBox="0 0 120 120" width={px} height={px} aria-label={`${hour} o'clock`} className="animate-pop">
      <circle cx="60" cy="60" r="56" fill="#fff" stroke="#f59e0b" strokeWidth="6" />
      {Array.from({ length: 12 }, (_, i) => {
        const n = i + 1;
        const p = pt(n * 30, 43);
        return (
          <text key={n} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="800" fill="#334155">
            {n}
          </text>
        );
      })}
      <line x1="60" y1="60" x2={m.x} y2={m.y} stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
      <line x1="60" y1="60" x2={h.x} y2={h.y} stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
      <circle cx="60" cy="60" r="5" fill="#334155" />
    </svg>
  );
}

// ---------- 錢幣 ----------
const COIN_R: Record<number, number> = { 1: 24, 2: 27, 5: 30, 10: 32 };

function Coin({ value, scale }: { value: number; scale: number }) {
  const r = COIN_R[value] ?? 28;
  const box = 68;
  const isTen = value === 10;
  return (
    <svg viewBox={`0 0 ${box} ${box}`} width={box * scale} height={box * scale} className="animate-pop" aria-label={`$${value}`}>
      <circle cx={box / 2} cy={box / 2} r={r} fill={isTen ? "#f5c542" : "#e2e8f0"} stroke="#64748b" strokeWidth="2.5" />
      {isTen ? (
        <circle cx={box / 2} cy={box / 2} r={r - 8} fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
      ) : (
        <circle cx={box / 2} cy={box / 2} r={r - 5} fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray={value === 2 ? "3 2" : undefined} />
      )}
      <text x={box / 2} y={box / 2 + 1} textAnchor="middle" dominantBaseline="central" fontSize={value === 10 ? 17 : 20} fontWeight="900" fill="#334155">
        ${value}
      </text>
    </svg>
  );
}

function MoneyView({ cfg, compact }: { cfg: MoneyConfig; compact: boolean }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5">
      {cfg.coins.map((c, i) => (
        <Coin key={i} value={c} scale={compact ? 0.62 : 1.05} />
      ))}
    </div>
  );
}

// ---------- 柱狀圖 ----------
function BarChartView({ cfg }: { cfg: BarChartConfig }) {
  const { bars, max } = cfg;
  const left = 34;
  const top = 8;
  const plotH = 150;
  const plotW = 258;
  const step = plotH / max;
  const slot = plotW / bars.length;
  const bw = slot * 0.6;
  return (
    <div className="w-full max-w-[300px]">
      <svg viewBox="0 0 300 164" className="w-full" role="img" aria-label="bar chart">
        {Array.from({ length: max + 1 }, (_, i) => {
          const y = top + plotH - i * step;
          return (
            <g key={i}>
              <line x1={left} y1={y} x2={left + plotW} y2={y} stroke={i === 0 ? "#64748b" : "#cbd5e1"} strokeWidth={i === 0 ? 2.5 : 1} />
              <text x={left - 7} y={y} textAnchor="end" dominantBaseline="central" fontSize="11" fontWeight="700" fill="#475569">
                {i}
              </text>
            </g>
          );
        })}
        {bars.map((b, i) => {
          const h = b.value * step;
          const x = left + slot * i + (slot - bw) / 2;
          return (
            <rect
              key={i}
              x={x}
              y={top + plotH - h}
              width={bw}
              height={h}
              rx="6"
              fill={COLOR_INFO[b.color].hex}
              stroke="rgba(30,41,59,.4)"
              strokeWidth="1.5"
              style={{ transformBox: "fill-box", transformOrigin: "bottom", animation: `growY .7s ease-out ${i * 0.1}s both` }}
            />
          );
        })}
      </svg>
      <div className="flex" style={{ paddingLeft: `${(left / 300) * 100}%`, paddingRight: `${((300 - left - plotW) / 300) * 100}%` }}>
        {bars.map((b, i) => (
          <div key={i} className="flex flex-1 justify-center">
            <GlyphIcon kind={b.kind} color={b.color} size={34} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- 數字 ----------
function NumberRowView({ cfg }: { cfg: NumberRowConfig }) {
  const single = cfg.items.length === 1;
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {cfg.items.map((it, i) =>
        it === "?" ? (
          <div
            key={i}
            className="animate-pulse-soft flex h-16 w-14 items-center justify-center rounded-2xl border-4 border-dashed border-pink-400 bg-white text-4xl font-black text-pink-500"
          >
            ?
          </div>
        ) : (
          <div
            key={i}
            className={`animate-pop flex items-center justify-center rounded-2xl border-4 border-sky-400 bg-white font-black text-sky-700 shadow-sm ${
              single ? "h-28 w-32 text-7xl" : "h-16 w-14 text-3xl"
            }`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {it}
          </div>
        ),
      )}
    </div>
  );
}

// ---------- 入口 ----------
export default function Visual({ spec, compact = false }: { spec: VisualSpec; compact?: boolean }) {
  switch (spec.imageType) {
    case "objects":
      return <ObjectsView cfg={spec.imageConfig} compact={compact} />;
    case "objectGroups":
      return <GroupsView cfg={spec.imageConfig} compact={compact} />;
    case "glyphs":
      return <GlyphsView cfg={spec.imageConfig} compact={compact} />;
    case "lengthBars":
      return <LengthView cfg={spec.imageConfig} compact={compact} />;
    case "shape":
      return (
        <GlyphIcon
          kind={spec.imageConfig.shape}
          color={spec.imageConfig.color}
          size={compact ? 60 : 130}
          className="animate-floaty"
        />
      );
    case "solid":
      return <SolidIcon solid={spec.imageConfig.solid} color={spec.imageConfig.color} size={compact ? 64 : 130} className="animate-floaty" />;
    case "pattern":
      return <PatternView cfg={spec.imageConfig} />;
    case "position":
      return <PositionView cfg={spec.imageConfig} compact={compact} />;
    case "clock":
      return <ClockView cfg={spec.imageConfig} compact={compact} />;
    case "money":
      return <MoneyView cfg={spec.imageConfig} compact={compact} />;
    case "barChart":
      return <BarChartView cfg={spec.imageConfig} />;
    case "numberRow":
      return <NumberRowView cfg={spec.imageConfig} />;
    case "emoji":
      return (
        <div className={`animate-floaty ${compact ? "text-4xl" : "text-7xl"}`} aria-hidden="true">
          {spec.imageConfig.emoji}
        </div>
      );
  }
}
