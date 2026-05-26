"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { BarChart2, Clock, Eye, LayoutGrid, Loader2, Settings, Star, Users, Zap } from "lucide-react";
import { cn } from "~/lib/utils";
import { trpc } from "~/trpc/client";

export function FormAnalytics() {
  const params = useParams();
  const formId = params.id as string;

  const { data: form } = trpc.form.getById.useQuery({ formId }, { enabled: !!formId });
  const { data: overview, isLoading } = trpc.analytics.getOverview.useQuery({ formId }, { enabled: !!formId });
  const { data: timeline } = trpc.analytics.getTimeline.useQuery({ formId, days: 30 }, { enabled: !!formId });
  const { data: responses } = trpc.response.listByForm.useQuery({ formId, limit: 5 }, { enabled: !!formId });

  if (isLoading) {
    return (
      <div className="h-screen bg-[#313338] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#5865f2]" size={32} />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#313338] text-[#f2f3f5]">

      {/* Rail */}
      <aside className="w-[72px] shrink-0 bg-[#1e1f22] flex flex-col items-center py-4 gap-3">
        <Link href="/dashboard" className="w-12 h-12 rounded-full bg-[#5865f2] flex items-center justify-center mb-2">
          <Zap size={18} className="text-white" />
        </Link>
        {[
          { Icon: LayoutGrid, href: "/dashboard", active: false },
          { Icon: BarChart2, href: `/analytics/${formId}`, active: true },
        ].map(({ Icon, href, active }, i) => (
          <Link key={i} href={href} className={cn(
            "relative w-10 h-10 rounded-full flex items-center justify-center transition-colors",
            active ? "bg-[#3f4147] text-[#f2f3f5]" : "text-[#949ba4] hover:bg-[#3f4147] hover:text-[#f2f3f5]"
          )}>
            {active && <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-white" />}
            <Icon size={18} />
          </Link>
        ))}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-12 shrink-0 flex items-center justify-between px-4 bg-[#2b2d31]">
          <div className="flex items-center gap-2">
            <BarChart2 size={18} className="text-[#949ba4]" />
            <span className="font-semibold text-sm text-[#f2f3f5]">Analytics</span>
            <span className="text-sm text-[#949ba4]">— {form?.title ?? "Loading..."}</span>
          </div>
          <Link href={`/builder/${formId}`} className="text-xs text-[#5865f2] hover:underline">← Back to Builder</Link>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#313338] p-6">
          <div className="max-w-5xl">
            <h1 className="text-2xl font-bold text-[#f2f3f5] mb-1">{form?.title ?? "Form Analytics"}</h1>
            <p className="text-sm text-[#949ba4] mb-6">Response analytics and insights</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: "Total Responses", value: overview?.totalResponses ?? 0, Icon: Users },
                { label: "Completion Rate", value: `${overview?.completionRate ?? 0}%`, Icon: BarChart2 },
                { label: "Total Views", value: overview?.views ?? 0, Icon: Eye },
              ].map(({ label, value, Icon }) => (
                <div key={label} className="rounded-lg p-4 bg-[#2b2d31]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#949ba4]">{label}</span>
                    <Icon size={14} className="text-[#4e5058]" />
                  </div>
                  <span className="text-2xl font-bold text-[#f2f3f5]">{value}</span>
                </div>
              ))}
            </div>

            {/* Timeline */}
            {timeline && timeline.length > 0 && (
              <div className="rounded-lg p-4 bg-[#2b2d31] mb-6">
                <p className="text-sm font-semibold text-[#f2f3f5] mb-4">Response Timeline (Last 30 days)</p>
                <div className="flex items-end gap-1 h-32">
                  {timeline.map((day, i) => {
                    const maxCount = Math.max(...timeline.map(d => d.count));
                    const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full rounded-sm bg-[#5865f2] hover:bg-[#4752c4] transition-colors" style={{ height: `${Math.max(height, 4)}%` }} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recent responses */}
            <div className="rounded-lg overflow-hidden bg-[#2b2d31]">
              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-[#f2f3f5]">Recent Responses</span>
                <span className="text-xs text-[#949ba4]">{responses?.total ?? 0} total</span>
              </div>
              {responses?.responses.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-[#949ba4]">No responses yet.</p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-t border-[#3f4147]">
                      <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase text-[#949ba4]">Email</th>
                      <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase text-[#949ba4]">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {responses?.responses.map((r) => (
                      <tr key={r.id} className="border-t border-[#3f4147]/40 hover:bg-[#3f4147]/20">
                        <td className="px-4 py-2.5 text-sm text-[#b5bac1]">{r.respondentEmail ?? "Anonymous"}</td>
                        <td className="px-4 py-2.5 text-xs text-[#949ba4]">{r.submittedAt ? new Date(r.submittedAt).toLocaleString() : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
