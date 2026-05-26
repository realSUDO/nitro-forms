"use client";

import { SignUp } from "@clerk/nextjs";
import { Zap } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#313338] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#5865f2]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="flex items-center gap-2 mb-6 relative z-10">
        <div className="w-9 h-9 rounded-full bg-[#5865f2] flex items-center justify-center">
          <Zap size={18} className="text-white" />
        </div>
        <span className="text-lg font-bold text-[#f2f3f5]">NitroForms</span>
      </div>
      <div className="relative z-10">
        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full max-w-sm",
              card: "bg-[#383a40] border-none shadow-none",
              headerTitle: "text-[#f2f3f5]",
              headerSubtitle: "text-[#949ba4]",
              formFieldLabel: "text-[#b5bac1] font-mono text-[11px] uppercase tracking-widest",
              formFieldInput: "bg-[#1e1f22] border-[#1e1f22] text-[#f2f3f5] focus:border-[#5865f2]",
              formButtonPrimary: "bg-[#5865f2] hover:bg-[#4752c4]",
              footerActionLink: "text-[#5865f2] hover:text-[#bec2ff]",
              socialButtonsBlockButton: "border-[#4e5058] text-[#b5bac1] hover:bg-[#3f4147]",
              dividerLine: "bg-[#4e5058]",
              dividerText: "text-[#949ba4]",
            },
          }}
        />
      </div>
    </div>
  );
}
