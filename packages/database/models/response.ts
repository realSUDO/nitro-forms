import { pgTable, uuid, varchar, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { formsTable } from "./form";

export const responsesTable = pgTable("responses", {
  id: uuid("id").primaryKey().defaultRandom(),
  formId: uuid("form_id").notNull().references(() => formsTable.id),
  respondentEmail: varchar("respondent_email", { length: 255 }),
  answersJson: jsonb("answers_json").notNull().default({}),
  metadataJson: jsonb("metadata_json").default({}),
  submittedAt: timestamp("submitted_at").defaultNow(),
}, (table) => [
  index("responses_form_id_idx").on(table.formId),
  index("responses_submitted_at_idx").on(table.submittedAt),
]);

export type SelectResponse = typeof responsesTable.$inferSelect;
export type InsertResponse = typeof responsesTable.$inferInsert;
