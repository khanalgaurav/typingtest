"use client";
import { useState, useEffect } from "react";
import { TestTab }  from "@/components/test/TestTab";
import { LearnTab } from "@/components/learn/LearnTab";
import { StatsTab } from "@/components/stats/StatsTab";
import { IconKeyboard, IconBook, IconChart, IconSun, IconMoon } from "@/components/ui/Icons";
import type { TabId, Theme } from "@/types";

const THEME_KEY = "nepali_theme_v42";

const TABS: { id: TabId; icon: React.FC<{ size?: number }>; label: string; sub: string }[] = [
  { id: "test",  icon: IconKeyboard, label: "Type",  sub: "अभ्यास"  },
  { id: "learn", icon: IconBook,     label: "Learn", sub: "सिकाइ"   },
  { id: "stats", icon: IconChart,    label: "Stats", sub: "तथ्याङ्क" },
];

const TAB_TITLES: Record<TabId, { title: string; subtitle: string }> = {
  test:  { title: "Typing Test",          subtitle: "नेपाली टाइपिङ अभ्यास · Type and track your speed" },
  learn: { title: "Structured Lessons",   subtitle: "अक्षरबाट वाक्यसम्म · Characters → Words → Sentences" },
  stats: { title: "Your Progress",        subtitle: "WPM trend, accuracy history & personal bests" },
};

export default function NepaliTypingTest() {
  const [tab,     setTab]     = useState<TabId>("test");
  const [theme,   setTheme]   = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem(THEME_KEY) as Theme | null;
    if (t) setTheme(t);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem(THEME_KEY, next);
  };

  if (!mounted) return null;

  const { title, subtitle } = TAB_TITLES[tab];

  return (
    <div className={theme} style={{ minHeight: "100vh" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Serif+Devanagari:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />
      <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">

        {/* ── Sidebar ─────────────────────────────────────────────────────── */}
        <aside className="w-[76px] flex-shrink-0 flex flex-col items-center py-5 gap-2 border-r border-border bg-card/30 sticky top-0 h-screen overflow-hidden">

          {/* Logo */}
          <div
            className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white font-bold text-xl select-none mb-4"
            style={{ fontFamily: "'Noto Serif Devanagari', serif" }}
            title="Nepali Typing"
          >
            न
          </div>

          {/* Nav tabs */}
          <nav className="flex flex-col gap-1.5 w-full px-2.5">
            {TABS.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                title={label}
                className={[
                  "flex flex-col items-center justify-center gap-1",
                  "w-full py-2.5 rounded-xl",
                  "text-[8px] font-mono uppercase tracking-wider transition-all",
                  tab === id
                    ? "bg-accent/15 text-accent border border-accent/30"
                    : "text-foreground/35 hover:text-foreground hover:bg-card border border-transparent",
                ].join(" ")}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>

          <div className="flex-1" />

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to light" : "Switch to dark"}
            className="flex flex-col items-center justify-center gap-1 w-full px-2.5 py-2.5 rounded-xl text-[8px] font-mono uppercase tracking-wider text-foreground/35 hover:text-foreground hover:bg-card border border-transparent transition-all mx-2.5"
          >
            {theme === "dark" ? <IconSun size={17} /> : <IconMoon size={17} />}
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </aside>

        {/* ── Main area ───────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Slim top bar */}
          {/* <header className="flex items-center justify-between px-6 py-3.5 border-b border-border bg-background/80 backdrop-blur-sm">
            <div>
              <h1 className="text-sm font-semibold text-foreground leading-tight">{title}</h1>
              <p className="text-[10px] text-foreground/35 font-mono mt-0.5">{subtitle}</p>
            </div>
            <div className="text-[9px] font-mono text-foreground/20 tracking-widest">
              Unicode Traditional
            </div>
          </header> */}

          {/* Content */}
          <main className="flex-1 px-6 py-5 overflow-y-auto nepali-scroll">
            {tab === "test"  && <TestTab  onGoStats={() => setTab("stats")} />}
            {tab === "learn" && <LearnTab />}
            {tab === "stats" && <StatsTab />}
          </main>

        </div>
      </div>
    </div>
  );
}