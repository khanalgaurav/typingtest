"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useTypingTest } from "@/hooks/Usetypingtest";
import { saveRecord } from "@/utils";
import { TextDisplay } from "@/components/ui/TextDisplay";
import { NepaliKeyboard, getKeyHighlight } from "@/components/keyboard/NepaliKeyboard";
import { ResultsModal } from "./ResultsModal";
import { Toast, Sparkline, RatingBadge, StatCell } from "@/components/ui/SharedUI";
import { IconRefresh, IconEdit } from "@/components/ui/Icons";

export function TestTab({ onGoStats }: { onGoStats: () => void }) {
  const [customText, setCustomText] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [showCustomPanel, setShowCustomPanel] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState<any>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [isShiftActive, setIsShiftActive] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const test = useTypingTest({ customText, useCustom });
  const startTimeRef = useRef<number | null>(null);
  startTimeRef.current = test.startTime;

  const pop = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    if (!test.testOver) return;
    const elapsed = startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 : 0;
    const finalWpm = Math.round(test.correctCount / 5 / (elapsed / 60)) || 0;
    const finalAcc = test.totalTyped > 0 ? Math.round((test.correctCount / test.totalTyped) * 100) : 0;
    const rec = { wpm: finalWpm, accuracy: finalAcc, duration: Math.round(elapsed), date: new Date().toISOString() };
    const res = saveRecord(String(test.selTime), rec);
    setResultData({ ...rec, ...res, correctCount: test.correctCount });
    setShowResult(true);
  }, [test.testOver, test.correctCount, test.totalTyped, test.selTime]);

  const handleRestart = (sec: number) => {
    setShowResult(false);
    test.restart(sec);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const nextChar = test.graphemes[test.typedGraphemes.length] ?? "";
  const highlight = getKeyHighlight(nextChar);

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-2 p-1">
      
      {/* ── Top Bar ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between bg-card/30 backdrop-blur-md border border-border/50 p-2 px-4 rounded-2xl">
        <div className="flex items-center gap-2">
          {[15, 30, 60, 0].map((s) => (
            <button
              key={s}
              onClick={() => handleRestart(s)}
              className={`px-4 py-1.5 rounded-xl text-xs font-mono transition-all ${
                test.selTime === s ? "bg-accent text-white" : "hover:bg-white/5 text-foreground/50"
              }`}
            >
              {s === 0 ? "INFINITE" : `${s}s`}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
           <button onClick={() => setShowCustomPanel(!showCustomPanel)} className="p-2 hover:bg-white/5 rounded-full text-foreground/40 hover:text-accent transition-colors">
            <IconEdit size={18} />
          </button>
          <button onClick={() => handleRestart(test.selTime)} className="p-2 hover:bg-white/5 rounded-full text-foreground/40 hover:text-accent transition-colors">
            <IconRefresh size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ── Main Typing Area (Left 8-9 cols) ─────────────────────── */}
        <div className="lg:col-span-9 flex flex-col gap-4">
          
          <TextDisplay 
            graphemes={test.graphemes} 
            typedGraphemes={test.typedGraphemes}
            className="bg-card/40 border border-border/40 shadow-md"
            onClick={() => inputRef.current?.focus()}
          />

          {/* Large Textarea Input */}
          <div className="relative">
            <textarea
              ref={inputRef}
              value={test.inputValue}
              onChange={(e) => test.handleInput(e as unknown as React.ChangeEvent<HTMLInputElement>)}
              spellCheck={false}
              autoFocus
              className="w-full bg-card/40 border-2 border-border/40 focus:border-accent/50 rounded-2xl p-6 text-2xl font-serif outline-none transition-all resize-none h-22 shadow-md nepali-scroll"
              placeholder="यहाँ टाइप गर्न सुरु गर्नुहोस्..."
              style={{ fontFamily: "'Noto Serif Devanagari', serif" }}
            />
            {/* {!test.started && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 uppercase tracking-[0.2em] text-sm">
                Start typing to begin
              </div>
            )} */}
          </div>
        </div>

        {/* ── Sidebar Stats (Right 3 cols) ─────────────────────────── */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="bg-card/30 border border-border/50 rounded-2xl p-6 flex gap-6">
            <StatCell label="Speed" value={test.wpm} unit="WPM" />
            <StatCell label="Accuracy" value={test.accuracy} unit="%" valueColor={test.accuracy > 90 ? "text-accent" : "text-yellow-500"} />
            <StatCell label="Time Left" value={test.selTime === 0 ? "∞" : `${test.timeLeft}s`} />
            
            {/* {test.wpm > 0 && <RatingBadge wpm={test.wpm} />} */}
          </div>

          {/* Sidebar Sparkline */}
          <div className="bg-card/30 border border-border/50 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/40">Speed Trend</span>
              <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            </div>
            <div className="h-32">
               <Sparkline data={test.wpmHistory} height={120} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Keyboard Area ─────────────────────────────────────────── */}
      <div className="flex justify-start w-full overflow-hidden ">
        <NepaliKeyboard 
          highlight={test.finished ? undefined : highlight} 
          isShiftActive={isShiftActive} 
        />
      </div>

      {/* Custom Text Panel Overlay */}
      {showCustomPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border p-6 rounded-3xl w-full max-w-lg shadow-2xl">
            <h3 className="text-lg font-semibold mb-4">Custom Text</h3>
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full h-40 bg-background border border-border rounded-xl p-4 mb-4 outline-none focus:border-accent"
              placeholder="Paste your Nepali text here..."
            />
            <div className="flex gap-2">
              <button 
                onClick={() => { setUseCustom(true); handleRestart(test.selTime); setShowCustomPanel(false); }}
                className="flex-1 bg-accent py-3 rounded-xl font-bold"
              >
                Apply Text
              </button>
              <button onClick={() => setShowCustomPanel(false)} className="px-6 py-3 border border-border rounded-xl">Cancel</button>
            </div>
          </div>
        </div>
      )}

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