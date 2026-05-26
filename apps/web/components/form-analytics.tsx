"use client";

import Link from "next/link";
import {
  BarChart2,
  Calendar,
  ChevronDown,
  Clock,
  Download,
  Hash,
  LayoutGrid,
  MoreVertical,
  Plus,
  Search,
  Settings,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "~/lib/utils";

const RESPONSES = [
  { date: "Oct 29, 14:22", email: "alex.j@example.com", rating: 5, feedback: "Love the new dark mode interface, very clean.", status: "Verified" },
  { date: "Oct 29, 12:05", email: "sarah.k@techcorp.io", rating: 4, feedback: "Integration with Slack was a bit confusing but works.", status: "Verified" },
  { date: "Oct 28, 18:44", email: "m.chen@designhub.com", rating: 5, feedback: "Speed of form loading is incredible. Best in class.", status: "Guest" },
  { date: "Oct 28, 09:12", email: "p.robertson@freelance.co", rating: 4, feedback: "Wish there were more export formats available.", status: "Verified" },
];

const DEVICES = [
  { label: "Mobile Web", pct: 62, count: 522 },
  { label: "Desktop", pct: 31, count: 261 },
  { label: "Tablet", pct: 7, count: 59 },
];

export function FormAnalytics() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#121316] text-[#e3e2e6]">

      {/* ── Rail ── */}
      <aside className="w-[72px] shrink-0 bg-[#1a1b1e] border-r border-[#343538] flex flex-col items-center py-4 gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#5865f2] flex items-center justify-center mb-2">
          <Zap size={18} className="text-white" />
        </div>
        {[
          { Icon: LayoutGrid, active: false },
          { Icon: BarChart2, active: true },
          { Icon: Settings, active: false },
        ].map(({ Icon, active }, i) => (
          <button key={i} className={cn(
            "relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
            active ? "bg-[#5865f2]/20 text-[#bec2ff]" : "text-[#8f8fa0] hover:bg-[#292a2d] hover:text-[#e3e2e6]"
          )}>
            {active && <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-white" />}
            <Icon size={18} />
          </button>
        ))}
        <div className="flex-1" />
        <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center text-xs font-bold text-white">A</div>
      </aside>

      {/* ── Sidebar ── */}
      <aside className="w-[240px] shrink-0 flex flex-col bg-[#1a1b1e] border-r border-[#343538]">
        <button className="flex items-center justify-between px-4 h-12 border-b border-[#343538] font-semibold text-sm text-[#e3e2e6] hover:bg-[#292a2d] transition-colors shrink-0">
          NitroForms <ChevronDown size={14} className="text-[#8f8fa0]" />
        </button>
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          <div className="px-1 py-2">
            <Link href="/builder" className="flex items-center gap-2 w-full px-3 py-2 rounded bg-[#5865f2] text-white text-sm font-medium hover:bg-[#4752c4] transition-colors">
              <Plus size={15} /> Create Form
            </Link>
          </div>
          {["customer-feedback", "internship-application", "beta-signup", "event-rsvp"].map((f, i) => (
            <Link key={f} href="/analytics" className={cn(
              "flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors",
              i === 0 ? "bg-[#292a2d] text-[#e3e2e6]" : "text-[#8f8fa0] hover:bg-[#292a2d] hover:text-[#e3e2e6]"
            )}>
              <Hash size={14} className={i === 0 ? "text-[#bec2ff]" : "text-[#454655]"} />
              <span className="truncate">{f}</span>
            </Link>
          ))}
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-12 shrink-0 flex items-center justify-between px-4 border-b border-[#343538] bg-[#1f1f23]">
          <div className="flex items-center gap-2">
            <BarChart2 size={18} className="text-[#8f8fa0]" />
            <span className="font-semibold text-sm text-[#e3e2e6]">analytics</span>
            <div className="w-px h-4 bg-[#343538] mx-1" />
            <span className="text-sm text-[#8f8fa0]">Product Feedback Survey</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs border border-[#343538] text-[#c6c5d7] hover:bg-[#292a2d] transition-colors">
              <Calendar size={12} /> Last 30 Days
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs border border-[#343538] text-[#c6c5d7] hover:bg-[#292a2d] transition-colors">
              <Download size={12} /> Export CSV
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-[#121316] p-6">
          <div className="max-w-5xl">

            {/* Form title */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#e3e2e6]">Product Feedback Survey</h1>
              <p className="text-sm text-[#8f8fa0] mt-1">Live since Oct 24, 2023 · 1,248 total views</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {[
                { label: "Total Responses", value: "842", sub: "+12% from last month", Icon: Users },
                { label: "Completion Rate", value: "68.5%", sub: null, Icon: BarChart2 },
                { label: "Avg Completion Time", value: "2m 45s", sub: "Optimized for mobile", Icon: Clock },
                { label: "Rating Average", value: "4.8/5.0", sub: null, Icon: Star },
              ].map(({ label, value, sub, Icon }) => (
                <div key={label} className="rounded-lg p-4 bg-[#1f1f23] border border-[#343538]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#8f8fa0]">{label}</span>
                    <Icon size={14} className="text-[#454655]" />
                  </div>
                  <p className="text-xl font-bold text-[#e3e2e6]">{value}</p>
                  {sub && <p className="text-[11px] text-[#8f8fa0] mt-1 flex items-center gap-1"><TrendingUp size={10} className="text-[#5865f2]" />{sub}</p>}
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {/* Response timeline */}
              <div className="col-span-2 rounded-lg p-4 bg-[#1f1f23] border border-[#343538]">
                <p className="text-sm font-semibold text-[#e3e2e6] mb-4">Response Timeline</p>
                {/* Fake chart bars */}
                <div className="flex items-end gap-1 h-28">
                  {[35, 52, 40, 68, 45, 72, 58, 80, 62, 90, 75, 85, 70, 95, 82, 60, 78, 88, 65, 92, 70, 55, 85, 78, 90, 68, 82, 75, 88, 95].map((h, i) => (
                    <div key={i} className="flex-1 rounded-sm bg-[#5865f2]/40 hover:bg-[#5865f2] transition-colors" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-[#8f8fa0]">
                  <span>Oct 01</span><span>Oct 07</span><span>Oct 14</span><span>Oct 21</span><span>Oct 30</span>
                </div>
              </div>

              {/* Device breakdown */}
              <div className="rounded-lg p-4 bg-[#1f1f23] border border-[#343538]">
                <p className="text-sm font-semibold text-[#e3e2e6] mb-4">Device Breakdown</p>
                <div className="space-y-3">
                  {DEVICES.map(({ label, pct, count }) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#c6c5d7]">{label}</span>
                        <span className="text-[#8f8fa0]">{count} resp.</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[#343538]">
                        <div className="h-full rounded-full bg-[#5865f2]" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-[10px] text-[#8f8fa0] mt-0.5">{pct}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Responses table */}
            <div className="rounded-lg overflow-hidden bg-[#1f1f23] border border-[#343538]">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#343538]">
                <p className="text-sm font-semibold text-[#e3e2e6]">Latest Responses</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#292a2d] border border-[#343538]">
                    <Search size={12} className="text-[#8f8fa0]" />
                    <input placeholder="Search..." className="bg-transparent text-xs text-[#e3e2e6] placeholder:text-[#8f8fa0] outline-none w-24" />
                  </div>
                </div>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#343538]">
                    {["Date", "Email", "Rating", "Feedback", "Status", ""].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-[10px] font-mono uppercase tracking-widest text-[#8f8fa0]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RESPONSES.map((r, i) => (
                    <tr key={i} className={cn("hover:bg-[#292a2d]/40 transition-colors", i < RESPONSES.length - 1 && "border-b border-[#343538]/60")}>
                      <td className="px-4 py-3 text-xs text-[#8f8fa0] whitespace-nowrap">{r.date}</td>
                      <td className="px-4 py-3 text-sm text-[#c6c5d7]">{r.email}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, s) => (
                            <Star key={s} size={11} className={s < r.rating ? "text-[#faa61a] fill-[#faa61a]" : "text-[#343538]"} />
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#c6c5d7] max-w-[260px] truncate">{r.feedback}</td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[11px] font-mono",
                          r.status === "Verified" ? "bg-[#5865f2]/15 text-[#bec2ff]" : "bg-[#343538] text-[#8f8fa0]"
                        )}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button className="p-1 rounded text-[#8f8fa0] hover:bg-[#343538] hover:text-[#e3e2e6] transition-colors">
                          <MoreVertical size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-3 border-t border-[#343538] text-center">
                <Link href="#" className="text-xs text-[#5865f2] hover:underline">View all 842 responses</Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
