# Next.js Minimal Starter

A production-ready [Next.js](https://nextjs.org) starter (App Router) with TypeScript, Tailwind CSS, DaisyUI, Drizzle ORM, Awilix DI, i18next, Vitest, Playwright, and Biome — following clean architecture principles.

## Tech Stack

| Category | Tool |
|---|---|
| Framework | Next.js 16.2 (App Router) + React 19.2 |
| Language | TypeScript (strict) |
| Package Manager | PNPM |
| Styling | Tailwind CSS 4 + DaisyUI 5.5 |
| Icons | Lucide React |
| ORM | Drizzle ORM (Vercel Postgres) |
| Validation | Zod |
| DI Container | Awilix |
| i18n | i18next / react-i18next |
| Linting & Formatting | Biome 2.4 |
| Unit / Integration Tests | Vitest 4.1 + React Testing Library |
| E2E Tests | Playwright 1.60 |
| Local DB | Docker Compose (PostgreSQL) |

---

## Prerequisites

- **Node.js** >= 24.16
- **PNPM** (latest) — install via `npm install -g pnpm@latest`
- **Docker & Docker Compose** — for local PostgreSQL
- **Vercel CLI** (optional) — `pnpm add -g vercel` for deployment workflows

---

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd nextjs-minimal-starter
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Configure the required variables (database connection, CORS origins, etc.) — see `.env.example` for reference.

### 4. Start the local database

```bash
docker compose up -d
```

This starts a PostgreSQL container (`localhost:5432`) with:
- **User:** `postgres`
- **Password:** `postgres`
- **Database:** `staging_db`

### 5. Run database migrations

```bash
pnpm drizzle-kit push
```

### 6. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start the Next.js development server |
| `pnpm build` | Build the production bundle |
| `pnpm start` | Start the production server |
| `pnpm lint` | Lint and format with Biome (`--write`) |
| `pnpm test` | Run unit/integration tests with Vitest (watch mode) |
| `pnpm test:out` | Run tests once and output JSON results |
| `pnpm test:e2e` | Run end-to-end tests with Playwright |

---

## Testing

### Unit & Integration Tests

```bash
# Watch mode
pnpm test

# Single run with coverage
pnpm vitest run --coverage
```

- Uses **Vitest** with **jsdom** environment and **React Testing Library**.
- Coverage provider: **v8** — reports in text, JSON, and HTML.
- Target: **≥ 90% coverage**, all tests passing.

### End-to-End Tests

```bash
# Install browsers (first time)
pnpm exec playwright install

# Run E2E tests
pnpm test:e2e
```

- Uses **Playwright** against Chromium, Firefox, and WebKit.
- Automatically starts the dev server before tests.
- HTML report generated in `playwright-report/`.

---

## Project Structure

```
├── app/                    # Next.js App Router (pages, layouts, API routes)
│   ├── layout.tsx          # Root layout (theme & language selectors)
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles (Tailwind directives)
│   └── about/              # Example route
├── docs/                   # Documentation
│   └── CI-CD-SETUP.md     # CI/CD deployment guide
├── e2e/                    # Playwright E2E test specs
├── openspec/               # OpenSpec — spec-driven development
│   ├── config.yaml         # Project context & artifact rules
│   ├── specs/              # Feature specifications
│   └── changes/            # Change proposals & archive
├── public/                 # Static assets
├── biome.json              # Biome linter/formatter config
├── docker-compose.yml      # Local PostgreSQL setup
├── vitest.config.ts        # Vitest configuration
├── playwright.config.ts    # Playwright configuration
├── next.config.ts          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies & scripts
```

---

## OpenSpec — Spec-Driven Development

This project uses [OpenSpec](https://github.com/Fission-AI/OpenSpec) for spec-driven development — a lightweight spec framework that helps you and your AI coding assistant agree on **what** to build before any code is written.

### Installing OpenSpec

```bash
# Install globally (requires Node.js >= 20.19.0)
pnpm add -g @fission-ai/openspec@latest

# Verify installation
openspec --version
```

If OpenSpec is already initialized in this project, regenerate AI guidance after upgrading:

```bash
openspec update
```

### OpenSpec Structure

```
openspec/
├── config.yaml             # Project context, default schema & artifact rules
├── specs/                  # Source of truth — how the system currently behaves
│   └── <domain>/
│       └── spec.md         # Specs organized by domain (auth/, payments/, ui/, etc.)
├── changes/                # Proposed modifications (one folder per change)
│   └── <change-name>/
│       ├── proposal.md     # Why and what (intent, scope, approach)
│       ├── specs/          # Delta specs — ADDED / MODIFIED / REMOVED requirements
│       │   └── <domain>/
│       │       └── spec.md
│       ├── design.md       # How (technical approach, architecture decisions)
│       └── tasks.md        # Implementation checklist with checkboxes
└── changes/
    └── archive/            # Completed changes (preserved for audit trail)
```

**Key concept:** `specs/` is the source of truth for current system behavior. `changes/` holds proposed modifications as **delta specs** — they describe what's being added, modified, or removed rather than restating the entire spec.

### OpenSpec Configuration

The [openspec/config.yaml](openspec/config.yaml) file customizes how OpenSpec works for this project:

- **`schema`** — Default workflow schema (this project uses `spec-driven`).
- **`context`** — Project context injected into **all** AI-generated artifacts: tech stack, architecture layers, Vercel ecosystem services, security, testing, i18n, accessibility, and conventions.
- **`rules`** — Per-artifact rules injected **only** for the matching artifact type:
  - **`rules.proposal`** — Word limit, required sections, security/i18n/Vercel service considerations.
  - **`rules.tasks`** — Max 2-hour chunks, layer tagging, test expectations, DI registration, migration tagging.
  - **`rules.spec`** — Acceptance criteria, Zod schemas, security, i18n keys, accessibility, mocking strategy.

### Slash Commands (OPSX)

Commands are invoked in your AI assistant's chat interface. Use the syntax matching your tool:

| Tool | Syntax |
|---|---|
| Claude Code | `/opsx:new`, `/opsx:apply` |
| Cursor / Windsurf / Copilot (IDE) | `/opsx-new`, `/opsx-apply` |

#### Command Quick Reference

| Command | Purpose | When to Use |
|---|---|---|
| `/opsx:onboard` | Guided interactive tutorial | First time using OpenSpec |
| `/opsx:explore` | Investigate ideas, compare approaches | Unclear requirements |
| `/opsx:new <name>` | Start a new change | Beginning any new work |
| `/opsx:continue` | Create the next artifact (one at a time) | Step-by-step, want review control |
| `/opsx:ff` | Fast-forward — create all planning artifacts | Clear scope, ready to build |
| `/opsx:apply` | Implement tasks (AI writes code) | Ready to write code |
| `/opsx:verify` | Validate implementation vs. artifacts | Before archiving |
| `/opsx:sync` | Merge delta specs into main specs | Optional — archive prompts if needed |
| `/opsx:archive` | Complete and archive the change | All work finished |
| `/opsx:bulk-archive` | Archive multiple changes at once | Parallel work, batch completion |

### Workflow Patterns

#### Quick Feature (most common)

For clear requirements, use fast-forward to generate all planning artifacts at once:

```
/opsx:new add-feature  →  /opsx:ff  →  /opsx:apply  →  /opsx:verify  →  /opsx:archive
```

```
You: /opsx:new add-dark-mode
AI:  Created openspec/changes/add-dark-mode/
     Ready to create: proposal

You: /opsx:ff
AI:  ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — delta requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!

You: /opsx:apply
AI:  Working through tasks...
     ✓ 1.1 Created ThemeContext provider
     ✓ 1.2 Added CSS custom properties
     ✓ 2.1 Created ThemeToggle component
     All tasks complete!

You: /opsx:verify
AI:  ✓ Completeness: all tasks done, all requirements implemented
     ✓ Correctness: implementation matches spec intent
     ✓ Coherence: design decisions reflected in code
     Ready to archive!

You: /opsx:archive
AI:  ✓ Synced specs to openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2026-02-10-add-dark-mode/
```

#### Exploratory (unclear requirements)

When you need to investigate before committing:

```
/opsx:explore  →  /opsx:new  →  /opsx:continue (step by step)  →  /opsx:apply
```

#### Parallel Changes

Work on multiple changes simultaneously — each change is its own folder:

```
/opsx:new feature-a  →  /opsx:ff  →  /opsx:apply
                                         ↓ (context switch)
/opsx:new fix-bug    →  /opsx:ff  →  /opsx:apply  →  /opsx:archive
                                         ↓ (resume)
/opsx:apply feature-a  →  /opsx:archive
```

Use `/opsx:bulk-archive` to archive multiple completed changes at once with automatic spec conflict resolution.

### Artifacts & Delta Specs

Each change folder contains **artifacts** that build on each other:

```
proposal ──► specs ──► design ──► tasks ──► implement
   │            │         │                    │
  why         what       how                steps
+ scope     changes    approach            to take
```

**Delta specs** use sections to show what's changing:

- `## ADDED Requirements` — New behavior (appended to main spec on archive)
- `## MODIFIED Requirements` — Changed behavior (replaces existing requirement)
- `## REMOVED Requirements` — Deprecated behavior (deleted from main spec)

### CLI Commands

```bash
# List active changes
openspec list

# View change details
openspec show <change-name>

# Validate spec formatting
openspec validate <change-name>

# Interactive dashboard
openspec view
```

### Best Practices

- **Name changes clearly:** `add-dark-mode`, `fix-login-redirect`, `implement-2fa` — not `update` or `wip`.
- **Keep changes focused:** One logical unit of work per change. Split "add X and refactor Y" into two changes.
- **Verify before archiving:** Run `/opsx:verify` to catch mismatches between artifacts and implementation.
- **Use `/opsx:explore` for unclear requirements** before committing to a change.
- **Model selection:** OpenSpec works best with high-reasoning models (Claude Opus 4.5, GPT 5.2 recommended).
- **Context hygiene:** Clear your context before starting implementation.

### Further Reading

- [Getting Started](https://github.com/Fission-AI/OpenSpec/blob/main/docs/getting-started.md) — First steps
- [Workflows](https://github.com/Fission-AI/OpenSpec/blob/main/docs/workflows.md) — Patterns and when to use each command
- [Commands](https://github.com/Fission-AI/OpenSpec/blob/main/docs/commands.md) — Full slash command reference
- [CLI](https://github.com/Fission-AI/OpenSpec/blob/main/docs/cli.md) — Terminal reference
- [Concepts](https://github.com/Fission-AI/OpenSpec/blob/main/docs/concepts.md) — Specs, changes, artifacts, schemas, and delta specs
- [Customization](https://github.com/Fission-AI/OpenSpec/blob/main/docs/customization.md) — Custom schemas and workflows
- [Supported Tools](https://github.com/Fission-AI/OpenSpec/blob/main/docs/supported-tools.md) — 20+ AI tool integrations

---

## Architecture Overview

```
┌─────────────────────────────────────┐
│           Frontend (React)          │
│  ┌───────────┐   ┌───────────────┐ │
│  │  Engine /  │   │   Service     │ │
│  │  Facade    │──▶│   Layer       │──── API, OAuth, Payment, Maps, etc.
│  │  Layer     │   │               │ │
│  └───────────┘   └───────────────┘ │
└──────────────────┬──────────────────┘
                   │ API calls
┌──────────────────▼──────────────────┐
│         Backend (Next.js API)       │
│  ┌───────────┐   ┌───────────────┐ │
│  │  Engine /  │   │   Service     │ │
│  │  Facade    │──▶│   Layer       │──── Vercel Postgres, KV, Blob,
│  │  Layer     │   │               │     Queues, Pub/Sub, AI SDK
│  └───────────┘   └───────────────┘ │
└─────────────────────────────────────┘
```

- **Engine / Facade Layer** — Business logic and multi-service orchestration. Only created when genuinely needed.
- **Service Layer** — Direct integration with databases, APIs, and external services.
- **DI Container** — Awilix with interface-based bindings for both layers.

---

## Deployment

See [docs/CI-CD-SETUP.md](docs/CI-CD-SETUP.md) for full CI/CD setup with GitHub Actions, GitLab CI, and Bitbucket Pipelines.

### Quick Deploy to Vercel

```bash
# Link project (first time)
vercel link

# Deploy to staging
vercel

# Deploy to production
vercel --prod
```

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [DaisyUI](https://daisyui.com)
- [Drizzle ORM](https://orm.drizzle.team)
- [Awilix](https://github.com/jeffijoe/awilix)
- [i18next](https://www.i18next.com)
- [Vitest](https://vitest.dev)
- [Playwright](https://playwright.dev)
- [Biome.js](https://biomejs.dev)
- [OpenSpec](https://openspec.dev)
