import type { ReactNode } from "react";

interface BiProps {
  zh: ReactNode;
  en: ReactNode;
  className?: string;
  zhClassName?: string;
  enClassName?: string;
  align?: "center" | "left";
}

/** 中英對照：中文在上（粗、大），英文在下（略細、略小）。 */
export default function Bi({ zh, en, className = "", zhClassName = "", enClassName = "", align = "center" }: BiProps) {
  return (
    <span
      className={`inline-flex flex-col leading-tight ${
        align === "left" ? "items-start text-left" : "items-center text-center"
      } ${className}`}
    >
      <span lang="zh-HK" className={`font-extrabold ${zhClassName}`}>
        {zh}
      </span>
      <span lang="en" className={`text-[0.68em] font-semibold opacity-90 ${enClassName}`}>
        {en}
      </span>
    </span>
  );
}
