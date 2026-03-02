"use client";

import React from "react";

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

// --- LOGIC PRESERVED EXACTLY ---
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

// --- ENHANCED READABILITY COMPONENTS ---

function Key({ physKey, normal, shift, activeKeys, needsShift, isShiftActive }: any) {
  const isActive = activeKeys.includes(physKey);
  const isShiftNeeded = isActive && needsShift;

  return (
    <div className={`
      relative flex flex-col items-center justify-center rounded-xl border transition-all duration-100 select-none
      w-12 h-12 shrink-0
      ${isActive 
        ? (needsShift 
            ? "bg-amber-500 border-amber-400 text-white shadow-[0_0_20px_rgba(245,158,11,0.5)] scale-105 z-10" 
            : "bg-accent border-accent text-white shadow-[0_0_20px_rgba(0,173,181,0.5)] scale-105 z-10")
        : "bg-card/40 border-white/5 hover:border-white/20"
      }
    `}>
      {/* SHIFT CHARACTER (TOP) - INCREASED SIZE AND WEIGHT */}
      <span className={`text-[15px] font-black leading-none absolute top-1.5 transition-all
        ${isShiftNeeded 
          ? "text-white scale-110" 
          : isShiftActive 
            ? "text-amber-400 opacity-100 scale-105 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" 
            : "text-foreground/30"
        }`}>
        {shift}
      </span>

      {/* NORMAL CHARACTER (BOTTOM) */}
      <span className={`text-[20px] font-bold leading-none mt-4 transition-all
        ${isActive && !needsShift 
          ? "text-white" 
          : isShiftActive 
            ? "opacity-5" /* Hide normal char when shift is held */
            : "text-foreground/80"
        }`}>
        {normal}
      </span>

      {/* PHYS KEY LABEL (Subtle) */}
      <span className="absolute bottom-0.5 right-1 text-[6px] font-mono text-foreground/10 uppercase">
        {physKey}
      </span>
    </div>
  );
}

function SpecialKey({ label, widthCls, isShiftKey, needsShift, isShiftActive }: any) {
  const lit = isShiftKey && (isShiftActive || needsShift);
  return (
    <div className={`
      h-12 flex items-center justify-center rounded-xl border text-[9px] font-mono font-bold tracking-tighter uppercase select-none transition-all px-2 shrink-0 ${widthCls}
      ${lit 
        ? "bg-amber-500 border-amber-400 text-white shadow-lg shadow-amber-500/20" 
        : "bg-card/40 border-white/5 text-foreground/30"}
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
      inline-flex flex-col gap-1.5 p-4 rounded-3xl border border-white/10
      dark:bg-[#1a1a1a]/40 origin-top scale-95 lg:scale-100 bg-accent/20

      ${className}
    `}>
      {/* Row 1 */}
      <div className={`flex ${rowGap}`}>
        {ROW1.map(([k, n, s]) => <Key key={k} physKey={k} normal={n} shift={s} activeKeys={activeKeys} needsShift={needsShift} isShiftActive={isShiftActive} />)}
        <SpecialKey label="BACK" widthCls="w-16" />
      </div>

      {/* Row 2 */}
      <div className={`flex ${rowGap}`}>
        <SpecialKey label="TAB" widthCls="w-14" />
        {ROW2.map(([k, n, s]) => <Key key={k} physKey={k} normal={n} shift={s} activeKeys={activeKeys} needsShift={needsShift} isShiftActive={isShiftActive} />)}
        <SpecialKey label="ENTER" widthCls="w-16" />
      </div>

      {/* Row 3 */}
      <div className={`flex ${rowGap}`}>
        <SpecialKey label="CAPS" widthCls="w-16" />
        {ROW3.map(([k, n, s]) => <Key key={k} physKey={k} normal={n} shift={s} activeKeys={activeKeys} needsShift={needsShift} isShiftActive={isShiftActive} />)}
        <div className="w-14 h-12 rounded-xl border border-white/5 bg-white/5 opacity-20" />
      </div>

      {/* Row 4 */}
      <div className={`flex ${rowGap}`}>
        <SpecialKey label="SHIFT" widthCls="w-20" isShiftKey needsShift={needsShift} isShiftActive={isShiftActive} />
        {ROW4.map(([k, n, s]) => <Key key={k} physKey={k} normal={n} shift={s} activeKeys={activeKeys} needsShift={needsShift} isShiftActive={isShiftActive} />)}
        <SpecialKey label="SHIFT" widthCls="w-28" isShiftKey needsShift={needsShift} isShiftActive={isShiftActive} />
      </div>

      {/* Row 5 */}
      <div className={`flex justify-center mt-1 ${rowGap}`}>
        <div className={`
          h-11 w-[24rem] rounded-2xl border flex items-center justify-center text-[10px] font-mono font-bold uppercase tracking-[0.5em] transition-all
          ${highlight?.isSpace 
            ? 'bg-accent border-accent text-white shadow-[0_0_25px_rgba(0,173,181,0.4)]' 
            : 'bg-card/40 border-white/5 text-foreground/20'}
        `}>
          SPACE
        </div>
      </div>
    </div>
  );
}