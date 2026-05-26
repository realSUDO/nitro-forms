import { z } from "zod";
import { protectedProcedure, router } from "../../trpc";
import db, { eq } from "@repo/database";
import { usersTable } from "@repo/database/schema";

export const userRouter = router({
  syncUser: protectedProcedure
    .input(z.object({
      email: z.string().email(),
      fullName: z.string().min(1),
      avatarUrl: z.string().nullable().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const existing = await db.select().from(usersTable).where(eq(usersTable.id, ctx.userId)).limit(1);

      if (existing.length > 0) {
        await db.update(usersTable)
          .set({ fullName: input.fullName, avatarUrl: input.avatarUrl ?? null })
          .where(eq(usersTable.id, ctx.userId));
        return existing[0];
      }

      const [user] = await db.insert(usersTable).values({
        id: ctx.userId,
        email: input.email,
        fullName: input.fullName,
        passwordHash: "clerk_managed",
        avatarUrl: input.avatarUrl ?? null,
      }).returning();

      return user;
    }),

  me: protectedProcedure.query(async ({ ctx }) => {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, ctx.userId)).limit(1);
    return user ?? null;
  }),
});
