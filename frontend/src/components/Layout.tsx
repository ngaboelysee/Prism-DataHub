import { Link } from "wouter";
import { BrainCircuit, History, Users, Swords, Scale } from "lucide-react";
import { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F4F0]">
      <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4">
        <div className="rounded-2xl border border-black/[0.06] bg-[#F5F4F0]/90 backdrop-blur-sm px-5 py-3 flex items-center justify-between max-w-3xl w-full">
          <Link href="/" className="flex items-center gap-2 group">
            <BrainCircuit className="w-4 h-4 text-black/70 group-hover:text-black transition-colors" />
            <span className="text-[11px] tracking-[0.25em] font-medium text-black/70 uppercase group-hover:text-black transition-colors">PRISM</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/battle" className="flex items-center gap-1.5 text-[11px] text-black/55 hover:text-black transition-colors tracking-wide">
              <Swords className="w-3.5 h-3.5" />
              Battle
            </Link>
            <Link href="/debate" className="flex items-center gap-1.5 text-[11px] text-black/55 hover:text-black transition-colors tracking-wide">
              <Scale className="w-3.5 h-3.5" />
              Debate
            </Link>
            <Link href="/personas" className="flex items-center gap-1.5 text-[11px] text-black/55 hover:text-black transition-colors tracking-wide">
              <Users className="w-3.5 h-3.5" />
              Personas
            </Link>
            <Link href="/history" className="flex items-center gap-1.5 text-[11px] text-black/55 hover:text-black transition-colors tracking-wide">
              <History className="w-3.5 h-3.5" />
              History
            </Link>
            <Link href="/" className="text-[11px] text-black border border-black/20 rounded-xl px-4 py-2 hover:bg-black/[0.04] transition-colors ml-2">
              New Analysis
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 w-full max-w-6xl mx-auto pt-24 pb-20 px-4 md:px-8">
        {children}
      </main>
    </div>
  );
}
