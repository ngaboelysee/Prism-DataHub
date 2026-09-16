import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PersonaCard } from "@/components/prism/PersonaCard";
import { PersonaBuilder } from "@/components/prism/PersonaBuilder";
import { usePersonas } from "@/lib/usePersonas";
import { FAMOUS_PERSONAS } from "@/lib/famousPersonas";
import type { Persona } from "@/lib/types";

const SYSTEM_PERSONAS: Array<{ id: string; name: string; type: "system"; color: string; description: string }> = [
  { id: "contrarian", name: "The Contrarian", type: "system", color: "red", description: "Challenges assumptions, surfaces failure risks" },
  { id: "expansionist", name: "The Expansionist", type: "system", color: "blue", description: "Maps opportunities and upside potential" },
  { id: "executionist", name: "The Executionist", type: "system", color: "green", description: "Builds structured execution plans" },
  { id: "analyst", name: "The Analyst", type: "system", color: "purple", description: "Weighs tradeoffs with balanced logic" },
];

export default function PersonasPage() {
  const { personas: customPersonas, save, remove } = usePersonas();
  const [isBuilding, setIsBuilding] = useState(false);
  const [editingPersona, setEditingPersona] = useState<Persona | undefined>();

  const handleSave = (persona: Persona) => {
    save(persona);
    setIsBuilding(false);
    setEditingPersona(undefined);
  };

  const handleEdit = (persona: Persona) => {
    setEditingPersona(persona);
    setIsBuilding(true);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="section-label mb-2">Personas</div>
          <h1 className="text-3xl font-light tracking-tight text-[#111]">Manage Frameworks</h1>
        </div>
        {!isBuilding && (
          <Button 
            onClick={() => setIsBuilding(true)}
            className="border border-black/20 bg-transparent text-[#111] hover:bg-black/[0.04] rounded-xl px-4 py-2"
            data-testid="button-create-persona"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Persona
          </Button>
        )}
      </div>

      {isBuilding ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl"
        >
          <PersonaBuilder 
            initialPersona={editingPersona} 
            onSave={handleSave}
            onCancel={() => {
              setIsBuilding(false);
              setEditingPersona(undefined);
            }}
          />
        </motion.div>
      ) : (
        <Tabs defaultValue="system" className="w-full">
          <TabsList className="bg-[#faf9f7] rounded-xl border border-black/[0.06] p-1 h-auto">
            <TabsTrigger 
              value="system" 
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-black/[0.07] data-[state=active]:text-[#111] data-[state=active]:shadow-sm text-black/45 hover:text-black py-2 px-4 transition-all"
            >
              System Models
            </TabsTrigger>
            <TabsTrigger 
              value="famous" 
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-black/[0.07] data-[state=active]:text-[#111] data-[state=active]:shadow-sm text-black/45 hover:text-black py-2 px-4 transition-all"
            >
              Famous Frameworks
            </TabsTrigger>
            <TabsTrigger 
              value="custom" 
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-black/[0.07] data-[state=active]:text-[#111] data-[state=active]:shadow-sm text-black/45 hover:text-black py-2 px-4 transition-all"
            >
              Custom Personas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="system" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SYSTEM_PERSONAS.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <PersonaCard persona={p} className={`border-l-[3px] border-l-${p.id}`} />
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="famous" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {FAMOUS_PERSONAS.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <PersonaCard persona={p} />
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="mt-6">
            {customPersonas.length === 0 ? (
              <div className="bg-[#faf9f7] rounded-2xl border border-black/[0.07] p-12 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-black/[0.03] flex items-center justify-center mb-4">
                  <Plus className="w-6 h-6 text-black/40" />
                </div>
                <h3 className="text-lg font-light text-[#111]">No custom personas yet</h3>
                <p className="text-sm text-black/55 mt-2 max-w-sm">
                  Create custom analytical frameworks tuned to your specific decision-making style.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setIsBuilding(true)}
                  className="mt-6 border border-black/20 text-[#111] hover:bg-black/[0.03] rounded-xl"
                >
                  Build your first persona
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customPersonas.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <PersonaCard persona={p}>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(p)} className="h-8 px-2 text-black/55 hover:text-black hover:bg-black/[0.04]">
                        <Edit2 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => remove(p.id)} className="h-8 px-2 text-red-600/70 hover:text-red-700 hover:bg-red-50 ml-auto">
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </PersonaCard>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
