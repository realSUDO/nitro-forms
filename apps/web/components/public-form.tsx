"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, Star } from "lucide-react";
import { cn } from "~/lib/utils";
import { trpc } from "~/trpc/client";

export function PublicForm() {
  const params = useParams();
  const slug = params.slug as string;
  const { user } = useUser();
  const { data: form, isLoading, error } = trpc.public.getFormBySlug.useQuery({ slug }, { enabled: !!slug });
  const submitMutation = trpc.public.submitResponse.useMutation();

  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [submitted, setSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [fieldPath, setFieldPath] = useState<string[]>([]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#2b2d31] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-[#5865f2]" size={28} />
          <p className="text-sm text-[#949ba4]">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-[#2b2d31] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 rounded-2xl bg-[#2b2d31] flex items-center justify-center mb-6">
          <img src="/nitro.svg" alt="NitroForms" className="w-10 h-10 opacity-50" />
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
      <div className="min-h-screen bg-[#2b2d31] flex flex-col items-center justify-center text-center px-4">
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
  const settings = form.settings as { edges?: Array<{ source: string; target: string; sourceHandle: string | null }>; requireAuth?: boolean } | null;

  // Gate: require login
  if (settings?.requireAuth && !user) {
    return (
      <div className="min-h-screen bg-[#2b2d31] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-xl font-bold text-[#f2f3f5] mb-2">Login Required</h1>
        <p className="text-sm text-[#949ba4] mb-6">You need to be logged in to submit this form.</p>
        <Link href="/login" className="px-5 py-2 rounded bg-[#5865f2] text-sm text-white hover:bg-[#4752c4] transition-colors">
          Log In
        </Link>
      </div>
    );
  }
  const flowEdges = settings?.edges ?? [];
  const hasFlow = flowEdges.length > 0;

  // Get next field ID following the flow
  function getNextFieldId(currentId: string): string | null {
    const currentField = allFields.find(f => f.id === currentId);
    if (currentField?.type === "condition") {
      if (currentField.conditionConfig?.sourceFieldId) {
        const { sourceFieldId, operator, value } = currentField.conditionConfig;
        const answer = String(answers[sourceFieldId] ?? "");
        let result = false;
        switch (operator) {
          case "equals": result = answer === value; break;
          case "not_equals": result = answer !== value; break;
          case "greater_than": result = Number(answer) > Number(value); break;
          case "less_than": result = Number(answer) < Number(value); break;
          case "contains": result = answer.includes(value); break;
        }
        // "yes" path = sourceHandle is null or "yes", "no" path = sourceHandle is "no"
        if (result) {
          const edge = flowEdges.find(e => e.source === currentId && (e.sourceHandle === "yes" || e.sourceHandle === null));
          return edge?.target ?? null;
        } else {
          const edge = flowEdges.find(e => e.source === currentId && e.sourceHandle === "no");
          return edge?.target ?? null;
        }
      }
      // No condition configured — follow default (null handle) path
      const edge = flowEdges.find(e => e.source === currentId && (e.sourceHandle === null || e.sourceHandle === "yes"));
      return edge?.target ?? null;
    }
    const edge = flowEdges.find(e => e.source === currentId);
    return edge?.target ?? null;
  }

  // Resolve next visible field (skip conditions)
  function resolveNextVisible(fromId: string): string | null {
    let nextId = getNextFieldId(fromId);
    let safety = 20;
    while (nextId && safety-- > 0) {
      const f = allFields.find(x => x.id === nextId);
      if (!f) return null;
      if (f.type !== "condition") return nextId;
      nextId = getNextFieldId(nextId);
    }
    return null;
  }

  // Initialize first field
  const visibleFields = hasFlow ? allFields.filter(f => f.type !== "condition") : allFields.filter(f => f.type !== "condition");
  
  // Get starting field (no incoming edges)
  const startFieldId = hasFlow
    ? (() => { const targets = new Set(flowEdges.map(e => e.target)); return allFields.find(f => !targets.has(f.id))?.id ?? visibleFields[0]?.id; })()
    : visibleFields[0]?.id;

  // Current field based on path
  const currentFieldId = fieldPath.length > 0 ? fieldPath[fieldPath.length - 1] : startFieldId;
  const field = allFields.find(f => f.id === currentFieldId);
  const totalSteps = visibleFields.length;
  const progress = totalSteps > 0 ? ((fieldPath.length + 1) / totalSteps) * 100 : 0;

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
    if (!currentFieldId) return;
    if (hasFlow) {
      const nextId = resolveNextVisible(currentFieldId);
      if (nextId) {
        setFieldPath(p => [...p, nextId]);
      } else {
        handleSubmit();
      }
    } else {
      const idx = visibleFields.findIndex(f => f.id === currentFieldId);
      if (idx < visibleFields.length - 1) {
        setFieldPath(p => [...p, visibleFields[idx + 1]!.id]);
      } else {
        handleSubmit();
      }
    }
  }

  function handleBack() {
    if (fieldPath.length > 0) {
      setFieldPath(p => p.slice(0, -1));
    }
  }

  if (!field) return null;

  return (
    <div className="h-screen flex bg-[#1e1f22] text-[#f2f3f5] overflow-hidden">
      {/* Server rail */}
      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#2b2d31]">
        {/* Channel header */}
        <div className="h-12 shrink-0 flex items-center gap-2 px-4 border-b border-[#1e1f22]">
          <span className="text-[#949ba4]">#</span>
          <span className="text-sm font-semibold">submit-response</span>
          <div className="w-px h-5 bg-[#3f4147] mx-2 hidden sm:block" />
          <span className="text-xs text-[#949ba4] truncate hidden sm:inline">{form.description ?? "Fill out this form"}</span>
        </div>

        {/* Progress */}
        <div className="h-0.5 bg-[#1e1f22]"><div className="h-full bg-[#5865f2] transition-all duration-500" style={{ width: `${progress}%` }} /></div>

        {/* Messages area */}
        <div className="flex-1 flex items-center justify-center overflow-y-auto px-4 py-6">
          <div className="w-full max-w-lg" key={field.id}>
            {/* Title on first step */}
            {fieldPath.length === 0 && (
              <div className="mb-8">
                <p className="text-sm font-semibold text-[#f2f3f5]">{form.title}</p>
                {form.description && <p className="text-xs text-[#949ba4] mt-1">{form.description}</p>}
              </div>
            )}

            {/* Question */}
            <p className="text-base text-[#f2f3f5] mb-4">
              {field.label}
              {field.required && <span className="text-[#ed4245] ml-1">*</span>}
            </p>

            {/* Input based on type */}
            {(field.type === "short_text" || field.type === "email") && (
              <input
                type={field.type === "email" ? "email" : "text"}
                value={(answers[field.id] as string) ?? ""}
                onChange={(e) => setAnswer(e.target.value)}
                autoFocus
                className="w-full bg-[#1e1f22] rounded px-3 py-2.5 text-sm text-[#f2f3f5] placeholder:text-[#4e5058] focus:outline-none"
                placeholder="Type your answer here..."
              />
            )}

            {field.type === "long_text" && (
              <textarea
                value={(answers[field.id] as string) ?? ""}
                onChange={(e) => setAnswer(e.target.value)}
                autoFocus
                rows={4}
                className="w-full bg-[#1e1f22] rounded px-3 py-2.5 text-sm text-[#f2f3f5] placeholder:text-[#4e5058] focus:outline-none resize-none"
                placeholder="Type your answer here..."
              />
            )}

            {field.type === "number" && (
              <input
                type="number"
                value={(answers[field.id] as string) ?? ""}
                onChange={(e) => setAnswer(Number(e.target.value))}
                autoFocus
                className="w-full bg-[#1e1f22] rounded px-3 py-2.5 text-sm text-[#f2f3f5] placeholder:text-[#4e5058] focus:outline-none"
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
            {submitMutation.error && !Object.keys(fieldErrors).length && (
              <p className="text-sm text-red-400 mt-3">{submitMutation.error.message}</p>
            )}

          {/* Navigation */}
          <div className="flex items-center gap-3 mt-8">
            {fieldPath.length > 0 && (
              <button onClick={handleBack} className="px-4 py-2 rounded text-sm text-[#b5bac1] hover:text-[#f2f3f5] transition-colors">
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={submitMutation.isPending}
              className="px-5 py-2 rounded bg-[#5865f2] text-sm text-white hover:bg-[#4752c4] transition-colors disabled:opacity-50"
            >
              {submitMutation.isPending ? "..." : (() => {
                const isLast = hasFlow ? !resolveNextVisible(currentFieldId!) : visibleFields.findIndex(f => f.id === currentFieldId) >= visibleFields.length - 1;
                return isLast ? "Submit" : "Next";
              })()}
            </button>
            <span className="ml-auto text-[11px] text-[#4e5058]">{fieldPath.length + 1}/{totalSteps}</span>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
