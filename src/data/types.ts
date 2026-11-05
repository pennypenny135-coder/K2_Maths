// 題庫型別定義 / Question bank type definitions

export type Level = "K2" | "K3";

export type Category =
  | "counting"
  | "addsub"
  | "shapes"
  | "patterns"
  | "comparison"
  | "space"
  | "timemoney";

export type Color = "red" | "blue" | "yellow" | "green" | "pink" | "orange" | "purple";

export type ObjectKind =
  | "apple"
  | "banana"
  | "star"
  | "balloon"
  | "fish"
  | "car"
  | "block"
  | "heart"
  | "flower";

export type ShapeName =
  | "circle"
  | "square"
  | "triangle"
  | "star"
  | "heart"
  | "rectangle"
  | "oval"
  | "diamond";

export type SolidName = "sphere" | "cube" | "cylinder";

/** 任何可以畫出來的小圖形（物件或平面形狀） / Anything we can draw as a small icon */
export type GlyphKind = ObjectKind | ShapeName;

export interface Glyph {
  kind: GlyphKind;
  color?: Color;
  /** 相對大小 0.5 – 1.4 / relative size */
  size?: number;
  crossed?: boolean;
}

// ---------- imageConfig 類型 / image config types ----------

export interface ObjectsConfig {
  kind: GlyphKind;
  count: number;
  color?: Color;
  /** 最後幾個被劃走（減法） / how many are crossed out (subtraction) */
  crossed?: number;
  layout?: "wrap" | "pairs";
}

export interface ObjectGroupsConfig {
  groups: { kind: GlyphKind; count: number; color?: Color }[];
  /** "+" 左右並排並加號；"vs" 上下排列比較 */
  op: "+" | "vs";
}

export interface GlyphsConfig {
  glyphs: Glyph[];
  align?: "center" | "bottom";
}

export interface LengthConfig {
  bars: { color: Color; length: number }[];
}

export interface ShapeConfig {
  shape: ShapeName;
  color: Color;
}

export interface SolidConfig {
  solid: SolidName;
  color: Color;
}

export interface PatternConfig {
  sequence: Glyph[];
  blanks: number;
}

export interface PositionConfig {
  scene: "updown" | "frontback" | "leftright" | "inout";
  /** updown: 上→下；leftright: 左→右；frontback: 後→前（旗在右邊） */
  items: Glyph[];
  inside?: boolean[];
}

export interface ClockConfig {
  hour: number;
  minute?: number;
}

export interface MoneyConfig {
  coins: number[];
}

export interface BarChartConfig {
  bars: { kind: GlyphKind; color: Color; value: number }[];
  max: number;
}

export interface NumberRowConfig {
  items: (number | "?")[];
}

export interface EmojiConfig {
  emoji: string;
}

export type VisualSpec =
  | { imageType: "objects"; imageConfig: ObjectsConfig }
  | { imageType: "objectGroups"; imageConfig: ObjectGroupsConfig }
  | { imageType: "glyphs"; imageConfig: GlyphsConfig }
  | { imageType: "lengthBars"; imageConfig: LengthConfig }
  | { imageType: "shape"; imageConfig: ShapeConfig }
  | { imageType: "solid"; imageConfig: SolidConfig }
  | { imageType: "pattern"; imageConfig: PatternConfig }
  | { imageType: "position"; imageConfig: PositionConfig }
  | { imageType: "clock"; imageConfig: ClockConfig }
  | { imageType: "money"; imageConfig: MoneyConfig }
  | { imageType: "barChart"; imageConfig: BarChartConfig }
  | { imageType: "numberRow"; imageConfig: NumberRowConfig }
  | { imageType: "emoji"; imageConfig: EmojiConfig };

export type ImageType = VisualSpec["imageType"];

export interface Choice {
  zh: string;
  en: string;
  /** 顏色小圓點 / color swatch */
  swatch?: string;
  /** 選項也可以是圖形 / a choice can be a small picture */
  visual?: VisualSpec;
}

export interface QuestionBase {
  id: string;
  level: Level;
  /** 主題分類（選題頁用） / category used on topic page */
  category: Category;
  /** 細項主題（中文） / fine topic (Chinese) */
  topic: string;
  topicEn: string;
  difficulty: 1 | 2 | 3;
  questionZh: string;
  questionEn: string;
  choices: Choice[];
  correctIndex: number;
  explanationZh: string;
  explanationEn: string;
  tags: string[];
}

export type Question = QuestionBase & VisualSpec;
