"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useTypingTest } from "@/hooks/Usetypingtest";
import { saveRecord } from "@/utils";
import { TextDisplay } from "@/components/ui/TextDisplay";
import { NepaliKeyboard, getKeyHighlight } from "@/components/keyboard/NepaliKeyboard";
import { ResultsModal } from "./ResultsModal";
import { Toast, Sparkline } from "@/components/ui/SharedUI";
import { IconRefresh, IconEdit, IconRotateClockwise, IconChart } from "@/components/ui/Icons";

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

  const handleNewTest = (sec: number) => {
    setShowResult(false);
    test.restart(sec);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleRestartSame = () => {
    setShowResult(false);
    test.resetSame();
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const nextChar = test.graphemes[test.typedGraphemes.length] ?? "";
  const highlight = getKeyHighlight(nextChar);

  return (
    <div className="max-w-7xl mx-auto h-screen flex flex-col p-4 md:p-6 gap-4 animate-in fade-in duration-500 overflow-hidden">
      
      {/* ── Top Bar: Segmented Navigation ── */}
      <div className="flex items-center justify-between bg-card/40 backdrop-blur-md border border-border p-1.5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-1">
          {[15, 30, 60, 0].map((s) => (
            <button
              key={s}
              onClick={() => handleNewTest(s)}
              className={`px-5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                test.selTime === s ? "bg-accent text-white shadow-lg shadow-accent/20" : "text-foreground/40 hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              {s === 0 ? "INFINITE" : `${s}s`}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowCustomPanel(true)} 
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-accent hover:bg-accent/5 transition-all"
          >
            <IconEdit size={14} /> Custom
          </button>
          <div className="w-px h-6 bg-border mx-1" />
          <button 
            onClick={() => handleNewTest(test.selTime)} 
            className="p-2 rounded-xl text-foreground/40 hover:text-accent hover:bg-accent/5 transition-all"
          >
            <IconRefresh size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        
        {/* ── Main Typing Area ── */}
        <div className="lg:col-span-9 flex flex-col gap-4 min-h-0">
          <TextDisplay 
            graphemes={test.graphemes} 
            typedGraphemes={test.typedGraphemes}
            className="flex-1 bg-card/40 border border-border rounded-3xl p-8 text-3xl shadow-inner min-h-0"
            onClick={() => inputRef.current?.focus()}
          />

          <div className="relative group shrink-0">
            <textarea
              ref={inputRef}
              value={test.inputValue}
              onChange={(e) => test.handleInput(e as any)}
              onKeyDown={(e) => { if (e.ctrlKey && e.key === "Enter") { e.preventDefault(); handleRestartSame(); } }}
              spellCheck={false}
              className="w-full bg-card/60 border-2 border-border focus:border-accent/40 rounded-3xl py-6 px-8 text-3xl outline-none transition-all resize-none h-24 shadow-xl font-devanagari"
              placeholder="यहाँ टाइप गर्न सुरु गर्नुहोस्..."
            />
            
            <button
              onClick={handleRestartSame}
              className="absolute top-1/2 -translate-y-1/2 right-6 flex items-center gap-2 px-4 py-2.5 bg-background border border-border rounded-2xl text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-accent hover:border-accent/30 transition-all shadow-lg backdrop-blur-md"
            >
              <IconRotateClockwise size={14} />
              <span>Restart</span>
            </button>
          </div>
        </div>

        {/* ── Sidebar Stats (Bento Style) ── */}
        <div className="lg:col-span-3 flex flex-col gap-4 min-h-0">
          {/* Real-time Stats Card */}
          <div className="bg-card/40 border border-border rounded-[32px] p-6 grid grid-cols-2 gap-4 relative overflow-hidden shrink-0">
             <div className="absolute -right-4 -top-4 w-20 h-20 bg-accent/5 blur-2xl rounded-full" />
             
             <div className="flex flex-col">
                <span className="text-[10px] font-mono font-black uppercase tracking-widest text-foreground/20">WPM</span>
                <span className="text-3xl font-black text-accent">{test.wpm}</span>
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] font-mono font-black uppercase tracking-widest text-foreground/20">Acc.</span>
                <span className={`text-3xl font-black ${test.accuracy > 90 ? 'text-emerald-400' : 'text-orange-400'}`}>{test.accuracy}%</span>
             </div>
             <div className="col-span-2 pt-2 border-t border-border/50">
                <span className="text-[10px] font-mono font-black uppercase tracking-widest text-foreground/20">Remaining</span>
                <span className="text-2xl font-black text-foreground/60">{test.selTime === 0 ? "∞" : `${test.timeLeft}s`}</span>
             </div>
          </div>

          {/* Mini Chart Card */}
          <div className="flex-1 bg-card/40 border border-border rounded-[32px] p-6 flex flex-col gap-4 relative overflow-hidden min-h-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-foreground/20">Live Trend</span>
              <IconChart size={14} className="text-accent/40" />
            </div>
            <div className="flex-1 min-h-0 py-2">
               <Sparkline data={test.wpmHistory} height={120} />
            </div>
            <div className="absolute bottom-4 left-6 right-6">
                <p className="text-[9px] font-mono text-foreground/15 uppercase tracking-tighter text-center">Stability: High</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Keyboard: Scaled down for screen fit ── */}
      <div className="flex justify-center w-full transform scale-[0.85] lg:scale-[0.9] origin-bottom shrink-0 pb-2">
        <NepaliKeyboard 
          highlight={test.finished ? undefined : highlight} 
          isShiftActive={isShiftActive} 
        />
      </div>

      {/* Custom Panel Modal */}
      {showCustomPanel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setShowCustomPanel(false)} />
          <div className="relative bg-card border border-border p-8 rounded-[40px] w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-black text-foreground tracking-tight mb-2">Custom Practice</h3>
            <p className="text-sm text-foreground/40 mb-6 font-medium">Paste your own text below to generate a specialized typing test.</p>
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full h-48 bg-background border border-border rounded-3xl p-6 mb-6 outline-none focus:border-accent text-lg resize-none shadow-inner"
              placeholder="Paste text here..."
            />
            <div className="flex gap-3">
              <button 
                onClick={() => { setUseCustom(true); handleNewTest(test.selTime); setShowCustomPanel(false); }}
                className="flex-1 bg-accent py-4 rounded-2xl font-bold text-white shadow-xl shadow-accent/20 active:scale-95 transition-all"
              >
                Apply Custom Text
              </button>
              <button onClick={() => setShowCustomPanel(false)} className="px-8 py-4 border border-border rounded-2xl font-bold text-foreground/40 hover:bg-foreground/5 transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showResult && resultData && (
        <ResultsModal 
          data={resultData} 
          wpmHistory={test.wpmHistory} 
          onRetry={handleRestartSame} 
          onNewTest={() => handleNewTest(test.selTime)}
          onClose={() => setShowResult(false)} 
          onStats={() => { setShowResult(false); onGoStats(); }} 
        />
      )}

      <Toast message={toast} />
    </div>
  );
}