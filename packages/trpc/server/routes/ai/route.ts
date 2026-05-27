import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../../trpc";

const FIELD_TYPES = ["short_text", "long_text", "email", "number", "single_select", "multi_select", "checkbox", "rating", "date"] as const;

const SYSTEM_PROMPT = `You are NitroForms AI — an expert form builder. Generate complete form structures.

OUTPUT: Return ONLY a valid JSON object:
{
  "title": "Descriptive Form Title",
  "fields": [...],
  "edges": [...]
}

FIELD TYPES: ${FIELD_TYPES.join(", ")}
Plus "condition" for IF/ELSE branching.

FIELD FORMAT:
{ "id": "f1", "type": "short_text", "label": "What is your full name?", "required": true }
{ "id": "f2", "type": "single_select", "label": "Which category?", "required": true, "options": ["A", "B", "C"] }
{ "id": "c1", "type": "condition", "label": "Route by category", "required": false, "conditionConfig": { "sourceFieldId": "f2", "operator": "equals", "value": "A" } }

CONDITION RULES:
- conditionConfig.sourceFieldId MUST reference an earlier field's id
- operators: equals, not_equals, contains, greater_than, less_than
- value: the answer to compare against (for select fields, must be one of the options)

EDGES (connections):
- Normal: { "source": "f1", "target": "f2", "sourceHandle": null }
- From condition YES: { "source": "c1", "target": "f3", "sourceHandle": "yes" }
- From condition NO: { "source": "c1", "target": "f4", "sourceHandle": "no" }
- Every field must be connected. The first field has no incoming edge.
- A condition node receives one incoming edge and outputs two (yes/no).

GUIDELINES:
- 4-10 fields total
- Use descriptive multi-word labels (not "Name" but "What is your full name?")
- Use conditions ONLY when the topic naturally branches (e.g. "Are you a student?" → yes path asks school, no path asks company)
- For single_select/multi_select: 3-6 realistic options
- Title should be engaging and specific
- ONLY output the JSON object, nothing else

EXAMPLE (branching form with convergence):
User: "Ask if they're a member. If yes, ask member ID. If no, ask email. Then ask feedback from both."
{
  "title": "Membership Feedback",
  "fields": [
    {"id": "f1", "type": "short_text", "label": "What is your name?", "required": true},
    {"id": "f2", "type": "single_select", "label": "Are you an existing member?", "required": true, "options": ["Yes", "No"]},
    {"id": "c1", "type": "condition", "label": "Check membership", "required": false, "conditionConfig": {"sourceFieldId": "f2", "operator": "equals", "value": "Yes"}},
    {"id": "f3", "type": "short_text", "label": "Enter your Member ID", "required": true},
    {"id": "f4", "type": "email", "label": "Enter your email address", "required": true},
    {"id": "f5", "type": "long_text", "label": "Share your feedback with us", "required": true}
  ],
  "edges": [
    {"source": "f1", "target": "f2", "sourceHandle": null},
    {"source": "f2", "target": "c1", "sourceHandle": null},
    {"source": "c1", "target": "f3", "sourceHandle": "yes"},
    {"source": "c1", "target": "f4", "sourceHandle": "no"},
    {"source": "f3", "target": "f5", "sourceHandle": null},
    {"source": "f4", "target": "f5", "sourceHandle": null}
  ]
}
Note: Both yes/no paths converge to f5. This is how branching works — after separate paths, connect both back to a shared ending field.`;

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
            model: "llama-3.1-70b-versatile",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: input.prompt },
            ],
            temperature: 0.7,
          }),
        });
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content?.trim() ?? "";
        // Parse — could be {title, fields, edges} or just [fields]
        const jsonMatch = text.match(/\{[\s\S]*\}/) ?? text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) throw new Error("No JSON");
        const parsed = JSON.parse(jsonMatch[0]);
        const rawFields = Array.isArray(parsed) ? parsed : (parsed.fields ?? []);
        const title = parsed.title ?? null;
        const edges = parsed.edges ?? [];

        const validated = rawFields.slice(0, 12).map((f: any, i: number) => ({
          id: f.id || `f${i + 1}`,
          type: [...FIELD_TYPES, "condition"].includes(f.type) ? f.type : "short_text",
          label: String(f.label || "Field").slice(0, 100),
          required: Boolean(f.required),
          ...(f.options ? { options: (Array.isArray(f.options) ? f.options : []).slice(0, 10).map((o: any) => typeof o === "string" ? o : (o.label ?? o.value ?? o.id ?? String(o))) } : {}),
          ...(f.conditionConfig ? { conditionConfig: f.conditionConfig } : {}),
        }));

        // Validate edges — normalize from/to to source/target
        const fieldIds = new Set(validated.map((f: any) => f.id));
        const rawEdges = (edges as any[]).map((e: any) => ({
          source: e.source ?? e.from,
          target: e.target ?? e.to,
          sourceHandle: e.sourceHandle ?? null,
        }));
        const validEdges = rawEdges.filter((e: any) => fieldIds.has(e.source) && fieldIds.has(e.target));

        // If AI didn't generate proper edges, auto-connect sequentially
        const finalEdges = validEdges.length > 0 ? validEdges : validated.slice(1).map((f: any, i: number) => ({
          source: validated[i].id, target: f.id, sourceHandle: null,
        }));

        return { fields: validated, edges: finalEdges, title, source: "ai" };
      } catch {
        return generateFallback(input.prompt);
      }
    }),
});

function generateFallback(prompt: string) {
  const lower = prompt.toLowerCase();
  let fields: any[];
  let title: string;

  if (lower.includes("feedback") || lower.includes("review")) {
    title = "Customer Feedback Form";
    fields = [
      { id: "f1", type: "short_text", label: "Your Full Name", required: true },
      { id: "f2", type: "email", label: "Email Address", required: true },
      { id: "f3", type: "rating", label: "How would you rate your experience?", required: true },
      { id: "f4", type: "single_select", label: "What area are you providing feedback on?", required: true, options: ["Product", "Service", "Support", "Pricing", "Other"] },
      { id: "f5", type: "long_text", label: "Tell us more about your experience", required: false },
    ];
  } else if (lower.includes("signup") || lower.includes("register") || lower.includes("hackathon")) {
    title = "Registration Form";
    fields = [
      { id: "f1", type: "short_text", label: "Full Name", required: true },
      { id: "f2", type: "email", label: "Email Address", required: true },
      { id: "f3", type: "single_select", label: "What best describes your role?", required: true, options: ["Developer", "Designer", "Manager", "Student", "Other"] },
      { id: "f4", type: "short_text", label: "Organization / Company", required: false },
      { id: "f5", type: "checkbox", label: "I agree to the terms and conditions", required: true },
    ];
  } else if (lower.includes("survey") || lower.includes("poll")) {
    title = "Community Survey";
    fields = [
      { id: "f1", type: "short_text", label: "Your Name (optional)", required: false },
      { id: "f2", type: "single_select", label: "How did you discover us?", required: true, options: ["Social Media", "Friend/Colleague", "Search Engine", "Advertisement", "Other"] },
      { id: "f3", type: "rating", label: "Overall satisfaction with our service", required: true },
      { id: "f4", type: "multi_select", label: "Which features do you value most?", required: false, options: ["Speed", "Design", "Features", "Price", "Support"] },
      { id: "f5", type: "long_text", label: "Any suggestions for improvement?", required: false },
    ];
  } else if (lower.includes("event") || lower.includes("rsvp")) {
    title = "Event RSVP";
    fields = [
      { id: "f1", type: "short_text", label: "Full Name", required: true },
      { id: "f2", type: "email", label: "Email Address", required: true },
      { id: "f3", type: "number", label: "Number of Guests", required: true },
      { id: "f4", type: "single_select", label: "Will you be attending?", required: true, options: ["Yes, definitely", "No, can't make it", "Maybe, not sure yet"] },
      { id: "f5", type: "long_text", label: "Dietary requirements or special needs", required: false },
    ];
  } else {
    title = "Contact Form";
    fields = [
      { id: "f1", type: "short_text", label: "Your Name", required: true },
      { id: "f2", type: "email", label: "Email Address", required: true },
      { id: "f3", type: "single_select", label: "What is this regarding?", required: true, options: ["General Inquiry", "Support", "Partnership", "Feedback", "Other"] },
      { id: "f4", type: "long_text", label: "Your Message", required: true },
      { id: "f5", type: "rating", label: "How urgent is this?", required: false },
    ];
  }

  // Auto-generate sequential edges
  const edges = fields.slice(1).map((f, i) => ({ source: fields[i]!.id, target: f.id, sourceHandle: null }));
  return { fields, edges, title, source: "template" as const };
}
