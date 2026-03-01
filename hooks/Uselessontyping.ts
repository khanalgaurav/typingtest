"use client";
import { useState, useEffect, useCallback } from "react";
import { splitGraphemes, shuffleArray } from "@/utils";
import type { Lesson } from "@/types";

export function useLessonTyping(lesson: Lesson | null, shuffled = false) {
  const [inputValue, setInputValue] = useState("");
  const [typedGraphemes, setTypedGraphemes] = useState<string[]>([]);
  const [graphemes, setGraphemes] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [currentContent, setCurrentContent] = useState("");

  useEffect(() => {
    if (!lesson) return;
    // For character-level lessons (not sentences), optionally shuffle
    const canShuffle = lesson.level !== "advanced";
    let content = lesson.content;
    if (shuffled && canShuffle) {
      const chars = lesson.content.split(" ").filter(Boolean);
      content = shuffleArray(chars).join(" ");
    }
    const g = splitGraphemes(content);
    setCurrentContent(content);
    setGraphemes(g);
    setTypedGraphemes([]);
    setInputValue("");
    setDone(false);
  }, [lesson, shuffled]);

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (done) return;
      const raw = e.target.value;
      setInputValue(raw);
      const tg = splitGraphemes(raw);
      setTypedGraphemes(tg);
      if (tg.length >= graphemes.length && graphemes.length > 0) {
        setDone(true);
      }
    },
    [done, graphemes.length]
  );

  const reset = useCallback((newShuffled = false, lessonContent = currentContent) => {
    let content = lessonContent;
    if (newShuffled) {
      const chars = lessonContent.split(" ").filter(Boolean);
      content = shuffleArray(chars).join(" ");
    }
    const g = splitGraphemes(content);
    setCurrentContent(content);
    setGraphemes(g);
    setTypedGraphemes([]);
    setInputValue("");
    setDone(false);
  }, [currentContent]);

  const correctCount = typedGraphemes.filter((ch, i) => ch === graphemes[i]).length;
  const accuracy = typedGraphemes.length > 0
    ? Math.round((correctCount / typedGraphemes.length) * 100)
    : 0;

  return { inputValue, typedGraphemes, graphemes, done, handleInput, reset, correctCount, accuracy };
}