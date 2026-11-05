import type { CSSProperties, ReactNode } from "react";
import type { Color, GlyphKind, SolidName } from "@/data/types";
import { COLOR_INFO, DEFAULT_COLOR } from "@/data/vocab";

const O = "rgba(30,41,59,0.55)"; // 卡通外框 / cartoon outline

function drawGlyph(kind: GlyphKind, fill: string): ReactNode {
  const stroke = { stroke: O, strokeWidth: 2, strokeLinejoin: "round" as const };
  switch (kind) {
    case "apple":
      return (
        <>
          <path
            d="M24 15C17 9 6 13 7 26c1 10 8 17 13 17 2 0 3-1 4-1s2 1 4 1c5 0 12-7 13-17 1-13-10-17-17-11z"
            fill={fill}
            {...stroke}
          />
          <path d="M24 15c0-4 1-7 4-9" stroke="#78350f" strokeWidth="3" fill="none" strokeLinecap="round" />
          <ellipse cx="32" cy="9" rx="6" ry="3" transform="rotate(-25 32 9)" fill="#22c55e" stroke={O} strokeWidth="1.5" />
          <ellipse cx="15" cy="24" rx="2.6" ry="5" fill="#fff" opacity=".4" transform="rotate(15 15 24)" />
        </>
      );
    case "banana":
      return (
        <>
          <path d="M9 13c1 21 15 32 33 22 2-1 1-4-1-4C27 37 20 28 19 11c0-3-10-3-10 2z" fill={fill} {...stroke} />
          <rect x="9" y="7" width="10" height="6" rx="2" fill="#92400e" stroke={O} strokeWidth="1.5" />
          <path d="M13 17c1 8 5 14 11 18" stroke="#fff" strokeWidth="2" opacity=".5" fill="none" strokeLinecap="round" />
        </>
      );
    case "star":
      return (
        <>
          <polygon
            points="24,3 30,17 45,18 34,28 37,44 24,36 11,44 14,28 3,18 18,17"
            fill={fill}
            {...stroke}
          />
          <circle cx="20" cy="18" r="2.2" fill="#fff" opacity=".6" />
        </>
      );
    case "balloon":
      return (
        <>
          <path d="M24 38c-2 1-4 4-3 6h6c1-2-1-5-3-6z" fill={fill} stroke={O} strokeWidth="1.5" />
          <ellipse cx="24" cy="20" rx="14" ry="17" fill={fill} {...stroke} />
          <path d="M24 41q-4 3 0 6" stroke="#64748b" strokeWidth="1.5" fill="none" />
          <ellipse cx="18" cy="13" rx="3" ry="5" fill="#fff" opacity=".45" transform="rotate(20 18 13)" />
        </>
      );
    case "fish":
      return (
        <>
          <polygon points="35,24 46,13 46,35" fill={fill} {...stroke} />
          <ellipse cx="21" cy="24" rx="17" ry="12" fill={fill} {...stroke} />
          <path d="M17 13l6-6 4 8z" fill={fill} stroke={O} strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="13" cy="21" r="3.6" fill="#fff" />
          <circle cx="12.3" cy="21" r="1.8" fill="#1e293b" />
          <path d="M22 17c3 4 3 10 0 14" stroke="#fff" strokeWidth="2" opacity=".5" fill="none" strokeLinecap="round" />
        </>
      );
    case "car":
      return (
        <>
          <path d="M12 23l5-10h14l6 10z" fill={fill} {...stroke} />
          <path d="M19 15h10l3 7H16z" fill="#bae6fd" stroke={O} strokeWidth="1.5" strokeLinejoin="round" />
          <rect x="3" y="22" width="42" height="13" rx="5" fill={fill} {...stroke} />
          <circle cx="14" cy="36" r="5.5" fill="#334155" stroke={O} strokeWidth="1.5" />
          <circle cx="34" cy="36" r="5.5" fill="#334155" stroke={O} strokeWidth="1.5" />
          <circle cx="14" cy="36" r="2" fill="#e2e8f0" />
          <circle cx="34" cy="36" r="2" fill="#e2e8f0" />
          <rect x="40" y="25" width="4" height="4" rx="1" fill="#fef08a" />
        </>
      );
    case "block":
      return (
        <>
          <rect x="7" y="9" width="34" height="34" rx="5" fill={fill} {...stroke} />
          <rect x="7" y="9" width="34" height="9" rx="4" fill="#fff" opacity=".35" />
          <circle cx="17" cy="8" r="3.5" fill={fill} stroke={O} strokeWidth="1.5" />
          <circle cx="31" cy="8" r="3.5" fill={fill} stroke={O} strokeWidth="1.5" />
          <rect x="13" y="24" width="22" height="12" rx="3" fill="#fff" opacity=".25" />
        </>
      );
    case "heart":
      return (
        <>
          <path
            d="M24 42C6 28 4 16 12 11c6-4 11 0 12 4 1-4 6-8 12-4 8 5 6 17-12 31z"
            fill={fill}
            {...stroke}
          />
          <ellipse cx="14" cy="17" rx="3" ry="4.5" fill="#fff" opacity=".45" transform="rotate(30 14 17)" />
        </>
      );
    case "flower":
      return (
        <>
          {[0, 72, 144, 216, 288].map((a) => (
            <circle
              key={a}
              cx={24 + 11.5 * Math.sin((a * Math.PI) / 180)}
              cy={24 - 11.5 * Math.cos((a * Math.PI) / 180)}
              r="8.5"
              fill={fill}
              stroke={O}
              strokeWidth="1.5"
            />
          ))}
          <circle cx="24" cy="24" r="7" fill="#fde047" stroke={O} strokeWidth="1.5" />
        </>
      );
    case "circle":
      return (
        <>
          <circle cx="24" cy="24" r="20" fill={fill} {...stroke} />
          <ellipse cx="16" cy="15" rx="4" ry="6" fill="#fff" opacity=".35" transform="rotate(35 16 15)" />
        </>
      );
    case "square":
      return (
        <>
          <rect x="5" y="5" width="38" height="38" rx="4" fill={fill} {...stroke} />
          <rect x="9" y="9" width="12" height="6" rx="3" fill="#fff" opacity=".35" />
        </>
      );
    case "triangle":
      return (
        <>
          <polygon points="24,5 44,41 4,41" fill={fill} {...stroke} strokeLinejoin="round" />
          <polygon points="24,12 29,22 22,22" fill="#fff" opacity=".35" />
        </>
      );
    case "rectangle":
      return (
        <>
          <rect x="2" y="11" width="44" height="26" rx="3" fill={fill} {...stroke} />
          <rect x="6" y="15" width="14" height="5" rx="2.5" fill="#fff" opacity=".35" />
        </>
      );
    case "oval":
      return (
        <>
          <ellipse cx="24" cy="24" rx="21" ry="13" fill={fill} {...stroke} />
          <ellipse cx="15" cy="19" rx="5" ry="3" fill="#fff" opacity=".35" />
        </>
      );
    case "diamond":
      return (
        <>
          <polygon points="24,2 45,24 24,46 3,24" fill={fill} {...stroke} />
          <polygon points="24,8 33,19 24,19 15,19" fill="#fff" opacity=".3" />
        </>
      );
    default:
      return null;
  }
}

interface GlyphProps {
  kind: GlyphKind;
  color?: Color;
  size?: number;
  crossed?: boolean;
  muted?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function GlyphIcon({ kind, color, size = 48, crossed = false, muted = false, className, style }: GlyphProps) {
  const fill = COLOR_INFO[color ?? DEFAULT_COLOR[kind]].hex;
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      style={{ ...style, ...(muted ? { filter: "grayscale(1)", opacity: 0.28 } : {}) }}
      aria-hidden="true"
      focusable="false"
    >
      <g opacity={crossed ? 0.35 : 1}>{drawGlyph(kind, fill)}</g>
      {crossed && (
        <g stroke="#dc2626" strokeWidth="5" strokeLinecap="round">
          <line x1="8" y1="8" x2="40" y2="40" />
          <line x1="40" y1="8" x2="8" y2="40" />
        </g>
      )}
    </svg>
  );
}

export function SolidIcon({
  solid,
  color,
  size = 120,
  className,
}: {
  solid: SolidName;
  color: Color;
  size?: number;
  className?: string;
}) {
  const fill = COLOR_INFO[color].hex;
  const st = { stroke: O, strokeWidth: 1.6, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-hidden="true" focusable="false">
      {solid === "sphere" && (
        <>
          <circle cx="24" cy="24" r="20" fill={fill} {...st} />
          <path d="M8 30a20 20 0 0 0 32-4 20 20 0 0 1-32 4z" fill="#000" opacity=".16" />
          <ellipse cx="17" cy="15" rx="5" ry="7" fill="#fff" opacity=".45" transform="rotate(35 17 15)" />
        </>
      )}
      {solid === "cube" && (
        <>
          <polygon points="6,15 24,24 24,44 6,35" fill={fill} {...st} />
          <polygon points="24,24 42,15 42,35 24,44" fill={fill} {...st} />
          <polygon points="24,24 42,15 42,35 24,44" fill="#000" opacity=".22" />
          <polygon points="24,6 42,15 24,24 6,15" fill={fill} {...st} />
          <polygon points="24,6 42,15 24,24 6,15" fill="#fff" opacity=".4" />
        </>
      )}
      {solid === "cylinder" && (
        <>
          <path d="M8 12v24c0 3.6 7.2 6.5 16 6.5S40 39.600 40 36V12z" fill={fill} {...st} />
          <path d="M28 14v28c7-.7 12-3 12-6V12z" fill="#000" opacity=".18" />
          <ellipse cx="24" cy="12" rx="16" ry="6.5" fill={fill} {...st} />
          <ellipse cx="24" cy="12" rx="16" ry="6.5" fill="#fff" opacity=".42" />
        </>
      )}
    </svg>
  );
}
