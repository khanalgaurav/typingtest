"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { useLessonTyping } from "@/hooks/Uselessontyping";
import { TextDisplay } from "@/components/ui/TextDisplay";
import { NepaliKeyboard, getKeyHighlight } from "@/components/keyboard/NepaliKeyboard";
import { IconX, IconLightbulb, IconCheck } from "@/components/ui/Icons";
import { LESSONS } from "@/constants";
import { StatCell } from "@/components/ui/SharedUI";
import type { Lesson } from "@/types";

const LEVEL_STYLE = {
  beginner:     { dot: "bg-green-400",  text: "text-green-500",  label: "Beginner"     },
  intermediate: { dot: "bg-blue-400",   text: "text-blue-500",   label: "Intermediate" },
  advanced:     { dot: "bg-amber-400", text: "text-amber-500", label: "Advanced"     },
};

// ─── LessonCard ───────────────────────────────────────────────────────────────
function LessonCard({ lesson, isActive, onClick }: { lesson: Lesson; isActive: boolean; onClick: () => void }) {
  const lv = LEVEL_STYLE[lesson.level];
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl px-4 py-3 border transition-all relative overflow-hidden group ${
        isActive
          ? "border-accent shadow-lg shadow-accent/10"
          : "border-transparent hover:bg-foreground/5 opacity-60 hover:opacity-100"
      }`}
      style={{ 
        backgroundColor: isActive ? 'var(--color-card)' : 'transparent',
      }}
    >
      {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />}
      <div className="flex items-center gap-1.5 mb-1">
        <span className={`w-1 h-1 rounded-full ${lv.dot}`} />
        <span className={`text-[8px] font-mono uppercase tracking-widest ${lv.text}`}>{lv.label}</span>
      </div>
      <div className="text-sm font-bold text-foreground leading-tight" style={{ fontFamily: "'Noto Serif Devanagari', serif" }}>
        {lesson.title}
      </div>
      <div className="text-[10px] text-foreground/40 mt-1 line-clamp-1">{lesson.subtitle}</div>
    </button>
  );
}

// ─── LessonPanel ─────────────────────────────────────────────────────────────
function LessonPanel({ lesson, onClose }: { lesson: Lesson; onClose: () => void }) {
  const lv = LEVEL_STYLE[lesson.level];
  const canShuffle = lesson.level !== "advanced";

  const [isShiftActive, setIsShiftActive] = useState(false);
  const [loopCount, setLoopCount] = useState(0);
  const [flashDone, setFlashDone] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const lt = useLessonTyping(lesson, canShuffle);

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 100); }, [lesson]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => { if (e.key === "Shift") setIsShiftActive(true); };
    const up = (e: KeyboardEvent) => { if (e.key === "Shift") setIsShiftActive(false); };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  useEffect(() => {
    if (!lt.done) return;
    setFlashDone(true);
    const t = setTimeout(() => {
      setLoopCount((n) => n + 1);
      lt.reset(canShuffle, lesson.content);
      setFlashDone(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }, 1200);
    return () => clearTimeout(t);
  }, [lt.done, canShuffle, lesson.content]);

  const nextChar = lt.graphemes[lt.typedGraphemes.length] ?? "";
  const highlight = getKeyHighlight(nextChar);
  const progress = lt.graphemes.length > 0 ? (lt.typedGraphemes.length / lt.graphemes.length) * 100 : 0;

  return (
    <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* ── Header & Stats ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7">
          <div className="flex items-center gap-3 mb-2">
             <button onClick={onClose} className="p-2 hover:bg-foreground/5 rounded-full transition-colors text-foreground/30 hover:text-foreground">
               <IconX size={18} />
             </button>
             <div className="h-4 w-px bg-border" />
             <span className={`text-[10px] font-mono uppercase tracking-widest ${lv.text} font-bold`}>{lv.label} Lesson</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Noto Serif Devanagari', serif" }}>
            {lesson.title}
          </h2>
          <p className="text-sm text-foreground/40 mt-1">{lesson.subtitle}</p>
        </div>

        <div className="lg:col-span-5 flex justify-end gap-8 bg-card border border-border p-4 px-6 rounded-2xl shadow-sm">
          <StatCell label="Accuracy" value={lt.accuracy} unit="%" valueColor={lt.accuracy > 90 ? "text-green-500" : "text-amber-500"} />
          <StatCell label="Loops" value={loopCount + 1} />
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/40">Progress</span>
            <span className="text-2xl font-mono font-semibold text-accent">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>

      {/* ── Progress Bar & Tip ────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <div className="h-1.5 w-full bg-foreground/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent transition-all duration-500 shadow-[0_0_10px_rgba(0,173,181,0.5)]" 
            style={{ width: `${progress}%` }} 
          />
        </div>
        
        {/* <div className="flex gap-3 bg-accent/5 border border-accent/10 p-4 rounded-xl items-center">
          <div className="bg-accent/20 p-2 rounded-lg text-accent">
            <IconLightbulb size={18} />
          </div>
          <p className="text-xs text-foreground/70 italic leading-relaxed">
            <span className="font-bold text-accent not-italic">Pro Tip:</span> {lesson.tip}
          </p>
        </div> */}
      </div>

      {/* ── Main Action Area ──────────────────────────────────────── */}
      <div className="flex flex-col gap-4 relative">
        <TextDisplay 
          graphemes={lt.graphemes} 
          typedGraphemes={lt.typedGraphemes}
          className="bg-card border border-border shadow-sm max-h-32"
          onClick={() => inputRef.current?.focus()}
        />

        {flashDone ? (
          <div className="h-32 flex flex-col items-center justify-center bg-green-500/10 border-2 border-green-500/50 rounded-2xl animate-in zoom-in-95 duration-300">
            <div className="bg-green-500 text-white p-2 rounded-full mb-2">
              <IconCheck size={24} />
            </div>
            <p className="text-green-500 font-bold text-lg">Lesson Complete!</p>
            <p className="text-green-500/60 text-xs font-mono">Shuffling & Restarting...</p>
          </div>
        ) : (
          <textarea
            ref={inputRef}
            value={lt.inputValue}
            onChange={(e) => lt.handleInput(e as any)}
            className="w-full bg-card border-2 border-border focus:border-accent rounded-2xl p-6 text-3xl font-serif outline-none transition-all resize-none h-24 shadow-sm"
            placeholder="Type the characters above..."
            style={{ fontFamily: "'Noto Serif Devanagari', serif" }}
          />
        )}
      </div>

      {/* ── Keyboard ──────────────────────────────────────────────── */}
      <div className="flex justify-center w-full mt-2">
        <NepaliKeyboard 
          highlight={flashDone ? undefined : highlight} 
          isShiftActive={isShiftActive} 
        />
      </div>
    </div>
  );
}

// ─── LearnTab ─────────────────────────────────────────────────────────────────
export function LearnTab() {
  const [selected, setSelected] = useState<Lesson | null>(null);

  const grouped = useMemo(() => ({
    beginner:     LESSONS.filter((l) => l.level === "beginner"),
    intermediate: LESSONS.filter((l) => l.level === "intermediate"),
    advanced:     LESSONS.filter((l) => l.level === "advanced"),
  }), []);

  return (
    <div className="flex gap-6 max-w-7xl mx-auto p-2">

      {/* Sidebar: Lesson List */}
      <div className="w-64 shrink-0 flex flex-col gap-6 sticky top-4">
        <div className="bg-card border border-border p-4 rounded-3xl shadow-sm">
          <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-foreground/30 mb-4 px-2">Curriculum</h3>
          
          <div className="flex flex-col gap-6 overflow-y-auto nepali-scroll pr-2 max-h-[70vh]">
            {(["beginner", "intermediate", "advanced"] as const).map((level) => (
              <div key={level}>
                <div className="flex items-center gap-2 mb-3 px-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${LEVEL_STYLE[level].dot}`} />
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-widest ${LEVEL_STYLE[level].text}`}>
                    {level}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  {grouped[level].map((l) => (
                    <LessonCard key={l.id} lesson={l} isActive={selected?.id === l.id} onClick={() => setSelected(l)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Panel: Lesson Content */}
      <div className="flex-1 min-h-[80vh]">
        {selected ? (
          <LessonPanel key={selected.id} lesson={selected} onClose={() => setSelected(null)} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-card/20 border-2 border-dashed border-border rounded-[3rem]">
            <div className="w-20 h-20 rounded-3xl bg-card border border-border flex items-center justify-center mb-6 shadow-xl">
              <IconLightbulb size={40} className="text-accent animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Master Nepali Typing</h2>
            <p className="text-foreground/40 max-w-sm text-sm leading-relaxed mb-8">
              Select a lesson from the sidebar to begin. We recommend starting with Vowels to build a strong foundation.
            </p>
            
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              {[
                { label: "Auto-Loop", desc: "No stop, just flow" },
                { label: "Shuffle", desc: "Random characters" },
                { label: "Pro-Stats", desc: "Real-time accuracy" },
                { label: "Neon Guide", desc: "Visual keyboard tips" },
              ].map((item) => (
                <div key={item.label} className="bg-card border border-border p-4 rounded-2xl text-left">
                  <p className="text-[10px] font-bold uppercase text-accent mb-1">{item.label}</p>
                  <p className="text-[10px] text-foreground/40">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}