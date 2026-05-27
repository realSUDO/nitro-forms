"use client";

import { useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Check, LogOut, X } from "lucide-react";
import { cn } from "~/lib/utils";

const SECTIONS = [
  { heading: "User Settings" },
  { id: "account", label: "My Account" },
  { id: "profiles", label: "Profiles" },
  { heading: "Billing" },
  { id: "nitro", label: "Nitro" },
  { id: "plans", label: "Plans" },
  { heading: "App Settings" },
  { id: "appearance", label: "Appearance" },
  { id: "notifications", label: "Notifications" },
  { id: "keybinds", label: "Keybinds" },
] as const;

type SectionId = Extract<(typeof SECTIONS)[number], { id: string }>["id"];

const PLANS = [
  {
    tier: "Community",
    price: "$0",
    period: "/mo",
    features: ["5 Active Forms", "100 Submissions / mo", "Basic Analytics", "Public Forms"],
    cta: "Current Plan",
    highlight: false,
  },
  {
    tier: "Professional",
    price: "$29",
    period: "/mo",
    features: ["Unlimited Forms", "10,000 Submissions", "Advanced Analytics", "Custom Branding", "Smart AI Generation", "Priority Support"],
    cta: "Upgrade",
    highlight: true,
  },
  {
    tier: "Enterprise",
    price: "Custom",
    period: "",
    features: ["Everything in Pro", "Dedicated Support", "SSO / SAML", "On-Premise Hosting", "Custom Integrations", "SLA Guarantee"],
    cta: "Contact Sales",
    highlight: false,
  },
];

export function PricingPage() {
  const [active, setActive] = useState<SectionId>("plans");
  const { signOut } = useClerk();
  const { user } = useUser();

  return (
    <>
      {/* Settings sidebar */}
      <aside className="w-[220px] shrink-0 flex flex-col bg-[#2b2d31] overflow-y-auto py-6 px-2">
        {SECTIONS.map((item, i) => (
          "heading" in item ? (
            <p key={i} className="px-2.5 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[#949ba4]">{item.heading}</p>
          ) : (
            <button key={item.id} onClick={() => setActive(item.id)} className={cn(
              "w-full text-left px-2.5 py-1.5 rounded text-sm transition-colors mb-0.5",
              active === item.id ? "bg-[#3f4147] text-[#f2f3f5]" : "text-[#949ba4] hover:bg-[#3f4147]/50 hover:text-[#b5bac1]"
            )}>
              {item.label}
            </button>
          )
        ))}
        <div className="mt-auto pt-4 border-t border-[#3f4147]/50 mx-2">
          <button onClick={() => signOut({ redirectUrl: "/" })} className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded text-sm text-[#ed4245] hover:bg-[#ed4245]/10 transition-colors">
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto bg-[#313338] py-8 px-10">
        <div className="max-w-[740px]">
          {active === "account" && (
            <div>
              <h2 className="text-xl font-bold text-[#f2f3f5] mb-4">My Account</h2>
              <div className="rounded-lg bg-[#2b2d31] p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#5865f2] flex items-center justify-center text-2xl font-bold text-white">
                    {(user?.firstName?.[0] ?? user?.username?.[0] ?? "U").toUpperCase()}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-[#f2f3f5]">{user?.fullName ?? user?.username ?? "User"}</p>
                    <p className="text-sm text-[#949ba4]">{user?.primaryEmailAddress?.emailAddress ?? ""}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {active === "profiles" && (
            <div>
              <h2 className="text-xl font-bold text-[#f2f3f5] mb-4">Profiles</h2>
              <p className="text-sm text-[#949ba4]">Profile customization coming soon.</p>
            </div>
          )}

          {active === "nitro" && (
            <div>
              <h2 className="text-xl font-bold text-[#f2f3f5] mb-4">Nitro</h2>
              <div className="rounded-lg p-6" style={{ background: "linear-gradient(135deg, #5865f2 0%, #28418e 100%)" }}>
                <p className="text-xl font-bold text-white mb-2">NitroForms Pro</p>
                <p className="text-sm text-white/80 mb-4">Unlimited forms, advanced analytics, custom branding, and priority support.</p>
                <button className="px-4 py-2 rounded-lg bg-white/20 text-white text-sm font-medium hover:bg-white/30 transition-colors">
                  Subscribe — $29/mo
                </button>
              </div>
            </div>
          )}

          {active === "plans" && (
            <div>
              <h2 className="text-xl font-bold text-[#f2f3f5] mb-6">Plans</h2>
              <div className="grid grid-cols-3 gap-4">
                {PLANS.map(({ tier, price, period, features, cta, highlight }) => (
                  <div key={tier} className={cn(
                    "rounded-lg p-5 flex flex-col",
                    highlight ? "bg-[#5865f2]/10 border border-[#5865f2]" : "bg-[#2b2d31]"
                  )}>
                    <h3 className="text-base font-bold text-[#f2f3f5]">{tier}</h3>
                    <div className="flex items-baseline gap-0.5 mt-2 mb-4">
                      <span className="text-2xl font-bold text-[#f2f3f5]">{price}</span>
                      {period && <span className="text-xs text-[#949ba4]">{period}</span>}
                    </div>
                    <ul className="space-y-2 mb-6 flex-1">
                      {features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-xs text-[#b5bac1]">
                          <Check size={12} className="text-[#3ba55c] shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                    <button className={cn(
                      "w-full py-2 rounded text-sm font-medium transition-colors",
                      highlight ? "bg-[#5865f2] text-white hover:bg-[#4752c4]" : "border border-[#4e5058] text-[#b5bac1] hover:bg-[#3f4147]"
                    )}>
                      {cta}
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-center text-xs text-[#4e5058] mt-4">Payments not implemented for this demo.</p>
            </div>
          )}

          {active === "appearance" && (
            <div>
              <h2 className="text-xl font-bold text-[#f2f3f5] mb-4">Appearance</h2>
              <div className="rounded-lg bg-[#2b2d31] p-5">
                <p className="text-sm text-[#b5bac1] mb-3">Theme</p>
                <div className="flex gap-3">
                  <div className="w-16 h-16 rounded-lg bg-[#313338] border-2 border-[#5865f2] flex items-center justify-center">
                    <span className="text-xs text-[#f2f3f5]">Dark</span>
                  </div>
                  <div className="w-16 h-16 rounded-lg bg-[#f2f3f5] border border-[#4e5058] flex items-center justify-center opacity-50">
                    <span className="text-xs text-[#313338]">Light</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {active === "notifications" && (
            <div>
              <h2 className="text-xl font-bold text-[#f2f3f5] mb-4">Notifications</h2>
              <div className="rounded-lg bg-[#2b2d31] p-5 space-y-4">
                {["Email on new response", "Email on form limit reached", "Weekly digest"].map(n => (
                  <div key={n} className="flex items-center justify-between">
                    <span className="text-sm text-[#b5bac1]">{n}</span>
                    <div className="w-10 h-5 rounded-full bg-[#3ba55c] relative"><div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white" /></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {active === "keybinds" && (
            <div>
              <h2 className="text-xl font-bold text-[#f2f3f5] mb-4">Keybinds</h2>
              <div className="rounded-lg bg-[#2b2d31] p-5 space-y-3">
                {[
                  { action: "Save form", keys: "Ctrl + S" },
                  { action: "Delete node", keys: "Delete / Backspace" },
                  { action: "Undo", keys: "Ctrl + Z" },
                  { action: "Preview form", keys: "Ctrl + P" },
                ].map(({ action, keys }) => (
                  <div key={action} className="flex items-center justify-between">
                    <span className="text-sm text-[#b5bac1]">{action}</span>
                    <kbd className="px-2 py-0.5 rounded bg-[#1e1f22] text-xs text-[#949ba4] font-mono">{keys}</kbd>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Close button — Discord style */}
      <div className="w-14 shrink-0 flex flex-col items-center pt-8 bg-[#313338]">
        <Link href="/dashboard" className="w-9 h-9 rounded-full border border-[#4e5058] flex items-center justify-center text-[#949ba4] hover:border-[#f2f3f5] hover:text-[#f2f3f5] transition-colors">
          <X size={16} />
        </Link>
        <span className="text-[10px] text-[#949ba4] mt-1">ESC</span>
      </div>
    </>
  );
}
