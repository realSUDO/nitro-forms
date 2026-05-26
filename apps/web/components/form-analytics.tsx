"use client";

import Link from "next/link";
import {
  BarChart2,
  Calendar,
  ChevronDown,
  Clock,
  Download,
  Eye,
  Hash,
  LayoutGrid,
  Plus,
  Search,
  Settings,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import { cn } from "~/lib/utils";

const RESPONSES = [
  { initials: "JD", name: "Jane Doe", email: "jane.doe@example.com", status: "Completed", rating: 4.5, date: "Oct 24, 2023 • 14:22", color: "bg-[#3f4147] text-[#f2f3f5]" },
  { initials: "MS", name: "Marcus Smith", email: "m.smith@tech.io", status: "Completed", rating: 5, date: "Oct 24, 2023 • 12:05", color: "bg-[#b6c4ff]/20 text-[#b6c4ff]" },
  { initials: "AK", name: "Alex Kim", email: "alexk@design.com", status: "Partial", rating: 2, date: "Oct 23, 2023 • 18:45", color: "bg-[#98cbff]/20 text-[#98cbff]" },
];

const CHART_BARS = [
  { h: "60%", label: "Mon" },
  { h: "80%", label: "Tue" },
  { h: "55%", label: "Wed" },
  { h: "95%", label: "Thu" },
  { h: "70%", label: "Fri" },
  { h: "40%", label: "Sat" },
  { h: "30%", label: "Sun" },
];

export function FormAnalytics() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#313338] text-[#f2f3f5]">

      {/* ── Rail ── */}
      <aside className="w-[72px] shrink-0 bg-[#2b2d31]  flex flex-col items-center py-4 gap-3">
        <div className="w-12 h-12 rounded-full bg-[#5865f2] flex items-center justify-center mb-2">
          <Zap size={18} className="text-white" />
        </div>
        {[
          { Icon: LayoutGrid, active: false },
          { Icon: BarChart2, active: true },
          { Icon: Settings, active: false },
        ].map(({ Icon, active }, i) => (
          <button key={i} className={cn(
            "relative w-10 h-10 rounded-full flex items-center justify-center transition-colors",
            active ? "bg-[#3f4147] text-[#f2f3f5]" : "text-[#949ba4] hover:bg-[#3f4147] hover:text-[#f2f3f5]"
          )}>
            {active && <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-white" />}
            <Icon size={18} />
          </button>
        ))}
        <div className="flex-1" />
        <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center text-xs font-bold text-white">A</div>
      </aside>

      {/* ── Sidebar ── */}
      <aside className="w-[240px] shrink-0 flex flex-col bg-[#2b2d31] ">
        <div className="px-4 pt-6 pb-4">
          <h2 className="text-lg font-semibold text-[#f2f3f5]">Project Alpha</h2>
          <p className="text-sm text-[#949ba4]">48 forms total</p>
        </div>
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          <p className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-[#949ba4]/50">Channels</p>
          {[
            { name: "general-forms", active: false },
            { name: "beta-testing", active: false },
            { name: "Internal Feedback", active: true },
            { name: "Archives", active: false },
          ].map(({ name, active }) => (
            <Link key={name} href="#" className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors",
              active ? "bg-[#28418e]/20 text-[#9db2ff] font-semibold" : "text-[#949ba4] hover:bg-[#3f4147] hover:text-[#f2f3f5]"
            )}>
              <Hash size={14} className={active ? "text-[#9db2ff]" : "text-[#4e5058]"} />
              {name}
            </Link>
          ))}
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="h-14 shrink-0 flex items-center justify-between px-4 bg-[#3f4147] border-b-2 border-[#1e1f22]">
          <div className="flex items-center gap-8">
            <span className="text-lg font-black text-[#b5bac1] tracking-tight">NitroForms</span>
            <nav className="flex items-center gap-6 h-full">
              {["Designer", "Logic", "Settings", "Analytics"].map((tab) => (
                <Link key={tab} href={tab === "Analytics" ? "/analytics" : "#"} className={cn(
                  "text-[13px] font-mono transition-colors",
                  tab === "Analytics" ? "text-[#bec2ff] border-b-2 border-[#bec2ff] pb-4 mt-4" : "text-[#949ba4] hover:text-[#bec2ff]"
                )}>
                  {tab}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-1.5 rounded-lg border border-[#4e5058] text-[13px] font-mono text-[#f2f3f5] hover:bg-[#3f4147] transition-colors">Preview</button>
            <button className="px-4 py-1.5 rounded-lg bg-[#5865f2] text-[13px] font-mono text-white hover:brightness-110 transition-all">Publish</button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-[#313338] p-6">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex justify-between items-end mb-2">
              <div>
                <h1 className="text-[32px] font-bold leading-tight tracking-tight text-[#f2f3f5]">Response Analytics</h1>
                <p className="text-base text-[#b5bac1] mt-1">Customer Feedback Survey • Project Alpha</p>
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

            {/* KPI cards */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Responses", value: "842", sub: "+12.5% from last month", Icon: BarChart2, subIcon: TrendingUp },
                { label: "Completion Rate", value: "68.5%", sub: null, Icon: BarChart2, bar: true },
                { label: "Avg. Time", value: "2m 45s", sub: "Decreased by 12s", Icon: Clock, subIcon: Clock },
              ].map(({ label, value, sub, Icon, bar, subIcon: SubIcon }) => (
                <div key={label} className="rounded-xl p-6 bg-[#383a40] border border-[#3f4147] hover:border-[#5865f2] hover:shadow-[0_0_15px_rgba(88,101,242,0.15)] transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#b5bac1]">{label}</span>
                    <Icon size={18} className="text-[#bec2ff]" />
                  </div>
                  <p className="text-[32px] font-bold leading-tight text-[#f2f3f5]">{value}</p>
                  {sub && (
                    <p className="mt-4 flex items-center gap-2 text-[13px] font-mono text-[#bec2ff]">
                      {SubIcon && <SubIcon size={14} />} {sub}
                    </p>
                  )}
                  {bar && (
                    <div className="mt-4 w-full h-1.5 rounded-full bg-[#383a40]">
                      <div className="h-full rounded-full bg-[#b6c4ff]" style={{ width: "68.5%" }} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-3 gap-4">
              {/* Bar chart */}
              <div className="col-span-2 rounded-xl p-6 bg-[#383a40] border border-[#3f4147] hover:border-[#5865f2] hover:shadow-[0_0_15px_rgba(88,101,242,0.15)] transition-all">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-semibold text-[#f2f3f5]">Response Timeline</h3>
                  <div className="flex items-center gap-4 text-[11px] font-mono text-[#949ba4]">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#5865f2] rounded-sm" /> Completed</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#4e5058] rounded-sm" /> Partial</span>
                  </div>
                </div>
                <div className="h-56 flex items-end justify-between gap-3 px-2">
                  {CHART_BARS.map(({ h, label }) => (
                    <div key={label} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full rounded-t bg-[#5865f2] hover:bg-[#6875f5] transition-colors" style={{ height: h }} />
                      <span className="text-[11px] font-mono text-[#949ba4]/50">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Device breakdown */}
              <div className="rounded-xl p-6 bg-[#383a40] border border-[#3f4147] hover:border-[#5865f2] hover:shadow-[0_0_15px_rgba(88,101,242,0.15)] transition-all flex flex-col">
                <h3 className="text-lg font-semibold text-[#f2f3f5] mb-8">Device Breakdown</h3>
                {/* Donut */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-36 h-36 rounded-full border-[14px] border-[#383a40] relative">
                    <div className="absolute inset-0 rounded-full border-[14px] border-t-[#bec2ff] border-r-[#bec2ff] border-b-[#b6c4ff] border-l-[#4e5058] rotate-45" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-bold text-[#f2f3f5]">72%</span>
                      <span className="text-[10px] font-mono uppercase text-[#949ba4]">Desktop</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  {[
                    { label: "Desktop", count: "608 (72%)", color: "bg-[#bec2ff]" },
                    { label: "Mobile", count: "184 (22%)", color: "bg-[#b6c4ff]" },
                    { label: "Tablet", count: "50 (6%)", color: "bg-[#4e5058]" },
                  ].map(({ label, count, color }) => (
                    <div key={label} className="flex items-center justify-between text-[13px] font-mono">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", color)} />
                        <span className="text-[#b5bac1]">{label}</span>
                      </div>
                      <span className="text-[#f2f3f5]">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-xl overflow-hidden bg-[#383a40] border border-[#3f4147] hover:border-[#5865f2] hover:shadow-[0_0_15px_rgba(88,101,242,0.15)] transition-all">
              <div className="p-6 flex items-center justify-between border-b border-[#4e5058]/30">
                <h3 className="text-lg font-semibold text-[#f2f3f5]">Latest Responses</h3>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#949ba4]" />
                    <input className="bg-[#1e1f22] border border-[#4e5058] rounded-lg pl-9 pr-4 py-2 text-sm text-[#f2f3f5] placeholder:text-[#949ba4] focus:border-[#5865f2] focus:ring-1 focus:ring-[#5865f2] outline-none transition-all w-56" placeholder="Search responses..." />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2b2d31] border border-[#3f4147] text-[13px] font-mono text-[#f2f3f5] hover:bg-[#3f4147] transition-colors">
                    <Download size={14} /> CSV Export
                  </button>
                </div>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#3f4147]/50 border-b border-[#4e5058]/30">
                    {["Respondent", "Status", "Satisfaction", "Date", ""].map(h => (
                      <th key={h} className="px-6 py-4 text-[11px] font-mono uppercase tracking-widest text-[#b5bac1]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#4e5058]/10">
                  {RESPONSES.map((r, i) => (
                    <tr key={i} className="hover:bg-[#3f4147]/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold", r.color)}>
                            {r.initials}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#f2f3f5]">{r.name}</p>
                            <p className="text-xs text-[#949ba4]">{r.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-1 rounded text-[10px] font-bold uppercase",
                          r.status === "Completed" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                        )}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, s) => (
                            <Star key={s} size={14} className={s < Math.floor(r.rating) ? "text-[#bec2ff] fill-[#bec2ff]" : s < r.rating ? "text-[#bec2ff] fill-[#bec2ff]/50" : "text-[#4e5058]"} />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#949ba4]">{r.date}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-1.5 rounded text-[#949ba4] hover:text-[#bec2ff] hover:bg-[#3f4147] transition-colors">
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
