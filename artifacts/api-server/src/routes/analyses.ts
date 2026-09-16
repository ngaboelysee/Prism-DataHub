import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, analysesTable } from "@workspace/db";
import {
  AnalyzeDecisionBody,
  AnalyzeDecisionResponse,
  ListAnalysesResponse,
  GetAnalysisParams,
  GetAnalysisResponse,
} from "@workspace/api-zod";
import { runStandardAnalysis } from "../lib/prismEngine";

const router: IRouter = Router();

router.post("/analyses", async (req, res): Promise<void> => {
  const parsed = AnalyzeDecisionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { question, customPersonas } = parsed.data;
  req.log.info({ question }, "Analyzing decision");

  try {
    const { contrarian, expansionist, executionist, analyst, verdict, confidence } =
      await runStandardAnalysis(question, customPersonas ?? null);

    const [saved] = await db
      .insert(analysesTable)
      .values({ question, contrarian, expansionist, executionist, analyst, verdict, confidence })
      .returning();

    const result = AnalyzeDecisionResponse.parse({
      id: saved.id,
      question: saved.question,
      personas: {
        contrarian: saved.contrarian,
        expansionist: saved.expansionist,
        executionist: saved.executionist,
        analyst: saved.analyst,
      },
      verdict: saved.verdict,
      confidence: saved.confidence,
      createdAt: saved.createdAt.toISOString(),
    });

    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to analyze decision");
    res.status(500).json({ error: "Analysis failed. Check your API key and try again." });
  }
});

router.get("/analyses", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(analysesTable)
    .orderBy(desc(analysesTable.createdAt))
    .limit(50);

  const result = ListAnalysesResponse.parse(
    rows.map((r) => ({
      id: r.id,
      question: r.question,
      verdict: r.verdict,
      confidence: r.confidence,
      createdAt: r.createdAt.toISOString(),
    }))
  );

  res.json(result);
});

router.get("/analyses/:id", async (req, res): Promise<void> => {
  const params = GetAnalysisParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db
    .select()
    .from(analysesTable)
    .where(eq(analysesTable.id, params.data.id));

  if (!row) {
    res.status(404).json({ error: "Analysis not found" });
    return;
  }

  const result = GetAnalysisResponse.parse({
    id: row.id,
    question: row.question,
    personas: {
      contrarian: row.contrarian,
      expansionist: row.expansionist,
      executionist: row.executionist,
      analyst: row.analyst,
    },
    verdict: row.verdict,
    confidence: row.confidence,
    createdAt: row.createdAt.toISOString(),
  });

  res.json(result);
});

export default router;
