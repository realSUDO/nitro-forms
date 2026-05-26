"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BarChart2,
  ChevronDown,
  Clock,
  FileText,
  Gamepad2,
  Hash,
  Loader2,
  Plus,
  Users,
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
                <Link key={f.id} href={`/builder/${f.id}`} className="flex items-center gap-2 px-2 py-1.5 rounded text-sm text-[#949ba4] hover:bg-[#3f4147] hover:text-[#f2f3f5] transition-colors">
                  <Hash size={14} className="text-[#4e5058]" /><span className="truncate">{f.title}</span>
                </Link>
              ))}
            </div>
          )}
          {published.length > 0 && (
            <div className="pt-2">
              <p className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#949ba4]"><ChevronDown size={11} /> Published</p>
              {published.map(f => (
                <Link key={f.id} href={`/builder/${f.id}`} className="flex items-center gap-2 px-2 py-1.5 rounded text-sm text-[#949ba4] hover:bg-[#3f4147] hover:text-[#f2f3f5] transition-colors">
                  <Hash size={14} className="text-[#5865f2]" /><span className="truncate">{f.title}</span>
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

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-[#313338] p-6">
        <div className="max-w-4xl">
          <h1 className="text-2xl font-bold text-[#f2f3f5] mb-1">Creator Dashboard</h1>
          <p className="text-sm text-[#949ba4] mb-6">Manage your forms and track responses.</p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: "Total Forms", value: formList.length, Icon: FileText },
              { label: "Published", value: published.length, Icon: Users },
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
                      <td className="px-4 py-3"><Link href={`/builder/${form.id}`} className="text-sm font-medium text-[#f2f3f5] hover:text-[#5865f2]">{form.title}</Link></td>
                      <td className="px-4 py-3"><span className={cn("px-2 py-0.5 rounded text-[11px] font-semibold capitalize", form.status === "published" ? "bg-[#5865f2]/15 text-[#5865f2]" : "bg-[#3f4147] text-[#949ba4]")}>{form.status}</span></td>
                      <td className="px-4 py-3 text-xs text-[#949ba4] capitalize">{form.visibility}</td>
                      <td className="px-4 py-3 text-right"><Link href={`/analytics/${form.id}`} className="text-[#949ba4] hover:text-[#f2f3f5]"><BarChart2 size={14} /></Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
