# NitroForms

**Forms, but faster.** A production-grade, Discord-inspired form builder with conditional flow logic, AI generation, and real-time analytics.

🌐 **Live:** [https://nitroforms.fun](https://nitroforms.fun)  
📖 **API Docs:** [https://nitroforms.fun/docs](https://nitroforms.fun/docs)  
📦 **SDK:** `npm install @nitroforms/sdk`

---

## Why NitroForms?

| Feature | Google Forms | Typeform | NitroForms |
|---------|-------------|----------|------------|
| Conditional branching (IF/ELSE) | ❌ Basic | ✅ Limited | ✅ Full flow canvas |
| Visual node editor | ❌ | ❌ | ✅ React Flow |
| AI form generation | ❌ | ❌ | ✅ Llama 3.3 70B |
| REST API + SDK | ❌ | ✅ Paid | ✅ Free |
| Self-hostable | ❌ | ❌ | ✅ |
| Discord-native UI | ❌ | ❌ | ✅ |
| QR code sharing | ❌ | ❌ | ✅ |
| Sub-200ms API response | ❌ | ❌ | ✅ |
| Open source | ❌ | ❌ | ✅ |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    nitroforms.fun                         │
├──────────────┬──────────────┬───────────────────────────┤
│   Next.js    │  Express API │      PostgreSQL            │
│   App Router │  + tRPC      │      + Valkey (Redis)      │
│   Port 3000  │  Port 5001   │      Port 5432/6379        │
├──────────────┼──────────────┼───────────────────────────┤
│  React Flow  │  Drizzle ORM │      Clerk Auth            │
│  Framer Mot. │  Zod Valid.  │      Groq AI (Llama 3.3)   │
│  Tailwind    │  Scalar Docs │      Rate Limiting          │
└──────────────┴──────────────┴───────────────────────────┘
```

### Monorepo Structure (Turborepo)

```
nitro-forms/
├── apps/
│   ├── web/          → Next.js 16 (App Router, RSC, Turbopack)
│   └── api/          → Express 5 + tRPC + OpenAPI
├── packages/
│   ├── database/     → Drizzle ORM, PostgreSQL, migrations
│   ├── trpc/         → Shared tRPC router, procedures, validators
│   ├── sdk/          → @nitroforms/sdk (npm publishable)
│   ├── logger/       → Structured logging
│   └── eslint-config/→ Shared lint rules
└── docker-compose.yml
```

---

## Tech Stack

### Frontend
| Technology | Purpose | Why |
|-----------|---------|-----|
| **Next.js 16** | Framework | App Router, RSC, streaming, Turbopack |
| **React Flow** | Canvas editor | Infinite canvas, drag-drop nodes, edge routing |
| **Tailwind CSS** | Styling | Zero-runtime, Discord color system |
| **Framer Motion** | Animations | Ghost mascot, page transitions |
| **Clerk** | Auth | Google/Discord OAuth, JWT, production-ready |
| **tRPC Client** | API calls | End-to-end type safety, no codegen |
| **qrcode.react** | QR sharing | Canvas-based, downloadable PNG |

### Backend
| Technology | Purpose | Why |
|-----------|---------|-----|
| **Express 5** | HTTP server | Mature, middleware ecosystem |
| **tRPC** | API layer | Type-safe, auto-generated client types |
| **Drizzle ORM** | Database | Type-safe SQL, zero overhead, migrations |
| **PostgreSQL 15** | Primary DB | JSONB for dynamic fields, full-text search |
| **Valkey (Redis)** | Cache + Rate limit | Draft caching, sliding-window rate limiting |
| **Zod 4** | Validation | Runtime schema validation, form field engine |
| **Helmet** | Security | CSP, HSTS, X-Frame-Options |
| **Scalar** | API docs | OpenAPI 3.0, interactive playground |

### AI
| Technology | Purpose | Why |
|-----------|---------|-----|
| **Groq** | Inference | Free, fast (~1s), no cold starts |
| **Llama 3.3 70B** | Think mode | Complex branching logic |
| **Llama 3.1 8B** | Instant mode | Simple forms, <500ms |

### Infrastructure
| Technology | Purpose | Why |
|-----------|---------|-----|
| **Turborepo** | Monorepo | Parallel builds, shared packages |
| **Docker** | Services | PostgreSQL + Valkey containers |
| **PM2** | Process manager | Auto-restart, log management |
| **Nginx** | Reverse proxy | SSL termination, static caching |
| **Let's Encrypt** | SSL | Free, auto-renewal |

---

## Core Features

### 1. Visual Form Builder (React Flow)
- Infinite canvas with drag-and-drop field nodes
- 13 field types: text, email, number, phone, URL, select, multi-select, checkbox, rating, date, time, file upload, condition
- IF/ELSE condition nodes with yes/no branching
- Auto-connect on proximity (magnet snap)
- Resizable panels (sidebar + inspector)
- Inline label editing on nodes
- Edge deletion, custom edge styling

### 2. Conditional Flow Logic
- Binary branching: IF field equals/contains/greater_than value → yes/no paths
- Chained conditions for 3+ options (Cricket → Chess → Football pattern)
- Edges stored in `settingsJson.edges` with `sourceHandle: "yes" | "no" | null`
- Public form evaluates conditions dynamically at runtime
- Both paths converge to shared ending fields

### 3. AI Form Generation (Dual Mode)
- **⚡ Instant** — Llama 3.1 8B, ~500ms, simple forms
- **🧠 Think** — Llama 3.3 70B, ~2s, complex branching
- Generates: title, fields, condition nodes, edges
- External guardrails (regex pattern blocking before LLM)
- System prompt with few-shot examples for correct edge wiring
- Auto-saves generated form immediately
- Prompt input in #welcome channel (Discord-style)

### 4. Public Form (Typeform-style)
- One question per step with progress bar
- Conditional path evaluation at each step
- Required field validation before advancing
- Email/phone/URL format validation
- Enter key to advance
- Discord-themed UI with channel header
- #welcome screen with "Get Started" button
- Mobile responsive

### 5. Analytics Dashboard
- Discord voice-channel style form selector
- Real-time response count, completion rate, views
- Response timeline (7-day bar chart)
- Device breakdown (desktop/mobile/tablet from metadata)
- CSV export with field labels as headers
- Search/filter responses
- Scroll-to-section navigation

### 6. REST API v2
```bash
# List forms (API key required)
curl https://nitroforms.fun/api/v2/forms \
  -H "Authorization: Bearer nitro_sk_..."

# Create form
curl -X POST https://nitroforms.fun/api/v2/forms \
  -H "Authorization: Bearer nitro_sk_..." \
  -d '{"title":"Feedback","fields":[...]}'

# Submit response (public, no key needed)
curl -X POST https://nitroforms.fun/api/v2/forms/my-form/submit \
  -d '{"answers":{"email_field":"user@test.com","f1":"Great!"}}'
```

### 7. SDK
```typescript
import { NitroForms } from '@nitroforms/sdk';

const nitro = new NitroForms('nitro_sk_...');
const { forms } = await nitro.forms.list();
const result = await nitro.forms.submit('my-form', {
  answers: { email_field: 'user@test.com', f1: 5 }
});
```

---

## Security

- **API keys hashed** with SHA-256 before storage (only prefix displayed)
- **Rate limiting** per IP per slug (10 req/10min), Redis-backed with in-memory fallback
- **Helmet** security headers (HSTS, X-Content-Type-Options, X-Frame-Options)
- **Clerk JWT** verification on all protected routes
- **Ownership checks** on all form CRUD operations
- **Honeypot** spam protection on public submissions
- **Input validation** via Zod on every endpoint
- **CORS** restricted to frontend origin
- **Body size limit** (100KB)
- **Global error handler** — no stack trace leakage

---

## Database Schema

```
users          → Clerk user sync (id, email, fullName)
forms          → JSONB fields, settings, edges, status, visibility
responses      → JSONB answers, respondent email, metadata
form_events    → view/start/submit tracking for analytics
api_keys       → SHA-256 hashed keys, active flag, lastUsedAt
themes         → Reusable form themes
email_logs     → Delivery tracking
```

7 tables, 3 indexes, foreign key integrity, soft-delete support.

---

## Performance

- **Dynamic imports** — ReactFlow (~150KB) only loaded on builder page
- **Code splitting** — Framer Motion ghost loaded with `ssr: false`
- **QueryClient** per-request (no SSR data leakage)
- **Loading states** — Suspense boundaries on route transitions
- **Static assets** — 365-day cache headers via Nginx
- **Streaming** — Server Components where possible
- **Optimized packages** — Lucide tree-shakes, Radix lazy-loaded

---

## Running Locally

```bash
# Prerequisites: Node 20+, pnpm, Docker

# Clone
git clone https://github.com/realSUDO/nitro-forms.git
cd nitro-forms

# Start services
docker compose up -d  # PostgreSQL + Valkey

# Install
pnpm install

# Environment
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.local.example apps/web/.env.local
# Fill in Clerk keys, Groq key

# Database
echo 'DATABASE_URL=postgres://postgres:postgres@localhost:5432/dev' > packages/database/.env
pnpm --filter database db:migrate
pnpm --filter database db:seed

# Run
pnpm dev
# Web: http://localhost:3000
# API: http://localhost:5001
# Docs: http://localhost:5001/docs
```

---

## Deployment

Self-hosted on a single Ubuntu VM with:
- Nginx (reverse proxy + SSL)
- PM2 (process management)
- Docker (PostgreSQL + Valkey)
- Let's Encrypt (auto-renewing SSL)

See [deploy-nitro.md](./deploy-nitro.md) for full guide.

---

## API Documentation

Interactive API docs at [https://nitroforms.fun/docs](https://nitroforms.fun/docs) powered by Scalar.

OpenAPI spec: `https://nitroforms.fun/openapi.json`

---

## Environment Variables

### API (`apps/api/.env`)
```
PORT=5001
NODE_ENV=prod
BASE_URL=https://nitroforms.fun
DATABASE_URL=postgres://...
CLERK_SECRET_KEY=sk_live_...
REDIS_URL=redis://localhost:6379
GROQ_API_KEY=gsk_...
FRONTEND_URL=https://nitroforms.fun
```

### Web (`apps/web/.env.local`)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard
```

---

## License

MIT

---

Built for a hackathon. Shipped in production. No compromises.
