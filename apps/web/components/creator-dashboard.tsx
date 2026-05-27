"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  BarChart2,
  ChevronDown,
  Copy,
  FileText,
  Gamepad2,
  Globe,
  Hash,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { trpc } from "~/trpc/client";
import { ContextMenu, type MenuItem } from "~/components/context-menu";

export function CreatorDashboard() {
  const router = useRouter();
  const utils = trpc.useUtils();
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const { data: forms, isLoading } = trpc.form.listMine.useQuery();
  const createForm = trpc.form.create.useMutation({
    onSuccess: (form) => router.push(`/builder/${form!.id}`),
  });
  const publishForm = trpc.form.publish.useMutation({ onSuccess: () => utils.form.listMine.invalidate() });
  const unpublishForm = trpc.form.unpublish.useMutation({ onSuccess: () => utils.form.listMine.invalidate() });
  const deleteForm = trpc.form.delete.useMutation({ onSuccess: () => utils.form.listMine.invalidate() });
  const renameForm = trpc.form.rename.useMutation({ onSuccess: () => { utils.form.listMine.invalidate(); setRenaming(null); } });
  const duplicateForm = trpc.form.duplicate.useMutation({ onSuccess: () => utils.form.listMine.invalidate() });

  function getMenuItems(form: { id: string; title: string; status: string; slug: string }): MenuItem[] {
    return [
      { label: "Rename", icon: <Pencil size={14} />, onClick: () => { setRenaming(form.id); setRenameValue(form.title); } },
      { label: "Duplicate", icon: <Copy size={14} />, onClick: () => duplicateForm.mutate({ formId: form.id }) },
      { label: "Open Builder", icon: <FileText size={14} />, onClick: () => router.push(`/builder/${form.id}`) },
      { label: "View Analytics", icon: <BarChart2 size={14} />, onClick: () => router.push(`/analytics/${form.id}`) },
      ...(form.status === "published"
        ? [{ label: "Unpublish", icon: <Globe size={14} />, onClick: () => unpublishForm.mutate({ formId: form.id }) }]
        : [{ label: "Publish", icon: <Upload size={14} />, onClick: () => publishForm.mutate({ formId: form.id }) }]
      ),
      { label: "", onClick: () => {}, separator: true },
      { label: "Delete", icon: <Trash2 size={14} />, onClick: () => deleteForm.mutate({ formId: form.id }), danger: true },
    ];
  }

  const formList = forms ?? [];
  const published = formList.filter(f => f.status === "published");
  const drafts = formList.filter(f => f.status === "draft");

  const [activeChannel, setActiveChannel] = useState<string>("welcome");
  const [draftsOpen, setDraftsOpen] = useState(true);
  const [publishedOpen, setPublishedOpen] = useState(true);
  const [previewSlug, setPreviewSlug] = useState<string | null>(null);

  return (
    <>
      {/* Sidebar */}
      <aside className="w-[240px] shrink-0 flex flex-col bg-[#2b2d31]">
        <div className="flex items-center justify-between px-4 h-12 font-semibold text-sm text-[#f2f3f5] shrink-0">
          NitroForms
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          {/* Welcome channel */}
          <button onClick={() => setActiveChannel("welcome")} className={cn(
            "flex items-center gap-2 w-full px-2 py-1.5 rounded text-sm transition-colors",
            activeChannel === "welcome" ? "bg-[#3f4147] text-[#f2f3f5]" : "text-[#949ba4] hover:bg-[#3f4147]/50 hover:text-[#b5bac1]"
          )}>
            <Hash size={14} className={activeChannel === "welcome" ? "text-[#f2f3f5]" : "text-[#4e5058]"} />
            welcome
          </button>

          <button onClick={() => { setActiveChannel("forms"); setPreviewSlug(null); }} className={cn(
            "flex items-center gap-2 w-full px-2 py-1.5 rounded text-sm transition-colors",
            activeChannel === "forms" && !previewSlug ? "bg-[#3f4147] text-[#f2f3f5]" : "text-[#949ba4] hover:bg-[#3f4147]/50 hover:text-[#b5bac1]"
          )}>
            <Hash size={14} className={activeChannel === "forms" ? "text-[#f2f3f5]" : "text-[#4e5058]"} />
            dashboard
          </button>

          <div className="px-1 py-2">
            <button onClick={() => { setActiveChannel("forms"); createForm.mutate({ title: "Untitled Form" }); }} disabled={createForm.isPending} className="flex items-center gap-2 w-full px-3 py-2 rounded bg-[#5865f2] text-white text-sm font-medium hover:bg-[#4752c4] transition-colors disabled:opacity-50">
              {createForm.isPending ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />} Create Form
            </button>
          </div>
          {drafts.length > 0 && (
            <div className="pt-2">
              <button onClick={() => setDraftsOpen(o => !o)} className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#949ba4] w-full hover:text-[#f2f3f5] transition-colors">
                <ChevronDown size={11} className={cn("transition-transform", !draftsOpen && "-rotate-90")} /> Drafts
              </button>
              {draftsOpen && drafts.map(f => (
                <ContextMenu key={f.id} items={getMenuItems(f)}>
                <button onClick={() => { setPreviewSlug(f.slug); setActiveChannel("forms"); }} className={cn("flex items-center gap-2 w-full px-2 py-1.5 rounded text-sm text-left transition-colors", previewSlug === f.slug ? "bg-[#3f4147] text-[#f2f3f5]" : "text-[#949ba4] hover:bg-[#3f4147] hover:text-[#f2f3f5]")}>
                  <Hash size={14} className={previewSlug === f.slug ? "text-[#f2f3f5]" : "text-[#4e5058]"} /><span className="truncate">{f.title}</span>
                </button>
                </ContextMenu>
              ))}
            </div>
          )}
          {published.length > 0 && (
            <div className="pt-2">
              <button onClick={() => setPublishedOpen(o => !o)} className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#949ba4] w-full hover:text-[#f2f3f5] transition-colors">
                <ChevronDown size={11} className={cn("transition-transform", !publishedOpen && "-rotate-90")} /> Published
              </button>
              {publishedOpen && published.map(f => (
                <ContextMenu key={f.id} items={getMenuItems(f)}>
                <button onClick={() => { setPreviewSlug(f.slug); setActiveChannel("forms"); }} className={cn("flex items-center gap-2 w-full px-2 py-1.5 rounded text-sm text-left transition-colors", previewSlug === f.slug ? "bg-[#3f4147] text-[#f2f3f5]" : "text-[#949ba4] hover:bg-[#3f4147] hover:text-[#f2f3f5]")}>
                  <Hash size={14} className={previewSlug === f.slug ? "text-[#f2f3f5]" : "text-[#4e5058]"} /><span className="truncate">{f.title}</span>
                </button>
                </ContextMenu>
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
      <div className="w-1 px-1 -mx-1 cursor-col-resize shrink-0 bg-clip-content bg-transparent hover:bg-[#5865f2]/50 active:bg-[#5865f2] transition-colors"
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
      <main className={cn("flex-1 bg-[#313338] relative", previewSlug ? "overflow-hidden" : "overflow-y-auto")}>
        {activeChannel === "welcome" ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/discord-wumpus.gif" alt="Wumpus waving" className="w-48 h-48 mb-6" />
            <h1 className="text-2xl font-bold text-[#f2f3f5] mb-2">Welcome to NitroForms!</h1>
            <p className="text-sm text-[#949ba4] mb-6 max-w-md">This is the beginning of your workspace. Create forms, collect responses, and analyze data — all from one place.</p>
            <div className="flex gap-3">
              <button onClick={() => { setActiveChannel("forms"); createForm.mutate({ title: "Untitled Form" }); }} className="px-4 py-2 rounded-lg bg-[#5865f2] text-white text-sm font-medium hover:bg-[#4752c4] transition-colors">
                Create your first form
              </button>
              <button onClick={() => setActiveChannel("forms")} className="px-4 py-2 rounded-lg border border-[#4e5058] text-sm text-[#b5bac1] hover:bg-[#3f4147] transition-colors">
                View Dashboard
              </button>
            </div>
          </div>
        ) : previewSlug ? (
          <div className="absolute inset-0 flex flex-col bg-[#313338] z-10">
            <div className="h-12 shrink-0 flex items-center justify-between px-4 border-b border-[#1e1f22]">
              <span className="text-sm font-semibold text-[#f2f3f5]"><Hash size={14} className="inline text-[#949ba4]" /> {formList.find(f => f.slug === previewSlug)?.title ?? previewSlug}</span>
              <div className="flex items-center gap-2">
                <Link href={`/builder/${formList.find(f => f.slug === previewSlug)?.id ?? ""}`} className="px-3 py-1 rounded text-xs bg-[#5865f2] text-white hover:bg-[#4752c4] transition-colors">
                  Edit
                </Link>
                <button onClick={() => setPreviewSlug(null)} className="px-3 py-1 rounded text-xs text-[#949ba4] hover:text-[#f2f3f5] transition-colors">
                  Close
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
              <FormPreview form={formList.find(f => f.slug === previewSlug)!} />
            </div>
          </div>
        ) : (
        <div className="max-w-4xl p-6">
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
                    <ContextMenu key={form.id} items={getMenuItems(form)}>
                    <tr className={cn("hover:bg-[#3f4147]/30 transition-colors", i < formList.length - 1 && "border-b border-[#3f4147]/40")}>
                      <td className="px-4 py-3">
                        {renaming === form.id ? (
                          <input autoFocus value={renameValue} onChange={e => setRenameValue(e.target.value)}
                            onBlur={() => { if (renameValue.trim()) renameForm.mutate({ formId: form.id, title: renameValue.trim() }); else setRenaming(null); }}
                            onKeyDown={e => { if (e.key === "Enter") { e.currentTarget.blur(); } if (e.key === "Escape") setRenaming(null); }}
                            className="bg-[#1e1f22] rounded px-2 py-0.5 text-sm text-[#f2f3f5] outline-none ring-1 ring-[#5865f2] w-full" />
                        ) : (
                          <Link prefetch href={`/f/${form.slug}`} className="text-sm font-medium text-[#f2f3f5] hover:text-[#5865f2]">{form.title}</Link>
                        )}
                      </td>
                      <td className="px-4 py-3"><span className={cn("px-2 py-0.5 rounded text-[11px] font-semibold capitalize", form.status === "published" ? "bg-[#3ba55c]/15 text-[#3ba55c]" : "bg-[#3f4147] text-[#949ba4]")}>{form.status}</span></td>
                      <td className="px-4 py-3 text-xs text-[#949ba4] capitalize">{form.visibility}</td>
                      <td className="px-4 py-3 text-right"><Link prefetch href={`/analytics/${form.id}`} className="text-[#949ba4] hover:text-[#f2f3f5]"><BarChart2 size={14} /></Link></td>
                    </tr>
                    </ContextMenu>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        )}
      </main>

      {/* Right Panel */}
      <div className="w-1 px-1 -mx-1 cursor-col-resize shrink-0 bg-clip-content bg-transparent hover:bg-[#5865f2]/50 active:bg-[#5865f2] transition-colors"
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

function FormPreview({ form }: { form: { id: string; title: string; slug: string; status: string; fieldsJson?: unknown; settingsJson?: unknown } }) {
  const fields = (form.fieldsJson ?? []) as Array<{ id: string; type: string; label: string; required?: boolean; options?: string[]; conditionConfig?: { sourceFieldId: string; operator: string; value: string } }>;
  const settings = form.settingsJson as { edges?: Array<{ source: string; target: string; sourceHandle: string | null }> } | null;
  const edges = settings?.edges ?? [];

  if (!fields.length) {
    return <p className="text-sm text-[#949ba4] text-center py-12">No fields yet. Click Edit to add fields.</p>;
  }

  return (
    <div className="max-w-2xl">
      {/* Bot intro */}
      <div className="flex gap-3 mb-5">
        <div className="w-9 h-9 rounded-full bg-[#2b2d31] flex items-center justify-center shrink-0">
          <img src="/nitro.svg" alt="" className="w-5 h-5" />
        </div>
        <div>
          <span className="text-sm font-semibold text-[#f2f3f5]">{form.title}</span>
          <p className="text-xs text-[#949ba4]">{fields.filter(f => f.type !== "condition").length} questions · {form.status}</p>
        </div>
      </div>

      {/* Fields as form questions */}
      <div className="space-y-5 pl-12">
        {fields.map(f => (
          <div key={f.id}>
            {f.type === "condition" ? (
              <div className="flex items-center gap-2 py-1">
                <div className="h-px flex-1 bg-[#faa61a]/30" />
                <span className="text-[11px] text-[#faa61a] font-mono">IF {fields.find(x => x.id === f.conditionConfig?.sourceFieldId)?.label} {f.conditionConfig?.operator} &quot;{f.conditionConfig?.value}&quot;</span>
                <div className="h-px flex-1 bg-[#faa61a]/30" />
              </div>
            ) : (
              <div>
                <p className="text-base text-[#f2f3f5] mb-2">{f.label}{f.required && <span className="text-[#ed4245] ml-0.5">*</span>}</p>
                {(f.type === "short_text" || f.type === "email" || f.type === "number" || f.type === "date") && (
                  <div className="h-10 rounded-lg bg-[#383a40] px-3 flex items-center">
                    <span className="text-xs text-[#4e5058]">{f.type === "email" ? "name@example.com" : f.type === "number" ? "0" : "Type here..."}</span>
                  </div>
                )}
                {f.type === "long_text" && (
                  <div className="h-20 rounded-lg bg-[#383a40] px-3 pt-2">
                    <span className="text-xs text-[#4e5058]">Type here...</span>
                  </div>
                )}
                {(f.type === "single_select" || f.type === "multi_select") && f.options && (
                  <div className="flex flex-wrap gap-1.5">
                    {f.options.map(o => <span key={o} className="text-xs px-2.5 py-1 rounded-full bg-[#383a40] text-[#b5bac1]">{o}</span>)}
                  </div>
                )}
                {f.type === "rating" && (
                  <div className="flex gap-1">{[1,2,3,4,5].map(n => <span key={n} className="text-lg text-[#3f4147]">★</span>)}</div>
                )}
                {f.type === "checkbox" && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border border-[#4e5058]" />
                    <span className="text-xs text-[#949ba4]">Yes / No</span>
                  </div>
                )}
              </div>
            )}
            {edges.filter(e => e.source === f.id && e.sourceHandle).map(e => (
              <p key={e.target} className="text-[11px] text-[#4e5058] mt-1 pl-2">
                <span className={e.sourceHandle === "yes" ? "text-[#3ba55c]" : "text-[#ed4245]"}>{e.sourceHandle}</span> → {fields.find(x => x.id === e.target)?.label}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
