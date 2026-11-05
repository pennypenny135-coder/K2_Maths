"use client";
// 彩紙 + 星星爆開 / confetti + star burst (CSS animation only)
import { useEffect, useState } from "react";
import { GlyphIcon } from "./Glyph";

interface Props {
  /** 每次數值改變就播放一次 / fires every time this number changes (0 = idle) */
  trigger: number;
  /** 更大場面（例如完成 10 題） / bigger celebration */
  big?: boolean;
}

interface Piece {
  id: number;
  left: number;
  dx: number;
  rot: number;
  dur: number;
  delay: number;
  color: string;
}
interface StarP {
  id: number;
  dx: number;
  dy: number;
  rot: number;
  delay: number;
  size: number;
  color: "yellow" | "pink" | "orange" | "blue";
}

const COLORS = ["#ef4444", "#facc15", "#22c55e", "#3b82f6", "#f472b6", "#fb923c", "#a855f7"];

export default function Confetti({ trigger, big = false }: Props) {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [stars, setStars] = useState<StarP[]>([]);

  useEffect(() => {
    if (trigger <= 0) return;
    const nPieces = big ? 70 : 38;
    const nStars = big ? 14 : 9;
    setPieces(
      Array.from({ length: nPieces }, (_, i) => ({
        id: trigger * 1000 + i,
        left: Math.random() * 100,
        dx: (Math.random() - 0.5) * 160,
        rot: 360 + Math.random() * 720,
        dur: 1.3 + Math.random() * 1.1,
        delay: Math.random() * 0.35,
        color: COLORS[i % COLORS.length],
      })),
    );
    setStars(
      Array.from({ length: nStars }, (_, i) => {
        const a = (i / nStars) * Math.PI * 2 + Math.random() * 0.3;
        const r = 90 + Math.random() * 90;
        return {
          id: trigger * 1000 + i,
          dx: Math.cos(a) * r,
          dy: Math.sin(a) * r,
          rot: (Math.random() - 0.5) * 540,
          delay: Math.random() * 0.1,
          size: 26 + Math.random() * 20,
          color: (["yellow", "pink", "orange", "blue"] as const)[i % 4],
        };
      }),
    );
    const timer = window.setTimeout(() => {
      setPieces([]);
      setStars([]);
    }, 2800);
    return () => window.clearTimeout(timer);
  }, [trigger, big]);

  if (pieces.length === 0 && stars.length === 0) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={
            {
              left: `${p.left}%`,
              background: p.color,
              "--dx": `${p.dx}px`,
              "--rot": `${p.rot}deg`,
              "--dur": `${p.dur}s`,
              "--delay": `${p.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
      {stars.map((s) => (
        <span
          key={s.id}
          className="star-piece"
          style={
            {
              "--dx": `${s.dx}px`,
              "--dy": `${s.dy}px`,
              "--rot": `${s.rot}deg`,
              "--delay": `${s.delay}s`,
            } as React.CSSProperties
          }
        >
          <GlyphIcon kind="star" color={s.color} size={s.size} />
        </span>
      ))}
    </div>
  );
}
