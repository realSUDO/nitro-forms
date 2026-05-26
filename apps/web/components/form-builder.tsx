"use client";

import { useState } from "react";
import {
  AlignLeft,
  ChevronDown,
  Copy,
  GripVertical,
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

// ─── Types ────────────────────────────────────────────────────────────────────

type FieldType = "text" | "email" | "textarea" | "dropdown" | "checkbox";

interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder: string;
  required: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FIELD_ICONS: Record<FieldType, React.ElementType> = {
  text: Type,
  email: Mail,
  textarea: AlignLeft,
  dropdown: ChevronDown,
  checkbox: ToggleLeft,
};

const FIELD_PALETTE: { type: FieldType; label: string }[] = [
  { type: "text", label: "Short Text" },
  { type: "email", label: "Email" },
  { type: "textarea", label: "Long Text" },
  { type: "dropdown", label: "Dropdown" },
  { type: "checkbox", label: "Checkbox" },
];

const INITIAL_FIELDS: FormField[] = [
  { id: "f1", type: "text", label: "Full Name", placeholder: "Enter your full name", required: true },
  { id: "f2", type: "email", label: "Email Address", placeholder: "you@example.com", required: true },
  { id: "f3", type: "textarea", label: "Message", placeholder: "Write your message here…", required: false },
  { id: "f4", type: "dropdown", label: "How did you hear?", placeholder: "Select an option", required: false },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldPreview({ field }: { field: FormField }) {
  if (field.type === "textarea") {
    return (
      <textarea
        readOnly
        placeholder={field.placeholder}
        rows={3}
        className="w-full resize-none rounded-md bg-[#0d0e11] border border-[#454655] px-3 py-2 text-sm text-[#c6c5d7] placeholder:text-[#454655] focus:outline-none"
      />
    );
  }
  if (field.type === "dropdown") {
    return (
      <div className="flex items-center justify-between w-full rounded-md bg-[#0d0e11] border border-[#454655] px-3 py-2 text-sm text-[#454655]">
        <span>{field.placeholder}</span>
        <ChevronDown size={14} />
      </div>
    );
  }
  if (field.type === "checkbox") {
    return (
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded border border-[#454655] bg-[#0d0e11]" />
        <span className="text-sm text-[#c6c5d7]">{field.placeholder}</span>
      </div>
    );
  }
  return (
    <input
      readOnly
      placeholder={field.placeholder}
      className="w-full rounded-md bg-[#0d0e11] border border-[#454655] px-3 py-2 text-sm text-[#c6c5d7] placeholder:text-[#454655] focus:outline-none"
    />
  );
}

function FieldCard({
  field,
  selected,
  onSelect,
  onDelete,
  onDuplicate,
}: {
  field: FormField;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const Icon = FIELD_ICONS[field.type];
  return (
    <div
      onClick={onSelect}
      className={cn(
        "group relative rounded-xl border bg-[#1f1f23] p-4 cursor-pointer transition-all",
        selected
          ? "border-[#5865f2] shadow-[0_0_0_1px_rgba(88,101,242,0.3)]"
          : "border-[#454655] hover:border-[#5865f2]/50"
      )}
    >
      {/* Drag handle */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[#454655] opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical size={14} />
      </div>

      {/* Hover toolbar */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
          className="p-1 rounded hover:bg-[#292a2d] text-[#8f8fa0] hover:text-[#e3e2e6] transition-colors"
        >
          <Copy size={12} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-1 rounded hover:bg-[#292a2d] text-[#8f8fa0] hover:text-red-400 transition-colors"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Field header */}
      <div className="flex items-center gap-2 mb-3 pl-3">
        <Icon size={13} className="text-[#8f8fa0] shrink-0" />
        <span className="text-xs font-mono uppercase tracking-widest text-[#8f8fa0]">
          {field.type}
        </span>
        {field.required && (
          <span className="ml-auto text-[10px] font-mono text-[#5865f2] bg-[#5865f2]/10 px-1.5 py-0.5 rounded">
            REQUIRED
          </span>
        )}
      </div>

      {/* Label */}
      <p className="text-sm font-medium text-[#e3e2e6] mb-2 pl-3">{field.label}</p>

      {/* Input preview */}
      <div className="pl-3">
        <FieldPreview field={field} />
      </div>
    </div>
  );
}

function InspectorPanel({
  field,
  onChange,
}: {
  field: FormField | null;
  onChange: (updated: FormField) => void;
}) {
  if (!field) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <Settings2 size={28} className="text-[#454655] mb-3" />
        <p className="text-sm text-[#8f8fa0]">Select a field to edit its settings</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-5 overflow-y-auto h-full">
      <p className="text-[10px] font-mono uppercase tracking-widest text-[#8f8fa0]">Field Settings</p>

      {/* Label */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-mono uppercase tracking-widest text-[#8f8fa0]">Label</label>
        <input
          value={field.label}
          onChange={(e) => onChange({ ...field, label: e.target.value })}
          className="w-full rounded-md bg-[#0d0e11] border border-[#454655] px-3 py-2 text-sm text-[#e3e2e6] focus:outline-none focus:border-[#5865f2] focus:shadow-[0_0_0_1px_rgba(88,101,242,0.2)] transition-all"
        />
      </div>

      {/* Placeholder */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-mono uppercase tracking-widest text-[#8f8fa0]">Placeholder</label>
        <input
          value={field.placeholder}
          onChange={(e) => onChange({ ...field, placeholder: e.target.value })}
          className="w-full rounded-md bg-[#0d0e11] border border-[#454655] px-3 py-2 text-sm text-[#e3e2e6] focus:outline-none focus:border-[#5865f2] focus:shadow-[0_0_0_1px_rgba(88,101,242,0.2)] transition-all"
        />
      </div>

      {/* Required toggle */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[#e3e2e6]">Required</p>
          <p className="text-xs text-[#8f8fa0]">Respondents must fill this field</p>
        </div>
        <button
          onClick={() => onChange({ ...field, required: !field.required })}
          className={cn(
            "relative w-10 h-5 rounded-full transition-colors",
            field.required ? "bg-[#5865f2]" : "bg-[#343538]"
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform",
              field.required ? "translate-x-5" : "translate-x-0.5"
            )}
          />
        </button>
      </div>

      <div className="border-t border-[#343538] pt-4 space-y-1.5">
        <p className="text-[10px] font-mono uppercase tracking-widest text-[#8f8fa0]">Appearance</p>
        <div className="flex gap-2 mt-2">
          {(["Full", "Half"] as const).map((w) => (
            <button
              key={w}
              className={cn(
                "flex-1 py-1.5 rounded-md text-xs border transition-colors",
                w === "Full"
                  ? "border-[#5865f2] bg-[#5865f2]/10 text-[#bec2ff]"
                  : "border-[#343538] text-[#8f8fa0] hover:border-[#454655]"
              )}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-[#343538] pt-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-[#8f8fa0] mb-3">Logic</p>
        <button className="w-full py-2 rounded-md border border-dashed border-[#454655] text-xs text-[#8f8fa0] hover:border-[#5865f2] hover:text-[#bec2ff] transition-colors flex items-center justify-center gap-1.5">
          <Zap size={12} />
          Add Condition
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function FormBuilder() {
  const [fields, setFields] = useState<FormField[]>(INITIAL_FIELDS);
  const [selectedId, setSelectedId] = useState<string | null>("f2");
  const [formTitle, setFormTitle] = useState("Contact Us");
  const [activeTab, setActiveTab] = useState<"build" | "preview" | "logic" | "settings">("build");

  const selectedField = fields.find((f) => f.id === selectedId) ?? null;

  function addField(type: FieldType) {
    const newField: FormField = {
      id: `f${Date.now()}`,
      type,
      label: FIELD_PALETTE.find((p) => p.type === type)?.label ?? "New Field",
      placeholder: "Enter value…",
      required: false,
    };
    setFields((prev) => [...prev, newField]);
    setSelectedId(newField.id);
  }

  function updateField(updated: FormField) {
    setFields((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
  }

  function deleteField(id: string) {
    setFields((prev) => prev.filter((f) => f.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function duplicateField(id: string) {
    const field = fields.find((f) => f.id === id);
    if (!field) return;
    const copy = { ...field, id: `f${Date.now()}` };
    setFields((prev) => {
      const idx = prev.findIndex((f) => f.id === id);
      const next = [...prev];
      next.splice(idx + 1, 0, copy);
      return next;
    });
    setSelectedId(copy.id);
  }

  const tabs = ["Build", "Preview", "Logic", "Settings"] as const;

  return (
    <div className="flex h-screen bg-[#121316] text-[#e3e2e6] overflow-hidden">
      {/* ── Left Rail ── */}
      <aside className="w-[72px] shrink-0 bg-[#1a1b1e] border-r border-[#343538] flex flex-col items-center py-4 gap-3">
        {/* Logo */}
        <div className="w-10 h-10 rounded-xl bg-[#5865f2] flex items-center justify-center mb-2">
          <Zap size={18} className="text-white" />
        </div>
        {/* Nav icons */}
        {[
          { icon: Settings2, active: true },
          { icon: BarChart2Icon, active: false },
          { icon: Share2, active: false },
        ].map(({ icon: Icon, active }, i) => (
          <button
            key={i}
            className={cn(
              "relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
              active
                ? "bg-[#5865f2]/20 text-[#bec2ff]"
                : "text-[#8f8fa0] hover:bg-[#292a2d] hover:text-[#e3e2e6]"
            )}
          >
            {active && (
              <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-white" />
            )}
            <Icon size={18} />
          </button>
        ))}
      </aside>

      {/* ── Sidebar: Field Palette ── */}
      <aside className="w-[220px] shrink-0 bg-[#1a1b1e] border-r border-[#343538] flex flex-col">
        <div className="px-4 py-3 border-b border-[#343538]">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#8f8fa0]">Add Fields</p>
        </div>
        <div className="p-3 space-y-1 flex-1 overflow-y-auto">
          {FIELD_PALETTE.map(({ type, label }) => {
            const Icon = FIELD_ICONS[type];
            return (
              <button
                key={type}
                onClick={() => addField(type)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#c6c5d7] hover:bg-[#292a2d] hover:text-[#e3e2e6] transition-colors group"
              >
                <Icon size={14} className="text-[#8f8fa0] group-hover:text-[#bec2ff]" />
                {label}
                <Plus size={12} className="ml-auto text-[#454655] group-hover:text-[#8f8fa0]" />
              </button>
            );
          })}
        </div>
      </aside>

      {/* ── Main Canvas ── */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top toolbar */}
        <header className="h-12 border-b border-[#343538] flex items-center px-4 gap-4 shrink-0">
          {/* Form title */}
          <input
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            className="bg-transparent text-sm font-medium text-[#e3e2e6] focus:outline-none border-b border-transparent focus:border-[#5865f2] transition-colors px-1"
          />

          {/* Tabs */}
          <div className="flex gap-1 ml-4">
            {tabs.map((tab) => {
              const key = tab.toLowerCase() as typeof activeTab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(key)}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs transition-colors",
                    activeTab === key
                      ? "bg-[#5865f2]/15 text-[#bec2ff]"
                      : "text-[#8f8fa0] hover:text-[#e3e2e6]"
                  )}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#343538] text-xs text-[#c6c5d7] hover:border-[#454655] transition-colors">
              <Share2 size={12} />
              Share
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#5865f2] text-xs text-white hover:bg-[#6875f5] transition-colors">
              Publish
            </button>
          </div>
        </header>

        {/* Canvas area */}
        <div
          className="flex-1 overflow-y-auto p-8"
          style={{
            backgroundImage:
              "radial-gradient(circle, #343538 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        >
          <div className="max-w-xl mx-auto space-y-3">
            {fields.map((field) => (
              <FieldCard
                key={field.id}
                field={field}
                selected={selectedId === field.id}
                onSelect={() => setSelectedId(field.id)}
                onDelete={() => deleteField(field.id)}
                onDuplicate={() => duplicateField(field.id)}
              />
            ))}

            {/* Add field button */}
            <button
              onClick={() => addField("text")}
              className="w-full py-3 rounded-xl border border-dashed border-[#454655] text-sm text-[#8f8fa0] hover:border-[#5865f2] hover:text-[#bec2ff] transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={14} />
              Add Field
            </button>
          </div>
        </div>
      </main>

      {/* ── Right Inspector ── */}
      <aside className="w-[260px] shrink-0 bg-[#1a1b1e] border-l border-[#343538] flex flex-col">
        <div className="px-4 py-3 border-b border-[#343538]">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#8f8fa0]">Inspector</p>
        </div>
        <InspectorPanel
          field={selectedField}
          onChange={updateField}
        />
      </aside>
    </div>
  );
}

// Inline icon to avoid extra import
function BarChart2Icon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}
