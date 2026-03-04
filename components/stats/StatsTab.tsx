"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { getStats, clearRecords, clearAllRecords, getRating } from "@/utils";
import { Toast } from "@/components/ui/SharedUI";
import { IconTrash, IconChart, IconKeyboard, IconX } from "@/components/ui/Icons";
import type { StatsData } from "@/types";

// --- Custom Components for the Stats Dashboard ---

function IconTrophy({ size = 20, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

function IconZap({ size = 20, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function IconAlert({ size = 48, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

// ─── DETAILED GRAPH COMPONENT ───────────────────────────────────────────────
function DetailedGraph({ data, avg }: { data: number[]; avg: number }) {
  if (data.length < 2) return null;

  const maxVal = Math.max(...data, avg);
  const minVal = Math.min(...data, avg);
  const margin = (maxVal - minVal) * 0.2 || 10;
  
  const top = maxVal + margin;
  const bottom = Math.max(0, minVal - margin);
  const range = top - bottom;

  const width = 1000;
  const height = 200;

  const points = data.map((val, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((val - bottom) / range) * height,
  }));

  const lineD = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
  const areaD = `${lineD} L ${width},${height} L 0,${height} Z`;
  const avgY = height - ((avg - bottom) / range) * height;

  return (
    <div className="relative w-full pt-6 pb-2 group/graph">
      {/* Y-Axis Labels */}
      <div className="absolute left-0 top-6 bottom-8 flex flex-col justify-between text-[10px] font-mono text-foreground/20 pointer-events-none z-10">
        <span>{Math.round(top)} WPM</span>
        <span>{Math.round(bottom)} WPM</span>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40 overflow-visible">
        <defs>
          <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fb923c" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#fb923c" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Average Line */}
        <line 
          x1="0" y1={avgY} x2={width} y2={avgY} 
          stroke="#fb923c" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" 
        />
        <text x={width} y={avgY - 6} textAnchor="end" className="fill-orange-400/40 text-[20px] font-mono uppercase tracking-widest">
          Average: {avg} WPM
        </text>

        {/* Area */}
        <path d={areaD} fill="url(#fillGrad)" />

        {/* Path */}
        <path d={lineD} fill="none" stroke="#fb923c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data Points on Hover */}
        {points.map((p, i) => (
          <circle 
            key={i} cx={p.x} cy={p.y} r="5" 
            className="fill-card stroke-orange-400 stroke-2 opacity-0 group-hover/graph:opacity-100 transition-opacity"
          />
        ))}
      </svg>

      {/* X-Axis Labels */}
      <div className="flex justify-between mt-4 text-[9px] font-mono text-foreground/20 uppercase tracking-[0.2em]">
        <span>Earlier Tests</span>
        <span>Latest Test</span>
      </div>
    </div>
  );
}

// ─── CONFIRMATION MODAL COMPONENT ───────────────────────────────────────────
function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-md" onClick={onCancel} />
      <div className="relative w-full max-w-md bg-card border border-border rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden">
        <div className="absolute -right-6 -bottom-6 opacity-[0.03] text-orange-400">
          <IconAlert size={160} />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-orange-400/10 flex items-center justify-center text-orange-400 shadow-inner">
             <IconAlert size={32} />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-black text-foreground tracking-tight">{title}</h3>
            <p className="text-sm text-foreground/40 leading-relaxed font-medium">{message}</p>
          </div>
          <div className="flex w-full gap-3 pt-2">
            <button onClick={onCancel} className="flex-1 px-6 py-3 rounded-xl font-bold text-sm border border-border hover:bg-foreground/5 text-foreground/40 transition-all">Cancel</button>
            <button onClick={onConfirm} className="flex-1 px-6 py-3 rounded-xl font-bold text-sm bg-orange-400 text-white hover:bg-orange-500 shadow-lg shadow-orange-400/20 active:scale-95 transition-all">Yes, Clear All</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN STATS TAB ──────────────────────────────────────────────────────────
export function StatsTab() {
  const [key, setKey] = useState("60");
  const [data, setData] = useState<StatsData>({ best: 0, avg: 0, avgAcc: 0, total: 0, records: [] });
  const [rev, setRev] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [modal, setModal] = useState<{ open: boolean; type: "key" | "all" }>({ open: false, type: "key" });

  const pop = useCallback((msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); }, []);

  useEffect(() => { setData(getStats(key)); }, [key, rev]);

  const trend = useMemo(() => [...data.records].reverse().map((r) => r.wpm), [data.records]);

  const executeClear = () => {
    if (modal.type === "key") {
      clearRecords(key);
      pop(`${key === "0" ? "Unlimited" : key + "s"} records cleared`);
    } else {
      clearAllRecords();
      pop("All history wiped successfully");
    }
    setRev((x) => x + 1);
    setModal({ ...modal, open: false });
  };

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto flex flex-col gap-10 animate-in fade-in duration-500">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400 shadow-inner">
              <IconChart size={24} />
            </div>
            <p className="text-xs font-mono tracking-[0.3em] uppercase text-orange-400 font-bold">Performance</p>
          </div>
          <h1 className="text-5xl font-black text-foreground tracking-tight leading-none">
            Your <span className="text-orange-400">Progress</span>
          </h1>
          <p className="text-lg text-foreground/40 leading-relaxed max-w-2xl">
            Analyze your typing speed and accuracy trends. Select a duration to filter your history.
          </p>
        </div>

        <div className="bg-card/40 border border-border p-1.5 rounded-2xl flex items-center gap-1 self-start">
          {([["15","15s"],["30","30s"],["60","60s"],["0","Full"]] as const).map(([k, l]) => (
            <button
              key={k}
              onClick={() => setKey(k)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                key === k ? "bg-orange-400 text-white shadow-lg shadow-orange-400/20" : "text-foreground/40 hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* ── BENTO GRID SUMMARY ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Personal Best", val: data.best || "—", unit: "WPM", icon: <IconTrophy color="#fb923c" />, glow: "#fb923c" },
          { label: "Average Speed", val: data.avg || "—", unit: "WPM", icon: <IconZap color="#60a5fa" />, glow: "#60a5fa" },
          { label: "Accuracy", val: data.avgAcc || "—", unit: "%", icon: <IconTrophy color="#10b981" />, glow: "#10b981" },
          { label: "Total Tests", val: data.total, unit: "Runs", icon: <IconKeyboard size={20} />, glow: "#818cf8" },
        ].map((c, i) => (
          <div key={i} className="group relative bg-card/40 border border-border rounded-[32px] p-8 overflow-hidden transition-all hover:-translate-y-1">
            <div className="absolute -right-4 -top-4 w-24 h-24 blur-3xl rounded-full opacity-10 transition-opacity group-hover:opacity-20" style={{ backgroundColor: c.glow }} />
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center">{c.icon}</div>
              <span className="text-[10px] font-mono font-black text-foreground/20 uppercase tracking-widest">{c.label}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-foreground">{c.val}</span>
              <span className="text-sm font-bold text-foreground/30">{c.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── DETAILED TREND CHART ── */}
      {trend.length > 1 && (
        <div className="relative bg-card/40 border border-border rounded-[40px] p-8 overflow-hidden group">
          <span className="absolute top-4 right-8 text-7xl font-black opacity-[0.03] select-none pointer-events-none group-hover:opacity-[0.05] transition-opacity uppercase italic">INSIGHTS</span>
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-xl font-bold text-foreground">Speed Progression</h3>
              <p className="text-sm text-foreground/40 font-mono uppercase tracking-widest mt-1">Timeline analysis based on last {data.total} sessions</p>
            </div>
            <DetailedGraph data={trend} avg={data.avg} />
          </div>
        </div>
      )}

      {/* ── HISTORY LIST ── */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-2xl font-black text-foreground">Test History</h3>
          <div className="flex items-center gap-3">
            <button onClick={() => setModal({ open: true, type: "key" })} className="group flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest text-foreground/30 hover:text-red-400 hover:bg-red-400/10 transition-all border border-transparent">
              <IconTrash size={14} className="group-hover:scale-110" /> Clear This
            </button>
            <button onClick={() => setModal({ open: true, type: "all" })} className="group flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest text-foreground/30 hover:text-red-400 hover:bg-red-400/10 transition-all border border-transparent">
              <IconTrash size={14} className="group-hover:scale-110" /> Clear All
            </button>
          </div>
        </div>

        {data.records.length === 0 ? (
          <div className="bg-card/20 border-2 border-dashed border-border rounded-[40px] py-20 flex flex-col items-center justify-center text-center gap-4">
             <div className="w-16 h-16 rounded-3xl bg-foreground/5 flex items-center justify-center text-foreground/10"><IconKeyboard size={32} /></div>
             <p className="text-foreground/30 font-bold italic">No records found for this duration.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {data.records.map((r, i) => {
              const rt = getRating(r.wpm);
              return (
                <div key={i} className="group grid grid-cols-2 md:grid-cols-6 items-center bg-card/40 border border-border hover:border-orange-400/30 rounded-2xl px-6 md:px-8 py-5 transition-all hover:bg-card">
                  <div className="text-xs font-mono font-bold text-foreground/20">#{String(data.records.length - i).padStart(2, '0')}</div>
                  <div className="col-span-2 hidden md:flex flex-col">
                    <span className="text-sm font-bold text-foreground/60">{new Date(r.date).toLocaleDateString()}</span>
                    <span className="text-[10px] font-mono text-foreground/25 uppercase">{new Date(r.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex flex-col md:block">
                    <span className="text-lg font-black text-orange-400">{r.wpm}</span>
                    <span className="text-[10px] font-bold text-foreground/30 ml-1 uppercase">WPM</span>
                  </div>
                  <div className="flex flex-col md:block">
                    <span className={`text-lg font-black ${r.accuracy >= 90 ? "text-emerald-400" : "text-blue-400"}`}>{r.accuracy}%</span>
                    <span className="text-[10px] font-bold text-foreground/30 ml-1 uppercase">Acc.</span>
                  </div>
                  <div className="col-span-2 md:col-span-1 flex justify-end">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${rt.color} ${rt.bg} ${rt.border} group-hover:scale-105`}>
                      {rt.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmModal 
        isOpen={modal.open}
        title={modal.type === "all" ? "Wipe All Records?" : `Clear ${key === "0" ? "Unlimited" : key + "s"} History?`}
        message="This action cannot be undone. You will lose all your typing progress and high scores recorded in this category."
        onConfirm={executeClear}
        onCancel={() => setModal({ ...modal, open: false })}
      />

      <Toast message={toast} />
    </div>
  );
}