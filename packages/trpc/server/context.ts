import { verifyToken } from "@clerk/backend";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

export async function createContext({ req }: CreateExpressContextOptions) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return { userId: null, clerkUserId: null };
  }

  try {
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY || "",
    });
    return { userId: payload.sub, clerkUserId: payload.sub };
  } catch {
    return { userId: null, clerkUserId: null };
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>;
