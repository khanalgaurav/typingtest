"use client";
import { useState, useEffect } from "react";
import { TestTab } from "@/components/test/TestTab";
import { LearnTab } from "@/components/learn/LearnTab";
import { StatsTab } from "@/components/stats/StatsTab";
import {
  IconKeyboard,
  IconBook,
  IconChart,
  IconSun,
  IconMoon,
} from "@/components/ui/Icons";
import type { TabId, Theme } from "@/types";
import { HomeTab } from "./HomeTab";
import Image from "next/image";

const THEME_KEY = "nepali_theme_v42";
const SIDEBAR_KEY = "nepali_sidebar_expanded_v1";

// --- Updated Icons with better default sizing ---

function IconHome({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

const TABS: {
  id: TabId;
  icon: React.FC<{ size?: number }>;
  label: string;
  sub: string;
  desc: string;
}[] = [
  { id: "home",  icon: IconHome,     label: "Home",  sub: "सुरुवात", desc: "Setup Guide" },
  { id: "test",  icon: IconKeyboard, label: "Type",  sub: "अभ्यास",  desc: "Speed & accuracy test" },
  { id: "learn", icon: IconBook,     label: "Learn", sub: "सिकाइ",   desc: "Structured lessons" },
  { id: "stats", icon: IconChart,    label: "Stats", sub: "तथ्याङ्क", desc: "Progress & trends" },
];

const TAB_COLORS: Record<TabId, string> = {
  home: "#6366f1",   // indigo
  test: "#14b8a6",   // teal
  learn: "#818cf8",  // violet
  stats: "#fb923c",  // orange
};

function IconChevronLeft({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function IconChevronRight({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export default function NepaliTypingTest() {
  const [tab, setTab] = useState<TabId>("home");
  const [theme, setTheme] = useState<Theme>("dark");
  const [expanded, setExpanded] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<TabId | null>(null);

  useEffect(() => {
    const t = localStorage.getItem(THEME_KEY) as Theme | null;
    if (t) setTheme(t);
    const s = localStorage.getItem(SIDEBAR_KEY);
    if (s !== null) setExpanded(s === "true");
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem(THEME_KEY, next);
  };

  const toggleSidebar = () => {
    const next = !expanded;
    setExpanded(next);
    localStorage.setItem(SIDEBAR_KEY, String(next));
  };

  if (!mounted) return null;

  return (
    <div className={theme} style={{ minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Devanagari:wght@300;400;500;600&display=swap" rel="stylesheet" />
      
      <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">

        {/* ── Updated Sidebar ─────────────────────────────────────────────────── */}
        <aside
          className={[
            "flex-shrink-0 flex flex-col sticky top-0 h-screen overflow-hidden",
            "border-r border-border bg-card/60 backdrop-blur-xl transition-all duration-300 ease-in-out",
            expanded ? "w-72" : "w-[88px]", // Wider sidebar
          ].join(" ")}
        >
          {/* Logo Area - Bigger & Bolder */}
          <div className={[
            "flex items-center border-b border-border transition-all duration-300",
            expanded ? "px-5 py-2 gap-4" : "px-0 py-2 justify-center",
          ].join(" ")}>
            <div className="flex items-center gap-3 min-w-0 hover:cursor-pointer" onClick={() => setTab("home")}>
              <div>
                <Image src="/LogoTyping.png" alt="Logo" width={expanded ? 80 : 80} height={expanded ? 80 : 80} />
              </div>
              {expanded && (
                <div className="overflow-hidden">
                  <p className="text-lg font-bold text-foreground leading-tight tracking-tight pt-1">
                    नेपाली टाइपिङ टेस्ट
                  </p>
                  <p className="text-[10px] font-mono text-accent tracking-widest uppercase mt-0.5">
                    Traditional
                  </p>
                </div>
              )}
            </div>
          </div>

          <nav className="flex flex-col gap-2 px-3 pt-6 flex-1">
            {expanded && (
              <p className="text-[11px] font-mono tracking-[0.2em] uppercase text-foreground/30 px-3 pb-2">
                Navigation
              </p>
            )}

            {TABS.map(({ id, icon: Icon, label, sub, desc }) => {
              const isActive = tab === id;
              const accentColor = TAB_COLORS[id];

              return (
                <div key={id} className="relative group">
                  <button
                    onClick={() => setTab(id)}
                    onMouseEnter={() => setHoveredTab(id)}
                    onMouseLeave={() => setHoveredTab(null)}
                    className={[
                      "relative w-full flex items-center rounded-2xl transition-all duration-200 overflow-hidden border",
                      expanded ? "px-4 py-4 gap-4" : "py-4 justify-center",
                      isActive
                        ? "border-accent/20 bg-accent/5 shadow-sm"
                        : "border-transparent text-foreground/50 hover:bg-foreground/[0.03] hover:text-foreground",
                    ].join(" ")}
                    style={isActive ? { borderColor: `${accentColor}40`, backgroundColor: `${accentColor}10`, color: accentColor } : {}}
                  >
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[4px] rounded-r-full transition-all duration-300"
                      style={{ height: isActive ? "40%" : "0%", background: accentColor }}
                    />

                    {/* Larger Icon Container */}
                    <span className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" 
                          style={isActive ? { background: `${accentColor}20` } : { background: 'rgba(0,0,0,0.03)' }}>
                      <Icon size={20} />
                    </span>

                    {expanded && (
                      <span className="flex-1 min-w-0 text-left">
                        <span className="block text-[15px] font-bold leading-none tracking-tight">{label}</span>
                        <span className="block text-[12px] leading-none mt-1.5 opacity-60 font-devanagari">{sub}</span>
                      </span>
                    )}
                  </button>

                  {/* Tooltip for collapsed mode - Larger */}
                  {!expanded && hoveredTab === id && (
                    <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 z-50 rounded-2xl px-4 py-3 shadow-2xl border border-border bg-card whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-200">
                      <p className="text-sm font-bold" style={{ color: accentColor }}>{label} <span className="font-devanagari ml-2 opacity-50">{sub}</span></p>
                      <p className="text-[11px] text-foreground/40 mt-1 font-medium">{desc}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Bottom section - Larger buttons */}
          <div className="px-3 pb-6 pt-4 border-t border-border flex flex-col gap-2">
            <button
              onClick={toggleTheme}
              className={[
                "w-full flex items-center rounded-2xl border border-transparent text-foreground/40 hover:text-foreground hover:bg-foreground/[0.03] transition-all",
                expanded ? "px-4 py-3.5 gap-4" : "py-3.5 justify-center",
              ].join(" ")}
            >
              <span className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-foreground/[0.03]">
                {theme === "dark" ? <IconSun size={20} /> : <IconMoon size={20} />}
              </span>
              {expanded && (
                <span className="flex-1 text-left">
                  <span className="block text-sm font-bold text-foreground/70">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                  <span className="block text-[10px] font-mono text-foreground/30 uppercase tracking-tighter">Toggle Appearance</span>
                </span>
              )}
            </button>

            <button
              onClick={toggleSidebar}
              className={[
                "w-full flex items-center rounded-2xl border border-border/50 text-foreground/40 hover:text-foreground hover:bg-foreground/[0.03] transition-all",
                expanded ? "px-4 py-3 gap-4" : "py-3 justify-center",
              ].join(" ")}
            >
              <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                {expanded ? <IconChevronLeft size={20} /> : <IconChevronRight size={20} />}
              </span>
              {expanded && <span className="text-sm font-bold">Collapse</span>}
            </button>
          </div>
        </aside>

        {/* ── Main area ───────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 overflow-y-auto nepali-scroll">
            {tab === "home" && <HomeTab onStart={() => setTab("test")} />}
            {tab === "test" && <TestTab onGoStats={() => setTab("stats")} />}
            {tab === "learn" && <LearnTab />}
            {tab === "stats" && <StatsTab />}
          </main>
        </div>
      </div>
    </div>
  );
}