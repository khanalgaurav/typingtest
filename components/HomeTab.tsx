"use client";
import { useState } from "react";
import { IconBook, IconKeyboard, IconChart } from "@/components/ui/Icons";
import Image from "next/image";

function IconDownload({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}

function IconCheck({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function IconArrowRight({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  );
}

function IconStar({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

const BG_CHARS = ["क", "ख", "ग", "घ", "ङ", "च", "छ", "ज", "झ", "ञ", "ट", "ठ", "ड", "ढ", "ण", "त", "थ", "द", "ध", "न", "प", "फ", "ब", "भ", "म", "य", "र", "ल", "व", "श", "ष", "स", "ह", "अ", "आ", "इ", "ई", "उ", "ऊ", "ए", "ऐ", "ओ", "औ"];

const SETUP_STEPS = [
  {
    num: "01",
    nepali: "डाउनलोड",
    title: "Download Layout",
    desc: "Get the official Nepali Unicode Traditional keyboard layout from LTK (Language Technology Kendra).",
    detail: "Free, open-source, maintained by the Nepal government's language technology body.",
    action: { label: "Download from ltk.org.np", href: "https://ltk.org.np/downloads.php" },
    icon: <IconDownload size={22} />,
    color: "#00ADB5",
  },
  {
    num: "02",
    nepali: "इन्स्टल",
    title: "Install Package",
    desc: "Extract the downloaded .zip file and run setup.exe with administrator privileges.",
    detail: "During installation, keep all default options selected. Restart may be required.",
    action: null,
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    color: "#818cf8",
  },
  {
    num: "03",
    nepali: "एक्टिभेट",
    title: "Activate Keyboard",
    desc: "Press Win + Space (or Alt + Shift) to switch to 'Nepali Unicode Traditional' keyboard.",
    detail: "You can switch back to English anytime using the same shortcut.",
    action: null,
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="M8 15h8M8 11h3M8 7h8"/>
      </svg>
    ),
    color: "#34d399",
  },
  {
    num: "04",
    nepali: "टाइप गर्नुहोस्",
    title: "Start Practicing",
    desc: `You're all set! Click I'm Ready below to jump into the typing test and start practising.`,
    detail: "Begin with the Learn tab to understand character mappings before the speed test.",
    action: null,
    icon: <IconKeyboard size={22} />,
    color: "#fb923c",
  },
];

const FEATURES = [
  { id: 'wpm',     label: "Real-time WPM",    desc: "Watch your words per minute climb in real-time.",      color: "#00ADB5" },
  { id: 'acc',     label: "Accuracy Meter",   desc: "Precision tracking with a mistake-by-mistake breakdown.", color: "#10b981" },
  { id: 'loop',    label: "Auto-loop",        desc: "Lessons repeat automatically until you hit perfection.", color: "#6366f1" },
  { id: 'neon',    label: "Neon Key Guide",   desc: "Dynamic on-screen highlights for the next key strike.", color: "#f43f5e" },
  { id: 'shuffle', label: "Shuffle Mode",     desc: "Randomize letter order to prevent muscle memory traps.", color: "#fb923c" },
  { id: 'stats',   label: "Progress History", desc: "Visualize your growth with trend lines and bests.",      color: "#8b5cf6" },
];

// Helper to render the right SVG for each feature
function FeatureIcon({ id, color }: { id: string; color: string }) {
  const props = { size: 24, strokeWidth: 2, color };
  switch (id) {
    case 'wpm': return (
      <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    );
    case 'acc': return (
      <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
      </svg>
    );
    case 'loop': return (
      <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><polyline points="21 3 21 8 16 8" />
      </svg>
    );
    case 'neon': return (
      <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M7 16h10" />
      </svg>
    );
    case 'shuffle': return (
      <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" /><polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" /><line x1="4" y1="4" x2="9" y2="9" />
      </svg>
    );
    case 'stats': return (
      <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
      </svg>
    );
    default: return null;
  }
}

const TESTIMONIALS = [
  { name: "Sanjay M.",    text: "Went from 12 WPM to 48 WPM in two weeks. The key guide is a game changer.",  stars: 5 },
  { name: "Priya K.",     text: "Finally a tool that teaches Traditional layout properly. The lessons are perfect.", stars: 5 },
  { name: "Bikash T.",    text: "Clean design, zero distractions. Best Nepali typing tool I've used.",          stars: 5 },
];

export function HomeTab({ onStart }: { onStart: () => void }) {
  const [activeStep, setActiveStep] = useState(0);
  const [doneSteps, setDoneSteps]   = useState<number[]>([]);

  const markDone = (i: number) => {
    setDoneSteps((prev) => prev.includes(i) ? prev : [...prev, i]);
    if (i < SETUP_STEPS.length - 1) setActiveStep(i + 1);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Decorative background */}
      <div className="pointer-events-none select-none absolute inset-0 overflow-hidden" aria-hidden>
        {BG_CHARS.slice(0, 24).map((ch, i) => (
          <span
            key={i}
            className="absolute font-devanagari text-foreground/[0.02] font-bold"
            style={{
              fontSize: `${32 + (i % 5) * 16}px`,
              left:  `${(i * 37 + 11) % 96}%`,
              top:   `${(i * 53 + 7)  % 110}%`,
              transform: `rotate(${(i % 7) * 8 - 24}deg)`,
            }}
          >
            {ch}
          </span>
        ))}
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-12 flex flex-col gap-20">

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="w-8 h-px bg-accent" />
              <span className="text-[12px] font-mono tracking-[0.25em] uppercase text-accent font-bold">
                Nepali Unicode Traditional
              </span>
            </div>

            <h1 className="text-6xl lg:text-7xl flex flex-col gap-4 font-bold tracking-tight leading-[1.05] text-foreground">
              Nepali Typing<br />
              <span className="font-devanagari font-semibold text-accent">
                सहजै सिक्नुहोस्
              </span>
            </h1>

            <p className="text-lg text-foreground/50 leading-relaxed max-w-xl">
              The most complete Nepali Unicode Traditional typing trainer — real-time speed tests, structured lessons, and a neon key guide to get you typing fluently.
            </p>

            <div className="flex gap-10 pt-2">
              {[
                { val: "11",    unit: "lessons"   },
                { val: "4",     unit: "test modes" },
                { val: "100%",  unit: "free"       },
              ].map(({ val, unit }) => (
                <div key={unit} className="flex flex-col">
                  <span className="text-3xl font-bold font-mono text-accent leading-none">{val}</span>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-foreground/35 mt-1.5 font-bold">{unit}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-5 pt-4">
              <button
                onClick={onStart}
                className="flex items-center gap-3 px-8 py-4 bg-accent text-white font-bold text-base rounded-2xl hover:bg-accent/85 active:scale-[0.97] transition-all shadow-2xl shadow-accent/25"
              >
                Start Typing Now
                <IconArrowRight size={18} />
              </button>
              <span className="text-xs text-foreground/30 font-mono font-medium">
                No account needed
              </span>
            </div>
          </div>

          <div className="flex-shrink-0 relative hidden lg:block">
            <div
              className="w-96 h-96 rounded-[40px] border border-border bg-card/60 flex flex-col items-center justify-center gap-6 shadow-2xl"
              style={{ boxShadow: "0 0 60px rgba(0,173,181,0.08), 0 20px 80px rgba(0,0,0,0.4)" }}
            >
              <div className="transform scale-110">
                <Image src="/LogoTypingFull.png" alt="Logo" width={300} height={300} />
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-mono text-foreground/30 tracking-[0.2em] uppercase font-bold">Unicode Traditional</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── SETUP GUIDE ────────────────────────────────────────── */}
        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-mono tracking-[0.25em] uppercase text-accent font-bold">
              Setup Guide
            </p>
            <h2 className="text-3xl font-bold text-foreground tracking-tight">
              Get your keyboard ready
            </h2>
            <p className="text-base text-foreground/40 max-w-xl">
              Before you start typing, you need the Nepali Traditional keyboard layout installed on your machine.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 flex flex-col gap-3">
              {SETUP_STEPS.map((step, i) => {
                const isDone   = doneSteps.includes(i);
                const isActive = activeStep === i;

                return (
                  <button
                    key={step.num}
                    onClick={() => setActiveStep(i)}
                    className={[
                      "w-full text-left flex items-center gap-5 px-5 py-4 rounded-2xl border transition-all duration-200",
                      isActive
                        ? "border-accent/30 bg-accent/5 shadow-sm"
                        : isDone
                        ? "border-border/40 bg-foreground/[0.01] opacity-60"
                        : "border-transparent hover:border-border hover:bg-foreground/[0.02]",
                    ].join(" ")}
                  >
                    <div
                      className="w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                      style={{
                        borderColor: isDone ? "#22c55e" : isActive ? step.color : "var(--color-border)",
                        background:  isDone ? "#22c55e15" : isActive ? `${step.color}15` : "transparent",
                        color:       isDone ? "#22c55e"   : isActive ? step.color : "var(--color-foreground)",
                      }}
                    >
                      {isDone ? <IconCheck size={16} /> : (
                        <span className="text-xs font-mono font-bold">{step.num}</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-base font-bold leading-tight ${isActive ? '' : 'text-foreground/70'}`} style={{ color: isActive ? step.color : undefined }}>
                        {step.title}
                      </p>
                      <p className="text-[12px] font-devanagari text-foreground/30 mt-1">
                        {step.nepali}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="lg:col-span-3">
              {(() => {
                const step   = SETUP_STEPS[activeStep];
                const isDone = doneSteps.includes(activeStep);

                return (
                  <div key={activeStep} className="h-full bg-card border border-border rounded-[32px] p-8 flex flex-col gap-6 animate-in fade-in duration-300 shadow-sm">
                    <div className="flex items-start gap-5">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${step.color}15`, color: step.color }}>
                        {step.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1.5">
                          <span className="text-xs font-mono font-black uppercase tracking-widest" style={{ color: step.color }}>Step {step.num}</span>
                          {isDone && <span className="text-[10px] font-mono text-green-500 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full font-bold">✓ COMPLETED</span>}
                        </div>
                        <h3 className="text-2xl font-bold text-foreground">{step.title}</h3>
                      </div>
                    </div>

                    <div className="h-px bg-border" />

                    <div className="flex flex-col gap-4">
                      <p className="text-base text-foreground/70 leading-relaxed">{step.desc}</p>
                      <div className="flex items-start gap-3.5 bg-foreground/[0.02] border border-border/50 rounded-2xl px-5 py-4">
                        <span className="text-accent mt-1 text-sm flex-shrink-0">ℹ</span>
                        <p className="text-sm text-foreground/45 leading-relaxed">{step.detail}</p>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center gap-4">
                      {step.action ? (
                        <a href={step.action.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-bold border transition-all hover:-translate-y-0.5" style={{ background: `${step.color}15`, borderColor: `${step.color}35`, color: step.color }}>
                          <IconDownload size={16} /> {step.action.label}
                        </a>
                      ) : activeStep === SETUP_STEPS.length - 1 ? (
                        <button onClick={onStart} className="flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-bold text-white bg-accent hover:bg-accent/85 active:scale-[0.97] transition-all shadow-xl shadow-accent/20">
                          I'm Ready to Type <IconArrowRight size={16} />
                        </button>
                      ) : null}

                      <button onClick={() => markDone(activeStep)} disabled={isDone} className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold border transition-all ${isDone ? "border-green-500/20 text-green-500/40 bg-green-500/5" : "border-border hover:bg-foreground/5 text-foreground/50 hover:text-foreground"}`}>
                        <IconCheck size={14} /> {isDone ? "Completed" : "Mark as done"}
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </section>

        {/* ── FEATURES ───────────────────────────────────────────── */}
        <section className="flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-mono tracking-[0.25em] uppercase text-accent font-bold">Capabilities</p>
            <h2 className="text-4xl font-black text-foreground tracking-tight">Built for Performance</h2>
            <p className="text-base text-foreground/40 max-w-xl">Every feature is designed to bridge the gap between thinking in Nepali and typing in Nepali.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div 
                key={f.label} 
                className="group relative bg-card/40 border border-border rounded-[32px] p-8 overflow-hidden transition-all duration-500 hover:border-border/80 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20"
              >
                {/* Animated Glow Background */}
                <div 
                  className="absolute -right-8 -top-8 w-32 h-32 blur-[60px] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                  style={{ backgroundColor: f.color }}
                />
                
                {/* Icon Container */}
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-[5deg]"
                  style={{ background: `${f.color}10`, border: `1px solid ${f.color}20` }}
                >
                  <FeatureIcon id={f.id} color={f.color} />
                </div>

                {/* Text Content */}
                <div className="relative z-10 flex flex-col gap-2">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-white transition-colors duration-300">
                    {f.label}
                  </h3>
                  <p className="text-[15px] text-foreground/40 leading-relaxed group-hover:text-foreground/60 transition-colors duration-300">
                    {f.desc}
                  </p>
                </div>

                {/* Decorative "Ghost" Text for modern look */}
                <span className="absolute -bottom-4 -right-2 text-6xl font-black text-foreground/[0.02] select-none pointer-events-none group-hover:text-foreground/[0.04] transition-colors uppercase italic">
                  {f.id}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── WHY TRADITIONAL + TESTIMONIALS ─────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card/40 border border-border rounded-[32px] p-8 flex flex-col gap-6">
            <div>
              <p className="text-[11px] font-mono tracking-[0.2em] uppercase text-accent font-bold mb-2">Standardized</p>
              <h3 className="text-xl font-bold text-foreground">Why Unicode Traditional?</h3>
            </div>
            <div className="flex flex-col gap-5">
              {[
                { en: "Standard in Nepal's government offices and media",    ne: "सरकारी कार्यालय र मिडियामा मानक"         },
                { en: "Mirrors the classic Preeti font layout — easy switch", ne: "प्रिति फन्टसँग मिल्दो — सिक्न सजिलो"   },
                { en: "Fully compatible across all modern platforms",         ne: "सबै आधुनिक प्लेटफर्ममा सुसंगत"         },
              ].map(({ en, ne }) => (
                <div key={en} className="flex items-start gap-4">
                  <span className="mt-1 text-accent flex-shrink-0"><IconCheck size={14} /></span>
                  <div>
                    <p className="text-[15px] text-foreground/70 leading-snug font-medium">{en}</p>
                    <p className="text-xs font-devanagari text-foreground/30 mt-1.5">{ne}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-card/40 border border-border rounded-[24px] px-6 py-5 flex flex-col gap-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <span key={i} className="text-amber-400"><IconStar size={12} /></span>
                  ))}
                </div>
                <p className="text-[15px] text-foreground/65 leading-relaxed italic font-medium">"{t.text}"</p>
                <p className="text-xs font-mono text-foreground/30 font-bold">— {t.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── BOTTOM CTA ─────────────────────────────────────────── */}
        <section className="relative rounded-[40px] border border-accent/20 bg-accent/5 px-10 py-14 flex flex-col sm:flex-row items-center justify-between gap-10 overflow-hidden">
          <div className="pointer-events-none absolute -top-12 -left-12 w-80 h-80 rounded-full blur-[100px]" style={{ background: "radial-gradient(circle, rgba(0,173,181,0.15) 0%, transparent 70%)" }} />
          <div className="flex flex-col gap-3 relative">
            <h3 className="text-3xl font-bold text-foreground tracking-tight">Ready to start?</h3>
            <p className="text-base text-foreground/40 max-w-sm">Jump into the typing test, or explore lessons first — your progress is saved automatically.</p>
          </div>
          <div className="flex items-center gap-5 flex-shrink-0 relative">
            <button onClick={onStart} className="flex items-center gap-3 px-10 py-4 bg-accent text-white font-bold rounded-2xl hover:bg-accent/85 active:scale-[0.97] transition-all shadow-2xl shadow-accent/30 text-base">
              Open Typing Test <IconArrowRight size={18} />
            </button>
          </div>
        </section>

        <div className="h-4" />
      </div>
    </div>
  );
}