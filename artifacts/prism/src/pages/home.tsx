import { useState, useRef, useEffect, useCallback, ReactNode } from "react";
import { useLocation, Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { useAnalyzeDecision, getListAnalysesQueryKey } from "@workspace/api-client-react";
import { LoadingSequence } from "@/components/LoadingSequence";
import { FloatingBoxes } from "@/components/FloatingBoxes";
import {
  BrainCircuit, Search, Swords, Users, History,
  AlertOctagon, TrendingUp, CheckSquare, Scale,
  Zap, Shield, Clock, BarChart3, ArrowRight, Check,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useCardMouse() {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = useCallback((e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mouse-x", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--mouse-y", `${((e.clientY - r.top) / r.height) * 100}%`);
  }, []);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener("mousemove", onMove as EventListener);
    return () => el.removeEventListener("mousemove", onMove as EventListener);
  }, [onMove]);
  return ref;
}

function SectionBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] tracking-widest font-sans text-black/40 bg-black/[0.04]">
      {children}
    </span>
  );
}

function FeatureCard({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useCardMouse();
  return (
    <div
      ref={ref}
      className={`group relative rounded-2xl border border-black/[0.07] bg-white overflow-hidden transition-all duration-700 hover:border-black/[0.15] hover:bg-[#fafaf8] ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0,0,0,0.03), transparent 60%)",
        }}
      />
      {children}
    </div>
  );
}

function FadeUp({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function LandingNav() {
  return (
    <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4">
      <div className="rounded-2xl border border-black/[0.06] bg-[#F5F4F0]/90 backdrop-blur-sm px-5 py-3 flex items-center justify-between max-w-3xl w-full">
        <Link href="/" className="flex items-center gap-2 group">
          <BrainCircuit className="w-4 h-4 text-black/70 group-hover:text-black transition-colors" />
          <span className="text-[11px] tracking-[0.25em] font-medium text-black/70 uppercase group-hover:text-black transition-colors">PRISM</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/debate" className="flex items-center gap-1.5 text-[11px] text-black/55 hover:text-black transition-colors tracking-wide">
            <Scale className="w-3.5 h-3.5" />Debate
          </Link>
          <Link href="/battle" className="flex items-center gap-1.5 text-[11px] text-black/55 hover:text-black transition-colors tracking-wide">
            <Swords className="w-3.5 h-3.5" />Battle
          </Link>
          <Link href="/personas" className="flex items-center gap-1.5 text-[11px] text-black/55 hover:text-black transition-colors tracking-wide">
            <Users className="w-3.5 h-3.5" />Personas
          </Link>
          <Link href="/history" className="flex items-center gap-1.5 text-[11px] text-black/55 hover:text-black transition-colors tracking-wide">
            <History className="w-3.5 h-3.5" />History
          </Link>
          <Link href="/#analyze" className="text-[11px] text-black border border-black/20 rounded-xl px-4 py-2 hover:bg-black/[0.04] transition-colors ml-2">
            Start Deciding
          </Link>
        </nav>
      </div>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

const PRISM_LETTERS = ["P", "R", "I", "S", "M"];
const STATS = [
  { value: "2.4M+", label: "Analyses" },
  { value: "99.2%", label: "Confidence" },
  { value: "180+",  label: "Countries" },
];

function HeroSection({ onSubmit, question, setQuestion, isPending }: {
  onSubmit: (e: React.FormEvent) => void;
  question: string;
  setQuestion: (v: string) => void;
  isPending: boolean;
}) {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="orb orb-indigo" />
        <div className="orb orb-emerald" />
        <div className="orb orb-amber" />
        <div className="orb orb-rose" />
      </div>
      <FloatingBoxes />

      {/* Scrolling nav placeholder */}
      <div className="h-20 shrink-0" />

      {/* Huge viewport-width PRISM text */}
      <div className="px-6 md:px-12 lg:px-20 pt-16 md:pt-24 overflow-hidden select-none">
        <div
          className="flex font-light text-[#111] leading-none tracking-[0.04em] overflow-hidden"
          style={{ fontSize: "calc((100vw - 48px) / 5.4)" }}
        >
          {PRISM_LETTERS.map((l, i) => (
            <motion.span
              key={l}
              initial={{ opacity: 0, filter: "blur(36px)", y: 48 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
            >
              {l}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Sub-content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 md:px-12 py-12 max-w-3xl mx-auto w-full flex-1 justify-center -mt-10">
        <motion.p
          className="text-lg md:text-xl font-light text-black/55 leading-relaxed mb-10 max-w-lg"
          initial={{ opacity: 0, filter: "blur(16px)", y: 20 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Make better decisions with four competing AI perspectives — synthesized into one clear verdict.
        </motion.p>

        {/* Stats row */}
        <motion.div
          className="flex items-center justify-center gap-8 mb-12 flex-wrap"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.7 }}
        >
          {STATS.map((s, i) => (
            <div key={s.label} className="flex items-center gap-8">
              {i > 0 && <div className="w-px h-6 bg-black/[0.08] hidden sm:block" />}
              <div className="text-center">
                <div className="text-xl font-light text-[#111]">{s.value}</div>
                <div className="text-[10px] tracking-widest uppercase text-black/35 mt-0.5">{s.label}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Analyze form */}
        <motion.form
          id="analyze"
          onSubmit={onSubmit}
          className="w-full max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.78, duration: 0.7 }}
        >
          <div className="bg-white rounded-2xl border border-black/[0.07] flex items-center px-5 py-4 gap-4 shadow-sm input-glow">
            <Search className="w-5 h-5 text-black/25 shrink-0" />
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What decision are you facing today?"
              className="flex-1 bg-transparent border-none outline-none text-[#111] placeholder:text-black/28 text-base focus:ring-0"
              autoFocus
            />
            <motion.button
              type="submit"
              disabled={!question.trim() || isPending}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="bg-[#111] text-white rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-black/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              Analyze →
            </motion.button>
          </div>
        </motion.form>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <div className="text-[10px] tracking-widest uppercase text-black/25">Scroll</div>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="w-px h-6 bg-black/15"
          />
        </motion.div>
      </div>
    </section>
  );
}

// ─── Platform ─────────────────────────────────────────────────────────────────

const PLATFORM_CARDS = [
  {
    icon: <Zap className="w-4.5 h-4.5" />,
    title: "Real-time Synthesis",
    desc: "Four AI calls run in parallel. Results are synthesized in seconds, not minutes.",
  },
  {
    icon: <BarChart3 className="w-4.5 h-4.5" />,
    title: "Confidence Scoring",
    desc: "Every verdict comes with a 0–100 confidence score based on perspective consensus.",
  },
  {
    icon: <Shield className="w-4.5 h-4.5" />,
    title: "Guardrails Built-in",
    desc: "Each persona is constrained to its framework. No hallucination, no mixing modes.",
  },
];

function PlatformSection() {
  return (
    <section className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <FadeUp delay={0}>
            <SectionBadge>PLATFORM</SectionBadge>
          </FadeUp>
          <FadeUp delay={60}>
            <h2 className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
              Everything you need<br />to decide with clarity.
            </h2>
          </FadeUp>
        </div>

        <div className="grid grid-cols-12 gap-3">
          {/* Wide hero card */}
          <FadeUp delay={0} className="col-span-12">
            <FeatureCard className="p-8 min-h-[220px] flex flex-col justify-between">
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl border border-black/10 bg-black/[0.03] flex items-center justify-center mb-6">
                  <BrainCircuit className="w-5 h-5 text-black/60" />
                </div>
                <h3 className="text-xl font-light mb-3">Multi-Perspective Engine</h3>
                <p className="text-sm text-black/45 leading-relaxed max-w-lg">
                  Four distinct AI personas — Contrarian, Expansionist, Executionist, Analyst — each analyze your question independently, then a fifth synthesis call combines every viewpoint into one decision-ready verdict.
                </p>
              </div>
              <div className="flex gap-3 mt-8 flex-wrap">
                {[
                  { label: "Contrarian", color: "#DC2626" },
                  { label: "Expansionist", color: "#2563EB" },
                  { label: "Executionist", color: "#16A34A" },
                  { label: "Analyst", color: "#7C3AED" },
                ].map((p) => (
                  <span
                    key={p.label}
                    className="text-[11px] tracking-widest uppercase px-3 py-1.5 rounded-full border"
                    style={{ color: p.color, borderColor: `${p.color}30`, background: `${p.color}08` }}
                  >
                    {p.label}
                  </span>
                ))}
              </div>
            </FeatureCard>
          </FadeUp>

          {/* 3 narrow cards */}
          {PLATFORM_CARDS.map((card, i) => (
            <FadeUp key={card.title} delay={120 + i * 60} className="col-span-12 md:col-span-4">
              <FeatureCard className="p-8 min-h-[200px]">
                <div className="w-10 h-10 rounded-xl border border-black/10 flex items-center justify-center mb-5 text-black/60">
                  {card.icon}
                </div>
                <h3 className="text-lg font-light mb-2">{card.title}</h3>
                <p className="text-sm text-black/45 leading-relaxed">{card.desc}</p>
              </FeatureCard>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Perspectives ─────────────────────────────────────────────────────────────

const PERSONAS = [
  {
    key: "contrarian",
    role: "CONTRARIAN",
    name: "The Contrarian",
    icon: <AlertOctagon className="w-5 h-5" />,
    desc: "Challenges assumptions and stress-tests every scenario. Identifies failure modes, hidden risks, and worst-case paths before you commit.",
    stat1: { value: "840K", label: "risks flagged" },
    stat2: { value: "94.1%", label: "accuracy" },
    color: "#DC2626",
    rgb: "220,38,38",
  },
  {
    key: "expansionist",
    role: "EXPANSIONIST",
    name: "The Expansionist",
    icon: <TrendingUp className="w-5 h-5" />,
    desc: "Sees the upsides others miss. Maps every growth opportunity, second-order gain, and hidden strategic advantage in your decision.",
    stat1: { value: "610K", label: "opportunities found" },
    stat2: { value: "91.8%", label: "accuracy" },
    color: "#2563EB",
    rgb: "37,99,235",
  },
  {
    key: "executionist",
    role: "EXECUTIONIST",
    name: "The Executionist",
    icon: <CheckSquare className="w-5 h-5" />,
    desc: "Turns deliberation into action. Delivers a concrete, prioritized step-by-step plan you can execute starting today.",
    stat1: { value: "520K", label: "plans generated" },
    stat2: { value: "96.3%", label: "actionability" },
    color: "#16A34A",
    rgb: "22,163,74",
  },
  {
    key: "analyst",
    role: "ANALYST",
    name: "The Analyst",
    icon: <Scale className="w-5 h-5" />,
    desc: "Applies rigorous logical tradeoff analysis. Weights every factor without bias, surfaces the data that matters, and quantifies uncertainty.",
    stat1: { value: "430K", label: "analyses run" },
    stat2: { value: "98.7%", label: "consistency" },
    color: "#7C3AED",
    rgb: "124,58,237",
  },
];

function PersonasSection() {
  const [active, setActive] = useState(0);
  const p = PERSONAS[active];

  return (
    <section className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <div>
            <FadeUp><SectionBadge>PERSPECTIVES</SectionBadge></FadeUp>
            <FadeUp delay={60}>
              <h2 className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
                Four minds,<br />one verdict.
              </h2>
            </FadeUp>
          </div>
          <FadeUp>
            <p className="text-sm text-black/45 leading-relaxed max-w-xs">
              Each perspective is a distinct AI reasoning framework — not a persona. Start with a built-in or compose your own.
            </p>
          </FadeUp>
        </div>

        {/* Tab row */}
        <FadeUp>
          <div className="flex gap-2 mb-6 flex-wrap">
            {PERSONAS.map((persona, i) => (
              <button
                key={persona.key}
                onClick={() => setActive(i)}
                className="px-4 py-2 rounded-xl text-[11px] tracking-widest uppercase transition-all duration-200 border"
                style={
                  active === i
                    ? { color: persona.color, borderColor: `${persona.color}40`, background: `${persona.color}0a` }
                    : { color: "rgba(0,0,0,0.4)", borderColor: "rgba(0,0,0,0.07)", background: "transparent" }
                }
              >
                {persona.role}
              </button>
            ))}
          </div>
        </FadeUp>

        {/* Active persona card */}
        <FadeUp>
          <div
            key={p.key}
            className="group relative rounded-2xl border overflow-hidden bg-white"
            style={{ borderColor: `${p.color}20` }}
          >
            {/* Color bar */}
            <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${p.color}, transparent)` }} />

            <div className="flex flex-col md:flex-row">
              {/* Left */}
              <div className="flex-1 p-8 md:p-12">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: `rgba(${p.rgb},0.1)`, color: p.color }}
                >
                  {p.icon}
                </div>
                <div
                  className="text-[11px] tracking-widest uppercase mb-2 font-medium"
                  style={{ color: p.color }}
                >
                  {p.role}
                </div>
                <h3 className="text-3xl font-light mb-4">{p.name}</h3>
                <p className="text-base text-black/50 leading-relaxed max-w-md">{p.desc}</p>

                <Link href="/" className="inline-flex items-center gap-2 mt-8 text-sm text-black/60 hover:text-black transition-colors">
                  Try this perspective <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Right stats */}
              <div className="md:w-64 p-8 md:p-12 border-t md:border-t-0 md:border-l border-black/[0.06] flex flex-col gap-8 justify-center">
                <div>
                  <div className="text-3xl font-light text-[#111]">{p.stat1.value}</div>
                  <div className="text-[11px] tracking-widest uppercase text-black/35 mt-1">{p.stat1.label}</div>
                </div>
                <div className="w-full h-px bg-black/[0.06]" />
                <div>
                  <div className="text-3xl font-light text-[#111]">{p.stat2.value}</div>
                  <div className="text-[11px] tracking-widest uppercase text-black/35 mt-1">{p.stat2.label}</div>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>

        {/* Stacked mini cards below */}
        <div
          className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3"
          style={{ perspective: "1200px", perspectiveOrigin: "50% 0%" }}
        >
          {PERSONAS.map((persona, i) => (
            <FadeUp key={persona.key} delay={i * 60}>
              <button
                onClick={() => setActive(i)}
                className={`w-full text-left rounded-xl border p-4 transition-all duration-300 ${active === i ? "bg-white shadow-sm" : "bg-transparent hover:bg-white/60"}`}
                style={{
                  borderColor: active === i ? `${persona.color}30` : "rgba(0,0,0,0.07)",
                  transform: active === i ? "translateY(-2px)" : "none",
                }}
              >
                <div style={{ color: persona.color }} className="mb-2">{persona.icon}</div>
                <div className="text-[11px] tracking-widest uppercase text-black/40">{persona.role}</div>
              </button>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Workflow ─────────────────────────────────────────────────────────────────

const STEPS = [
  { n: "01", title: "Define", desc: "Describe your decision in plain language. PRISM accepts any question — strategic, personal, financial, or operational." },
  { n: "02", title: "Analyze", desc: "Four AI reasoning frameworks deliberate simultaneously in parallel. Each generates a structured, framework-constrained analysis." },
  { n: "03", title: "Synthesize", desc: "A fifth AI call reads all four perspectives and resolves contradictions into a single coherent narrative." },
  { n: "04", title: "Decide", desc: "Receive a synthesized verdict with a 0–100 confidence score. Every analysis is saved to your history." },
];

function WorkflowSection() {
  return (
    <section className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <FadeUp><SectionBadge>WORKFLOW</SectionBadge></FadeUp>
          <FadeUp delay={60}>
            <h2 className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
              From question to verdict<br />in four steps.
            </h2>
          </FadeUp>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {STEPS.map((step, i) => (
            <FadeUp key={step.n} delay={i * 80}>
              <FeatureCard className="relative overflow-hidden flex flex-col min-h-[280px]">
                <div className="relative z-10 p-7">
                  <span className="text-[11px] text-black/20 tracking-widest font-mono block">{step.n}</span>
                </div>
                <div className="relative z-10 px-7 pb-7 mt-auto">
                  <h3 className="text-2xl font-light mb-3">{step.title}</h3>
                  <p className="text-sm text-black/45 leading-relaxed">{step.desc}</p>
                </div>
                {/* Step accent line */}
                <div
                  className="absolute bottom-0 left-0 h-0.5 transition-all duration-700"
                  style={{
                    width: `${25 * (i + 1)}%`,
                    background: "#111",
                    opacity: 0.08 + i * 0.04,
                  }}
                />
              </FeatureCard>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Scrolling ticker ─────────────────────────────────────────────────────────

const TICKER_ITEMS = [
  "Career pivots", "Investment decisions", "Startup strategy", "Hiring choices",
  "Product bets", "Risk assessments", "Market entry", "Partnership deals",
  "Build vs buy", "Pricing strategy", "Go-to-market", "Team restructuring",
  "Vendor selection", "Geographic expansion", "M&A evaluation", "Pivot or persist",
];

function TickerSection() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="border-t border-b border-black/[0.06] py-5 overflow-hidden bg-white/40">
      <div className="flex gap-8 marquee-track" style={{ width: "max-content" }}>
        {items.map((item, i) => (
          <span key={i} className="text-[11px] tracking-widest uppercase text-black/30 whitespace-nowrap flex items-center gap-8">
            {item}
            <span className="w-1 h-1 rounded-full bg-black/15 inline-block" />
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Live section ─────────────────────────────────────────────────────────────

const LIVE_ROWS = [
  { id: "contrarian-7f2a",  tag: "#A1B2C3", task: "Analyzing investment timing risk",        region: "us-east",    status: "running",   color: "#DC2626" },
  { id: "expansionist-3b1c",tag: "#D4E5F6", task: "Identifying career growth opportunities", region: "eu-west",    status: "running",   color: "#2563EB" },
  { id: "executionist-2c8f",tag: "#G7H8I9", task: "Building 30-day action roadmap",          region: "us-west",    status: "complete",  color: "#16A34A" },
  { id: "analyst-5a3d",     tag: "#J0K1L2", task: "Risk-reward tradeoff on acquisition",     region: "eu-central", status: "running",   color: "#7C3AED" },
  { id: "contrarian-8d1a",  tag: "#M3N4O5", task: "Stress-testing market entry assumptions", region: "ap-south",   status: "running",   color: "#DC2626" },
  { id: "analyst-9d4e",     tag: "#P6Q7R8", task: "Pricing model sensitivity analysis",      region: "us-east",    status: "queued",    color: "#7C3AED" },
];

function StatusDot({ status }: { status: string }) {
  if (status === "running") return (
    <span className="inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-emerald-600">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />running
    </span>
  );
  if (status === "complete") return (
    <span className="inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-black/35">
      <span className="w-1.5 h-1.5 rounded-full bg-black/20" />complete
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-amber-600">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />queued
    </span>
  );
}

function LiveSection() {
  return (
    <section className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <div>
            <FadeUp><SectionBadge>LIVE RIGHT NOW</SectionBadge></FadeUp>
            <FadeUp delay={60}>
              <h2 className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
                Decisions being<br />analyzed 24 / 7.
              </h2>
            </FadeUp>
          </div>
          <FadeUp>
            <div className="text-right">
              <div className="text-4xl font-light text-[#111]">3,847</div>
              <div className="text-[11px] tracking-widest uppercase text-black/35 mt-1">analyses active globally</div>
            </div>
          </FadeUp>
        </div>

        <FadeUp>
          <div className="rounded-2xl border border-black/[0.07] bg-white overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[2fr_3fr_1fr_1fr] gap-4 px-6 py-3 border-b border-black/[0.06] bg-black/[0.02]">
              {["AGENT", "TASK", "REGION", "STATUS"].map((h) => (
                <div key={h} className="text-[10px] tracking-widest uppercase text-black/30">{h}</div>
              ))}
            </div>
            {/* Rows */}
            {LIVE_ROWS.map((row, i) => (
              <motion.div
                key={row.id}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                viewport={{ once: true }}
                className="grid grid-cols-[2fr_3fr_1fr_1fr] gap-4 px-6 py-4 border-b border-black/[0.04] last:border-0 hover:bg-black/[0.01] transition-colors"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm text-black/70 font-mono">{row.id}</span>
                  <span className="text-[10px] text-black/30 font-mono">{row.tag}</span>
                </div>
                <div className="text-sm text-black/55 self-center truncate pr-4">{row.task}</div>
                <div className="text-[11px] text-black/35 font-mono self-center">{row.region}</div>
                <div className="self-center"><StatusDot status={row.status} /></div>
              </motion.div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

const PLANS = [
  {
    tier: "Sandbox",
    price: "Free",
    sub: "Start experimenting",
    highlighted: false,
    features: ["5 analyses / month", "4 built-in personas", "Decision history", "Basic confidence scoring"],
  },
  {
    tier: "Builder",
    price: "$9",
    period: "/mo",
    sub: "For serious decision-makers",
    highlighted: true,
    features: ["Unlimited analyses", "Custom persona builder", "Famous persona pack", "Battle Arena mode", "Full history + export"],
  },
  {
    tier: "Enterprise",
    price: "Custom",
    sub: "For orgs at scale",
    highlighted: false,
    features: ["Unlimited everything", "Team workspaces", "SSO + audit logs", "SLA guarantees", "Custom integrations"],
  },
];

function PricingSection() {
  return (
    <section className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <FadeUp><SectionBadge>PRICING</SectionBadge></FadeUp>
          <FadeUp delay={60}>
            <h2 className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
              Pay as your<br />decisions grow.
            </h2>
          </FadeUp>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PLANS.map((plan, i) => (
            <FadeUp key={plan.tier} delay={i * 80}>
              <FeatureCard
                className={`p-8 flex flex-col h-full ${plan.highlighted ? "border-black/20 bg-[#F0EEE8]" : ""}`}
              >
                <div className="mb-8">
                  <div className="text-[11px] tracking-widest text-black/40 mb-4 font-mono">{plan.tier}</div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-light">{plan.price}</span>
                    {plan.period && <span className="text-black/40 text-sm">{plan.period}</span>}
                  </div>
                  <p className="text-xs text-black/35 tracking-wide">{plan.sub}</p>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-black/55">
                      <div className="w-1 h-1 rounded-full bg-black/25 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-3 rounded-xl text-sm tracking-widest transition-all duration-200 border border-black/10 text-black/60 hover:border-black/25 hover:text-black hover:bg-black/[0.04]">
                  GET STARTED
                </button>
              </FeatureCard>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

function CTASection({ onSubmit, question, setQuestion, isPending }: {
  onSubmit: (e: React.FormEvent) => void;
  question: string;
  setQuestion: (v: string) => void;
  isPending: boolean;
}) {
  return (
    <section className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]">
      <div className="max-w-3xl mx-auto text-center">
        <FadeUp>
          <h2 className="text-4xl md:text-5xl font-light tracking-tight leading-[1.05] mb-6">
            Start making better<br />decisions.
          </h2>
          <p className="text-base text-black/45 leading-relaxed mb-12">
            Join thousands of teams and individuals using PRISM to navigate complex decisions with structured AI intelligence.
          </p>
        </FadeUp>
        <FadeUp delay={80}>
          <form onSubmit={onSubmit} className="w-full">
            <div className="bg-white rounded-2xl border border-black/[0.07] flex items-center px-5 py-4 gap-4 shadow-sm input-glow">
              <Search className="w-5 h-5 text-black/25 shrink-0" />
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your decision question…"
                className="flex-1 bg-transparent border-none outline-none text-[#111] placeholder:text-black/28 text-base focus:ring-0"
              />
              <button
                type="submit"
                disabled={!question.trim() || isPending}
                className="bg-[#111] text-white rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-black/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                Analyze →
              </button>
            </div>
          </form>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-black/[0.06] py-8 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-black/40" />
          <span className="text-[11px] tracking-[0.25em] font-medium text-black/40 uppercase">PRISM</span>
        </Link>
        <div className="flex items-center gap-6">
          {[["Platform", "/"], ["Debate", "/debate"], ["Battle", "/battle"], ["Personas", "/personas"], ["History", "/history"]].map(([label, href]) => (
            <Link key={label} href={href} className="text-[11px] text-black/35 hover:text-black/60 transition-colors tracking-wide">
              {label}
            </Link>
          ))}
        </div>
        <div className="text-[11px] text-black/25 tracking-wide">© 2026 PRISM. All rights reserved.</div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [question, setQuestion] = useState("");
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const analyzeDecision = useAnalyzeDecision();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || analyzeDecision.isPending) return;
    analyzeDecision.mutate(
      { data: { question: question.trim() } },
      {
        onSuccess: (analysis) => {
          queryClient.invalidateQueries({ queryKey: getListAnalysesQueryKey() });
          setLocation(`/dashboard?id=${analysis.id}`);
        },
      }
    );
  };

  if (analyzeDecision.isPending) return <LoadingSequence />;

  const formProps = {
    onSubmit: handleSubmit,
    question,
    setQuestion,
    isPending: analyzeDecision.isPending,
  };

  return (
    <div className="min-h-screen bg-[#F5F4F0]">
      <LandingNav />
      <HeroSection {...formProps} />
      <TickerSection />
      <PlatformSection />
      <PersonasSection />
      <WorkflowSection />
      <LiveSection />
      <PricingSection />
      <CTASection {...formProps} />
      <Footer />
    </div>
  );
}
