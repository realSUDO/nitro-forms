import { pgTable, varchar, timestamp, text, uuid, boolean } from "drizzle-orm/pg-core";

export const apiKeysTable = pgTable("api_keys", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: text("owner_id").notNull(),
  name: varchar("name", { length: 100 }).notNull().default("Default"),
  key: text("key").notNull().unique(), // nitro_sk_xxxxx
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  lastUsedAt: timestamp("last_used_at"),
});

export type SelectApiKey = typeof apiKeysTable.$inferSelect;
export type InsertApiKey = typeof apiKeysTable.$inferInsert;
