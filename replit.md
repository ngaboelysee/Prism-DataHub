# PRISM

PRISM is an AI decision intelligence system that analyzes any decision through 4 competing AI personas and delivers a synthesized verdict with a confidence score.

## Run & Operate

- `pnpm --filter @workspace/frontend run dev` — run the frontend (port assigned by workflow)
- `pnpm --filter @workspace/backend run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (auto-provisioned)
- Required secret: `GEMINI_API_KEY` — Gemini API key for AI persona generation

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + Framer Motion
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- AI: Gemini 2.5 Flash (4 parallel persona calls + synthesis)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- DB schema: `lib/db/src/schema/analyses.ts`
- API contract: `lib/api-spec/openapi.yaml`
- Backend routes: `backend/src/routes/analyses.ts`
- Frontend pages: `frontend/src/pages/`
- Theme/CSS: `frontend/src/index.css`

## Architecture decisions

- 4 Gemini calls run in parallel via `Promise.all` for speed — contrarian, expansionist, executionist, analyst each get their own system prompt
- A 5th synthesis call combines all 4 perspectives into a verdict + confidence score (0–100)
- All analyses are persisted to PostgreSQL so the History page shows past decisions
- OpenAPI-first: all API contracts defined in `lib/api-spec/openapi.yaml`, then codegen generates typed React Query hooks and Zod schemas
- Frontend navigates to `/dashboard?id={id}` after analysis completes — fetches by ID rather than passing data in state

## Product

- Landing page: enter any decision question and click Analyze
- Loading screen: animated sequence while 4 AI personas deliberate
- Dashboard: 4 persona cards (Contrarian=red, Expansionist=blue, Executionist=green, Analyst=purple) with Framer Motion stagger animations + verdict panel with confidence bar
- History: list of all past analyses, click to revisit any

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after changing `openapi.yaml`
- Zod schema names from Orval: `AnalyzeDecisionBody`, `AnalyzeDecisionResponse`, `ListAnalysesResponse`, `ListAnalysesResponseItem`, `GetAnalysisParams`, `GetAnalysisResponse`
- Body schema components must use entity-shaped names (not `<OperationId>Body`) to avoid TS2308 collision

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
