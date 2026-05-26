import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../../trpc";
import db, { eq, and, count } from "@repo/database";
import { formsTable, responsesTable, formEventsTable, emailLogsTable } from "@repo/database/schema";
import { validateResponse } from "../../validators/runtime-engine";
import { canAcceptSubmission, canShowInExplore } from "../../validators/visibility-guard";

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, number[]>();
function checkRateLimit(key: string, maxRequests = 5, windowMs = 600000): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(key) ?? [];
  const valid = timestamps.filter((t) => now - t < windowMs);
  if (valid.length >= maxRequests) return false;
  valid.push(now);
  rateLimitMap.set(key, valid);
  return true;
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
    }).from(formsTable)
      .where(and(eq(formsTable.status, "published"), eq(formsTable.visibility, "public")));
    return forms;
  }),

  getFormBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const [form] = await db.select().from(formsTable)
        .where(and(eq(formsTable.slug, input.slug), eq(formsTable.status, "published")))
        .limit(1);

      if (!form) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Form not found or not published" });
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

      // Rate limit by slug (in production, use IP hash)
      if (!checkRateLimit(`submit:${input.slug}`)) {
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
      const fields = form.fieldsJson as Array<{ id: string; type: string; label: string; required: boolean; options?: string[]; validation?: Record<string, number> }>;
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
        respondentEmail: input.respondentEmail ?? null,
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
