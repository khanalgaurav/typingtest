"use client";
import { useEffect } from "react";
import { RatingBadge, Sparkline } from "@/components/ui/SharedUI";
import { IconX, IconRefresh, IconChart, IconRotateClockwise, IconTrophy } from "@/components/ui/Icons";
import type { ResultData } from "@/types";

interface ResultsModalProps {
  data: ResultData;
  wpmHistory: number[];
  onRetry: () => void;
  onNewTest: () => void;
  onClose: () => void;
  onStats: () => void;
}

export function ResultsModal({ data, wpmHistory, onRetry, onNewTest, onClose, onStats }: ResultsModalProps) {
  
  // ─── Keyboard Shortcuts Logic ───────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Esc to Close/Review
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      // Shift + Enter to Retry Same
      if (e.shiftKey && e.key === "Enter") {
        e.preventDefault();
        onRetry();
      }
      // Ctrl + Enter to New Test
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        onNewTest();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onRetry, onNewTest, onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/70 backdrop-blur-md animate-in fade-in duration-500" 
        onClick={onClose} 
      />
      
      {/* Modal Card - Compact Version */}
      <div 
        className="relative bg-card border border-border rounded-[32px] w-full max-w-lg shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Ghost Icon (Scaled down) */}
        <div className="absolute -right-6 -top-6 text-accent/5 rotate-12 pointer-events-none">
            <IconTrophy size={160} />
        </div>

        <div className="relative z-10 p-6 md:p-8">
            {/* Header - Compact */}
            <div className="flex items-start justify-between mb-1">
                <div>
                    <h2 className="text-2xl font-black text-foreground tracking-tighter">Test Complete</h2>
                    <p className="text-[11px] font-medium text-foreground/30 mt-0.5 max-w-[240px] leading-tight">
                        {data.saved
                            ? (data.isNew ? "✨ New personal best recorded!" : `🔥 Record updated! (Prev: ${data.previous?.wpm})`)
                            : `Best remains ${data.previous?.wpm || 0} WPM`}
                    </p>
                </div>
                <button 
                  onClick={onClose} 
                  title="Close (Esc)"
                  className="p-1.5 rounded-lg hover:bg-foreground/5 text-foreground/20 hover:text-foreground transition-all"
                >
                    <IconX size={18} />
                </button>
            </div>

            {/* Badge - Scaled down */}
            <div className="my-4 transform origin-left scale-90">
                <RatingBadge wpm={data.wpm} />
            </div>

            {/* Bento Grid - Compact Padding & Text */}
            <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                    { label: "WPM", val: data.wpm, color: "text-accent" },
                    { label: "Accuracy", val: `${data.accuracy}%`, color: data.accuracy >= 90 ? "text-emerald-400" : "text-orange-400" },
                    { label: "Duration", val: `${data.duration}s`, color: "text-foreground/40" },
                    { label: "Correct", val: data.correctCount, color: "text-foreground/40" },
                ].map((s) => (
                    <div key={s.label} className="bg-foreground/[0.02] border border-border/40 rounded-2xl p-4 transition-all">
                        <div className={`text-2xl font-black font-mono leading-none ${s.color}`}>{s.val}</div>
                        <div className="text-[8px] font-mono font-black uppercase tracking-widest text-foreground/20 mt-1.5">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Graph Area - Slimmer */}
            {wpmHistory.length > 1 && (
                <div className="mb-5 p-4 bg-foreground/[0.01] border border-border/30 rounded-2xl relative">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[8px] font-mono font-black uppercase tracking-widest text-foreground/15">Speed Trend</p>
                    </div>
                    <div className="h-12">
                        <Sparkline data={wpmHistory} height={48} />
                    </div>
                </div>
            )}

            {/* Actions - With Shortcut Hints */}
            <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={onRetry}
                        className="group flex flex-col items-center justify-center gap-1 bg-accent text-white font-black py-3 rounded-xl shadow-lg shadow-accent/15 hover:bg-accent/90 transition-all active:scale-95"
                    >
                        <div className="flex items-center gap-2 text-sm">
                          <IconRotateClockwise size={14} /> Retry Same
                        </div>
                        <span className="text-[8px] opacity-60 font-mono tracking-tighter uppercase">Shift + Enter</span>
                    </button>
                    <button
                        onClick={onNewTest}
                        className="group flex flex-col items-center justify-center gap-1 bg-foreground text-background font-black py-3 rounded-xl hover:opacity-90 transition-all active:scale-95"
                    >
                        <div className="flex items-center gap-2 text-sm">
                          <IconRefresh size={14} /> New Test
                        </div>
                        <span className="text-[8px] opacity-40 font-mono tracking-tighter uppercase">Ctrl + Enter</span>
                    </button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={onClose}
                        className="flex items-center justify-center gap-2 border border-border py-2.5 rounded-xl font-bold text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-all text-[11px]"
                    >
                        Review <span className="text-[8px] opacity-50 font-mono">ESC</span>
                    </button>
                    <button
                        onClick={onStats}
                        className="flex items-center justify-center gap-2 border border-border py-2.5 rounded-xl font-bold text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-all text-[11px]"
                    >
                        <IconChart size={14} /> Full Stats
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}