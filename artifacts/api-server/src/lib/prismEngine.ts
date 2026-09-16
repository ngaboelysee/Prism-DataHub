/**
 * PRISM Engine — unified AI orchestration layer.
 * Handles system, famous, and custom personas.
 * All calls are parallelized via Promise.all.
 */

export interface CustomPersona {
  id: string;
  name: string;
  type?: "system" | "famous" | "custom";
  rules: string;
  riskLevel?: number | null;
  creativityLevel?: number | null;
  aggressiveness?: number | null;
}

export interface PersonaArgument {
  persona: string;
  stance: string;
  strengths: string[];
  weaknesses: string[];
}

export interface BattleResult {
  arguments: PersonaArgument[];
  winner: string;
  verdict: string;
}

// ─── Upgraded system persona prompts ──────────────────────────────────────────
// Rules: structured output only, no filler, max ~150 words, step-by-step reasoning

export const SYSTEM_PERSONAS = {
  contrarian: `You are a structured risk-analysis engine. You do NOT narrate — you output structured intelligence.

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:
**Core Assumption Flaws**
• [flaw 1]
• [flaw 2]

**Critical Failure Risks** (ranked by severity)
1. [risk] — [why it's fatal]
2. [risk] — [why it's fatal]

**Hidden Dangers**
• [non-obvious risk]
• [non-obvious risk]

**Verdict**
[1 sentence: probability of failure and primary cause]

RULES: Be brutal. Be specific. No encouragement. Max 150 words total. Do NOT roleplay a human.`,

  expansionist: `You are a strategic opportunity-mapping engine. You do NOT narrate — you output structured intelligence.

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:
**Primary Opportunity**
[1 sentence stating the core upside]

**Growth Vectors** (ranked by impact)
1. [vector] — [scale potential]
2. [vector] — [scale potential]
3. [vector] — [scale potential]

**Asymmetric Advantages**
• [unfair advantage 1]
• [unfair advantage 2]

**Best-Case Trajectory**
[2 sentences: 12-month and 3-year scenario]

RULES: Be ambitious but evidence-grounded. No hedging. Max 150 words total. Do NOT roleplay a human.`,

  executionist: `You are a precision execution-planning engine. You do NOT narrate — you output structured intelligence.

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:
**Phase 1: Immediate (Week 1–2)**
1. [action]
2. [action]

**Phase 2: Build (Month 1–3)**
1. [action]
2. [action]

**Phase 3: Scale (Month 3–12)**
1. [action]
2. [action]

**Critical Dependencies**
• [blocker] → [how to resolve]

**First Move**
[1 sentence: the single most important thing to do today]

RULES: Concrete actions only. No advice — commands. Max 150 words total. Do NOT roleplay a human.`,

  analyst: `You are a neutral decision-analysis engine. You do NOT narrate — you output structured intelligence.

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:
**Decision Variables**
| Factor | Weight | Score | Notes |
|--------|--------|-------|-------|
| [factor] | [H/M/L] | [1-10] | [why] |

**Key Tradeoffs**
• [what you gain] vs [what you lose]
• [what you gain] vs [what you lose]

**Scenarios**
- Best case: [outcome]
- Base case: [outcome]  
- Worst case: [outcome]

**Rational Recommendation**
[1 sentence: the logically optimal choice and primary reason]

RULES: No bias. No emotion. Max 150 words total. Do NOT roleplay a human.`,
};

// ─── Famous decision-making frameworks ────────────────────────────────────────

export const FAMOUS_PERSONAS: Record<string, { name: string; rules: string }> = {
  buffett: {
    name: "Buffett Framework",
    rules: `You simulate a risk-averse, long-term value investing decision framework. You do NOT roleplay Warren Buffett — you simulate his decision-making methodology.

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:
**Circle of Competence Check**
[Does this fall within deep expertise? Yes/No + why]

**Moat Assessment**
• Durable competitive advantage: [present/absent]
• [specific moat or lack thereof]

**Margin of Safety**
• Downside if wrong: [specific]
• Acceptable risk threshold: [specific]

**10-Year View**
[1 sentence: what this looks like in a decade]

**Framework Verdict**
[1 sentence: invest/pass and primary reason]

RULES: Long-term only. Ignore short-term noise. Max 150 words. Do NOT roleplay a human.`,
  },
  musk: {
    name: "First-Principles Framework",
    rules: `You simulate a high-risk, physics-first, rapid-iteration decision framework. You do NOT roleplay Elon Musk — you simulate his first-principles methodology.

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:
**Assumption Demolition**
• Assumed constraint: [X] → Actually true? [yes/no + why]
• Assumed constraint: [X] → Actually true? [yes/no + why]

**Physics Limit**
[What does physics / fundamental reality actually allow here?]

**10x Thinking**
[If the goal were 10x bigger, what changes?]

**Speed-to-Iterate**
• Fastest possible test: [specific]
• Time to first feedback: [estimate]

**Framework Verdict**
[1 sentence: go hard or redirect, and why]

RULES: Ignore convention. Challenge every constraint. Max 150 words. Do NOT roleplay a human.`,
  },
  jobs: {
    name: "Simplicity Framework",
    rules: `You simulate a product-perfection, user-obsession, simplicity-first decision framework. You do NOT roleplay Steve Jobs — you simulate his product design methodology.

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:
**Simplicity Test**
• Current complexity: [what's unnecessarily complex]
• Irreducible core: [what actually matters]

**User Truth**
[What does the user actually want — not what they say they want]

**"No" List**
• Cut: [feature/aspect to eliminate]
• Cut: [feature/aspect to eliminate]

**Insanely Great Standard**
• Current state: [honest assessment]
• Gap to insanely great: [what's missing]

**Framework Verdict**
[1 sentence: ship it / kill it / simplify it first]

RULES: Obsess over the user. Cut everything else. Max 150 words. Do NOT roleplay a human.`,
  },
};

// ─── Gemini API call ───────────────────────────────────────────────────────────

export async function callGemini(systemPrompt: string, userMessage: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const baseUrl =
    process.env.AI_INTEGRATIONS_GEMINI_BASE_URL ||
    "https://generativelanguage.googleapis.com";

  const response = await fetch(
    `${baseUrl}/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: "user", parts: [{ text: userMessage }] }],
        generationConfig: { maxOutputTokens: 8192 },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${err}`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

// ─── Standard 4-persona analysis ──────────────────────────────────────────────

export async function runStandardAnalysis(
  question: string,
  customPersonas?: CustomPersona[] | null
): Promise<{
  contrarian: string;
  expansionist: string;
  executionist: string;
  analyst: string;
  verdict: string;
  confidence: number;
}> {
  // Resolve prompts — custom overrides system defaults
  const resolvePrompt = (key: keyof typeof SYSTEM_PERSONAS): string => {
    if (customPersonas && customPersonas.length > 0) {
      const match = customPersonas.find((p) => p.id === key || p.name.toLowerCase() === key);
      if (match) return match.rules;
    }
    return SYSTEM_PERSONAS[key];
  };

  const [contrarian, expansionist, executionist, analyst] = await Promise.all([
    callGemini(resolvePrompt("contrarian"), question),
    callGemini(resolvePrompt("expansionist"), question),
    callGemini(resolvePrompt("executionist"), question),
    callGemini(resolvePrompt("analyst"), question),
  ]);

  const verdictPrompt = `You are a synthesis engine. Output ONLY valid JSON — no markdown, no explanation.

Decision: "${question}"

Contrarian: ${contrarian}
Expansionist: ${expansionist}
Executionist: ${executionist}
Analyst: ${analyst}

Synthesize into a single decisive verdict (1–2 sentences max, direct, no hedging) and confidence score (0–100).

{"verdict": "...", "confidence": 75}`;

  const verdictRaw = await callGemini(
    "You are a synthesis engine. Output only valid JSON.",
    verdictPrompt
  );

  let verdict = "Perspectives conflict. Weigh the tradeoffs against your risk tolerance.";
  let confidence = 50;

  try {
    const clean = verdictRaw.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(clean) as { verdict?: string; confidence?: number };
    if (parsed.verdict) verdict = parsed.verdict;
    if (typeof parsed.confidence === "number") {
      confidence = Math.min(100, Math.max(0, Math.round(parsed.confidence)));
    }
  } catch {
    // use defaults
  }

  return { contrarian, expansionist, executionist, analyst, verdict, confidence };
}

// ─── Debate Mode ──────────────────────────────────────────────────────────────

export interface DebateSide {
  label: string;
  argument: string;
  keyPoints: string[];
}

export interface DebateResult {
  sideA: DebateSide;
  sideB: DebateSide;
  winner: "sideA" | "sideB" | "tie";
  confidence: number;
  reasoning: string;
}

const DEBATE_SIDE_SYSTEM = `You are a factual debate engine. Your job is to make the strongest possible evidence-based case for a given position.
You MUST use real, verifiable data, statistics, records, and facts from your training knowledge.
Be specific — cite numbers, dates, and concrete achievements.
Output ONLY valid JSON — no markdown fences, no extra text.`;

const DEBATE_JUDGE_SYSTEM = `You are an impartial debate judge with access to verified facts on both sides.
You evaluate arguments on the strength of evidence, logical consistency, and factual accuracy.
You do NOT have personal bias. You rule based purely on what the data supports.
Output ONLY valid JSON — no markdown fences, no extra text.`;

export async function runDebate(
  sideA: string,
  sideB: string,
  topic?: string
): Promise<DebateResult> {
  const context = topic ? `Debate context: "${topic}"\n\n` : "";

  const proposerPrompt = `${context}Build the strongest possible factual case for: "${sideA}"

You have access to real-world data. Use it. Be specific with numbers, records, and evidence.

Output ONLY this exact JSON (no markdown):
{
  "label": "${sideA}",
  "argument": "2-3 compelling sentences making the core case using concrete facts",
  "keyPoints": [
    "specific stat or achievement with numbers",
    "specific stat or achievement with numbers",
    "specific stat or achievement with numbers",
    "specific stat or achievement with numbers"
  ]
}

RULES: Every point must be factual and specific. No vague claims. No opinions.`;

  const opposerPrompt = `${context}Build the strongest possible factual case for: "${sideB}"

You have access to real-world data. Use it. Be specific with numbers, records, and evidence.

Output ONLY this exact JSON (no markdown):
{
  "label": "${sideB}",
  "argument": "2-3 compelling sentences making the core case using concrete facts",
  "keyPoints": [
    "specific stat or achievement with numbers",
    "specific stat or achievement with numbers",
    "specific stat or achievement with numbers",
    "specific stat or achievement with numbers"
  ]
}

RULES: Every point must be factual and specific. No vague claims. No opinions.`;

  // Run both sides in parallel
  const [proposerRaw, opposerRaw] = await Promise.all([
    callGemini(DEBATE_SIDE_SYSTEM, proposerPrompt),
    callGemini(DEBATE_SIDE_SYSTEM, opposerPrompt),
  ]);

  // Parse both sides
  const parseSide = (raw: string, fallbackLabel: string): DebateSide => {
    try {
      const clean = raw.replace(/```json\n?|\n?```/g, "").trim();
      const parsed = JSON.parse(clean) as Partial<DebateSide>;
      return {
        label: parsed.label ?? fallbackLabel,
        argument: parsed.argument ?? "Argument generation failed.",
        keyPoints: parsed.keyPoints ?? [],
      };
    } catch {
      return { label: fallbackLabel, argument: "Argument generation failed.", keyPoints: [] };
    }
  };

  const parsedA = parseSide(proposerRaw, sideA);
  const parsedB = parseSide(opposerRaw, sideB);

  // Judge call
  const judgePrompt = `${context}You have heard the factual arguments for both sides. Rule on this debate.

SIDE A — ${parsedA.label}:
${parsedA.argument}
Key facts: ${parsedA.keyPoints.join(" | ")}

SIDE B — ${parsedB.label}:
${parsedB.argument}
Key facts: ${parsedB.keyPoints.join(" | ")}

Based purely on the strength and accuracy of the evidence presented, declare a winner.

Output ONLY this exact JSON (no markdown):
{
  "winner": "sideA" or "sideB" or "tie",
  "confidence": <integer 0-100, how decisive the victory was>,
  "reasoning": "2-3 sentences explaining why this side wins based on the evidence, being specific about which facts tipped the balance"
}

RULES: Be decisive. A tie is rare — only if evidence is truly equal. Justify with facts.`;

  const judgeRaw = await callGemini(DEBATE_JUDGE_SYSTEM, judgePrompt);

  let winner: "sideA" | "sideB" | "tie" = "tie";
  let confidence = 50;
  let reasoning = "The evidence was closely matched on both sides.";

  try {
    const clean = judgeRaw.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(clean) as { winner?: string; confidence?: number; reasoning?: string };
    if (parsed.winner === "sideA" || parsed.winner === "sideB" || parsed.winner === "tie") {
      winner = parsed.winner;
    }
    if (typeof parsed.confidence === "number") {
      confidence = Math.min(100, Math.max(0, Math.round(parsed.confidence)));
    }
    if (parsed.reasoning) reasoning = parsed.reasoning;
  } catch {
    // use defaults
  }

  return { sideA: parsedA, sideB: parsedB, winner, confidence, reasoning };
}

// ─── Battle Arena ──────────────────────────────────────────────────────────────

export async function runBattle(
  question: string,
  personas: CustomPersona[]
): Promise<BattleResult> {
  const BATTLE_SYSTEM = `You are a structured debate engine for a strategic AI war room.
You generate precise, adversarial arguments between decision frameworks.
Output ONLY valid JSON — no markdown, no extra text.`;

  const BATTLE_PROMPT = `Decision in the arena: "${question}"

Personas in battle:
${personas.map((p, i) => `${i + 1}. ${p.name}: ${p.rules.slice(0, 300)}`).join("\n\n")}

Generate a structured debate. Each persona argues for their recommended approach.

Output this exact JSON structure:
{
  "arguments": [
    {
      "persona": "persona name",
      "stance": "their recommended action in 1 sentence",
      "strengths": ["strength 1", "strength 2", "strength 3"],
      "weaknesses": ["weakness 1", "weakness 2"]
    }
  ],
  "winner": "name of the persona with the strongest logical argument",
  "verdict": "1–2 sentence synthesis of the debate outcome and recommended path"
}

RULES:
- Each argument must be distinct and adversarial
- Strengths/weaknesses must be specific, not generic
- Winner must be justified by logic, not popularity
- Verdict is decisive — no hedging`;

  const raw = await callGemini(BATTLE_SYSTEM, BATTLE_PROMPT);

  try {
    const clean = raw.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(clean) as BattleResult;
    return parsed;
  } catch {
    // Fallback structure
    return {
      arguments: personas.map((p) => ({
        persona: p.name,
        stance: "Unable to generate structured argument.",
        strengths: ["Analysis pending"],
        weaknesses: ["Parse error"],
      })),
      winner: personas[0]?.name ?? "Unknown",
      verdict: "Battle analysis failed. Please retry.",
    };
  }
}
