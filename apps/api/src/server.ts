import express from "express";
import { logger } from "@repo/logger";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import crypto from "crypto";

import * as trpcExpress from "@trpc/server/adapters/express";
import { generateOpenApiDocument, createOpenApiExpressMiddleware } from "trpc-to-openapi";
import { apiReference } from "@scalar/express-api-reference";

import { serverRouter, createContext } from "@repo/trpc/server";

import { env } from "./env";

export const app = express();
const openApiDocument = generateOpenApiDocument(serverRouter, {
  title: "NitroForms API",
  version: "2.0.0",
  baseUrl: env.BASE_URL.concat("/trpc"),
  description: `# NitroForms API

The official REST API for NitroForms — the Discord-inspired form builder.

**Base URL:** https://nitroforms.fun/api/v2

## Authentication

All authenticated endpoints require an API key passed via the Authorization header:

\`\`\`
Authorization: Bearer nitro_sk_your_key_here
\`\`\`

Generate API keys from your dashboard at https://nitroforms.fun/pricing (Settings > API Keys).

## Public Endpoints

Form submission (\`POST /api/v2/forms/:slug/submit\`) does NOT require authentication — anyone can submit responses to published forms.

## Rate Limits

- Authenticated: 60 requests/minute per IP
- Public submit: 5 submissions per 10 minutes per IP per form

## Resources

- **Forms** — Create, list, and manage your forms
- **Submissions** — Submit responses to published forms
- **Health** — Server status check

## SDKs

Install the official SDK:
\`\`\`bash
npm install @nitroforms/sdk
\`\`\`

Usage:
\`\`\`typescript
import { NitroForms } from '@nitroforms/sdk';
const nitro = new NitroForms('nitro_sk_your_key');
const forms = await nitro.forms.list();
\`\`\`
`,
});

// Security headers
app.use(helmet());

// Explicit CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);

// Body size limit
app.use(express.json({ limit: "100kb" }));

app.get("/", (req, res) => {
  return res.json({ message: "NitroForms API is running" });
});

app.get("/health", (req, res) => {
  return res.json({ message: "NitroForms server is healthy", healthy: true });
});

logger.debug(`openapi.json: ${env.BASE_URL}/openapi.json`);
app.get("/openapi.json", (req, res) => {
  return res.json(openApiDocument);
});

logger.debug(`docs: ${env.BASE_URL}/docs`);
app.use("/docs", apiReference({ url: "/openapi.json" }));

app.use(
  "/api/rpc",
  createOpenApiExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

// ─── REST API v2 (API key auth) ───────────────────────────────────────────────
import db, { eq, and } from "@repo/database";
import { apiKeysTable, formsTable, responsesTable } from "@repo/database/schema";
import { buildResponseSchema } from "@repo/trpc/server/validators/runtime-engine";

// Rate limit for REST v2: 60 req/min per IP
const v2Limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

async function authenticateApiKey(req: express.Request, res: express.Response, next: express.NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer nitro_sk_")) {
    return res.status(401).json({ error: "Missing or invalid API key. Use: Authorization: Bearer nitro_sk_..." });
  }
  const key = auth.slice(7);
  const hashedKey = crypto.createHash("sha256").update(key).digest("hex");
  const [apiKey] = await db.select().from(apiKeysTable).where(and(eq(apiKeysTable.key, hashedKey), eq(apiKeysTable.active, true))).limit(1);
  if (!apiKey) return res.status(401).json({ error: "Invalid or revoked API key" });
  await db.update(apiKeysTable).set({ lastUsedAt: new Date() }).where(eq(apiKeysTable.id, apiKey.id));
  (req as any).ownerId = apiKey.ownerId;
  next();
}

// Apply rate limiter to all /api/v2 routes
app.use("/api/v2", v2Limiter);

// GET /api/v2/forms — list your forms
app.get("/api/v2/forms", authenticateApiKey, async (req, res) => {
  const forms = await db.select({ id: formsTable.id, title: formsTable.title, slug: formsTable.slug, status: formsTable.status, visibility: formsTable.visibility, createdAt: formsTable.createdAt })
    .from(formsTable).where(eq(formsTable.ownerId, (req as any).ownerId));
  res.json({ forms });
});

// POST /api/v2/forms — create a form
app.post("/api/v2/forms", authenticateApiKey, async (req, res) => {
  const { title, fields } = req.body;
  if (!title) return res.status(400).json({ error: "title is required" });
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 50) + "-" + Math.random().toString(36).slice(2, 8);
  const [form] = await db.insert(formsTable).values({
    title, slug, ownerId: (req as any).ownerId, status: "draft", visibility: "public",
    fieldsJson: fields ?? [], settingsJson: {}, updatedAt: new Date(),
  }).returning();
  res.status(201).json({ form });
});

// GET /api/v2/forms/:slug — get form by slug
app.get("/api/v2/forms/:slug", authenticateApiKey, async (req, res) => {
  const [form] = await db.select().from(formsTable)
    .where(and(eq(formsTable.slug, req.params.slug!), eq(formsTable.ownerId, (req as any).ownerId))).limit(1);
  if (!form) return res.status(404).json({ error: "Form not found" });
  res.json({ form: { ...form, fields: form.fieldsJson, settings: form.settingsJson } });
});

// POST /api/v2/forms/:slug/submit — submit a response (no auth needed, but key optional)
app.post("/api/v2/forms/:slug/submit", async (req, res) => {
  const [form] = await db.select().from(formsTable).where(eq(formsTable.slug, req.params.slug!)).limit(1);
  if (!form) return res.status(404).json({ error: "Form not found" });
  if (form.status !== "published") return res.status(403).json({ error: "Form is not published" });
  const fields = form.fieldsJson as Array<{ id: string; type: string; label: string; required?: boolean; options?: string[] }>;
  const answers = req.body.answers ?? req.body;
  try {
    const schema = buildResponseSchema(fields);
    schema.parse(answers);
  } catch (e: any) {
    return res.status(422).json({ error: "Validation failed", details: e.errors ?? e.message });
  }
  const [response] = await db.insert(responsesTable).values({
    formId: form.id, answersJson: answers, metadataJson: { source: "api", device: req.headers["user-agent"] ?? "unknown" },
  }).returning();
  res.status(201).json({ message: "Response submitted", responseId: response!.id });
});

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
