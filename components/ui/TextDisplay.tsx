"use client";
import { useEffect, useRef } from "react";

interface TextDisplayProps {
  graphemes: string[];
  typedGraphemes: string[];
  className?: string;
  onClick?: () => void;
  fontSize?: number;
}

export function TextDisplay({
  graphemes,
  typedGraphemes,
  className = "",
  onClick,
  fontSize = 18,
}: TextDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef    = useRef<HTMLSpanElement>(null);

  // Auto-scroll: keep cursor in upper third of the visible area (MonkeyType-style)
  useEffect(() => {
    if (!cursorRef.current || !containerRef.current) return;
    const container  = containerRef.current;
    const cursor     = cursorRef.current;
    const containerTop = container.getBoundingClientRect().top;
    const cursorTop    = cursor.getBoundingClientRect().top;
    const relativeTop  = cursorTop - containerTop + container.scrollTop;
    container.scrollTo({
      top: Math.max(0, relativeTop - container.clientHeight * 0.28),
      behavior: "smooth",
    });
  }, [typedGraphemes.length]);

  return (
    <div
      ref={containerRef}
      role="button"
      tabIndex={0}
      className={`rounded-xl px-5 py-4 overflow-y-auto select-none cursor-text nepali-scroll ${className}`}
      style={{
        fontFamily: "'Noto Serif Devanagari', serif",
        fontSize,
        lineHeight: 2.5,
        wordBreak: "break-word",
      }}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter") onClick?.(); }}
    >
      {graphemes.map((ch, i) => {
        const isTyped   = i < typedGraphemes.length;
        const isCurrent = i === typedGraphemes.length;
        const isCorrect = isTyped && typedGraphemes[i] === graphemes[i];
        const isWrong   = isTyped && !isCorrect;

        // ── Current character: animated underline acts as the cursor ──────
        if (isCurrent) {
          return (
            <span
              key={i}
              ref={cursorRef}
              className="inline"
              style={{
                color: "var(--color-foreground)",
                opacity: 0.6,
                borderBottom: "2.5px solid var(--color-accent)",
                animation: "cursor-blink 1.1s ease-in-out infinite",
                paddingBottom: "1px",
              }}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          );
        }

        // ── Correctly typed ───────────────────────────────────────────────
        if (isCorrect) {
          return (
            <span key={i} style={{ color: "var(--color-accent)" }}>
              {ch === " " ? "\u00A0" : ch}
            </span>
          );
        }

        // ── Wrongly typed ─────────────────────────────────────────────────
        if (isWrong) {
          return (
            <span
              key={i}
              style={{
                color: "#f87171",
                textDecoration: "underline",
                textDecorationStyle: "wavy",
                textDecorationColor: "#f87171",
              }}
            >
              {ch === " " ? "·" : ch}
            </span>
          );
        }

        // ── Untyped ───────────────────────────────────────────────────────
        return (
          <span key={i} style={{ color: "var(--color-foreground)", opacity: 0.28 }}>
            {ch === " " ? "\u00A0" : ch}
          </span>
        );
      })}
    </div>
  );
}