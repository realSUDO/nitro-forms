"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BarChart2,
  ChevronDown,
  FileText,
  Gamepad2,
  Hash,
  Loader2,
  Plus,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { trpc } from "~/trpc/client";

export function CreatorDashboard() {
  const router = useRouter();
  const { data: forms, isLoading } = trpc.form.listMine.useQuery();
  const createForm = trpc.form.create.useMutation({
    onSuccess: (form) => router.push(`/builder/${form!.id}`),
  });

  const formList = forms ?? [];
  const published = formList.filter(f => f.status === "published");
  const drafts = formList.filter(f => f.status === "draft");

  return (
    <>
      {/* Sidebar */}
      <aside className="w-[240px] shrink-0 flex flex-col bg-[#2b2d31]">
        <div className="flex items-center justify-between px-4 h-12 font-semibold text-sm text-[#f2f3f5] shrink-0">
          NitroForms
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          <div className="px-1 py-2">
            <button onClick={() => createForm.mutate({ title: "Untitled Form" })} disabled={createForm.isPending} className="flex items-center gap-2 w-full px-3 py-2 rounded bg-[#5865f2] text-white text-sm font-medium hover:bg-[#4752c4] transition-colors disabled:opacity-50">
              {createForm.isPending ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />} Create Form
            </button>
          </div>
          {drafts.length > 0 && (
            <div className="pt-2">
              <p className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#949ba4]"><ChevronDown size={11} /> Drafts</p>
              {drafts.map(f => (
                <Link prefetch key={f.id} href={`/builder/${f.id}`} className="flex items-center gap-2 px-2 py-1.5 rounded text-sm text-[#949ba4] hover:bg-[#3f4147] hover:text-[#f2f3f5] transition-colors">
                  <Hash size={14} className="text-[#4e5058]" /><span className="truncate">{f.title}</span>
                </Link>
              ))}
            </div>
          )}
          {published.length > 0 && (
            <div className="pt-2">
              <p className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#949ba4]"><ChevronDown size={11} /> Published</p>
              {published.map(f => (
                <Link prefetch key={f.id} href={`/builder/${f.id}`} className="flex items-center gap-2 px-2 py-1.5 rounded text-sm text-[#949ba4] hover:bg-[#3f4147] hover:text-[#f2f3f5] transition-colors">
                  <Hash size={14} className="text-[#f2f3f5]" /><span className="truncate">{f.title}</span>
                </Link>
              ))}
            </div>
          )}
          <div className="pt-2">
            <Link href="/explore" className="flex items-center gap-2 px-2 py-1.5 rounded text-sm text-[#949ba4] hover:bg-[#3f4147] hover:text-[#f2f3f5] transition-colors">
              <Gamepad2 size={14} className="text-[#4e5058]" /> Browse Templates
            </Link>
          </div>
        </div>
      </aside>
      <div className="w-px cursor-col-resize bg-[#3f4147]/50 hover:bg-[#5865f2]/50 active:bg-[#5865f2] transition-colors shrink-0"
        onMouseDown={(e) => {
          const startX = e.clientX;
          const aside = e.currentTarget.previousElementSibling as HTMLElement;
          const startW = aside.offsetWidth;
          document.body.style.userSelect = "none";
          const onMove = (ev: MouseEvent) => { aside.style.width = `${Math.min(Math.max(startW + (ev.clientX - startX), 160), 400)}px`; };
          const onUp = () => { document.body.style.userSelect = ""; document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
          document.addEventListener("mousemove", onMove);
          document.addEventListener("mouseup", onUp);
        }}
      />

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-[#313338] p-6">
        <div className="max-w-4xl">
          <h1 className="text-2xl font-bold text-[#f2f3f5] mb-1">Creator Dashboard</h1>
          <p className="text-sm text-[#949ba4] mb-6">Manage your forms and track responses.</p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: "Total Forms", value: formList.length, Icon: FileText },
              { label: "Published", value: published.length, Icon: Hash },
              { label: "Drafts", value: drafts.length, Icon: BarChart2 },
            ].map(({ label, value, Icon }) => (
              <div key={label} className="rounded-lg p-4 bg-[#2b2d31]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#949ba4]">{label}</span>
                  <Icon size={14} className="text-[#4e5058]" />
                </div>
                <span className="text-2xl font-bold text-[#f2f3f5]">{value}</span>
              </div>
            ))}
          </div>

          <div className="rounded-lg overflow-hidden bg-[#2b2d31]">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm font-semibold text-[#f2f3f5]">All Forms</span>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-12"><Loader2 className="animate-spin text-[#5865f2]" size={24} /></div>
            ) : formList.length === 0 ? (
              <div className="text-center py-12 text-[#949ba4]"><FileText size={32} className="mx-auto mb-3 text-[#4e5058]" /><p className="text-sm">No forms yet.</p></div>
            ) : (
              <table className="w-full">
                <thead><tr className="border-t border-[#3f4147]">{["Form", "Status", "Visibility", ""].map(h => <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#949ba4]">{h}</th>)}</tr></thead>
                <tbody>
                  {formList.map((form, i) => (
                    <tr key={form.id} className={cn("hover:bg-[#3f4147]/30 transition-colors", i < formList.length - 1 && "border-b border-[#3f4147]/40")}>
                      <td className="px-4 py-3"><Link prefetch href={`/builder/${form.id}`} className="text-sm font-medium text-[#f2f3f5] hover:text-[#5865f2]">{form.title}</Link></td>
                      <td className="px-4 py-3"><span className={cn("px-2 py-0.5 rounded text-[11px] font-semibold capitalize", form.status === "published" ? "bg-[#3ba55c]/15 text-[#3ba55c]" : "bg-[#3f4147] text-[#949ba4]")}>{form.status}</span></td>
                      <td className="px-4 py-3 text-xs text-[#949ba4] capitalize">{form.visibility}</td>
                      <td className="px-4 py-3 text-right"><Link prefetch href={`/analytics/${form.id}`} className="text-[#949ba4] hover:text-[#f2f3f5]"><BarChart2 size={14} /></Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* Right Panel */}
      <div className="w-px cursor-col-resize bg-[#3f4147]/50 hover:bg-[#5865f2]/50 active:bg-[#5865f2] transition-colors shrink-0"
        onMouseDown={(e) => {
          const startX = e.clientX;
          const aside = e.currentTarget.nextElementSibling as HTMLElement;
          const startW = aside.offsetWidth;
          document.body.style.userSelect = "none";
          const onMove = (ev: MouseEvent) => { aside.style.width = `${Math.min(Math.max(startW + (startX - ev.clientX), 200), 450)}px`; };
          const onUp = () => { document.body.style.userSelect = ""; document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
          document.addEventListener("mousemove", onMove);
          document.addEventListener("mouseup", onUp);
        }}
      />
      <aside className="w-[300px] shrink-0 bg-[#2b2d31] p-6 overflow-y-auto flex flex-col gap-6">
        {/* Quick Actions */}
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#949ba4] mb-3">Quick Actions</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Analytics", href: "/analytics" },
              { label: "Explore", href: "/explore" },
              { label: "API Docs", href: "/docs" },
              { label: "Pricing", href: "/pricing" },
            ].map(a => (
              <Link key={a.label} href={a.href} className="flex flex-col items-center gap-2 py-4 rounded-xl bg-[#313338] hover:bg-[#3f4147] transition-colors group">
                <BarChart2 size={16} className="text-[#5865f2] group-hover:text-[#bec2ff]" />
                <span className="text-[11px] font-mono text-[#949ba4] group-hover:text-[#f2f3f5]">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#949ba4] mb-3">Overview</p>
          <div className="space-y-2">
            <div className="rounded-lg bg-[#313338] p-3">
              <p className="text-[10px] font-mono text-[#949ba4]">Total forms</p>
              <p className="mt-1 text-xl font-bold text-[#f2f3f5]">{formList.length}</p>
            </div>
            <div className="rounded-lg bg-[#5865f2]/10 p-3">
              <p className="text-[10px] font-mono text-[#bec2ff]">Published</p>
              <p className="mt-1 text-xl font-bold text-[#bec2ff]">{published.length}</p>
            </div>
          </div>
        </div>

        {/* Upgrade */}
        <div className="mt-auto p-5 rounded-xl" style={{ background: "linear-gradient(135deg, #5865f2 0%, #28418e 100%)" }}>
          <p className="text-base font-semibold text-white mb-1">Upgrade Nitro</p>
          <p className="text-xs text-white/80 mb-4">Unlock advanced logic and unlimited responses.</p>
          <Link href="/pricing" className="block w-full py-2 text-center rounded-lg text-xs font-semibold text-white bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm">
            Learn More
          </Link>
        </div>
      </aside>
    </>
  );
}
