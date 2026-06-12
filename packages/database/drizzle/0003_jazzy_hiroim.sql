ALTER TABLE "responses" DROP CONSTRAINT "responses_form_id_forms_id_fk";
--> statement-breakpoint
ALTER TABLE "form_events" DROP CONSTRAINT "form_events_form_id_forms_id_fk";
--> statement-breakpoint
ALTER TABLE "email_logs" DROP CONSTRAINT "email_logs_form_id_forms_id_fk";
--> statement-breakpoint
ALTER TABLE "email_logs" DROP CONSTRAINT "email_logs_response_id_responses_id_fk";
--> statement-breakpoint
ALTER TABLE "responses" ADD CONSTRAINT "responses_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_events" ADD CONSTRAINT "form_events_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_response_id_responses_id_fk" FOREIGN KEY ("response_id") REFERENCES "public"."responses"("id") ON DELETE cascade ON UPDATE no action;