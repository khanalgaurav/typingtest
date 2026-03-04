"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { useLessonTyping } from "@/hooks/Uselessontyping";
import { TextDisplay } from "@/components/ui/TextDisplay";
import { NepaliKeyboard, getKeyHighlight } from "@/components/keyboard/NepaliKeyboard";
import { IconX, IconCheck, IconKeyboard, IconBook } from "@/components/ui/Icons";
import { LESSONS } from "@/constants";
import type { Lesson } from "@/types";

const LEVEL_META = {
  beginner: {
    dot: "bg-emerald-400",
    text: "text-emerald-400",
    accent: "#10b981",
    label: "Beginner",
    desc: "Foundational Characters"
  },
  intermediate: {
    dot: "bg-blue-400",
    text: "text-blue-400",
    accent: "#3b82f6",
    label: "Intermediate",
    desc: "Compound & Vowels"
  },
  advanced: {
    dot: "bg-violet-400",
    text: "text-violet-400",
    accent: "#8b5cf6",
    label: "Advanced",
    desc: "Flow & Sentence Mastery"
  },
} as const;

// ─── NEW RICH LESSON CARD ───────────────────────────────────────────────────
function LessonCard({
  lesson,
  globalIdx,
  onClick,
}: {
  lesson: Lesson;
  globalIdx: number;
  onClick: () => void;
}) {
  const lv = LEVEL_META[lesson.level];

  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col gap-5 p-6 rounded-[28px] border border-border bg-card/40 hover:bg-card transition-all duration-300 hover:-translate-y-1.5 overflow-hidden text-left"
    >
      {/* Background Glow Effect */}
      <div 
        className="absolute -right-4 -top-4 w-24 h-24 blur-3xl rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500"
        style={{ backgroundColor: lv.accent }}
      />
      
      {/* Large Ghost Number */}
      <span className="absolute right-4 bottom-2 text-7xl font-black opacity-[0.03] select-none pointer-events-none group-hover:opacity-[0.06] transition-opacity">
        {String(globalIdx + 1).padStart(2, "0")}
      </span>

      <div className="flex items-start justify-between relative z-10">
        <div 
          className="flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-mono font-bold uppercase tracking-[0.15em]"
          style={{ color: lv.accent, borderColor: `${lv.accent}30`, backgroundColor: `${lv.accent}10` }}
        >
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${lv.dot}`} />
          {lv.label}
        </div>
        <div className="text-foreground/10 group-hover:text-accent/40 transition-colors">
            <IconKeyboard size={16} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5 relative z-10">
        <h3 
          className="text-xl font-bold text-foreground group-hover:text-accent transition-colors leading-tight"
          style={{ fontFamily: "'Noto Serif Devanagari', serif" }}
        >
          {lesson.title}
        </h3>
        <p className="text-sm text-foreground/40 leading-relaxed line-clamp-2 min-h-[40px]">
          {lesson.subtitle}
        </p>
      </div>

      <div className="pt-2 flex items-center justify-between mt-auto relative z-10">
        <span className="text-[10px] font-mono font-bold text-foreground/20 uppercase tracking-widest">
            Module {globalIdx + 1}
        </span>
        <div className="text-accent opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
             <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
           </svg>
        </div>
      </div>
    </button>
  );
}

// ─── NEW RICH COURSE OVERVIEW ────────────────────────────────────────────────
function CourseOverview({ onPick }: { onPick: (l: Lesson) => void }) {
  const grouped = useMemo(() => ({
    beginner: LESSONS.filter((l) => l.level === "beginner"),
    intermediate: LESSONS.filter((l) => l.level === "intermediate"),
    advanced: LESSONS.filter((l) => l.level === "advanced"),
  }), []);

  const globalIdx = (lesson: Lesson) => LESSONS.findIndex((l) => l.id === lesson.id);

  return (
    <div className="p-8 md:p-12 pb-24 flex flex-col gap-16 max-w-7xl mx-auto">
      
      {/* Rich Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-border/50 pb-12">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent shadow-inner">
              <IconBook size={24} />
            </div>
            <p className="text-xs font-mono tracking-[0.3em] uppercase text-accent font-bold">
              Curriculum
            </p>
          </div>
          <h1 className="text-5xl font-black text-foreground tracking-tight leading-none">
            Master Nepali <span className="text-accent">Typing</span>
          </h1>
          <p className="text-lg text-foreground/40 leading-relaxed max-w-2xl">
            Jump into structured modules designed to take you from basic characters to 
            professional speed. Your progress is saved as you type.
          </p>
        </div>

        <button
          onClick={() => onPick(LESSONS[0])}
          className="group flex items-center gap-4 px-8 py-4 rounded-2xl bg-accent text-white font-bold text-base hover:bg-accent/90 active:scale-[0.98] transition-all shadow-2xl shadow-accent/30"
        >
          Start Learning Path
          <IconKeyboard size={20} className="group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      {/* Level Sections */}
      {(["beginner", "intermediate", "advanced"] as const).map((level) => {
        const lv = LEVEL_META[level];
        const list = grouped[level];

        return (
          <div key={level} className="flex flex-col gap-8">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-black text-foreground tracking-tight">
                  {lv.label} <span className="text-foreground/20 ml-2 font-mono text-lg font-medium">{list.length} Lessons</span>
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-border/50 to-transparent" />
              </div>
              <p className="text-sm font-mono text-foreground/30 uppercase tracking-widest">{lv.desc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {list.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  globalIdx={globalIdx(lesson)}
                  onClick={() => onPick(lesson)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── YOUR ORIGINAL LESSON PANEL (UNTOUCHED) ──────────────────────────────────
function LessonPanel({
  lesson,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}: {
  lesson: Lesson;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}) {
  const lv         = LEVEL_META[lesson.level];
  const canShuffle = lesson.level !== "advanced";

  const [isShiftActive, setIsShiftActive] = useState(false);
  const [loopCount,     setLoopCount]     = useState(0);
  const [flashDone,     setFlashDone]     = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const lt       = useLessonTyping(lesson, canShuffle);

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 100); }, [lesson]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => { if (e.key === "Shift") setIsShiftActive(true); };
    const up   = (e: KeyboardEvent) => { if (e.key === "Shift") setIsShiftActive(false); };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup",   up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup",   up);
    };
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

  const nextChar  = lt.graphemes[lt.typedGraphemes.length] ?? "";
  const highlight = getKeyHighlight(nextChar);
  const progress  =
    lt.graphemes.length > 0
      ? (lt.typedGraphemes.length / lt.graphemes.length) * 100
      : 0;

  return (
    <div className="flex flex-col gap-3 p-4 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-4 py-3 shadow-sm">
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1.5 hover:bg-foreground/8 rounded-lg transition-colors text-foreground/25 hover:text-foreground"
        >
          <IconX size={15} />
        </button>
        <div className="w-px h-8 bg-border flex-shrink-0" />
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest" style={{ color: lv.accent }}>{lv.label}</span>
          <span className="text-foreground/20 text-[10px] font-mono">#{String(LESSONS.findIndex((l) => l.id === lesson.id) + 1).padStart(2, "0")}</span>
        </div>
        <div className="w-px h-8 bg-border flex-shrink-0" />
        <div className="flex items-baseline gap-3 min-w-0 flex-1 ">
          <h2 className="text-xl font-bold text-foreground leading-none whitespace-nowrap truncate py-2" style={{ fontFamily: "'Noto Serif Devanagari', serif" }}>{lesson.title}</h2>
          <span className="text-[12px] text-foreground/35 truncate hidden sm:block">{lesson.subtitle}</span>
        </div>
        <div className="flex items-center gap-5 flex-shrink-0 ml-auto">
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[9px] font-mono uppercase tracking-widest text-foreground/35">Accuracy</span>
            <span className={`text-lg font-bold font-mono leading-none ${lt.accuracy > 90 ? "text-green-500" : "text-amber-500"}`}>{lt.accuracy}<span className="text-[11px] font-normal opacity-60">%</span></span>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[9px] font-mono uppercase tracking-widest text-foreground/35">Loops</span>
            <span className="text-lg font-bold font-mono text-foreground leading-none">{loopCount + 1}</span>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[9px] font-mono uppercase tracking-widest text-foreground/35">Progress</span>
            <span className="text-lg font-bold font-mono text-accent leading-none">{Math.round(progress)}<span className="text-[11px] font-normal opacity-60">%</span></span>
          </div>
        </div>
      </div>
      <div className="h-1 w-full bg-foreground/5 rounded-full overflow-hidden">
        <div className="h-full bg-accent transition-all duration-500 rounded-full" style={{ width: `${progress}%`, boxShadow: "0 0 8px rgba(0,173,181,0.5)" }} />
      </div>
      <div className="flex flex-col gap-3">
        <TextDisplay graphemes={lt.graphemes} typedGraphemes={lt.typedGraphemes} className="bg-card border border-border shadow-sm max-h-32" onClick={() => inputRef.current?.focus()} />
        {flashDone ? (
          <div className="h-28 flex flex-col items-center justify-center bg-green-500/10 border-2 border-green-500/40 rounded-2xl animate-in zoom-in-95 duration-300">
            <div className="bg-green-500 text-white p-2 rounded-full mb-2"><IconCheck size={22} /></div>
            <p className="text-green-500 font-bold">Lesson Complete!</p>
            <p className="text-green-500/50 text-xs font-mono mt-0.5">Shuffling & Restarting…</p>
          </div>
        ) : (
          <textarea ref={inputRef} value={lt.inputValue} onChange={(e) => lt.handleInput(e as any)} className="w-full bg-card border-2 border-border focus:border-accent rounded-2xl p-6 text-2xl outline-none transition-all resize-none h-20 shadow-sm scrollbar-hide" placeholder="Type the characters above…" style={{ fontFamily: "'Noto Serif Devanagari', serif" }} />
        )}
      </div>
      <div className="flex justify-center w-full">
        <NepaliKeyboard highlight={flashDone ? undefined : highlight} isShiftActive={isShiftActive} />
      </div>
      <div className="flex items-center justify-between pt-1.5 border-t border-border">
        <button onClick={onPrev} disabled={!hasPrev} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-border hover:bg-foreground/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all">← Previous</button>
        <button onClick={onNext} disabled={!hasNext} className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-accent/10 border border-accent/30 text-accent hover:bg-accent/15 disabled:opacity-20 disabled:cursor-not-allowed transition-all">Next lesson →</button>
      </div>
    </div>
  );
}

// ─── MAIN LEARN TAB ─────────────────────────────────────────────────────────
export function LearnTab() {
  const [selected, setSelected] = useState<Lesson | null>(null);

  const currentIndex = selected
    ? LESSONS.findIndex((l) => l.id === selected.id)
    : -1;

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < LESSONS.length - 1;

  const goNext = () => { if (hasNext) setSelected(LESSONS[currentIndex + 1]); };
  const goPrev = () => { if (hasPrev) setSelected(LESSONS[currentIndex - 1]); };

  return (
    <div className="flex-1 overflow-y-auto nepali-scroll min-h-screen bg-background/50">
      {selected ? (
        <div className="max-w-5xl mx-auto py-1">
          <LessonPanel
            key={selected.id}
            lesson={selected}
            onClose={() => setSelected(null)}
            onNext={goNext}
            onPrev={goPrev}
            hasNext={hasNext}
            hasPrev={hasPrev}
          />
        </div>
      ) : (
        <CourseOverview onPick={setSelected} />
      )}
    </div>
  );
}