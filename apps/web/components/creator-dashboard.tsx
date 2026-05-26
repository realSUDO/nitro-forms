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
  HelpCircle,
  LayoutGrid,
  Loader2,
  LogOut,
  MessageSquare,
  MoreVertical,
  Plus,
  Settings,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { cn } from "~/lib/utils";
import { trpc } from "~/trpc/client";

export function CreatorDashboard() {
  const router = useRouter();
  const { signOut } = useClerk();
  const { data: forms, isLoading } = trpc.form.listMine.useQuery();
  const createForm = trpc.form.create.useMutation({
    onSuccess: (form) => {
      router.push(`/builder/${form!.id}`);
    },
  });

  const formList = forms ?? [];
  const published = formList.filter(f => f.status === "published");
  const drafts = formList.filter(f => f.status === "draft");

  function handleCreateForm() {
    createForm.mutate({ title: "Untitled Form" });
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#313338] text-[#f2f3f5]">

      {/* Rail */}
      <aside className="w-[72px] shrink-0 bg-[#1e1f22] flex flex-col items-center py-4 gap-3">
        <div className="w-12 h-12 rounded-full bg-[#5865f2] flex items-center justify-center mb-2">
          <Zap size={18} className="text-white" />
        </div>
        {[
          { Icon: LayoutGrid, active: true, href: "/dashboard" },
          { Icon: BarChart2, active: false, href: "/explore" },
          { Icon: Settings, active: false, href: "/pricing" },
        ].map(({ Icon, active, href }, i) => (
          <Link key={i} href={href} className={cn(
            "relative w-10 h-10 rounded-full flex items-center justify-center transition-colors",
            active ? "bg-[#3f4147] text-[#f2f3f5]" : "text-[#949ba4] hover:bg-[#3f4147] hover:text-[#f2f3f5]"
          )}>
            {active && <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-white" />}
            <Icon size={18} />
          </Link>
        ))}
        <div className="flex-1" />
        <button onClick={() => signOut({ redirectUrl: "/" })} className="w-10 h-10 rounded-full flex items-center justify-center text-[#949ba4] hover:bg-[#3f4147] hover:text-[#f2f3f5] transition-colors" title="Sign Out">
          <LogOut size={16} />
        </button>
      </aside>

      {/* Sidebar */}
      <aside className="w-[240px] shrink-0 flex flex-col bg-[#2b2d31]">
        <button className="flex items-center justify-between px-4 h-12 font-semibold text-sm text-[#f2f3f5] hover:bg-[#3f4147] transition-colors shrink-0">
          NitroForms <ChevronDown size={14} className="text-[#949ba4]" />
        </button>

        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          <div className="px-1 py-2">
            <button
              onClick={handleCreateForm}
              disabled={createForm.isPending}
              className="flex items-center gap-2 w-full px-3 py-2 rounded bg-[#5865f2] text-white text-sm font-medium hover:bg-[#4752c4] transition-colors disabled:opacity-50"
            >
              {createForm.isPending ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
              Create Form
            </button>
          </div>

          {/* Drafts */}
          {drafts.length > 0 && (
            <div className="pt-2">
              <p className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#949ba4]">
                <ChevronDown size={11} /> Drafts
              </p>
              {drafts.map(f => (
                <Link key={f.id} href={`/builder/${f.id}`} className="flex items-center gap-2 px-2 py-1.5 rounded text-sm text-[#949ba4] hover:bg-[#3f4147] hover:text-[#f2f3f5] transition-colors">
                  <Hash size={14} className="text-[#4e5058]" />
                  <span className="truncate">{f.slug}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Published */}
          {published.length > 0 && (
            <div className="pt-2">
              <p className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#949ba4]">
                <ChevronDown size={11} /> Published
              </p>
              {published.map(f => (
                <Link key={f.id} href={`/builder/${f.id}`} className="flex items-center gap-2 px-2 py-1.5 rounded text-sm text-[#949ba4] hover:bg-[#3f4147] hover:text-[#f2f3f5] transition-colors">
                  <Hash size={14} className="text-[#5865f2]" />
                  <span className="truncate">{f.slug}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Templates link */}
          <div className="pt-2">
            <p className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#949ba4]">
              <ChevronDown size={11} /> Templates
            </p>
            <Link href="/explore" className="flex items-center gap-2 px-2 py-1.5 rounded text-sm text-[#949ba4] hover:bg-[#3f4147] hover:text-[#f2f3f5] transition-colors">
              <Gamepad2 size={14} className="text-[#4e5058]" />
              <span>Browse All</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-12 shrink-0 flex items-center justify-between px-4 bg-[#313338]">
          <div className="flex items-center gap-2">
            <LayoutGrid size={18} className="text-[#949ba4]" />
            <span className="font-semibold text-sm text-[#f2f3f5]">creator-dashboard</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#313338] p-6">
          <div className="max-w-4xl">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#f2f3f5]">Creator Dashboard</h1>
              <p className="text-sm text-[#949ba4] mt-1">Manage your forms and track responses.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: "Total Forms", value: formList.length.toString(), Icon: FileText },
                { label: "Published", value: published.length.toString(), Icon: Users },
                { label: "Drafts", value: drafts.length.toString(), Icon: BarChart2 },
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

            {/* Table */}
            <div className="rounded-lg overflow-hidden bg-[#2b2d31]">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm font-semibold text-[#f2f3f5]">All Forms</span>
                <button
                  onClick={handleCreateForm}
                  disabled={createForm.isPending}
                  className="text-xs text-[#5865f2] hover:underline"
                >
                  + New Form
                </button>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="animate-spin text-[#5865f2]" size={24} />
                </div>
              ) : formList.length === 0 ? (
                <div className="text-center py-12 text-[#949ba4]">
                  <FileText size={32} className="mx-auto mb-3 text-[#4e5058]" />
                  <p className="text-sm">No forms yet. Create your first one!</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-t border-[#3f4147]">
                      {["Form", "Status", "Visibility", "Created", ""].map(h => (
                        <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#949ba4]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {formList.map((form, i) => (
                      <tr key={form.id} className={cn("hover:bg-[#3f4147]/30 transition-colors", i < formList.length - 1 && "border-b border-[#3f4147]/40")}>
                        <td className="px-4 py-3">
                          <Link href={`/builder/${form.id}`} className="flex items-center gap-3 hover:text-[#5865f2] transition-colors">
                            <FileText size={14} className="text-[#949ba4]" />
                            <span className="text-sm font-medium text-[#f2f3f5]">{form.title}</span>
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[11px] font-semibold capitalize",
                            form.status === "published" ? "bg-[#5865f2]/15 text-[#5865f2]" : "bg-[#3f4147] text-[#949ba4]"
                          )}>
                            {form.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-[#949ba4] capitalize">{form.visibility}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-[#949ba4]">
                            {form.createdAt ? new Date(form.createdAt).toLocaleDateString() : "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link href={`/analytics/${form.id}`} className="p-1 rounded text-[#949ba4] hover:text-[#f2f3f5] transition-colors">
                            <BarChart2 size={14} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
