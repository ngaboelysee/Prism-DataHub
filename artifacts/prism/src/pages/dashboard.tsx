import { useGetAnalysis, getGetAnalysisQueryKey } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { AlertOctagon, TrendingUp, CheckSquare, Scale, ChevronLeft } from "lucide-react";
import { Link } from "wouter";

const PERSONA_COLORS: Record<string, { rgb: string }> = {
  contrarian:   { rgb: "220,38,38" },
  expansionist: { rgb: "37,99,235" },
  executionist: { rgb: "22,163,74" },
  analyst:      { rgb: "124,58,237" },
};

export default function Dashboard() {
  const searchParams = new URLSearchParams(window.location.search);
  const idStr = searchParams.get("id");
  const id = idStr ? parseInt(idStr, 10) : null;

  const { data: analysis, isLoading, isError } = useGetAnalysis(id as number, {
    query: {
      enabled: !!id,
      queryKey: getGetAnalysisQueryKey(id as number),
    },
  });

  if (!id) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-light mb-4 text-[#111]">No Analysis Selected</h2>
        <Link href="/" className="text-black/60 hover:text-black underline">Return Home</Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="w-8 h-8 border-t-2 border-r-2 border-[#111]/30 rounded-full"
        />
      </div>
    );
  }

  if (isError || !analysis) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-light text-red-500 mb-4">Failed to load analysis</h2>
        <Link href="/" className="text-black/60 hover:text-black underline">Return Home</Link>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 280, damping: 22 } },
  };

  const personas = [
    {
      key: "contrarian",
      title: "The Contrarian",
      icon: <AlertOctagon className="w-5 h-5" />,
      content: analysis.personas.contrarian,
      colorClass: "contrarian",
      description: "Highlights risks and failure cases",
    },
    {
      key: "expansionist",
      title: "The Expansionist",
      icon: <TrendingUp className="w-5 h-5" />,
      content: analysis.personas.expansionist,
      colorClass: "expansionist",
      description: "Focuses on opportunities and upside",
    },
    {
      key: "executionist",
      title: "The Executionist",
      icon: <CheckSquare className="w-5 h-5" />,
      content: analysis.personas.executionist,
      colorClass: "executionist",
      description: "Practical step-by-step action plan",
    },
    {
      key: "analyst",
      title: "The Analyst",
      icon: <Scale className="w-5 h-5" />,
      content: analysis.personas.analyst,
      colorClass: "analyst",
      description: "Balanced logical tradeoff analysis",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-8">
        <Link href="/history" className="inline-flex items-center text-[11px] tracking-widest uppercase text-black/40 hover:text-black mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to History
        </Link>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-light tracking-tight text-[#111] leading-tight mb-2"
        >
          {analysis.question}
        </motion.h1>
        <p className="text-[11px] text-black/35 tracking-widest uppercase mt-1">
          Analyzed on {new Date(analysis.createdAt).toLocaleDateString()}
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
      >
        {personas.map((persona) => {
          const rgb = PERSONA_COLORS[persona.colorClass]?.rgb ?? "0,0,0";
          return (
            <motion.div
              key={persona.key}
              variants={cardVariants}
              whileHover={{
                rotateY: 3,
                rotateX: -2,
                y: -6,
                transition: { type: "spring", stiffness: 400, damping: 28 },
              }}
              style={{ transformStyle: "preserve-3d", perspective: "1200px" }}
              className={`card-${persona.colorClass} card-lift rounded-2xl p-6 border border-l-4 border-black/[0.07] border-l-${persona.colorClass} shadow-sm cursor-default`}
            >
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-black/[0.06]">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-${persona.colorClass} shrink-0`}
                  style={{ background: `rgba(${rgb},0.08)` }}
                >
                  {persona.icon}
                </div>
                <div>
                  <h3 className={`font-semibold text-lg text-${persona.colorClass}`}>
                    {persona.title}
                  </h3>
                  <p className="text-[11px] text-black/40 tracking-widest uppercase">{persona.description}</p>
                </div>
              </div>
              <div className="text-sm text-black/65 leading-relaxed whitespace-pre-wrap font-mono">
                {persona.content}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Verdict panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="verdict-shimmer bg-[#faf9f7] rounded-2xl border border-black/[0.07] p-8 shadow-sm"
      >
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-black/[0.06] pb-6 gap-4">
            <h2 className="section-label">Synthesized Verdict</h2>
            <div className="flex items-center gap-4">
              <span className="text-[11px] tracking-widest uppercase text-black/40">Confidence</span>
              <div className="w-36 h-2 bg-black/[0.07] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${analysis.confidence}%` }}
                  transition={{ delay: 1.1, duration: 1.2, ease: "easeOut" }}
                  className="h-full confidence-fill rounded-full"
                />
              </div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="font-mono text-3xl font-light text-[#111]"
              >
                {analysis.confidence}%
              </motion.span>
            </div>
          </div>
          <div className="text-xl font-light text-[#111] leading-relaxed">
            {analysis.verdict}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
