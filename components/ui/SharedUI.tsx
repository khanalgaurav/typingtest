"use client";
import { getRating } from "@/utils";
import { IconZap } from "./Icons";

// ─── RatingBadge ──────────────────────────────────────────────────────────────
export function RatingBadge({ wpm }: { wpm: number }) {
  const r = getRating(wpm);
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border ${r.color} ${r.bg} ${r.border}`}>
      <IconZap size={12} />
      {r.label}
    </span>
  );
}

// ─── StatCell ─────────────────────────────────────────────────────────────────
export function StatCell({
  label,
  value,
  unit,
  valueColor = "text-[#00ADB5]",
}: {
  label: string;
  value: string | number;
  unit?: string;
  valueColor?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/40">{label}</span>
      <span className={`text-2xl font-mono font-semibold leading-none tabular-nums ${valueColor}`}>
        {value}
        {unit && <span className="text-sm text-foreground/40 ml-0.5">{unit}</span>}
      </span>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
export function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-card border border-accent/30 text-foreground px-4 py-3 rounded-lg text-sm font-mono shadow-2xl max-w-sm animate-in slide-in-from-bottom-2">
      {message}
    </div>
  );
}

// ─── Sparkline ────────────────────────────────────────────────────────────────
export function Sparkline({ data, color = "#00ADB5", height = 52 }: { data: number[]; color?: string; height?: number }) {
  if (!data || data.length < 2) {
    return <p className="text-xs text-foreground/30 font-mono py-2">Speed chart will appear as you type…</p>;
  }
  const W = 400, H = height;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const xs = data.map((_, i) => (i / (data.length - 1)) * W);
  const ys = data.map((v) => H - ((v - min) / (max - min + 0.1)) * (H - 8) - 4);
  const pts = xs.map((x, i) => `${x},${ys[i]}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: H }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="spk-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${H} ${pts} ${W},${H}`} fill="url(#spk-grad)" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}