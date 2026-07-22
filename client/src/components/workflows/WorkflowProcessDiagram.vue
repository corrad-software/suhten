<script setup lang="ts">
import { computed } from "vue";
import { X } from "lucide-vue-next";

export type ProcessDiagramStep = {
  id: string;
  name?: string;
  actionKey: string;
};

export type ProcessDiagramTransition = {
  from: string;
  to: string;
  condition?: string;
};

const props = defineProps<{
  open: boolean;
  title: string;
  steps: ProcessDiagramStep[];
  transitions?: ProcessDiagramTransition[];
  actionLabel?: (actionKey: string) => string;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
}>();

function close() {
  emit("update:open", false);
}

function labelFor(step: ProcessDiagramStep) {
  return step.name?.trim() || props.actionLabel?.(step.actionKey) || step.id;
}

function outgoingOf(
  stepId: string,
  transitions: ProcessDiagramTransition[],
): ProcessDiagramTransition[] {
  return transitions.filter((t) => t.from === stepId);
}

function isHuman(step: ProcessDiagramStep) {
  return step.actionKey === "human" || step.actionKey === "human_task" || step.actionKey === "approval";
}

function isCondition(step: ProcessDiagramStep) {
  return step.actionKey === "condition" || step.actionKey === "conditionAi" || step.actionKey === "condition_ai";
}

function isDecisionStep(step: ProcessDiagramStep, outCount: number) {
  if (isCondition(step) || isHuman(step)) return true;
  return outCount > 1;
}

function formatCondition(condition?: string | null) {
  if (!condition || !condition.trim()) return "";
  const c = condition.trim();
  const m = c.match(/^decision\s*===\s*(.+)$/i);
  if (m) return m[1].trim();
  const m2 = c.match(/^(.+?)\s*===\s*(.+)$/);
  if (m2) return `${m2[1].trim()} = ${m2[2].trim()}`;
  return c;
}

type NodeKind = "start" | "end" | "process" | "decision";

type LayoutNode = {
  key: string;
  stepId?: string;
  kind: NodeKind;
  label: string;
  meta?: string;
  /** true when 2+ forward edges join here */
  isMerge?: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
};

type LayoutEdge = {
  key: string;
  fromKey: string;
  toKey: string;
  label: string;
  path: string;
  labelX: number;
  labelY: number;
  /** back-edge / loop styling */
  isLoop?: boolean;
};

const PROCESS_W = 196;
const PROCESS_H = 56;
const DECISION_W = 148;
const DECISION_H = 148;
const TERMINAL_W = 112;
const TERMINAL_H = 40;
const V_GAP = 72;
const H_GAP = 48;
const PAD = 48;
const LOOP_GUTTER = 56;

const chartTitle = computed(() => (props.title.trim() || "Workflow process").toUpperCase());

const layout = computed(() => {
  const steps = props.steps;
  const transitions = props.transitions ?? [];

  if (!steps.length) {
    return { nodes: [] as LayoutNode[], edges: [] as LayoutEdge[], width: 320, height: 200 };
  }

  const stepById = new Map(steps.map((s) => [s.id, s]));
  const stepIds = steps.map((s) => s.id);

  const outs = new Map<string, ProcessDiagramTransition[]>();
  const inns = new Map<string, ProcessDiagramTransition[]>();
  for (const id of stepIds) {
    outs.set(id, []);
    inns.set(id, []);
  }
  for (const t of transitions) {
    if (!outs.has(t.from) || !inns.has(t.to)) continue;
    outs.get(t.from)!.push(t);
    inns.get(t.to)!.push(t);
  }

  // --- Topological order (Kahn); leftover nodes are in cycles ---
  const indeg = new Map<string, number>();
  for (const id of stepIds) indeg.set(id, inns.get(id)!.length);

  const queue: string[] = stepIds.filter((id) => (indeg.get(id) ?? 0) === 0);
  const order: string[] = [];
  while (queue.length) {
    const id = queue.shift()!;
    order.push(id);
    for (const t of outs.get(id) ?? []) {
      indeg.set(t.to, (indeg.get(t.to) ?? 0) - 1);
      if ((indeg.get(t.to) ?? 0) === 0) queue.push(t.to);
    }
  }
  for (const id of stepIds) {
    if (!order.includes(id)) order.push(id);
  }

  const orderIndex = new Map(order.map((id, i) => [id, i]));

  // Forward edge = to appears after from in topo order; else loop/back-edge
  function isForward(from: string, to: string) {
    return (orderIndex.get(from) ?? 0) < (orderIndex.get(to) ?? 0);
  }

  // Longest-path layers using forward edges only
  const layer = new Map<string, number>();
  for (const id of order) {
    let maxPred = -1;
    for (const t of inns.get(id) ?? []) {
      if (!isForward(t.from, id)) continue;
      maxPred = Math.max(maxPred, layer.get(t.from) ?? 0);
    }
    layer.set(id, maxPred + 1);
  }

  // Ensure merge targets sit strictly below all forward parents
  for (const id of order) {
    const forwardInns = (inns.get(id) ?? []).filter((t) => isForward(t.from, id));
    if (forwardInns.length < 2) continue;
    const parentMax = Math.max(...forwardInns.map((t) => layer.get(t.from) ?? 0));
    if ((layer.get(id) ?? 0) <= parentMax) {
      layer.set(id, parentMax + 1);
      // Push descendants down
      let changed = true;
      while (changed) {
        changed = false;
        for (const n of order) {
          for (const t of outs.get(n) ?? []) {
            if (!isForward(n, t.to)) continue;
            const need = (layer.get(n) ?? 0) + 1;
            if ((layer.get(t.to) ?? 0) < need) {
              layer.set(t.to, need);
              changed = true;
            }
          }
        }
      }
    }
  }

  const maxLayer = Math.max(0, ...[...layer.values()]);
  const layers: string[][] = Array.from({ length: maxLayer + 1 }, () => []);
  for (const id of order) {
    layers[layer.get(id) ?? 0].push(id);
  }

  // Order nodes in each layer by average parent barycenter (reduce crossings)
  for (let L = 1; L < layers.length; L++) {
    layers[L].sort((a, b) => {
      const avg = (id: string) => {
        const preds = (inns.get(id) ?? [])
          .filter((t) => isForward(t.from, id))
          .map((t) => layers[L - 1].indexOf(t.from))
          .filter((i) => i >= 0);
        if (!preds.length) return layers[L].indexOf(id);
        return preds.reduce((s, i) => s + i, 0) / preds.length;
      };
      return avg(a) - avg(b);
    });
  }

  function sizeFor(kind: NodeKind): { w: number; h: number } {
    if (kind === "decision") return { w: DECISION_W, h: DECISION_H };
    if (kind === "start" || kind === "end") return { w: TERMINAL_W, h: TERMINAL_H };
    return { w: PROCESS_W, h: PROCESS_H };
  }

  function kindFor(id: string): NodeKind {
    const step = stepById.get(id)!;
    const outCount = outs.get(id)?.length ?? 0;
    return isDecisionStep(step, outCount) ? "decision" : "process";
  }

  // --- Place nodes ---
  const nodes: LayoutNode[] = [];
  const nodeByKey = new Map<string, LayoutNode>();

  const startSize = sizeFor("start");
  const startNode: LayoutNode = {
    key: "start",
    kind: "start",
    label: "Start",
    x: 0,
    y: 0,
    w: startSize.w,
    h: startSize.h,
  };
  nodes.push(startNode);
  nodeByKey.set("start", startNode);

  // Precompute row widths
  const rowMeta = layers.map((ids) => {
    const sizes = ids.map((id) => sizeFor(kindFor(id)));
    const width =
      sizes.reduce((s, sz) => s + sz.w, 0) + Math.max(0, ids.length - 1) * H_GAP;
    const height = Math.max(...sizes.map((sz) => sz.h), PROCESS_H);
    return { width, height, sizes };
  });

  const contentWidth = Math.max(startSize.w, ...rowMeta.map((r) => r.width), PROCESS_W);

  startNode.x = (contentWidth - startSize.w) / 2;

  let yCursor = startSize.h + V_GAP;

  for (let L = 0; L < layers.length; L++) {
    const ids = layers[L];
    const meta = rowMeta[L];
    let xCursor = (contentWidth - meta.width) / 2;
    const rowH = meta.height;

    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const kind = kindFor(id);
      const sz = meta.sizes[i];
      const step = stepById.get(id)!;
      const forwardInCount = (inns.get(id) ?? []).filter((t) => isForward(t.from, id)).length;
      const node: LayoutNode = {
        key: id,
        stepId: id,
        kind,
        label: labelFor(step),
        meta: kind === "process" ? props.actionLabel?.(step.actionKey) || step.actionKey : undefined,
        isMerge: forwardInCount > 1,
        x: xCursor,
        y: yCursor + (rowH - sz.h) / 2,
        w: sz.w,
        h: sz.h,
      };
      nodes.push(node);
      nodeByKey.set(id, node);
      xCursor += sz.w + H_GAP;
    }

    yCursor += rowH + V_GAP;
  }

  const endSize = sizeFor("end");
  const endNode: LayoutNode = {
    key: "end",
    kind: "end",
    label: "End",
    x: (contentWidth - endSize.w) / 2,
    y: yCursor,
    w: endSize.w,
    h: endSize.h,
  };
  nodes.push(endNode);
  nodeByKey.set("end", endNode);

  // --- Edges ---
  const edges: LayoutEdge[] = [];
  let edgeSeq = 0;

  function anchorY(node: LayoutNode, side: "top" | "bottom") {
    if (node.kind === "decision") {
      return side === "top" ? node.y + node.h * 0.17 : node.y + node.h * 0.83;
    }
    return side === "top" ? node.y : node.y + node.h;
  }

  function cx(node: LayoutNode) {
    return node.x + node.w / 2;
  }

  function addEdge(fromKey: string, toKey: string, label: string, isLoop = false) {
    const from = nodeByKey.get(fromKey);
    const to = nodeByKey.get(toKey);
    if (!from || !to) return;

    const x1 = cx(from);
    const y1 = anchorY(from, "bottom");
    const x2 = cx(to);
    const y2 = anchorY(to, "top");

    let path: string;
    let labelX: number;
    let labelY: number;

    if (isLoop) {
      // Side route for back-edges / loops so merges stay readable
      const gutterX = Math.max(from.x + from.w, to.x + to.w) + LOOP_GUTTER;
      const yOut = y1 + 12;
      const yIn = y2 - 12;
      path = `M ${x1} ${y1} L ${x1} ${yOut} L ${gutterX} ${yOut} L ${gutterX} ${yIn} L ${x2} ${yIn} L ${x2} ${y2}`;
      labelX = gutterX;
      labelY = (yOut + yIn) / 2;
    } else if (Math.abs(x1 - x2) < 2) {
      path = `M ${x1} ${y1} L ${x2} ${y2}`;
      labelX = x1;
      labelY = (y1 + y2) / 2 - 6;
    } else {
      // Orthogonal: drop, join horizontally, drop into target (clear merge forks/joins)
      const midY = y1 + Math.max(20, (y2 - y1) * 0.45);
      path = `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;
      labelX = (x1 + x2) / 2;
      labelY = midY - 8;
    }

    edges.push({
      key: `e-${edgeSeq++}`,
      fromKey,
      toKey,
      label,
      path,
      labelX,
      labelY,
      isLoop,
    });
  }

  // Start → roots
  const roots = stepIds.filter((id) => (inns.get(id) ?? []).length === 0);
  const startTargets = roots.length ? roots : [order[0]];
  for (const id of startTargets) {
    addEdge("start", id, "");
  }

  // All workflow transitions
  for (const t of transitions) {
    if (!nodeByKey.has(t.from) || !nodeByKey.has(t.to)) continue;
    addEdge(t.from, t.to, formatCondition(t.condition), !isForward(t.from, t.to));
  }

  // Leaves → End (no outgoing transitions)
  for (const id of stepIds) {
    if ((outs.get(id) ?? []).length === 0) {
      addEdge(id, "end", "");
    }
  }

  // For merge nodes: redraw incoming forward edges so they share a join rail
  const mergeIds = stepIds.filter((id) => {
    const forwardInns = (inns.get(id) ?? []).filter((t) => isForward(t.from, id));
    return forwardInns.length > 1;
  });

  for (const mergeId of mergeIds) {
    const mergeNode = nodeByKey.get(mergeId)!;
    const forwardInns = (inns.get(mergeId) ?? []).filter((t) => isForward(t.from, mergeId));

    // Remove old forward edges into this merge; keep loop edges
    for (let i = edges.length - 1; i >= 0; i--) {
      const e = edges[i];
      if (e.toKey === mergeId && !e.isLoop && e.fromKey !== "start") {
        edges.splice(i, 1);
      }
    }

    const joinY = mergeNode.y - Math.min(28, V_GAP * 0.4);
    const mergeX = cx(mergeNode);
    const mergeTop = anchorY(mergeNode, "top");

    for (const t of forwardInns) {
      const from = nodeByKey.get(t.from)!;
      const x1 = cx(from);
      const y1 = anchorY(from, "bottom");
      const label = formatCondition(t.condition);

      // Drop from parent → horizontal join rail → down into merge
      const dropY = Math.min(y1 + 24, joinY - 8);
      const path =
        Math.abs(x1 - mergeX) < 2
          ? `M ${x1} ${y1} L ${mergeX} ${mergeTop}`
          : `M ${x1} ${y1} L ${x1} ${dropY} L ${x1} ${joinY} L ${mergeX} ${joinY} L ${mergeX} ${mergeTop}`;

      edges.push({
        key: `e-${edgeSeq++}`,
        fromKey: t.from,
        toKey: mergeId,
        label,
        path,
        labelX: x1,
        labelY: dropY - 4,
        isLoop: false,
      });
    }
  }

  // Pad to positive coords
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const n of nodes) {
    minX = Math.min(minX, n.x);
    minY = Math.min(minY, n.y);
    maxX = Math.max(maxX, n.x + n.w);
    maxY = Math.max(maxY, n.y + n.h);
  }
  // Account for loop gutters in width
  maxX += LOOP_GUTTER + 24;

  const dx = PAD - minX;
  const dy = PAD - minY;
  for (const n of nodes) {
    n.x += dx;
    n.y += dy;
  }

  // Rebuild all edge paths after pad using stored from/to (re-run geometry)
  function rebuildEdge(e: LayoutEdge) {
    const from = nodeByKey.get(e.fromKey)!;
    const to = nodeByKey.get(e.toKey)!;
    const x1 = cx(from);
    const y1 = anchorY(from, "bottom");
    const x2 = cx(to);
    const y2 = anchorY(to, "top");

    if (e.isLoop) {
      const gutterX = Math.max(from.x + from.w, to.x + to.w) + LOOP_GUTTER;
      const yOut = y1 + 12;
      const yIn = y2 - 12;
      e.path = `M ${x1} ${y1} L ${x1} ${yOut} L ${gutterX} ${yOut} L ${gutterX} ${yIn} L ${x2} ${yIn} L ${x2} ${y2}`;
      e.labelX = gutterX;
      e.labelY = (yOut + yIn) / 2;
      return;
    }

    // Merge join rails: detect if target is a merge with this as forward parent
    if (to.isMerge && e.fromKey !== "start") {
      const joinY = to.y - Math.min(28, V_GAP * 0.4);
      const dropY = Math.min(y1 + 24, joinY - 8);
      e.path =
        Math.abs(x1 - x2) < 2
          ? `M ${x1} ${y1} L ${x2} ${y2}`
          : `M ${x1} ${y1} L ${x1} ${dropY} L ${x1} ${joinY} L ${x2} ${joinY} L ${x2} ${y2}`;
      e.labelX = x1;
      e.labelY = dropY - 4;
      return;
    }

    if (Math.abs(x1 - x2) < 2) {
      e.path = `M ${x1} ${y1} L ${x2} ${y2}`;
      e.labelX = x1;
      e.labelY = (y1 + y2) / 2 - 6;
    } else {
      const midY = y1 + Math.max(20, (y2 - y1) * 0.45);
      e.path = `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;
      e.labelX = (x1 + x2) / 2;
      e.labelY = midY - 8;
    }
  }

  for (const e of edges) rebuildEdge(e);

  return {
    nodes,
    edges,
    width: maxX - minX + PAD * 2,
    height: maxY - minY + PAD * 2,
  };
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-90 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
      @click.self="close"
      @keydown.escape="close"
    >
      <div
        class="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="workflow-process-title"
      >
        <div class="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div>
            <h3 id="workflow-process-title" class="text-sm font-semibold text-slate-900">
              Process diagram
            </h3>
            <p class="mt-0.5 text-xs text-slate-500">
              Diamonds are decisions · Solid arrows are forward flow · Dashed arrows are loops ·
              Join rails show where paths merge
            </p>
          </div>
          <button
            type="button"
            class="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            title="Close"
            @click="close"
          >
            <X class="h-4 w-4" />
          </button>
        </div>

        <div class="overflow-auto bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_45%)] px-4 py-6">
          <p class="mb-4 text-center text-lg font-bold tracking-wide text-slate-900">
            {{ chartTitle }}
          </p>

          <div v-if="steps.length === 0" class="py-16 text-center text-sm text-slate-500">
            Add steps on the Flow canvas to preview the process diagram.
          </div>

          <div
            v-else
            class="relative mx-auto"
            :style="{ width: `${layout.width}px`, height: `${layout.height}px` }"
          >
            <svg
              class="pointer-events-none absolute inset-0 overflow-visible"
              :width="layout.width"
              :height="layout.height"
              aria-hidden="true"
            >
              <defs>
                <marker
                  id="wf-arrowhead"
                  markerWidth="10"
                  markerHeight="8"
                  refX="9"
                  refY="4"
                  orient="auto"
                >
                  <path d="M 0 0 L 10 4 L 0 8 Z" fill="#7c2d12" />
                </marker>
                <marker
                  id="wf-arrowhead-loop"
                  markerWidth="10"
                  markerHeight="8"
                  refX="9"
                  refY="4"
                  orient="auto"
                >
                  <path d="M 0 0 L 10 4 L 0 8 Z" fill="#b45309" />
                </marker>
              </defs>
              <path
                v-for="edge in layout.edges"
                :key="edge.key"
                :d="edge.path"
                fill="none"
                :stroke="edge.isLoop ? '#b45309' : '#7c2d12'"
                :stroke-width="edge.isLoop ? 1.75 : 2"
                :stroke-dasharray="edge.isLoop ? '6 4' : undefined"
                :marker-end="edge.isLoop ? 'url(#wf-arrowhead-loop)' : 'url(#wf-arrowhead)'"
              />
            </svg>

            <div
              v-for="edge in layout.edges"
              v-show="edge.label"
              :key="`lbl-${edge.key}`"
              class="wf-edge-label"
              :class="{ 'wf-edge-label--loop': edge.isLoop }"
              :style="{ left: `${edge.labelX}px`, top: `${edge.labelY}px` }"
            >
              {{ edge.label }}
            </div>

            <div
              v-for="node in layout.nodes"
              :key="node.key"
              class="wf-abs-node"
              :class="{
                'wf-abs-node--start': node.kind === 'start',
                'wf-abs-node--end': node.kind === 'end',
                'wf-abs-node--process': node.kind === 'process',
                'wf-abs-node--decision': node.kind === 'decision',
                'wf-abs-node--merge': node.isMerge,
              }"
              :title="node.stepId || node.label"
              :style="{
                left: `${node.x}px`,
                top: `${node.y}px`,
                width: `${node.w}px`,
                height: `${node.h}px`,
              }"
            >
              <template v-if="node.kind === 'decision'">
                <div class="wf-diamond-shape" />
                <span class="wf-diamond-text">{{ node.label }}</span>
              </template>
              <template v-else-if="node.kind === 'process'">
                <span v-if="node.isMerge" class="wf-merge-badge">merge</span>
                <span class="wf-process-text">{{ node.label }}</span>
                <span v-if="node.meta" class="wf-process-meta">{{ node.meta }}</span>
              </template>
              <template v-else>
                {{ node.label }}
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.wf-abs-node {
  position: absolute;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  text-align: center;
  box-shadow: 3px 3px 0 rgb(124 45 18 / 18%);
}

.wf-abs-node--start,
.wf-abs-node--end {
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #fff;
  background: #c2410c;
}

.wf-abs-node--process {
  gap: 0.1rem;
  padding: 0.4rem 0.55rem;
  border-radius: 0.15rem;
  color: #fff;
  background: #ea580c;
}

.wf-abs-node--merge {
  outline: 2px solid #0f766e;
  outline-offset: 2px;
}

.wf-merge-badge {
  position: absolute;
  top: -0.55rem;
  right: -0.35rem;
  padding: 0.05rem 0.35rem;
  font-size: 0.55rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #fff;
  background: #0f766e;
  border-radius: 0.15rem;
}

.wf-process-text {
  font-size: 0.7rem;
  font-weight: 600;
  line-height: 1.25;
  word-break: break-word;
}

.wf-process-meta {
  font-size: 0.58rem;
  opacity: 0.9;
}

.wf-abs-node--decision {
  background: transparent;
  box-shadow: none;
}

.wf-diamond-shape {
  position: absolute;
  inset: 17%;
  background: #0f766e;
  box-shadow: 3px 3px 0 rgb(15 23 42 / 16%);
  transform: rotate(45deg);
}

.wf-diamond-text {
  position: relative;
  z-index: 1;
  max-width: 70%;
  padding: 0.15rem;
  font-size: 0.62rem;
  font-weight: 600;
  line-height: 1.2;
  color: #fff;
  word-break: break-word;
}

.wf-edge-label {
  position: absolute;
  z-index: 3;
  max-width: 10rem;
  padding: 0.1rem 0.35rem;
  font-size: 0.6rem;
  font-weight: 700;
  line-height: 1.2;
  color: #7c2d12;
  text-align: center;
  word-break: break-word;
  background: #fff;
  border: 1px solid #fdba74;
  border-radius: 0.15rem;
  transform: translate(-50%, -100%);
  pointer-events: none;
}

.wf-edge-label--loop {
  color: #92400e;
  border-color: #fbbf24;
  transform: translate(-50%, -50%);
}
</style>
