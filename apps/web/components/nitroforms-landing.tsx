"use client";

import type { CSSProperties, MouseEvent } from "react";
import { useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  BarChart2,
  Check,
  Code2,
  Hash,
  Link2,
  PanelsTopLeft,
  Users,
  Webhook,
  Zap,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const navItems = ["Builder", "Templates", "Docs", "Pricing"];

const featureCards = [
  {
    title: "Drag-and-drop builder",
    description:
      "Conditional fields, branching logic, and live validation. Build complex forms without writing a line of config.",
    icon: PanelsTopLeft,
    className: "lg:col-span-2",
  },
  {
    title: "Public & unlisted links",
    description:
      "Share with a link, password-protect it, or embed it anywhere. No account required to respond.",
    icon: Link2,
  },
  {
    title: "Response analytics",
    description:
      "See where people drop off, how long they take, and which fields get skipped.",
    icon: BarChart2,
  },
  {
    title: "Webhooks & REST API",
    description:
      "POST submissions to your backend, trigger automations, or pull data with a typed SDK.",
    icon: Webhook,
    className: "lg:col-span-2",
  },
];

const pricingRows = ["Unlimited forms", "10k monthly responses", "Custom branding"];

const codeLines = [
  { text: "curl -X POST https://api.nitroforms.com/v2/forms \\", className: "text-[#c7cbff]" },
  { text: '  -H "Authorization: Bearer NITRO_SK_..." \\', className: "text-[#b5bac1]" },
  { text: "  -d '{", className: "text-[#b5bac1]" },
  { text: '    "title": "Beta Signup",', className: "text-[#d6d8ff] pl-2" },
  { text: '    "schema": ["email", "role", "server"]', className: "text-[#d6d8ff] pl-2" },
  { text: "  }'", className: "text-[#b5bac1]" },
];

const serverChannels = [
  { name: "general-feedback", count: 142 },
  { name: "bug-reports", count: 38 },
  { name: "feature-requests", count: 91 },
];

export function NitroFormsLanding() {
  return (
    <main
      className="min-h-screen overflow-hidden bg-[#1e1f22] text-[#dbdee1]"
      style={{ fontFamily: "var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif" }}
    >
      <Navigation />
      <Hero />
      <Features />
      <DashboardPreview />
      <ApiSection />
      <PricingPreview />
      <CTASection />
      <Footer />
    </main>
  );
}

function Navigation() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#1e1f22]/90 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-6">
        <a className="flex items-center gap-2.5" href="#">
          <span className="grid size-7 place-items-center rounded-md bg-[#5865f2]">
            <Zap className="size-3.5 text-white" />
          </span>
          <span
            className="text-[15px] font-bold text-white"
            style={{ fontFamily: "var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif" }}
          >
            NitroForms
          </span>
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <a
              className="text-sm text-[#949ba4] transition-colors hover:text-[#dbdee1]"
              href={`#${item.toLowerCase()}`}
              key={item}
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            className="hidden h-8 rounded-md px-3 text-sm text-[#949ba4] hover:bg-white/[0.06] hover:text-white sm:inline-flex"
            variant="ghost"
          >
            Log in
          </Button>
          <Button className="h-8 rounded-md bg-[#5865f2] px-4 text-sm font-semibold text-white hover:bg-[#4752c4]">
            Get started
          </Button>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative px-5 pb-16 pt-28 sm:px-6">
      {/* Very subtle background glow — not the AI-product kind */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[360px] w-[600px] -translate-x-1/2 rounded-full bg-[#5865f2]/6 blur-[100px]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-md border border-white/[0.08] bg-[#2b2d31] px-3 py-1 text-xs font-medium text-[#949ba4]">
            <span className="size-1.5 rounded-full bg-[#23a55a]" />
            v2.0 is live
          </div>

          <h1
            className="mt-5 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif", letterSpacing: "-0.02em" }}
          >
            Forms that fit your{" "}
            <span className="text-[#949cff]">community.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#949ba4]">
            Build, share, and track forms without the bloat. Works great for Discord servers,
            open-source projects, and dev communities.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button className="h-10 rounded-md bg-[#5865f2] px-5 text-sm font-semibold text-white hover:bg-[#4752c4]">
              Start building
              <ArrowRight className="size-4" />
            </Button>
            <Button className="h-10 rounded-md border border-white/[0.08] bg-[#2b2d31] px-5 text-sm font-medium text-[#dbdee1] hover:bg-[#313338]">
              Browse templates
            </Button>
          </div>

          {/* Social proof — community feel */}
          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-[#6d6f78]">
            <span className="flex items-center gap-1.5">
              <Users className="size-3.5" />
              12,000+ forms created
            </span>
            <span className="h-3 w-px bg-white/10" />
            <span className="flex items-center gap-1.5">
              <Hash className="size-3.5" />
              Used in 800+ Discord servers
            </span>
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
      rotateX: Math.max(Math.min(y * -6, 3), -3),
      rotateY: Math.max(Math.min(x * 8, 4), -4),
    });
  }

  const monitorStyle = {
    "--rotate-x": `${tilt.rotateX}deg`,
    "--rotate-y": `${tilt.rotateY}deg`,
  } as CSSProperties;

  return (
    <div className="mx-auto mt-12 max-w-4xl [perspective:1200px]">
      <div
        className="relative transition-transform duration-300 ease-out"
        onMouseLeave={() => setTilt({ rotateX: 0, rotateY: 0 })}
        onMouseMove={handleMouseMove}
        style={{
          ...monitorStyle,
          transform: "rotateX(var(--rotate-x)) rotateY(var(--rotate-y)) translateZ(0)",
          transformStyle: "preserve-3d",
        }}
      >
        <div className="relative overflow-hidden rounded-xl border border-white/[0.07] bg-[#111214] p-1.5 shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
          <Image
            alt="NitroForms dashboard"
            className="block w-full rounded-lg border border-white/[0.05] bg-[#1e1f2a]"
            draggable={false}
            height={512}
            priority
            src="/images/nitroforms-monitor.png"
            width={512}
          />
        </div>
      </div>
    </div>
  );
}

function Features() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6" id="builder">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#5865f2]">Features</p>
        <h2
          className="mt-2 text-2xl font-bold text-white sm:text-3xl"
          style={{ fontFamily: "var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif" }}
        >
          Everything you need, nothing you don't
        </h2>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        {featureCards.map(({ title, description, icon: Icon, className }) => (
          <article
            className={cn(
              "rounded-lg border border-white/[0.07] bg-[#2b2d31] p-5 transition-colors hover:border-white/[0.12] hover:bg-[#313338]",
              className,
            )}
            key={title}
          >
            <div className="mb-4 grid size-9 place-items-center rounded-md bg-[#5865f2]/15">
              <Icon className="size-4 text-[#949cff]" />
            </div>
            <h3
              className="text-base font-semibold text-white"
              style={{ fontFamily: "var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif" }}
            >
              {title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#949ba4]">{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <section
      className="border-y border-white/[0.06] bg-[#23272a] px-5 py-16 sm:px-6"
      id="templates"
    >
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#5865f2]">
            Response management
          </p>
          <h2
            className="mt-2 text-2xl font-bold text-white sm:text-3xl"
            style={{ fontFamily: "var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif" }}
          >
            Feels like a Discord server, works like a CRM
          </h2>
          <p className="mt-4 leading-7 text-[#949ba4]">
            Organize responses into channels, tag them, export to CSV, or pipe them straight to
            your backend. No extra tools needed.
          </p>
        </div>

        {/* Discord-style server panel mockup */}
        <div className="overflow-hidden rounded-lg border border-white/[0.07] bg-[#1e1f22] shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
            <span className="size-2.5 rounded-full bg-red-400/50" />
            <span className="size-2.5 rounded-full bg-amber-300/50" />
            <span className="size-2.5 rounded-full bg-emerald-400/50" />
            <span className="ml-2 text-xs font-medium text-[#6d6f78]">NitroForms — responses</span>
          </div>

          <div className="flex">
            {/* Sidebar */}
            <div className="w-44 border-r border-white/[0.06] bg-[#2b2d31] p-3">
              <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-[#6d6f78]">
                Form channels
              </p>
              {serverChannels.map(({ name, count }) => (
                <div
                  className="flex items-center justify-between rounded px-2 py-1.5 text-xs text-[#949ba4] hover:bg-white/[0.05] hover:text-[#dbdee1]"
                  key={name}
                >
                  <span className="flex items-center gap-1.5">
                    <Hash className="size-3 shrink-0" />
                    {name}
                  </span>
                  <span className="rounded-full bg-[#5865f2]/20 px-1.5 py-0.5 text-[10px] font-semibold text-[#949cff]">
                    {count}
                  </span>
                </div>
              ))}
            </div>

            {/* Main content */}
            <div className="flex-1 p-4">
              {["Payment issue", "Feature request", "Community feedback"].map((item, i) => (
                <div
                  className="mb-2 flex items-center justify-between rounded-md border border-white/[0.06] bg-[#2b2d31] px-3 py-2.5"
                  key={item}
                >
                  <div>
                    <p className="text-sm font-medium text-white">{item}</p>
                    <p className="mt-0.5 text-xs text-[#6d6f78]">#{8420 + i}</p>
                  </div>
                  <span className="rounded bg-[#5865f2]/15 px-2 py-0.5 text-[11px] font-semibold text-[#949cff]">
                    new
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ApiSection() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6" id="docs">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#5865f2]">
            Developer API
          </p>
          <h2
            className="mt-2 text-2xl font-bold text-white sm:text-3xl"
            style={{ fontFamily: "var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif" }}
          >
            Built for developers first
          </h2>
          <p className="mt-4 leading-7 text-[#949ba4]">
            Full REST API, typed SDK, and webhook support. Integrate NitroForms into your bot,
            dashboard, or CI pipeline in minutes.
          </p>
          <div className="mt-6 space-y-3">
            {[
              { icon: Code2, label: "TypeScript SDK with full type safety" },
              { icon: Webhook, label: "Webhook callbacks on every submission" },
              { icon: Link2, label: "Embeddable React & Vue components" },
            ].map(({ icon: Icon, label }) => (
              <div className="flex items-center gap-3 text-sm text-[#949ba4]" key={label}>
                <span className="grid size-8 place-items-center rounded-md bg-[#2b2d31]">
                  <Icon className="size-4 text-[#949cff]" />
                </span>
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Code block */}
        <div className="overflow-hidden rounded-lg border border-white/[0.07] bg-[#111214] shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
            <span className="size-2.5 rounded-full bg-red-400/50" />
            <span className="size-2.5 rounded-full bg-amber-300/50" />
            <span className="size-2.5 rounded-full bg-emerald-400/50" />
            <span className="ml-2 text-xs text-[#6d6f78]">terminal</span>
          </div>
          <div className="p-5 font-mono text-sm leading-7">
            {codeLines.map(({ text, className }) => (
              <p className={cn("text-[#b5bac1]", className)} key={text}>
                {text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingPreview() {
  return (
    <section
      className="border-t border-white/[0.06] bg-[#23272a] px-5 py-16 sm:px-6"
      id="pricing"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#5865f2]">Pricing</p>
          <h2
            className="mt-2 text-2xl font-bold text-white sm:text-3xl"
            style={{ fontFamily: "var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif" }}
          >
            Free to start, fair to scale
          </h2>
        </div>

        <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3">
          {/* Free */}
          <div className="rounded-lg border border-white/[0.07] bg-[#2b2d31] p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6d6f78]">Free</p>
            <p
              className="mt-3 text-2xl font-bold text-white"
              style={{ fontFamily: "var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif" }}
            >
              $0
            </p>
            <p className="mt-1 text-xs text-[#6d6f78]">forever</p>
            <div className="mt-5 space-y-2.5 text-sm text-[#949ba4]">
              <div className="flex items-center gap-2"><Check className="size-3.5 text-[#23a55a]" /> 5 active forms</div>
              <div className="flex items-center gap-2"><Check className="size-3.5 text-[#23a55a]" /> 100 responses/mo</div>
              <div className="flex items-center gap-2"><Check className="size-3.5 text-[#23a55a]" /> Basic analytics</div>
            </div>
            <Button className="mt-6 h-8 w-full rounded-md border border-white/[0.08] bg-transparent text-sm text-[#dbdee1] hover:bg-white/[0.06]">
              Get started
            </Button>
          </div>

          {/* Pro — highlighted */}
          <div className="relative rounded-lg border border-[#5865f2]/50 bg-[#2b2d31] p-5 shadow-[0_0_0_1px_rgba(88,101,242,0.2)]">
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-[#5865f2] px-3 py-0.5 text-[10px] font-bold uppercase text-white">
              Popular
            </span>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#5865f2]">Pro</p>
            <p
              className="mt-3 text-2xl font-bold text-white"
              style={{ fontFamily: "var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif" }}
            >
              $29
            </p>
            <p className="mt-1 text-xs text-[#6d6f78]">per month</p>
            <div className="mt-5 space-y-2.5 text-sm text-[#949ba4]">
              {pricingRows.map((row) => (
                <div className="flex items-center gap-2" key={row}>
                  <Check className="size-3.5 text-[#23a55a]" />
                  {row}
                </div>
              ))}
            </div>
            <Button className="mt-6 h-8 w-full rounded-md bg-[#5865f2] text-sm font-semibold text-white hover:bg-[#4752c4]">
              Start free trial
            </Button>
          </div>

          {/* Enterprise */}
          <div className="rounded-lg border border-white/[0.07] bg-[#2b2d31] p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6d6f78]">Enterprise</p>
            <p
              className="mt-3 text-2xl font-bold text-white"
              style={{ fontFamily: "var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif" }}
            >
              Custom
            </p>
            <p className="mt-1 text-xs text-[#6d6f78]">talk to us</p>
            <div className="mt-5 space-y-2.5 text-sm text-[#949ba4]">
              <div className="flex items-center gap-2"><Check className="size-3.5 text-[#23a55a]" /> SSO / SAML</div>
              <div className="flex items-center gap-2"><Check className="size-3.5 text-[#23a55a]" /> Dedicated support</div>
              <div className="flex items-center gap-2"><Check className="size-3.5 text-[#23a55a]" /> On-premise option</div>
            </div>
            <Button className="mt-6 h-8 w-full rounded-md border border-white/[0.08] bg-transparent text-sm text-[#dbdee1] hover:bg-white/[0.06]">
              Contact us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="px-5 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl rounded-lg border border-white/[0.07] bg-[#2b2d31] px-6 py-12 text-center">
        <h2
          className="text-2xl font-bold text-white sm:text-3xl"
          style={{ fontFamily: "var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif" }}
        >
          Ready to ship your first form?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[#949ba4]">
          Takes about 2 minutes to set up. No credit card needed.
        </p>
        <Button className="mt-6 h-10 rounded-md bg-[#5865f2] px-6 text-sm font-semibold text-white hover:bg-[#4752c4]">
          Start building
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/[0.06] px-5 py-8 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-5 text-sm text-[#6d6f78] md:flex-row md:items-center">
        <div className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded bg-[#5865f2]">
            <Zap className="size-3 text-white" />
          </span>
          <span className="font-semibold text-[#dbdee1]">NitroForms</span>
        </div>
        <div className="flex gap-6">
          {["Twitter", "GitHub", "Discord", "Status"].map((link) => (
            <a className="transition-colors hover:text-[#dbdee1]" href="#" key={link}>
              {link}
            </a>
          ))}
        </div>
        <p>© 2026 Nitro Workspaces Inc.</p>
      </div>
    </footer>
  );
}
