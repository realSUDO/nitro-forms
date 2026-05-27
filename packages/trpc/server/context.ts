import { verifyToken } from "@clerk/backend";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import db, { eq } from "@repo/database";
import { usersTable } from "@repo/database/schema";

export async function createContext({ req }: CreateExpressContextOptions) {
  const ip = (req.headers["x-forwarded-for"] as string) || req.socket?.remoteAddress || "unknown";
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return { userId: null, clerkUserId: null, ip };
  }

  try {
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY || "",
    });

    const userId = payload.sub;

    // Auto-create user in DB if not exists
    const [existing] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
    if (!existing) {
      await db.insert(usersTable).values({
        id: userId,
        fullName: (payload as any).name || "NitroForms User",
        email: (payload as any).email || `${userId}@clerk.user`,
        passwordHash: "clerk_managed",
      }).onConflictDoNothing();
    }

    return { userId, clerkUserId: userId, ip };
  } catch (err: any) {
    return { userId: null, clerkUserId: null, ip };
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>;
