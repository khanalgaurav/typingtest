"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useTypingTest } from "@/hooks/Usetypingtest";
import { saveRecord }    from "@/utils";
import { TextDisplay }   from "@/components/ui/TextDisplay";
import { NepaliKeyboard, getKeyHighlight } from "@/components/keyboard/NepaliKeyboard";
import { ResultsModal }  from "./ResultsModal";
import { Toast, Sparkline, RatingBadge } from "@/components/ui/SharedUI";
import { IconRefresh, IconEdit } from "@/components/ui/Icons";

interface TestTabProps {
  onGoStats: () => void;
}

export function TestTab({ onGoStats }: TestTabProps) {
  const [customText,      setCustomText]      = useState("");
  const [useCustom,       setUseCustom]       = useState(false);
  const [showCustomPanel, setShowCustomPanel] = useState(false);
  const [showResult,      setShowResult]      = useState(false);
  const [resultData,      setResultData]      = useState<Parameters<typeof ResultsModal>[0]["data"] | null>(null);
  const [toast,           setToast]           = useState<string | null>(null);
  const [isShiftActive,   setIsShiftActive]   = useState(false);

  const inputRef     = useRef<HTMLInputElement>(null);
  const test         = useTypingTest({ customText, useCustom });
  const startTimeRef = useRef<number | null>(test.startTime);
  startTimeRef.current = test.startTime;

  const pop = useCallback((msg: string, d = 3000) => {
    setToast(msg);
    setTimeout(() => setToast(null), d);
  }, []);

  // Save record when test ends
  useEffect(() => {
    if (!test.testOver) return;
    const elapsed  = startTimeRef.current ? Math.max((Date.now() - startTimeRef.current) / 1000, 0) : 0;
    const mins     = Math.max(elapsed / 60, 1 / 60);
    const finalWpm = Math.round(test.correctCount / 5 / mins) || 0;
    const finalAcc = test.totalTyped > 0 ? Math.round((test.correctCount / test.totalTyped) * 100) : 0;
    const rec = { wpm: finalWpm, accuracy: finalAcc, duration: Math.round(elapsed), date: new Date().toISOString() };
    const res = saveRecord(String(test.selTime), rec);
    setResultData({ ...rec, ...res, correctCount: test.correctCount });
    setShowResult(true);
    pop(res.saved ? (res.isNew ? `New record! ${finalWpm} WPM` : `New best! ${finalWpm} WPM`) : `Done: ${finalWpm} WPM · ${finalAcc}%`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [test.testOver]);

  useEffect(() => { inputRef.current?.focus(); }, []);

  // Shift tracking for keyboard display
  useEffect(() => {
    const down = (e: KeyboardEvent) => { if (e.key === "Shift") setIsShiftActive(true); };
    const up   = (e: KeyboardEvent) => { if (e.key === "Shift") setIsShiftActive(false); };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup",   up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  const handleRestart = useCallback((sec: number) => {
    setShowResult(false);
    setResultData(null);
    test.restart(sec ?? test.selTime);
    setTimeout(() => inputRef.current?.focus(), 40);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [test.selTime]);

  // Colour helpers
  const timeDanger = test.selTime > 0 && test.started && !test.finished && test.timeLeft <= 5;
  const timeWarn   = test.selTime > 0 && test.started && !test.finished && test.timeLeft <= 15;
  const timeColor  = timeDanger ? "text-red-400" : timeWarn ? "text-yellow-400" : "text-accent";
  const accColor   = test.accuracy >= 90 ? "text-green-400" : test.accuracy >= 70 ? "text-blue-400" : test.accuracy > 0 ? "text-red-400" : "text-foreground/50";

  // Next char → keyboard highlight
  const nextChar  = test.graphemes[test.typedGraphemes.length] ?? "";
  const highlight = getKeyHighlight(nextChar);

  return (
    <div className="flex flex-col gap-3">

      {/* ── Duration & actions ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-mono uppercase tracking-widest text-foreground/30 mr-1">Duration</span>
          {[15, 30, 60, 0].map((s) => (
            <button
              key={s}
              onClick={() => handleRestart(s)}
              className={[
                "px-2.5 py-1 rounded-full text-[11px] font-mono border transition-all",
                test.selTime === s
                  ? "bg-accent text-white border-accent font-semibold"
                  : "bg-transparent text-foreground/45 border-border hover:border-accent/50 hover:text-foreground",
              ].join(" ")}
            >
              {s === 0 ? "∞" : `${s}s`}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCustomPanel((x) => !x)}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono border border-border hover:border-accent/40 text-foreground/45 hover:text-foreground rounded-lg transition-all"
          >
            <IconEdit size={11} />
            {showCustomPanel ? "Hide" : "Custom"}
          </button>
          <button
            onClick={() => handleRestart(test.selTime)}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono bg-card hover:bg-card/70 text-foreground rounded-lg border border-border transition-all"
          >
            <IconRefresh size={11} />
            New
          </button>
        </div>
      </div>

      {/* ── Custom text panel ────────────────────────────────────────────── */}
      {showCustomPanel && (
        <div className="bg-card/40 border border-border rounded-xl p-3">
          <p className="text-[9px] font-mono uppercase tracking-widest text-foreground/35 mb-2">Custom Nepali Text</p>
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="यहाँ आफ्नो पाठ लेख्नुहोस्…"
            className="w-full min-h-14 bg-background border border-border focus:border-accent/60 rounded-lg px-3 py-2 text-foreground text-sm outline-none resize-y transition-colors nepali-scroll"
            style={{ fontFamily: "'Noto Serif Devanagari', serif" }}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => {
                if (customText.trim()) { setUseCustom(true); handleRestart(test.selTime); pop("Custom text loaded"); }
                else pop("Enter some text first");
              }}
              className="px-3 py-1 bg-accent hover:bg-accent/90 text-white font-semibold text-[11px] rounded-lg transition-colors"
            >
              Use This Text
            </button>
            <button
              onClick={() => { setCustomText(""); setUseCustom(false); pop("Cleared"); }}
              className="px-3 py-1 border border-border hover:border-accent/40 text-foreground/45 hover:text-foreground text-[11px] rounded-lg transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* ── Compact stats bar ────────────────────────────────────────────── */}
      <div className="flex items-stretch bg-card/40 border border-border rounded-xl overflow-hidden">
        {[
          { label: "TIME",     value: test.selTime === 0 ? "∞" : `${test.timeLeft}s`, color: timeColor },
          { label: "WPM",      value: String(test.wpm),                                color: "text-accent" },
          { label: "ACCURACY", value: `${test.accuracy}%`,                             color: accColor },
          { label: "CHARS",    value: `${test.correctCount}/${test.graphemes.length}`,  color: "text-foreground/65" },
        ].map((s, i) => (
          <div key={s.label} className="flex items-center">
            {i > 0 && <div className="w-px bg-border self-stretch" />}
            <div className="px-3 py-2">
              <div className="text-[8px] font-mono uppercase tracking-widest text-foreground/30 leading-none">
                {s.label}
              </div>
              <div className={`text-[15px] font-mono font-semibold leading-none mt-0.5 tabular-nums ${s.color}`}>
                {s.value}
              </div>
            </div>
          </div>
        ))}
        {test.wpm > 0 && (
          <div className="ml-auto flex items-center px-3">
            <RatingBadge wpm={test.wpm} />
          </div>
        )}
      </div>

      {/* ── Text display ─────────────────────────────────────────────────── */}
      <TextDisplay
        graphemes={test.graphemes}
        typedGraphemes={test.typedGraphemes}
        className="bg-card/20 border border-border min-h-[5.5rem] max-h-[8rem]"
        fontSize={16}
        onClick={() => inputRef.current?.focus()}
      />

      {/* ── Input ────────────────────────────────────────────────────────── */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          value={test.inputValue}
          onChange={test.handleInput}
          onKeyDown={(e) => e.stopPropagation()}
          placeholder={test.started ? "" : "यहाँ टाइप गर्न सुरु गर्नुहोस्…"}
          disabled={test.finished}
          autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
          className="flex-1 bg-card/60 border border-border focus:border-accent disabled:opacity-40 disabled:cursor-not-allowed rounded-xl px-4 py-2 text-foreground text-base outline-none transition-colors"
          style={{ fontFamily: "'Noto Serif Devanagari', serif" }}
        />
        <button
          onClick={() => handleRestart(test.selTime)}
          title="New text"
          className="flex items-center justify-center w-9 bg-card hover:bg-accent hover:text-white text-foreground rounded-xl border border-border transition-colors"
        >
          <IconRefresh size={14} />
        </button>
      </div>

      {!test.started && (
        <p className="text-center text-[10px] font-mono text-foreground/25">
          Start typing to begin the timer
        </p>
      )}

      {/* ── Keyboard ─────────────────────────────────────────────────────── */}
      <div className="flex justify-center overflow-x-auto pb-1 pt-1">
        <NepaliKeyboard
          highlight={test.finished ? undefined : highlight}
          isShiftActive={isShiftActive}
        />
      </div>

      {/* ── Live WPM sparkline ───────────────────────────────────────────── */}
      {test.wpmHistory.length > 1 && (
        <div className="bg-card/20 border border-border rounded-xl px-4 py-2.5">
          <p className="text-[9px] font-mono uppercase tracking-widest text-foreground/30 mb-1.5">Live Speed</p>
          <Sparkline data={test.wpmHistory} />
        </div>
      )}

      {/* ── Results modal ────────────────────────────────────────────────── */}
      {showResult && resultData && (
        <ResultsModal
          data={resultData}
          wpmHistory={test.wpmHistory}
          onRetry={() => handleRestart(test.selTime)}
          onClose={() => setShowResult(false)}
          onStats={() => { setShowResult(false); onGoStats(); }}
        />
      )}

      <Toast message={toast} />
    </div>
  );
}