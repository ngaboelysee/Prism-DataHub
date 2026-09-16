---
name: PRISM Zod schema names
description: Codegen-produced Zod/hook names — always verify after openapi.yaml changes
---

## Current generated Zod schemas (`@workspace/api-zod`)

- `AnalyzeDecisionBody` — POST /analyses request (has optional `customPersonas` array)
- `AnalyzeDecisionResponse` — POST /analyses response (same shape as `Analysis`)
- `ListAnalysesResponse` — GET /analyses (array of `ListAnalysesResponseItem`)
- `ListAnalysesResponseItem` — summary item (no personas field)
- `GetAnalysisParams` — path params for GET /analyses/:id
- `GetAnalysisResponse` — GET /analyses/:id response
- `RunBattleBody` — POST /battle request
- `RunBattleResponse` — POST /battle response (**NOT** `BattleResult` — that name will cause build failure)

## React Query hooks (`@workspace/api-client-react`)

- `useAnalyzeDecision()` — mutation
- `useListAnalyses()` / `getListAnalysesQueryKey()`
- `useGetAnalysis(id)` / `getGetAnalysisQueryKey(id)`
- `useRunBattle()` — mutation, call with `mutate({ data: { question, personas } })`

**Why:** The codegen uses operationId to derive names. `runBattle` → `RunBattleBody` / `RunBattleResponse`. Using `BattleResult` caused a build failure. Always grep `lib/api-zod/src/generated/api.ts` after changing openapi.yaml.
