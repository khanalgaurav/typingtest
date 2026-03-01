"use client";
import { IconKeyboard, IconBook, IconChart, IconSun, IconMoon } from "@/components/ui/Icons";
import type { TabId, Theme } from "@/types";

interface HeaderProps {
  tab: TabId;
  setTab: (t: TabId) => void;
  theme: Theme;
  toggleTheme: () => void;
}

const TABS = [
  { id: "test" as TabId,  icon: IconKeyboard, label: "Type"  },
  { id: "learn" as TabId, icon: IconBook,     label: "Learn" },
  { id: "stats" as TabId, icon: IconChart,    label: "Stats" },
];

export function Header({ tab, setTab, theme, toggleTheme }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-3 border-b border-border bg-background/95 backdrop-blur-md">
      {/* Logo */}
      <div className="flex items-center gap-3 min-w-[140px]">
        <div
          className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-bg font-bold text-base select-none"
          style={{ fontFamily: "'Noto Serif Devanagari', serif" }}
        >
          न
        </div>
        <div>
          <div className="text-xs font-bold text-foreground leading-tight">Nepali Typing</div>
          <div className="text-[9px] text-foreground/40 font-mono">Learn · Practice · Master</div>
        </div>
      </div>

      {/* Navigation — centered */}
      <nav className="flex items-center gap-1">
        {TABS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono transition-all ${
              tab === id
                ? "bg-accent/15 text-accent border border-accent/30"
                : "text-foreground/50 hover:text-foreground hover:bg-card/80 border border-transparent"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </nav>

      {/* Theme toggle */}
      <div className="min-w-[140px] flex justify-end">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-border hover:border-accent/40 text-foreground/60 hover:text-foreground rounded-lg text-xs font-mono transition-all"
        >
          {theme === "dark" ? <IconSun size={14} /> : <IconMoon size={14} />}
          {theme === "dark" ? "Light" : "Dark"}
        </button>
      </div>
    </header>
  );
}