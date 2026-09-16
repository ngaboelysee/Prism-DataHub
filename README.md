# PRISM

## AI decision intelligence for clearer, stronger choices

PRISM is an AI-powered decision intelligence platform that helps people examine important choices from multiple angles before they act. It combines four specialized analytical personas, structured debate workflows, and a persistent decision history to turn an open-ended question into an evidence-oriented recommendation.

Instead of returning one unqualified answer, PRISM makes the reasoning visible:

- **Contrarian** identifies fragile assumptions, hidden risks, and failure modes.
- **Expansionist** surfaces opportunities, growth paths, and asymmetric advantages.
- **Executionist** translates a decision into practical phases and next actions.
- **Analyst** evaluates trade-offs, constraints, and the evidence behind each path.

The result is a synthesized verdict with a confidence score that users can inspect, challenge, and revisit.

## What PRISM does

### Decision analysis

Submit a decision question and PRISM runs four analytical perspectives in parallel. A synthesis step combines those perspectives into a final verdict and confidence score. Every analysis is saved so it can be revisited from the history view.

### Debate mode

Frame two opposing positions around a topic. PRISM creates:

1. A **Proposer** argument for the first position.
2. An **Opposer** argument for the second position.
3. A **Judge's ruling** based on the strength of the arguments and available evidence.

For example, users can compare Messi and Ronaldo, two product strategies, competing investments, or any other pair of positions. Debate results include confidence, reasoning, and the full arguments from both sides.

### Battle arena

The Battle Arena lets users compare multiple AI personas directly and see which perspective produces the strongest argument for the question at hand.

### Decision history

Analyses and debates are persisted in PostgreSQL. Users can browse previous decisions and restore a complete result without running the AI workflow again.

## Product flow

```text
Question or debate topic
          │
          ▼
Parallel persona arguments
          │
          ▼
Evidence-based synthesis or judging
          │
          ▼
Verdict, confidence score, and saved history
```

## Technology

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Framer Motion, Wouter
- **Backend:** Node.js, Express 5, TypeScript
- **AI orchestration:** Gemini 2.5 Flash
- **Database:** PostgreSQL with Drizzle ORM
- **Validation:** Zod and generated API schemas
- **API contract:** OpenAPI with Orval-generated React Query clients
- **Workspace:** pnpm monorepo

## Repository structure

```text
frontend/             React web application and preview
backend/              Express API and AI orchestration

artifacts/
├── api-server/       Replit deployment adapter for the backend
├── prism/            Replit deployment adapter for the frontend
└── mockup-sandbox/   Component preview and design workspace

lib/
├── api-client-react/ Generated React Query client
├── api-spec/         OpenAPI contract and code generation
├── api-zod/          Generated Zod schemas
└── db/               Drizzle schema and database client
```

Important application areas:

| Area | Location |
| --- | --- |
| AI orchestration | `backend/src/lib/prismEngine.ts` |
| Decision routes | `backend/src/routes/analyses.ts` |
| Debate routes | `backend/src/routes/debate.ts` |
| Database schemas | `lib/db/src/schema/` |
| OpenAPI contract | `lib/api-spec/openapi.yaml` |
| Frontend pages | `frontend/src/pages/` |
| Shared visual language | `frontend/src/index.css` |

## Local development

### Requirements

- Node.js 24 or a compatible current Node.js release
- pnpm
- PostgreSQL
- A Gemini API key

### Install dependencies

```bash
pnpm install
```

### Configure environment variables

The API server requires:

```bash
DATABASE_URL=postgresql://...
GEMINI_API_KEY=...
```

`AI_INTEGRATIONS_GEMINI_BASE_URL` is optional. When it is not set, PRISM uses Google's Generative Language API endpoint directly.

Store secrets in your environment or your deployment platform's secret manager. Do not commit them to the repository.

### Prepare the database

```bash
pnpm --filter @workspace/db run push
```

### Run the application

Start the API server:

```bash
pnpm --filter @workspace/backend run dev
```

Start the web application in a second terminal:

```bash
pnpm --filter @workspace/frontend run dev
```

The frontend communicates with the API through the `/api` route.

## Quality checks

Run the full TypeScript check:

```bash
pnpm run typecheck
```

Build the workspace:

```bash
pnpm run build
```

After changing `lib/api-spec/openapi.yaml`, regenerate the typed API clients:

```bash
pnpm --filter @workspace/api-spec run codegen
```

## API overview

The backend is served under `/api` and exposes these core operations:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/healthz` | Check API availability |
| `POST` | `/api/analyses` | Run a four-persona decision analysis |
| `GET` | `/api/analyses` | List saved analyses |
| `GET` | `/api/analyses/:id` | Retrieve one analysis |
| `POST` | `/api/debate` | Run and save a two-sided debate |
| `GET` | `/api/debates` | List saved debates |
| `GET` | `/api/debates/:id` | Retrieve one debate |
| `POST` | `/api/battle` | Run a multi-persona battle |

The OpenAPI document is the source of truth for request and response contracts.

## Design principles

- **Make reasoning inspectable:** show the arguments behind a recommendation.
- **Separate perspectives:** use distinct analytical roles instead of one generic response.
- **Prefer structured output:** return predictable fields that the interface can present clearly.
- **Persist decisions:** let users return to previous analyses and debates.
- **Use parallel work where possible:** run independent persona calls concurrently, then synthesize their results.
- **Keep API contracts explicit:** update OpenAPI first, then regenerate clients and validation schemas.

## Project status

PRISM is an active product prototype with working decision analysis, debate mode, battle mode, persistent history, and a React interface.

## License

This project is currently distributed without a published open-source license. Add a license file before distributing it for reuse outside the project.