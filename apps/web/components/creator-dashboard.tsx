"use client";

import Link from "next/link";
import {
  BarChart2,
  Bell,
  BookTemplate,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  Hash,
  LayoutDashboard,
  MoreVertical,
  Plus,
  Settings,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "~/lib/utils";

// ─── Static demo data ─────────────────────────────────────────────────────────

const FORMS = [
  { id: "1", name: "customer-feedback", label: "Customer Feedback Survey", status: "Draft", responses: 124, lastActive: "2 mins ago", icon: "💬" },
  { id: "2", name: "internship-application", label: "Internship Application 2024", status: "Published", responses: 892, lastActive: "1 hour ago", icon: "💼" },
  { id: "3", name: "beta-signup", label: "Beta Access Signup", status: "Draft", responses: 12, lastActive: "Yesterday", icon: "🚀" },
  { id: "4", name: "event-rsvp", label: "Community Event RSVP", status: "Published", responses: 341, lastActive: "3 hours ago", icon: "📅" },
];

const TEMPLATES = [
  { name: "Gaming", icon: "🎮" },
  { name: "Startup", icon: "🚀" },
  { name: "Anime", icon: "⚡" },
  { name: "Movie", icon: "🎬" },
];

const ACTIVITY = [
  { icon: "✉️", text: "New Response on Customer Feedback.", time: "Just now" },
  { icon: "🔄", text: "Nitro Update v2.4 is now live.", time: "45m ago" },
  { icon: "👤", text: "John Doe joined Main Team.", time: "2h ago" },
];

const STATS = [
  { label: "Total Forms", value: "24", delta: "+12%", up: true, icon: FileText },
  { label: "Total Responses", value: "1,842", delta: "+8%", up: true, icon: Users },
  { label: "Completion Rate", value: "76.4%", delta: "-2%", up: false, icon: BarChart2 },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function CreatorDashboard() {
  return (
    <div className="flex h-screen bg-[#121316] text-[#e3e2e6] overflow-hidden">

      {/* ── Rail ── */}
      <aside className="w-[72px] shrink-0 bg-[#1a1b1e] border-r border-[#343538] flex flex-col items-center py-4 gap-2">
        <div className="w-10 h-10 rounded-xl bg-[#5865f2] flex items-center justify-center mb-3">
          <Zap size={18} className="text-white" />
        </div>
        {[
          { icon: LayoutDashboard, active: true, href: "/dashboard" },
          { icon: BookTemplate, active: false, href: "/explore" },
          { icon: Settings, active: false, href: "#" },
        ].map(({ icon: Icon, active, href }, i) => (
          <Link
            key={i}
            href={href}
            className={cn(
              "relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
              active ? "bg-[#5865f2]/20 text-[#bec2ff]" : "text-[#8f8fa0] hover:bg-[#292a2d] hover:text-[#e3e2e6]"
            )}
          >
            {active && <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-white" />}
            <Icon size={18} />
          </Link>
        ))}
        {/* Avatar at bottom */}
        <div className="mt-auto w-9 h-9 rounded-full bg-[#5865f2] flex items-center justify-center text-sm font-bold text-white">
          A
        </div>
      </aside>

      {/* ── Sidebar ── */}
      <aside className="w-[240px] shrink-0 bg-[#1a1b1e] border-r border-[#343538] flex flex-col">
        {/* Workspace header */}
        <div className="px-4 py-3 border-b border-[#343538] flex items-center justify-between">
          <span className="text-sm font-semibold text-[#e3e2e6]">Main Team</span>
          <ChevronDown size={14} className="text-[#8f8fa0]" />
        </div>

        {/* New form button */}
        <div className="px-3 py-2">
          <Link
            href="/builder"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-[#5865f2]/10 border border-[#5865f2]/30 text-[#bec2ff] text-sm hover:bg-[#5865f2]/20 transition-colors"
          >
            <Plus size={14} />
            Create Form
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-4">
          {/* Drafts */}
          <div>
            <button className="w-full flex items-center gap-1 px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-[#8f8fa0] hover:text-[#e3e2e6]">
              <ChevronDown size={10} /> DRAFTS
            </button>
            {FORMS.filter(f => f.status === "Draft").map(f => (
              <Link
                key={f.id}
                href={`/builder`}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-[#c6c5d7] hover:bg-[#292a2d] hover:text-[#e3e2e6] transition-colors"
              >
                <Hash size={13} className="text-[#8f8fa0] shrink-0" />
                <span className="truncate">{f.name}</span>
              </Link>
            ))}
          </div>

          {/* Published */}
          <div>
            <button className="w-full flex items-center gap-1 px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-[#8f8fa0] hover:text-[#e3e2e6]">
              <ChevronDown size={10} /> PUBLISHED
            </button>
            {FORMS.filter(f => f.status === "Published").map(f => (
              <Link
                key={f.id}
                href={`/builder`}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-[#c6c5d7] hover:bg-[#292a2d] hover:text-[#e3e2e6] transition-colors"
              >
                <Hash size={13} className="text-[#5865f2] shrink-0" />
                <span className="truncate">{f.name}</span>
              </Link>
            ))}
          </div>

          {/* Templates */}
          <div>
            <button className="w-full flex items-center gap-1 px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-[#8f8fa0] hover:text-[#e3e2e6]">
              <ChevronDown size={10} /> TEMPLATES
            </button>
            {TEMPLATES.map(t => (
              <Link
                key={t.name}
                href="/explore"
                className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-[#c6c5d7] hover:bg-[#292a2d] hover:text-[#e3e2e6] transition-colors"
              >
                <span className="text-xs">{t.icon}</span>
                <span className="truncate">{t.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top bar */}
        <header className="h-12 border-b border-[#343538] flex items-center px-6 gap-4 shrink-0">
          <span className="text-sm font-semibold text-[#e3e2e6]">Creator Dashboard</span>
          <div className="ml-auto flex items-center gap-2">
            <button className="p-2 rounded-lg text-[#8f8fa0] hover:bg-[#292a2d] hover:text-[#e3e2e6] transition-colors">
              <Bell size={16} />
            </button>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Welcome */}
          <div>
            <h1 className="text-xl font-semibold text-[#e3e2e6]">Welcome back, Nitro Explorer.</h1>
            <p className="text-sm text-[#8f8fa0] mt-0.5">Here&apos;s your performance snapshot.</p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-4">
            {STATS.map(({ label, value, delta, up, icon: Icon }) => (
              <div key={label} className="bg-[#1f1f23] border border-[#343538] rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#8f8fa0]">{label}</span>
                  <Icon size={14} className="text-[#8f8fa0]" />
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-[#e3e2e6]">{value}</span>
                  <span className={cn("flex items-center gap-0.5 text-xs mb-0.5", up ? "text-emerald-400" : "text-red-400")}>
                    {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {delta}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Forms table */}
          <div className="bg-[#1f1f23] border border-[#343538] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#343538]">
              <span className="text-sm font-medium text-[#e3e2e6]">Recent Activity</span>
              <Link href="#" className="text-xs text-[#5865f2] hover:text-[#bec2ff] flex items-center gap-1">
                View All <ChevronRight size={12} />
              </Link>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#343538]">
                  {["Form Name", "Status", "Responses", "Last Active", ""].map(h => (
                    <th key={h} className="px-5 py-2.5 text-left text-[10px] font-mono uppercase tracking-widest text-[#8f8fa0]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FORMS.map((form, i) => (
                  <tr key={form.id} className={cn("hover:bg-[#292a2d] transition-colors", i < FORMS.length - 1 && "border-b border-[#343538]/50")}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{form.icon}</span>
                        <span className="text-[#e3e2e6] font-medium">{form.label}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-mono",
                        form.status === "Published"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-[#343538] text-[#8f8fa0]"
                      )}>
                        {form.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[#c6c5d7]">{form.responses.toLocaleString()}</td>
                    <td className="px-5 py-3 text-[#8f8fa0] flex items-center gap-1.5">
                      <Clock size={12} /> {form.lastActive}
                    </td>
                    <td className="px-5 py-3">
                      <button className="p-1 rounded hover:bg-[#343538] text-[#8f8fa0] hover:text-[#e3e2e6] transition-colors">
                        <MoreVertical size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ── Right Panel ── */}
      <aside className="w-[260px] shrink-0 bg-[#1a1b1e] border-l border-[#343538] flex flex-col overflow-y-auto">
        {/* User card */}
        <div className="p-4 border-b border-[#343538]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#5865f2] flex items-center justify-center text-sm font-bold text-white shrink-0">
              A
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#e3e2e6] truncate">Alex Rivera</p>
              <p className="text-xs text-[#8f8fa0] truncate">Product Designer · Pro</p>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="p-4 border-b border-[#343538]">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#8f8fa0] mb-3">Quick Actions</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: BarChart2, label: "Reports" },
              { icon: UserPlus, label: "Invite" },
              { icon: FileText, label: "API Docs" },
              { icon: Settings, label: "Support" },
            ].map(({ icon: Icon, label }) => (
              <button key={label} className="flex flex-col items-center gap-1.5 py-2.5 rounded-lg bg-[#292a2d] hover:bg-[#343538] transition-colors text-[#c6c5d7] hover:text-[#e3e2e6]">
                <Icon size={15} />
                <span className="text-[10px]">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live activity */}
        <div className="p-4 flex-1">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#8f8fa0] mb-3">Live Activity</p>
          <div className="space-y-3">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="flex gap-2.5">
                <span className="text-base shrink-0 mt-0.5">{a.icon}</span>
                <div>
                  <p className="text-xs text-[#c6c5d7] leading-snug">{a.text}</p>
                  <p className="text-[10px] text-[#8f8fa0] mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade banner */}
        <div className="m-4 p-3 rounded-xl bg-[#5865f2]/10 border border-[#5865f2]/20">
          <p className="text-xs font-semibold text-[#bec2ff] mb-1">Upgrade Nitro</p>
          <p className="text-[11px] text-[#8f8fa0] mb-2">Unlock advanced logic and unlimited responses.</p>
          <Link href="/pricing" className="text-[11px] text-[#5865f2] hover:text-[#bec2ff] font-medium">
            Learn More →
          </Link>
        </div>
      </aside>
    </div>
  );
}
