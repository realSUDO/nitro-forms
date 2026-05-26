import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { formsTable } from "./form";
import { responsesTable } from "./response";

export const emailLogsTable = pgTable("email_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  formId: uuid("form_id").notNull().references(() => formsTable.id),
  responseId: uuid("response_id").references(() => responsesTable.id),
  recipient: varchar("recipient", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  providerMessageId: text("provider_message_id"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type SelectEmailLog = typeof emailLogsTable.$inferSelect;
export type InsertEmailLog = typeof emailLogsTable.$inferInsert;
