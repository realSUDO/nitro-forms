import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

export const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
});

redis.on("error", (err) => {
  console.warn("[Redis] connection error (falling back to DB):", err.message);
});

// Form draft cache helpers
const DRAFT_PREFIX = "form_draft:";
const DRAFT_TTL = 3600; // 1 hour

export async function cacheDraft(formId: string, data: { fields: unknown[]; edges: unknown[] }) {
  try {
    await redis.set(`${DRAFT_PREFIX}${formId}`, JSON.stringify(data), "EX", DRAFT_TTL);
  } catch { /* silent fail — DB is source of truth */ }
}

export async function getCachedDraft(formId: string): Promise<{ fields: unknown[]; edges: unknown[] } | null> {
  try {
    const raw = await redis.get(`${DRAFT_PREFIX}${formId}`);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export async function clearDraftCache(formId: string) {
  try { await redis.del(`${DRAFT_PREFIX}${formId}`); } catch { /* noop */ }
}

// Rate limiter using Redis (replaces in-memory)
export async function checkRateLimitRedis(key: string, maxRequests = 10, windowSec = 600): Promise<boolean | null> {
  try {
    const current = await redis.incr(key);
    if (current === 1) await redis.expire(key, windowSec);
    return current <= maxRequests;
  } catch {
    return null; // fall through to in-memory
  }
}

// In-memory rate limit cleanup — clear expired entries every 60s
export const rateLimitMemoryStore = new Map<string, number[]>();

setInterval(() => {
  const now = Date.now();
  for (const [key, timestamps] of rateLimitMemoryStore) {
    const valid = timestamps.filter((t) => now - t < 600000);
    if (valid.length === 0) rateLimitMemoryStore.delete(key);
    else rateLimitMemoryStore.set(key, valid);
  }
}, 60000);
