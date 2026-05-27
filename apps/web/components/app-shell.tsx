"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { BarChart2, Compass, LayoutGrid, Settings } from "lucide-react";
import { cn } from "~/lib/utils";

const NAV_ITEMS = [
  { Icon: LayoutGrid, href: "/dashboard", label: "Dashboard" },
  { Icon: BarChart2, href: "/analytics", label: "Analytics" },
  { Icon: Compass, href: "/explore", label: "Explore" },
  { Icon: Settings, href: "/pricing", label: "Settings" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <div className="flex h-screen overflow-hidden bg-[#313338] text-[#f2f3f5]">
      {/* Shared Rail */}
      <aside className="w-[72px] shrink-0 bg-[#1e1f22] flex flex-col items-center py-4 gap-3">
        <Link href="/dashboard" prefetch className="w-12 h-12 rounded-2xl bg-[#2b2d31] flex items-center justify-center mb-2">
          <img src="/nitro.png" alt="NitroForms" className="w-8 h-8" />
        </Link>

        {NAV_ITEMS.map(({ Icon, href, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href} prefetch title={label} className={cn(
              "relative w-10 h-10 rounded-full flex items-center justify-center transition-colors",
              active ? "bg-[#3f4147] text-[#f2f3f5]" : "text-[#949ba4] hover:bg-[#3f4147] hover:text-[#f2f3f5]"
            )}>
              {active && <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-white" />}
              <Icon size={18} />
            </Link>
          );
        })}

        <div className="flex-1" />
        {/* User avatar */}
        <Link href="/pricing" prefetch title="Settings" className="w-10 h-10 rounded-full bg-[#5865f2] flex items-center justify-center text-sm font-bold text-white hover:opacity-80 transition-opacity">
          {(user?.firstName?.[0] ?? user?.username?.[0] ?? "U").toUpperCase()}
        </Link>
      </aside>

      {/* Page content */}
      <div className="flex-1 flex min-w-0 min-h-0">
        {children}
      </div>
    </div>
  );
}
