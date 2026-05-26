"use client";

import { SignUp } from "@clerk/nextjs";
import { Zap } from "lucide-react";

export default function SignUpCatchAll() {
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
        <SignUp />
      </div>
    </div>
  );
}
