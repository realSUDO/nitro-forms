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
  Brain,
  ChevronDown,
  Download,
  GitBranch,
  GripVertical,
  Loader2,
  Mail,
  Plus,
  QrCode,
  Save,
  Share2,
  Sparkles,
  ToggleLeft,
  Trash2,
  Type,
  X,
  Zap,
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { cn } from "~/lib/utils";
import { trpc } from "~/trpc/client";

type FieldType = "short_text" | "long_text" | "email" | "number" | "single_select" | "multi_select" | "checkbox" | "rating" | "date" | "condition";

interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  order: number;
  options?: string[];
  validation?: { minLength?: number; maxLength?: number; min?: number; max?: number };
  position?: { x: number; y: number };
  conditionConfig?: {
    sourceFieldId: string;
    operator: "equals" | "not_equals" | "greater_than" | "less_than" | "contains";
    value: string;
  };
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

// Condition node — IF/ELSE branching
function ConditionNode({ data }: { data: { field: FormField; selected: boolean; onDelete: () => void } }) {
  const { field, onDelete } = data;
  return (
    <div className={cn(
      "w-[220px] rounded-lg border p-3 shadow-lg transition-all relative group",
      data.selected ? "border-[#faa61a] shadow-[0_0_15px_rgba(250,166,26,0.2)] bg-[#2b2d31]" : "border-[#faa61a]/30 bg-[#2b2d31] hover:border-[#faa61a]/60"
    )}>
      <Handle type="target" position={Position.Top} className="!w-1.5 !h-1.5 !rounded-full !bg-[#4e5058] !border-0 hover:!bg-[#faa61a] !transition-colors" />
      <Handle type="source" position={Position.Bottom} id="yes" style={{ left: "30%" }} className="!w-2 !h-2 !rounded-full !bg-[#3ba55c] !border-0" />
      <Handle type="source" position={Position.Bottom} id="no" style={{ left: "70%" }} className="!w-2 !h-2 !rounded-full !bg-[#ed4245] !border-0" />

      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <GitBranch size={11} className="text-[#faa61a]" />
          <span className="text-[10px] font-mono text-[#faa61a]">IF</span>
        </div>
        <button onClick={onDelete} className="opacity-0 group-hover:opacity-100 p-1 rounded text-[#949ba4] hover:text-red-400 transition-all">
          <Trash2 size={10} />
        </button>
      </div>
      <p className="text-xs text-[#f2f3f5] mb-2">{field.label}</p>
      {field.conditionConfig?.sourceFieldId && (
        <p className="text-[10px] text-[#949ba4] mb-2 truncate">
          {field.conditionConfig.operator} &quot;{field.conditionConfig.value}&quot;
        </p>
      )}

      {/* Bottom labels near dots */}
      <div className="flex justify-between px-2 mt-1">
        <span className="text-[9px] font-mono text-[#3ba55c]">yes</span>
        <span className="text-[9px] font-mono text-[#ed4245]">no</span>
      </div>
    </div>
  );
}

// Custom node component for form fields
function FieldNode({ data }: { data: { field: FormField; selected: boolean; onDelete: () => void } }) {
  const { field, onDelete } = data;
  return (
    <div className={cn(
      "w-[280px] rounded-lg border bg-[#2b2d31] p-4 shadow-lg transition-all relative group",
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
          <button onClick={onDelete} className="opacity-0 group-hover:opacity-100 p-1 rounded text-[#949ba4] hover:text-red-400 hover:bg-[#3f4147] transition-all">
            <Trash2 size={11} />
          </button>
        </div>
      </div>
      {/* Editable label */}
      <input
        defaultValue={field.label}
        onBlur={(e) => { if (e.target.value !== field.label) { (data as any).onUpdate?.({ ...field, label: e.target.value }); } }}
        className="w-full text-sm font-medium text-[#f2f3f5] bg-transparent focus:bg-[#1e1f22] focus:rounded focus:px-2 focus:py-0.5 focus:outline-none focus:ring-1 focus:ring-[#5865f2] transition-all mb-1 -ml-0.5"
      />
      {field.placeholder && <p className="text-[11px] text-[#4e5058]">{field.placeholder}</p>}
      {field.options && (
        <div className="mt-2 space-y-1">
          {field.options.slice(0, 4).map((o, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-sm bg-[#3f4147] flex items-center justify-center text-[9px] text-[#949ba4] font-bold shrink-0">{String.fromCharCode(65 + i)}</span>
              <span className="text-[11px] text-[#b5bac1]">{o}</span>
            </div>
          ))}
          {field.options.length > 4 && <p className="text-[10px] text-[#4e5058] pl-6">+{field.options.length - 4} more</p>}
        </div>
      )}
    </div>
  );
}

const nodeTypes = { fieldNode: FieldNode, conditionNode: ConditionNode };

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
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [saved, setSaved] = useState(true);
  const [formSettings, setFormSettings] = useState<Record<string, unknown>>({});

  // History (placeholder for future undo/redo)
  function pushHistory() { /* noop */ }

  // Load form data
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (form && !loaded) {
      setLoaded(true);
      setTitle(form.title);
      const loadedFields = (form.fieldsJson as FormField[]) ?? [];
      setFields(loadedFields);
      const savedSettings = form.settingsJson as Record<string, unknown> | null;
      setFormSettings(savedSettings ?? {});
      const newNodes: Node[] = loadedFields.map((field, i) => ({
        id: field.id,
        type: field.type === "condition" ? "conditionNode" : "fieldNode",
        position: field.position ?? { x: 100, y: i * 140 },
        data: { field, selected: false, onDelete: () => deleteField(field.id) },
      }));
      setNodes(newNodes);
      // Load saved edges from settings, or empty
      const edgeSettings = savedSettings as { edges?: Array<{ source: string; target: string; sourceHandle: string | null }> } | null;
      if (edgeSettings?.edges?.length) {
        const newEdges: Edge[] = edgeSettings.edges.map((e, i) => ({
          id: `e-${i}-${e.source}-${e.target}`,
          source: e.source,
          target: e.target,
          sourceHandle: e.sourceHandle,
          animated: true,
          type: "smoothstep",
          style: { stroke: "#5865f2", strokeWidth: 2 },
        }));
        setEdges(newEdges);
      }
    }
  }, [form]);

  const onConnect = useCallback((connection: Connection) => {
    pushHistory();
    setEdges(eds => addEdge(connection, eds));
    // Auto-set condition source when connecting to a condition node
    if (connection.target) {
      const targetField = fields.find(f => f.id === connection.target);
      if (targetField?.type === "condition" && connection.source) {
        updateFieldData({
          ...targetField,
          conditionConfig: {
            sourceFieldId: connection.source,
            operator: targetField.conditionConfig?.operator ?? "equals",
            value: targetField.conditionConfig?.value ?? "",
          },
        });
      }
    }
    setSaved(false);
  }, [setEdges, fields]);

  function addFieldAtPosition(type: FieldType, position?: { x: number; y: number }) {
    const pos = position ?? { x: 100 + Math.random() * 200, y: fields.length * 140 + Math.random() * 50 };
    const newField: FormField = {
      id: `f_${Date.now()}`,
      type,
      label: type === "condition" ? "If condition" : (FIELD_TYPES.find(t => t.type === type)?.label ?? "New Field"),
      required: false,
      order: fields.length + 1,
      options: type === "single_select" || type === "multi_select" ? ["Option 1", "Option 2"] : undefined,
      position: pos,
    };
    setFields(prev => [...prev, newField]);
    const newNode: Node = {
      id: newField.id,
      type: newField.type === "condition" ? "conditionNode" : "fieldNode",
      position: newField.position!,
      data: { field: newField, selected: false, onDelete: () => deleteField(newField.id) },
    };
    setNodes(nds => [...nds, newNode]);
    setSelectedId(newField.id);
    setSaved(false);
    pushHistory();
  }

  function addField(type: FieldType) {
    addFieldAtPosition(type);
  }

  function deleteField(id: string) {
    pushHistory();
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
    const fieldsWithPositions = fields.map(f => {
      const node = nodes.find(n => n.id === f.id);
      return { ...f, position: node?.position ?? f.position };
    });
    const flowEdges = edges.map(e => ({ source: e.source, target: e.target, sourceHandle: e.sourceHandle ?? null }));
    await updateForm.mutateAsync({ formId, title, fields: fieldsWithPositions, settings: { ...formSettings, edges: flowEdges } });
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

  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleCopyLink() {
    navigator.clipboard.writeText(`${window.location.origin}/f/${form?.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const [aiPrompt, setAiPrompt] = useState("");
  const [showAi, setShowAi] = useState(false);
  const [aiMode, setAiMode] = useState<"instant" | "think">("instant");
  const aiGenerate = trpc.ai.generateForm.useMutation({
    onSuccess: (data) => {
      if (data.title) setTitle(data.title);
      // Add to fields state
      const newFields: FormField[] = data.fields.map((f: any, i: number) => ({
        ...f,
        order: fields.length + i + 1,
        position: { x: 300, y: 100 + i * 200 },
      }));
      setFields(prev => [...prev, ...newFields]);
      // Create nodes
      const newNodes = newFields.map((f) => ({
        id: f.id,
        type: f.type === "condition" ? "conditionNode" : "fieldNode",
        position: f.position!,
        data: { field: f, selected: false, onDelete: () => deleteField(f.id), onUpdate: (updated: any) => updateFieldData(updated) },
      }));
      setNodes(prev => [...prev, ...newNodes]);
      // Create edges
      if (data.edges?.length) {
        const newEdges = data.edges.map((e: any) => ({
          id: `e-${e.source}-${e.target}`,
          source: e.source,
          target: e.target,
          sourceHandle: e.sourceHandle,
          animated: true,
          style: { stroke: e.sourceHandle === "yes" ? "#3ba55c" : e.sourceHandle === "no" ? "#ed4245" : "#5865f2" },
        }));
        setEdges(prev => [...prev, ...newEdges]);
      }
      setShowAi(false);
      setAiPrompt("");
      setSaved(false);
    },
  });

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
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#949ba4]">Fields</p>
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
          <div className="pt-3 mt-3 border-t border-[#3f4147]">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#949ba4] px-3 pb-2">Logic</p>
            <button
              draggable
              onDragStart={(e) => onDragStart(e, "condition")}
              onClick={() => addField("condition")}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm text-[#faa61a] hover:bg-[#3f4147] hover:text-[#faa61a] transition-colors cursor-grab active:cursor-grabbing"
            >
              <GitBranch size={14} />
              Condition
              <Plus size={12} className="ml-auto text-[#4e5058]" />
            </button>
          </div>
        </div>
      </aside>
      <div className="w-1 px-1 -mx-1 cursor-col-resize shrink-0 bg-clip-content bg-transparent hover:bg-[#5865f2]/50 active:bg-[#5865f2] transition-colors"
        onMouseDown={(e) => {
          const startX = e.clientX;
          const aside = e.currentTarget.previousElementSibling as HTMLElement;
          const startW = aside.offsetWidth;
          document.body.style.userSelect = "none";
          const onMove = (ev: MouseEvent) => {
            const diff = ev.clientX - startX;
            aside.style.width = `${Math.min(Math.max(startW + diff, 160), 400)}px`;
          };
          const onUp = () => { document.body.style.userSelect = ""; document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
          document.addEventListener("mousemove", onMove);
          document.addEventListener("mouseup", onUp);
        }}
      />

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
            <button onClick={async () => { if (!saved) await handleSave(); window.open(`/f/${form?.slug}`, '_blank'); }} className="px-3 py-1.5 rounded text-xs border border-[#3f4147] text-[#b5bac1] hover:bg-[#3f4147] transition-colors">
              Preview
            </button>
            <button onClick={handleSave} disabled={saved || updateForm.isPending} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs border border-[#3f4147] text-[#b5bac1] hover:bg-[#3f4147] transition-colors disabled:opacity-40">
              <Save size={12} /> {updateForm.isPending ? "..." : "Save"}
            </button>
            <button onClick={() => setShowShare(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs border border-[#3f4147] text-[#b5bac1] hover:bg-[#3f4147] transition-colors">
              <Share2 size={12} /> Share
            </button>
            <button onClick={() => setShowAi(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs bg-[#5865f2]/10 text-[#bec2ff] border border-[#5865f2]/30 hover:bg-[#5865f2]/20 transition-colors">
              <Sparkles size={12} /> AI Generate
            </button>
            <button onClick={handlePublish} disabled={publishForm.isPending || unpublishForm.isPending} className={cn("px-3 py-1.5 rounded text-xs text-white transition-colors disabled:opacity-50", form.status === "published" ? "bg-[#3f4147] hover:bg-[#4e5058]" : "bg-[#3ba55c] hover:bg-[#2d8049]")}>
              {(publishForm.isPending || unpublishForm.isPending) ? "..." : form.status === "published" ? "Unpublish" : "Publish"}
            </button>
          </div>
        </header>

        {/* React Flow Canvas */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges.map(e => e.id === selectedEdgeId ? { ...e, style: { stroke: "#ffffff", strokeWidth: 2.5 }, animated: true } : e)}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodesDelete={(deleted) => {
              deleted.forEach(n => { setFields(prev => prev.filter(f => f.id !== n.id)); });
              setSaved(false);
            }}
            onConnect={onConnect}
            onNodeClick={(_, node) => { setSelectedId(node.id); setSelectedEdgeId(null); }}
            onEdgeClick={(_, edge) => { setSelectedEdgeId(edge.id); setSelectedId(null); }}
            onPaneClick={() => { setSelectedId(null); setSelectedEdgeId(null); }}
            onNodeDragStop={(_, node) => {
              const thisY = node.position.y;
              const otherNodes = nodes.filter(n => n.id !== node.id);

              // Don't auto-connect if this node already has an incoming edge
              if (edges.find(e => e.target === node.id)) return;

              // Find closest node within magnet range (80px vertical)
              const nearby = otherNodes
                .filter(n => n.position.y < thisY)
                .sort((a, b) => b.position.y - a.position.y)[0];

              if (!nearby) return;

              // Magnet: only connect if within 80px vertical proximity
              const distance = thisY - nearby.position.y;
              if (distance > 250) return;

              // Don't connect if above node already has an outgoing edge (no double children via autoconnect)
              const aboveField = fields.find(f => f.id === nearby.id);
              if (aboveField?.type === "condition") {
                // Condition nodes can have 2 outputs (yes/no) — skip autoconnect entirely
                return;
              }
              if (edges.find(e => e.source === nearby.id)) return;

              setEdges(eds => [...eds, {
                id: `e-auto-${nearby.id}-${node.id}`,
                source: nearby.id,
                target: node.id,
                animated: true,
                type: "smoothstep",
                style: { stroke: "#5865f2", strokeWidth: 2 },
              }]);
              setSaved(false);
            }}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            connectionLineType={ConnectionLineType.SmoothStep}
            connectionLineStyle={{ stroke: "#5865f2", strokeWidth: 2 }}
            snapToGrid
            snapGrid={[20, 20]}
            deleteKeyCode={["Backspace", "Delete"]}
            panOnDrag
            selectionKeyCode="Shift"
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

      {/* Inspector - drag left edge to resize */}
      <div className="w-1 px-1 -mx-1 cursor-col-resize shrink-0 bg-clip-content bg-transparent hover:bg-[#5865f2]/50 active:bg-[#5865f2] transition-colors"
        onMouseDown={(e) => {
          const startX = e.clientX;
          const aside = e.currentTarget.nextElementSibling as HTMLElement;
          const startW = aside.offsetWidth;
          document.body.style.userSelect = "none";
          const onMove = (ev: MouseEvent) => {
            const diff = startX - ev.clientX;
            aside.style.width = `${Math.min(Math.max(startW + diff, 220), 500)}px`;
          };
          const onUp = () => { document.body.style.userSelect = ""; document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
          document.addEventListener("mousemove", onMove);
          document.addEventListener("mouseup", onUp);
        }}
      />
      <aside className="w-[300px] shrink-0 bg-[#2b2d31] flex flex-col overflow-y-auto">
        <div className="px-4 py-3 border-b border-[#3f4147]/50">
          <p className="text-xs font-semibold text-[#f2f3f5]">
            {selectedField ? "Settings" : selectedEdgeId ? "Connection" : "Inspector"}
          </p>
        </div>
        {selectedField ? (
          <div className="px-4 py-4 space-y-4 flex-1">
            {/* Type badge */}
            <div className="flex items-center gap-2">
              <span className={cn(
                "px-2.5 py-1 rounded-md text-[10px] font-mono",
                selectedField.type === "condition" ? "bg-[#faa61a]/10 text-[#faa61a]" : "bg-[#5865f2]/10 text-[#5865f2]"
              )}>
                {selectedField.type.replace("_", " ")}
              </span>
            </div>

            {/* Label */}
            <div>
              <label className="block text-[11px] text-[#949ba4] mb-1.5">Label</label>
              <input value={selectedField.label} onChange={(e) => updateFieldData({ ...selectedField, label: e.target.value })} className="w-full bg-[#1e1f22] rounded-lg px-3 py-2 text-sm text-[#f2f3f5] focus:outline-none focus:ring-1 focus:ring-[#5865f2]" />
            </div>

            {/* Placeholder */}
            {selectedField.type !== "condition" && (
              <div>
                <label className="block text-[11px] text-[#949ba4] mb-1.5">Placeholder</label>
                <input value={selectedField.placeholder ?? ""} onChange={(e) => updateFieldData({ ...selectedField, placeholder: e.target.value })} placeholder="Hint text..." className="w-full bg-[#1e1f22] rounded-lg px-3 py-2 text-sm text-[#f2f3f5] placeholder:text-[#4e5058] focus:outline-none focus:ring-1 focus:ring-[#5865f2]" />
              </div>
            )}

            {/* Required toggle */}
            <div className="flex items-center justify-between gap-4 py-2.5 px-3 rounded-lg bg-[#1e1f22] overflow-hidden">
              <span className="text-sm text-[#b5bac1] whitespace-nowrap">Required</span>
              <div onClick={() => updateFieldData({ ...selectedField, required: !selectedField.required })} className={cn("w-8 h-4 rounded-full cursor-pointer shrink-0 relative transition-colors duration-200", selectedField.required ? "bg-[#5865f2]" : "bg-[#3f4147]")}>
                <span className={cn("absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-all duration-200", selectedField.required ? "left-4" : "left-0.5")} />
              </div>
            </div>

            {/* Validation: text fields */}
            {(selectedField.type === "short_text" || selectedField.type === "long_text") && (
              <div className="space-y-2">
                <label className="block text-[11px] text-[#949ba4]">Validation</label>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min length" value={selectedField.validation?.minLength ?? ""} onChange={(e) => updateFieldData({ ...selectedField, validation: { ...selectedField.validation, minLength: e.target.value ? Number(e.target.value) : undefined } })} className="flex-1 bg-[#1e1f22] rounded px-2.5 py-1.5 text-sm text-[#f2f3f5] placeholder:text-[#4e5058] focus:outline-none focus:ring-1 focus:ring-[#5865f2]" />
                  <input type="number" placeholder="Max length" value={selectedField.validation?.maxLength ?? ""} onChange={(e) => updateFieldData({ ...selectedField, validation: { ...selectedField.validation, maxLength: e.target.value ? Number(e.target.value) : undefined } })} className="flex-1 bg-[#1e1f22] rounded px-2.5 py-1.5 text-sm text-[#f2f3f5] placeholder:text-[#4e5058] focus:outline-none focus:ring-1 focus:ring-[#5865f2]" />
                </div>
              </div>
            )}

            {/* Validation: number fields */}
            {selectedField.type === "number" && (
              <div className="space-y-2">
                <label className="block text-[11px] text-[#949ba4]">Validation</label>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min value" value={selectedField.validation?.min ?? ""} onChange={(e) => updateFieldData({ ...selectedField, validation: { ...selectedField.validation, min: e.target.value ? Number(e.target.value) : undefined } })} className="flex-1 bg-[#1e1f22] rounded px-2.5 py-1.5 text-sm text-[#f2f3f5] placeholder:text-[#4e5058] focus:outline-none focus:ring-1 focus:ring-[#5865f2]" />
                  <input type="number" placeholder="Max value" value={selectedField.validation?.max ?? ""} onChange={(e) => updateFieldData({ ...selectedField, validation: { ...selectedField.validation, max: e.target.value ? Number(e.target.value) : undefined } })} className="flex-1 bg-[#1e1f22] rounded px-2.5 py-1.5 text-sm text-[#f2f3f5] placeholder:text-[#4e5058] focus:outline-none focus:ring-1 focus:ring-[#5865f2]" />
                </div>
              </div>
            )}

            {/* Options (for select fields) */}
            {(selectedField.type === "single_select" || selectedField.type === "multi_select") && (
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#949ba4] mb-2">Options</label>
                <div className="space-y-1.5">
                  {(selectedField.options ?? []).map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold bg-[#3f4147] text-[#949ba4] shrink-0">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <input
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...(selectedField.options ?? [])];
                          newOpts[i] = e.target.value;
                          updateFieldData({ ...selectedField, options: newOpts });
                        }}
                        className="flex-1 bg-[#1e1f22] rounded px-2.5 py-1.5 text-sm text-[#f2f3f5] focus:outline-none focus:ring-1 focus:ring-[#5865f2]"
                      />
                      <button
                        onClick={() => {
                          const newOpts = (selectedField.options ?? []).filter((_, idx) => idx !== i);
                          updateFieldData({ ...selectedField, options: newOpts });
                        }}
                        className="text-[#4e5058] hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => updateFieldData({ ...selectedField, options: [...(selectedField.options ?? []), `Option ${(selectedField.options?.length ?? 0) + 1}`] })}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-dashed border-[#3f4147] text-xs text-[#949ba4] hover:border-[#5865f2] hover:text-[#5865f2] transition-colors"
                  >
                    <Plus size={12} /> Add Option
                  </button>
                </div>
              </div>
            )}

            {/* Condition settings */}
            {selectedField.type === "condition" && (
              <div className="space-y-3">
                <p className="text-[11px] font-mono uppercase text-[#faa61a]">Condition Logic</p>

                {/* Source field picker */}
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#949ba4] mb-1.5">If field</label>
                  <select
                    value={selectedField.conditionConfig?.sourceFieldId ?? ""}
                    onChange={(e) => updateFieldData({ ...selectedField, conditionConfig: { ...selectedField.conditionConfig!, sourceFieldId: e.target.value, operator: selectedField.conditionConfig?.operator ?? "equals", value: selectedField.conditionConfig?.value ?? "" } })}
                    className="w-full bg-[#1e1f22] rounded-lg px-3 py-2 text-sm text-[#f2f3f5] focus:outline-none focus:ring-1 focus:ring-[#5865f2] appearance-none"
                  >
                    <option value="">Select a field...</option>
                    {fields.filter(f => f.type !== "condition" && f.id !== selectedField.id).map(f => (
                      <option key={f.id} value={f.id}>{f.label} ({f.type.replace("_", " ")})</option>
                    ))}
                  </select>
                </div>

                {/* Operator */}
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#949ba4] mb-1.5">Operator</label>
                  <select
                    value={selectedField.conditionConfig?.operator ?? "equals"}
                    onChange={(e) => updateFieldData({ ...selectedField, conditionConfig: { ...selectedField.conditionConfig!, operator: e.target.value as any } })}
                    className="w-full bg-[#1e1f22] rounded-lg px-3 py-2 text-sm text-[#f2f3f5] focus:outline-none focus:ring-1 focus:ring-[#5865f2] appearance-none"
                  >
                    <option value="equals">Equals</option>
                    <option value="not_equals">Not equals</option>
                    <option value="greater_than">Greater than</option>
                    <option value="less_than">Less than</option>
                    <option value="contains">Contains</option>
                  </select>
                </div>

                {/* Value — show options from source field if it's a select */}
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#949ba4] mb-1.5">Value</label>
                  {(() => {
                    const sourceField = fields.find(f => f.id === selectedField.conditionConfig?.sourceFieldId);
                    if (sourceField && (sourceField.type === "single_select" || sourceField.type === "multi_select") && sourceField.options) {
                      return (
                        <select
                          value={selectedField.conditionConfig?.value ?? ""}
                          onChange={(e) => updateFieldData({ ...selectedField, conditionConfig: { ...selectedField.conditionConfig!, value: e.target.value } })}
                          className="w-full bg-[#1e1f22] rounded-lg px-3 py-2 text-sm text-[#f2f3f5] focus:outline-none focus:ring-1 focus:ring-[#5865f2] appearance-none"
                        >
                          <option value="">Pick an option...</option>
                          {sourceField.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      );
                    }
                    if (sourceField?.type === "checkbox") {
                      return (
                        <select
                          value={selectedField.conditionConfig?.value ?? ""}
                          onChange={(e) => updateFieldData({ ...selectedField, conditionConfig: { ...selectedField.conditionConfig!, value: e.target.value } })}
                          className="w-full bg-[#1e1f22] rounded-lg px-3 py-2 text-sm text-[#f2f3f5] focus:outline-none focus:ring-1 focus:ring-[#5865f2] appearance-none"
                        >
                          <option value="true">Checked</option>
                          <option value="false">Unchecked</option>
                        </select>
                      );
                    }
                    return (
                      <input
                        value={selectedField.conditionConfig?.value ?? ""}
                        onChange={(e) => updateFieldData({ ...selectedField, conditionConfig: { ...selectedField.conditionConfig!, value: e.target.value } })}
                        placeholder={sourceField?.type === "rating" ? "e.g. 4" : "Enter value..."}
                        className="w-full bg-[#1e1f22] rounded-lg px-3 py-2 text-sm text-[#f2f3f5] placeholder:text-[#4e5058] focus:outline-none focus:ring-1 focus:ring-[#5865f2]"
                      />
                    );
                  })()}
                </div>

                <div className="p-2.5 rounded-lg bg-[#1e1f22] text-[10px] text-[#949ba4]">
                  Connect <span className="text-[#3ba55c]">Yes</span> handle → field shown when true<br/>
                  Connect <span className="text-[#ed4245]">No</span> handle → field shown when false
                </div>
              </div>
            )}

            {/* Danger zone */}
            <div className="pt-4 border-t border-[#3f4147]">
              <button onClick={() => deleteField(selectedField.id)} className="w-full py-2.5 rounded-lg text-xs font-medium text-red-400 border border-red-400/20 hover:bg-red-400/10 transition-colors">
                Delete Field
              </button>
            </div>
          </div>
        ) : selectedEdgeId ? (() => {
            const selectedEdge = edges.find(e => e.id === selectedEdgeId);
            if (selectedEdge) {
              return (
                <div className="px-4 py-4 flex flex-col items-center justify-center gap-3">
                  <p className="text-[10px] font-mono uppercase text-[#949ba4]">Edge Selected</p>
                  <button
                    onClick={() => { setEdges(eds => eds.filter(e => e.id !== selectedEdgeId)); setSelectedEdgeId(null); setSaved(false); }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 border border-red-400/20 hover:bg-red-400/10 transition-colors"
                  >
                    <Trash2 size={14} /> Delete Connection
                  </button>
                  <p className="text-[10px] text-[#4e5058]">Or press Delete key</p>
                </div>
              );
            }
            return null;
          })() : (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <div className="w-12 h-12 rounded-xl bg-[#3f4147] flex items-center justify-center mb-3">
              <Type size={20} className="text-[#4e5058]" />
            </div>
            <p className="text-sm text-[#949ba4] mb-1">No selection</p>
            <p className="text-xs text-[#4e5058]">Click a node or edge to edit</p>
            <div className="mt-6 w-full border-t border-[#3f4147] pt-4">
              <div className="flex items-center justify-between gap-4 py-2.5 px-3 rounded-lg bg-[#1e1f22]">
                <span className="text-sm text-[#b5bac1] whitespace-nowrap">Require login to submit</span>
                <div onClick={() => { const next = !formSettings.requireAuth; setFormSettings(s => ({ ...s, requireAuth: next })); setSaved(false); }} className={cn("w-8 h-4 rounded-full cursor-pointer shrink-0 relative transition-colors duration-200", formSettings.requireAuth ? "bg-[#5865f2]" : "bg-[#3f4147]")}>
                  <span className={cn("absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-all duration-200", formSettings.requireAuth ? "left-4" : "left-0.5")} />
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Share Modal */}
      {showShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowShare(false)}>
          <div className="bg-[#2b2d31] rounded-xl p-6 shadow-xl border border-[#3f4147] w-[360px]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-[#f2f3f5]">Share Form</p>
              <button onClick={() => setShowShare(false)} className="text-[#949ba4] hover:text-[#f2f3f5]"><X size={16} /></button>
            </div>

            {/* Copy link */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex-1 bg-[#1e1f22] rounded px-3 py-2 text-xs text-[#949ba4] truncate">
                {typeof window !== "undefined" ? window.location.origin : ""}/f/{form?.slug}
              </div>
              <button onClick={handleCopyLink} className={cn("px-3 py-2 rounded text-xs font-medium transition-colors", copied ? "bg-[#3ba55c] text-white" : "bg-[#5865f2] text-white hover:bg-[#4752c4]")}>
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            {/* QR */}
            <div className="flex flex-col items-center gap-3 pt-4 border-t border-[#3f4147]">
              <QRCodeCanvas id="qr-canvas" value={`${typeof window !== "undefined" ? window.location.origin : ""}/f/${form?.slug}`} size={160} bgColor="#ffffff" fgColor="#000000" />
              <button onClick={() => { const canvas = document.getElementById("qr-canvas") as HTMLCanvasElement | null; if (!canvas) return; const url = canvas.toDataURL("image/png"); const a = document.createElement("a"); a.href = url; a.download = `${form?.slug ?? "form"}-qr.png`; a.click(); }} className="text-xs text-[#949ba4] hover:text-[#f2f3f5] transition-colors">
                Download QR as PNG
              </button>
            </div>
          </div>
        </div>
      )}
      {showAi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowAi(false)}>
          <div className="bg-[#2b2d31] rounded-xl p-6 shadow-xl border border-[#3f4147] w-[400px]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-[#f2f3f5] flex items-center gap-2"><Sparkles size={14} className="text-[#5865f2]" /> AI Form Generator</p>
              <button onClick={() => setShowAi(false)} className="text-[#949ba4] hover:text-[#f2f3f5]"><X size={16} /></button>
            </div>
            <p className="text-xs text-[#949ba4] mb-3">Describe your form and AI will generate the fields. 2 free generations per account.</p>
            <textarea
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              placeholder="e.g. A customer feedback form with name, email, rating, and comments..."
              className="w-full h-24 bg-[#1e1f22] rounded-lg px-3 py-2 text-sm text-[#f2f3f5] placeholder:text-[#4e5058] focus:outline-none focus:ring-1 focus:ring-[#5865f2] resize-none mb-3"
            />
            {aiGenerate.error && <p className="text-xs text-[#ed4245] mb-2">{aiGenerate.error.message}</p>}
            <div className="flex gap-2 mb-3">
              <button onClick={() => setAiMode("instant")} className={cn("flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded text-xs font-medium transition-colors", aiMode === "instant" ? "bg-[#3f4147] text-[#f2f3f5]" : "text-[#949ba4] hover:text-[#b5bac1]")}>
                <Zap size={12} /> Instant
              </button>
              <button onClick={() => setAiMode("think")} className={cn("flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded text-xs font-medium transition-colors", aiMode === "think" ? "bg-[#5865f2]/20 text-[#bec2ff]" : "text-[#949ba4] hover:text-[#b5bac1]")}>
                <Brain size={12} /> Think
              </button>
            </div>
            <button
              onClick={() => aiGenerate.mutate({ prompt: aiPrompt, mode: aiMode })}
              disabled={!aiPrompt.trim() || aiGenerate.isPending}
              className="w-full py-2 rounded-lg text-sm font-medium bg-[#5865f2] text-white hover:bg-[#4752c4] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {aiGenerate.isPending ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {aiGenerate.isPending ? "Generating..." : "Generate Fields"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
