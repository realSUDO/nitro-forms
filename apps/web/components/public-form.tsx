"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, Star } from "lucide-react";
import { cn } from "~/lib/utils";
import { trpc } from "~/trpc/client";
import { BotSvg } from "~/components/bot-svg";

export function PublicForm({ previewForm, previewAnswers, readOnly }: { previewForm?: any; previewAnswers?: Record<string, unknown>; readOnly?: boolean } = {}) {
  const params = useParams();
  const slug = params?.slug as string | undefined;
  const { user } = useUser();
  const { data: fetchedForm, isLoading, error } = trpc.public.getFormBySlug.useQuery({ slug: slug! }, { enabled: !!slug && !previewForm });
  const submitMutation = trpc.public.submitResponse.useMutation();
  const logEventMutation = trpc.public.logEvent.useMutation();
  
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  const form = previewForm || fetchedForm;

  const [answers, setAnswers] = useState<Record<string, unknown>>(previewAnswers || {});
  const [submitted, setSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [fieldPath, setFieldPath] = useState<string[]>([]);
  const [channel, setChannel] = useState<"welcome" | "submit">("welcome");
  const handleNextRef = useRef<() => void>(() => {});

  // Enter key advances the form
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) handleNextRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Log 'view' event once form is loaded
  const viewedRef = useRef(false);
  useEffect(() => {
    if (form && !viewedRef.current) {
      viewedRef.current = true;
      if (!readOnly && slug) logEventMutation.mutate({ slug, eventType: "view" });
    }
  }, [form, slug, logEventMutation, readOnly]);

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

  if (!form) {
    if (error) {
      return (
        <div className={cn("bg-[#2b2d31] flex flex-col items-center justify-center text-center px-4", readOnly ? "h-full min-h-[400px]" : "min-h-screen")}>
          <div className="w-20 h-20 rounded-2xl bg-[#2b2d31] flex items-center justify-center mb-6">
            <img src="/nitro.svg" alt="NitroForms" className="w-10 h-10 opacity-50" />
          </div>
          <h1 className="text-2xl font-bold text-[#f2f3f5] mb-2">Form Not Available</h1>
          <p className="text-sm text-[#949ba4] mb-8 max-w-sm">{error.message ?? "This form is not published or does not exist."}</p>
          <Link href="/" className="px-6 py-2.5 rounded-lg bg-[#5865f2] text-sm font-medium text-white hover:bg-[#4752c4] transition-colors">
            Back to Homepage
          </Link>
        </div>
      );
    }
    return null;
  }

  if (submitted) {
    if (readOnly) {
      return (
        <div className={cn("bg-[#313338] flex flex-col items-center justify-center text-center px-4", readOnly ? "h-full min-h-[400px]" : "min-h-screen")}>
          <CheckCircle className="text-[#3ba55c] w-16 h-16 mb-4" />
          <h1 className="text-2xl font-bold text-[#f2f3f5] mb-2">End of Response</h1>
          <p className="text-sm text-[#949ba4] max-w-sm">You have reached the end of this participant's response.</p>
        </div>
      );
    }
    return (
      <div className={cn("bg-[#313338] flex flex-col items-center justify-center text-center px-4", readOnly ? "h-full min-h-[400px]" : "min-h-screen")}>
        {mounted && (theme === "light" || resolvedTheme === "light") ? (
          <BotSvg className="w-28 h-28 mb-6" />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src="/discord-wumpus.gif" alt="" className="w-28 h-28 mb-6" />
        )}
        <h1 className="text-2xl font-bold text-[#f2f3f5] mb-2">Form submitted..</h1>
        <p className="text-sm text-[#949ba4] mb-6 max-w-sm">you can close the page now..</p>
      </div>
    );
  }

  const allFields = form.fields as Array<{ id: string; type: string; label: string; required: boolean; placeholder?: string; options?: string[]; conditionConfig?: { sourceFieldId: string; operator: string; value: string } }>;
  const settings = form.settings as { edges?: Array<{ source: string; target: string; sourceHandle: string | null }>; requireAuth?: boolean } | null;

  // Gate: require login
  if (settings?.requireAuth && !user && !readOnly) {
    return (
      <div className={cn("bg-[#313338] flex flex-col items-center justify-center text-center px-4", readOnly ? "h-full min-h-[400px]" : "min-h-screen")}>
        <img src="/nitro.svg" alt="" className="w-12 h-12 mb-4" />
        <h1 className="text-xl font-bold text-[#f2f3f5] mb-2">Login Required</h1>
        <p className="text-sm text-[#949ba4] mb-6 max-w-xs">This form requires you to be logged in before submitting a response.</p>
        <Link href="/login" className="px-6 py-2.5 rounded-lg bg-[#5865f2] text-sm font-medium text-white hover:bg-[#4752c4] transition-colors">
          Log In to Continue
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
    if (readOnly) return;
    if (field) setAnswers(a => ({ ...a, [field.id]: value }));
  }

  async function handleSubmit() {
    setFieldErrors({});
    if (readOnly) {
      setSubmitted(true);
      return;
    }
    
    try {
      // 1. Pre-process answers: upload any File objects
      const processedAnswers = { ...answers };
      for (const [key, value] of Object.entries(processedAnswers)) {
        if (value instanceof File) {
          const formData = new FormData();
          formData.append("file", value);
          
          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          
          if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            throw new Error(errorData?.error || "File upload failed");
          }
          
          const data = await res.json();
          processedAnswers[key] = data.url; // Replace File with string URL
        }
      }

      // 2. Submit form JSON payload
      await submitMutation.mutateAsync({ slug: slug!, answers: processedAnswers as Record<string, unknown> });
      setSubmitted(true);
    } catch (e: any) {
      if (e?.data?.cause) {
        setFieldErrors(e.data.cause as Record<string, string>);
      } else {
        setFieldErrors({ _global: e.message || "Submission failed" });
      }
    }
  }

  function handleNext() {
    if (!currentFieldId || !field) return;

    // Validate current field before advancing
    const answer = answers[field.id];
    if (field.required) {
      if (answer === undefined || answer === null || answer === "") {
        setFieldErrors({ [field.id]: "This field is required" });
        return;
      }
      if (Array.isArray(answer) && answer.length === 0) {
        setFieldErrors({ [field.id]: "Please select at least one option" });
        return;
      }
    }
    // Type validation
    if (field.type === "email" && answer) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(answer))) {
        setFieldErrors({ [field.id]: "Please enter a valid email" });
        return;
      }
    }
    if (field.type === "number" && answer !== undefined && answer !== "") {
      if (isNaN(Number(answer))) {
        setFieldErrors({ [field.id]: "Please enter a valid number" });
        return;
      }
    }
    if (field.type === "phone" && answer) {
      if (String(answer).replace(/\D/g, "").length < 7) {
        setFieldErrors({ [field.id]: "Please enter a valid phone number" });
        return;
      }
    }
    if (field.type === "url" && answer) {
      if (!/^https?:\/\/.+\..+/.test(String(answer))) {
        setFieldErrors({ [field.id]: "Please enter a valid URL (https://...)" });
        return;
      }
    }
    setFieldErrors({});

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

  handleNextRef.current = handleNext;

  if (!field) return null;

  return (
    <div className={cn("flex bg-[#1e1f22] text-[#f2f3f5] overflow-hidden", readOnly ? "h-full min-h-[400px]" : "h-screen")}>
      {/* Server rail — hidden on mobile */}
      <div className="w-[72px] shrink-0 bg-[#1e1f22] flex-col items-center py-3 gap-2 hidden md:flex">
        <div className="w-12 h-12 rounded-2xl bg-[#2b2d31] flex items-center justify-center">
          <img src="/nitro.svg" alt="" className="w-9 h-9" />
        </div>
        <div className="w-8 h-0.5 rounded bg-[#3f4147] my-1" />
      </div>

      {/* Channel sidebar — hidden on mobile */}
      <div className="w-[240px] shrink-0 bg-[#2b2d31] flex-col hidden md:flex">
        <div className="h-12 flex items-center px-4 font-semibold text-sm border-b border-[#1e1f22]">{form.title}</div>
        <div className="flex-1 px-2 py-3 space-y-0.5">
          <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#949ba4]">Channels</p>
          <button onClick={() => setChannel("welcome")} className={cn("flex items-center gap-2 w-full px-2 py-1.5 rounded text-sm text-left transition-colors", channel === "welcome" ? "bg-[#3f4147] text-[#f2f3f5]" : "text-[#949ba4] hover:bg-[#3f4147]/50 hover:text-[#b5bac1]")}>
            <span className={channel === "welcome" ? "text-[#f2f3f5]" : "text-[#4e5058]"}>#</span> welcome
          </button>
          <button onClick={() => setChannel("submit")} className={cn("flex items-center gap-2 w-full px-2 py-1.5 rounded text-sm text-left transition-colors", channel === "submit" ? "bg-[#3f4147] text-[#f2f3f5]" : "text-[#949ba4] hover:bg-[#3f4147]/50 hover:text-[#b5bac1]")}>
            <span className={channel === "submit" ? "text-[#f2f3f5]" : "text-[#4e5058]"}>#</span> submit-response
          </button>
        </div>
        <div className="px-2 py-2 bg-[#1e1f22] flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center text-xs font-bold text-white">R</div>
          <div>
            <p className="text-xs font-medium text-[#f2f3f5]">Respondent</p>
            <p className="text-[10px] text-[#3ba55c]">Online</p>
          </div>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#313338]">
        {/* Channel header */}
        <div className="h-12 shrink-0 flex items-center gap-2 px-4 border-b border-[#1e1f22]">
          <span className="text-[#949ba4]">#</span>
          <span className="text-sm font-semibold truncate">{channel === "welcome" ? "welcome" : "submit-response"}</span>
          <div className="w-px h-5 bg-[#3f4147] mx-2 hidden sm:block" />
          <span className="text-xs text-[#949ba4] truncate hidden sm:inline">{form.title}</span>
          {channel === "submit" && (
            <div className="ml-auto">
              <span className="text-[10px] text-[#949ba4] bg-[#1e1f22] px-2 py-0.5 rounded">{fieldPath.length + 1}/{totalSteps}</span>
            </div>
          )}
        </div>

                {channel === "welcome" ? (
          <>
            {/* Welcome content */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              {mounted && (theme === "light" || resolvedTheme === "light") ? (
                <BotSvg className="w-32 h-32 mb-6" />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src="/discord-wumpus.gif" alt="" className="w-32 h-32 mb-6" />
              )}
              <h1 className="text-2xl font-bold text-[#f2f3f5] mb-2">{form.title}</h1>
              {form.description && <p className="text-sm text-[#b5bac1] mb-3 max-w-sm">{form.description}</p>}
              <div className="flex items-center gap-3 text-xs text-[#949ba4] mb-8">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#3ba55c]" /> {totalSteps} questions</span>
                <span>·</span>
                <span>~2 min</span>
              </div>
              <button onClick={() => { if (!readOnly && slug) logEventMutation.mutate({ slug, eventType: "start" }); setChannel("submit"); }} className="px-8 py-3 rounded-lg bg-[#5865f2] text-sm font-medium text-white hover:bg-[#4752c4] transition-all hover:shadow-[0_0_20px_rgba(88,101,242,0.3)]">
                {readOnly ? "View Response" : "Get Started"}
              </button>
              <p className="text-[11px] text-[#4e5058] mt-4">Powered by NitroForms</p>
            </div>
          </>
        ) : (
          <>
        {/* Progress */}
        <div className="h-0.5 bg-[#1e1f22]"><div className="h-full bg-[#5865f2] transition-all duration-500" style={{ width: `${progress}%` }} /></div>

        {/* Messages area */}
        <div className="flex-1 flex items-center justify-center overflow-y-auto px-4 sm:px-6 py-6">
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
                disabled={readOnly}
                autoFocus={!readOnly}
                className="w-full bg-[#1e1f22] rounded px-3 py-2.5 text-sm text-[#f2f3f5] placeholder:text-[#4e5058] focus:outline-none disabled:opacity-50"
                placeholder="Type your answer here..."
              />
            )}

            {field.type === "long_text" && (
              <textarea
                value={(answers[field.id] as string) ?? ""}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={readOnly}
                autoFocus={!readOnly}
                rows={4}
                className="w-full bg-[#1e1f22] rounded px-3 py-2.5 text-sm text-[#f2f3f5] placeholder:text-[#4e5058] focus:outline-none resize-none disabled:opacity-50"
                placeholder="Type your answer here..."
              />
            )}

            {field.type === "number" && (
              <input
                type="number"
                value={(answers[field.id] as string) ?? ""}
                onChange={(e) => setAnswer(Number(e.target.value))}
                disabled={readOnly}
                autoFocus={!readOnly}
                className="w-full bg-[#1e1f22] rounded px-3 py-2.5 text-sm text-[#f2f3f5] placeholder:text-[#4e5058] focus:outline-none disabled:opacity-50"
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
                      readOnly && "cursor-default",
                      answers[field.id] === opt
                        ? "border-[#5865f2] bg-[#5865f2]/10 text-[#f2f3f5]"
                        : "border-[#3f4147] text-[#b5bac1] " + (readOnly ? "" : "hover:border-[#4e5058] hover:bg-[#2b2d31]")
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
                        readOnly && "cursor-default",
                        selected
                          ? "border-[#5865f2] bg-[#5865f2]/10 text-[#f2f3f5]"
                          : "border-[#3f4147] text-[#b5bac1] " + (readOnly ? "" : "hover:border-[#4e5058] hover:bg-[#2b2d31]")
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
                          : "text-[#3f4147] " + (readOnly ? "" : "group-hover:text-[#4e5058]")
                      )}
                    />
                  </button>
                ))}
              </div>
            )}

            {field.type === "checkbox" && (
              <label className={cn("flex items-center gap-3 mt-2 group", !readOnly && "cursor-pointer")}>
                <div className={cn(
                  "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors",
                  answers[field.id] ? "bg-[#5865f2] border-[#5865f2]" : "border-[#3f4147] " + (readOnly ? "" : "group-hover:border-[#4e5058]")
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
                disabled={readOnly}
                className="w-full bg-[#1e1f22] rounded px-3 py-2.5 text-sm text-[#f2f3f5] focus:outline-none disabled:opacity-50"
              />
            )}

            {field.type === "time" && (
              <input
                type="time"
                value={(answers[field.id] as string) ?? ""}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={readOnly}
                className="w-full bg-[#1e1f22] rounded px-3 py-2.5 text-sm text-[#f2f3f5] focus:outline-none disabled:opacity-50"
              />
            )}

            {field.type === "phone" && (
              <input
                type="tel"
                value={(answers[field.id] as string) ?? ""}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={readOnly}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-[#1e1f22] rounded px-3 py-2.5 text-sm text-[#f2f3f5] placeholder:text-[#4e5058] focus:outline-none disabled:opacity-50"
              />
            )}

            {field.type === "url" && (
              <input
                type="url"
                value={(answers[field.id] as string) ?? ""}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={readOnly}
                placeholder="https://"
                className="w-full bg-[#1e1f22] rounded px-3 py-2.5 text-sm text-[#f2f3f5] placeholder:text-[#4e5058] focus:outline-none disabled:opacity-50"
              />
            )}

            {field.type === "file_upload" && (
              <label className={cn("flex flex-col items-center justify-center w-full h-24 rounded-lg border-2 border-dashed border-[#3f4147] transition-colors", readOnly ? "opacity-50 cursor-default" : "hover:border-[#5865f2] cursor-pointer")}>
                <span className="text-xs text-[#949ba4]">{answers[field.id] ? (answers[field.id] as File).name || String(answers[field.id]) : "Click to upload file"}</span>
                <input disabled={readOnly} type="file" className="hidden" onChange={(e) => { 
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 10 * 1024 * 1024) {
                      setFieldErrors({ [field.id]: "File exceeds the 10MB limit." });
                    } else {
                      setFieldErrors({});
                      setAnswer(file);
                    }
                  } 
                }} />
              </label>
            )}

            {fieldErrors[field.id] && (
              <p className="text-sm text-red-400 mt-3">{fieldErrors[field.id]}</p>
            )}
            {fieldErrors._global && (
              <p className="text-sm text-red-400 mt-3">{fieldErrors._global}</p>
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
                if (isLast) return readOnly ? "Finish" : "Submit";
                return "Next";
              })()}
            </button>
            <span className="ml-auto text-[11px] text-[#4e5058]">{fieldPath.length + 1}/{totalSteps}</span>
          </div>
        </div>
      </div>
      </>
        )}
      </div>
    </div>
  );
}
