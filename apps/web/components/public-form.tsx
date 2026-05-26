"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, Star, Zap } from "lucide-react";
import { cn } from "~/lib/utils";
import { trpc } from "~/trpc/client";

export function PublicForm() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: form, isLoading, error } = trpc.public.getFormBySlug.useQuery({ slug }, { enabled: !!slug });
  const submitMutation = trpc.public.submitResponse.useMutation();

  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1e1f22] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-[#5865f2]" size={28} />
          <p className="text-sm text-[#949ba4]">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-[#1e1f22] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 rounded-2xl bg-[#2b2d31] flex items-center justify-center mb-6">
          <Zap size={32} className="text-[#4e5058]" />
        </div>
        <h1 className="text-2xl font-bold text-[#f2f3f5] mb-2">Form Not Available</h1>
        <p className="text-sm text-[#949ba4] mb-8 max-w-sm">{error?.message ?? "This form is not published or does not exist."}</p>
        <Link href="/" className="px-6 py-2.5 rounded-lg bg-[#5865f2] text-sm font-medium text-white hover:bg-[#4752c4] transition-colors">
          Back to Homepage
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#1e1f22] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 rounded-2xl bg-[#5865f2]/10 flex items-center justify-center mb-6 animate-in zoom-in duration-300">
          <CheckCircle size={40} className="text-[#5865f2]" />
        </div>
        <h1 className="text-3xl font-bold text-[#f2f3f5] mb-3">Thank you!</h1>
        <p className="text-base text-[#949ba4] mb-8 max-w-sm">Your response has been submitted successfully. We appreciate your time.</p>
        <Link href="/" className="px-6 py-2.5 rounded-lg border border-[#3f4147] text-sm text-[#b5bac1] hover:bg-[#2b2d31] transition-colors">
          Back to Homepage
        </Link>
      </div>
    );
  }

  const allFields = form.fields as Array<{ id: string; type: string; label: string; required: boolean; placeholder?: string; options?: string[]; conditionConfig?: { sourceFieldId: string; operator: string; value: string } }>;
  const settings = form.settings as { edges?: Array<{ source: string; target: string; sourceHandle: string | null }> } | null;
  const flowEdges = settings?.edges ?? [];

  // Build the flow order by following edges from the first node
  function getNextFieldId(currentId: string): string | null {
    const currentField = allFields.find(f => f.id === currentId);

    // If current is a condition, evaluate it
    if (currentField?.type === "condition" && currentField.conditionConfig) {
      const { sourceFieldId, operator, value } = currentField.conditionConfig;
      const answer = String(answers[sourceFieldId] ?? "");
      let result = false;
      switch (operator) {
        case "equals": result = answer === value; break;
        case "not_equals": result = answer !== value; break;
        case "greater_than": result = Number(answer) > Number(value); break;
        case "less_than": result = Number(answer) < Number(value); break;
        case "contains": result = answer.includes(value); break;
        default: result = answer === value;
      }
      // Follow yes or no handle
      const handle = result ? "yes" : "no";
      const edge = flowEdges.find(e => e.source === currentId && e.sourceHandle === handle);
      return edge?.target ?? null;
    }

    // Normal field — follow the single outgoing edge
    const edge = flowEdges.find(e => e.source === currentId);
    return edge?.target ?? null;
  }

  // Build visible field sequence by following the flow
  function buildFieldSequence(): typeof allFields {
    if (flowEdges.length === 0) {
      // No flow defined — show all non-condition fields in order
      return allFields.filter(f => f.type !== "condition");
    }
    // Find the starting node (one with no incoming edge)
    const targets = new Set(flowEdges.map(e => e.target));
    const startField = allFields.find(f => !targets.has(f.id)) ?? allFields[0];
    if (!startField) return [];

    const sequence: typeof allFields = [];
    let currentId: string | null = startField.id;
    const visited = new Set<string>();

    while (currentId && !visited.has(currentId)) {
      visited.add(currentId);
      const field = allFields.find(f => f.id === currentId);
      if (!field) break;

      if (field.type === "condition") {
        // Evaluate and skip to next
        currentId = getNextFieldId(currentId);
      } else {
        sequence.push(field);
        currentId = getNextFieldId(currentId);
      }
    }
    return sequence;
  }

  const fields = buildFieldSequence();
  const totalSteps = fields.length;
  const field = fields[currentStep];
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  function setAnswer(value: unknown) {
    if (field) setAnswers(a => ({ ...a, [field.id]: value }));
  }

  async function handleSubmit() {
    setFieldErrors({});
    try {
      await submitMutation.mutateAsync({ slug, answers: answers as Record<string, unknown> });
      setSubmitted(true);
    } catch (e: any) {
      if (e?.data?.cause) setFieldErrors(e.data.cause as Record<string, string>);
    }
  }

  function handleNext() {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(s => s + 1);
    } else {
      handleSubmit();
    }
  }

  function handleBack() {
    if (currentStep > 0) setCurrentStep(s => s - 1);
  }

  if (!field) return null;

  return (
    <div className="min-h-screen bg-[#1e1f22] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 h-14 shrink-0">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-[#5865f2]" />
          <span className="text-sm font-semibold text-[#f2f3f5]">NitroForms</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-[#949ba4]">
            {currentStep + 1} / {totalSteps}
          </span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-[#2b2d31]">
        <div className="h-full bg-[#5865f2] transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>

      {/* Form content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          {/* Form title (only on first step) */}
          {currentStep === 0 && (
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-[#f2f3f5] mb-2">{form.title}</h1>
              {form.description && <p className="text-sm text-[#949ba4]">{form.description}</p>}
            </div>
          )}

          {/* Current field */}
          <div className="animate-in fade-in slide-in-from-right-4 duration-300" key={field.id}>
            <label className="block text-lg font-semibold text-[#f2f3f5] mb-1">
              {field.label}
              {field.required && <span className="text-[#5865f2] ml-1">*</span>}
            </label>
            {field.placeholder && <p className="text-sm text-[#949ba4] mb-4">{field.placeholder}</p>}
            {!field.placeholder && <div className="mb-4" />}

            {/* Input based on type */}
            {(field.type === "short_text" || field.type === "email") && (
              <input
                type={field.type === "email" ? "email" : "text"}
                value={(answers[field.id] as string) ?? ""}
                onChange={(e) => setAnswer(e.target.value)}
                autoFocus
                className="w-full bg-transparent border-b-2 border-[#3f4147] focus:border-[#5865f2] px-0 py-3 text-lg text-[#f2f3f5] placeholder:text-[#4e5058] focus:outline-none transition-colors"
                placeholder="Type your answer here..."
              />
            )}

            {field.type === "long_text" && (
              <textarea
                value={(answers[field.id] as string) ?? ""}
                onChange={(e) => setAnswer(e.target.value)}
                autoFocus
                rows={4}
                className="w-full bg-transparent border-b-2 border-[#3f4147] focus:border-[#5865f2] px-0 py-3 text-lg text-[#f2f3f5] placeholder:text-[#4e5058] focus:outline-none transition-colors resize-none"
                placeholder="Type your answer here..."
              />
            )}

            {field.type === "number" && (
              <input
                type="number"
                value={(answers[field.id] as string) ?? ""}
                onChange={(e) => setAnswer(Number(e.target.value))}
                autoFocus
                className="w-full bg-transparent border-b-2 border-[#3f4147] focus:border-[#5865f2] px-0 py-3 text-lg text-[#f2f3f5] placeholder:text-[#4e5058] focus:outline-none transition-colors"
                placeholder="0"
              />
            )}

            {field.type === "single_select" && field.options && (
              <div className="space-y-2 mt-2">
                {field.options.map((opt, i) => (
                  <button
                    key={opt}
                    onClick={() => setAnswer(opt)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all",
                      answers[field.id] === opt
                        ? "border-[#5865f2] bg-[#5865f2]/10 text-[#f2f3f5]"
                        : "border-[#3f4147] text-[#b5bac1] hover:border-[#4e5058] hover:bg-[#2b2d31]"
                    )}
                  >
                    <span className={cn(
                      "w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0",
                      answers[field.id] === opt ? "bg-[#5865f2] text-white" : "bg-[#2b2d31] text-[#949ba4]"
                    )}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-sm">{opt}</span>
                  </button>
                ))}
              </div>
            )}

            {field.type === "multi_select" && field.options && (
              <div className="space-y-2 mt-2">
                {field.options.map((opt, i) => {
                  const selected = ((answers[field.id] as string[]) ?? []).includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => {
                        const current = (answers[field.id] as string[]) ?? [];
                        setAnswer(selected ? current.filter(v => v !== opt) : [...current, opt]);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all",
                        selected
                          ? "border-[#5865f2] bg-[#5865f2]/10 text-[#f2f3f5]"
                          : "border-[#3f4147] text-[#b5bac1] hover:border-[#4e5058] hover:bg-[#2b2d31]"
                      )}
                    >
                      <span className={cn(
                        "w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0",
                        selected ? "bg-[#5865f2] text-white" : "bg-[#2b2d31] text-[#949ba4]"
                      )}>
                        {selected ? "✓" : String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-sm">{opt}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {field.type === "rating" && (
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => setAnswer(n)}
                    className="group transition-transform hover:scale-110"
                  >
                    <Star
                      size={32}
                      className={cn(
                        "transition-colors",
                        (answers[field.id] as number) >= n
                          ? "text-[#5865f2] fill-[#5865f2]"
                          : "text-[#3f4147] group-hover:text-[#4e5058]"
                      )}
                    />
                  </button>
                ))}
              </div>
            )}

            {field.type === "checkbox" && (
              <label className="flex items-center gap-3 mt-2 cursor-pointer group">
                <div className={cn(
                  "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors",
                  answers[field.id] ? "bg-[#5865f2] border-[#5865f2]" : "border-[#3f4147] group-hover:border-[#4e5058]"
                )}>
                  {!!answers[field.id] && <CheckCircle size={14} className="text-white" />}
                </div>
                <span className="text-sm text-[#b5bac1]">Yes, I agree</span>
              </label>
            )}

            {field.type === "date" && (
              <input
                type="date"
                value={(answers[field.id] as string) ?? ""}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full bg-transparent border-b-2 border-[#3f4147] focus:border-[#5865f2] px-0 py-3 text-lg text-[#f2f3f5] focus:outline-none transition-colors"
              />
            )}

            {fieldErrors[field.id] && (
              <p className="text-sm text-red-400 mt-3">{fieldErrors[field.id]}</p>
            )}
            {submitMutation.error && currentStep === totalSteps - 1 && !Object.keys(fieldErrors).length && (
              <p className="text-sm text-red-400 mt-3">{submitMutation.error.message}</p>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-[#949ba4] hover:text-[#f2f3f5] hover:bg-[#2b2d31] transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button
              onClick={handleNext}
              disabled={submitMutation.isPending}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#5865f2] text-sm font-medium text-white hover:bg-[#4752c4] transition-colors disabled:opacity-50"
            >
              {submitMutation.isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : currentStep === totalSteps - 1 ? (
                <>Submit <CheckCircle size={16} /></>
              ) : (
                <>Next <ArrowRight size={16} /></>
              )}
            </button>
          </div>

          {/* Keyboard hint */}
          <p className="text-center text-[10px] text-[#4e5058] mt-6">
            Press <kbd className="px-1.5 py-0.5 rounded bg-[#2b2d31] text-[#949ba4] font-mono">Enter ↵</kbd> to continue
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-center py-4 text-[11px] text-[#4e5058]">
        <span className="flex items-center gap-1.5">Powered by <Zap size={10} className="text-[#5865f2]" /> <span className="text-[#949ba4]">NitroForms</span></span>
      </footer>
    </div>
  );
}
