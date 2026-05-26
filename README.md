# NitroForms

**Forms, but faster.** A Discord-inspired form builder SaaS for communities, teams, and fast-moving creators.

## Live Demo

- **Frontend:** [deployed-url]
- **API Docs:** [deployed-url]/docs
- **Demo Credentials:** `demo@nitroforms.dev` / `password123`

## Features

- **Dynamic Form Builder** — Drag-and-drop fields with 8 field types
- **Runtime Zod Validation** — Creator-defined fields compiled into Zod schemas at submission time
- **Public & Unlisted Forms** — Public forms appear in explore; unlisted only via direct link
- **Public Submission** — Respondents submit without login
- **Response Analytics** — Timeline, field breakdown, rating summaries
- **Rate Limiting** — 5 submissions per 10 minutes per identity
- **Honeypot Spam Protection** — Silent bot rejection
- **Email Logging** — Honest fallback when no provider configured
- **Clerk Authentication** — Google OAuth + email/password
- **Scalar API Docs** — Interactive OpenAPI documentation
- **Discord-Inspired UI** — Dark, channel-based workspace

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Monorepo | Turborepo |
| Frontend | Next.js 16, React 19, Tailwind CSS v4 |
| Backend | Express, tRPC v11 |
| Auth | Clerk |
| Database | PostgreSQL, Drizzle ORM |
| Validation | Zod v4 (runtime dynamic schemas) |
| API Docs | Scalar (OpenAPI) |
| Deployment | Vercel (web) + Railway (api) + Neon (db) |

## Monorepo Structure

```
nitroforms/
├── apps/
│   ├── web/          → Next.js frontend (port 3000)
│   └── api/          → Express + tRPC backend (port 5001)
├── packages/
│   ├── database/     → Drizzle schema, migrations, seed
│   ├── trpc/         → tRPC routers, context, validators
│   ├── services/     → Business logic
│   ├── logger/       → Winston logger
│   └── typescript-config/
```

## Architecture

```
Browser → Next.js (proxy /api/trpc) → Express → tRPC Router → Drizzle → PostgreSQL
                                                     ↓
                                              Zod Runtime Engine
                                              (validates dynamic fields)
```

## Runtime Form Validation Engine

Creator-defined fields are stored as JSON. At submission time, the engine:
1. Reads field definitions from the form
2. Builds a Zod schema dynamically per field type
3. Validates the response against the schema
4. Returns field-level errors if invalid

Supported: `short_text`, `long_text`, `email`, `number`, `single_select`, `multi_select`, `checkbox`, `rating`, `date`

## Public vs Unlisted Visibility

| | Public | Unlisted |
|---|--------|----------|
| Appears in /explore | ✅ | ❌ |
| Accessible via direct link | ✅ | ✅ |
| Accepts submissions | ✅ | ✅ |

Draft/archived forms reject all submissions.

## API Documentation

Interactive docs at `/docs` (Scalar). Key public endpoints:

- `GET /health` — Server health check
- `GET /trpc/public.listExploreForms` — Public published forms
- `GET /trpc/public.getFormBySlug` — Get form by slug
- `POST /trpc/public.submitResponse` — Submit response (no auth required)

## Database Schema

6 tables: `users`, `forms`, `responses`, `form_events`, `themes`, `email_logs`

See `packages/database/models/` for full schema.

## Seeded Demo Data

- **1 demo user** — `demo@nitroforms.dev`
- **4 themes** — Anime, Gaming, Startup, Movie
- **4 forms** — 2 public/published, 1 unlisted/published, 1 draft
- **100 responses** — Distributed across published forms
- **240 form events** — Views, starts, submits

## Local Setup

### Prerequisites
- Node.js ≥ 18
- pnpm
- Docker (for PostgreSQL)

### Steps

```bash
# 1. Clone
git clone <repo-url> nitroforms && cd nitroforms

# 2. Install
pnpm install

# 3. Start PostgreSQL
docker compose up -d

# 4. Create env files
cp apps/web/.env.example apps/web/.env.local
# Add your Clerk keys to apps/web/.env.local
# Add CLERK_SECRET_KEY to apps/api/.env

# 5. Run migrations & seed
pnpm --filter database db:migrate
pnpm --filter database db:seed

# 6. Start everything
pnpm dev
```

Frontend: http://localhost:3000
API: http://localhost:5001
Docs: http://localhost:5001/docs

## Environment Variables

### `apps/web/.env.local`
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_API_URL=http://localhost:5001/trpc
```

### `apps/api/.env`
```
PORT=5001
NODE_ENV=development
BASE_URL=http://localhost:5001
DATABASE_URL=postgres://postgres:postgres@localhost:5432/dev
CLERK_SECRET_KEY=sk_test_...
```

## Scripts

```bash
pnpm dev              # Start all apps
pnpm build            # Build all
pnpm --filter database db:generate  # Generate migrations
pnpm --filter database db:migrate   # Run migrations
pnpm --filter database db:seed      # Seed demo data
```

## Known Tradeoffs

- **Email:** No real email provider — logs with status "skipped" (honest fallback)
- **Rate limiting:** In-memory (resets on restart). Use Redis for production.
- **Smart Generate:** Not implemented (would be deterministic templates, not real AI)
- **Drag-and-drop:** UI shows drag handles but reordering is up/down buttons

## Future Scope

- Real email integration (Resend)
- Redis-backed rate limiting
- CSV export for responses
- Conditional logic between fields
- Form expiry and response limits (schema supports it)
- QR code sharing
- Real-time collaboration
