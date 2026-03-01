"use client";

import React from "react";

/**
 * Nepali Unicode Traditional Keyboard Layout
 * Updates:
 * 1. Neon Highlight: Vibrant borders instead of solid fills for better character legibility.
 * 2. White Contrast: Active characters turn pure white with drop-shadow.
 * 3. Proportional Scaling: Wide landscape keys for a natural desktop feel.
 */

export interface KeyHighlight {
  keys: string[];
  needsShift: boolean;
  isSpace: boolean;
}

interface KeyboardProps {
  highlight?: KeyHighlight;
  isShiftActive?: boolean;
  className?: string;
}

type KeyDef = [string, string, string];

const ROW1: KeyDef[] = [
  ["`","ञ","॥"], ["1","१","ज्ञ"], ["2","२","ई"], ["3","३","घ"], ["4","४","द्ध"],
  ["5","५","छ"], ["6","६","ट"], ["7","७","ठ"], ["8","८","ड"], ["9","९","ढ"],
  ["0","०","ण"], ["-","औ","ओ"], ["=","",""], ["\\","्","ं"]
];
const ROW2: KeyDef[] = [
  ["q","त्र","त्त"], ["w","ध","ड्ढ"], ["e","भ","ऐ"], ["r","च","द्ब"], ["t","त","ट्ट"],
  ["y","थ","ठ्ठ"], ["u","ग","ऊ"], ["i","ष","क्ष"], ["o","य","इ"], ["p","उ","ए"],
  ["[","र्","ृ"], ["]","े","ै"]
];
const ROW3: KeyDef[] = [
  ["a","ब","आ"], ["s","क","ङ्क"], ["d","म","ङ्ग"], ["f","ा","ँ"], ["g","न","द्द"],
  ["h","ज","झ"], ["j","व","ो"], ["k","प","फ"], ["l","ि","ी"], [";","स","ट्ठ"], ["'","ु","ू"]
];
const ROW4: KeyDef[] = [
  ["z","श","क्क"], ["x","ह","ह्य"], ["c","अ","ऋ"], ["v","ख","ॐ"], ["b","द","ौ"],
  ["n","ल","द्य"], ["m","ः","ड्ड"], [",","ऽ","ङ"], [".","।","श्र"], ["/","र","रू"]
];

function buildCharMap(): Map<string, KeyHighlight> {
  const m = new Map<string, KeyHighlight>();
  [ROW1, ROW2, ROW3, ROW4].forEach(row => {
    row.forEach(([k, normal, shift]) => {
      if (normal) m.set(normal, { keys: [k], needsShift: false, isSpace: false });
      if (shift) m.set(shift, { keys: [k], needsShift: true, isSpace: false });
    });
  });

  const matras = [
    { char: "ो", key: "j", shift: true }, { char: "ौ", key: "b", shift: true },
    { char: "ा", key: "f", shift: false }, { char: "ि", key: "l", shift: false },
    { char: "ी", key: "l", shift: true }, { char: "ु", key: "'", shift: false },
    { char: "ू", key: "'", shift: true }, { char: "े", key: "]", shift: false },
    { char: "ै", key: "]", shift: true }, { char: "ं", key: "\\", shift: true },
    { char: "ँ", key: "f", shift: true }, { char: "्", key: "\\", shift: false },
    { char: "ृ", key: "[", shift: true }
  ];
  matras.forEach(item => m.set(item.char, { keys: [item.key], needsShift: item.shift, isSpace: false }));
  m.set(" ", { keys: [" "], needsShift: false, isSpace: true });
  return m;
}

export const CHAR_MAP = buildCharMap();

export function getKeyHighlight(ch: string): KeyHighlight {
  if (!ch) return { keys: [], needsShift: false, isSpace: false };
  if (ch === " ") return { keys: [" "], needsShift: false, isSpace: true };
  const direct = CHAR_MAP.get(ch);
  if (direct) return direct;
  return CHAR_MAP.get(ch.charAt(0)) ?? { keys: [], needsShift: false, isSpace: false };
}

function Key({ physKey, normal, shift, activeKeys, needsShift, isShiftActive }: any) {
  const isActive = activeKeys.includes(physKey);
  const isShiftNeeded = isActive && needsShift;

  return (
    <div className={`
      relative flex flex-col items-center justify-center rounded-xl border-2 transition-all duration-150 select-none
      w-18 h-14 overflow-hidden
      ${isActive 
        ? (needsShift 
            ? "bg-amber-500/10 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.4)] scale-105 z-10" 
            : "bg-indigo-500/10 border-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.4)] scale-105 z-10")
        : "bg-white/80 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600"
      }
    `}>
      {/* SHIFT CHAR (TOP) */}
      <div className={`flex items-center justify-center w-full h-1/2`}>
        <span className={`text-[15px] font-black transition-all duration-200
          ${isShiftNeeded 
            ? "text-amber-500 scale-125 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" 
            : isShiftActive 
              ? "text-indigo-500 dark:text-indigo-400" 
              : "text-slate-400 dark:text-slate-600 opacity-70"
          }`}>
          {shift}
        </span>
      </div>

      {/* SEPARATOR */}
      <div className={`w-3/4 h-[1px] ${isActive ? "bg-transparent" : "bg-slate-100 dark:bg-slate-800"}`} />

      {/* NORMAL CHAR (BOTTOM) */}
      <div className={`flex items-center justify-center w-full h-1/2`}>
        <span className={`text-[19px] font-bold transition-all duration-200
          ${isActive && !needsShift 
            ? "text-indigo-500 scale-125 drop-shadow-[0_0_8px_rgba(129,140,248,0.8)]" 
            : isShiftActive 
              ? "opacity-20 scale-90 text-slate-400" 
              : "text-slate-800 dark:text-slate-200"
          }`}>
          {normal}
        </span>
      </div>

      {/* PHYSICAL KEY LABEL */}
      <span className="absolute bottom-1 left-1.5 text-[8px] font-black uppercase text-slate-300 dark:text-slate-700 font-mono">
        {physKey}
      </span>
    </div>
  );
}

function SpecialKey({ label, widthCls, isShiftKey, needsShift, isShiftActive }: any) {
  const lit = isShiftKey && (isShiftActive || needsShift);
  return (
    <div className={`
      h-14 flex items-center justify-center rounded-xl border-2 text-[10px] font-black tracking-widest uppercase select-none transition-all px-3 ${widthCls}
      ${lit 
        ? "bg-amber-500 border-amber-400 text-white shadow-lg shadow-amber-500/30" 
        : "bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500"}
    `}>
      {label}
    </div>
  );
}

export function NepaliKeyboard({ highlight, isShiftActive = false, className = "" }: KeyboardProps) {
  const activeKeys = highlight?.keys ?? [];
  const needsShift = highlight?.needsShift ?? false;
  const rowGap = "gap-1.5";

  return (
    <div className={`
      inline-flex flex-col gap-1.5 p-5 rounded-[2.5rem] border-2 shadow-2xl backdrop-blur-md
      bg-white/40 dark:bg-slate-950/70 border-slate-200/60 dark:border-slate-800/60
      ${className}
    `}>
      {/* Row 1 */}
      <div className={`flex ${rowGap}`}>
        {ROW1.map(([k, n, s]) => <Key key={k} physKey={k} normal={n} shift={s} activeKeys={activeKeys} needsShift={needsShift} isShiftActive={isShiftActive} />)}
        <SpecialKey label="⌫" widthCls="w-24" />
      </div>

      {/* Row 2 */}
      <div className={`flex ${rowGap}`}>
        <SpecialKey label="TAB" widthCls="w-20" />
        {ROW2.map(([k, n, s]) => <Key key={k} physKey={k} normal={n} shift={s} activeKeys={activeKeys} needsShift={needsShift} isShiftActive={isShiftActive} />)}
        <SpecialKey label="ENTER" widthCls="w-28" />
      </div>

      {/* Row 3 */}
      <div className={`flex ${rowGap}`}>
        <SpecialKey label="CAPS" widthCls="w-24" />
        {ROW3.map(([k, n, s]) => <Key key={k} physKey={k} normal={n} shift={s} activeKeys={activeKeys} needsShift={needsShift} isShiftActive={isShiftActive} />)}
        <div className="w-24 h-14" />
      </div>

      {/* Row 4 */}
      <div className={`flex ${rowGap}`}>
        <SpecialKey label="SHIFT" widthCls="w-32" isShiftKey needsShift={needsShift} isShiftActive={isShiftActive} />
        {ROW4.map(([k, n, s]) => <Key key={k} physKey={k} normal={n} shift={s} activeKeys={activeKeys} needsShift={needsShift} isShiftActive={isShiftActive} />)}
        <SpecialKey label="SHIFT" widthCls="w-36" isShiftKey needsShift={needsShift} isShiftActive={isShiftActive} />
      </div>

      {/* Row 5 */}
      <div className={`flex justify-center mt-2 ${rowGap}`}>
        <div className={`
          h-14 w-[40rem] rounded-2xl border-2 flex items-center justify-center text-[11px] font-black uppercase tracking-[0.4em] transition-all
          ${highlight?.isSpace 
            ? 'bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/40 scale-[1.02]' 
            : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500'}
        `}>
          SPACE BAR
        </div>
      </div>
    </div>
  );
}