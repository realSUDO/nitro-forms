import { pgTable, uuid, varchar, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { formsTable } from "./form";

export const formEventsTable = pgTable("form_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  formId: uuid("form_id").notNull().references(() => formsTable.id),
  eventType: varchar("event_type", { length: 50 }).notNull(),
  fieldId: varchar("field_id", { length: 100 }),
  metadataJson: jsonb("metadata_json"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("form_events_form_id_type_idx").on(table.formId, table.eventType),
  index("form_events_created_at_idx").on(table.createdAt),
]);

export type SelectFormEvent = typeof formEventsTable.$inferSelect;
export type InsertFormEvent = typeof formEventsTable.$inferInsert;
