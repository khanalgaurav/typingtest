"use client";
import { useEffect, useRef, useMemo } from "react";

interface TextDisplayProps {
  graphemes: string[];
  typedGraphemes: string[];
  className?: string;
  onClick?: () => void;
}

export function TextDisplay({ graphemes, typedGraphemes, className = "", onClick }: TextDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  // 1. Group graphemes into words so they wrap together
  const words = useMemo(() => {
    const result: { char: string; index: number }[][] = [];
    let currentWord: { char: string; index: number }[] = [];

    graphemes.forEach((g, i) => {
      currentWord.push({ char: g, index: i });
      // If it's a space, end the current word and start a new one
      if (g === " " || g === "\n") {
        result.push(currentWord);
        currentWord = [];
      }
    });

    // Push the last word if there is one
    if (currentWord.length > 0) {
      result.push(currentWord);
    }
    return result;
  }, [graphemes]);

  // 2. Auto-scroll logic (MonkeyType Style)
  useEffect(() => {
    if (!cursorRef.current || !containerRef.current) return;
    const container = containerRef.current;
    const cursor = cursorRef.current;
    
    const cursorOffset = cursor.offsetTop;
    const containerHeight = container.clientHeight;
    
    container.scrollTo({
      top: cursorOffset - containerHeight / 2 + 20,
      behavior: "smooth",
    });
  }, [typedGraphemes.length]);

  return (
    <div
      ref={containerRef}
      className={`relative rounded-2xl px-8 py-10 overflow-hidden select-none cursor-text transition-all ${className}`}
      style={{
        fontFamily: "'Noto Serif Devanagari', serif",
        fontSize: "36px",
        lineHeight: "1.8", // Increased slightly for better readability
        height: "240px",
      }}
      onClick={onClick}
    >
      {/* 
          Using flex-wrap but wrapping each WORD in a span 
          with 'whitespace-nowrap' prevents character splitting.
      */}
      <div className="flex flex-wrap gap-x-0">
        {words.map((word, wordIdx) => (
          <span key={wordIdx} className="inline-block whitespace-nowrap">
            {word.map(({ char, index }) => {
              const isTyped = index < typedGraphemes.length;
              const isCurrent = index === typedGraphemes.length;
              const isCorrect = isTyped && typedGraphemes[index] === graphemes[index];
              const isWrong = isTyped && !isCorrect;

              return (
                <span
                  key={index}
                  ref={isCurrent ? cursorRef : null}
                  className={`relative transition-colors duration-100 ${
                    isCurrent ? "text-foreground" : 
                    isCorrect ? "text-accent" : 
                    isWrong ? "text-red-500" : "text-foreground/20"
                  }`}
                >
                  {isCurrent && (
                    <span className="absolute bottom-0 left-0 w-full h-[3px] bg-accent animate-[pulse_1.2s_infinite]" />
                  )}
                  {char === " " ? "\u00A0" : char}
                  {isWrong && (
                    <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-red-500/50 blur-[1px]" />
                  )}
                </span>
              );
            })}
          </span>
        ))}
      </div>
    </div>
  );
}