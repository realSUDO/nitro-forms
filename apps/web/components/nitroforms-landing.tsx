"use client";

import type { CSSProperties, MouseEvent } from "react";
import { useState } from "react";
import {
  ArrowRight,
  BarChart2,
  Check,
  Code2,
  Link2,
  PanelsTopLeft,
  Sparkles,
  TrendingUp,
  Webhook,
} from "lucide-react";

import { cn } from "~/lib/utils";
import FloatingGhost from "~/components/floating-ghost";

const navItems = ["Builder", "Templates", "Docs", "Pricing"];
const navHrefs: Record<string, string> = {
  Builder: "/dashboard",
  Templates: "/explore",
  Docs: "/docs",
  Pricing: "/pricing",
};

const featureCards = [
  {
    title: "Dynamic Form Builder",
    description:
      "Drag-and-drop fields, conditional logic, branching flows, and real-time validation — all from one polished workspace.",
    icon: PanelsTopLeft,
    wide: true,
  },
  {
    title: "Privacy First",
    description:
      "Host public forms or keep them unlisted with password protection and domain whitelisting.",
    icon: Link2,
    wide: false,
  },
  {
    title: "Response Analytics",
    description:
      "Visualize drop-off points and completion rates with real-time response data.",
    icon: BarChart2,
    wide: false,
  },
  {
    title: "Smart Generate",
    description:
      "Describe your goal and let the AI scaffold your entire form structure in seconds.",
    icon: Sparkles,
    wide: true,
    terminal: true,
  },
];

const pricingPlans = [
  {
    tier: "Community",
    price: "$0",
    period: "/mo",
    features: ["5 Active Forms", "100 Submissions / mo", "Basic Analytics"],
    cta: "Get Started",
    highlight: false,
  },
  {
    tier: "Professional",
    price: "$29",
    period: "/mo",
    features: ["Unlimited Forms", "10,000 Submissions", "Custom Branding", "Smart AI Generation"],
    cta: "Start Pro Trial",
    highlight: true,
  },
  {
    tier: "Enterprise",
    price: "Custom",
    period: "",
    features: ["Dedicated Support", "SSO / SAML", "On-Premise Hosting"],
    cta: "Contact Sales",
    highlight: false,
  },
];

const codeLines = [
  { text: "curl", color: "#bec2ff" },
  { text: "  -X POST https://nitroforms.fun/api/v2/forms \\", color: "#e3e2e6" },
  { text: '  -H "Authorization: Bearer ', color: "#e3e2e6", highlight: "nitro_sk_..." },
  { text: "  -d '{", color: "#e3e2e6" },
  { text: '    "title": "Beta Signup",', color: "#e3e2e6" },
  { text: '    "fields": [{ "type": "email", "label": "Email" }]', color: "#e3e2e6" },
  { text: "  }'", color: "#e3e2e6" },
];

const headingFont: CSSProperties = {
  fontFamily: "var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif",
};

export function NitroFormsLanding() {
  return (
    <main
      className="min-h-screen overflow-x-hidden bg-[#121316] text-[#e3e2e6] relative"
      style={{ fontFamily: "var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif" }}
    >
      <FloatingGhost />
      <Navigation />
      <Hero />
      <Features />
      <ApiSection />
      <PricingSection />
      <Footer />
    </main>
  );
}

function Navigation() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-[#454655]/20 bg-[#121316]/80 backdrop-blur-md">
      <nav className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 sm:px-8">
        <span className="text-lg font-extrabold text-[#5865f2]" style={headingFont}>
          NitroForms
        </span>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              className="font-mono text-[13px] font-medium tracking-wide text-[#c6c5d7] transition-colors hover:text-[#bec2ff]"
              href={navHrefs[item] ?? `#${item.toLowerCase()}`}
              key={item}
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a href="/login" className="hidden h-9 items-center px-5 font-mono text-[13px] font-medium tracking-wide text-[#c6c5d7] hover:text-[#bec2ff] sm:inline-flex">
            Log In
          </a>
          <a href="/dashboard" className="flex h-9 items-center rounded-lg bg-[#5865f2] px-5 font-mono text-[13px] font-medium tracking-wide text-white shadow-[0_0_20px_rgba(88,101,242,0.2)] hover:bg-[#4752c4]">
            Start Building
          </a>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center overflow-hidden px-6 pb-20 pt-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-[#5865f2]/10 blur-[120px]" />

      <div className="relative z-10 max-w-4xl space-y-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#454655]/30 bg-[#1a1b1e] px-3 py-1">
          <span className="size-2 animate-pulse rounded-full bg-[#5865f2]" />
          <span className="font-mono text-[11px] font-medium uppercase tracking-widest text-[#c6c5d7]">
            Now in v2.0 Release
          </span>
        </div>

        <h1
          className="text-[56px] font-black leading-tight tracking-tight text-[#e3e2e6] sm:text-[64px]"
          style={headingFont}
        >
          Forms, but <span className="text-[#5865f2]">faster.</span>
        </h1>

        <p className="mx-auto max-w-2xl text-base leading-relaxed text-[#c6c5d7]">
          Create, publish, and analyze dynamic forms from one community-native workspace. Built for
          developers who value performance and clean data.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <a href="/dashboard" className="flex h-14 items-center gap-2 rounded-xl bg-[#5865f2] px-8 font-mono text-[13px] font-bold tracking-wide text-white shadow-[0_0_20px_rgba(88,101,242,0.2)] hover:bg-[#4752c4]">
            Start Building
            <ArrowRight className="size-4" />
          </a>
          <a href="/explore" className="flex h-14 items-center rounded-xl border border-[#454655] bg-[#1a1b1e] px-8 font-mono text-[13px] font-bold tracking-wide text-[#e3e2e6] hover:bg-[#292a2d]">
            Explore Templates
          </a>
        </div>
      </div>

      <TiltMockup />
    </section>
  );
}

function TiltMockup() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function onMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -8, y: x * 12 });
  }

  return (
    <div
      className="relative mt-20 w-full max-w-6xl"
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      onMouseMove={onMouseMove}
      style={{ perspective: "1000px" }}
    >
      <div
        className="relative transition-transform duration-300 ease-out"
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      >
        <div className="relative overflow-hidden rounded-2xl border-2 border-[#454655]/20 bg-[#0d0e11] p-2 shadow-[0_28px_80px_rgba(88,101,242,0.05)]">
          <DashboardMockup />
        </div>

        {/* Floating analytics card */}
        <div className="absolute -right-8 top-1/4 hidden w-48 rounded-xl border border-[#454655]/50 bg-[#2b2d31]/60 p-4 shadow-xl backdrop-blur-md transition-transform duration-500 hover:-translate-x-2 lg:block">
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="size-4 text-[#bec2ff]" />
            <span className="font-mono text-[11px] font-medium tracking-wide text-[#c6c5d7]">
              Real-time Analytics
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#1f1f23]">
            <div className="h-full w-3/4 rounded-full bg-[#5865f2]" />
          </div>
          <span className="mt-2 block text-xl font-bold text-[#e3e2e6]">+12.4%</span>
        </div>
      </div>
    </div>
  );
}

function DashboardMockup() {
  return (
    <div className="flex h-[420px] overflow-hidden rounded-xl bg-[#1f1f23]">
      {/* Server rail */}
      <div className="w-[42px] shrink-0 bg-[#1e1f22] flex flex-col items-center py-3 gap-2">
        <div className="w-7 h-7 rounded-lg bg-[#2b2d31] flex items-center justify-center">
          <img src="/nitro.svg" alt="" className="w-6 h-6" />
        </div>
        <div className="w-5 h-0.5 rounded bg-[#3f4147] my-1" />
        <div className="w-7 h-7 rounded-full bg-[#3f4147]" />
        <div className="w-7 h-7 rounded-full bg-[#3f4147]" />
        <div className="w-7 h-7 rounded-full bg-[#3f4147]" />
      </div>

      {/* Channel sidebar */}
      <div className="w-[140px] shrink-0 border-r border-white/[0.04] bg-[#2b2d31] py-3 px-2">
        <p className="px-2 mb-2 text-[11px] font-semibold text-white">NitroForms</p>
        <div className="space-y-0.5">
          <div className="rounded px-2 py-1 text-[11px] text-[#949ba4]"># welcome</div>
          <div className="rounded px-2 py-1 text-[11px] text-[#949ba4]"># dashboard</div>
          <p className="pt-2 pb-0.5 px-2 text-[8px] font-semibold uppercase tracking-wider text-[#949ba4]/50">Forms</p>
          <div className="rounded px-2 py-1 text-[11px] bg-[#3f4147] text-white"># Anime Survey</div>
          <div className="rounded px-2 py-1 text-[11px] text-[#949ba4]"># Feedback</div>
          <div className="rounded px-2 py-1 text-[11px] text-[#949ba4]"># Gaming</div>
        </div>
      </div>

      {/* Center — React Flow canvas with nodes */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold text-white">Anime Fan Survey</span>
            <span className="rounded bg-[#3ba55c]/15 px-1.5 py-0.5 text-[9px] font-semibold text-[#3ba55c]">Published</span>
          </div>
          <div className="flex gap-2">
            <div className="h-6 px-3 rounded bg-[#292a2d] flex items-center text-[10px] text-[#8f8fa0]">Share</div>
            <div className="h-6 px-3 rounded bg-[#5865f2] flex items-center text-[10px] text-white">Publish</div>
          </div>
        </div>

        {/* Canvas with nodes and edges */}
        <div className="flex-1 relative bg-[#313338] overflow-hidden">
          {/* Grid dots */}
          <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "radial-gradient(circle, #949ba4 0.5px, transparent 0.5px)", backgroundSize: "24px 24px" }} />

          {/* Node 1 — Name */}
          <div className="absolute left-[20%] top-[12%] w-[140px] rounded-lg border border-[#3f4147] bg-[#2b2d31] p-3 transition-all hover:border-[#5865f2] hover:shadow-[0_0_12px_rgba(88,101,242,0.3)] hover:-translate-y-0.5 cursor-default">
            <div className="absolute -top-1 left-1/2 w-2 h-2 rounded-full bg-[#4e5058] -translate-x-1/2" />
            <p className="text-[9px] font-mono text-[#949ba4] mb-1">SHORT TEXT</p>
            <p className="text-[11px] text-white font-medium">Your Name</p>
            <div className="mt-2 h-5 rounded bg-[#1e1f22] border border-[#3f4147]" />
            <div className="absolute -bottom-1 left-1/2 w-2 h-2 rounded-full bg-[#4e5058] -translate-x-1/2" />
          </div>

          {/* Edge 1→2 */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <style>{`@keyframes dash { to { stroke-dashoffset: -16; } }`}</style>
            <path d="M 170 85 C 170 120 170 120 170 140" stroke="#5865f2" strokeWidth="2" fill="none" opacity="0.6" strokeDasharray="4 4" style={{ animation: "dash 2s linear infinite" }} />
            <path d="M 170 195 C 170 220 250 220 250 245" stroke="#5865f2" strokeWidth="2" fill="none" opacity="0.6" strokeDasharray="4 4" style={{ animation: "dash 2s linear infinite" }} />
            {/* Condition edges */}
            <path d="M 235 310 C 235 340 150 340 150 360" stroke="#3ba55c" strokeWidth="2" fill="none" opacity="0.7" strokeDasharray="4 4" style={{ animation: "dash 1.5s linear infinite" }} />
            <path d="M 275 310 C 275 340 350 340 350 360" stroke="#ed4245" strokeWidth="2" fill="none" opacity="0.7" strokeDasharray="4 4" style={{ animation: "dash 1.5s linear infinite" }} />
          </svg>

          {/* Node 2 — Genre Select */}
          <div className="absolute left-[18%] top-[38%] w-[140px] rounded-lg border border-[#3f4147] bg-[#2b2d31] p-3 transition-all hover:border-[#5865f2] hover:shadow-[0_0_12px_rgba(88,101,242,0.3)] hover:-translate-y-0.5 cursor-default">
            <div className="absolute -top-1 left-1/2 w-2 h-2 rounded-full bg-[#4e5058] -translate-x-1/2" />
            <p className="text-[9px] font-mono text-[#949ba4] mb-1">SINGLE SELECT</p>
            <p className="text-[11px] text-white font-medium">Fav Genre</p>
            <div className="mt-1.5 space-y-1">
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#3f4147] text-[7px] text-[#949ba4] flex items-center justify-center font-bold">A</span><span className="text-[9px] text-[#b5bac1]">Shonen</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#3f4147] text-[7px] text-[#949ba4] flex items-center justify-center font-bold">B</span><span className="text-[9px] text-[#b5bac1]">Seinen</span></div>
            </div>
            <div className="absolute -bottom-1 left-1/2 w-2 h-2 rounded-full bg-[#4e5058] -translate-x-1/2" />
          </div>

          {/* Node 3 — Condition */}
          <div className="absolute left-[30%] top-[65%] w-[120px] rounded-lg border border-[#faa61a]/30 bg-[#2b2d31] p-2.5 transition-all hover:border-[#faa61a] hover:shadow-[0_0_12px_rgba(250,166,26,0.3)] hover:-translate-y-0.5 cursor-default">
            <div className="absolute -top-1 left-1/2 w-2 h-2 rounded-full bg-[#4e5058] -translate-x-1/2" />
            <div className="flex items-center gap-1 mb-1">
              <span className="text-[9px] font-mono text-[#faa61a]">IF</span>
            </div>
            <p className="text-[10px] text-white">Genre = Shonen</p>
            <div className="flex justify-between mt-2 text-[8px] font-mono">
              <span className="text-[#3ba55c]">yes</span>
              <span className="text-[#ed4245]">no</span>
            </div>
            <div className="absolute -bottom-1 left-[30%] w-2 h-2 rounded-full bg-[#3ba55c] -translate-x-1/2" />
            <div className="absolute -bottom-1 left-[70%] w-2 h-2 rounded-full bg-[#ed4245] -translate-x-1/2" />
          </div>

          {/* Node 4 — Rating (yes branch) */}
          <div className="absolute left-[10%] top-[85%] w-[110px] rounded-lg border border-[#454655]/50 bg-[#2b2d31] p-2.5 transition-all hover:border-[#3ba55c] hover:shadow-[0_0_12px_rgba(59,165,92,0.3)] hover:-translate-y-0.5 cursor-default">
            <p className="text-[9px] font-mono text-[#8f8fa0] mb-1">RATING</p>
            <p className="text-[10px] text-white">Rate Shonen</p>
            <div className="flex gap-0.5 mt-1">{[1,2,3,4,5].map(n => <span key={n} className="text-[10px] text-[#faa61a]">★</span>)}</div>
          </div>

          {/* Node 5 — Thank you (no branch) */}
          <div className="absolute left-[55%] top-[85%] w-[110px] rounded-lg border border-[#454655]/50 bg-[#2b2d31] p-2.5 transition-all hover:border-[#ed4245] hover:shadow-[0_0_12px_rgba(237,66,69,0.3)] hover:-translate-y-0.5 cursor-default">
            <p className="text-[9px] font-mono text-[#8f8fa0] mb-1">SHORT TEXT</p>
            <p className="text-[10px] text-white">Any feedback?</p>
            <div className="mt-1.5 h-4 rounded bg-[#1f1f23]" />
          </div>
        </div>
      </div>

      {/* Right — Inspector */}
      <div className="w-48 shrink-0 border-l border-white/[0.04] bg-[#2b2d31] p-4">
        <p className="mb-3 text-xs font-semibold text-white">Settings</p>
        <div className="space-y-3">
          <div>
            <p className="text-[9px] text-[#949ba4] mb-1">Label</p>
            <div className="h-7 rounded-lg bg-[#1e1f22] px-2 flex items-center text-[10px] text-white">Fav Genre</div>
          </div>
          <div>
            <p className="text-[9px] text-[#949ba4] mb-1">Type</p>
            <div className="h-7 rounded-lg bg-[#5865f2]/10 px-2 flex items-center text-[10px] text-[#bec2ff]">single select</div>
          </div>
          <div>
            <p className="text-[9px] text-[#949ba4] mb-1">Required</p>
            <div className="w-8 h-4 rounded-full bg-[#3ba55c] relative"><div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-white" /></div>
          </div>
          <div>
            <p className="text-[9px] text-[#949ba4] mb-1">Options</p>
            <div className="space-y-1">
              {["Shonen", "Seinen", "Isekai", "Slice of Life"].map(o => (
                <div key={o} className="h-5 rounded bg-[#1e1f22] px-2 flex items-center text-[9px] text-[#b5bac1]">{o}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Features() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8" id="builder">
      <div className="mb-16 space-y-4 text-center">
        <h2 className="text-2xl font-bold text-[#e3e2e6] sm:text-3xl" style={headingFont}>
          Engineered for Velocity
        </h2>
        <p className="text-sm text-[#c6c5d7]">
          Everything you need to capture data at scale without the friction.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {featureCards.map(({ title, description, icon: Icon, wide, terminal }) => (
          <div
            className={cn(
              "group rounded-3xl border border-[#454655]/50 bg-[#2b2d31]/60 p-8 backdrop-blur-sm transition-colors hover:border-[#bec2ff]/20",
              wide ? "col-span-12 md:col-span-8" : "col-span-12 md:col-span-4",
            )}
            key={title}
          >
            <div className="mb-6 flex size-12 items-center justify-center rounded-xl bg-[#5865f2]/20">
              <Icon className="size-5 text-[#bec2ff]" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-[#e3e2e6]" style={headingFont}>
              {title}
            </h3>
            <p className="max-w-md text-sm leading-6 text-[#c6c5d7]">{description}</p>

            {terminal && (
              <div className="mt-6 rounded-xl border border-[#454655]/30 bg-[#292a2d] p-4 font-mono text-[13px] text-[#c6c5d7]">
                <div className="mb-2 flex gap-2">
                  <span className="text-[#bec2ff]">&gt;</span> prompt: /create customer_feedback
                </div>
                <div className="mb-2 flex gap-2">
                  <span className="text-[#bec2ff]">&gt;</span> generating_fields...
                </div>
                <div className="flex gap-2">
                  <span className="text-[#bec2ff]">&gt;</span> success: 8 fields added
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function ApiSection() {
  return (
    <section className="bg-[#1a1b1e] px-6 py-24 sm:px-8" id="docs">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 lg:flex-row">
        <div className="flex-1 space-y-6">
          <h2 className="text-2xl font-bold text-[#e3e2e6] sm:text-3xl" style={headingFont}>
            API-First Documentation
          </h2>
          <p className="text-base leading-relaxed text-[#c6c5d7]">
            NitroForms is built for developers. Trigger webhooks, fetch submissions via REST, or
            embed components using our React and Vue libraries.
          </p>
          <ul className="space-y-4">
            {["Full SDK Support", "Webhook Callbacks", "Type-Safe Submissions"].map((item) => (
              <li
                className="flex items-center gap-3 font-mono text-[13px] font-medium tracking-wide text-[#e3e2e6]"
                key={item}
              >
                <Check className="size-5 text-[#bec2ff]" />
                {item}
              </li>
            ))}
          </ul>
          <a href="/docs" className="mt-4 inline-flex h-10 items-center rounded-lg border border-[#bec2ff] bg-transparent px-6 font-mono text-[13px] font-medium tracking-wide text-[#bec2ff] hover:bg-[#bec2ff]/10">
            Read the Docs
          </a>
        </div>

        <div className="w-full max-w-xl flex-1">
          <div className="overflow-hidden rounded-2xl border border-[#454655]/30 bg-[#0d0e11] shadow-2xl">
            <div className="flex gap-2 border-b border-[#454655]/20 px-5 py-4">
              <div className="size-3 rounded-full bg-[#ffb4ab]/40" />
              <div className="size-3 rounded-full bg-[#b6c4ff]/40" />
              <div className="size-3 rounded-full bg-[#bec2ff]/40" />
            </div>
            <div className="p-5 font-mono text-[13px] leading-7">
              {codeLines.map(({ text, color, highlight }, i) => (
                <div key={i} style={{ color }}>
                  {highlight ? (
                    <>
                      {text}
                      <span className="text-[#9db2ff]">{highlight}</span>
                      {'" \\'}
                    </>
                  ) : (
                    text
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8" id="pricing">
      <div className="mb-16 text-center">
        <h2 className="text-2xl font-bold text-[#e3e2e6] sm:text-3xl" style={headingFont}>
          Simple, Transparent Pricing
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {pricingPlans.map(({ tier, price, period, features, cta, highlight }) => (
          <div
            className={cn(
              "relative flex flex-col rounded-3xl border p-8",
              highlight
                ? "z-10 scale-105 border-[#5865f2]/50 bg-[#1f1f23] shadow-xl shadow-[#5865f2]/10"
                : "border-[#454655]/50 bg-[#2b2d31]/60",
            )}
            key={tier}
          >
            {highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#5865f2] px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-tight text-white">
                Recommended
              </div>
            )}
            <div className="mb-8">
              <span
                className={cn(
                  "font-mono text-[11px] font-semibold uppercase tracking-widest",
                  highlight ? "text-[#bec2ff]" : "text-[#8f8fa0]",
                )}
              >
                {tier}
              </span>
              <div className="mt-2 text-2xl font-black text-[#e3e2e6]" style={headingFont}>
                {price}
                <span className="text-sm font-normal text-[#8f8fa0]">{period}</span>
              </div>
            </div>

            <ul className="mb-10 flex-1 space-y-4">
              {features.map((f) => (
                <li className="flex items-center gap-2 text-sm text-[#c6c5d7]" key={f}>
                  <Check className="size-4 text-[#bec2ff]" />
                  {f}
                </li>
              ))}
            </ul>

            <a
              href="/dashboard"
              className={cn(
                "block w-full rounded-xl py-3 text-center font-mono text-[13px] font-medium tracking-wide",
                highlight
                  ? "bg-[#5865f2] text-white shadow-[0_0_20px_rgba(88,101,242,0.2)] hover:bg-[#4752c4]"
                  : "border border-[#454655] bg-transparent text-[#e3e2e6] hover:bg-[#292a2d]",
              )}
            >
              {cta}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#454655]/10 px-6 py-12 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
        <div className="space-y-2">
          <span className="text-xl font-extrabold text-[#5865f2]" style={headingFont}>
            NitroForms
          </span>
          <p className="font-mono text-[11px] font-medium tracking-wide text-[#8f8fa0]">
            © 2026 Nitro Workspaces Inc. All rights reserved.
          </p>
        </div>
        <div className="flex gap-8">
          {[
            { label: "Explore", href: "/explore" },
            { label: "Docs", href: "/docs" },
            { label: "Pricing", href: "/pricing" },
            { label: "Login", href: "/login" },
          ].map(({ label, href }) => (
            <a
              className="font-mono text-[13px] font-medium tracking-wide text-[#8f8fa0] transition-colors hover:text-[#bec2ff]"
              href={href}
              key={label}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
