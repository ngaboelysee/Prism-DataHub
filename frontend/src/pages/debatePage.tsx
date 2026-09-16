import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, Gavel, ChevronRight, Swords, Trophy, Minus, Calendar, Clock } from "lucide-react";
import { useRunDebate2, useListDebates, useGetDebate } from "@workspace/api-client-react";

type DebateResult = {
  id?: number;
  sideA: { label: string; argument: string; keyPoints: string[] };
  sideB: { label: string; argument: string; keyPoints: string[] };
  winner: "sideA" | "sideB" | "tie";
  confidence: number;
  reasoning: string;
};

const EXAMPLE_DEBATES = [
  { sideA: "Lionel Messi", sideB: "Cristiano Ronaldo", topic: "Greatest footballer of all time" },
  { sideA: "Python",       sideB: "JavaScript",        topic: "Best programming language"       },
  { sideA: "iPhone",       sideB: "Android",           topic: "Superior smartphone platform"    },
  { sideA: "Tesla",        sideB: "Toyota",            topic: "Better car company long-term"    },
];

function WinnerBadge({ winner, sideA, sideB }: { winner: string; sideA: string; sideB: string }) {
  if (winner === "tie") return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.05] border border-black/10 text-[11px] tracking-widest uppercase text-black/50">
      <Minus className="w-3 h-3" /> Tie
    </span>
  );
  const label = winner === "sideA" ? sideA : sideB;
  const color = winner === "sideA" ? "#2563EB" : "#DC2626";
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] tracking-widest uppercase font-medium"
      style={{ background: `${color}0f`, border: `1px solid ${color}30`, color }}
    >
      <Trophy className="w-3 h-3" /> {label} Wins
    </span>
  );
}

function WinnerDot({ winner }: { winner: string }) {
  if (winner === "tie") return <span className="w-2 h-2 rounded-full bg-black/20 inline-block" />;
  const color = winner === "sideA" ? "#2563EB" : "#DC2626";
  return <span className="w-2 h-2 rounded-full inline-block" style={{ background: color }} />;
}

function DebateHistoryCard({
  debate,
  onRestore,
}: {
  debate: { id: number; sideA: string; sideB: string; topic?: string; winner: string; confidence: number; createdAt: string };
  onRestore: (id: number) => void;
}) {
  const winnerLabel = debate.winner === "sideA" ? debate.sideA : debate.winner === "sideB" ? debate.sideB : "Tie";
  return (
    <button
      onClick={() => onRestore(debate.id)}
      className="w-full text-left bg-white rounded-2xl border border-black/[0.07] p-5 hover:border-black/20 hover:shadow-sm transition-all group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <WinnerDot winner={debate.winner} />
            <span className="text-[11px] tracking-widest uppercase text-black/35">
              {winnerLabel} wins · {debate.confidence}%
            </span>
          </div>
          <h3 className="text-sm font-light text-[#111] mb-1 group-hover:text-black transition-colors">
            <span className="text-blue-600">{debate.sideA}</span>
            <span className="text-black/30 mx-2">vs</span>
            <span className="text-red-600">{debate.sideB}</span>
          </h3>
          {debate.topic && (
            <p className="text-xs text-black/40 truncate">{debate.topic}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-[10px] text-black/30 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(debate.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          </span>
          <ChevronRight className="w-4 h-4 text-black/20 group-hover:text-black/50 transition-colors" />
        </div>
      </div>
    </button>
  );
}

function RestoredDebateView({
  id,
  onBack,
}: {
  id: number;
  onBack: () => void;
}) {
  const { data, isLoading } = useGetDebate(id);

  if (isLoading) return (
    <div className="flex justify-center py-20">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-8 h-8 border-t-2 border-black/30 rounded-full"
      />
    </div>
  );
  if (!data) return null;

  const result: DebateResult = {
    id: data.id,
    sideA: data.sideAData as { label: string; argument: string; keyPoints: string[] },
    sideB: data.sideBData as { label: string; argument: string; keyPoints: string[] },
    winner: data.winner as "sideA" | "sideB" | "tie",
    confidence: data.confidence,
    reasoning: data.reasoning,
  };

  return <DebateResultView result={result} onBack={onBack} />;
}

function DebateResultView({ result, onBack }: { result: DebateResult; onBack: () => void }) {
  const winnerIsA = result.winner === "sideA";
  const winnerIsB = result.winner === "sideB";
  const isTie     = result.winner === "tie";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Side A */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className={`rounded-2xl border-2 p-6 transition-all ${winnerIsA ? "border-blue-400/40 bg-blue-50/30" : isTie ? "border-black/10 bg-white" : "border-black/[0.06] bg-white opacity-80"}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[10px] tracking-widest uppercase text-black/35 mb-1">Side A · Proposer</div>
              <h3 className="text-xl font-light text-[#111]">{result.sideA.label}</h3>
            </div>
            {winnerIsA && (
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          <p className="text-sm text-black/60 leading-relaxed mb-5 pb-5 border-b border-black/[0.06]">
            {result.sideA.argument}
          </p>
          <div className="space-y-2.5">
            <div className="text-[10px] tracking-widest uppercase text-black/30 mb-3">Key Evidence</div>
            {result.sideA.keyPoints.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}
                className="flex items-start gap-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                <span className="text-sm text-black/65">{point}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Side B */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className={`rounded-2xl border-2 p-6 transition-all ${winnerIsB ? "border-red-400/40 bg-red-50/30" : isTie ? "border-black/10 bg-white" : "border-black/[0.06] bg-white opacity-80"}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[10px] tracking-widest uppercase text-black/35 mb-1">Side B · Opposer</div>
              <h3 className="text-xl font-light text-[#111]">{result.sideB.label}</h3>
            </div>
            {winnerIsB && (
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          <p className="text-sm text-black/60 leading-relaxed mb-5 pb-5 border-b border-black/[0.06]">
            {result.sideB.argument}
          </p>
          <div className="space-y-2.5">
            <div className="text-[10px] tracking-widests uppercase text-black/30 mb-3">Key Evidence</div>
            {result.sideB.keyPoints.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}
                className="flex items-start gap-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                <span className="text-sm text-black/65">{point}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Judge's verdict */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="verdict-shimmer bg-[#faf9f7] rounded-2xl border border-black/[0.07] p-8"
      >
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-6 border-b border-black/[0.06] gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#111] flex items-center justify-center">
                <Gavel className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-[10px] tracking-widests uppercase text-black/40 mb-1">Judge's Ruling</div>
                <WinnerBadge
                  winner={result.winner}
                  sideA={result.sideA.label}
                  sideB={result.sideB.label}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[11px] tracking-widest uppercase text-black/40">Decisiveness</span>
              <div className="w-32 h-2 bg-black/[0.07] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.confidence}%` }}
                  transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
                  className="h-full confidence-fill rounded-full"
                />
              </div>
              <span className="font-mono text-2xl font-light text-[#111]">{result.confidence}%</span>
            </div>
          </div>
          <p className="text-lg font-light text-[#111] leading-relaxed">{result.reasoning}</p>

          <button
            onClick={onBack}
            className="mt-8 text-[11px] tracking-widest uppercase text-black/35 hover:text-black transition-colors"
          >
            ← New Debate
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function DebatePage() {
  const [sideA, setSideA] = useState("");
  const [sideB, setSideB] = useState("");
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState<DebateResult | null>(null);
  const [restoredId, setRestoredId] = useState<number | null>(null);

  const debate = useRunDebate2();
  const { data: history, refetch: refetchHistory } = useListDebates();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sideA.trim() || !sideB.trim() || debate.isPending) return;
    setRestoredId(null);
    debate.mutate(
      { data: { sideA: sideA.trim(), sideB: sideB.trim(), topic: topic.trim() || undefined } },
      {
        onSuccess: (data) => {
          setResult(data as DebateResult);
          void refetchHistory();
        },
      }
    );
  };

  const loadExample = (ex: typeof EXAMPLE_DEBATES[0]) => {
    setSideA(ex.sideA);
    setSideB(ex.sideB);
    setTopic(ex.topic);
    setResult(null);
    setRestoredId(null);
  };

  const handleBack = () => {
    setResult(null);
    setRestoredId(null);
  };

  const handleRestore = (id: number) => {
    setResult(null);
    setRestoredId(id);
  };

  const showingResult = result !== null || restoredId !== null;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Scale className="w-4 h-4 text-black/40" />
          <span className="text-[11px] tracking-widest uppercase text-black/40">Debate Mode</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-light tracking-tight text-[#111] mb-2">
          Let the facts decide.
        </h1>
        <p className="text-sm text-black/45 leading-relaxed max-w-lg">
          Enter any two opposing positions. PRISM assembles factual cases for both sides using real data, then an impartial judge rules on the evidence.
        </p>
      </div>

      {/* Example debates */}
      <div className="mb-8 flex flex-wrap gap-2">
        {EXAMPLE_DEBATES.map((ex) => (
          <button
            key={ex.sideA}
            onClick={() => loadExample(ex)}
            className="text-[11px] tracking-wide px-3 py-1.5 rounded-xl border border-black/[0.07] bg-white text-black/50 hover:text-black hover:border-black/20 transition-all"
          >
            {ex.sideA} vs {ex.sideB}
          </button>
        ))}
      </div>

      {/* Input form — always visible */}
      {!showingResult && (
        <form onSubmit={handleSubmit} className="mb-12">
          <div className="bg-white rounded-2xl border border-black/[0.07] p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 mb-5">
              <div>
                <label className="block text-[10px] tracking-widest uppercase text-black/35 mb-2">
                  Side A — Proposer
                </label>
                <input
                  type="text"
                  value={sideA}
                  onChange={(e) => setSideA(e.target.value)}
                  placeholder="e.g. Lionel Messi"
                  className="w-full bg-[#faf9f7] rounded-xl border border-black/[0.07] px-4 py-3 text-sm text-[#111] placeholder:text-black/30 outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/20 transition-all"
                />
              </div>
              <div className="flex items-end justify-center pb-3">
                <div className="w-9 h-9 rounded-full bg-[#111] flex items-center justify-center">
                  <Swords className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] tracking-widest uppercase text-black/35 mb-2">
                  Side B — Opposer
                </label>
                <input
                  type="text"
                  value={sideB}
                  onChange={(e) => setSideB(e.target.value)}
                  placeholder="e.g. Cristiano Ronaldo"
                  className="w-full bg-[#faf9f7] rounded-xl border border-black/[0.07] px-4 py-3 text-sm text-[#111] placeholder:text-black/30 outline-none focus:border-red-400/50 focus:ring-1 focus:ring-red-400/20 transition-all"
                />
              </div>
            </div>
            <div className="mb-5">
              <label className="block text-[10px] tracking-widest uppercase text-black/35 mb-2">
                Topic / Context <span className="text-black/20">(optional)</span>
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Greatest footballer of all time"
                className="w-full bg-[#faf9f7] rounded-xl border border-black/[0.07] px-4 py-3 text-sm text-[#111] placeholder:text-black/30 outline-none focus:border-violet-400/50 focus:ring-1 focus:ring-violet-400/20 transition-all"
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-black/30">
                Both sides argued simultaneously · ~10–15 seconds
              </p>
              <motion.button
                type="submit"
                disabled={!sideA.trim() || !sideB.trim() || debate.isPending}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="bg-[#111] text-white rounded-xl px-6 py-2.5 text-sm font-medium hover:bg-black/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {debate.isPending ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-4 h-4 border-t-2 border-white/50 rounded-full"
                    />
                    Debating…
                  </>
                ) : (
                  <>Start Debate <ChevronRight className="w-4 h-4" /></>
                )}
              </motion.button>
            </div>
          </div>
        </form>
      )}

      {/* Loading state */}
      <AnimatePresence>
        {debate.isPending && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-10 bg-white rounded-2xl border border-black/[0.07] p-8 text-center"
          >
            <div className="flex items-center justify-center gap-6 mb-6">
              {[
                { label: sideA || "Side A", color: "#2563EB" },
                { label: sideB || "Side B", color: "#DC2626" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-sm font-medium"
                    style={{ background: s.color }}
                  >
                    {s.label.slice(0, 2).toUpperCase()}
                  </motion.div>
                  <span className="text-[11px] text-black/40 tracking-wide">{s.label}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {[
                `Assembling factual case for ${sideA || "Side A"}…`,
                `Assembling factual case for ${sideB || "Side B"}…`,
                "Judge reviewing evidence…",
              ].map((step, i) => (
                <motion.p
                  key={step}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 2.5 }}
                  className="text-sm text-black/40"
                >
                  {step}
                </motion.p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results — new debate */}
      <AnimatePresence>
        {result && !debate.isPending && (
          <DebateResultView result={result} onBack={handleBack} />
        )}
      </AnimatePresence>

      {/* Results — restored from history */}
      <AnimatePresence>
        {restoredId !== null && (
          <RestoredDebateView id={restoredId} onBack={handleBack} />
        )}
      </AnimatePresence>

      {/* History section */}
      <AnimatePresence>
        {!showingResult && !debate.isPending && history && history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4"
          >
            <div className="flex items-center gap-2 mb-5">
              <Clock className="w-3.5 h-3.5 text-black/35" />
              <span className="text-[11px] tracking-widest uppercase text-black/35">Past Debates</span>
              <span className="ml-1 text-[10px] bg-black/[0.06] text-black/40 rounded-full px-2 py-0.5">{history.length}</span>
            </div>
            <div className="flex flex-col gap-3">
              {history.map((d, i) => (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <DebateHistoryCard
                    debate={{ ...d, topic: d.topic ?? undefined }}
                    onRestore={handleRestore}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
