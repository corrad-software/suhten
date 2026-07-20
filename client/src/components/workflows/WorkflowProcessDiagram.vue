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

function stepLabelById(stepId: string) {
  const step = props.steps.find((s) => s.id === stepId);
  return step?.name?.trim() || stepId;
}

function outgoing(stepId: string): ProcessDiagramTransition[] {
  return (props.transitions ?? []).filter((t) => t.from === stepId);
}

function isHuman(step: ProcessDiagramStep) {
  return step.actionKey === "human" || step.actionKey === "human_task" || step.actionKey === "approval";
}

function isCondition(step: ProcessDiagramStep) {
  return step.actionKey === "condition" || step.actionKey === "conditionAi" || step.actionKey === "condition_ai";
}

/** Diamond for condition actions, human gates, or any step with branching transitions. */
function isDecision(step: ProcessDiagramStep) {
  if (isCondition(step) || isHuman(step)) return true;
  return outgoing(step.id).length > 1;
}

function formatCondition(condition?: string | null) {
  if (!condition || !condition.trim()) return "Always";
  const c = condition.trim();
  const m = c.match(/^decision\s*===\s*(.+)$/i);
  if (m) return m[1].trim();
  const m2 = c.match(/^(.+?)\s*===\s*(.+)$/);
  if (m2) return `${m2[1].trim()} = ${m2[2].trim()}`;
  return c;
}

const HAPPY_OUTCOME_RE =
  /(?:^|[^a-z])(paid|confirm|lengkap|lulus|approve|approved|submit|pass|yes|true)(?:$|[^a-z])/i;
const STOP_OUTCOME_RE =
  /(?:^|[^a-z])(decline|ditolak|reject|rejected|expired|withdraw|fail|no|false)(?:$|[^a-z])/i;
const REJECT_SINK_RE = /ditolak|rejected|reject|cancel/;

/**
 * Mark End Here only for reject / stop branches — not happy-path continuation.
 * e.g. decline / ditolak / expired / withdraw → End Here
 *      paid / confirm / lengkap / lulus → continue (no tag)
 *
 * Runtime transitions are unchanged; this is diagram labeling only.
 */
function isEndingBranch(edge: ProcessDiagramTransition): boolean {
  const cond = (edge.condition ?? "").toLowerCase();

  // Happy outcomes always continue (even if the next hop looks like a short chain).
  if (HAPPY_OUTCOME_RE.test(cond)) {
    return false;
  }

  if (STOP_OUTCOME_RE.test(cond)) {
    return true;
  }

  const to = edge.to.toLowerCase();
  if (REJECT_SINK_RE.test(to)) {
    return true;
  }

  // True leaf with no further transitions — only tag reject-like sinks
  const outs = outgoing(edge.to);
  if (outs.length === 0) {
    return REJECT_SINK_RE.test(to);
  }

  // Short reject chain: target → leaf only, and target/leaf looks like reject sink
  if (outs.every((o) => outgoing(o.to).length === 0)) {
    const sink = `${edge.to} ${outs.map((o) => o.to).join(" ")}`.toLowerCase();
    return REJECT_SINK_RE.test(sink);
  }

  return false;
}

/** Next step ids along the transition graph (for "continues" hint). */
function continuationLabels(edge: ProcessDiagramTransition, max = 2): string[] {
  const labels: string[] = [];
  let current = edge.to;
  const seen = new Set<string>();
  while (labels.length < max && !seen.has(current)) {
    seen.add(current);
    const outs = outgoing(current);
    if (outs.length !== 1) break;
    current = outs[0].to;
    labels.push(stepLabelById(current));
  }
  return labels;
}

const chartTitle = computed(() => (props.title.trim() || "Workflow process").toUpperCase());
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
        class="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl"
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
              Diamonds are decision / human gates with outgoing conditions
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

        <div class="overflow-auto bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_40%)] px-6 py-8">
          <p class="mb-8 text-center text-lg font-bold tracking-wide text-slate-900">
            {{ chartTitle }}
          </p>

          <div v-if="steps.length === 0" class="py-16 text-center text-sm text-slate-500">
            Add steps on the Flow canvas to preview the process diagram.
          </div>

          <div v-else class="mx-auto flex w-full max-w-2xl flex-col items-center">
            <div class="wf-node wf-node--terminal">
              Start
            </div>
            <div class="wf-connector" aria-hidden="true">
              <span class="wf-arrow" />
            </div>

            <template v-for="(step, index) in steps" :key="step.id + '-' + index">
              <!-- Decision diamond -->
              <div v-if="isDecision(step)" class="wf-decision-block">
                <div class="wf-diamond" :title="step.id">
                  <span class="wf-diamond__label">{{ labelFor(step) }}</span>
                </div>

                <div v-if="outgoing(step.id).length" class="wf-branches">
                  <div
                    v-for="(edge, ei) in outgoing(step.id)"
                    :key="`${edge.from}-${edge.to}-${ei}`"
                    class="wf-branch"
                  >
                    <div class="wf-branch__stem" aria-hidden="true" />
                    <div class="wf-branch__label">{{ formatCondition(edge.condition) }}</div>
                    <div class="wf-branch__target">
                      <span class="wf-branch__to">{{ stepLabelById(edge.to) }}</span>
                    </div>
                    <div v-if="isEndingBranch(edge)" class="wf-branch__end-here">
                      End Here
                    </div>
                    <div
                      v-else-if="continuationLabels(edge).length"
                      class="wf-branch__continues"
                    >
                      → {{ continuationLabels(edge).join(" → ") }}
                    </div>
                  </div>
                </div>
                <div v-else class="wf-branches wf-branches--empty">
                  <span class="text-xs font-medium text-amber-700">No outgoing transitions</span>
                </div>
              </div>

              <!-- Process rectangle -->
              <div v-else class="wf-node wf-node--process" :title="step.id">
                <span class="wf-node__index">{{ index + 1 }}</span>
                <span class="wf-node__text">{{ labelFor(step) }}</span>
                <span class="wf-node__meta">{{ actionLabel?.(step.actionKey) || step.actionKey }}</span>
              </div>

              <div
                v-if="index < steps.length - 1"
                class="wf-connector"
                aria-hidden="true"
              >
                <span class="wf-arrow" />
              </div>
            </template>

            <div class="wf-connector" aria-hidden="true">
              <span class="wf-arrow" />
            </div>

            <div class="wf-node wf-node--terminal">
              End
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.wf-node {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 11rem;
  max-width: 18rem;
  padding: 0.7rem 1.1rem;
  text-align: center;
  color: #fff;
  background: #2563eb;
  box-shadow: 0 1px 2px rgb(15 23 42 / 12%);
}

.wf-node--terminal {
  min-width: 9rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  background: #1d4ed8;
}

.wf-node--process {
  border-radius: 0.35rem;
  gap: 0.15rem;
}

.wf-node__index {
  position: absolute;
  top: 0.35rem;
  left: 0.45rem;
  font-size: 0.6rem;
  font-weight: 700;
  opacity: 0.75;
}

.wf-node__text {
  font-size: 0.8rem;
  font-weight: 600;
  line-height: 1.25;
  word-break: break-word;
}

.wf-node__meta {
  margin-top: 0.15rem;
  font-size: 0.65rem;
  opacity: 0.85;
}

.wf-connector {
  position: relative;
  width: 2px;
  height: 1.75rem;
  background: #334155;
}

.wf-arrow {
  position: absolute;
  bottom: -1px;
  left: 50%;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 7px solid #334155;
  transform: translateX(-50%);
}

.wf-decision-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 0.25rem 0;
}

.wf-diamond {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 8rem;
  height: 8rem;
  background: #0f766e;
  box-shadow: 0 1px 3px rgb(15 23 42 / 18%);
  transform: rotate(45deg);
}

.wf-diamond__label {
  max-width: 6rem;
  padding: 0.25rem;
  font-size: 0.68rem;
  font-weight: 600;
  line-height: 1.2;
  color: #fff;
  text-align: center;
  word-break: break-word;
  transform: rotate(-45deg);
}

.wf-branches {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(8.5rem, 1fr));
  gap: 0.65rem;
  width: 100%;
  max-width: 36rem;
  margin-top: 1.25rem;
  padding: 0.75rem;
  border: 1px dashed #cbd5e1;
  border-radius: 0.5rem;
  background: #f8fafc;
}

.wf-branches--empty {
  display: flex;
  justify-content: center;
  margin-top: 0.85rem;
}

.wf-branch {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.wf-branch__stem {
  width: 2px;
  height: 0.85rem;
  margin-bottom: 0.25rem;
  background: #64748b;
}

.wf-branch__label {
  max-width: 100%;
  padding: 0.2rem 0.55rem;
  font-size: 0.65rem;
  font-weight: 700;
  color: #0f766e;
  letter-spacing: 0.01em;
  text-transform: lowercase;
  background: #ccfbf1;
  border: 1px solid #99f6e4;
  border-radius: 999px;
}

.wf-branch__target {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  margin-top: 0.4rem;
  width: 100%;
  padding: 0.45rem 0.5rem;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 0.35rem;
  box-shadow: 0 1px 1px rgb(15 23 42 / 6%);
}

.wf-branch__to {
  font-size: 0.68rem;
  font-weight: 600;
  line-height: 1.25;
  color: #1e293b;
  word-break: break-word;
}

.wf-branch__end-here {
  display: inline-block;
  margin-top: 0.45rem;
  padding: 0.28rem 0.65rem;
  font-size: 0.72rem;
  font-weight: 700;
  line-height: 1.2;
  color: #dc2626;
  letter-spacing: 0.01em;
  background: #fff;
  border: 2px solid #ef4444;
  border-radius: 0.2rem;
}

.wf-branch__continues {
  margin-top: 0.4rem;
  max-width: 100%;
  padding: 0.2rem 0.45rem;
  font-size: 0.62rem;
  font-weight: 600;
  line-height: 1.3;
  color: #1d4ed8;
  word-break: break-word;
}
</style>
