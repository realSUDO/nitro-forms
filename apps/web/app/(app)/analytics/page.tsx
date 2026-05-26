"use client";

import Link from "next/link";
import { BarChart2, FileText, Loader2 } from "lucide-react";
import { trpc } from "~/trpc/client";
import { cn } from "~/lib/utils";

export default function AnalyticsIndex() {
  const { data: forms, isLoading } = trpc.form.listMine.useQuery();

  return (
    <main className="flex-1 overflow-y-auto bg-[#313338] p-6">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-[#f2f3f5] mb-1">Analytics</h1>
        <p className="text-sm text-[#949ba4] mb-6">Select a form to view its analytics.</p>

        {isLoading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="animate-spin text-[#5865f2]" size={24} /></div>
        ) : !forms?.length ? (
          <p className="text-sm text-[#949ba4] py-12 text-center">No forms yet. Create one from the dashboard.</p>
        ) : (
          <div className="space-y-2">
            {forms.map(form => (
              <Link key={form.id} href={`/analytics/${form.id}`} prefetch className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#2b2d31] border border-[#3f4147] hover:border-[#5865f2] hover:shadow-[0_0_15px_rgba(88,101,242,0.15)] transition-all">
                <FileText size={16} className="text-[#949ba4]" />
                <span className="flex-1 text-sm font-medium text-[#f2f3f5]">{form.title}</span>
                <span className={cn("px-2 py-0.5 rounded text-[10px] font-mono capitalize", form.status === "published" ? "bg-[#5865f2]/15 text-[#5865f2]" : "bg-[#3f4147] text-[#949ba4]")}>{form.status}</span>
                <BarChart2 size={14} className="text-[#5865f2]" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
