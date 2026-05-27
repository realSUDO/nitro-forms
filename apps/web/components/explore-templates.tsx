"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronDown, Plus, Search, Users } from "lucide-react";
import { cn } from "~/lib/utils";
import { trpc } from "~/trpc/client";

const STATIC_TEMPLATES = [
  { slug: "anime-fan-survey", title: "Anime Fan Survey", category: "Entertainment", stat: "1.2k responses", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9QrOTygO3iXHj7rLJRP2_4gwCrftKFDxbPX3Dv2JSAk8yGKaXZVIpbMRI-bxi6prSIMN-ohYpTujRaLwxylHLGJYzpDZtFHqPQgx-1vclmEdW68SBTkSmoEBOu1naXmMf17IrO4Nxj8ye1-qyhOohJLBv_m2UrjjofAU5RdXed_FIrKfRZ5CPC7gMG3i1qorSrGua4sDEfHW3__qo-qY7xM60bIIuNDUbKrK-BNpsPOesjHapEgSG0HnSgYiHg80UgzFx1IT7Y3s", badgeColor: "bg-[#007ac1]/80 text-white" },
  { slug: "gaming-community-signup", title: "Gaming Community Signup", category: "Gaming", stat: "840 responses", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPtNLdYJSXRRCjkQamyjpGoSL6j_hm2NHZBQawgZga2ESMP7Us0XG0J5875ZIJ6djfKq46EM46YnKcIKtdJx1LmLyjVfcC5D-GNcKVcWz0NHcN7Vfyuqnu7w-SFFTDsXDJtEd7YwUUhXimDOg-kmFdBvoR_oO5y-FhKY0LNorbUG-bSHRGyMDweLS1ops3RJqp-fCnmn71a55uWscZZexTNB9ozNtIJyNTt1Yu06wBLsYkeikGv-5_X-Gr0la5NRu8K_uYedexvKo", badgeColor: "bg-[#28418e]/80 text-[#9db2ff]" },
  { slug: "product-feedback-sprint", title: "Product Feedback Sprint", category: "Product", stat: "High engagement", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBn0RRYdMcMxJ-hh6pA4Pf7Ndb8ol7JxVDTPrTTY6ZF9BoCNkRCHc4QFIcv5ft2X4KJowKqWkCiqJdgo1tSD16uHQdITGTYU4Hw3zkeRW46Goqj7tbqgkoVHni3Diz-GF1F2I6jeoMAucrlQh1gtBvjatkzBCaNE2BEMcKHvM1k5tGBbhnROKN3hwenlWqp7zrASBUEb0mOzW9PUc1poIaTNsdgsgcL8yoQh6XHcSqRDEnsaszwFiSBLgEbBjXolZeafWYUvebv5sc", badgeColor: "bg-[#bec2ff]/20 text-[#bec2ff]" },
  { slug: "movie-night-rsvp", title: "Movie Night RSVP", category: "Social", stat: "Upcoming", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLuo1ZH9fNiZpj4-YaBWGZVEmfhTbfxTqgPyYryv0T8OGSCnwzdIThvdMYoEgTafyfStLqvAoEa04dieyIRf07oswsuFm7RYVOst0NOFMb8vBqG3wBh9tFc8SBPADgbcT5v4oNStDvt0A1ej-n702Oas87unqP04RyaFMC_LOmj_QCGnaV0jxqpYsf8dKBw7jyMZq67oJXiw2xXu5f9hY-W3v8dEjiwPrGWoBbcGkhn2EI8FZHRAleg0SxkYEA2fHFNhR3HdTSj_k", badgeColor: "bg-[#93000a]/60 text-[#ffdad6]" },
  { slug: "developer-hiring-form", title: "Developer Hiring Form", category: "Hiring", stat: "Logic included", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBSI3kfqZVgtIrO9vmAi8xOOhuyVbvLp98XL95tTMCfmIMixFP03aHe5_9VXZyBANQOkNyVk1ju76s4JlEhiRh1Z4DlbI8fYWfPlfYGB57zxyNS7O7eaz_Z_g3ohKwkxSZtlO9dzyPikLq8HaB3DQUQr5NJvOQS8f3PHJy94yOFEkIMEKhJShS8faiTUPD-tZMTFbW0Z5__zo9pzAK82VgZANvT9Upc3GVXxiFeXuW0PUUg7Z8HlpE_QdXGBTguHReSr6BWvfuSqLM", badgeColor: "bg-[#9db2ff]/20 text-[#b6c4ff]" },
];

export function ExploreTemplates() {
  const router = useRouter();
  const { data: apiForms } = trpc.public.listExploreForms.useQuery();
  const createForm = trpc.form.create.useMutation();
  const updateForm = trpc.form.update.useMutation();

  async function useTemplate(slug: string, title: string) {
    // Fetch the template form fields
    try {
      const form = await fetch(`/api/trpc/public.getFormBySlug?input=${encodeURIComponent(JSON.stringify({ slug }))}`).then(r => r.json());
      const fields = form?.[0]?.result?.data?.fields ?? form?.result?.data?.fields ?? [];
      // Create a new form with the template's fields
      const newForm = await createForm.mutateAsync({ title: `${title} (copy)` });
      if (newForm && fields.length > 0) {
        await updateForm.mutateAsync({ formId: newForm.id, fields });
      }
      router.push(`/builder/${newForm!.id}`);
    } catch {
      router.push("/builder");
    }
  }

  return (
    <>
      {/* Sidebar */}
      <aside className="w-[240px] shrink-0 flex flex-col bg-[#2b2d31]">
        <div className="px-6 pt-6 pb-4">
          <p className="text-[11px] font-mono uppercase tracking-widest text-[#949ba4] font-bold">Templates</p>
          <p className="text-xs text-[#949ba4] mt-0.5">Nitro Pro Gallery</p>
        </div>
        <nav className="flex-1 px-2 space-y-0.5">
          {[
            { label: "TEMPLATES", active: true },
            { label: "DRAFTS", active: false },
            { label: "PUBLISHED", active: false },
            { label: "ARCHIVE", active: false },
          ].map(({ label, active }) => (
            <Link key={label} href={active ? "/explore" : "/dashboard"} className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-mono transition-colors",
              active ? "bg-[#5865f2]/20 text-[#f2f3f5] font-semibold" : "text-[#949ba4] hover:bg-[#3f4147] hover:text-[#f2f3f5]"
            )}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-4 pb-4">
          <Link href="/dashboard" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[#5865f2] text-white text-sm font-medium hover:bg-[#4752c4] transition-colors">
            <Plus size={15} /> Create New Form
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-[#313338] relative">
        {/* Header */}
        <header className="sticky top-0 z-10 h-12 flex items-center justify-between px-6 bg-[#2b2d31]">
          <span className="text-lg font-extrabold text-[#5865f2]">Templates</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-[#1e1f22] px-3 py-1 rounded-lg">
              <Search size={14} className="text-[#949ba4]" />
              <input className="bg-transparent border-none text-sm w-44 text-[#f2f3f5] placeholder:text-[#949ba4] outline-none ml-2" placeholder="Search templates..." />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-[32px] font-bold leading-tight tracking-tight text-[#f2f3f5] mb-2">Explore Templates</h1>
            <p className="text-base text-[#949ba4] max-w-2xl">Jumpstart your workflow with hand-crafted templates designed for high-conversion data collection and community engagement.</p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {STATIC_TEMPLATES.map(({ slug, title, category, stat, image, badgeColor }) => (
              <div key={slug} className="rounded-xl overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-1" style={{ background: "rgba(43,45,49,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="h-40 relative overflow-hidden bg-[#292a2d]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className={cn("absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider", badgeColor)}>
                    {category}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold text-[#f2f3f5] mb-2">{title}</h3>
                  <div className="flex items-center gap-4 text-[#949ba4] mb-6">
                    <span className="flex items-center gap-1 text-[11px] font-mono">
                      <Users size={12} /> {stat}
                    </span>
                  </div>
                  <div className="mt-auto flex items-center gap-2">
                    <Link href={`/f/${slug}`} className="flex-1 py-2 rounded-lg text-center text-[13px] font-mono bg-[#3f4147]/50 text-[#f2f3f5] hover:bg-[#3f4147] transition-colors border border-[#4e5058]/30">
                      Preview
                    </Link>
                    <button onClick={() => useTemplate(slug, title)} className="flex-1 py-2 rounded-lg text-center text-[13px] font-mono bg-[#5865f2] text-white hover:brightness-110 transition-all">
                      Use template
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add custom */}
            <Link href="/dashboard" className="border-2 border-dashed border-[#4e5058]/30 rounded-xl flex flex-col items-center justify-center p-8 text-center hover:border-[#5865f2]/50 transition-all cursor-pointer group">
              <div className="w-12 h-12 rounded-full bg-[#3f4147]/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus size={24} className="text-[#5865f2]" />
              </div>
              <h4 className="text-lg font-semibold text-[#f2f3f5]">Custom Template</h4>
              <p className="text-xs text-[#949ba4] mt-1">Start from a blank canvas</p>
            </Link>
          </div>
        </div>

        {/* Ambient glow */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20 -z-10">
          <div className="absolute top-[10%] left-[20%] w-96 h-96 bg-[#5865f2] rounded-full blur-[128px]" />
          <div className="absolute bottom-[20%] right-[10%] w-64 h-64 bg-[#28418e] rounded-full blur-[128px]" />
        </div>
      </main>
    </>
  );
}
