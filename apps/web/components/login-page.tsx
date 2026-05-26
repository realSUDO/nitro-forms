"use client";

import Link from "next/link";
import { Zap } from "lucide-react";

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#313338] relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#5865f2]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        <div className="rounded-xl p-8 bg-[#383a40]">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-full bg-[#5865f2] flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-[#f2f3f5]">NitroForms</span>
          </div>

          {/* Heading */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#f2f3f5]">Welcome back</h1>
            <p className="text-sm text-[#949ba4] mt-1">Sign in to your workspace</p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-widest text-[#b5bac1] mb-1.5">Email</label>
              <input
                type="email"
                className="w-full bg-[#1e1f22] border border-[#1e1f22] rounded-lg px-3 py-2.5 text-sm text-[#f2f3f5] placeholder:text-[#4e5058] focus:border-[#5865f2] focus:outline-none transition-colors"
                placeholder="demo@nitroforms.dev"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-widest text-[#b5bac1] mb-1.5">Password</label>
              <input
                type="password"
                className="w-full bg-[#1e1f22] border border-[#1e1f22] rounded-lg px-3 py-2.5 text-sm text-[#f2f3f5] placeholder:text-[#4e5058] focus:border-[#5865f2] focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>
            <Link href="/dashboard" className="block w-full py-2.5 rounded-lg bg-[#5865f2] text-center text-sm font-semibold text-white hover:bg-[#4752c4] transition-colors mt-2">
              Sign In
            </Link>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[#4e5058]" />
            <span className="text-xs text-[#949ba4]">Or continue with</span>
            <div className="flex-1 h-px bg-[#4e5058]" />
          </div>

          {/* Google */}
          <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[#4e5058] text-sm text-[#b5bac1] hover:bg-[#3f4147] transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>

          {/* Footer */}
          <p className="text-center text-xs text-[#949ba4] mt-5">
            Don&apos;t have an account?{" "}
            <Link href="/login" className="text-[#5865f2] hover:underline">Sign up</Link>
          </p>

          {/* Demo hint */}
          <p className="text-center text-[10px] font-mono text-[#4e5058] mt-4">
            Demo: demo@nitroforms.dev / password123
          </p>
        </div>
      </div>
    </div>
  );
}
