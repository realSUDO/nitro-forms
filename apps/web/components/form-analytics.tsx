"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { BarChart2, Calendar, Clock, Download, Eye, Loader2, Search, Star, TrendingUp, Users } from "lucide-react";
import { cn } from "~/lib/utils";
import { trpc } from "~/trpc/client";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function FormAnalytics() {
  const params = useParams();
  const formId = params.id as string;

  const { data: form } = trpc.form.getById.useQuery({ formId }, { enabled: !!formId });
  const { data: overview, isLoading } = trpc.analytics.getOverview.useQuery({ formId }, { enabled: !!formId });
  const { data: timeline } = trpc.analytics.getTimeline.useQuery({ formId, days: 30 }, { enabled: !!formId });
  const { data: responses } = trpc.response.listByForm.useQuery({ formId, limit: 5 }, { enabled: !!formId });

  if (isLoading) {
    return <div className="flex-1 flex items-center justify-center"><Loader2 className="animate-spin text-[#5865f2]" size={32} /></div>;
  }

  const barHeights = timeline?.length
    ? timeline.slice(-7).map(d => d.count)
    : [60, 80, 55, 95, 70, 40, 30];
  const maxBar = Math.max(...barHeights, 1);

  return (
    <main className="flex-1 overflow-y-auto bg-[#313338] p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-end mb-2">
          <div>
            <h1 className="text-[32px] font-bold leading-tight tracking-tight text-[#f2f3f5]">Response Analytics</h1>
            <p className="text-base text-[#949ba4] mt-1">{form?.title ?? "Form"} • NitroForms</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2b2d31] border border-[#3f4147] text-[13px] font-mono text-[#f2f3f5] hover:border-[#5865f2] hover:shadow-[0_0_15px_rgba(88,101,242,0.15)] transition-all">
              <Calendar size={14} /> Last 30 Days
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#5865f2]/10 border border-[#5865f2]/30 text-[13px] font-mono text-[#bec2ff] hover:bg-[#5865f2]/20 transition-colors">
              <Download size={14} /> Export Data
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Responses", value: overview?.totalResponses ?? 0, sub: "+12.5% from last month", Icon: BarChart2, hasSubIcon: true },
            { label: "Completion Rate", value: `${overview?.completionRate ?? 0}%`, sub: null, Icon: Users, bar: true },
            { label: "Avg. Time", value: "2m 45s", sub: "Decreased by 12s", Icon: Clock, hasSubIcon: true },
          ].map(({ label, value, sub, Icon, bar, hasSubIcon }) => (
            <div key={label} className="rounded-xl p-6 bg-[#2b2d31] border border-[#3f4147] hover:border-[#5865f2] hover:shadow-[0_0_15px_rgba(88,101,242,0.15)] transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#949ba4]">{label}</span>
                  <Icon size={18} className="text-[#5865f2]" />
                </div>
                <p className="text-[32px] font-bold leading-tight text-[#f2f3f5]">{value}</p>
              </div>
              {sub && (
                <p className="mt-4 flex items-center gap-2 text-[13px] font-mono text-[#5865f2]">
                  {hasSubIcon && <TrendingUp size={14} />} {sub}
                </p>
              )}
              {bar && (
                <div className="mt-4 w-full h-1.5 rounded-full bg-[#1e1f22]">
                  <div className="h-full rounded-full bg-[#b6c4ff]" style={{ width: `${overview?.completionRate ?? 0}%` }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-3 gap-4">
          {/* Bar Chart */}
          <div className="col-span-2 rounded-xl p-6 bg-[#2b2d31] border border-[#3f4147] hover:border-[#5865f2] hover:shadow-[0_0_15px_rgba(88,101,242,0.15)] transition-all">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-semibold text-[#f2f3f5]">Response Timeline</h3>
              <div className="flex items-center gap-4 text-[11px] font-mono text-[#949ba4]">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#5865f2] rounded-sm" /> Completed</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#3f4147] rounded-sm" /> Partial</span>
              </div>
            </div>
            <div className="h-56 flex items-end justify-between gap-3 px-2">
              {barHeights.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full rounded-t bg-[#5865f2] hover:bg-[#4752c4] transition-colors relative group" style={{ height: `${(h / maxBar) * 100}%` }}>
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#1e1f22] px-2 py-0.5 rounded text-[10px] text-[#f2f3f5] hidden group-hover:block">{h}</div>
                  </div>
                  <span className="text-[11px] font-mono text-[#949ba4]/50">{DAYS[i % 7]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Donut */}
          <div className="rounded-xl p-6 bg-[#2b2d31] border border-[#3f4147] hover:border-[#5865f2] hover:shadow-[0_0_15px_rgba(88,101,242,0.15)] transition-all flex flex-col">
            <h3 className="text-lg font-semibold text-[#f2f3f5] mb-8">Device Breakdown</h3>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-36 h-36 rounded-full border-[14px] border-[#1e1f22] relative">
                <div className="absolute inset-0 rounded-full border-[14px] border-t-[#5865f2] border-r-[#5865f2] border-b-[#b6c4ff] border-l-[#3f4147] rotate-45" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-[#f2f3f5]">72%</span>
                  <span className="text-[10px] font-mono uppercase text-[#949ba4]">Desktop</span>
                </div>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {[
                { label: "Desktop", count: "608 (72%)", color: "bg-[#5865f2]" },
                { label: "Mobile", count: "184 (22%)", color: "bg-[#b6c4ff]" },
                { label: "Tablet", count: "50 (6%)", color: "bg-[#3f4147]" },
              ].map(({ label, count, color }) => (
                <div key={label} className="flex items-center justify-between text-[13px] font-mono">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", color)} />
                    <span className="text-[#949ba4]">{label}</span>
                  </div>
                  <span className="text-[#f2f3f5]">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Responses Table */}
        <div className="rounded-xl overflow-hidden bg-[#2b2d31] border border-[#3f4147] hover:border-[#5865f2] hover:shadow-[0_0_15px_rgba(88,101,242,0.15)] transition-all">
          <div className="p-6 flex items-center justify-between border-b border-[#3f4147]/30">
            <h3 className="text-lg font-semibold text-[#f2f3f5]">Latest Responses</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#949ba4]" />
                <input className="bg-[#1e1f22] border border-[#3f4147] rounded-lg pl-9 pr-4 py-2 text-sm text-[#f2f3f5] placeholder:text-[#949ba4] focus:border-[#5865f2] outline-none w-56" placeholder="Search responses..." />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2b2d31] border border-[#3f4147] text-[13px] font-mono text-[#f2f3f5] hover:bg-[#3f4147] transition-colors">
                <Download size={14} /> CSV Export
              </button>
            </div>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#1e1f22]/50 border-b border-[#3f4147]/30">
                {["Respondent", "Status", "Satisfaction", "Date", ""].map(h => (
                  <th key={h} className="px-6 py-4 text-[11px] font-mono uppercase tracking-widest text-[#949ba4]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3f4147]/10">
              {(responses?.responses ?? []).map((r, i) => {
                const initials = (r.respondentEmail ?? "AN").slice(0, 2).toUpperCase();
                const colors = ["bg-[#5865f2]/20 text-[#bec2ff]", "bg-[#b6c4ff]/20 text-[#b6c4ff]", "bg-[#98cbff]/20 text-[#98cbff]"];
                return (
                  <tr key={r.id} className="hover:bg-[#3f4147]/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold", colors[i % 3])}>
                          {initials}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#f2f3f5]">{r.respondentEmail ?? "Anonymous"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold uppercase rounded">Completed</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} size={14} className={s <= 4 ? "text-[#5865f2] fill-[#5865f2]" : "text-[#3f4147]"} />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#949ba4]">{r.submittedAt ? new Date(r.submittedAt).toLocaleString() : "—"}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[#949ba4] hover:text-[#5865f2] transition-colors"><Eye size={16} /></button>
                    </td>
                  </tr>
                );
              })}
              {(!responses?.responses.length) && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-[#949ba4]">No responses yet. Share your form to start collecting data.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
