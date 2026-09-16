import { ReactNode } from "react";
import type { Persona } from "../../lib/types";

interface PersonaCardProps {
  persona: Partial<Persona> & { description?: string; color?: string; name: string; type?: string };
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
  selected?: boolean;
}

export function PersonaCard({ persona, children, onClick, className = "", selected = false }: PersonaCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 flex flex-col gap-3 transition-all duration-200 border ${selected ? 'border-[#111] bg-[#111]/[0.02] ring-1 ring-black/10' : 'border-black/[0.07] hover:border-black/20 hover:shadow-sm'} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      data-testid={`card-persona-${persona.id || persona.name}`}
    >
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-medium text-lg text-[#111] leading-tight pr-4">{persona.name}</h3>
        {persona.type && (
          <span className="inline-flex px-3 py-1 rounded-full text-[11px] tracking-widest text-black/40 bg-black/[0.04] border border-black/[0.06] uppercase whitespace-nowrap">
            {persona.type}
          </span>
        )}
      </div>
      
      {persona.description && (
        <p className="text-sm text-black/55 leading-relaxed">{persona.description}</p>
      )}

      {persona.type === "custom" && persona.rules && (
        <p className="text-sm text-black/45 line-clamp-2 leading-relaxed">{persona.rules}</p>
      )}

      {children && (
        <div className="mt-auto pt-4 border-t border-black/[0.06] flex items-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
}
