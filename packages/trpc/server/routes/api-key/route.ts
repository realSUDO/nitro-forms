import { z } from "zod";
import { TRPCError } from "@trpc/server";
import crypto from "crypto";
import { protectedProcedure, router } from "../../trpc";
import db, { eq, and } from "@repo/database";
import { apiKeysTable } from "@repo/database/schema";

export const apiKeyRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const keys = await db.select({ id: apiKeysTable.id, name: apiKeysTable.name, key: apiKeysTable.key, active: apiKeysTable.active, createdAt: apiKeysTable.createdAt, lastUsedAt: apiKeysTable.lastUsedAt })
      .from(apiKeysTable)
      .where(eq(apiKeysTable.ownerId, ctx.userId));
    return keys.map((k) => ({ ...k, key: k.key.slice(0, 8) + "..." }));
  }),

  generate: protectedProcedure
    .input(z.object({ name: z.string().max(100).default("Default") }))
    .mutation(async ({ ctx, input }) => {
      const key = `nitro_sk_${crypto.randomBytes(24).toString("hex")}`;
      const hashedKey = crypto.createHash("sha256").update(key).digest("hex");
      const [row] = await db.insert(apiKeysTable).values({ ownerId: ctx.userId, name: input.name, key: hashedKey }).returning();
      return { ...row!, key };
    }),

  revoke: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [row] = await db.update(apiKeysTable)
        .set({ active: false })
        .where(and(eq(apiKeysTable.id, input.id), eq(apiKeysTable.ownerId, ctx.userId)))
        .returning();
      if (!row) throw new TRPCError({ code: "NOT_FOUND" });
      return row;
    }),
});
