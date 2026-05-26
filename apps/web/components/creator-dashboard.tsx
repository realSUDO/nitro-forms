"use client";

import Link from "next/link";
import { cn } from "~/lib/utils";

const FORMS = [
  { id: "1", name: "customer-feedback", label: "Customer Feedback Survey", status: "Draft", responses: 124, lastActive: "2 mins ago", color: "bg-[#bec2ff]/20 text-[#bec2ff]", icon: "💬" },
  { id: "2", name: "internship-application", label: "Internship Application 2024", status: "Published", responses: 892, lastActive: "1 hour ago", color: "bg-[#98cbff]/20 text-[#98cbff]", icon: "💼" },
  { id: "3", name: "beta-signup", label: "Beta Access Signup", status: "Draft", responses: 12, lastActive: "Yesterday", color: "bg-[#c6c5d7]/20 text-[#c6c5d7]", icon: "🚀" },
];

const ACTIVITY = [
  { bg: "bg-[#b6c4ff]/10 text-[#b6c4ff]", icon: "✉️", bold: "New Response", text: " on Customer Feedback.", time: "Just now" },
  { bg: "bg-[#bec2ff]/10 text-[#bec2ff]", icon: "🔄", bold: "Nitro Update", text: " v2.4 is now live.", time: "45m ago" },
  { bg: "bg-[#98cbff]/10 text-[#98cbff]", icon: "👤", bold: "John Doe", text: " joined Main Team.", time: "2h ago" },
];

export function CreatorDashboard() {
  return (
    <div className="flex h-screen bg-[#121316] text-[#e3e2e6] overflow-hidden font-sans">

      {/* ── Rail 72px ── */}
      <nav className="w-[72px] shrink-0 flex flex-col items-center py-4 bg-[#0d0e11] border-r border-[#454655]/10 z-50 space-y-4">
        <div className="mb-4">
          <span className="text-2xl font-black text-[#bec2ff]">N</span>
        </div>
        {/* Active workspace */}
        <button className="relative flex items-center justify-center w-12 h-12 bg-[#5865f2] text-white rounded-xl before:absolute before:left-[-12px] before:w-1 before:h-8 before:bg-white before:rounded-r-full">
          ⊞
        </button>
        <button className="flex items-center justify-center w-12 h-12 text-[#c6c5d7] hover:bg-[#343538] hover:rounded-2xl transition-all">
          ⚡
        </button>
        <button className="flex items-center justify-center w-12 h-12 text-[#c6c5d7] hover:bg-[#343538] hover:rounded-2xl transition-all">
          ⊡
        </button>
        <div className="flex-grow" />
        <button className="flex items-center justify-center w-12 h-12 text-[#c6c5d7] hover:bg-[#343538] hover:rounded-2xl transition-all">
          ⚙
        </button>
      </nav>

      {/* ── Sidebar 240px ── */}
      <aside className="w-[240px] shrink-0 flex flex-col py-6 space-y-2 bg-[#1a1b1e] border-r border-[#454655]/10 overflow-y-auto">
        <div className="px-6 mb-6">
          <h2 className="text-[11px] font-mono uppercase tracking-widest text-[#8f8fa0]">Workspaces</h2>
          <p className="text-xs text-[#8f8fa0] mt-0.5">Main Team</p>
        </div>
        <div className="px-4 mb-4">
          <Link href="/builder" className="w-full py-2.5 bg-[#5865f2] text-white text-sm rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all">
            <span className="text-lg leading-none">+</span>
            <span className="font-mono text-xs">Create Form</span>
          </Link>
        </div>

        {/* Drafts */}
        <div className="space-y-1">
          <div className="px-6 py-2 flex items-center justify-between text-[#8f8fa0]">
            <span className="text-[11px] font-mono uppercase tracking-widest">DRAFTS</span>
            <span className="text-xs">▾</span>
          </div>
          {FORMS.filter(f => f.status === "Draft").map((f, i) => (
            <Link key={f.id} href="/builder" className={cn(
              "flex items-center gap-3 rounded-lg mx-2 px-3 py-2 text-sm transition-colors",
              i === 0 ? "bg-[#28418e]/30 text-[#e3e2e6] font-bold translate-x-1" : "text-[#c6c5d7] hover:bg-[#343538]/40 hover:text-[#e3e2e6]"
            )}>
              <span className="text-[#8f8fa0]">#</span>
              <span className="truncate">{f.name}</span>
            </Link>
          ))}
        </div>

        {/* Published */}
        <div className="space-y-1 mt-4">
          <div className="px-6 py-2 flex items-center justify-between text-[#8f8fa0]">
            <span className="text-[11px] font-mono uppercase tracking-widest">PUBLISHED</span>
            <span className="text-xs">▾</span>
          </div>
          {FORMS.filter(f => f.status === "Published").map(f => (
            <Link key={f.id} href="/builder" className="flex items-center gap-3 text-[#c6c5d7] hover:bg-[#343538]/40 hover:text-[#e3e2e6] rounded-lg mx-2 px-3 py-2 text-sm transition-colors">
              <span className="text-[#8f8fa0]/50">#</span>
              <span className="truncate">{f.name}</span>
            </Link>
          ))}
        </div>

        {/* Templates */}
        <div className="space-y-1 mt-4">
          <div className="px-6 py-2 flex items-center justify-between text-[#8f8fa0]">
            <span className="text-[11px] font-mono uppercase tracking-widest">TEMPLATES</span>
            <span className="text-xs">▾</span>
          </div>
          {[{ icon: "🎮", name: "Gaming" }, { icon: "🚀", name: "Startup" }].map(t => (
            <Link key={t.name} href="/explore" className="flex items-center gap-3 text-[#c6c5d7] hover:bg-[#343538]/40 hover:text-[#e3e2e6] rounded-lg mx-2 px-3 py-2 text-sm transition-colors">
              <span>{t.icon}</span>
              <span className="truncate">{t.name}</span>
            </Link>
          ))}
        </div>
      </aside>

      {/* ── Top bar ── */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-12 flex justify-between items-center px-6 bg-[#1f1f23] border-b border-[#454655]/20 shrink-0">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-extrabold text-[#bec2ff]">NitroForms</h1>
            <nav className="flex items-center gap-6">
              {["Builder", "Preview", "Responses", "Analytics"].map((tab, i) => (
                <Link key={tab} href={i === 0 ? "/builder" : "#"} className={cn(
                  "pb-1 text-[13px] font-mono transition-colors",
                  i === 0 ? "text-[#e3e2e6] border-b-2 border-[#5865f2] font-bold" : "text-[#8f8fa0] hover:text-[#e3e2e6]"
                )}>
                  {tab}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-1.5 border border-[#454655] text-[#e3e2e6] rounded-lg text-xs font-mono hover:bg-[#343538]/30 transition-colors">Share</button>
            <button className="px-4 py-1.5 bg-[#bec2ff] text-[#000da4] rounded-lg text-xs font-mono hover:opacity-90 transition-opacity">Publish</button>
          </div>
        </header>

        {/* ── Main + Right panel ── */}
        <div className="flex flex-1 min-h-0">

          {/* Main stage */}
          <main className="flex-1 overflow-y-auto p-6 bg-[#121316]">
            {/* Header */}
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-[32px] font-bold leading-tight tracking-tight text-[#e3e2e6]">Creator Dashboard</h2>
                <p className="text-[#c6c5d7] text-sm mt-1">Welcome back, Nitro Explorer. Here&apos;s your performance snapshot.</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-[#c6c5d7] hover:bg-[#343538] rounded-lg transition-colors">⊟</button>
                <button className="p-2 text-[#c6c5d7] hover:bg-[#343538] rounded-lg transition-colors">📅</button>
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "Total Forms", value: "24", delta: "+12%", color: "text-[#bec2ff]", bar: "bg-[#bec2ff]", w: "w-2/3", icon: "📄", deltaColor: "text-green-400" },
                { label: "Total Responses", value: "1,842", delta: "+8%", color: "text-[#b6c4ff]", bar: "bg-[#b6c4ff]", w: "w-1/2", icon: "💬", deltaColor: "text-green-400" },
                { label: "Completion Rate", value: "76.4%", delta: "-2%", color: "text-[#98cbff]", bar: "bg-[#98cbff]", w: "w-3/4", icon: "✅", deltaColor: "text-[#c6c5d7]" },
              ].map(s => (
                <div key={s.label} className="relative overflow-hidden rounded-2xl border border-[#454655]/10 p-6" style={{ background: "rgba(43,45,49,0.6)", backdropFilter: "blur(10px)" }}>
                  <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">{s.icon}</div>
                  <h3 className="text-[11px] font-mono uppercase tracking-widest text-[#8f8fa0] mb-4">{s.label}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className={cn("text-[32px] font-bold leading-tight", s.color)}>{s.value}</span>
                    <span className={cn("text-[11px] font-mono", s.deltaColor)}>{s.delta}</span>
                  </div>
                  <div className="mt-4 h-1 w-full bg-[#343538] rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", s.bar, s.w)} />
                  </div>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-[#e3e2e6]">Recent Activity</h3>
                <Link href="#" className="text-[#bec2ff] text-[13px] font-mono hover:underline">View All</Link>
              </div>
              <div className="rounded-2xl border border-[#454655]/10 overflow-hidden" style={{ background: "rgba(43,45,49,0.6)", backdropFilter: "blur(10px)" }}>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#454655]/10 bg-[#292a2d]/50">
                      {["FORM NAME", "STATUS", "RESPONSES", "LAST ACTIVE", "ACTION"].map(h => (
                        <th key={h} className="px-6 py-4 text-[11px] font-mono uppercase tracking-widest text-[#8f8fa0]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#454655]/5">
                    {FORMS.map(f => (
                      <tr key={f.id} className="hover:bg-[#343538]/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={cn("w-8 h-8 rounded flex items-center justify-center text-sm", f.color)}>
                              {f.icon}
                            </div>
                            <span className="font-semibold text-sm text-[#e3e2e6]">{f.label}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[11px] font-mono border",
                            f.status === "Published"
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : "bg-[#28418e]/30 text-[#b6c4ff] border-[#b6c4ff]/20"
                          )}>
                            {f.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[13px] font-mono text-[#e3e2e6]">{f.responses}</td>
                        <td className="px-6 py-4 text-xs text-[#8f8fa0]">{f.lastActive}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 hover:text-[#bec2ff] transition-colors text-[#8f8fa0]">⋮</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>

          {/* ── Right panel 300px ── */}
          <aside className="w-[300px] shrink-0 bg-[#1f1f23] border-l border-[#454655]/20 p-6 overflow-y-auto">
            {/* Profile */}
            <div className="flex flex-col items-center mb-8 pb-8 border-b border-[#454655]/10">
              <div className="relative w-20 h-20 mb-4">
                <div className="w-full h-full rounded-2xl bg-[#5865f2] flex items-center justify-center text-3xl font-bold text-white border-2 border-[#5865f2]/50">
                  A
                </div>
                <div className="absolute bottom-[-4px] right-[-4px] w-5 h-5 bg-green-500 border-4 border-[#1f1f23] rounded-full" />
              </div>
              <h3 className="text-xl font-semibold text-[#e3e2e6]">Alex Rivera</h3>
              <p className="text-[11px] font-mono text-[#8f8fa0]">Product Designer • Pro</p>
            </div>

            {/* Quick actions */}
            <div className="mb-8">
              <h4 className="text-[11px] font-mono uppercase tracking-widest text-[#8f8fa0] mb-4">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: "📊", label: "Reports", color: "text-[#bec2ff]" },
                  { icon: "👤", label: "Invite", color: "text-[#b6c4ff]" },
                  { icon: "🔌", label: "API Docs", color: "text-[#98cbff]" },
                  { icon: "❓", label: "Support", color: "text-[#ffb4ab]" },
                ].map(a => (
                  <button key={a.label} className="flex flex-col items-center justify-center p-4 bg-[#292a2d] rounded-xl hover:bg-[#343538] transition-colors group">
                    <span className={cn("text-xl mb-2", a.color)}>{a.icon}</span>
                    <span className="text-[11px] font-mono text-[#8f8fa0] group-hover:text-[#e3e2e6]">{a.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live activity */}
            <div>
              <h4 className="text-[11px] font-mono uppercase tracking-widest text-[#8f8fa0] mb-4">Live Activity</h4>
              <div className="space-y-4">
                {ACTIVITY.map((a, i) => (
                  <div key={i} className="flex gap-3">
                    <div className={cn("shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm", a.bg)}>
                      {a.icon}
                    </div>
                    <div>
                      <p className="text-xs text-[#c6c5d7]">
                        <span className="font-bold text-[#e3e2e6]">{a.bold}</span>{a.text}
                      </p>
                      <span className="text-[11px] font-mono text-[#8f8fa0]">{a.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upgrade */}
            <div className="mt-8 p-4 rounded-xl" style={{ background: "linear-gradient(135deg, #5865f2, #28418e)" }}>
              <h5 className="text-xl font-semibold text-white mb-1">Upgrade Nitro</h5>
              <p className="text-xs text-white/90 mb-4">Unlock advanced logic and unlimited responses.</p>
              <Link href="/pricing" className="block w-full py-2 text-center bg-white/20 hover:bg-white/30 rounded-lg text-xs font-mono text-white transition-colors backdrop-blur-md">
                Learn More
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
