// ─── Shared Types ─────────────────────────────────────────────────────────────

export type Theme = "dark" | "light";
export type TabId = "home" | "test" | "learn" | "stats";
export type TimerDuration = 15 | 30 | 60 | 0;

export interface TestRecord {
  wpm: number;
  accuracy: number;
  duration: number;
  date: string;
}

export interface SaveResult {
  saved: boolean;
  isNew: boolean;
  previous?: TestRecord;
}

export interface ResultData extends TestRecord, SaveResult {
  correctCount: number;
}

export interface StatsData {
  best: number;
  avg: number;
  avgAcc: number;
  total: number;
  records: TestRecord[];
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  level: "beginner" | "intermediate" | "advanced";
  content: string;
  tip: string;
}

export interface Quote {
  ne: string;
  en: string;
}

export interface RatingInfo {
  label: string;
  color: string;
  bg: string;
  border: string;
}

export interface KeyboardKey {
  normal: string;
  shift?: string;
  width?: "normal" | "wide" | "wider" | "space" | "backspace" | "enter";
  label?: string; // for special keys like Tab, Caps, etc.
}