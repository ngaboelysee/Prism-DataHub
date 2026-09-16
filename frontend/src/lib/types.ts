export interface Persona {
  id: string;
  name: string;
  type: "system" | "famous" | "custom";
  rules: string;
  riskLevel?: number;
  creativityLevel?: number;
  aggressiveness?: number;
}
