"use client";

import type { CSSProperties, MouseEvent } from "react";
import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Check,
  Code2,
  EyeOff,
  FileText,
  LayoutDashboard,
  Link2,
  LockKeyhole,
  MousePointer2,
  PanelsTopLeft,
  Sparkles,
  Zap,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type AnalyticsItem = {
  icon: typeof LayoutDashboard;
  label: string;
};

const navItems = ["Builder", "Templates", "Docs", "Pricing"];

const featureCards = [
  {
    title: "Dynamic Builder",
    description:
      "Ship conditional fields, live validation, and branching flows from one polished workspace.",
    icon: PanelsTopLeft,
    className: "lg:col-span-2",
  },
  {
    title: "Public / Unlisted Links",
    description:
      "Share forms instantly with public links, unlisted campaigns, password gates, and clean embeds.",
    icon: Link2,
  },
  {
    title: "Analytics",
    description:
      "Track completion rate, drop-off, and response velocity without leaving your builder.",
    icon: BarChart3,
  },
  {
    title: "API Docs",
    description: "Developer-first docs for webhooks, REST submissions, and type-safe integrations.",
    icon: Code2,
    className: "lg:col-span-2",
  },
];

const pricingRows = ["Unlimited forms", "10k monthly responses", "Custom branding"];

const codeLines = [
  { text: "curl", className: "text-[#9bdcff]" },
  { text: "-X POST https://api.nitroforms.com/v2/forms \\" },
  { text: '-H "Authorization: Bearer NITRO_SK..." \\' },
  { text: "-d {" },
  { text: '"title": "Beta Signup",', className: "pl-4 text-[#d6d8ff]" },
  { text: '"schema": ["email", "role"]', className: "pl-4 text-[#d6d8ff]" },
  { text: "}" },
];

const analyticsItems: AnalyticsItem[] = [
  { icon: LayoutDashboard, label: "Completion analytics" },
  { icon: LockKeyhole, label: "Private submission workflows" },
  { icon: MousePointer2, label: "Embeddable creator-native forms" },
];

export function NitroFormsLanding() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#101116] text-[#f2f0f7]">
      <Navigation />
      <Hero />
      <Features />
      <DashboardPreview />
      <AnalyticsShowcase />
      <PricingPreview />
      <CTASection />
      <Footer />
    </main>
  );
}

function Navigation() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#101116]/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a className="flex items-center gap-3" href="#">
          <span className="grid size-9 place-items-center rounded-xl border border-indigo-300/20 bg-indigo-500/15 shadow-[0_0_28px_rgba(99,102,241,0.24)]">
            <Zap className="size-4 text-[#bfc4ff]" />
          </span>
          <span className="text-lg font-black text-[#d6d8ff]">NitroForms</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              className="text-sm font-medium text-slate-400 transition hover:text-[#c9ceff]"
              href={`#${item.toLowerCase()}`}
              key={item}
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button
            className="hidden text-slate-300 hover:bg-white/5 hover:text-white sm:inline-flex"
            variant="ghost"
          >
            Log In
          </Button>
          <Button className="rounded-xl bg-[#5865f2] px-5 font-bold text-white shadow-[0_0_32px_rgba(88,101,242,0.24)] hover:bg-[#6874ff]">
            Start Building
          </Button>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative px-5 pb-24 pt-32 sm:px-8 lg:pb-28">
      <div className="absolute left-1/2 top-0 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-[#5865f2]/12 blur-[130px]" />
      <div className="absolute right-[-160px] top-48 h-[360px] w-[360px] rounded-full bg-purple-600/15 blur-[110px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold uppercase text-slate-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <span className="size-2 rounded-full bg-[#82d7ff] shadow-[0_0_14px_rgba(130,215,255,0.9)]" />
            Now in v2.0 release
          </div>

          <h1 className="mt-7 text-5xl font-black leading-[1.02] text-white sm:text-7xl lg:text-8xl">
            Forms, but <span className="text-[#6f7aff]">faster.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Create, publish, and analyze dynamic forms from one community-native workspace. Built
            for developers who value performance and clean APIs.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Button className="h-13 rounded-2xl bg-[#5865f2] px-7 text-base font-bold text-white shadow-[0_0_36px_rgba(88,101,242,0.34)] hover:bg-[#6874ff]">
              Start Building
              <ArrowRight className="size-4" />
            </Button>
            <Button className="h-13 rounded-2xl border-white/10 bg-white/[0.04] px-7 text-base font-bold text-slate-100 hover:bg-white/[0.08]">
              Explore Templates
            </Button>
          </div>
        </div>

        <InteractiveMonitor />
      </div>
    </section>
  );
}

function InteractiveMonitor() {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    setTilt({
      rotateX: Math.max(Math.min(y * -12, 6), -6),
      rotateY: Math.max(Math.min(x * 16, 8), -8),
    });
  }

  const monitorStyle = {
    "--rotate-x": `${tilt.rotateX}deg`,
    "--rotate-y": `${tilt.rotateY}deg`,
  } as CSSProperties;

  return (
    <div className="mx-auto mt-16 max-w-6xl [perspective:1200px] sm:mt-20">
      <div
        className="group relative transition-transform duration-300 ease-out will-change-transform"
        onMouseLeave={() => setTilt({ rotateX: 0, rotateY: 0 })}
        onMouseMove={handleMouseMove}
        style={{
          ...monitorStyle,
          transform: "rotateX(var(--rotate-x)) rotateY(var(--rotate-y)) translateZ(0)",
          transformStyle: "preserve-3d",
        }}
      >
        <div className="absolute inset-x-8 top-8 h-[62%] rounded-[2rem] bg-[#5865f2]/25 blur-3xl transition-opacity duration-500 group-hover:opacity-90" />
        <div className="relative rounded-[2rem] border border-white/12 bg-[#08090d] p-2 shadow-[0_32px_90px_rgba(0,0,0,0.6),0_0_70px_rgba(88,101,242,0.2)]">
          <div className="overflow-hidden rounded-[1.55rem] border border-white/10 bg-[#11131a]">
            <DashboardScreen />
          </div>
        </div>

        <div className="mx-auto h-16 w-28 bg-gradient-to-b from-[#242637] to-[#111218]" />
        <div className="mx-auto h-4 w-56 rounded-full border border-white/10 bg-[#191b25] shadow-[0_16px_40px_rgba(0,0,0,0.45)]" />

        <div className="absolute -right-2 top-[22%] hidden w-56 rounded-2xl border border-white/10 bg-[#20222e]/80 p-4 shadow-2xl backdrop-blur-xl transition-transform duration-300 group-hover:-translate-x-2 lg:block">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Sparkles className="size-4 text-[#9bdcff]" />
            Real-time analytics
          </div>
          <div className="mt-4 h-2 rounded-full bg-white/10">
            <div className="h-full w-3/4 rounded-full bg-[#5865f2]" />
          </div>
          <p className="mt-3 text-2xl font-black text-white">+12.4%</p>
        </div>
      </div>
    </div>
  );
}

function DashboardScreen() {
  return (
    <div className="grid min-h-[390px] grid-cols-[80px_1fr] bg-[#0f1117] sm:min-h-[540px] sm:grid-cols-[220px_1fr]">
      <aside className="border-r border-white/8 bg-[#12141d] p-4 sm:p-5">
        <div className="mb-8 flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-[#5865f2]/20">
            <FileText className="size-4 text-[#c3c8ff]" />
          </span>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-white">Creator Hub</p>
            <p className="text-xs text-slate-500">Live workspace</p>
          </div>
        </div>

        <div className="space-y-2">
          {["Dashboard", "Forms", "Responses", "Analytics"].map((item, index) => (
            <div
              className={cn(
                "flex h-10 items-center gap-3 rounded-xl px-3 text-xs font-semibold text-slate-500",
                index === 0 && "bg-[#5865f2]/16 text-[#d9dcff]",
              )}
              key={item}
            >
              <span className="size-2 rounded-full bg-current" />
              <span className="hidden sm:inline">{item}</span>
            </div>
          ))}
        </div>
      </aside>

      <section className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase text-[#91d8ff]">NitroForms dashboard</p>
            <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">Beta Signup</h2>
          </div>
          <div className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-200">
            Publishing
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            ["Responses", "8,492", "+18%"],
            ["Completion", "74%", "+6%"],
            ["Avg. time", "42s", "-9s"],
          ].map(([label, value, change]) => (
            <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-4" key={label}>
              <p className="text-xs text-slate-500">{label}</p>
              <div className="mt-3 flex items-end justify-between">
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="text-xs font-bold text-[#9bdcff]">{change}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-white/8 bg-[#151823] p-5">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-bold text-white">Response velocity</p>
              <BarChart3 className="size-4 text-[#9bdcff]" />
            </div>
            <div className="flex h-40 items-end gap-2">
              {[34, 52, 44, 68, 58, 82, 72, 92, 78, 88, 96, 86].map((height, index) => (
                <div
                  className="flex-1 rounded-t-lg bg-gradient-to-t from-[#5865f2] to-[#9bdcff]"
                  key={`${height}-${index}`}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/8 bg-[#151823] p-5">
            <p className="text-sm font-bold text-white">Recent forms</p>
            <div className="mt-4 space-y-3">
              {["Launch waitlist", "Creator onboarding", "API access"].map((form, index) => (
                <div
                  className="flex items-center justify-between rounded-xl bg-white/[0.04] px-3 py-3"
                  key={form}
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-8 place-items-center rounded-lg bg-purple-500/15 text-purple-200">
                      {index + 1}
                    </span>
                    <p className="text-sm font-semibold text-slate-200">{form}</p>
                  </div>
                  <span className="text-xs text-slate-500">Live</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Features() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8" id="builder">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-black text-white sm:text-5xl">Engineered for velocity</h2>
        <p className="mt-4 text-slate-400">
          Everything creators and developers need to capture data at scale without the friction.
        </p>
      </div>

      <div className="mt-12 grid gap-4 lg:grid-cols-3">
        {featureCards.map(({ title, description, icon: Icon, className }) => (
          <article
            className={cn(
              "rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition hover:border-indigo-300/30 hover:bg-white/[0.06]",
              className,
            )}
            key={title}
          >
            <div className="mb-6 grid size-12 place-items-center rounded-2xl bg-[#5865f2]/18">
              <Icon className="size-5 text-[#c7cbff]" />
            </div>
            <h3 className="text-xl font-black text-white">{title}</h3>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <section className="border-y border-white/6 bg-[#151720] px-5 py-20 sm:px-8" id="templates">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase text-[#9bdcff]">Dashboard preview</p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">
            Manage every response from one clean command center.
          </h2>
          <p className="mt-5 max-w-xl leading-7 text-slate-400">
            Search, tag, export, and automate form responses without switching tools. NitroForms
            keeps the workflow dense, fast, and readable.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-[#0e1016] p-5 shadow-2xl">
          <div className="mb-5 flex items-center gap-2">
            <span className="size-3 rounded-full bg-red-400/50" />
            <span className="size-3 rounded-full bg-amber-300/50" />
            <span className="size-3 rounded-full bg-emerald-300/50" />
          </div>
          <div className="grid gap-3">
            {["Payment issue", "Feature request", "Community feedback"].map((item, index) => (
              <div
                className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.04] p-4"
                key={item}
              >
                <div>
                  <p className="font-bold text-white">{item}</p>
                  <p className="mt-1 text-sm text-slate-500">Response #{8420 + index}</p>
                </div>
                <span className="rounded-full bg-[#5865f2]/18 px-3 py-1 text-xs font-bold text-[#d6d8ff]">
                  triaged
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AnalyticsShowcase() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8" id="docs">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="rounded-[1.5rem] border border-white/10 bg-[#0d0f15] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
          <div className="font-mono text-sm leading-7 text-slate-300">
            {codeLines.map(({ text, className }) => (
              <p className={className} key={text}>
                {text}
              </p>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-bold uppercase text-[#9bdcff]">Analytics and API docs</p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">
            Real-time insight with clean developer primitives.
          </h2>
          <div className="mt-7 grid gap-4">
            {analyticsItems.map(({ icon: Icon, label }) => (
              <div className="flex items-center gap-3" key={label}>
                <span className="grid size-10 place-items-center rounded-xl bg-white/[0.05]">
                  <Icon className="size-4 text-[#c7cbff]" />
                </span>
                <span className="font-semibold text-slate-200">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingPreview() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8" id="pricing">
      <div className="rounded-[1.75rem] border border-indigo-200/16 bg-gradient-to-br from-white/[0.075] to-white/[0.025] p-6 shadow-[0_30px_100px_rgba(88,101,242,0.14)] sm:p-8 lg:p-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase text-[#9bdcff]">Pricing preview</p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">
              Start free. Scale when your community does.
            </h2>
            <p className="mt-5 max-w-2xl leading-7 text-slate-400">
              The pro workspace adds advanced analytics, branding controls, and higher response
              limits without slowing down the builder.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-[#5865f2]/40 bg-[#171925] p-6">
            <div className="flex items-center justify-between">
              <p className="font-black text-white">Professional</p>
              <span className="rounded-full bg-[#5865f2] px-3 py-1 text-xs font-bold text-white">
                Recommended
              </span>
            </div>
            <p className="mt-5 text-4xl font-black text-white">
              $29 <span className="text-base font-medium text-slate-500">/mo</span>
            </p>
            <div className="mt-6 space-y-3">
              {pricingRows.map((row) => (
                <div className="flex items-center gap-3 text-sm text-slate-300" key={row}>
                  <Check className="size-4 text-[#9bdcff]" />
                  {row}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-[#151823] px-6 py-14 text-center shadow-[0_0_90px_rgba(88,101,242,0.16)] sm:px-12">
        <EyeOff className="mx-auto size-8 text-[#9bdcff]" />
        <h2 className="mt-5 text-3xl font-black text-white sm:text-5xl">
          Build your next high-signal form.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-slate-400">
          Launch dynamic forms, share them instantly, and turn responses into decisions from a
          premium creator workspace.
        </p>
        <Button className="mt-8 h-13 rounded-2xl bg-[#5865f2] px-8 text-base font-bold text-white hover:bg-[#6874ff]">
          Start Building
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/8 px-5 py-10 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 text-sm text-slate-500 md:flex-row md:items-center">
        <p className="font-bold text-[#d6d8ff]">NitroForms</p>
        <p>© 2026 Nitro Workspaces Inc. All rights reserved.</p>
      </div>
    </footer>
  );
}
