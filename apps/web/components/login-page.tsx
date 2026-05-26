"use client";

import { SignIn, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Zap } from "lucide-react";

export function LoginPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#313338] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#5865f2] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isSignedIn) {
    return null; // redirecting
  }

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
        <SignIn forceRedirectUrl="/dashboard" />
      </div>

      <p className="text-[10px] font-mono text-[#4e5058] mt-4 relative z-10">
        Demo: demo@nitroforms.dev / password123
      </p>
    </div>
  );
}
