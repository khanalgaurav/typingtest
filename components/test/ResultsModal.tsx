"use client";
import { RatingBadge, Sparkline } from "@/components/ui/SharedUI";
import { IconX, IconRefresh, IconChart2, IconRotateClockwise } from "@/components/ui/Icons";
import type { ResultData } from "@/types";

interface ResultsModalProps {
  data: ResultData;
  wpmHistory: number[];
  onRetry: () => void;     // Restart same sentences
  onNewTest: () => void;   // Start new sentences
  onClose: () => void;
  onStats: () => void;
}

export function ResultsModal({ data, wpmHistory, onRetry, onNewTest, onClose, onStats }: ResultsModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="bg-background border border-border rounded-2xl p-8 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-1">
          <h2 className="text-2xl font-bold text-foreground">Test Complete</h2>
          <button onClick={onClose} className="text-foreground/40 hover:text-foreground transition-colors">
            <IconX size={18} />
          </button>
        </div>
        <p className="text-sm text-foreground/50 mb-5 italic">
          {data.saved
            ? data.isNew
              ? "First record saved!"
              : `New personal best! (prev: ${data.previous?.wpm} WPM)`
            : `Your best is still ${data.previous?.wpm || 0} WPM`}
        </p>

        <RatingBadge wpm={data.wpm} />

        <div className="grid grid-cols-2 gap-3 mt-5 mb-5">
          {[
            { label: "WPM",           val: data.wpm,            color: "text-accent" },
            { label: "Accuracy",      val: `${data.accuracy}%`, color: data.accuracy >= 90 ? "text-green-400" : data.accuracy >= 70 ? "text-blue-400" : "text-red-400" },
            { label: "Duration",      val: `${data.duration}s`, color: "text-foreground" },
            { label: "Correct chars", val: data.correctCount,   color: "text-foreground" },
          ].map(({ label, val, color }) => (
            <div key={label} className="bg-card rounded-xl p-4">
              <div className={`text-3xl font-mono font-bold ${color}`}>{val}</div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-foreground/40 mt-1">{label}</div>
            </div>
          ))}
        </div>

        {wpmHistory.length > 1 && (
          <div className="mb-5">
            <p className="text-[10px] font-mono uppercase tracking-widest text-foreground/40 mb-2">Speed over time</p>
            <Sparkline data={wpmHistory} />
          </div>
        )}

        <div className="flex flex-col gap-2">
          {/* Main Actions */}
          <div className="flex gap-2">
            <button
              onClick={onRetry}
              className="flex-1 flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg py-2.5 text-sm transition-colors"
            >
              <IconRotateClockwise size={14} /> Try Again
            </button>
            <button
              onClick={onNewTest}
              className="flex-1 flex items-center justify-center gap-2 bg-card border border-border hover:bg-white/5 text-foreground font-semibold rounded-lg py-2.5 text-sm transition-colors"
            >
              <IconRefresh size={14} /> New Test
            </button>
          </div>
          
          {/* Secondary Actions */}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 px-4 border border-border hover:border-accent/50 text-foreground/70 hover:text-foreground rounded-lg py-2.5 text-sm transition-colors"
            >
              Review
            </button>
            <button
              onClick={onStats}
              className="flex-1 flex items-center justify-center gap-2 px-4 border border-border hover:border-accent/50 text-foreground/70 hover:text-foreground rounded-lg py-2.5 text-sm transition-colors"
            >
              <IconChart2 size={14} /> Stats
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}