"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { useLessonTyping } from "@/hooks/Uselessontyping";
import { TextDisplay } from "@/components/ui/TextDisplay";
import { NepaliKeyboard, getKeyHighlight } from "@/components/keyboard/NepaliKeyboard";
import { IconX, IconLightbulb, IconCheck } from "@/components/ui/Icons";
import { LESSONS } from "@/constants";
// StatCell no longer needed in LessonPanel — inline stats used instead
import type { Lesson } from "@/types";

const LEVEL_META = {
  beginner: {
    dot:    "bg-green-400",
    text:   "text-green-500",
    accent: "#22c55e",
    label:  "Beginner",
  },
  intermediate: {
    dot:    "bg-blue-400",
    text:   "text-blue-400",
    accent: "#60a5fa",
    label:  "Intermediate",
  },
  advanced: {
    dot:    "bg-amber-400",
    text:   "text-amber-400",
    accent: "#fbbf24",
    label:  "Advanced",
  },
} as const;

// ─── LessonPanel ─────────────────────────────────────────────────────────────
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

      {/* ── Compact single-row header ─────────────────────────────── */}
      <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-4 py-3 shadow-sm">

        {/* Close */}
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1.5 hover:bg-foreground/8 rounded-lg transition-colors text-foreground/25 hover:text-foreground"
        >
          <IconX size={15} />
        </button>

        <div className="w-px h-8 bg-border flex-shrink-0" />

        {/* Level badge + lesson number */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span
            className="text-[10px] font-mono font-bold uppercase tracking-widest"
            style={{ color: lv.accent }}
          >
            {lv.label}
          </span>
          <span className="text-foreground/20 text-[10px] font-mono">
            #{String(LESSONS.findIndex((l) => l.id === lesson.id) + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="w-px h-8 bg-border flex-shrink-0" />

        {/* Title + subtitle */}
        <div className="flex items-baseline gap-3 min-w-0 flex-1">
          <h2
            className="text-xl font-bold text-foreground leading-none whitespace-nowrap truncate"
            style={{ fontFamily: "'Noto Serif Devanagari', serif" }}
          >
            {lesson.title}
          </h2>
          <span className="text-[12px] text-foreground/35 truncate hidden sm:block">
            {lesson.subtitle}
          </span>
        </div>

        {/* Stats — inline on the right */}
        <div className="flex items-center gap-5 flex-shrink-0 ml-auto">
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[9px] font-mono uppercase tracking-widest text-foreground/35">Accuracy</span>
            <span className={`text-lg font-bold font-mono leading-none ${lt.accuracy > 90 ? "text-green-500" : "text-amber-500"}`}>
              {lt.accuracy}<span className="text-[11px] font-normal opacity-60">%</span>
            </span>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[9px] font-mono uppercase tracking-widest text-foreground/35">Loops</span>
            <span className="text-lg font-bold font-mono text-foreground leading-none">{loopCount + 1}</span>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[9px] font-mono uppercase tracking-widest text-foreground/35">Progress</span>
            <span className="text-lg font-bold font-mono text-accent leading-none">
              {Math.round(progress)}<span className="text-[11px] font-normal opacity-60">%</span>
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full bg-foreground/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-accent transition-all duration-500 rounded-full"
          style={{ width: `${progress}%`, boxShadow: "0 0 8px rgba(0,173,181,0.5)" }}
        />
      </div>

      {/* Typing area */}
      <div className="flex flex-col gap-3">
        <TextDisplay
          graphemes={lt.graphemes}
          typedGraphemes={lt.typedGraphemes}
          className="bg-card border border-border shadow-sm max-h-32"
          onClick={() => inputRef.current?.focus()}
        />

        {flashDone ? (
          <div className="h-28 flex flex-col items-center justify-center bg-green-500/10 border-2 border-green-500/40 rounded-2xl animate-in zoom-in-95 duration-300">
            <div className="bg-green-500 text-white p-2 rounded-full mb-2">
              <IconCheck size={22} />
            </div>
            <p className="text-green-500 font-bold">Lesson Complete!</p>
            <p className="text-green-500/50 text-xs font-mono mt-0.5">Shuffling & Restarting…</p>
          </div>
        ) : (
          <textarea
            ref={inputRef}
            value={lt.inputValue}
            onChange={(e) => lt.handleInput(e as any)}
            className="w-full bg-card border-2 border-border focus:border-accent rounded-2xl p-6 text-3xl outline-none transition-all resize-none h-24 shadow-sm"
            placeholder="Type the characters above…"
            style={{ fontFamily: "'Noto Serif Devanagari', serif" }}
          />
        )}
      </div>

      {/* Keyboard */}
      <div className="flex justify-center w-full">
        <NepaliKeyboard
          highlight={flashDone ? undefined : highlight}
          isShiftActive={isShiftActive}
        />
      </div>

      {/* Prev / Next */}
      <div className="flex items-center justify-between pt-1.5 border-t border-border">
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-border hover:bg-foreground/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
        >
          ← Previous
        </button>
        <button
          onClick={onNext}
          disabled={!hasNext}
          className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-accent/10 border border-accent/30 text-accent hover:bg-accent/15 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
        >
          Next lesson →
        </button>
      </div>
    </div>
  );
}

// ─── LessonCard (in course overview grid) ────────────────────────────────────
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
      className="group text-left flex flex-col gap-3 p-4 rounded-2xl border border-border bg-card/50 hover:bg-card hover:border-accent/25 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-mono font-bold tabular-nums"
          style={{ color: lv.accent }}
        >
          {String(globalIdx + 1).padStart(2, "0")}
        </span>
        <span className={`w-2 h-2 rounded-full ${lv.dot}`} />
      </div>

      <p
        className="text-[15px] font-bold text-foreground/75 group-hover:text-foreground leading-tight transition-colors"
        style={{ fontFamily: "'Noto Serif Devanagari', serif" }}
      >
        {lesson.title}
      </p>

      <p className="text-[11px] text-foreground/35 font-mono leading-snug flex-1">
        {lesson.subtitle}
      </p>

      <span
        className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border self-start"
        style={{
          color:           lv.accent,
          borderColor:     `${lv.accent}30`,
          backgroundColor: `${lv.accent}10`,
        }}
      >
        {lv.label}
      </span>
    </button>
  );
}

// ─── CourseOverview ───────────────────────────────────────────────────────────
function CourseOverview({ onPick }: { onPick: (l: Lesson) => void }) {
  const grouped = useMemo(
    () => ({
      beginner:     LESSONS.filter((l) => l.level === "beginner"),
      intermediate: LESSONS.filter((l) => l.level === "intermediate"),
      advanced:     LESSONS.filter((l) => l.level === "advanced"),
    }),
    []
  );

  const globalIdx = (lesson: Lesson) => LESSONS.findIndex((l) => l.id === lesson.id);

  return (
    <div className="p-6 pb-12 flex flex-col gap-10 max-w-5xl">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-mono tracking-[0.2em] uppercase text-accent/70">
            Curriculum
          </p>
          <h1 className="text-4xl font-bold text-foreground tracking-tight leading-none">
            Master Nepali Typing
          </h1>
          <p className="text-[15px] text-foreground/45 leading-relaxed max-w-lg mt-1">
            {LESSONS.length} lessons across 3 levels. Follow the order for the best results,
            or jump straight into any lesson.
          </p>
        </div>

        <button
          onClick={() => onPick(LESSONS[0])}
          className="flex-shrink-0 px-6 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent/85 active:scale-[0.97] transition-all shadow-lg shadow-accent/20 self-start sm:self-auto"
        >
          Start from beginning →
        </button>
      </div>

      {/* ── Feature pills ────────────────────────────────────────── */}
      <div className="flex gap-2.5 flex-wrap">
        {(
          [
            { symbol: "↻", label: "Auto-Loop",  color: "#00ADB5" },
            { symbol: "⇄", label: "Shuffle",    color: "#60a5fa" },
            { symbol: "◎", label: "Pro-Stats",  color: "#fbbf24" },
            { symbol: "⌨", label: "Neon Guide", color: "#c084fc" },
          ] as { symbol: string; label: string; color: string }[]
        ).map((f) => (
          <div
            key={f.label}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card/50 select-none"
          >
            <span style={{ color: f.color, fontSize: 13 }}>{f.symbol}</span>
            <span className="text-[12px] text-foreground/55 font-medium">{f.label}</span>
          </div>
        ))}
      </div>

      {/* ── Level sections ───────────────────────────────────────── */}
      {(["beginner", "intermediate", "advanced"] as const).map((level) => {
        const lv   = LEVEL_META[level];
        const list = grouped[level];

        return (
          <div key={level} className="flex flex-col gap-4">

            {/* Section header */}
            <div className="flex items-center gap-3">
              <div
                className="flex items-center gap-2 px-3.5 py-1 rounded-full border text-[11px] font-mono font-bold uppercase tracking-widest"
                style={{
                  color:           lv.accent,
                  borderColor:     `${lv.accent}35`,
                  backgroundColor: `${lv.accent}0d`,
                }}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${lv.dot}`} />
                {lv.label}
              </div>
              <span className="text-[11px] text-foreground/25 font-mono">
                {list.length} lessons
              </span>
              <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${lv.accent}20, transparent)` }} />
            </div>

            {/* Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
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

// ─── LearnTab ─────────────────────────────────────────────────────────────────
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
    <div className="flex-1 overflow-y-auto nepali-scroll min-h-screen max-w-6xl  mx-auto">
      {selected ? (
        <LessonPanel
          key={selected.id}
          lesson={selected}
          onClose={() => setSelected(null)}
          onNext={goNext}
          onPrev={goPrev}
          hasNext={hasNext}
          hasPrev={hasPrev}
        />
      ) : (
        <CourseOverview onPick={setSelected} />
      )}
    </div>
  );
}