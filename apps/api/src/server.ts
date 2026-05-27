import express from "express";
import { logger } from "@repo/logger";
import cors from "cors";

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
  description: "REST API for NitroForms — https://nitroforms.fun",
});

if (env.NODE_ENV !== "prod") {
  app.use(
    cors({
      origin: "*",
    }),
  );
}

app.use(express.json());

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

async function authenticateApiKey(req: express.Request, res: express.Response, next: express.NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer nitro_sk_")) {
    return res.status(401).json({ error: "Missing or invalid API key. Use: Authorization: Bearer nitro_sk_..." });
  }
  const key = auth.slice(7);
  const [apiKey] = await db.select().from(apiKeysTable).where(and(eq(apiKeysTable.key, key), eq(apiKeysTable.active, true))).limit(1);
  if (!apiKey) return res.status(401).json({ error: "Invalid or revoked API key" });
  await db.update(apiKeysTable).set({ lastUsedAt: new Date() }).where(eq(apiKeysTable.id, apiKey.id));
  (req as any).ownerId = apiKey.ownerId;
  next();
}

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

export default app;
