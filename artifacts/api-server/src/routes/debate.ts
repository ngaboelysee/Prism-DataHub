import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, debatesTable } from "@workspace/db";
import {
  RunDebate2Body,
  RunDebate2Response,
  ListDebatesResponse,
  GetDebateParams,
  GetDebateResponse,
} from "@workspace/api-zod";
import { runDebate } from "../lib/prismEngine";

const router: IRouter = Router();

router.post("/debate", async (req, res): Promise<void> => {
  const parsed = RunDebate2Body.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { sideA, sideB, topic } = parsed.data;
  req.log.info({ sideA, sideB, topic }, "Running debate");

  try {
    const result = await runDebate(sideA, sideB, topic ?? undefined);

    const [saved] = await db
      .insert(debatesTable)
      .values({
        sideA: result.sideA.label,
        sideB: result.sideB.label,
        topic: topic ?? null,
        winner: result.winner,
        confidence: result.confidence,
        reasoning: result.reasoning,
        sideAData: result.sideA,
        sideBData: result.sideB,
      })
      .returning();

    const validated = RunDebate2Response.parse({
      ...result,
      id: saved.id,
    });
    res.json(validated);
  } catch (err) {
    req.log.error({ err }, "Debate failed");
    res.status(500).json({ error: "Debate analysis failed. Check your API key and try again." });
  }
});

router.get("/debates", async (req, res): Promise<void> => {
  try {
    const rows = await db
      .select()
      .from(debatesTable)
      .orderBy(desc(debatesTable.createdAt))
      .limit(50);

    const validated = ListDebatesResponse.parse(
      rows.map((r) => ({
        id: r.id,
        sideA: r.sideA,
        sideB: r.sideB,
        topic: r.topic ?? undefined,
        winner: r.winner,
        confidence: r.confidence,
        createdAt: r.createdAt.toISOString(),
      }))
    );
    res.json(validated);
  } catch (err) {
    req.log.error({ err }, "List debates failed");
    res.status(500).json({ error: "Failed to fetch debate history." });
  }
});

router.get("/debates/:id", async (req, res): Promise<void> => {
  const params = GetDebateParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid debate ID" });
    return;
  }

  try {
    const [row] = await db
      .select()
      .from(debatesTable)
      .where(eq(debatesTable.id, params.data.id))
      .limit(1);

    if (!row) {
      res.status(404).json({ error: "Debate not found" });
      return;
    }

    const validated = GetDebateResponse.parse({
      id: row.id,
      sideA: row.sideA,
      sideB: row.sideB,
      topic: row.topic ?? undefined,
      winner: row.winner,
      confidence: row.confidence,
      reasoning: row.reasoning,
      sideAData: row.sideAData,
      sideBData: row.sideBData,
      createdAt: row.createdAt.toISOString(),
    });
    res.json(validated);
  } catch (err) {
    req.log.error({ err }, "Get debate failed");
    res.status(500).json({ error: "Failed to fetch debate." });
  }
});

export default router;
