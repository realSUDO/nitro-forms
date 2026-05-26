"use client";

import Link from "next/link";
import { Check, Zap } from "lucide-react";
import { cn } from "~/lib/utils";

const PLANS = [
  {
    tier: "Community",
    price: "$0",
    period: "/mo",
    description: "For individuals getting started.",
    features: ["5 Active Forms", "100 Submissions / mo", "Basic Analytics", "Public Forms"],
    cta: "Get Started",
    highlight: false,
  },
  {
    tier: "Professional",
    price: "$29",
    period: "/mo",
    description: "For teams and power creators.",
    features: ["Unlimited Forms", "10,000 Submissions", "Advanced Analytics", "Custom Branding", "Smart AI Generation", "Priority Support"],
    cta: "Start Pro Trial",
    highlight: true,
  },
  {
    tier: "Enterprise",
    price: "Custom",
    period: "",
    description: "For organizations at scale.",
    features: ["Everything in Pro", "Dedicated Support", "SSO / SAML", "On-Premise Hosting", "Custom Integrations", "SLA Guarantee"],
    cta: "Contact Sales",
    highlight: false,
  },
];

export function PricingPage() {
  return (
    <div className="min-h-screen bg-[#121316] text-[#e3e2e6]">

      {/* Nav */}
      <header className="flex items-center justify-between px-8 h-16 border-b border-[#343538]">
        <Link href="/" className="flex items-center gap-2">
          <Zap size={20} className="text-[#5865f2]" />
          <span className="text-lg font-bold text-[#e3e2e6]">NitroForms</span>
        </Link>
        <nav className="flex items-center gap-6">
          {["Builder", "Templates", "Docs", "Pricing"].map(item => (
            <Link key={item} href={item === "Pricing" ? "/pricing" : item === "Builder" ? "/builder" : item === "Templates" ? "/explore" : "#"} className={cn(
              "text-sm transition-colors",
              item === "Pricing" ? "text-[#e3e2e6] font-semibold" : "text-[#8f8fa0] hover:text-[#e3e2e6]"
            )}>
              {item}
            </Link>
          ))}
          <Link href="/dashboard" className="px-4 py-1.5 rounded-lg bg-[#5865f2] text-sm text-white font-medium hover:bg-[#4752c4] transition-colors">
            Dashboard
          </Link>
        </nav>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-[#e3e2e6] mb-3">Simple, transparent pricing</h1>
          <p className="text-lg text-[#8f8fa0]">No hidden fees. Upgrade or downgrade anytime.</p>
        </div>

        <div className="grid grid-cols-3 gap-5">
          {PLANS.map(({ tier, price, period, description, features, cta, highlight }) => (
            <div key={tier} className={cn(
              "rounded-xl p-6 flex flex-col",
              highlight
                ? "bg-[#5865f2]/10 border-2 border-[#5865f2] shadow-[0_0_30px_rgba(88,101,242,0.15)]"
                : "bg-[#1f1f23] border border-[#343538]"
            )}>
              {highlight && <span className="text-[10px] font-mono uppercase tracking-widest text-[#bec2ff] mb-2">Most Popular</span>}
              <h3 className="text-xl font-bold text-[#e3e2e6]">{tier}</h3>
              <p className="text-sm text-[#8f8fa0] mt-1 mb-5">{description}</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-[#e3e2e6]">{price}</span>
                {period && <span className="text-sm text-[#8f8fa0]">{period}</span>}
              </div>
              <ul className="space-y-2.5 mb-8 flex-1">
                {features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-[#c6c5d7]">
                    <Check size={14} className="text-[#5865f2] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className={cn(
                "w-full py-2.5 rounded-lg text-sm font-semibold transition-colors",
                highlight
                  ? "bg-[#5865f2] text-white hover:bg-[#4752c4]"
                  : "border border-[#454655] text-[#c6c5d7] hover:bg-[#292a2d]"
              )}>
                {cta}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-[#8f8fa0] mt-8">
          Payments are not implemented for this hackathon demo. All features are available for testing.
        </p>
      </main>
    </div>
  );
}
