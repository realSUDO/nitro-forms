"use client";

import Link from "next/link";
import {
  BarChart2,
  Calendar,
  Code2,
  Eye,
  LayoutGrid,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Timer,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { trpc } from "~/trpc/client";

// Static images mapped by slug pattern
const TEMPLATE_IMAGES: Record<string, { image: string; category: string; badgeColor: string }> = {
  "anime": {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9QrOTygO3iXHj7rLJRP2_4gwCrftKFDxbPX3Dv2JSAk8yGKaXZVIpbMRI-bxi6prSIMN-ohYpTujRaLwxylHLGJYzpDZtFHqPQgx-1vclmEdW68SBTkSmoEBOu1naXmMf17IrO4Nxj8ye1-qyhOohJLBv_m2UrjjofAU5RdXed_FIrKfRZ5CPC7gMG3i1qorSrGua4sDEfHW3__qo-qY7xM60bIIuNDUbKrK-BNpsPOesjHapEgSG0HnSgYiHg80UgzFx1IT7Y3s",
    category: "Entertainment",
    badgeColor: "bg-[#007ac1]/80 text-white",
  },
  "gaming": {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPtNLdYJSXRRCjkQamyjpGoSL6j_hm2NHZBQawgZga2ESMP7Us0XG0J5875ZIJ6djfKq46EM46YnKcIKtdJx1LmLyjVfcC5D-GNcKVcWz0NHcN7Vfyuqnu7w-SFFTDsXDJtEd7YwUUhXimDOg-kmFdBvoR_oO5y-FhKY0LNorbUG-bSHRGyMDweLS1ops3RJqp-fCnmn71a55uWscZZexTNB9ozNtIJyNTt1Yu06wBLsYkeikGv-5_X-Gr0la5NRu8K_uYedexvKo",
    category: "Gaming",
    badgeColor: "bg-[#28418e]/80 text-[#9db2ff]",
  },
  "product": {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBn0RRYdMcMxJ-hh6pA4Pf7Ndb8ol7JxVDTPrTTY6ZF9BoCNkRCHc4QFIcv5ft2X4KJowKqWkCiqJdgo1tSD16uHQdITGTYU4Hw3zkeRW46Goqj7tbqgkoVHni3Diz-GF1F2I6jeoMAucrlQh1gtBvjatkzBCaNE2BEMcKHvM1k5tGBbhnROKN3hwenlWqp7zrASBUEb0mOzW9PUc1poIaTNsdgsgcL8yoQh6XHcSqRDEnsaszwFiSBLgEbBjXolZeafWYUvebv5sc",
    category: "Product",
    badgeColor: "bg-[#bec2ff]/20 text-[#bec2ff] border border-[#bec2ff]/30",
  },
  "community": {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLuo1ZH9fNiZpj4-YaBWGZVEmfhTbfxTqgPyYryv0T8OGSCnwzdIThvdMYoEgTafyfStLqvAoEa04dieyIRf07oswsuFm7RYVOst0NOFMb8vBqG3wBh9tFc8SBPADgbcT5v4oNStDvt0A1ej-n702Oas87unqP04RyaFMC_LOmj_QCGnaV0jxqpYsf8dKBw7jyMZq67oJXiw2xXu5f9hY-W3v8dEjiwPrGWoBbcGkhn2EI8FZHRAleg0SxkYEA2fHFNhR3HdTSj_k",
    category: "Social",
    badgeColor: "bg-[#93000a]/60 text-[#ffdad6]",
  },
  "default": {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBSI3kfqZVgtIrO9vmAi8xOOhuyVbvLp98XL95tTMCfmIMixFP03aHe5_9VXZyBANQOkNyVk1ju76s4JlEhiRh1Z4DlbI8fYWfPlfYGB57zxyNS7O7eaz_Z_g3ohKwkxSZtlO9dzyPikLq8HaB3DQUQr5NJvOQS8f3PHJy94yOFEkIMEKhJShS8faiTUPD-tZMTFbW0Z5__zo9pzAK82VgZANvT9Upc3GVXxiFeXuW0PUUg7Z8HlpE_QdXGBTguHReSr6BWvfuSqLM",
    category: "General",
    badgeColor: "bg-[#4e5058] text-[#b5bac1]",
  },
};

function getTemplateAssets(slug: string) {
  const key = Object.keys(TEMPLATE_IMAGES).find(k => slug.includes(k));
  return TEMPLATE_IMAGES[key ?? "default"]!;
}

export function ExploreTemplates() {
  const { data: forms, isLoading } = trpc.public.listExploreForms.useQuery();

  return (
    <div className="flex h-screen overflow-hidden bg-[#313338] text-[#f2f3f5]">

      {/* Rail */}
      <aside className="w-[72px] shrink-0 bg-[#1e1f22] flex flex-col items-center py-4 gap-3">
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

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 h-14 flex items-center justify-between px-6 bg-[#2b2d31]">
          <span className="text-lg font-bold text-[#f2f3f5]">Explore Templates</span>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#949ba4]" />
              <input className="bg-[#1e1f22] border-none rounded-lg pl-9 pr-4 py-1.5 text-sm text-[#f2f3f5] placeholder:text-[#949ba4] focus:ring-1 focus:ring-[#5865f2] outline-none w-56" placeholder="Search templates..." />
            </div>
            <Link href="/builder" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#5865f2] text-white text-sm font-medium hover:bg-[#4752c4] transition-colors">
              <Plus size={14} /> Create Form
            </Link>
          </div>
        </header>

        <div className="p-6 max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#f2f3f5] mb-2">Explore Templates</h1>
            <p className="text-base text-[#949ba4] max-w-2xl">Jumpstart your workflow with hand-crafted templates designed for high-conversion data collection and community engagement.</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-3 gap-5">
              {[1,2,3].map(i => (
                <div key={i} className="rounded-xl h-[300px] bg-[#2b2d31] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {forms?.map((form) => {
                const assets = getTemplateAssets(form.slug);
                return (
                  <div key={form.id} className="rounded-xl overflow-hidden flex flex-col bg-[#2b2d31] border border-[#3f4147] hover:border-[#5865f2] hover:shadow-[0_0_20px_rgba(88,101,242,0.15)] hover:-translate-y-1 transition-all duration-300 group">
                    <div className="h-40 relative overflow-hidden bg-[#1e1f22]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={assets.image} alt={form.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className={cn("absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider", assets.badgeColor)}>
                        {assets.category}
                      </span>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-base font-semibold text-[#f2f3f5] mb-2">{form.title}</h3>
                      <div className="flex items-center gap-3 text-[#949ba4] mb-4">
                        <span className="flex items-center gap-1 text-[11px] font-mono">
                          <Users size={12} /> Public
                        </span>
                      </div>
                      <div className="mt-auto flex items-center gap-2">
                        <Link href={`/f/${form.slug}`} className="flex-1 py-2 rounded-lg text-center text-[13px] bg-[#3f4147] text-[#f2f3f5] hover:bg-[#4e5058] transition-colors">
                          Preview
                        </Link>
                        <Link href={`/f/${form.slug}`} className="flex-1 py-2 rounded-lg text-center text-[13px] bg-[#5865f2] text-white hover:brightness-110 transition-all">
                          Use template
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Blank card */}
              <Link href="/builder" className="border-2 border-dashed border-[#3f4147] rounded-xl flex flex-col items-center justify-center p-8 text-center hover:border-[#5865f2]/50 transition-all cursor-pointer group min-h-[300px]">
                <Plus size={24} className="text-[#5865f2] mb-3" />
                <p className="text-sm font-semibold text-[#f2f3f5]">Custom Template</p>
                <p className="text-xs text-[#949ba4] mt-1">Start from a blank canvas</p>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
