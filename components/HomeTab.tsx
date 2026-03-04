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

// Decorative Devanagari characters for the background
const BG_CHARS = ["क", "ख", "ग", "घ", "ङ", "च", "छ", "ज", "झ", "ञ", "ट", "ठ", "ड", "ढ", "ण", "त", "थ", "द", "ध", "न", "प", "फ", "ब", "भ", "म", "य", "र", "ल", "व", "श", "ष", "स", "ह", "अ", "आ", "इ", "ई", "उ", "ऊ", "ए", "ऐ", "ओ", "औ"];

const SETUP_STEPS = [
  {
    num: "01",
    nepali: "डाउनलोड",
    title: "Download",
    desc: "Get the official Nepali Unicode Traditional keyboard layout from LTK (Language Technology Kendra).",
    detail: "Free, open-source, maintained by the Nepal government's language technology body.",
    action: { label: "Download from ltk.org.np", href: "https://ltk.org.np/downloads.php" },
    icon: <IconDownload size={20} />,
    color: "#00ADB5",
  },
  {
    num: "02",
    nepali: "इन्स्टल",
    title: "Install",
    desc: "Extract the downloaded .zip file and run setup.exe with administrator privileges.",
    detail: "During installation, keep all default options selected. Restart may be required.",
    action: null,
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    title: "Activate",
    desc: "Press Win + Space (or Alt + Shift) to switch to 'Nepali Unicode Traditional' keyboard.",
    detail: "You can switch back to English anytime using the same shortcut.",
    action: null,
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="M8 15h8M8 11h3M8 7h8"/>
      </svg>
    ),
    color: "#34d399",
  },
  {
    num: "04",
    nepali: "टाइप गर्नुहोस्",
    title: "Start Typing",
    desc: `You're all set! Click I'm Ready below to jump into the typing test and start practising.`,
    detail: "Begin with the Learn tab to understand character mappings before the speed test.",
    action: null,
    icon: <IconKeyboard size={20} />,
    color: "#fb923c",
  },
];

const FEATURES = [
  { icon: "⚡", label: "Real-time WPM",    desc: "Track your speed as you type"           },
  { icon: "◎", label: "Accuracy meter",   desc: "Mistake-by-mistake breakdown"            },
  { icon: "↻", label: "Auto-loop lessons",desc: "Repeat until perfect"                    },
  { icon: "⌨", label: "Neon key guide",   desc: "Next key highlighted on-screen"          },
  { icon: "⇄", label: "Shuffle mode",     desc: "Random order keeps you sharp"            },
  { icon: "📈", label: "Progress history", desc: "WPM trend & personal bests"             },
];

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

      {/* ── Decorative Devanagari background scatter ───────────────── */}
      <div className="pointer-events-none select-none absolute inset-0 overflow-hidden" aria-hidden>
        {BG_CHARS.slice(0, 24).map((ch, i) => (
          <span
            key={i}
            className="absolute font-devanagari text-foreground/[0.025] font-bold"
            style={{
              fontSize: `${28 + (i % 5) * 14}px`,
              left:  `${(i * 37 + 11) % 96}%`,
              top:   `${(i * 53 + 7)  % 110}%`,
              transform: `rotate(${(i % 7) * 8 - 24}deg)`,
            }}
          >
            {ch}
          </span>
        ))}
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-10 flex flex-col gap-16">

        {/* ══════════════════════════════════════════════════════════ */}
        {/* HERO                                                       */}
        {/* ══════════════════════════════════════════════════════════ */}
        <section className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

          {/* Left: text */}
          <div className="flex-1 flex flex-col gap-5">
            {/* eyebrow */}
            <div className="flex items-center gap-2">
              <span className="w-6 h-px bg-accent" />
              <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-accent/80">
                Nepali Unicode Traditional
              </span>
            </div>

            <h1 className="text-5xl flex flex-col gap-5 font-bold tracking-tight leading-[1.08] text-foreground">
              Nepali Typing<br />
              <span
                className="font-devanagari font-semibold"
                style={{ color: "var(--color-accent)" }}
              >
                सहजै सिक्नुहोस्
              </span>
            </h1>

            <p className="text-[15px] text-foreground/50 leading-relaxed max-w-md">
              The most complete Nepali Unicode Traditional typing trainer — real-time speed tests, structured lessons, and a neon key guide to get you typing fluently.
            </p>

            {/* Stats row */}
            <div className="flex gap-6 pt-1">
              {[
                { val: "11",    unit: "lessons"   },
                { val: "4",     unit: "test modes" },
                { val: "100%",  unit: "free"       },
              ].map(({ val, unit }) => (
                <div key={unit} className="flex flex-col">
                  <span className="text-2xl font-bold font-mono text-accent leading-none">{val}</span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/35 mt-0.5">{unit}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={onStart}
                className="flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold text-sm rounded-xl hover:bg-accent/85 active:scale-[0.97] transition-all shadow-xl shadow-accent/25"
              >
                Start Typing Now
                <IconArrowRight size={15} />
              </button>
              <span className="text-[11px] text-foreground/30 font-mono">
                No account needed
              </span>
            </div>
          </div>

          {/* Right: decorative keyboard badge */}
          <div className="flex-shrink-0 relative">
            <div
              className="w-64 h-64 rounded-3xl border border-border bg-card/60 flex flex-col items-center justify-center gap-4 shadow-2xl"
              style={{ boxShadow: "0 0 60px rgba(0,173,181,0.08), 0 20px 60px rgba(0,0,0,0.3)" }}
            >
              {/* Big Devanagari character */}
              <div
                className="text-[90px] leading-none font-devanagari font-bold select-none"
                style={{ color: "var(--color-accent)" }}
              >
                <Image src="/LogoTypingFull.png" alt="Logo" width={200} height={200} />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-[11px] font-mono text-foreground/30 tracking-widest uppercase">Unicode Traditional</span>
                <div className="flex gap-1 mt-1">
                  {["क", "ख", "ग", "घ"].map((c) => (
                    <span
                      key={c}
                      className="w-8 h-8 rounded-lg border border-border bg-card flex items-center justify-center text-sm font-devanagari text-foreground/60"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating accent dots */}
            <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-accent/30 blur-sm" />
            <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-accent/20 blur-sm" />
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* SETUP GUIDE                                                */}
        {/* ══════════════════════════════════════════════════════════ */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-accent/70">
              Setup Guide
            </p>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              Get your keyboard ready
            </h2>
            <p className="text-[13px] text-foreground/40 max-w-lg">
              Before you start typing, you need the Nepali Traditional keyboard layout installed on your machine. Follow these 4 steps — takes less than 5 minutes.
            </p>
          </div>

          {/* Steps layout: left list + right detail panel */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

            {/* Step list */}
            <div className="lg:col-span-2 flex flex-col gap-2">
              {SETUP_STEPS.map((step, i) => {
                const isDone   = doneSteps.includes(i);
                const isActive = activeStep === i;

                return (
                  <button
                    key={step.num}
                    onClick={() => setActiveStep(i)}
                    className={[
                      "w-full text-left flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all duration-200",
                      isActive
                        ? "border-accent/30 bg-accent/8 shadow-sm"
                        : isDone
                        ? "border-border/40 bg-foreground/[0.02] opacity-70"
                        : "border-transparent hover:border-border hover:bg-foreground/[0.03]",
                    ].join(" ")}
                  >
                    {/* Circle indicator */}
                    <div
                      className="w-9 h-9 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                      style={{
                        borderColor: isDone ? "#22c55e" : isActive ? step.color : "var(--color-border)",
                        background:  isDone ? "#22c55e18" : isActive ? `${step.color}15` : "transparent",
                        color:       isDone ? "#22c55e"   : isActive ? step.color : "var(--color-foreground)",
                        opacity:     isDone ? 0.9 : 1,
                      }}
                    >
                      {isDone ? <IconCheck size={14} /> : (
                        <span className="text-[10px] font-mono font-bold">{step.num}</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[13px] font-semibold leading-tight"
                        style={{ color: isActive ? step.color : undefined }}
                      >
                        {step.title}
                      </p>
                      <p
                        className="text-[10px] font-devanagari text-foreground/35 mt-0.5"
                      >
                        {step.nepali}
                      </p>
                    </div>

                    {isActive && (
                      <span style={{ color: step.color }} className="flex-shrink-0 opacity-60">
                        <IconArrowRight size={14} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Detail panel */}
            <div className="lg:col-span-3">
              {(() => {
                const step   = SETUP_STEPS[activeStep];
                const isDone = doneSteps.includes(activeStep);

                return (
                  <div
                    key={activeStep}
                    className="h-full bg-card border border-border rounded-3xl p-6 flex flex-col gap-5 animate-in fade-in duration-200 shadow-sm"
                  >
                    {/* Step header */}
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${step.color}18`, color: step.color }}
                      >
                        {step.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-widest" style={{ color: step.color }}>
                            Step {step.num}
                          </span>
                          {isDone && (
                            <span className="text-[9px] font-mono text-green-500 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                              ✓ Done
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                        <p className="text-[11px] font-devanagari text-foreground/40 mt-0.5">{step.nepali}</p>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-border" />

                    {/* Description */}
                    <div className="flex flex-col gap-3">
                      <p className="text-[14px] text-foreground/70 leading-relaxed">{step.desc}</p>
                      <div className="flex items-start gap-2.5 bg-foreground/[0.03] border border-border/50 rounded-xl px-4 py-3">
                        <span className="text-accent mt-0.5 text-xs flex-shrink-0">ℹ</span>
                        <p className="text-[12px] text-foreground/45 leading-relaxed">{step.detail}</p>
                      </div>
                    </div>

                    {/* Action area */}
                    <div className="mt-auto flex items-center gap-3">
                      {step.action ? (
                        <a
                          href={step.action.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:-translate-y-px hover:shadow-lg"
                          style={{
                            background:   `${step.color}15`,
                            borderColor:  `${step.color}35`,
                            color:         step.color,
                            boxShadow:    `0 4px 20px ${step.color}15`,
                          }}
                        >
                          <IconDownload size={14} />
                          {step.action.label}
                        </a>
                      ) : activeStep === SETUP_STEPS.length - 1 ? (
                        <button
                          onClick={onStart}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-accent hover:bg-accent/85 active:scale-[0.97] transition-all shadow-lg shadow-accent/25"
                        >
                          I'm Ready to Type
                          <IconArrowRight size={14} />
                        </button>
                      ) : null}

                      <button
                        onClick={() => markDone(activeStep)}
                        disabled={isDone}
                        className={[
                          "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all",
                          isDone
                            ? "border-green-500/20 text-green-500/50 bg-green-500/5 cursor-not-allowed"
                            : "border-border hover:bg-foreground/5 text-foreground/50 hover:text-foreground",
                        ].join(" ")}
                      >
                        <IconCheck size={13} />
                        {isDone ? "Completed" : "Mark as done"}
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* FEATURES                                                   */}
        {/* ══════════════════════════════════════════════════════════ */}
        <section className="flex flex-col gap-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-accent/70 mb-1">What's included</p>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Everything you need</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {FEATURES.map((f) => (
              <div
                key={f.label}
                className="bg-card/40 border border-border rounded-2xl px-4 py-4 flex items-start gap-3 hover:border-accent/20 hover:bg-card/70 transition-all group"
              >
                <span className="text-xl leading-none mt-0.5 group-hover:scale-110 transition-transform">
                  {f.icon}
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-foreground/80 leading-tight">{f.label}</p>
                  <p className="text-[11px] text-foreground/35 mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* WHY TRADITIONAL + TESTIMONIALS                             */}
        {/* ══════════════════════════════════════════════════════════ */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Why Traditional */}
          <div className="bg-card/40 border border-border rounded-3xl p-6 flex flex-col gap-4">
            <div>
              <p className="text-[10px] font-mono tracking-[0.18em] uppercase text-accent/70 mb-1">Why this layout?</p>
              <h3 className="text-lg font-bold text-foreground">Unicode Traditional</h3>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { en: "Standard in Nepal's government offices and media",    ne: "सरकारी कार्यालय र मिडियामा मानक"         },
                { en: "Mirrors the classic Preeti font layout — easy switch", ne: "प्रिति फन्टसँग मिल्दो — सिक्न सजिलो"   },
                { en: "Fully compatible across all modern platforms",         ne: "सबै आधुनिक प्लेटफर्ममा सुसंगत"         },
              ].map(({ en, ne }) => (
                <div key={en} className="flex items-start gap-3">
                  <span className="mt-0.5 text-accent flex-shrink-0"><IconCheck size={13} /></span>
                  <div>
                    <p className="text-[13px] text-foreground/70 leading-tight">{en}</p>
                    <p className="text-[11px] font-devanagari text-foreground/35 mt-0.5">{ne}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="flex flex-col gap-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="bg-card/40 border border-border rounded-2xl px-4 py-3.5 flex flex-col gap-2"
              >
                <div className="flex items-center gap-1">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <span key={i} className="text-amber-400"><IconStar size={11} /></span>
                  ))}
                </div>
                <p className="text-[13px] text-foreground/65 leading-relaxed italic">"{t.text}"</p>
                <p className="text-[10px] font-mono text-foreground/30">— {t.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* BOTTOM CTA                                                 */}
        {/* ══════════════════════════════════════════════════════════ */}
        <section className="relative rounded-3xl border border-accent/20 bg-accent/5 px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden">
          {/* Glow */}
          <div
            className="pointer-events-none absolute -top-12 -left-12 w-64 h-64 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(0,173,181,0.12) 0%, transparent 70%)" }}
          />
          <div className="flex flex-col gap-2 relative">
            <h3 className="text-2xl font-bold text-foreground tracking-tight">
              Ready to start?
            </h3>
            <p className="text-[13px] text-foreground/45 max-w-sm">
              Jump into the typing test, or explore lessons first — your progress is saved automatically.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 relative">
            <button
              onClick={onStart}
              className="flex items-center gap-2 px-7 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent/85 active:scale-[0.97] transition-all shadow-xl shadow-accent/30 text-sm"
            >
              Open Typing Test
              <IconArrowRight size={14} />
            </button>
          </div>
        </section>

        {/* Bottom padding */}
        <div className="h-4" />
      </div>
    </div>
  );
}
