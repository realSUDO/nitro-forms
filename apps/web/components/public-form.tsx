"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Code2, Palette, Zap } from "lucide-react";
import { cn } from "~/lib/utils";

export function PublicForm() {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  return (
    <div className="min-h-screen bg-[#121316] text-[#e3e2e6] flex flex-col">

      {/* Top bar */}
      <header className="flex items-center justify-between px-6 h-14 border-b border-[#343538] bg-[#1a1b1e] shrink-0">
        <div className="flex items-center gap-2">
          <Zap size={18} className="text-[#5865f2]" />
          <span className="text-sm font-bold text-[#e3e2e6]">NitroForms</span>
          <span className="text-xs text-[#8f8fa0] ml-2">Premium Data Collection</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-[#8f8fa0]">
          <span className="font-mono">STEP {String(step).padStart(2, "0")}/{String(totalSteps).padStart(2, "0")}</span>
          <div className="w-24 h-1 rounded-full bg-[#343538]">
            <div className="h-full rounded-full bg-[#5865f2] transition-all" style={{ width: `${(step / totalSteps) * 100}%` }} />
          </div>
          <span className="font-mono">{Math.round((step / totalSteps) * 100)}% COMPLETE</span>
        </div>
      </header>

      {/* Form content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-xl">

          {/* Form card */}
          <div className="rounded-xl p-8 bg-[#1f1f23] border border-[#343538]">
            <h1 className="text-2xl font-bold text-[#e3e2e6] mb-2">Q3 Product Feedback Initiative</h1>
            <p className="text-sm text-[#8f8fa0] mb-8">We are refining our developer experience and want to hear about your workflow. This survey takes approximately 4 minutes to complete.</p>

            {/* Fields */}
            <div className="space-y-5">
              {/* Full name */}
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-[#8f8fa0] mb-2">
                  Full Name <span className="text-[#5865f2]">*</span>
                </label>
                <input className="w-full bg-[#0d0e11] border border-[#454655] rounded-lg px-4 py-2.5 text-sm text-[#e3e2e6] placeholder:text-[#454655] focus:border-[#5865f2] focus:shadow-[0_0_0_1px_rgba(88,101,242,0.3)] outline-none transition-all" placeholder="Enter your full name" />
              </div>

              {/* Role selection */}
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-[#8f8fa0] mb-2">Primary Role</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { Icon: Code2, label: "Developer", sub: "Engineering focus", active: true },
                    { Icon: Palette, label: "Designer", sub: "UI/UX & Product", active: false },
                  ].map(({ Icon, label, sub, active }) => (
                    <button key={label} className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border text-left transition-all",
                      active
                        ? "border-[#5865f2] bg-[#5865f2]/10 shadow-[0_0_0_1px_rgba(88,101,242,0.3)]"
                        : "border-[#454655] hover:border-[#5865f2]/50"
                    )}>
                      <Icon size={18} className={active ? "text-[#bec2ff]" : "text-[#8f8fa0]"} />
                      <div>
                        <p className="text-sm font-medium text-[#e3e2e6]">{label}</p>
                        <p className="text-xs text-[#8f8fa0]">{sub}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea */}
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-[#8f8fa0] mb-2">What is your biggest workflow bottleneck?</label>
                <textarea rows={3} className="w-full bg-[#0d0e11] border border-[#454655] rounded-lg px-4 py-2.5 text-sm text-[#e3e2e6] placeholder:text-[#454655] focus:border-[#5865f2] focus:shadow-[0_0_0_1px_rgba(88,101,242,0.3)] outline-none transition-all resize-none" placeholder="Describe your main pain point..." />
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-5 border-t border-[#343538]">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#454655] text-sm text-[#c6c5d7] hover:bg-[#292a2d] transition-colors">
                <ArrowLeft size={14} /> Save & Exit
              </button>
              <button
                onClick={() => setStep(Math.min(step + 1, totalSteps))}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#5865f2] text-sm font-medium text-white hover:bg-[#4752c4] transition-colors"
              >
                Next Step <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-center gap-4 py-4 border-t border-[#343538] text-xs text-[#8f8fa0]">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider">Powered by</span>
          <Zap size={12} className="text-[#5865f2]" />
          <span className="font-semibold text-[#c6c5d7]">NitroForms</span>
        </div>
        <span>·</span>
        <Link href="#" className="hover:text-[#c6c5d7]">Privacy Policy</Link>
        <Link href="#" className="hover:text-[#c6c5d7]">Terms of Service</Link>
      </footer>
    </div>
  );
}
