// 詞彙表：顏色、物件、形狀、數字 / Vocabulary: colors, objects, shapes, numbers
import type { Color, GlyphKind, ObjectKind, ShapeName, SolidName } from "./types";

export const COLOR_INFO: Record<Color, { zh: string; en: string; hex: string; dot: string }> = {
  red: { zh: "紅色", en: "Red", hex: "#ef4444", dot: "🔴" },
  blue: { zh: "藍色", en: "Blue", hex: "#3b82f6", dot: "🔵" },
  yellow: { zh: "黃色", en: "Yellow", hex: "#facc15", dot: "🟡" },
  green: { zh: "綠色", en: "Green", hex: "#22c55e", dot: "🟢" },
  pink: { zh: "粉紅色", en: "Pink", hex: "#f472b6", dot: "🌸" },
  orange: { zh: "橙色", en: "Orange", hex: "#fb923c", dot: "🟠" },
  purple: { zh: "紫色", en: "Purple", hex: "#a855f7", dot: "🟣" },
};

export interface ObjInfo {
  zh: string;
  en: string;
  pl: string;
  /** 中文量詞 / Chinese measure word */
  m: string;
}

export const OBJ_INFO: Record<GlyphKind, ObjInfo> = {
  apple: { zh: "蘋果", en: "apple", pl: "apples", m: "個" },
  banana: { zh: "香蕉", en: "banana", pl: "bananas", m: "條" },
  star: { zh: "星星", en: "star", pl: "stars", m: "顆" },
  balloon: { zh: "氣球", en: "balloon", pl: "balloons", m: "個" },
  fish: { zh: "魚", en: "fish", pl: "fish", m: "條" },
  car: { zh: "小汽車", en: "car", pl: "cars", m: "輛" },
  block: { zh: "積木", en: "block", pl: "blocks", m: "塊" },
  heart: { zh: "愛心", en: "heart", pl: "hearts", m: "個" },
  flower: { zh: "花", en: "flower", pl: "flowers", m: "朵" },
  circle: { zh: "圓形", en: "circle", pl: "circles", m: "個" },
  square: { zh: "正方形", en: "square", pl: "squares", m: "個" },
  triangle: { zh: "三角形", en: "triangle", pl: "triangles", m: "個" },
  rectangle: { zh: "長方形", en: "rectangle", pl: "rectangles", m: "個" },
  oval: { zh: "橢圓形", en: "oval", pl: "ovals", m: "個" },
  diamond: { zh: "菱形", en: "diamond", pl: "diamonds", m: "個" },
};

export const KINDS: ObjectKind[] = [
  "apple",
  "banana",
  "star",
  "balloon",
  "fish",
  "car",
  "block",
  "heart",
  "flower",
];

export const DEFAULT_COLOR: Record<GlyphKind, Color> = {
  apple: "red",
  banana: "yellow",
  star: "yellow",
  balloon: "red",
  fish: "orange",
  car: "red",
  block: "blue",
  heart: "pink",
  flower: "pink",
  circle: "blue",
  square: "green",
  triangle: "orange",
  rectangle: "purple",
  oval: "pink",
  diamond: "red",
};

/** 各物件適合使用的顏色 / pleasant colors per object */
export const KIND_COLORS: Record<GlyphKind, Color[]> = {
  apple: ["red", "green"],
  banana: ["yellow"],
  star: ["yellow", "orange", "pink"],
  balloon: ["red", "blue", "pink", "green", "purple"],
  fish: ["orange", "blue", "purple"],
  car: ["red", "blue", "green", "yellow"],
  block: ["blue", "green", "orange", "purple"],
  heart: ["pink", "red", "purple"],
  flower: ["pink", "purple", "orange"],
  circle: ["blue", "red", "green", "purple"],
  square: ["green", "orange", "pink", "blue"],
  triangle: ["orange", "red", "purple", "green"],
  rectangle: ["purple", "blue", "green", "orange"],
  oval: ["pink", "orange", "blue", "green"],
  diamond: ["red", "blue", "purple", "green"],
};

export const SHAPE_NAME: Record<ShapeName, { zh: string; en: string }> = {
  circle: { zh: "圓形", en: "Circle" },
  square: { zh: "正方形", en: "Square" },
  triangle: { zh: "三角形", en: "Triangle" },
  star: { zh: "星形", en: "Star" },
  heart: { zh: "心形", en: "Heart" },
  rectangle: { zh: "長方形", en: "Rectangle" },
  oval: { zh: "橢圓形", en: "Oval" },
  diamond: { zh: "菱形", en: "Diamond" },
};

export const SHAPE_FACT: Record<ShapeName, { zh: string; en: string }> = {
  circle: { zh: "圓形圓圓的，沒有角。", en: "A circle is round with no corners." },
  square: { zh: "正方形有 4 條一樣長的邊。", en: "A square has 4 sides that are the same length." },
  triangle: { zh: "三角形有 3 條邊、3 個角。", en: "A triangle has 3 sides and 3 corners." },
  star: { zh: "星形有尖尖的角。", en: "A star has pointy tips." },
  heart: { zh: "心形上面有兩個圓圓的頂。", en: "A heart has two round bumps on top." },
  rectangle: { zh: "長方形有 2 條長邊和 2 條短邊。", en: "A rectangle has 2 long sides and 2 short sides." },
  oval: { zh: "橢圓形像一隻扁扁的蛋。", en: "An oval looks like a flat egg." },
  diamond: { zh: "菱形像一粒鑽石，有 4 條一樣長的邊。", en: "A diamond has 4 equal sides and looks like a gem." },
};

export const SOLID_NAME: Record<SolidName, { zh: string; en: string }> = {
  sphere: { zh: "球體", en: "Sphere" },
  cube: { zh: "立方體", en: "Cube" },
  cylinder: { zh: "圓柱體", en: "Cylinder" },
};

export const SOLID_FACT: Record<SolidName, { zh: string; en: string }> = {
  sphere: { zh: "球體圓滾滾，可以滾動。", en: "A sphere is perfectly round and can roll." },
  cube: { zh: "立方體有 6 個正方形的面。", en: "A cube has 6 square faces." },
  cylinder: { zh: "圓柱體上下是圓形，中間直直的。", en: "A cylinder has circles on top and bottom and straight sides." },
};

export const NUM_EN = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
  "twenty",
];

export const NUM_ZH = [
  "零",
  "一",
  "二",
  "三",
  "四",
  "五",
  "六",
  "七",
  "八",
  "九",
  "十",
  "十一",
  "十二",
  "十三",
  "十四",
  "十五",
  "十六",
  "十七",
  "十八",
  "十九",
  "二十",
];

/** 英文：數量 + 單複數，例如 "1 apple" / "3 apples" */
export function cnt(n: number, o: ObjInfo): string {
  return `${n} ${n === 1 ? o.en : o.pl}`;
}
