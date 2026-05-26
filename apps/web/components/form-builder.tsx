"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlignLeft,
  ChevronDown,
  Copy,
  GripVertical,
  Loader2,
  Mail,
  Plus,
  Settings2,
  Share2,
  ToggleLeft,
  Trash2,
  Type,
  Zap,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { trpc } from "~/trpc/client";

type FieldType = "short_text" | "long_text" | "email" | "number" | "single_select" | "multi_select" | "checkbox" | "rating" | "date";

interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  order: number;
  options?: string[];
}

const FIELD_TYPES: { type: FieldType; label: string; Icon: React.ElementType }[] = [
  { type: "short_text", label: "Short Text", Icon: Type },
  { type: "long_text", label: "Long Text", Icon: AlignLeft },
  { type: "email", label: "Email", Icon: Mail },
  { type: "number", label: "Number", Icon: Type },
  { type: "single_select", label: "Single Select", Icon: ChevronDown },
  { type: "multi_select", label: "Multi Select", Icon: ChevronDown },
  { type: "checkbox", label: "Checkbox", Icon: ToggleLeft },
  { type: "rating", label: "Rating", Icon: Type },
  { type: "date", label: "Date", Icon: Type },
];

export function FormBuilder() {
  const params = useParams();
  const router = useRouter();
  const formId = params.id as string;

  const { data: form, isLoading } = trpc.form.getById.useQuery(
    { formId },
    { enabled: !!formId }
  );

  const updateForm = trpc.form.update.useMutation();
  const publishForm = trpc.form.publish.useMutation();
  const unpublishForm = trpc.form.unpublish.useMutation();

  const [title, setTitle] = useState("");
  const [fields, setFields] = useState<FormField[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    if (form) {
      setTitle(form.title);
      setFields((form.fieldsJson as FormField[]) ?? []);
    }
  }, [form]);

  const selectedField = fields.find(f => f.id === selectedId) ?? null;

  function addField(type: FieldType) {
    const newField: FormField = {
      id: `f_${Date.now()}`,
      type,
      label: FIELD_TYPES.find(t => t.type === type)?.label ?? "New Field",
      required: false,
      order: fields.length + 1,
      options: type === "single_select" || type === "multi_select" ? ["Option 1", "Option 2"] : undefined,
    };
    setFields(prev => [...prev, newField]);
    setSelectedId(newField.id);
    setSaved(false);
  }

  function deleteField(id: string) {
    setFields(prev => prev.filter(f => f.id !== id));
    if (selectedId === id) setSelectedId(null);
    setSaved(false);
  }

  function updateField(updated: FormField) {
    setFields(prev => prev.map(f => f.id === updated.id ? updated : f));
    setSaved(false);
  }

  async function handleSave() {
    await updateForm.mutateAsync({ formId, title, fields });
    setSaved(true);
  }

  async function handlePublish() {
    if (!saved) await handleSave();
    if (form?.status === "published") {
      await unpublishForm.mutateAsync({ formId });
    } else {
      await publishForm.mutateAsync({ formId });
    }
  }

  function handleShare() {
    const url = `${window.location.origin}/f/${form?.slug}`;
    navigator.clipboard.writeText(url);
    alert(`Link copied: ${url}`);
  }

  if (isLoading) {
    return (
      <div className="h-screen bg-[#313338] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#5865f2]" size={32} />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="h-screen bg-[#313338] flex items-center justify-center text-[#949ba4]">
        Form not found. <Link href="/dashboard" className="ml-2 text-[#5865f2] hover:underline">Go back</Link>
      </div>
    );
  }

  return (
    <>
      {/* Field palette sidebar */}
      <aside className="w-[220px] shrink-0 bg-[#2b2d31] flex flex-col">
        <div className="px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#949ba4]">Add Fields</p>
        </div>
        <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
          {FIELD_TYPES.map(({ type, label, Icon }) => (
            <button
              key={type}
              onClick={() => addField(type)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm text-[#949ba4] hover:bg-[#3f4147] hover:text-[#f2f3f5] transition-colors"
            >
              <Icon size={14} />
              {label}
              <Plus size={12} className="ml-auto text-[#4e5058]" />
            </button>
          ))}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <header className="h-12 flex items-center px-4 gap-4 shrink-0 bg-[#2b2d31]">
          <input
            value={title}
            onChange={(e) => { setTitle(e.target.value); setSaved(false); }}
            className="bg-transparent text-sm font-semibold text-[#f2f3f5] focus:outline-none border-b border-transparent focus:border-[#5865f2] px-1"
          />
          <span className={cn("text-[10px] font-mono px-2 py-0.5 rounded capitalize", form.status === "published" ? "bg-[#5865f2]/15 text-[#5865f2]" : "bg-[#3f4147] text-[#949ba4]")}>
            {form.status}
          </span>
          {!saved && <span className="text-[10px] text-[#949ba4]">unsaved</span>}

          <div className="ml-auto flex items-center gap-2">
            <button onClick={handleSave} disabled={saved || updateForm.isPending} className="px-3 py-1.5 rounded text-xs border border-[#3f4147] text-[#b5bac1] hover:bg-[#3f4147] transition-colors disabled:opacity-40">
              {updateForm.isPending ? "Saving..." : "Save"}
            </button>
            <button onClick={handleShare} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs border border-[#3f4147] text-[#b5bac1] hover:bg-[#3f4147] transition-colors">
              <Share2 size={12} /> Share
            </button>
            <button onClick={handlePublish} disabled={publishForm.isPending || unpublishForm.isPending} className="px-3 py-1.5 rounded text-xs bg-[#5865f2] text-white hover:bg-[#4752c4] transition-colors disabled:opacity-50">
              {form.status === "published" ? "Unpublish" : "Publish"}
            </button>
          </div>
        </header>

        {/* Canvas */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#292b2f]" style={{ backgroundImage: "radial-gradient(circle, #3f4147 1px, transparent 1px)", backgroundSize: "20px 20px" }}>
          <div className="max-w-xl mx-auto space-y-3">
            {fields.length === 0 && (
              <div className="text-center py-16 text-[#949ba4]">
                <p className="text-sm">No fields yet. Add fields from the sidebar.</p>
              </div>
            )}
            {fields.map(field => (
              <div
                key={field.id}
                onClick={() => setSelectedId(field.id)}
                className={cn(
                  "group relative rounded-lg border p-4 cursor-pointer transition-all bg-[#2b2d31]",
                  selectedId === field.id ? "border-[#5865f2]" : "border-[#3f4147] hover:border-[#4e5058]"
                )}
              >
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); deleteField(field.id); }} className="p-1 rounded text-[#949ba4] hover:text-red-400 hover:bg-[#3f4147]">
                    <Trash2 size={12} />
                  </button>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <GripVertical size={12} className="text-[#4e5058]" />
                  <span className="text-[10px] font-mono uppercase text-[#949ba4]">{field.type.replace("_", " ")}</span>
                  {field.required && <span className="text-[10px] font-mono text-[#5865f2]">REQUIRED</span>}
                </div>
                <p className="text-sm font-medium text-[#f2f3f5]">{field.label}</p>
              </div>
            ))}
            <button onClick={() => addField("short_text")} className="w-full py-3 rounded-lg border border-dashed border-[#4e5058] text-sm text-[#949ba4] hover:border-[#5865f2] hover:text-[#5865f2] transition-colors flex items-center justify-center gap-2">
              <Plus size={14} /> Add Field
            </button>
          </div>
        </div>
      </main>

      {/* Inspector */}
      <aside className="w-[260px] shrink-0 bg-[#2b2d31] flex flex-col overflow-y-auto">
        <div className="px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#949ba4]">Field Settings</p>
        </div>
        {selectedField ? (
          <div className="px-4 space-y-4">
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#949ba4] mb-1">Label</label>
              <input value={selectedField.label} onChange={(e) => updateField({ ...selectedField, label: e.target.value })} className="w-full bg-[#1e1f22] rounded px-3 py-2 text-sm text-[#f2f3f5] focus:outline-none focus:ring-1 focus:ring-[#5865f2]" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#b5bac1]">Required</span>
              <button onClick={() => updateField({ ...selectedField, required: !selectedField.required })} className={cn("w-9 h-5 rounded-full transition-colors relative", selectedField.required ? "bg-[#5865f2]" : "bg-[#3f4147]")}>
                <span className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform", selectedField.required ? "translate-x-4" : "translate-x-0.5")} />
              </button>
            </div>
            {(selectedField.type === "single_select" || selectedField.type === "multi_select") && (
              <div>
                <label className="block text-[10px] font-mono uppercase text-[#949ba4] mb-1">Options (one per line)</label>
                <textarea
                  value={(selectedField.options ?? []).join("\n")}
                  onChange={(e) => updateField({ ...selectedField, options: e.target.value.split("\n").filter(Boolean) })}
                  rows={4}
                  className="w-full bg-[#1e1f22] rounded px-3 py-2 text-sm text-[#f2f3f5] focus:outline-none focus:ring-1 focus:ring-[#5865f2] resize-none"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center px-6">
            <p className="text-sm text-[#949ba4]">Select a field to edit</p>
          </div>
        )}
      </aside>
    </>
  );
}
