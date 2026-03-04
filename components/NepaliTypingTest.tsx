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

// --- Additional Icons for Home Tab ---

function IconHome({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function IconDownload({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

// --- Main Layout Component ---

const TABS: {
  id: TabId;
  icon: React.FC<{ size?: number }>;
  label: string;
  sub: string;
  desc: string;
  shortcut: string;
}[] = [
  {
    id: "home",
    icon: IconHome,
    label: "Home",
    sub: "सुरुवात",
    desc: "Setup Guide",
    shortcut: "H",
  },
  {
    id: "test",
    icon: IconKeyboard,
    label: "Type",
    sub: "अभ्यास",
    desc: "Speed & accuracy test",
    shortcut: "T",
  },
  {
    id: "learn",
    icon: IconBook,
    label: "Learn",
    sub: "सिकाइ",
    desc: "Structured lessons",
    shortcut: "L",
  },
  {
    id: "stats",
    icon: IconChart,
    label: "Stats",
    sub: "तथ्याङ्क",
    desc: "Progress & trends",
    shortcut: "S",
  },
];

const TAB_TITLES: Record<TabId, { title: string; subtitle: string }> = {
  home: {
    title: "Welcome & Setup",
    subtitle: "नेपाली टाइपिङ सुरु गर्नु अघि · Getting your system ready",
  },
  test: {
    title: "Typing Test",
    subtitle: "नेपाली टाइपिङ अभ्यास · Type and track your speed",
  },
  learn: {
    title: "Structured Lessons",
    subtitle: "अक्षरबाट वाक्यसम्म · Characters → Words → Sentences",
  },
  stats: {
    title: "Your Progress",
    subtitle: "WPM trend, accuracy history & personal bests",
  },
};

const TAB_COLORS: Record<TabId, string> = {
  home: "#6366f1",   // indigo
  test: "#14b8a6",   // teal
  learn: "#818cf8",  // violet
  stats: "#fb923c",  // orange
};

function IconChevronLeft({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function IconChevronRight({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Serif+Devanagari:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />
      <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">

        {/* ── Sidebar ─────────────────────────────────────────────────────── */}
        <aside
          className={[
            "flex-shrink-0 flex flex-col sticky top-0 h-screen overflow-hidden",
            "border-r border-border ",
            "transition-all duration-300 ease-in-out",
            "bg-card/60 ",
            expanded ? "w-60" : "w-[72px]",
          ].join(" ")}
          style={{
            boxShadow:
              theme === "dark"
                ? "inset -1px 0 0 rgba(255,255,255,0.04), 4px 0 24px rgba(0,0,0,0.25)"
                : "inset -1px 0 0 rgba(0,0,0,0.04), 4px 0 20px rgba(0,0,0,0.06)",
          }}
        >
          {/* Logo Area */}
          <div className={[
            "flex items-center border-b border-border transition-all duration-300",
            expanded ? "px-4 py-4 gap-3 justify-between" : "px-0 py-4 justify-center",
          ].join(" ")}>
            <div className="flex items-center gap-1 min-w-0">
              <div className="">
                <Image src="/LogoTyping.png" alt="Logo" width={60} height={60} />
              </div>
              {expanded && (
                <div className="overflow-hidden transition-all duration-300">
                  <p className="text-[13px] font-semibold text-foreground whitespace-nowrap leading-tight tracking-tight">
                    नेपाली टाइपिङ टेस्ट<br className="hidden sm:block" />Nepali Typing Test
                  </p>
                  <p className="text-[9px] font-mono text-foreground/30 whitespace-nowrap tracking-widest uppercase mt-0.5">
                    Unicode Traditional
                  </p>
                </div>
              )}
            </div>
            {expanded && (
              <button onClick={toggleSidebar} className="text-foreground/30 hover:text-foreground/70 transition-colors">
                <IconChevronLeft size={13} />
              </button>
            )}
          </div>

          <nav className="flex flex-col gap-1 px-2.5 pt-3 flex-1 overflow-hidden">
            {!expanded && (
              <button onClick={toggleSidebar} className="w-full h-8 mb-2 rounded-lg flex items-center justify-center text-foreground/25 hover:text-foreground/60 hover:bg-foreground/5 border border-transparent hover:border-border transition-all">
                <IconChevronRight size={13} />
              </button>
            )}

            {expanded && (
              <p className="text-[9px] font-mono tracking-[0.14em] uppercase text-foreground/25 px-1 pb-1">Menu</p>
            )}

            {TABS.map(({ id, icon: Icon, label, sub, desc, shortcut }) => {
              const isActive = tab === id;
              const isHovered = hoveredTab === id;
              const accentColor = TAB_COLORS[id];

              return (
                <div key={id} className="relative">
                  <button
                    onClick={() => setTab(id)}
                    onMouseEnter={() => setHoveredTab(id)}
                    onMouseLeave={() => setHoveredTab(null)}
                    className={[
                      "relative w-full flex items-center rounded-xl transition-all duration-200 overflow-hidden border",
                      expanded ? "px-3 py-2.5 gap-3" : "py-2.5 justify-center",
                      isActive
                        ? "border-accent/25 bg-accent/10 text-accent"
                        : "border-transparent text-foreground/40 hover:text-foreground/75 hover:bg-foreground/5 hover:border-border",
                    ].join(" ")}
                    style={isActive ? { borderColor: `${accentColor}30`, backgroundColor: `${accentColor}12`, color: accentColor } : {}}
                  >
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full transition-all duration-300"
                      style={{ height: isActive ? "55%" : "0%", background: accentColor, opacity: isActive ? 1 : 0 }}
                    />

                    <span className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={isActive ? { background: `${accentColor}1a` } : {}}>
                      <Icon size={16} />
                    </span>

                    {expanded && (
                      <span className="flex-1 min-w-0 text-left transition-all duration-200">
                        <span className="block text-[12.5px] font-semibold leading-tight tracking-[-0.01em] truncate">{label}</span>
                        <span className="block text-[9.5px] leading-tight mt-0.5 opacity-50 truncate font-devanagari">{sub}</span>
                      </span>
                    )}
                  </button>

                  {/* Tooltip for collapsed mode */}
                  {!expanded && isHovered && (
                    <div className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 z-50 rounded-xl px-3 py-2.5 shadow-2xl border border-border bg-card text-foreground whitespace-nowrap">
                      <p className="text-[12px] font-semibold" style={{ color: accentColor }}>{label}</p>
                      <p className="text-[10px] text-foreground/40 mt-0.5 font-mono">{desc}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="px-2.5 pb-4 pt-2 border-t border-border flex flex-col gap-1">
            <button
              onClick={toggleTheme}
              className={[
                "w-full flex items-center rounded-xl border border-transparent text-foreground/35 hover:text-foreground/70 hover:bg-foreground/5 hover:border-border transition-all",
                expanded ? "px-3 py-2.5 gap-3" : "py-2.5 justify-center",
              ].join(" ")}
            >
              <span className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-foreground/5">
                {theme === "dark" ? <IconSun size={16} /> : <IconMoon size={16} />}
              </span>
              {expanded && (
                <span className="flex-1 min-w-0 text-left">
                  <span className="block text-[12px] font-semibold text-foreground/60">{theme === "dark" ? "Light mode" : "Dark mode"}</span>
                  <span className="block text-[9.5px] font-mono text-foreground/25 mt-0.5">Switch Theme</span>
                </span>
              )}
            </button>
            {expanded && <p className="text-[9px] font-mono text-foreground/15 text-center pt-1">v1.0 · Unicode Traditional</p>}
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