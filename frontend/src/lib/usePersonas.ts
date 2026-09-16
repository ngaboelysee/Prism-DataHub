import { useState, useEffect } from "react";
import type { Persona } from "./types";

const STORAGE_KEY = "prism_custom_personas";

export function usePersonas() {
  const [personas, setPersonas] = useState<Persona[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPersonas(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load personas", e);
    }
  }, []);

  const save = (persona: Persona) => {
    setPersonas((prev) => {
      const exists = prev.find((p) => p.id === persona.id);
      const updated = exists
        ? prev.map((p) => (p.id === persona.id ? persona : p))
        : [...prev, persona];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const remove = (id: string) => {
    setPersonas((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return { personas, save, remove };
}
