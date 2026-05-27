import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../../trpc";
import db, { eq, sql } from "@repo/database";
import { formsTable } from "@repo/database/schema";

const FIELD_TYPES = ["short_text", "long_text", "email", "number", "single_select", "multi_select", "checkbox", "rating", "date"] as const;

const SYSTEM_PROMPT = `You are a form builder AI. Given a user prompt, generate a JSON array of form fields.
Each field must have: id (f1, f2, etc), type (one of: ${FIELD_TYPES.join(", ")}), label (string), required (boolean).
For single_select/multi_select, include "options" array of strings.
For rating, no extra fields needed.
Return ONLY valid JSON array, no markdown, no explanation.
Max 12 fields. Keep labels concise and professional.
Do NOT generate anything harmful, offensive, or unrelated to forms.`;

const BLOCKED_TERMS = ["hack", "exploit", "password", "credit card", "ssn", "social security", "bomb", "weapon", "drug"];

export const aiRouter = router({
  generateForm: protectedProcedure
    .input(z.object({ prompt: z.string().min(3).max(500) }))
    .mutation(async ({ ctx, input }) => {
      // Guardrail: block harmful prompts
      const lower = input.prompt.toLowerCase();
      if (BLOCKED_TERMS.some(t => lower.includes(t))) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Prompt contains blocked content" });
      }

      // Rate limit: 2 free AI generations per account
      const [countResult] = await db.select({ count: sql<number>`count(*)` })
        .from(formsTable)
        .where(eq(formsTable.ownerId, ctx.userId));
      const formCount = Number(countResult?.count ?? 0);
      
      // Check AI usage (stored in a simple way — count forms with ai_generated in settings)
      const [aiCount] = await db.select({ count: sql<number>`count(*)` })
        .from(formsTable)
        .where(sql`${formsTable.ownerId} = ${ctx.userId} AND ${formsTable.settingsJson}->>'aiGenerated' = 'true'`);
      
      if (Number(aiCount?.count ?? 0) >= 2) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Free AI generation limit reached (2/2). Upgrade to Pro for unlimited." });
      }

      // Call Groq (Llama 3.1)
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) {
        return generateFallback(input.prompt);
      }

      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: input.prompt },
            ],
            temperature: 0.7,
          }),
        });
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content?.trim() ?? "";
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) throw new Error("No JSON");
        const fields = JSON.parse(jsonMatch[0]);
        const validated = fields.slice(0, 12).map((f: any, i: number) => ({
          id: f.id || `f${i + 1}`,
          type: FIELD_TYPES.includes(f.type) ? f.type : "short_text",
          label: String(f.label || "Field").slice(0, 100),
          required: Boolean(f.required),
          ...(f.options ? { options: (Array.isArray(f.options) ? f.options : []).slice(0, 10).map((o: any) => typeof o === "string" ? o : o.label ?? o.value ?? String(o)) } : {}),
        }));
        return { fields: validated, source: "ai" };
      } catch {
        return generateFallback(input.prompt);
      }
    }),
});

function generateFallback(prompt: string) {
  // Smart template based on keywords
  const lower = prompt.toLowerCase();
  let fields: any[];

  if (lower.includes("feedback") || lower.includes("review")) {
    fields = [
      { id: "f1", type: "short_text", label: "Your Name", required: true },
      { id: "f2", type: "email", label: "Email", required: true },
      { id: "f3", type: "rating", label: "Overall Rating", required: true },
      { id: "f4", type: "single_select", label: "Category", required: true, options: ["Product", "Service", "Support", "Other"] },
      { id: "f5", type: "long_text", label: "Comments", required: false },
    ];
  } else if (lower.includes("signup") || lower.includes("register")) {
    fields = [
      { id: "f1", type: "short_text", label: "Full Name", required: true },
      { id: "f2", type: "email", label: "Email Address", required: true },
      { id: "f3", type: "single_select", label: "Role", required: true, options: ["Developer", "Designer", "Manager", "Student", "Other"] },
      { id: "f4", type: "short_text", label: "Company/Organization", required: false },
      { id: "f5", type: "checkbox", label: "Agree to Terms", required: true },
    ];
  } else if (lower.includes("survey") || lower.includes("poll")) {
    fields = [
      { id: "f1", type: "short_text", label: "Name", required: false },
      { id: "f2", type: "single_select", label: "How did you hear about us?", required: true, options: ["Social Media", "Friend", "Search", "Ad", "Other"] },
      { id: "f3", type: "rating", label: "Satisfaction", required: true },
      { id: "f4", type: "multi_select", label: "What do you like?", required: false, options: ["Speed", "Design", "Features", "Price", "Support"] },
      { id: "f5", type: "long_text", label: "Suggestions", required: false },
    ];
  } else if (lower.includes("event") || lower.includes("rsvp")) {
    fields = [
      { id: "f1", type: "short_text", label: "Name", required: true },
      { id: "f2", type: "email", label: "Email", required: true },
      { id: "f3", type: "number", label: "Number of Guests", required: true },
      { id: "f4", type: "single_select", label: "Attending?", required: true, options: ["Yes", "No", "Maybe"] },
      { id: "f5", type: "long_text", label: "Dietary Requirements", required: false },
    ];
  } else {
    fields = [
      { id: "f1", type: "short_text", label: "Name", required: true },
      { id: "f2", type: "email", label: "Email", required: true },
      { id: "f3", type: "long_text", label: "Message", required: true },
      { id: "f4", type: "rating", label: "Rating", required: false },
    ];
  }

  return { fields, source: "template" };
}
