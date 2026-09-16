import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { Persona } from "../../lib/types";
import { Loader2 } from "lucide-react";

interface PersonaBuilderProps {
  initialPersona?: Persona;
  onSave: (persona: Persona) => void;
  onCancel?: () => void;
}

export function PersonaBuilder({ initialPersona, onSave, onCancel }: PersonaBuilderProps) {
  const [name, setName] = useState(initialPersona?.name || "");
  const [rules, setRules] = useState(initialPersona?.rules || "");
  const [riskLevel, setRiskLevel] = useState(initialPersona?.riskLevel ?? 50);
  const [creativityLevel, setCreativityLevel] = useState(initialPersona?.creativityLevel ?? 50);
  const [aggressiveness, setAggressiveness] = useState(initialPersona?.aggressiveness ?? 50);
  const [isTesting, setIsTesting] = useState(false);

  const handleSave = () => {
    if (!name.trim() || !rules.trim()) return;
    
    onSave({
      id: initialPersona?.id || `custom_${Date.now()}`,
      name: name.trim(),
      type: "custom",
      rules: rules.trim(),
      riskLevel,
      creativityLevel,
      aggressiveness,
    });
  };

  const handleTest = () => {
    setIsTesting(true);
    setTimeout(() => setIsTesting(false), 1500);
  };

  return (
    <div className="bg-white border border-black/[0.07] rounded-2xl p-6 flex flex-col gap-6 shadow-sm" data-testid="persona-builder">
      <div className="space-y-2">
        <Label htmlFor="persona-name" className="text-[11px] tracking-widest uppercase text-black/40">Persona Name</Label>
        <Input
          id="persona-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. The Devil's Advocate"
          className="bg-[#faf9f7] border border-black/[0.06] text-[#111] rounded-xl focus-visible:ring-black/10"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="persona-rules" className="text-[11px] tracking-widest uppercase text-black/40">System Prompt / Rules</Label>
        <Textarea
          id="persona-rules"
          value={rules}
          onChange={(e) => setRules(e.target.value)}
          placeholder="Define how this persona analyzes decisions..."
          className="bg-[#faf9f7] border border-black/[0.06] text-[#111] rounded-xl min-h-[120px] resize-none focus-visible:ring-black/10"
        />
      </div>

      <div className="space-y-6 pt-2">
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label className="text-[11px] tracking-widest uppercase text-black/40">Risk Level</Label>
            <span className="text-[11px] font-mono text-black/50">{riskLevel}</span>
          </div>
          <Slider
            value={[riskLevel]}
            onValueChange={([val]) => setRiskLevel(val)}
            max={100}
            step={1}
            className="[&_[role=slider]]:bg-[#111] [&_[role=slider]]:border-[#111] [&_.bg-primary]:bg-[#111]"
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <Label className="text-[11px] tracking-widest uppercase text-black/40">Creativity</Label>
            <span className="text-[11px] font-mono text-black/50">{creativityLevel}</span>
          </div>
          <Slider
            value={[creativityLevel]}
            onValueChange={([val]) => setCreativityLevel(val)}
            max={100}
            step={1}
            className="[&_[role=slider]]:bg-[#111] [&_[role=slider]]:border-[#111] [&_.bg-primary]:bg-[#111]"
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <Label className="text-[11px] tracking-widest uppercase text-black/40">Aggressiveness</Label>
            <span className="text-[11px] font-mono text-black/50">{aggressiveness}</span>
          </div>
          <Slider
            value={[aggressiveness]}
            onValueChange={([val]) => setAggressiveness(val)}
            max={100}
            step={1}
            className="[&_[role=slider]]:bg-[#111] [&_[role=slider]]:border-[#111] [&_.bg-primary]:bg-[#111]"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-6 mt-2 border-t border-black/[0.06]">
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} className="text-black/60 hover:text-black hover:bg-black/[0.03] rounded-xl px-4">
            Cancel
          </Button>
        )}
        <div className="flex-1" />
        <Button 
          variant="outline" 
          onClick={handleTest} 
          disabled={isTesting || !rules.trim()}
          className="border border-black/20 text-[#111] hover:bg-black/[0.03] rounded-xl px-4"
        >
          {isTesting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Test Persona
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={!name.trim() || !rules.trim()}
          className="bg-[#111] text-white rounded-xl px-6 hover:bg-black/80 transition-colors font-medium text-sm"
          data-testid="button-save-persona"
        >
          Save Persona
        </Button>
      </div>
    </div>
  );
}
