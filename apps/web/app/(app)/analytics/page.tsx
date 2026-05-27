"use client";

import { useState } from "react";
import Link from "next/link";
import { BarChart2, FileText, Hash, Loader2, Volume2 } from "lucide-react";
import { trpc } from "~/trpc/client";
import { cn } from "~/lib/utils";
import { FormAnalytics } from "~/components/form-analytics";

export default function AnalyticsIndex() {
  const { data: forms, isLoading } = trpc.form.listMine.useQuery();
  const [activeFormId, setActiveFormId] = useState<string | null>(null);

  return (
    <>
      {/* Sidebar — like Discord voice channels */}
      <aside className="w-[240px] shrink-0 flex flex-col bg-[#2b2d31]">
        <div className="px-4 pt-5 pb-3">
          <p className="text-xs font-semibold text-[#f2f3f5]">Analytics</p>
          <p className="text-[11px] text-[#949ba4] mt-0.5">Select a form to view insights</p>
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
          <p className="flex items-center gap-1 px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#949ba4]">
            <Volume2 size={11} /> Forms
          </p>

          {isLoading ? (
            <div className="flex justify-center py-4"><Loader2 size={16} className="animate-spin text-[#949ba4]" /></div>
          ) : !forms?.length ? (
            <p className="px-3 py-2 text-xs text-[#4e5058]">No forms yet</p>
          ) : (
            forms.map(form => (
              <button
                key={form.id}
                onClick={() => setActiveFormId(form.id)}
                className={cn(
                  "w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm text-left transition-colors",
                  activeFormId === form.id
                    ? "bg-[#3f4147] text-[#f2f3f5]"
                    : "text-[#949ba4] hover:bg-[#3f4147]/50 hover:text-[#b5bac1]"
                )}
              >
                <Hash size={14} className={activeFormId === form.id ? "text-[#f2f3f5]" : "text-[#4e5058]"} />
                <span className="truncate flex-1">{form.title}</span>
                {activeFormId === form.id && (
                  <span className="w-2 h-2 rounded-full bg-[#3ba55c] shrink-0" />
                )}
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Main content */}
      {activeFormId ? (
        <FormAnalytics key={activeFormId} formIdProp={activeFormId} />
      ) : (
        <main className="flex-1 flex flex-col items-center justify-center bg-[#313338]">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#2b2d31] flex items-center justify-center mx-auto mb-4">
              <BarChart2 size={28} className="text-[#4e5058]" />
            </div>
            <h2 className="text-xl font-bold text-[#f2f3f5] mb-2">View Analytics</h2>
            <p className="text-sm text-[#949ba4] max-w-xs">Select a form from the sidebar to view its response analytics and insights.</p>
          </div>
        </main>
      )}
    </>
  );
}
