"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
  type Node,
  type Edge,
  type Connection,
  Panel,
  ConnectionLineType,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  AlignLeft,
  ChevronDown,
  GripVertical,
  Loader2,
  Mail,
  Plus,
  Save,
  Share2,
  ToggleLeft,
  Trash2,
  Type,
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
  position?: { x: number; y: number };
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

// Custom node component for form fields
function FieldNode({ data }: { data: { field: FormField; selected: boolean; onDelete: () => void } }) {
  const { field, onDelete } = data;
  return (
    <div className={cn(
      "w-[280px] rounded-lg border bg-[#2b2d31] p-4 shadow-lg transition-all relative",
      data.selected ? "border-[#5865f2] shadow-[0_0_15px_rgba(88,101,242,0.3)]" : "border-[#3f4147] hover:border-[#4e5058]"
    )}>
      <Handle type="target" position={Position.Top} className="!w-1.5 !h-1.5 !rounded-full !bg-[#4e5058] !border-0 hover:!bg-[#5865f2] !transition-colors" />
      <Handle type="source" position={Position.Bottom} className="!w-1.5 !h-1.5 !rounded-full !bg-[#4e5058] !border-0 hover:!bg-[#5865f2] !transition-colors" />
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <GripVertical size={12} className="text-[#4e5058] cursor-grab" />
          <span className="text-[10px] font-mono uppercase text-[#949ba4]">{field.type.replace("_", " ")}</span>
        </div>
        <div className="flex items-center gap-1">
          {field.required && <span className="text-[9px] font-mono text-[#5865f2] bg-[#5865f2]/10 px-1.5 py-0.5 rounded">REQ</span>}
          <button onClick={onDelete} className="p-1 rounded text-[#949ba4] hover:text-red-400 hover:bg-[#3f4147] transition-colors">
            <Trash2 size={11} />
          </button>
        </div>
      </div>
      <p className="text-sm font-medium text-[#f2f3f5] mb-1">{field.label}</p>
      {field.placeholder && <p className="text-xs text-[#4e5058]">{field.placeholder}</p>}
      {field.options && (
        <div className="mt-2 flex flex-wrap gap-1">
          {field.options.slice(0, 3).map(o => (
            <span key={o} className="text-[10px] px-1.5 py-0.5 rounded bg-[#3f4147] text-[#949ba4]">{o}</span>
          ))}
          {field.options.length > 3 && <span className="text-[10px] text-[#949ba4]">+{field.options.length - 3}</span>}
        </div>
      )}
    </div>
  );
}

const nodeTypes = { fieldNode: FieldNode };

export function FormBuilder() {
  const params = useParams();
  const router = useRouter();
  const formId = params.id as string;
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  function onDragStart(event: React.DragEvent, type: FieldType) {
    event.dataTransfer.setData("fieldType", type);
    event.dataTransfer.effectAllowed = "move";
  }

  function onDragOver(event: React.DragEvent) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }

  function onDrop(event: React.DragEvent) {
    event.preventDefault();
    const type = event.dataTransfer.getData("fieldType") as FieldType;
    if (!type || !reactFlowInstance) return;

    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    addFieldAtPosition(type, position);
  }

  const { data: form, isLoading } = trpc.form.getById.useQuery({ formId }, { enabled: !!formId });
  const updateForm = trpc.form.update.useMutation();
  const publishForm = trpc.form.publish.useMutation();
  const unpublishForm = trpc.form.unpublish.useMutation();

  const [title, setTitle] = useState("");
  const [fields, setFields] = useState<FormField[]>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(true);

  // Load form data
  useEffect(() => {
    if (form) {
      setTitle(form.title);
      const loadedFields = (form.fieldsJson as FormField[]) ?? [];
      setFields(loadedFields);
      // Convert fields to nodes
      const newNodes: Node[] = loadedFields.map((field, i) => ({
        id: field.id,
        type: "fieldNode",
        position: field.position ?? { x: 100, y: i * 140 },
        data: { field, selected: false, onDelete: () => deleteField(field.id) },
      }));
      setNodes(newNodes);
      // Auto-connect sequential nodes
      const newEdges: Edge[] = loadedFields.slice(1).map((field, i) => ({
        id: `e-${loadedFields[i]!.id}-${field.id}`,
        source: loadedFields[i]!.id,
        target: field.id,
        animated: true,
        style: { stroke: "#5865f2", strokeWidth: 2 },
      }));
      setEdges(newEdges);
    }
  }, [form]);

  const onConnect = useCallback((connection: Connection) => {
    setEdges(eds => addEdge(connection, eds));
    setSaved(false);
  }, [setEdges]);

  function addFieldAtPosition(type: FieldType, position?: { x: number; y: number }) {
    const pos = position ?? { x: 100 + Math.random() * 200, y: fields.length * 140 + Math.random() * 50 };
    const newField: FormField = {
      id: `f_${Date.now()}`,
      type,
      label: FIELD_TYPES.find(t => t.type === type)?.label ?? "New Field",
      required: false,
      order: fields.length + 1,
      options: type === "single_select" || type === "multi_select" ? ["Option 1", "Option 2"] : undefined,
      position: pos,
    };
    setFields(prev => [...prev, newField]);
    const newNode: Node = {
      id: newField.id,
      type: "fieldNode",
      position: newField.position!,
      data: { field: newField, selected: false, onDelete: () => deleteField(newField.id) },
    };
    setNodes(nds => [...nds, newNode]);
    // Connect to last node
    if (fields.length > 0) {
      const lastField = fields[fields.length - 1]!;
      setEdges(eds => [...eds, {
        id: `e-${lastField.id}-${newField.id}`,
        source: lastField.id,
        target: newField.id,
        animated: true,
        style: { stroke: "#5865f2", strokeWidth: 2 },
      }]);
    }
    setSelectedId(newField.id);
    setSaved(false);
  }

  function addField(type: FieldType) {
    addFieldAtPosition(type);
  }

  function deleteField(id: string) {
    setFields(prev => prev.filter(f => f.id !== id));
    setNodes(nds => nds.filter(n => n.id !== id));
    setEdges(eds => eds.filter(e => e.source !== id && e.target !== id));
    if (selectedId === id) setSelectedId(null);
    setSaved(false);
  }

  function updateFieldData(updated: FormField) {
    setFields(prev => prev.map(f => f.id === updated.id ? updated : f));
    setNodes(nds => nds.map(n => n.id === updated.id ? { ...n, data: { ...n.data, field: updated } } : n));
    setSaved(false);
  }

  async function handleSave() {
    // Save positions from nodes
    const fieldsWithPositions = fields.map(f => {
      const node = nodes.find(n => n.id === f.id);
      return { ...f, position: node?.position ?? f.position };
    });
    await updateForm.mutateAsync({ formId, title, fields: fieldsWithPositions });
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
    navigator.clipboard.writeText(`${window.location.origin}/f/${form?.slug}`);
    alert(`Link copied!`);
  }

  const selectedField = fields.find(f => f.id === selectedId) ?? null;

  if (isLoading) {
    return <div className="flex-1 flex items-center justify-center"><Loader2 className="animate-spin text-[#5865f2]" size={32} /></div>;
  }

  if (!form) {
    return <div className="flex-1 flex items-center justify-center text-[#949ba4]">Form not found. <Link href="/dashboard" className="ml-2 text-[#5865f2]">Go back</Link></div>;
  }

  return (
    <>
      {/* Field palette sidebar */}
      <aside className="w-[220px] shrink-0 bg-[#2b2d31] flex flex-col">
        <div className="px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#949ba4]">Drag to Canvas</p>
        </div>
        <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
          {FIELD_TYPES.map(({ type, label, Icon }) => (
            <button
              key={type}
              draggable
              onDragStart={(e) => onDragStart(e, type)}
              onClick={() => addField(type)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm text-[#949ba4] hover:bg-[#3f4147] hover:text-[#f2f3f5] transition-colors cursor-grab active:cursor-grabbing"
            >
              <Icon size={14} />
              {label}
              <Plus size={12} className="ml-auto text-[#4e5058]" />
            </button>
          ))}
        </div>
      </aside>

      {/* Canvas */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <header className="h-12 flex items-center px-4 gap-3 shrink-0 bg-[#2b2d31]">
          <input
            value={title}
            onChange={(e) => { setTitle(e.target.value); setSaved(false); }}
            className="bg-transparent text-sm font-semibold text-[#f2f3f5] focus:outline-none border-b border-transparent focus:border-[#5865f2] px-1 w-48"
          />
          <span className={cn("text-[10px] font-mono px-2 py-0.5 rounded capitalize", form.status === "published" ? "bg-[#5865f2]/15 text-[#5865f2]" : "bg-[#3f4147] text-[#949ba4]")}>
            {form.status}
          </span>
          {!saved && <span className="text-[10px] text-[#949ba4]">• unsaved</span>}
          <div className="ml-auto flex items-center gap-2">
            <button onClick={handleSave} disabled={saved || updateForm.isPending} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs border border-[#3f4147] text-[#b5bac1] hover:bg-[#3f4147] transition-colors disabled:opacity-40">
              <Save size={12} /> {updateForm.isPending ? "..." : "Save"}
            </button>
            <button onClick={handleShare} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs border border-[#3f4147] text-[#b5bac1] hover:bg-[#3f4147] transition-colors">
              <Share2 size={12} /> Share
            </button>
            <button onClick={handlePublish} className="px-3 py-1.5 rounded text-xs bg-[#5865f2] text-white hover:bg-[#4752c4] transition-colors">
              {form.status === "published" ? "Unpublish" : "Publish"}
            </button>
          </div>
        </header>

        {/* React Flow Canvas */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(_, node) => setSelectedId(node.id)}
            onPaneClick={() => setSelectedId(null)}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            connectionLineType={ConnectionLineType.SmoothStep}
            connectionLineStyle={{ stroke: "#5865f2", strokeWidth: 2 }}
            snapToGrid
            snapGrid={[20, 20]}
            defaultEdgeOptions={{
              animated: true,
              type: "smoothstep",
              style: { stroke: "#5865f2", strokeWidth: 2 },
              markerEnd: { type: MarkerType.ArrowClosed, color: "#5865f2", width: 16, height: 16 },
            }}
            fitView
            className="bg-[#1e1f22]"
          >
            <Background variant={BackgroundVariant.Dots} color="#4e5058" gap={16} size={2} />
            <Controls className="!bg-[#2b2d31] !border-[#3f4147] !shadow-none [&>button]:!bg-[#2b2d31] [&>button]:!border-[#3f4147] [&>button]:!text-[#949ba4] [&>button:hover]:!bg-[#3f4147]" />
            {nodes.length === 0 && (
              <Panel position="top-center" className="mt-20">
                <div className="text-center text-[#949ba4]">
                  <p className="text-sm mb-2">Click fields from the sidebar to add them to the canvas</p>
                  <p className="text-xs">Drag nodes to reposition • Scroll to zoom • Drag canvas to pan</p>
                </div>
              </Panel>
            )}
          </ReactFlow>
        </div>
      </div>

      {/* Inspector */}
      <aside className="w-[260px] shrink-0 bg-[#2b2d31] flex flex-col overflow-y-auto">
        <div className="px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#949ba4]">Field Settings</p>
        </div>
        {selectedField ? (
          <div className="px-4 space-y-4">
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#949ba4] mb-1">Label</label>
              <input value={selectedField.label} onChange={(e) => updateFieldData({ ...selectedField, label: e.target.value })} className="w-full bg-[#1e1f22] rounded px-3 py-2 text-sm text-[#f2f3f5] focus:outline-none focus:ring-1 focus:ring-[#5865f2]" />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#949ba4] mb-1">Placeholder</label>
              <input value={selectedField.placeholder ?? ""} onChange={(e) => updateFieldData({ ...selectedField, placeholder: e.target.value })} className="w-full bg-[#1e1f22] rounded px-3 py-2 text-sm text-[#f2f3f5] focus:outline-none focus:ring-1 focus:ring-[#5865f2]" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#b5bac1]">Required</span>
              <button onClick={() => updateFieldData({ ...selectedField, required: !selectedField.required })} className={cn("w-9 h-5 rounded-full transition-colors relative", selectedField.required ? "bg-[#5865f2]" : "bg-[#3f4147]")}>
                <span className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform", selectedField.required ? "translate-x-4" : "translate-x-0.5")} />
              </button>
            </div>
            {(selectedField.type === "single_select" || selectedField.type === "multi_select") && (
              <div>
                <label className="block text-[10px] font-mono uppercase text-[#949ba4] mb-1">Options (one per line)</label>
                <textarea
                  value={(selectedField.options ?? []).join("\n")}
                  onChange={(e) => updateFieldData({ ...selectedField, options: e.target.value.split("\n").filter(Boolean) })}
                  rows={4}
                  className="w-full bg-[#1e1f22] rounded px-3 py-2 text-sm text-[#f2f3f5] focus:outline-none focus:ring-1 focus:ring-[#5865f2] resize-none"
                />
              </div>
            )}
            <button onClick={() => deleteField(selectedField.id)} className="w-full py-2 rounded text-xs text-red-400 border border-red-400/30 hover:bg-red-400/10 transition-colors">
              Delete Field
            </button>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center px-6">
            <p className="text-sm text-[#949ba4]">Click a node to edit its settings</p>
          </div>
        )}
      </aside>
    </>
  );
}
