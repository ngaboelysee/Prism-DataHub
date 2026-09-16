import { Router, type IRouter } from "express";
import healthRouter from "./health";
import analysesRouter from "./analyses";
import battleRouter from "./battle";
import debateRouter from "./debate";

const router: IRouter = Router();

router.use(healthRouter);
router.use(analysesRouter);
router.use(battleRouter);
router.use(debateRouter);

export default router;
