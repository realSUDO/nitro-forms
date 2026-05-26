"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, Zap } from "lucide-react";
import { cn } from "~/lib/utils";
import { trpc } from "~/trpc/client";

export function PublicForm() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: form, isLoading, error } = trpc.public.getFormBySlug.useQuery({ slug }, { enabled: !!slug });
  const submitMutation = trpc.public.submitResponse.useMutation();

  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [submitted, setSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#313338] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#5865f2]" size={32} />
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-[#313338] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-full bg-[#3f4147] flex items-center justify-center mb-4">
          <Zap size={24} className="text-[#949ba4]" />
        </div>
        <h1 className="text-xl font-bold text-[#f2f3f5] mb-2">Form Not Available</h1>
        <p className="text-sm text-[#949ba4] mb-6">{error?.message ?? "This form is not published or does not exist."}</p>
        <Link href="/" className="text-sm text-[#5865f2] hover:underline">Back to Homepage</Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#313338] flex flex-col items-center justify-center text-center px-4">
        <CheckCircle size={48} className="text-[#5865f2] mb-4" />
        <h1 className="text-2xl font-bold text-[#f2f3f5] mb-2">Thank you!</h1>
        <p className="text-sm text-[#949ba4] mb-6">Your response has been submitted successfully.</p>
        <Link href="/" className="text-sm text-[#5865f2] hover:underline">Back to Homepage</Link>
      </div>
    );
  }

  const fields = form.fields as Array<{ id: string; type: string; label: string; required: boolean; placeholder?: string; options?: string[] }>;

  async function handleSubmit() {
    setFieldErrors({});
    try {
      await submitMutation.mutateAsync({ slug, answers: answers as Record<string, unknown> });
      setSubmitted(true);
    } catch (e: any) {
      if (e?.data?.cause) {
        setFieldErrors(e.data.cause as Record<string, string>);
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#313338] text-[#f2f3f5] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 h-14 bg-[#2b2d31] shrink-0">
        <div className="flex items-center gap-2">
          <Zap size={18} className="text-[#5865f2]" />
          <span className="text-sm font-bold">NitroForms</span>
        </div>
      </header>

      {/* Form */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-xl">
          <div className="rounded-xl p-8 bg-[#383a40]">
            <h1 className="text-2xl font-bold text-[#f2f3f5] mb-2">{form.title}</h1>
            {form.description && <p className="text-sm text-[#949ba4] mb-6">{form.description}</p>}

            <div className="space-y-5">
              {fields.map((field) => (
                <div key={field.id}>
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-[#b5bac1] mb-1.5">
                    {field.label} {field.required && <span className="text-[#5865f2]">*</span>}
                  </label>

                  {(field.type === "short_text" || field.type === "email") && (
                    <input
                      type={field.type === "email" ? "email" : "text"}
                      placeholder={field.placeholder}
                      className="w-full bg-[#1e1f22] border-none rounded-lg px-3 py-2.5 text-sm text-[#f2f3f5] placeholder:text-[#4e5058] focus:ring-1 focus:ring-[#5865f2] outline-none"
                      onChange={(e) => setAnswers(a => ({ ...a, [field.id]: e.target.value }))}
                    />
                  )}

                  {field.type === "long_text" && (
                    <textarea
                      rows={3}
                      placeholder={field.placeholder}
                      className="w-full bg-[#1e1f22] border-none rounded-lg px-3 py-2.5 text-sm text-[#f2f3f5] placeholder:text-[#4e5058] focus:ring-1 focus:ring-[#5865f2] outline-none resize-none"
                      onChange={(e) => setAnswers(a => ({ ...a, [field.id]: e.target.value }))}
                    />
                  )}

                  {field.type === "number" && (
                    <input
                      type="number"
                      placeholder={field.placeholder}
                      className="w-full bg-[#1e1f22] border-none rounded-lg px-3 py-2.5 text-sm text-[#f2f3f5] placeholder:text-[#4e5058] focus:ring-1 focus:ring-[#5865f2] outline-none"
                      onChange={(e) => setAnswers(a => ({ ...a, [field.id]: Number(e.target.value) }))}
                    />
                  )}

                  {field.type === "single_select" && field.options && (
                    <div className="grid grid-cols-2 gap-2">
                      {field.options.map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setAnswers(a => ({ ...a, [field.id]: opt }))}
                          className={cn(
                            "px-3 py-2 rounded-lg text-sm text-left transition-colors",
                            answers[field.id] === opt
                              ? "bg-[#5865f2]/20 border border-[#5865f2] text-[#f2f3f5]"
                              : "bg-[#1e1f22] text-[#b5bac1] hover:bg-[#3f4147]"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {field.type === "rating" && (
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(n => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setAnswers(a => ({ ...a, [field.id]: n }))}
                          className={cn(
                            "w-10 h-10 rounded-lg text-sm font-bold transition-colors",
                            (answers[field.id] as number) >= n
                              ? "bg-[#5865f2] text-white"
                              : "bg-[#1e1f22] text-[#949ba4] hover:bg-[#3f4147]"
                          )}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  )}

                  {field.type === "checkbox" && (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded bg-[#1e1f22] border-[#4e5058] text-[#5865f2] focus:ring-[#5865f2]"
                        onChange={(e) => setAnswers(a => ({ ...a, [field.id]: e.target.checked }))}
                      />
                      <span className="text-sm text-[#b5bac1]">Yes</span>
                    </label>
                  )}

                  {fieldErrors[field.id] && (
                    <p className="text-xs text-red-400 mt-1">{fieldErrors[field.id]}</p>
                  )}
                </div>
              ))}
            </div>

            {submitMutation.error && !Object.keys(fieldErrors).length && (
              <p className="text-sm text-red-400 mt-4">{submitMutation.error.message}</p>
            )}

            <div className="flex justify-end mt-8 pt-5 border-t border-[#3f4147]">
              <button
                onClick={handleSubmit}
                disabled={submitMutation.isPending}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#5865f2] text-sm font-medium text-white hover:bg-[#4752c4] transition-colors disabled:opacity-50"
              >
                {submitMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
                Submit
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-center gap-4 py-4 border-t border-[#3f4147] text-xs text-[#949ba4]">
        <span className="flex items-center gap-1.5">Powered by <Zap size={10} className="text-[#5865f2]" /> <span className="font-semibold text-[#b5bac1]">NitroForms</span></span>
      </footer>
    </div>
  );
}
