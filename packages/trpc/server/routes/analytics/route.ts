import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../../trpc";
import db, { eq, and, desc, count, sql } from "@repo/database";
import { formsTable, responsesTable, formEventsTable } from "@repo/database/schema";

export const analyticsRouter = router({
  getOverview: protectedProcedure
    .input(z.object({ formId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      // Verify ownership
      const [form] = await db.select().from(formsTable)
        .where(and(eq(formsTable.id, input.formId), eq(formsTable.ownerId, ctx.userId)))
        .limit(1);
      if (!form) throw new TRPCError({ code: "NOT_FOUND" });

      const [responseCount] = await db.select({ count: count() }).from(responsesTable)
        .where(eq(responsesTable.formId, input.formId));

      const [viewCount] = await db.select({ count: count() }).from(formEventsTable)
        .where(and(eq(formEventsTable.formId, input.formId), eq(formEventsTable.eventType, "view")));

      const [submitCount] = await db.select({ count: count() }).from(formEventsTable)
        .where(and(eq(formEventsTable.formId, input.formId), eq(formEventsTable.eventType, "submit")));

      const [startCount] = await db.select({ count: count() }).from(formEventsTable)
        .where(and(eq(formEventsTable.formId, input.formId), eq(formEventsTable.eventType, "start")));

      const totalResponses = responseCount?.count ?? 0;
      const views = viewCount?.count ?? 0;
      const starts = startCount?.count ?? 0;
      const completionRate = starts > 0 ? Math.round((totalResponses / starts) * 100 * 10) / 10 : 0;

      // Latest response
      const [latest] = await db.select({ submittedAt: responsesTable.submittedAt })
        .from(responsesTable)
        .where(eq(responsesTable.formId, input.formId))
        .orderBy(desc(responsesTable.submittedAt))
        .limit(1);

      return {
        totalResponses,
        views,
        completionRate,
        latestResponseAt: latest?.submittedAt ?? null,
      };
    }),

  getTimeline: protectedProcedure
    .input(z.object({ formId: z.string().uuid(), days: z.number().min(1).max(90).default(30) }))
    .query(async ({ ctx, input }) => {
      const [form] = await db.select().from(formsTable)
        .where(and(eq(formsTable.id, input.formId), eq(formsTable.ownerId, ctx.userId)))
        .limit(1);
      if (!form) throw new TRPCError({ code: "NOT_FOUND" });

      const since = new Date(Date.now() - input.days * 86400000);

      const rows = await db.select({
        date: sql<string>`DATE(${responsesTable.submittedAt})`,
        count: count(),
      })
        .from(responsesTable)
        .where(and(
          eq(responsesTable.formId, input.formId),
          sql`${responsesTable.submittedAt} >= ${since}`
        ))
        .groupBy(sql`DATE(${responsesTable.submittedAt})`)
        .orderBy(sql`DATE(${responsesTable.submittedAt})`);

      return rows;
    }),

  getFieldBreakdown: protectedProcedure
    .input(z.object({ formId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [form] = await db.select().from(formsTable)
        .where(and(eq(formsTable.id, input.formId), eq(formsTable.ownerId, ctx.userId)))
        .limit(1);
      if (!form) throw new TRPCError({ code: "NOT_FOUND" });

      const fields = form.fieldsJson as Array<{ id: string; type: string; label: string; options?: string[] }>;
      const selectFields = fields.filter(f => f.type === "single_select" || f.type === "multi_select");

      const responses = await db.select({ answersJson: responsesTable.answersJson })
        .from(responsesTable)
        .where(eq(responsesTable.formId, input.formId));

      const breakdown: Record<string, Record<string, number>> = {};

      for (const field of selectFields) {
        breakdown[field.id] = {};
        for (const opt of field.options ?? []) {
          breakdown[field.id]![opt] = 0;
        }
      }

      for (const resp of responses) {
        const answers = resp.answersJson as Record<string, unknown>;
        for (const field of selectFields) {
          const val = answers[field.id];
          if (field.type === "single_select" && typeof val === "string") {
            breakdown[field.id]![val] = (breakdown[field.id]![val] ?? 0) + 1;
          }
          if (field.type === "multi_select" && Array.isArray(val)) {
            for (const v of val) {
              breakdown[field.id]![v as string] = (breakdown[field.id]![v as string] ?? 0) + 1;
            }
          }
        }
      }

      return { fields: selectFields, breakdown };
    }),

  getRatingSummary: protectedProcedure
    .input(z.object({ formId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [form] = await db.select().from(formsTable)
        .where(and(eq(formsTable.id, input.formId), eq(formsTable.ownerId, ctx.userId)))
        .limit(1);
      if (!form) throw new TRPCError({ code: "NOT_FOUND" });

      const fields = form.fieldsJson as Array<{ id: string; type: string; label: string }>;
      const ratingFields = fields.filter(f => f.type === "rating");

      const responses = await db.select({ answersJson: responsesTable.answersJson })
        .from(responsesTable)
        .where(eq(responsesTable.formId, input.formId));

      const summary: Record<string, { avg: number; count: number }> = {};

      for (const field of ratingFields) {
        let total = 0, cnt = 0;
        for (const resp of responses) {
          const val = (resp.answersJson as Record<string, unknown>)[field.id];
          if (typeof val === "number") { total += val; cnt++; }
        }
        summary[field.id] = { avg: cnt > 0 ? Math.round((total / cnt) * 10) / 10 : 0, count: cnt };
      }

      return { fields: ratingFields, summary };
    }),
});

export const responseRouter = router({
  listByForm: protectedProcedure
    .input(z.object({ formId: z.string().uuid(), limit: z.number().min(1).max(100).default(50), offset: z.number().default(0) }))
    .query(async ({ ctx, input }) => {
      const [form] = await db.select().from(formsTable)
        .where(and(eq(formsTable.id, input.formId), eq(formsTable.ownerId, ctx.userId)))
        .limit(1);
      if (!form) throw new TRPCError({ code: "NOT_FOUND" });

      const responses = await db.select().from(responsesTable)
        .where(eq(responsesTable.formId, input.formId))
        .orderBy(desc(responsesTable.submittedAt))
        .limit(input.limit)
        .offset(input.offset);

      const [total] = await db.select({ count: count() }).from(responsesTable)
        .where(eq(responsesTable.formId, input.formId));

      return { responses, total: total?.count ?? 0 };
    }),
});
