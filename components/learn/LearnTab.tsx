"use client";
import { useState, useRef, useEffect } from "react";
import { useLessonTyping } from "@/hooks/Uselessontyping";
import { TextDisplay }     from "@/components/ui/TextDisplay";
import { NepaliKeyboard, getKeyHighlight } from "@/components/keyboard/NepaliKeyboard";
import { IconX, IconLightbulb } from "@/components/ui/Icons";
import { LESSONS } from "@/constants";
import type { Lesson } from "@/types";

const LEVEL_STYLE = {
  beginner:     { dot: "bg-green-400",  text: "text-green-400",  label: "Beginner"     },
  intermediate: { dot: "bg-blue-400",   text: "text-blue-400",   label: "Intermediate" },
  advanced:     { dot: "bg-yellow-400", text: "text-yellow-400", label: "Advanced"     },
};

// ─── LessonCard ───────────────────────────────────────────────────────────────
function LessonCard({ lesson, isActive, onClick }: { lesson: Lesson; isActive: boolean; onClick: () => void }) {
  const lv = LEVEL_STYLE[lesson.level];
  return (
    <button
      onClick={onClick}
      className={[
        "w-full text-left rounded-xl px-3 py-3 border transition-all",
        isActive
          ? "bg-card border-accent/50 shadow-sm shadow-accent/10"
          : "bg-card/30 border-border hover:border-accent/30 hover:bg-card/60",
      ].join(" ")}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${lv.dot}`} />
        <span className={`text-[8px] font-mono uppercase tracking-widest ${lv.text}`}>{lv.label}</span>
      </div>
      <div className="text-sm text-foreground leading-tight" style={{ fontFamily: "'Noto Serif Devanagari', serif" }}>
        {lesson.title}
      </div>
      <div className="text-[10px] text-foreground/40 mt-0.5">{lesson.subtitle}</div>
    </button>
  );
}

// ─── LessonPanel ─────────────────────────────────────────────────────────────
function LessonPanel({ lesson, onClose }: { lesson: Lesson; onClose: () => void }) {
  const lv         = LEVEL_STYLE[lesson.level];
  // Shuffle chars for beginner/intermediate; advanced (sentences) keep natural order
  const canShuffle = lesson.level !== "advanced";

  const [isShiftActive, setIsShiftActive] = useState(false);
  const [loopCount,     setLoopCount]     = useState(0);
  const [flashDone,     setFlashDone]     = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const lt       = useLessonTyping(lesson, canShuffle); // always shuffled for char lessons

  // Focus on mount / lesson switch
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 60); }, [lesson]);

  // Shift key tracking
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

  // Auto-loop: when done, flash green 900ms then silently restart with new shuffle
  useEffect(() => {
    if (!lt.done) return;
    setFlashDone(true);
    const t = setTimeout(() => {
      setLoopCount((n) => n + 1);
      lt.reset(canShuffle, lesson.content);
      setFlashDone(false);
      setTimeout(() => inputRef.current?.focus(), 30);
    }, 900);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lt.done]);

  const nextChar  = lt.graphemes[lt.typedGraphemes.length] ?? "";
  const highlight = getKeyHighlight(nextChar);
  const progress  = lt.graphemes.length > 0
    ? (lt.typedGraphemes.length / lt.graphemes.length) * 100
    : 0;

  return (
    <div className="flex flex-col gap-3">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`w-1.5 h-1.5 rounded-full ${lv.dot}`} />
            <span className={`text-[9px] font-mono uppercase tracking-widest ${lv.text}`}>{lv.label}</span>
            {loopCount > 0 && (
              <span className="text-[8px] font-mono text-foreground/35 bg-card px-2 py-0.5 rounded-full border border-border">
                Loop {loopCount + 1}
              </span>
            )}
          </div>
          <h3 className="text-lg font-medium text-foreground leading-tight"
            style={{ fontFamily: "'Noto Serif Devanagari', serif" }}>
            {lesson.title}
          </h3>
          <p className="text-[10px] text-foreground/40 mt-0.5">{lesson.subtitle}</p>
        </div>
        <button
          onClick={onClose}
          className="text-foreground/30 hover:text-foreground/60 transition-colors mt-1 p-1"
        >
          <IconX size={14} />
        </button>
      </div>

      {/* Tip */}
      <div className="flex gap-2 bg-card/30 border-l-2 border-accent rounded-r-lg px-3 py-2">
        <IconLightbulb size={12} className="text-accent flex-shrink-0 mt-0.5" />
        <p className="text-[10px] text-foreground/55 leading-relaxed italic">{lesson.tip}</p>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-[3px] bg-border rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-200 ${flashDone ? "bg-green-400" : "bg-accent"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[9px] font-mono text-foreground/30 tabular-nums w-9 text-right">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Completion flash */}
      {flashDone && (
        <div className="flex items-center gap-2 bg-green-400/10 border border-green-400/30 rounded-lg px-3 py-2 text-green-400 text-[11px] font-mono">
          <span>✓</span>
          <span>Complete! {lt.accuracy}% accuracy — restarting…</span>
        </div>
      )}

      {/* Live stats */}
      {lt.typedGraphemes.length > 0 && !flashDone && (
        <div className="flex items-center gap-4 text-[10px] font-mono text-foreground/40">
          <span>
            Accuracy{" "}
            <span className={lt.accuracy >= 90 ? "text-green-400" : lt.accuracy >= 70 ? "text-blue-400" : "text-red-400"}>
              {lt.accuracy}%
            </span>
          </span>
          <span>
            Progress{" "}
            <span className="text-accent">{lt.typedGraphemes.length}/{lt.graphemes.length}</span>
          </span>
        </div>
      )}

      {/* Text display */}
      <TextDisplay
        graphemes={lt.graphemes}
        typedGraphemes={lt.typedGraphemes}
        className="bg-card/20 border border-border min-h-[3.5rem] max-h-[5rem]"
        fontSize={15}
        onClick={() => inputRef.current?.focus()}
      />

      {/* Input — always visible; disabled during flash */}
      <input
        ref={inputRef}
        value={lt.inputValue}
        onChange={lt.handleInput}
        onKeyDown={(e) => e.stopPropagation()}
        placeholder={flashDone ? "" : "Type the characters above…"}
        disabled={flashDone}
        autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
        className="w-full bg-card/60 border border-border focus:border-accent disabled:opacity-30 rounded-xl px-4 py-2 text-foreground text-sm outline-none transition-colors"
        style={{ fontFamily: "'Noto Serif Devanagari', serif" }}
      />

      {/* Keyboard */}
      <div className="flex justify-center overflow-x-auto pb-1 pt-1">
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

  const grouped = {
    beginner:     LESSONS.filter((l) => l.level === "beginner"),
    intermediate: LESSONS.filter((l) => l.level === "intermediate"),
    advanced:     LESSONS.filter((l) => l.level === "advanced"),
  };

  return (
    <div className="flex gap-4">

      {/* Sidebar */}
      <div className="w-44 flex-shrink-0 overflow-y-auto nepali-scroll pr-1" style={{ maxHeight: "80vh" }}>
        {(["beginner", "intermediate", "advanced"] as const).map((level) => {
          const lv = LEVEL_STYLE[level];
          return (
            <div key={level}>
              <div className="flex items-center gap-1.5 mb-1 mt-3 px-1">
                <span className={`w-1 h-1 rounded-full ${lv.dot}`} />
                <span className={`text-[8px] font-mono uppercase tracking-widest ${lv.text}`}>{lv.label}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {grouped[level].map((l) => (
                  <LessonCard key={l.id} lesson={l} isActive={selected?.id === l.id} onClick={() => setSelected(l)} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Panel */}
      <div className="flex-1 bg-card/20 border border-border rounded-2xl p-5 overflow-y-auto nepali-scroll min-h-96">
        {selected ? (
          <LessonPanel key={selected.id} lesson={selected} onClose={() => setSelected(null)} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-10 gap-3">
            <div className="w-11 h-11 rounded-2xl bg-card flex items-center justify-center">
              <IconLightbulb size={20} className="text-accent/50" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground/55 mb-1">Select a lesson to begin</p>
              <p className="text-[11px] text-foreground/30 max-w-xs">
                Start with Vowels if you&apos;re new. Lessons auto-loop with shuffled characters — no buttons needed.
              </p>
            </div>
            <div className="mt-2 text-left space-y-2 max-w-xs">
              {[
                ["Auto-loop",    "Finishes and restarts automatically — just keep typing."],
                ["Auto-shuffle", "Character order randomises every round."],
                ["Accuracy first", "Hit 95%+ before chasing speed."],
              ].map(([t, b]) => (
                <div key={t as string} className="flex gap-2">
                  <div className="w-0.5 rounded-full bg-accent/40 flex-shrink-0 mt-1.5" />
                  <p className="text-[10px] text-foreground/40">
                    <span className="font-semibold text-foreground/60">{t} — </span>{b}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}