import type { RatingInfo, StatsData, TestRecord } from "@/types";

// ─── Storage ───────────────────────────────────────────────────────────────────
const STORAGE_KEY = "nepali_typing_v42";

type StorageData = Record<string, TestRecord[]>;

function loadStorage(): StorageData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const base: StorageData = { "15": [], "30": [], "60": [], "0": [] };
    return raw ? { ...base, ...JSON.parse(raw) } : base;
  } catch {
    return { "15": [], "30": [], "60": [], "0": [] };
  }
}

export function saveRecord(key: string, rec: TestRecord): { saved: boolean; isNew: boolean; previous?: TestRecord } {
  const all = loadStorage();
  const arr = all[key] || [];
  const sorted = [...arr].sort((a, b) => b.wpm - a.wpm);
  const best = sorted[0];
  const isBetter = !best || rec.wpm > best.wpm || (rec.wpm === best.wpm && rec.accuracy > best.accuracy);
  all[key] = [...arr, rec].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 50);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return { saved: isBetter, isNew: !best, previous: best };
}

export function getStats(key: string): StatsData {
  const arr = loadStorage()[key] || [];
  if (!arr.length) return { best: 0, avg: 0, avgAcc: 0, total: 0, records: [] };
  const byWpm = [...arr].sort((a, b) => b.wpm - a.wpm);
  return {
    best: byWpm[0].wpm,
    avg: Math.round(arr.reduce((s, r) => s + r.wpm, 0) / arr.length),
    avgAcc: Math.round(arr.reduce((s, r) => s + r.accuracy, 0) / arr.length),
    total: arr.length,
    records: [...arr].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 30),
  };
}

export function clearRecords(key: string): void {
  const all = loadStorage();
  all[key] = [];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function clearAllRecords(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ "15": [], "30": [], "60": [], "0": [] }));
}

// ─── Text helpers ──────────────────────────────────────────────────────────────
const _seg =
  typeof Intl !== "undefined" && Intl.Segmenter
    ? new Intl.Segmenter("ne", { granularity: "grapheme" })
    : null;

export function splitGraphemes(str: string): string[] {
  if (!str) return [];
  if (_seg) return [..._seg.segment(str)].map((s) => s.segment);
  return [...str];
}

export function getRandomSample(samples: string[]): string {
  return samples[Math.floor(Math.random() * samples.length)];
}

// ─── Rating ────────────────────────────────────────────────────────────────────
export function getRating(wpm: number): RatingInfo {
  if (wpm >= 60) return { label: "Expert",      color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/30" };
  if (wpm >= 40) return { label: "Advanced",    color: "text-teal-400",   bg: "bg-teal-400/10",  border: "border-teal-400/30"  };
  if (wpm >= 25) return { label: "Intermediate",color: "text-blue-400",   bg: "bg-blue-400/10",  border: "border-blue-400/30"  };
  if (wpm >= 10) return { label: "Beginner",    color: "text-purple-400", bg: "bg-purple-400/10",border: "border-purple-400/30"};
  return           { label: "Starter",          color: "text-gray-400",   bg: "bg-gray-400/10",  border: "border-gray-400/30"  };
}

// ─── Shuffle helpers for lessons ───────────────────────────────────────────────
export function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}