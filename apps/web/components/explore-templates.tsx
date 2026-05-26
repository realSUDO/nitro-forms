"use client";

import Link from "next/link";
import Image from "next/image";
import {
  BarChart2,
  Code2,
  Eye,
  LayoutGrid,
  Plus,
  Search,
  Settings,
  Timer,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "~/lib/utils";

const TEMPLATES = [
  {
    category: "Entertainment",
    title: "Anime Fan Survey",
    stats: [{ icon: Users, text: "1.2k responses" }, { icon: Timer, text: "3 min" }],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9QrOTygO3iXHj7rLJRP2_4gwCrftKFDxbPX3Dv2JSAk8yGKaXZVIpbMRI-bxi6prSIMN-ohYpTujRaLwxylHLGJYzpDZtFHqPQgx-1vclmEdW68SBTkSmoEBOu1naXmMf17IrO4Nxj8ye1-qyhOohJLBv_m2UrjjofAU5RdXed_FIrKfRZ5CPC7gMG3i1qorSrGua4sDEfHW3__qo-qY7xM60bIIuNDUbKrK-BNpsPOesjHapEgSG0HnSgYiHg80UgzFx1IT7Y3s",
    badgeColor: "bg-[#007ac1]/80 text-white",
  },
  {
    category: "Gaming",
    title: "Gaming Community Signup",
    stats: [{ icon: Users, text: "840 responses" }, { icon: null, text: "Verified" }],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPtNLdYJSXRRCjkQamyjpGoSL6j_hm2NHZBQawgZga2ESMP7Us0XG0J5875ZIJ6djfKq46EM46YnKcIKtdJx1LmLyjVfcC5D-GNcKVcWz0NHcN7Vfyuqnu7w-SFFTDsXDJtEd7YwUUhXimDOg-kmFdBvoR_oO5y-FhKY0LNorbUG-bSHRGyMDweLS1ops3RJqp-fCnmn71a55uWscZZexTNB9ozNtIJyNTt1Yu06wBLsYkeikGv-5_X-Gr0la5NRu8K_uYedexvKo",
    badgeColor: "bg-[#28418e]/80 text-[#9db2ff]",
  },
  {
    category: "Product",
    title: "Product Feedback Sprint",
    stats: [{ icon: BarChart2, text: "High engagement" }],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBn0RRYdMcMxJ-hh6pA4Pf7Ndb8ol7JxVDTPrTTY6ZF9BoCNkRCHc4QFIcv5ft2X4KJowKqWkCiqJdgo1tSD16uHQdITGTYU4Hw3zkeRW46Goqj7tbqgkoVHni3Diz-GF1F2I6jeoMAucrlQh1gtBvjatkzBCaNE2BEMcKHvM1k5tGBbhnROKN3hwenlWqp7zrASBUEb0mOzW9PUc1poIaTNsdgsgcL8yoQh6XHcSqRDEnsaszwFiSBLgEbBjXolZeafWYUvebv5sc",
    badgeColor: "bg-[#bec2ff]/20 text-[#bec2ff] border border-[#bec2ff]/30",
  },
  {
    category: "Social",
    title: "Movie Night RSVP",
    stats: [{ icon: null, text: "Upcoming" }],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLuo1ZH9fNiZpj4-YaBWGZVEmfhTbfxTqgPyYryv0T8OGSCnwzdIThvdMYoEgTafyfStLqvAoEa04dieyIRf07oswsuFm7RYVOst0NOFMb8vBqG3wBh9tFc8SBPADgbcT5v4oNStDvt0A1ej-n702Oas87unqP04RyaFMC_LOmj_QCGnaV0jxqpYsf8dKBw7jyMZq67oJXiw2xXu5f9hY-W3v8dEjiwPrGWoBbcGkhn2EI8FZHRAleg0SxkYEA2fHFNhR3HdTSj_k",
    badgeColor: "bg-[#93000a]/60 text-[#ffdad6]",
  },
  {
    category: "Hiring",
    title: "Developer Hiring Form",
    stats: [{ icon: Code2, text: "Logic included" }],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBSI3kfqZVgtIrO9vmAi8xOOhuyVbvLp98XL95tTMCfmIMixFP03aHe5_9VXZyBANQOkNyVk1ju76s4JlEhiRh1Z4DlbI8fYWfPlfYGB57zxyNS7O7eaz_Z_g3ohKwkxSZtlO9dzyPikLq8HaB3DQUQr5NJvOQS8f3PHJy94yOFEkIMEKhJShS8faiTUPD-tZMTFbW0Z5__zo9pzAK82VgZANvT9Upc3GVXxiFeXuW0PUUg7Z8HlpE_QdXGBTguHReSr6BWvfuSqLM",
    badgeColor: "bg-[#9db2ff]/20 text-[#b6c4ff] border border-[#b6c4ff]/30",
  },
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

      {/* Sidebar */}
      <aside className="w-[240px] shrink-0 flex flex-col bg-[#1a1b1e] border-r border-[#343538]">
        <div className="px-6 pt-6 pb-4">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#8f8fa0]">Templates</p>
          <p className="text-xs text-[#8f8fa0] mt-0.5">Nitro Pro Gallery</p>
        </div>
        <nav className="flex-1 px-2 space-y-1">
          {[
            { label: "TEMPLATES", active: true },
            { label: "DRAFTS", active: false },
            { label: "PUBLISHED", active: false },
            { label: "ARCHIVE", active: false },
          ].map(({ label, active }) => (
            <Link key={label} href="#" className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-mono transition-colors",
              active ? "bg-[#28418e]/30 text-[#e3e2e6] font-semibold" : "text-[#8f8fa0] hover:bg-[#292a2d] hover:text-[#e3e2e6]"
            )}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-4 pb-4">
          <Link href="/builder" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[#5865f2] text-white text-sm font-medium hover:bg-[#4752c4] transition-colors">
            <Plus size={15} /> Create New Form
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-12 shrink-0 flex items-center justify-between px-6 bg-[#1f1f23] border-b border-[#343538]">
          <div className="flex items-center gap-4">
            <span className="text-lg font-extrabold text-[#bec2ff]">Templates</span>
            <div className="flex items-center bg-[#0d0e11] border border-[#454655] rounded-lg px-3 py-1">
              <Search size={14} className="text-[#8f8fa0]" />
              <input className="bg-transparent border-none focus:ring-0 text-sm w-44 text-[#e3e2e6] placeholder:text-[#8f8fa0] outline-none ml-2" placeholder="Search templates..." />
            </div>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="#" className="text-[13px] font-mono text-[#8f8fa0] hover:text-[#e3e2e6] transition-colors">Community</Link>
            <Link href="#" className="text-[13px] font-mono text-[#8f8fa0] hover:text-[#e3e2e6] transition-colors">Tutorials</Link>
          </nav>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-[#121316] p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10">
              <h1 className="text-[32px] font-bold leading-tight tracking-tight text-[#e3e2e6] mb-2">Explore Templates</h1>
              <p className="text-base text-[#c6c5d7] max-w-2xl">Jumpstart your workflow with hand-crafted templates designed for high-conversion data collection and community engagement.</p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {TEMPLATES.map(({ category, title, stats, image, badgeColor }) => (
                <div key={title} className="rounded-xl overflow-hidden flex flex-col bg-[#2b2d31]/70 border border-white/5 hover:border-[#5865f2] hover:shadow-[0_0_20px_rgba(88,101,242,0.15)] hover:-translate-y-1 transition-all duration-300 group backdrop-blur-xl">
                  {/* Image */}
                  <div className="h-40 relative overflow-hidden bg-[#292a2d]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className={cn("absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider", badgeColor)}>
                      {category}
                    </span>
                  </div>
                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-semibold text-[#e3e2e6] mb-2">{title}</h3>
                    <div className="flex items-center gap-4 text-[#c6c5d7] mb-6">
                      {stats.map(({ icon: StatIcon, text }, si) => (
                        <div key={si} className="flex items-center gap-1">
                          {StatIcon && <StatIcon size={13} />}
                          <span className="text-[11px] font-mono">{text}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-auto flex items-center gap-2">
                      <Link href="/f/demo" className="flex-1 py-2 rounded-lg text-center text-[13px] font-mono bg-[#343538]/50 text-[#e3e2e6] border border-[#454655]/30 hover:bg-[#343538] transition-colors">
                        Preview
                      </Link>
                      <button className="flex-1 py-2 rounded-lg text-center text-[13px] font-mono bg-[#5865f2] text-white hover:brightness-110 transition-all">
                        Use template
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Blank card */}
              <Link href="/builder" className="border-2 border-dashed border-[#454655]/30 rounded-xl flex flex-col items-center justify-center p-8 text-center hover:border-[#5865f2]/50 transition-all cursor-pointer group min-h-[300px]">
                <div className="w-12 h-12 rounded-full bg-[#343538]/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Plus size={24} className="text-[#5865f2]" />
                </div>
                <h4 className="text-lg font-semibold text-[#e3e2e6]">Custom Template</h4>
                <p className="text-xs text-[#8f8fa0] mt-1">Start from a blank canvas</p>
              </Link>
            </div>
          </div>
        </main>
      </div>

      {/* Ambient glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20 z-[-1]">
        <div className="absolute top-[10%] left-[20%] w-96 h-96 bg-[#5865f2] rounded-full blur-[128px]" />
        <div className="absolute bottom-[20%] right-[10%] w-64 h-64 bg-[#28418e] rounded-full blur-[128px]" />
      </div>
    </div>
  );
}
