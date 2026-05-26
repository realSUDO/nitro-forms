import { pgTable, uuid, varchar, text, timestamp, integer, jsonb, pgEnum, index } from "drizzle-orm/pg-core";
import { usersTable } from "./user";
import { themesTable } from "./theme";

export const formStatusEnum = pgEnum("form_status", ["draft", "published", "archived"]);
export const formVisibilityEnum = pgEnum("form_visibility", ["public", "unlisted"]);

export const formsTable = pgTable("forms", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerId: uuid("owner_id").notNull().references(() => usersTable.id),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  status: formStatusEnum("status").notNull().default("draft"),
  visibility: formVisibilityEnum("visibility").notNull().default("public"),
  themeId: uuid("theme_id").references(() => themesTable.id),
  fieldsJson: jsonb("fields_json").notNull().default([]),
  settingsJson: jsonb("settings_json").notNull().default({}),
  responseLimit: integer("response_limit"),
  expiresAt: timestamp("expires_at"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
}, (table) => [
  index("forms_owner_id_idx").on(table.ownerId),
  index("forms_slug_idx").on(table.slug),
  index("forms_status_visibility_idx").on(table.status, table.visibility),
]);

export type SelectForm = typeof formsTable.$inferSelect;
export type InsertForm = typeof formsTable.$inferInsert;
