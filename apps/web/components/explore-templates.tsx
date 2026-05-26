"use client";

import Link from "next/link";
import {
  BarChart2,
  Code2,
  Eye,
  LayoutGrid,
  Plus,
  Search,
  Settings,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "~/lib/utils";

const TEMPLATES = [
  { category: "Entertainment", title: "Anime Fan Survey", stat: "1.2k responses", statIcon: Users, badge: null },
  { category: "Gaming", title: "Gaming Community Signup", stat: "840 responses", statIcon: Users, badge: "Verified" },
  { category: "Product", title: "Product Feedback Sprint", stat: "High engagement", statIcon: BarChart2, badge: null },
  { category: "Social", title: "Movie Night RSVP", stat: "Upcoming", statIcon: null, badge: "Event" },
  { category: "Hiring", title: "Developer Hiring Form", stat: "Logic included", statIcon: Code2, badge: null },
];

export function ExploreTemplates() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#121316] text-[#e3e2e6]">

      {/* Rail */}
      <aside className="w-[72px] shrink-0 bg-[#1a1b1e] border-r border-[#343538] flex flex-col items-center py-4 gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#5865f2] flex items-center justify-center mb-2">
          <Zap size={18} className="text-white" />
        </div>
        {[
          { Icon: LayoutGrid, active: false },
          { Icon: BarChart2, active: false },
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

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 h-14 flex items-center justify-between px-6 bg-[#1f1f23] border-b border-[#343538]">
          <span className="text-lg font-bold text-[#e3e2e6]">Explore Templates</span>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8f8fa0]" />
              <input className="bg-[#0d0e11] border border-[#454655] rounded-lg pl-9 pr-4 py-1.5 text-sm text-[#e3e2e6] placeholder:text-[#8f8fa0] focus:border-[#5865f2] outline-none w-56" placeholder="Search templates..." />
            </div>
            <Link href="/builder" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#5865f2] text-white text-sm font-medium hover:bg-[#4752c4] transition-colors">
              <Plus size={14} /> Create Form
            </Link>
          </div>
        </header>

        <div className="p-6 max-w-6xl mx-auto">
          {/* Intro */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#e3e2e6] mb-2">Explore Templates</h1>
            <p className="text-base text-[#8f8fa0] max-w-2xl">Jumpstart your workflow with hand-crafted templates designed for high-conversion data collection and community engagement.</p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-3 gap-4">
            {TEMPLATES.map(({ category, title, stat, statIcon: StatIcon, badge }) => (
              <div key={title} className="rounded-xl p-5 bg-[#2b2d31] border border-[#3f4147] hover:border-[#5865f2] hover:shadow-[0_0_15px_rgba(88,101,242,0.15)] transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#8f8fa0]">{category}</span>
                  {badge && <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#5865f2]/15 text-[#bec2ff]">{badge}</span>}
                </div>
                <h3 className="text-base font-semibold text-[#e3e2e6] mb-3">{title}</h3>
                <div className="flex items-center gap-1.5 text-xs text-[#8f8fa0] mb-4">
                  {StatIcon && <StatIcon size={12} />}
                  <span>{stat}</span>
                </div>
                <div className="flex gap-2">
                  <Link href="/f/demo" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#454655] text-xs text-[#c6c5d7] hover:bg-[#292a2d] transition-colors">
                    <Eye size={12} /> Preview
                  </Link>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5865f2] text-xs text-white hover:bg-[#4752c4] transition-colors">
                    Use template
                  </button>
                </div>
              </div>
            ))}

            {/* Blank template card */}
            <Link href="/builder" className="rounded-xl p-5 border-2 border-dashed border-[#454655] hover:border-[#5865f2] transition-colors flex flex-col items-center justify-center gap-3 min-h-[180px] group">
              <Plus size={24} className="text-[#454655] group-hover:text-[#5865f2] transition-colors" />
              <div className="text-center">
                <p className="text-sm font-semibold text-[#c6c5d7] group-hover:text-[#e3e2e6]">Custom Template</p>
                <p className="text-xs text-[#8f8fa0]">Start from a blank canvas</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
