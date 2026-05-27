import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../../trpc";

const FIELD_TYPES = ["short_text", "long_text", "email", "number", "single_select", "multi_select", "checkbox", "rating", "date"] as const;

const SYSTEM_PROMPT = `You are NitroForms AI — a strict form field generator. You ONLY output JSON arrays of form fields. You do NOT answer questions, write code, tell stories, or do anything other than generate form fields.

Rules:
- Output ONLY a valid JSON array. No markdown, no explanation, no text before or after.
- Each field: { id: "f1", type, label, required, options?: string[] }
- Valid types: ${FIELD_TYPES.join(", ")}
- For single_select/multi_select: include "options" as flat string array
- Max 12 fields
- Labels must be professional, concise, and relevant to the user's form topic
- If the prompt is unrelated to forms, output a generic contact form
- NEVER include harmful, offensive, illegal, or inappropriate content in labels or options`;

// External guardrails — runs BEFORE the LLM call
const BLOCKED_PATTERNS = [
  /(?<!hackathon.*)(?:hack(?!athon)|exploit|inject|xss|sql.?inject)/i,
  /password.?steal|credit.?card.?num|ssn|social.?security.?number/i,
  /\bbomb\b|weapon|firearm|explosive|poison/i,
  /\bdrug\b(?!store)|narcotic|cocaine|heroin|meth/i,
  /\bkill\b|murder|suicide|self.?harm/i,
  /\bchild\b.*\babuse\b|minor.*exploit|underage.*sex/i,
  /\bporn\b|nude|nsfw|sexual/i,
  /phish|scam.?form|fraud|steal.?data/i,
];

function validatePrompt(prompt: string): { safe: boolean; reason?: string } {
  const lower = prompt.toLowerCase();
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(lower)) {
      return { safe: false, reason: "Prompt contains restricted content. Please describe a legitimate form use case." };
    }
  }
  if (prompt.length < 3) return { safe: false, reason: "Prompt too short" };
  if (prompt.length > 500) return { safe: false, reason: "Prompt too long (max 500 chars)" };
  return { safe: true };
}

export const aiRouter = router({
  generateForm: protectedProcedure
    .input(z.object({ prompt: z.string().min(3).max(500) }))
    .mutation(async ({ ctx, input }) => {
      // External guardrails — before any LLM call
      const check = validatePrompt(input.prompt);
      if (!check.safe) {
        throw new TRPCError({ code: "BAD_REQUEST", message: check.reason });
      }

      // TODO: Re-enable 2 free per account limit for production
      // const [aiCount] = await db.select(...)
      // if (Number(aiCount?.count ?? 0) >= 2) throw ...

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
