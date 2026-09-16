import { useListAnalyses } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronRight, Calendar, Search } from "lucide-react";

export default function HistoryPage() {
  const { data: analyses, isLoading } = useListAnalyses();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-t-2 border-black/50 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <div className="section-label mb-2">Decision History</div>
          <h1 className="text-3xl font-light tracking-tight text-[#111]">Past Analyses</h1>
        </div>
        <Link href="/" className="bg-white rounded-xl border border-black/[0.07] px-4 py-2 text-sm font-medium hover:bg-black/[0.03] hover:border-black/20 transition-all flex items-center gap-2 text-[#111]">
          <Search className="w-4 h-4" /> New Analysis
        </Link>
      </div>

      {(!analyses || analyses.length === 0) ? (
        <div className="text-center py-20 bg-[#faf9f7] rounded-2xl border border-black/[0.07]">
          <h3 className="text-xl font-light text-[#111] mb-2">No history found</h3>
          <p className="text-sm text-black/55 mb-6">You haven't run any decisions through PRISM yet.</p>
          <Link href="/" className="bg-[#111] text-white px-6 py-2.5 rounded-xl font-medium inline-block hover:bg-black/80 transition-colors text-sm">
            Start First Analysis
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {analyses.map((analysis, i) => (
            <motion.div
              key={analysis.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/dashboard?id=${analysis.id}`}>
                <div className="bg-white rounded-2xl border border-black/[0.07] p-6 hover:border-black/20 hover:shadow-sm transition-all duration-200 group cursor-pointer">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 text-[11px] tracking-widest uppercase text-black/35 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(analysis.createdAt).toLocaleDateString(undefined, { 
                            year: 'numeric', month: 'short', day: 'numeric'
                          })}
                        </span>
                        <span>•</span>
                        <span className="mono-badge">
                          {analysis.confidence}% CONFIDENCE
                        </span>
                      </div>
                      <h2 className="text-base font-light text-[#111] group-hover:text-black mb-2 transition-colors line-clamp-1">
                        {analysis.question}
                      </h2>
                      <p className="text-sm text-black/45 line-clamp-2 leading-relaxed">
                        {analysis.verdict}
                      </p>
                    </div>
                    <div className="mt-2 text-black/20 group-hover:text-black/60 transition-colors">
                      <ChevronRight className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
