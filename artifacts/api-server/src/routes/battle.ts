import { Router, type IRouter } from "express";
import { RunBattleBody, RunBattleResponse } from "@workspace/api-zod";
import { runBattle } from "../lib/prismEngine";

const router: IRouter = Router();

router.post("/battle", async (req, res): Promise<void> => {
  const parsed = RunBattleBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { question, personas } = parsed.data;
  req.log.info({ question, personaCount: personas.length }, "Running battle");

  try {
    const result = await runBattle(question, personas);
    const validated = RunBattleResponse.parse(result);
    res.json(validated);
  } catch (err) {
    req.log.error({ err }, "Battle failed");
    res.status(500).json({ error: "Battle analysis failed. Check your API key and try again." });
  }
});

export default router;
