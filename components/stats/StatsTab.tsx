"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { getStats, clearRecords, clearAllRecords, getRating } from "@/utils";
import { Sparkline, Toast } from "@/components/ui/SharedUI";
import { IconTrash } from "@/components/ui/Icons";
import type { StatsData } from "@/types";

export function StatsTab() {
  const [key, setKey] = useState("60");
  const [data, setData] = useState<StatsData>({ best: 0, avg: 0, avgAcc: 0, total: 0, records: [] });
  const [rev, setRev] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const pop = useCallback((msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); }, []);

  useEffect(() => { setData(getStats(key)); }, [key, rev]);

  const trend = useMemo(() => [...data.records].reverse().map((r) => r.wpm), [data.records]);

  const handleClearKey = () => {
    if (!window.confirm(`Clear all records for ${key === "0" ? "Unlimited" : key + "s"}?`)) return;
    clearRecords(key);
    setRev((x) => x + 1);
    pop("Records cleared");
  };

  const handleClearAll = () => {
    if (!window.confirm("Clear ALL records? This cannot be undone.")) return;
    clearAllRecords();
    setRev((x) => x + 1);
    pop("All records cleared");
  };

  return (
    <div className=" p-8">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="text-lg font-bold text-foreground">Your Progress</h2>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/40 mr-1">Duration</span>
          {([["15","15s"],["30","30s"],["60","60s"],["0","∞ Full"]] as const).map(([k, l]) => (
            <button
              key={k}
              onClick={() => setKey(k)}
              className={`px-3 py-1 rounded-full text-xs font-mono border transition-all ${
                key === k
                  ? "bg-accent text-bg border-accent font-semibold"
                  : "bg-transparent text-foreground/60 border-border hover:border-accent/50 hover:text-foreground"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { n: data.best || "—",                                  l: "Best WPM",    c: "text-accent" },
          { n: data.avg  || "—",                                  l: "Avg WPM",     c: "text-foreground" },
          { n: data.avgAcc ? `${data.avgAcc}%` : "—",            l: "Avg Accuracy",c: "text-foreground" },
          { n: data.total,                                         l: "Total Tests", c: "text-foreground" },
        ].map((c) => (
          <div key={c.l} className="bg-card/40 border border-border rounded-xl p-4">
            <div className={`text-3xl font-mono font-bold ${c.c}`}>{c.n as string | number}</div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-foreground/40 mt-1.5">{c.l}</div>
          </div>
        ))}
      </div>

      {trend.length > 1 && (
        <div className="bg-card/20 border border-border rounded-xl px-5 py-4 mb-4">
          <p className="text-[10px] font-mono uppercase tracking-widest text-foreground/40 mb-3">WPM Trend — {data.total} tests</p>
          <Sparkline data={trend} height={56} />
        </div>
      )}

      {/* Table */}
      <div className="bg-card/20 border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <span className="text-sm font-semibold text-foreground">Test History</span>
          <div className="flex gap-2">
            <button onClick={handleClearKey} className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono border border-border hover:border-red-500/50 text-foreground/50 hover:text-red-400 rounded-lg transition-colors">
              <IconTrash size={11} /> Clear this
            </button>
            <button onClick={handleClearAll} className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono border border-border hover:border-red-500/50 text-foreground/50 hover:text-red-400 rounded-lg transition-colors">
              <IconTrash size={11} /> Clear all
            </button>
          </div>
        </div>

        {data.records.length === 0 ? (
          <div className="text-center py-14 text-foreground/30 text-sm italic">No tests recorded yet for this duration.</div>
        ) : (
          <div className="overflow-x-auto nepali-scroll">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["#","Date","WPM","Accuracy","Duration","Rating"].map((h) => (
                    <th key={h} className="text-left px-5 py-2.5 text-[10px] font-mono uppercase tracking-widest text-foreground/40">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.records.map((r, i) => {
                  const rt = getRating(r.wpm);
                  return (
                    <tr key={`${r.date}-${i}`} className="border-b border-border/50 hover:bg-card/30 transition-colors">
                      <td className="px-5 py-3 text-foreground/30 font-mono text-xs">{i + 1}</td>
                      <td className="px-5 py-3 text-foreground/50 font-mono text-xs">{new Date(r.date).toLocaleString()}</td>
                      <td className="px-5 py-3 text-accent font-mono font-semibold">{r.wpm}</td>
                      <td className={`px-5 py-3 font-mono ${r.accuracy >= 90 ? "text-green-400" : r.accuracy >= 70 ? "text-blue-400" : "text-red-400"}`}>{r.accuracy}%</td>
                      <td className="px-5 py-3 text-foreground/60 font-mono text-xs">{r.duration}s</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${rt.color} ${rt.bg} ${rt.border}`}>
                          {rt.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Toast message={toast} />
    </div>
  );
}