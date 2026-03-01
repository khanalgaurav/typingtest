"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { splitGraphemes, getRandomSample } from "@/utils";
import { SAMPLES } from "@/constants";

interface UseTypingTestProps {
  customText: string;
  useCustom: boolean;
}

export function useTypingTest({ customText, useCustom }: UseTypingTestProps) {
  const [selTime, setSelTime] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [testOver, setTestOver] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [target, setTarget] = useState(() => getRandomSample(SAMPLES));
  const [graphemes, setGraphemes] = useState<string[]>(() => splitGraphemes(getRandomSample(SAMPLES)));
  const [typedGraphemes, setTypedGraphemes] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [wpmHistory, setWpmHistory] = useState<number[]>([]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wpmRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  startTimeRef.current = startTime;

  const correctCount = typedGraphemes.filter((ch, i) => ch === graphemes[i]).length;
  const totalTyped = typedGraphemes.length;

  const restart = useCallback(
    (sec: number) => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (wpmRef.current) clearInterval(wpmRef.current);

      const txt = useCustom && customText?.trim() ? customText.trim() : getRandomSample(SAMPLES);
      const g = splitGraphemes(txt);

      setSelTime(sec);
      setTimeLeft(sec);
      setStarted(false);
      setFinished(false);
      setTestOver(false);
      setStartTime(null);
      startTimeRef.current = null;
      setTarget(txt);
      setGraphemes(g);
      setTypedGraphemes([]);
      setInputValue("");
      setWpm(0);
      setAccuracy(0);
      setWpmHistory([]);
    },
    [customText, useCustom]
  );

  // Timer
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!started || selTime === 0) return;

    const end = (startTime || Date.now()) + selTime * 1000;
    timerRef.current = setInterval(() => {
      const rem = Math.max(0, Math.round((end - Date.now()) / 1000));
      setTimeLeft(rem);
      if (rem <= 0) {
        clearInterval(timerRef.current!);
        setTestOver(true);
        setFinished(true);
      }
    }, 100);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [started, selTime, startTime]);

  // WPM history
  useEffect(() => {
    if (wpmRef.current) clearInterval(wpmRef.current);
    if (!started || finished) return;
    wpmRef.current = setInterval(() => {
      setWpmHistory((h) => [...h.slice(-59), wpm]);
    }, 1500);
    return () => { if (wpmRef.current) clearInterval(wpmRef.current); };
  }, [started, finished, wpm]);

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (finished) return;

      const raw = e.target.value;
      setInputValue(raw);

      let nowStartTime = startTimeRef.current;
      if (!startTimeRef.current) {
        const t = Date.now();
        setStarted(true);
        setStartTime(t);
        startTimeRef.current = t;
        nowStartTime = t;
      }

      const tg = splitGraphemes(raw);
      setTypedGraphemes(tg);

      let c = 0;
      let wrong = false;
      for (let i = 0; i < tg.length; i++) {
        if (i >= graphemes.length) break;
        if (!wrong && tg[i] === graphemes[i]) {
          c++;
        } else {
          wrong = true;
        }
      }

      const elapsed = nowStartTime ? Math.max((Date.now() - nowStartTime) / 1000, 0) : 0;
      const mins = Math.max(elapsed / 60, 1 / 60);
      const newWpm = Math.round(c / 5 / mins) || 0;
      const newAcc = tg.length > 0 ? Math.round((c / tg.length) * 100) : 0;

      setWpm(newWpm);
      setAccuracy(newAcc);

      if (selTime === 0 && tg.length >= graphemes.length) {
        setTestOver(true);
        setFinished(true);
      }
    },
    [finished, graphemes, selTime]
  );

  return {
    selTime, setSelTime,
    timeLeft,
    started, finished, testOver,
    target, graphemes,
    typedGraphemes,
    inputValue,
    wpm, accuracy,
    correctCount, totalTyped,
    wpmHistory,
    restart,
    handleInput,
    setTestOver,
    setFinished,
    startTime,
  };
}