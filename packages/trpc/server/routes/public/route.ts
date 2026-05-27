import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../../trpc";
import db, { eq, and, count, sql } from "@repo/database";
import { formsTable, responsesTable, formEventsTable, emailLogsTable } from "@repo/database/schema";
import { validateResponse } from "../../validators/runtime-engine";
import { canAcceptSubmission, canShowInExplore } from "../../validators/visibility-guard";
import { checkRateLimitRedis, rateLimitMemoryStore } from "../../utils/redis";

// Fallback in-memory rate limiter (if Redis is down)
function checkRateLimitMemory(key: string, maxRequests = 10, windowMs = 600000): boolean {
  const now = Date.now();
  const timestamps = rateLimitMemoryStore.get(key) ?? [];
  const valid = timestamps.filter((t) => now - t < windowMs);
  if (valid.length >= maxRequests) return false;
  valid.push(now);
  rateLimitMemoryStore.set(key, valid);
  return true;
}

async function checkRateLimit(key: string): Promise<boolean> {
  const redisResult = await checkRateLimitRedis(`ratelimit:${key}`);
  if (redisResult !== null) return redisResult;
  return checkRateLimitMemory(key);
}

export const publicRouter = router({
  listExploreForms: publicProcedure.query(async () => {
    const forms = await db.select({
      id: formsTable.id,
      title: formsTable.title,
      slug: formsTable.slug,
      description: formsTable.description,
      themeId: formsTable.themeId,
      visibility: formsTable.visibility,
      status: formsTable.status,
      createdAt: formsTable.createdAt,
      responseCount: sql<number>`(SELECT count(*) FROM responses WHERE responses.form_id = forms.id)`.as("response_count"),
    }).from(formsTable)
      .where(and(eq(formsTable.status, "published"), eq(formsTable.visibility, "public")));
    return forms;
  }),

  getFormBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const [form] = await db.select().from(formsTable)
        .where(eq(formsTable.slug, input.slug))
        .limit(1);

      if (!form || form.status === "archived") {
        throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" });
      }

      return {
        id: form.id,
        title: form.title,
        description: form.description,
        slug: form.slug,
        fields: form.fieldsJson,
        themeId: form.themeId,
        settings: form.settingsJson,
      };
    }),

  submitResponse: publicProcedure
    .input(z.object({
      slug: z.string(),
      answers: z.record(z.string(), z.unknown()),
      respondentEmail: z.string().email().optional(),
      _hp_field: z.string().optional(), // honeypot
      metadata: z.object({
        device: z.string().optional(),
        duration: z.number().optional(),
      }).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Honeypot check — silent reject
      if (input._hp_field) {
        return { success: true, message: "Response submitted" };
      }

      // Get form
      const [form] = await db.select().from(formsTable)
        .where(eq(formsTable.slug, input.slug))
        .limit(1);

      if (!form) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" });
      }

      // Check requireAuth
      const settings = form.settingsJson as { requireAuth?: boolean } | null;
      if (settings?.requireAuth && !ctx.userId) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Authentication required to submit this form" });
      }

      // Rate limit by slug + IP (Redis-backed with in-memory fallback)
      if (!(await checkRateLimit(`submit:${input.slug}:${ctx.ip ?? 'unknown'}`))) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Too many submissions. Please try again later." });
      }

      // Check if form can accept submissions
      const [responseCount] = await db.select({ count: count() }).from(responsesTable)
        .where(eq(responsesTable.formId, form.id));

      const guard = canAcceptSubmission(
        { status: form.status, visibility: form.visibility, expiresAt: form.expiresAt, responseLimit: form.responseLimit },
        responseCount?.count ?? 0
      );

      if (!guard.allowed) {
        throw new TRPCError({ code: "FORBIDDEN", message: guard.reason });
      }

      // Validate answers with runtime Zod engine
      // Only validate fields the user was shown (present in answers or non-required)
      const allFields = form.fieldsJson as Array<{ id: string; type: string; label: string; required: boolean; options?: string[]; validation?: Record<string, number> }>;
      const answeredIds = new Set(Object.keys(input.answers));
      const fields = allFields.filter(f => f.type !== "condition" && (answeredIds.has(f.id) || !f.required));
      const validation = validateResponse(fields, input.answers);

      if (!validation.success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Validation failed",
          cause: validation.errors,
        });
      }

      // Store response
      const [response] = await db.insert(responsesTable).values({
        formId: form.id,
        respondentEmail: input.respondentEmail ?? (input.answers["email_field"] as string) ?? null,
        answersJson: validation.data,
        metadataJson: input.metadata ?? {},
      }).returning();

      // Log form event
      await db.insert(formEventsTable).values({
        formId: form.id,
        eventType: "submit",
        metadataJson: { responseId: response!.id },
      });

      // Email log (skipped — no provider)
      await db.insert(emailLogsTable).values({
        formId: form.id,
        responseId: response!.id,
        recipient: input.respondentEmail ?? "unknown",
        type: "creator_notification",
        status: "skipped",
        errorMessage: "Email provider not configured",
      });

      return { success: true, message: "Response submitted successfully" };
    }),
});
