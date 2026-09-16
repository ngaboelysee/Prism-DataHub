import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, RotateCcw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePersonas } from "@/lib/usePersonas";
import { FAMOUS_PERSONAS } from "@/lib/famousPersonas";
import { PersonaCard } from "@/components/prism/PersonaCard";
import { useRunBattle } from "@workspace/api-client-react";
import type { Persona } from "@/lib/types";

const SYSTEM_PERSONAS: Persona[] = [
  { id: "contrarian", name: "The Contrarian", type: "system", rules: "" },
  { id: "expansionist", name: "The Expansionist", type: "system", rules: "" },
  { id: "executionist", name: "The Executionist", type: "system", rules: "" },
  { id: "analyst", name: "The Analyst", type: "system", rules: "" },
];

const LOADING_TEXTS = [
  "Entering the arena...",
  "Deploying frameworks...",
  "Initiating debate...",
  "Calculating winner...",
  "Verdict incoming..."
];

export default function BattlePage() {
  const { personas: customPersonas } = usePersonas();
  const allPersonas = [...SYSTEM_PERSONAS, ...FAMOUS_PERSONAS, ...customPersonas];
  
  const [question, setQuestion] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loadingStep, setLoadingStep] = useState(0);

  const runBattle = useRunBattle();

  const togglePersona = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      if (next.size < 4) next.add(id);
    }
    setSelectedIds(next);
  };

  useEffect(() => {
    if (!runBattle.isPending) return;
    const interval = setInterval(() => {
      setLoadingStep((s) => (s + 1) % LOADING_TEXTS.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [runBattle.isPending]);

  const handleBattle = () => {
    if (selectedIds.size < 2 || !question.trim() || runBattle.isPending) return;

    const selectedPersonas = Array.from(selectedIds).map(id => {
      const p = allPersonas.find(p => p.id === id)!;
      return {
        id: p.id,
        name: p.name,
        type: p.type as "system" | "famous" | "custom",
        rules: p.rules || "system default"
      };
    });

    runBattle.mutate({
      data: {
        question: question.trim(),
        personas: selectedPersonas,
      }
    });
  };

  const resetBattle = () => {
    runBattle.reset();
    setQuestion("");
    setSelectedIds(new Set());
    setLoadingStep(0);
  };

  if (runBattle.isPending) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center max-w-2xl mx-auto text-center gap-8 bg-[#F5F4F0]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 rounded-full border-t-2 border-black/15 border-r-2 border-r-black/30 opacity-80"
        />
        <motion.h2
          key={loadingStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-2xl font-light tracking-widest text-black/60 uppercase"
        >
          {LOADING_TEXTS[loadingStep]}
        </motion.h2>
      </div>
    );
  }

  const result = runBattle.data;

  if (result) {
    return (
      <div className="max-w-6xl mx-auto py-8 flex flex-col gap-12">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="section-label">Battle Arena</div>
          <h2 className="text-4xl font-light tracking-tight text-[#111]">Battle Results</h2>
          <div className="bg-white rounded-2xl border border-black/[0.07] px-6 py-4 max-w-2xl mt-4">
            <p className="text-lg text-black/80 italic font-light">"{question}"</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white border border-black/[0.07] shadow-sm flex items-center justify-center z-10 hidden lg:flex">
            <Swords className="w-6 h-6 text-black/40" />
          </div>

          {result.arguments.map((arg, idx) => {
            const isWinner = arg.persona === result.winner;
            const isEven = idx % 2 === 0;

            return (
              <motion.div
                key={arg.persona}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.2, type: "spring" }}
                className={`bg-white border border-black/[0.07] rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden ${
                  isWinner ? 'ring-2 ring-[#111] bg-[#111]/[0.02]' : ''
                }`}
              >
                {isWinner && (
                  <div className="absolute top-0 right-0 bg-[#111] text-white text-[10px] tracking-widest uppercase font-bold px-3 py-1 rounded-bl-xl">
                    WINNER
                  </div>
                )}
                <h3 className="text-2xl font-light tracking-tight text-[#111]">{arg.persona}</h3>
                <p className="text-sm font-medium text-black/80">{arg.stance}</p>
                
                <div className="space-y-4 mt-2">
                  <div>
                    <h4 className="text-[11px] tracking-widest uppercase text-green-600 mb-2">Strengths</h4>
                    <ul className="space-y-2">
                      {arg.strengths.map((s, i) => (
                        <li key={i} className="text-sm text-black/60 flex gap-2">
                          <span className="text-green-500/50 mt-0.5">•</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[11px] tracking-widest uppercase text-red-600 mb-2">Weaknesses</h4>
                    <ul className="space-y-2">
                      {arg.weaknesses.map((w, i) => (
                        <li key={i} className="text-sm text-black/60 flex gap-2">
                          <span className="text-red-500/50 mt-0.5">•</span> {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: result.arguments.length * 0.2 + 0.3 }}
          className="bg-[#faf9f7] border border-black/[0.07] rounded-2xl p-8 max-w-3xl mx-auto w-full text-center shadow-sm"
        >
          <div className="section-label mb-6">Final Verdict</div>
          <p className="text-xl font-light text-[#111] leading-relaxed">{result.verdict}</p>
          <div className="mt-8 pt-6 border-t border-black/[0.06] flex justify-center">
            <Button onClick={resetBattle} variant="outline" className="border border-black/20 text-[#111] hover:bg-black/[0.03] rounded-xl px-6">
              <RotateCcw className="w-4 h-4 mr-2" />
              New Battle
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 flex flex-col gap-8">
      <div className="text-center space-y-4">
        <div className="section-label mb-2">Battle Arena</div>
        <h1 className="text-4xl font-light tracking-tight text-[#111] flex items-center justify-center gap-3">
          <Swords className="w-8 h-8 text-black/30" />
          Clash of Perspectives
        </h1>
        <p className="text-sm text-black/55">Pit different analytical frameworks against each other to find the best path.</p>
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.07] p-6 flex flex-col gap-6 shadow-sm">
        <div className="space-y-3">
          <label className="text-sm font-medium text-[#111] block">What is the decision?</label>
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. Should we pivot our startup to enterprise sales?"
            className="bg-[#faf9f7] border border-black/[0.06] text-[#111] rounded-xl text-base py-6 focus-visible:ring-black/10"
            autoFocus
          />
        </div>

        <div className="space-y-4 mt-4">
          <div className="flex justify-between items-end">
            <label className="text-sm font-medium text-[#111] block">Select Combatants (2-4)</label>
            <span className="text-[11px] tracking-widest uppercase text-black/40">{selectedIds.size} / 4 selected</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {allPersonas.map((p) => (
              <div 
                key={p.id}
                onClick={() => togglePersona(p.id)}
                className={`bg-white border rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                  selectedIds.has(p.id) 
                    ? "border-[#111] bg-[#111]/[0.02] ring-1 ring-black/10" 
                    : "border-black/[0.07] hover:border-black/20"
                }`}
              >
                <div className="font-medium text-sm text-[#111]">{p.name}</div>
                <div className="text-[11px] text-black/45 tracking-widest uppercase mt-1">{p.type}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 mt-2 border-t border-black/[0.06] flex justify-end">
          <Button
            size="lg"
            disabled={selectedIds.size < 2 || !question.trim()}
            onClick={handleBattle}
            className="bg-[#111] text-white rounded-xl px-8 py-3 font-light hover:bg-black/80 transition-colors"
            data-testid="button-run-battle"
          >
            Enter the Arena
          </Button>
        </div>
      </div>
    </div>
  );
}
