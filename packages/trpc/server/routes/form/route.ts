import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "../../trpc";
import db, { eq, and, desc } from "@repo/database";
import { formsTable } from "@repo/database/schema";
import { nanoid } from "../../utils/nanoid";
import { cacheDraft, getCachedDraft, clearDraftCache } from "../../utils/redis";

const fieldSchema = z.object({
  id: z.string(),
  type: z.enum(["short_text", "long_text", "email", "number", "single_select", "multi_select", "checkbox", "rating", "date", "condition", "file_upload", "url", "phone", "time"]),
  label: z.string().min(1),
  description: z.string().optional(),
  placeholder: z.string().optional(),
  required: z.boolean(),
  order: z.number(),
  options: z.array(z.string()).optional(),
  validation: z.object({
    minLength: z.number().optional(),
    maxLength: z.number().optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    minSelected: z.number().optional(),
    maxSelected: z.number().optional(),
  }).optional(),
  position: z.object({ x: z.number(), y: z.number() }).optional(),
  conditionConfig: z.object({
    sourceFieldId: z.string(),
    operator: z.enum(["equals", "not_equals", "greater_than", "less_than", "contains"]),
    value: z.string(),
  }).optional(),
});

export const formRouter = router({
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1).max(200),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const slug = input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + nanoid(6);
      const [form] = await db.insert(formsTable).values({
        ownerId: ctx.userId,
        title: input.title,
        description: input.description ?? null,
        slug,
        fieldsJson: [{ id: "email_field", type: "email", label: "Your email address", required: true, order: 0 }],
        settingsJson: {},
      }).returning();
      return form;
    }),

  listMine: protectedProcedure.query(async ({ ctx }) => {
    return db.select().from(formsTable)
      .where(eq(formsTable.ownerId, ctx.userId))
      .orderBy(desc(formsTable.createdAt));
  }),

  getById: protectedProcedure
    .input(z.object({ formId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [form] = await db.select().from(formsTable)
        .where(and(eq(formsTable.id, input.formId), eq(formsTable.ownerId, ctx.userId)))
        .limit(1);
      if (!form) throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" });
      return form;
    }),

  update: protectedProcedure
    .input(z.object({
      formId: z.string().uuid(),
      title: z.string().min(1).max(200).optional(),
      description: z.string().optional(),
      fields: z.array(fieldSchema).optional(),
      settings: z.record(z.string(), z.unknown()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [form] = await db.select().from(formsTable)
        .where(and(eq(formsTable.id, input.formId), eq(formsTable.ownerId, ctx.userId)))
        .limit(1);
      if (!form) throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" });

      const updates: Record<string, unknown> = {};
      if (input.title) updates.title = input.title;
      if (input.description !== undefined) updates.description = input.description;
      if (input.fields) updates.fieldsJson = input.fields;
      if (input.settings) updates.settingsJson = input.settings;

      const [updated] = await db.update(formsTable).set(updates).where(eq(formsTable.id, input.formId)).returning();
      return updated;
    }),

  publish: protectedProcedure
    .input(z.object({ formId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [form] = await db.select().from(formsTable)
        .where(and(eq(formsTable.id, input.formId), eq(formsTable.ownerId, ctx.userId)))
        .limit(1);
      if (!form) throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" });

      const fields = form.fieldsJson as unknown[];
      if (!fields || fields.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot publish a form with no fields" });
      }

      const [updated] = await db.update(formsTable)
        .set({ status: "published", publishedAt: new Date() })
        .where(eq(formsTable.id, input.formId))
        .returning();
      return updated;
    }),

  unpublish: protectedProcedure
    .input(z.object({ formId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [updated] = await db.update(formsTable)
        .set({ status: "draft", publishedAt: null })
        .where(and(eq(formsTable.id, input.formId), eq(formsTable.ownerId, ctx.userId)))
        .returning();
      if (!updated) throw new TRPCError({ code: "NOT_FOUND" });
      return updated;
    }),

  setVisibility: protectedProcedure
    .input(z.object({ formId: z.string().uuid(), visibility: z.enum(["public", "unlisted"]) }))
    .mutation(async ({ ctx, input }) => {
      const [updated] = await db.update(formsTable)
        .set({ visibility: input.visibility })
        .where(and(eq(formsTable.id, input.formId), eq(formsTable.ownerId, ctx.userId)))
        .returning();
      if (!updated) throw new TRPCError({ code: "NOT_FOUND" });
      return updated;
    }),

  archive: protectedProcedure
    .input(z.object({ formId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [updated] = await db.update(formsTable)
        .set({ status: "archived" })
        .where(and(eq(formsTable.id, input.formId), eq(formsTable.ownerId, ctx.userId)))
        .returning();
      if (!updated) throw new TRPCError({ code: "NOT_FOUND" });
      return updated;
    }),

  delete: protectedProcedure
    .input(z.object({ formId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const result = await db.delete(formsTable)
        .where(and(eq(formsTable.id, input.formId), eq(formsTable.ownerId, ctx.userId)))
        .returning();
      if (result.length === 0) throw new TRPCError({ code: "NOT_FOUND" });
      return { success: true };
    }),

  saveDraft: protectedProcedure
    .input(z.object({ formId: z.string(), fields: z.array(z.unknown()), edges: z.array(z.unknown()) }))
    .mutation(async ({ input }) => {
      await cacheDraft(input.formId, { fields: input.fields, edges: input.edges });
      return { success: true };
    }),

  getDraft: protectedProcedure
    .input(z.object({ formId: z.string() }))
    .query(async ({ input }) => {
      return getCachedDraft(input.formId);
    }),

  rename: protectedProcedure
    .input(z.object({ formId: z.string().uuid(), title: z.string().min(1).max(200) }))
    .mutation(async ({ ctx, input }) => {
      const [form] = await db.update(formsTable)
        .set({ title: input.title })
        .where(and(eq(formsTable.id, input.formId), eq(formsTable.ownerId, ctx.userId)))
        .returning();
      if (!form) throw new TRPCError({ code: "NOT_FOUND" });
      return form;
    }),

  duplicate: protectedProcedure
    .input(z.object({ formId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [original] = await db.select().from(formsTable)
        .where(and(eq(formsTable.id, input.formId), eq(formsTable.ownerId, ctx.userId)))
        .limit(1);
      if (!original) throw new TRPCError({ code: "NOT_FOUND" });
      const slug = `${original.slug}-copy-${nanoid(6)}`;
      const [copy] = await db.insert(formsTable).values({
        title: `${original.title} (copy)`,
        slug,
        ownerId: ctx.userId,
        status: "draft",
        visibility: original.visibility,
        fieldsJson: original.fieldsJson,
        settingsJson: original.settingsJson,
      }).returning();
      return copy;
    }),
});
