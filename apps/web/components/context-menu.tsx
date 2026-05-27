"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "~/lib/utils";

export type MenuItem = {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
  separator?: boolean;
};

type Props = {
  items: MenuItem[];
  children: React.ReactNode;
};

export function ContextMenu({ items, children }: Props) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pos) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setPos(null);
    };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setPos(null); };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", esc); };
  }, [pos]);

  return (
    <div onContextMenu={(e) => { e.preventDefault(); setPos({ x: e.clientX, y: e.clientY }); }}>
      {children}
      {pos && (
        <div ref={ref} className="fixed z-[9999] min-w-[180px] py-1.5 rounded-lg bg-[#111214] border border-[#3f4147] shadow-xl" style={{ top: pos.y, left: pos.x }}>
          {items.map((item, i) => (
            item.separator ? <div key={i} className="my-1 border-t border-[#3f4147]/50" /> : (
              <button
                key={i}
                onClick={() => { item.onClick(); setPos(null); }}
                className={cn(
                  "flex items-center gap-2 w-full px-3 py-1.5 text-sm text-left transition-colors",
                  item.danger ? "text-[#ed4245] hover:bg-[#ed4245]/10" : "text-[#b5bac1] hover:bg-[#5865f2] hover:text-white"
                )}
              >
                {item.icon}
                {item.label}
              </button>
            )
          ))}
        </div>
      )}
    </div>
  );
}
