"use client";

import Link from "next/link";
import {
  BarChart2,
  ChevronDown,
  Clock,
  FileText,
  Hash,
  HelpCircle,
  LayoutGrid,
  MessageSquare,
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

const FORMS = [
  { id: "1", name: "customer-feedback",     label: "Customer Feedback Survey",   status: "Draft",     responses: 124,  lastActive: "2 mins ago",  Icon: MessageSquare },
  { id: "2", name: "internship-application", label: "Internship Application 2024", status: "Published", responses: 892,  lastActive: "1 hour ago",  Icon: FileText },
  { id: "3", name: "beta-signup",            label: "Beta Access Signup",          status: "Draft",     responses: 12,   lastActive: "Yesterday",   Icon: Users },
  { id: "4", name: "event-rsvp",             label: "Community Event RSVP",        status: "Published", responses: 341,  lastActive: "3 hours ago", Icon: FileText },
];

const ACTIVITY = [
  { Icon: MessageSquare, bold: "New Response", text: " on Customer Feedback.", time: "Just now" },
  { Icon: Zap,           bold: "Nitro Update", text: " v2.4 is now live.",     time: "45m ago"  },
  { Icon: UserPlus,      bold: "John Doe",     text: " joined Main Team.",      time: "2h ago"   },
];

export function CreatorDashboard() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#121316] text-[#e3e2e6]">

      {/* ── Rail — matches form-builder exactly ── */}
      <aside className="w-[72px] shrink-0 bg-[#1a1b1e] border-r border-[#343538] flex flex-col items-center py-4 gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#5865f2] flex items-center justify-center mb-2">
          <Zap size={18} className="text-white" />
        </div>
        {[
          { Icon: LayoutGrid, active: true },
          { Icon: BarChart2,  active: false },
          { Icon: Settings,   active: false },
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

      {/* ── Channel Sidebar ── */}
      <aside className="w-[240px] shrink-0 flex flex-col bg-[#1a1b1e] border-r border-[#343538]">
        {/* Server name */}
        <button className="flex items-center justify-between px-4 h-12 border-b border-[#343538] font-semibold text-sm text-[#e3e2e6] hover:bg-[#292a2d] transition-colors shrink-0">
          NitroForms
          <ChevronDown size={16} className="text-[#8f8fa0]" />
        </button>

        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          <div className="px-1 py-2">
            <Link href="/builder" className="flex items-center gap-2 w-full px-3 py-2 rounded bg-[#5865f2] text-white text-sm font-medium hover:bg-[#4752c4] transition-colors">
              <Plus size={15} /> Create Form
            </Link>
          </div>

          {[
            { label: "DRAFTS",    forms: FORMS.filter(f => f.status === "Draft") },
            { label: "PUBLISHED", forms: FORMS.filter(f => f.status === "Published") },
          ].map(({ label, forms }) => (
            <div key={label} className="pt-3">
              <button className="flex items-center gap-1 w-full px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#8f8fa0] hover:text-[#c6c5d7] transition-colors">
                <ChevronDown size={11} /> {label}
              </button>
              {forms.map((f, i) => (
                <Link key={f.id} href="/builder" className={cn(
                  "flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors mt-0.5",
                  i === 0 && label === "DRAFTS"
                    ? "bg-[#292a2d] text-[#e3e2e6]"
                    : "text-[#8f8fa0] hover:bg-[#292a2d] hover:text-[#c6c5d7]"
                )}>
                  <Hash size={15} className={cn("shrink-0", i === 0 && label === "DRAFTS" ? "text-[#c6c5d7]" : "text-[#454655]")} />
                  <span className="truncate">{f.name}</span>
                </Link>
              ))}
            </div>
          ))}

          <div className="pt-3">
            <button className="flex items-center gap-1 w-full px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#8f8fa0] hover:text-[#c6c5d7] transition-colors">
              <ChevronDown size={11} /> TEMPLATES
            </button>
            {[{ Icon: LayoutGrid, n: "gaming-forms" }, { Icon: Zap, n: "startup-forms" }].map(({ Icon: TplIcon, n }) => (
              <Link key={n} href="/explore" className="flex items-center gap-2 px-2 py-1.5 rounded text-sm text-[#8f8fa0] hover:bg-[#292a2d] hover:text-[#c6c5d7] transition-colors mt-0.5">
                <TplIcon size={14} className="text-[#454655]" />
                <span className="truncate">{n}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* User bar */}
        <div className="flex items-center gap-2 px-2 py-2 bg-[#121316] shrink-0 border-t border-[#343538]">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center text-xs font-bold text-white">A</div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#5865f2] border-2 border-[#1a1b1e]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#e3e2e6] truncate leading-tight">Alex Rivera</p>
            <p className="text-[11px] text-[#8f8fa0] truncate leading-tight">#0001</p>
          </div>
          <Settings size={15} className="text-[#8f8fa0] hover:text-[#c6c5d7] cursor-pointer transition-colors" />
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Channel header */}
        <header className="h-12 shrink-0 flex items-center justify-between px-4 border-b border-[#343538] bg-[#1f1f23]">
          <div className="flex items-center gap-2">
            <LayoutGrid size={18} className="text-[#8f8fa0]" />
            <span className="font-semibold text-sm text-[#e3e2e6]">creator-dashboard</span>
            <div className="w-px h-4 bg-[#343538] mx-1" />
            <span className="text-sm text-[#8f8fa0] hidden md:block">Your workspace overview</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded text-sm border border-[#343538] text-[#c6c5d7] hover:bg-[#343538] transition-colors">Share</button>
            <button className="px-3 py-1.5 rounded text-sm font-semibold bg-[#5865f2] text-white hover:bg-[#4752c4] transition-colors">Publish</button>
          </div>
        </header>

        <div className="flex flex-1 min-h-0">

          {/* Content */}
          <main className="flex-1 overflow-y-auto bg-[#121316]">
            <div className="p-6 max-w-4xl">

              {/* Page title */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#e3e2e6]">Creator Dashboard</h1>
                <p className="text-sm text-[#8f8fa0] mt-1">Welcome back, Nitro Explorer. Here&apos;s your performance snapshot.</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: "Total Forms",     value: "24",     delta: "+12%", up: true,  Icon: FileText    },
                  { label: "Total Responses", value: "1,842",  delta: "+8%",  up: true,  Icon: MessageSquare },
                  { label: "Completion Rate", value: "76.4%",  delta: "-2%",  up: false, Icon: BarChart2   },
                ].map(({ label, value, delta, up, Icon }) => (
                  <div key={label} className="rounded-lg p-4 bg-[#1f1f23] border border-[#343538]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8f8fa0]">{label}</span>
                      <Icon size={14} className="text-[#454655]" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-[#e3e2e6]">{value}</span>
                      <span className={cn("flex items-center gap-0.5 text-xs font-semibold", up ? "text-[#5865f2]" : "text-[#8f8fa0]")}>
                        {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        {delta}
                      </span>
                    </div>
                    <div className="mt-3 h-0.5 rounded-full bg-[#343538]">
                      <div className="h-full rounded-full bg-[#5865f2]" style={{ width: label === "Total Forms" ? "66%" : label === "Total Responses" ? "50%" : "76%" }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div className="rounded-lg overflow-hidden bg-[#1f1f23] border border-[#343538]">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#343538]">
                  <span className="text-sm font-semibold text-[#e3e2e6]">Recent Forms</span>
                  <Link href="#" className="text-xs text-[#bec2ff] hover:underline">View All</Link>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#343538]">
                      {["Form", "Status", "Responses", "Last Active", ""].map(h => (
                        <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8f8fa0]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {FORMS.map(({ id, label, status, responses, lastActive, Icon }, i) => (
                      <tr key={id} className={cn("hover:bg-[#292a2d]/40 transition-colors", i < FORMS.length - 1 && "border-b border-[#343538]/60")}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded bg-[#343538] flex items-center justify-center shrink-0">
                              <Icon size={13} className="text-[#8f8fa0]" />
                            </div>
                            <span className="text-sm text-[#c6c5d7]">{label}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[11px] font-semibold",
                            status === "Published" ? "bg-[#5865f2]/15 text-[#5865f2]" : "bg-[#5865f2]/15 text-[#bec2ff]"
                          )}>
                            {status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#c6c5d7]">{responses.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1.5 text-xs text-[#8f8fa0]">
                            <Clock size={11} />{lastActive}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button className="p-1 rounded text-[#8f8fa0] hover:bg-[#343538] hover:text-[#c6c5d7] transition-colors">
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

          {/* ── Member list ── */}
          <aside className="w-[220px] shrink-0 overflow-y-auto py-4 px-3 bg-[#1a1b1e] border-l border-[#343538] space-y-5">

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8f8fa0] px-2 mb-2">Online — 1</p>
              <div className="flex items-center gap-2.5 px-2 py-1.5 rounded hover:bg-[#292a2d] transition-colors cursor-pointer">
                <div className="relative shrink-0">
                  <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center text-xs font-bold text-white">A</div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#5865f2] border-2 border-[#1a1b1e]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#e3e2e6] truncate">Alex Rivera</p>
                  <p className="text-[11px] text-[#8f8fa0] truncate">Pro · Active</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8f8fa0] px-2 mb-2">Quick Actions</p>
              <div className="grid grid-cols-2 gap-1">
                {[
                  { Icon: BarChart2, label: "Reports" },
                  { Icon: UserPlus,  label: "Invite"  },
                  { Icon: FileText,  label: "API Docs" },
                  { Icon: HelpCircle,label: "Support" },
                ].map(({ Icon, label }) => (
                  <button key={label} className="flex flex-col items-center gap-1.5 py-3 rounded hover:bg-[#292a2d] transition-colors">
                    <Icon size={15} className="text-[#8f8fa0]" />
                    <span className="text-[10px] text-[#8f8fa0]">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8f8fa0] px-2 mb-2">Live Activity</p>
              <div className="space-y-1">
                {ACTIVITY.map(({ Icon, bold, text, time }, i) => (
                  <div key={i} className="flex gap-2.5 px-2 py-2 rounded hover:bg-[#292a2d] transition-colors cursor-pointer">
                    <div className="w-7 h-7 rounded-full bg-[#343538] shrink-0 flex items-center justify-center">
                      <Icon size={13} className="text-[#8f8fa0]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#c6c5d7] leading-snug">
                        <span className="font-semibold text-[#e3e2e6]">{bold}</span>{text}
                      </p>
                      <p className="text-[10px] text-[#8f8fa0] mt-0.5">{time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg p-3 bg-[#5865f2]/10 border border-[#5865f2]/20">
              <p className="text-sm font-semibold text-[#c9cdfb] mb-1">Upgrade Nitro</p>
              <p className="text-xs text-[#8f8fa0] mb-3">Unlock advanced logic and unlimited responses.</p>
              <Link href="/pricing" className="block w-full py-1.5 text-center rounded text-xs font-semibold bg-[#5865f2] text-white hover:bg-[#4752c4] transition-colors">
                Learn More
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
