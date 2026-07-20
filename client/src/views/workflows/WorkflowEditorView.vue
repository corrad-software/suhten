<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  ArrowRight,
  Clock,
  GitBranch,
  GripVertical,
  Mail,
  Network,
  Save,
  Search,
  ShieldQuestion,
  Sparkles,
  Terminal,
  Trash2,
  UserCheck,
  X,
  Globe,
} from "lucide-vue-next";
import type { Component } from "vue";

import AdminLayout from "@/layouts/AdminLayout.vue";
import WorkflowProcessDiagram from "@/components/workflows/WorkflowProcessDiagram.vue";
import {
  actionToKey,
  createWorkflow,
  fetchWorkflowCatalog,
  getWorkflow,
  translateWorkflowCondition,
  updateWorkflow,
  type WorkflowActionDef,
  type WorkflowStepInput,
  type WorkflowTransitionInput,
} from "@/api/workflows";
import { useToast } from "@/composables/useToast";

const route = useRoute();
const router = useRouter();
const toast = useToast();

const id = computed(() => Number(route.params.id || 0));
const isEdit = computed(() => id.value > 0);

const catalog = ref<WorkflowActionDef[]>([]);
const name = ref("");
const slug = ref("");
const version = ref("1.0");
const description = ref("");
const isActive = ref(true);
const saving = ref(false);
const translating = ref(false);
const selectedIndex = ref<number | null>(null);
const dropIndex = ref<number | null>(null);
const draggingFrom = ref<"palette" | "canvas" | null>(null);
const paletteFilter = ref("");
const showProcessView = ref(false);
const transitions = ref<WorkflowTransitionInput[]>([]);

type CanvasStep = WorkflowStepInput & { uid: string };

const canvasSteps = ref<CanvasStep[]>([]);

let uidSeq = 0;
function nextUid() {
  return `uid-${Date.now()}-${++uidSeq}`;
}

const ACTION_ICONS: Record<string, Component> = {
  log: Terminal,
  delay: Clock,
  email: Mail,
  http: Globe,
  human: UserCheck,
  human_task: UserCheck,
  approval: UserCheck,
  condition: ShieldQuestion,
  condition_ai: Sparkles,
  conditionAi: Sparkles,
};

function iconFor(actionKey: string) {
  return ACTION_ICONS[actionKey] ?? GitBranch;
}

function fieldDefsFor(actionKey: string) {
  return catalog.value.find((a) => a.key === actionKey)?.fields ?? [];
}

function actionLabel(actionKey: string) {
  return catalog.value.find((a) => a.key === actionKey)?.label ?? actionKey;
}

function actionDescription(actionKey: string) {
  return catalog.value.find((a) => a.key === actionKey)?.description ?? "";
}

const filteredCatalog = computed(() => {
  const q = paletteFilter.value.trim().toLowerCase();
  if (!q) return catalog.value;
  return catalog.value.filter(
    (a) =>
      a.label.toLowerCase().includes(q) ||
      a.key.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q),
  );
});

const selectedStep = computed(() =>
  selectedIndex.value === null ? null : canvasSteps.value[selectedIndex.value] ?? null,
);

function isHumanAction(actionKey: string) {
  return actionKey === "human" || actionKey === "human_task" || actionKey === "approval";
}

function stepLabelById(stepId: string) {
  const step = canvasSteps.value.find((s) => s.id === stepId);
  return step?.name?.trim() || stepId;
}

function outgoingTransitions(stepId: string): WorkflowTransitionInput[] {
  return transitions.value.filter((t) => t.from === stepId);
}

function hasOutgoing(stepId: string) {
  return outgoingTransitions(stepId).length > 0;
}

function isTerminalStep(stepId: string) {
  return !hasOutgoing(stepId);
}

function formatCondition(condition?: string | null) {
  if (!condition || !condition.trim()) return "Always";
  const c = condition.trim();
  const m = c.match(/^decision\s*===\s*(.+)$/i);
  if (m) return `If outcome = ${m[1].trim()}`;
  const m2 = c.match(/^(.+?)\s*===\s*(.+)$/);
  if (m2) return `If ${m2[1].trim()} = ${m2[2].trim()}`;
  return c;
}

function targetHint(toStepId: string) {
  if (isTerminalStep(toStepId)) return "ends path";
  return null;
}

const selectedOutgoing = computed(() =>
  selectedStep.value ? outgoingTransitions(selectedStep.value.id) : [],
);

function defaultSlaForAction(actionKey: string): number | null {
  // Match Piagam defaults used by the ST inbox mock (charter.ts).
  if (actionKey === "human" || actionKey === "human_task" || actionKey === "approval") return 4;
  return null;
}

function createStepFromAction(actionKey: string, atIndex?: number): CanvasStep {
  const n = canvasSteps.value.length + 1;
  const defaults: Record<string, unknown> = {};
  for (const field of fieldDefsFor(actionKey)) {
    if (field.default !== undefined) defaults[field.key] = field.default;
  }
  const step: CanvasStep = {
    uid: nextUid(),
    id: `step-${n}`,
    name: actionLabel(actionKey),
    actionKey,
    slaTargetHours: defaultSlaForAction(actionKey),
    parameters: defaults,
  };
  if (atIndex === undefined || atIndex < 0 || atIndex > canvasSteps.value.length) {
    canvasSteps.value.push(step);
    selectedIndex.value = canvasSteps.value.length - 1;
  } else {
    canvasSteps.value.splice(atIndex, 0, step);
    selectedIndex.value = atIndex;
  }
  renumberStepIds();
  return step;
}

function renumberStepIds() {
  canvasSteps.value.forEach((s, i) => {
    if (!s.id.trim() || /^step-\d+$/.test(s.id)) {
      s.id = `step-${i + 1}`;
    }
  });
}

function removeStep(index: number) {
  canvasSteps.value.splice(index, 1);
  if (selectedIndex.value === index) selectedIndex.value = null;
  else if (selectedIndex.value !== null && selectedIndex.value > index) {
    selectedIndex.value -= 1;
  }
  renumberStepIds();
}

function onActionChange(step: CanvasStep) {
  const defaults: Record<string, unknown> = {};
  for (const field of fieldDefsFor(step.actionKey)) {
    if (field.default !== undefined) defaults[field.key] = field.default;
  }
  step.parameters = defaults;
  if (step.slaTargetHours == null) {
    step.slaTargetHours = defaultSlaForAction(step.actionKey);
  }
  if (!step.name || catalog.value.some((a) => a.label === step.name)) {
    step.name = actionLabel(step.actionKey);
  }
}

function slaInputValue(step: WorkflowStepInput): string {
  return step.slaTargetHours == null || Number.isNaN(step.slaTargetHours) ? "" : String(step.slaTargetHours);
}

function setSlaTargetHours(step: WorkflowStepInput, raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) {
    step.slaTargetHours = null;
    return;
  }
  const n = Number(trimmed);
  step.slaTargetHours = Number.isFinite(n) && n >= 1 ? Math.floor(n) : null;
}

/** Prefer first-class step SLA; fall back to legacy parameters.sla_hours from older definitions. */
function resolveStepSla(step: {
  slaTargetHours?: number | null;
  sla_target_hours?: number | null;
  parameters?: Record<string, unknown> | null;
}): number | null {
  const top = step.slaTargetHours ?? step.sla_target_hours;
  if (typeof top === "number" && top >= 1) {
    return Math.floor(top);
  }
  const params = step.parameters ?? {};
  const raw = params.slaHours ?? params.sla_hours;
  if (typeof raw === "number" && raw >= 1) return Math.floor(raw);
  if (typeof raw === "string" && raw.trim() !== "") {
    const n = Number(raw);
    if (Number.isFinite(n) && n >= 1) return Math.floor(n);
  }
  return null;
}

function toCamelKey(key: string): string {
  return key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
}

function toSnakeKey(key: string): string {
  return key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}

/** Resolve param key across CamelCaseMiddleware round-trips (snake ↔ camel). */
function resolveParamKey(step: WorkflowStepInput, key: string): string {
  const params = step.parameters;
  if (params && key in params) return key;
  const camel = toCamelKey(key);
  if (params && camel in params) return camel;
  const snake = toSnakeKey(key);
  if (params && snake in params) return snake;
  return key;
}

function paramValue(step: WorkflowStepInput, key: string): string {
  const resolved = resolveParamKey(step, key);
  const value = step.parameters?.[resolved];
  return value === undefined || value === null ? "" : String(value);
}

function setParam(step: WorkflowStepInput, key: string, value: string, type: string) {
  if (!step.parameters) step.parameters = {};
  const resolved = resolveParamKey(step, key);
  // Drop the alternate casing so we don't keep duplicates after a round-trip.
  const camel = toCamelKey(key);
  const snake = toSnakeKey(key);
  if (resolved !== camel && camel in step.parameters) delete step.parameters[camel];
  if (resolved !== snake && snake in step.parameters) delete step.parameters[snake];
  step.parameters[resolved] = type === "number" ? Number(value) : value;
}

function isConditionAi(actionKey: string) {
  return actionKey === "conditionAi" || actionKey === "condition_ai";
}

async function translateSelectedCondition() {
  const step = selectedStep.value;
  if (!step || !isConditionAi(step.actionKey)) return;

  const naturalLanguage = paramValue(step, "natural_language").trim();
  if (naturalLanguage.length < 3) {
    toast.error("Validation", "Enter a natural-language condition (at least 3 characters).");
    return;
  }

  translating.value = true;
  try {
    const res = await translateWorkflowCondition(naturalLanguage);
    setParam(step, "condition", res.data.condition, "text");
    toast.success("Translated", "Condition expression updated.");
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to translate condition.";
    toast.error("Translation failed", message);
  } finally {
    translating.value = false;
  }
}

function onPaletteDragStart(e: DragEvent, actionKey: string) {
  draggingFrom.value = "palette";
  e.dataTransfer?.setData("application/x-wf-action", actionKey);
  e.dataTransfer?.setData("text/plain", actionKey);
  if (e.dataTransfer) e.dataTransfer.effectAllowed = "copy";
}

function onCanvasStepDragStart(e: DragEvent, index: number) {
  draggingFrom.value = "canvas";
  e.dataTransfer?.setData("application/x-wf-step-index", String(index));
  e.dataTransfer?.setData("text/plain", String(index));
  if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
}

function onDragEnd() {
  draggingFrom.value = null;
  dropIndex.value = null;
}

function resolveDropIndex(e: DragEvent, index: number): number {
  const el = e.currentTarget as HTMLElement | null;
  if (!el) return index;
  const rect = el.getBoundingClientRect();
  const mid = rect.top + rect.height / 2;
  return e.clientY < mid ? index : index + 1;
}

function onStepDragOver(e: DragEvent, index: number) {
  e.preventDefault();
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = draggingFrom.value === "palette" ? "copy" : "move";
  }
  dropIndex.value = resolveDropIndex(e, index);
}

function onCanvasDragOver(e: DragEvent) {
  e.preventDefault();
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = draggingFrom.value === "palette" ? "copy" : "move";
  }
  if (canvasSteps.value.length === 0) dropIndex.value = 0;
}

function onCanvasDrop(e: DragEvent) {
  e.preventDefault();
  const at = dropIndex.value ?? canvasSteps.value.length;
  applyDrop(e, at);
}

function onStepDrop(e: DragEvent, index: number) {
  e.preventDefault();
  e.stopPropagation();
  const at = resolveDropIndex(e, index);
  applyDrop(e, at);
}

function applyDrop(e: DragEvent, at: number) {
  const actionKey = e.dataTransfer?.getData("application/x-wf-action");
  const fromIndexRaw = e.dataTransfer?.getData("application/x-wf-step-index");

  if (actionKey) {
    createStepFromAction(actionKey, at);
  } else if (fromIndexRaw !== undefined && fromIndexRaw !== "") {
    const from = Number(fromIndexRaw);
    if (!Number.isNaN(from) && from >= 0 && from < canvasSteps.value.length) {
      let insertAt = at;
      if (from < insertAt) insertAt -= 1;
      const [moved] = canvasSteps.value.splice(from, 1);
      canvasSteps.value.splice(insertAt, 0, moved);
      selectedIndex.value = insertAt;
      renumberStepIds();
    }
  }

  dropIndex.value = null;
  draggingFrom.value = null;
}

async function load() {
  const catalogRes = await fetchWorkflowCatalog();
  catalog.value = catalogRes.data.actions;

  if (!isEdit.value) {
    canvasSteps.value = [];
    transitions.value = [];
    return;
  }

  const response = await getWorkflow(id.value);
  const wf = response.data;
  name.value = wf.name;
  slug.value = wf.slug;
  version.value = wf.version;
  description.value = wf.description || "";
  isActive.value = wf.isActive;
  canvasSteps.value = (wf.definition?.steps ?? []).map((s) => {
    const parameters = { ...(s.parameters ?? {}) };
    // Drop legacy param so Step settings shows a single SLA control.
    delete parameters.slaHours;
    delete parameters.sla_hours;
    return {
      uid: nextUid(),
      id: s.id,
      name: s.name || s.id,
      actionKey: actionToKey(s.action, catalog.value, s.parameters),
      slaTargetHours: resolveStepSla(s),
      parameters,
    };
  });
  transitions.value = (wf.definition?.transitions ?? []).map((t) => ({
    from: t.from,
    to: t.to,
    condition: t.condition,
  }));
  selectedIndex.value = canvasSteps.value.length ? 0 : null;
}

async function save() {
  if (!name.value.trim()) {
    toast.error("Validation", "Name is required.");
    return;
  }
  if (canvasSteps.value.length === 0) {
    toast.error("Validation", "Drag at least one action onto the canvas.");
    return;
  }

  const payload = {
    name: name.value.trim(),
    slug: slug.value.trim() || undefined,
    version: version.value.trim() || "1.0",
    description: description.value.trim() || undefined,
    isActive: isActive.value,
    steps: canvasSteps.value.map((s) => ({
      id: s.id.trim(),
      name: s.name?.trim() || s.id,
      actionKey: s.actionKey,
      slaTargetHours: s.slaTargetHours ?? null,
      parameters: s.parameters ?? {},
    })),
    transitions: transitions.value.map((t) => ({
      from: t.from,
      to: t.to,
      ...(t.condition ? { condition: t.condition } : {}),
    })),
  };

  saving.value = true;
  try {
    if (isEdit.value) {
      await updateWorkflow(id.value, payload);
      toast.success("Workflow updated");
    } else {
      await createWorkflow(payload);
      toast.success("Workflow created");
    }
    router.push("/admin/workflows");
  } catch (e) {
    toast.error("Save failed", e instanceof Error ? e.message : "Unable to save workflow.");
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  try {
    await load();
  } catch (e) {
    toast.error("Load failed", e instanceof Error ? e.message : "Unable to load workflow.");
  }
});
</script>

<template>
  <AdminLayout>
    <div class="mx-auto max-w-7xl space-y-4">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 class="page-title">{{ isEdit ? "Edit Workflow" : "New Workflow" }}</h1>
          <p class="mt-1 text-sm text-slate-500">
            Drag actions from the palette onto the canvas. Select a step to view outgoing transitions in Step settings.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button
            class="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 shadow-xs hover:bg-slate-50"
            @click="router.push('/admin/workflows')"
          >
            <X class="h-4 w-4" />
            Cancel
          </button>
          <button
            class="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-slate-800 disabled:opacity-60"
            :disabled="saving"
            @click="save"
          >
            <Save class="h-4 w-4" />
            {{ saving ? "Saving…" : isEdit ? "Update" : "Create" }}
          </button>
        </div>
      </div>

      <article class="rounded-lg border border-slate-200 bg-white shadow-xs">
        <div class="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
          <GitBranch class="h-4 w-4 text-teal-700" />
          <h2 class="text-sm font-semibold text-slate-900">Details</h2>
        </div>
        <div class="space-y-3 p-4">
          <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div class="space-y-1.5 lg:col-span-1">
              <label class="text-sm font-medium text-slate-700">Name</label>
              <input
                v-model="name"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-xs focus:border-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-200"
                placeholder="User Onboarding"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-slate-700">Slug</label>
              <input
                v-model="slug"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-xs focus:border-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-200"
                placeholder="auto-from-name"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-slate-700">Version</label>
              <input
                v-model="version"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-xs focus:border-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-200"
              />
            </div>
            <div class="flex items-end gap-2 pb-1">
              <label class="flex items-center gap-2 text-sm text-slate-700">
                <input v-model="isActive" type="checkbox" class="rounded border-slate-300" />
                Active
              </label>
            </div>
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-slate-700">Description</label>
            <textarea
              v-model="description"
              rows="2"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-xs focus:border-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-200"
              placeholder="What this workflow does…"
            />
          </div>
        </div>
      </article>

      <div class="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)_300px]">
        <aside class="rounded-lg border border-slate-200 bg-white shadow-xs">
          <div class="border-b border-slate-100 px-3 py-2.5">
            <h2 class="text-sm font-semibold text-slate-900">Action palette</h2>
            <p class="mt-0.5 text-xs text-slate-500">Drag onto the canvas</p>
          </div>
          <div class="border-b border-slate-100 p-2">
            <div class="relative">
              <Search class="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                v-model="paletteFilter"
                placeholder="Filter actions…"
                class="w-full rounded-md border border-slate-300 py-1.5 pl-8 pr-2 text-xs shadow-xs focus:border-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>
          <ul class="space-y-2 p-2">
            <li
              v-for="action in filteredCatalog"
              :key="action.key"
              draggable="true"
              class="cursor-grab rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 transition hover:border-teal-300 hover:bg-teal-50/40 active:cursor-grabbing"
              @dragstart="onPaletteDragStart($event, action.key)"
              @dragend="onDragEnd"
            >
              <div class="flex items-start gap-2">
                <component :is="iconFor(action.key)" class="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                <div class="min-w-0">
                  <p class="text-sm font-medium text-slate-900">{{ action.label }}</p>
                  <p class="mt-0.5 text-xs leading-snug text-slate-500">{{ action.description }}</p>
                </div>
              </div>
            </li>
            <li v-if="filteredCatalog.length === 0" class="px-2 py-6 text-center text-xs text-slate-500">
              No matching actions
            </li>
          </ul>
        </aside>

        <section
          class="min-h-[420px] rounded-lg border border-dashed border-slate-300 bg-slate-50/80 shadow-xs"
          :class="draggingFrom ? 'border-teal-400 bg-teal-50/30' : ''"
          @dragover="onCanvasDragOver"
          @drop="onCanvasDrop"
          @dragleave="dropIndex = null"
        >
          <div class="flex items-center justify-between border-b border-slate-200/80 bg-white/70 px-4 py-2.5">
            <h2 class="text-sm font-semibold text-slate-900">Flow canvas</h2>
            <div class="flex items-center gap-2">
              <span class="text-xs text-slate-500">{{ canvasSteps.length }} step{{ canvasSteps.length === 1 ? "" : "s" }}</span>
              <button
                type="button"
                class="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                title="View process diagram"
                :disabled="canvasSteps.length === 0"
                @click="showProcessView = true"
              >
                <Network class="h-4 w-4" />
              </button>
            </div>
          </div>

          <div class="p-4">
            <div
              v-if="canvasSteps.length === 0"
              class="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white/60 px-6 py-16 text-center"
            >
              <GitBranch class="mb-3 h-8 w-8 text-slate-300" />
              <p class="text-sm font-medium text-slate-700">Drop an action here to start</p>
              <p class="mt-1 text-xs text-slate-500">Drag from the left palette</p>
            </div>

            <div v-else class="mx-auto flex max-w-xl flex-col items-stretch">
              <template v-for="(step, index) in canvasSteps" :key="step.uid">
                <div
                  v-show="dropIndex === index"
                  class="mb-1 h-1.5 rounded-full bg-teal-500 shadow-[0_0_0_3px_rgba(20,184,166,0.2)]"
                />

                <div
                  draggable="true"
                  class="group relative rounded-lg border bg-white p-3 shadow-xs transition"
                  :class="
                    selectedIndex === index
                      ? 'border-teal-500 ring-2 ring-teal-200'
                      : 'border-slate-200 hover:border-slate-300'
                  "
                  @click="selectedIndex = index"
                  @dragstart="onCanvasStepDragStart($event, index)"
                  @dragend="onDragEnd"
                  @dragover="onStepDragOver($event, index)"
                  @drop="onStepDrop($event, index)"
                >
                  <div class="flex items-start gap-2">
                    <button
                      type="button"
                      class="mt-0.5 cursor-grab rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 active:cursor-grabbing"
                      title="Drag to reorder"
                      @click.stop
                    >
                      <GripVertical class="h-4 w-4" />
                    </button>
                    <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-teal-50 text-teal-800">
                      <component :is="iconFor(step.actionKey)" class="h-4 w-4" />
                    </div>
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center gap-2">
                        <span class="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                          {{ index + 1 }}
                        </span>
                        <p class="truncate text-sm font-semibold text-slate-900">
                          {{ step.name || actionLabel(step.actionKey) }}
                        </p>
                      </div>
                      <p class="mt-0.5 truncate text-xs text-slate-500">
                        {{ actionLabel(step.actionKey) }} · {{ step.id }}
                      </p>
                    </div>
                    <span
                      v-if="step.slaTargetHours"
                      class="shrink-0 rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800"
                      :title="`SLA ${step.slaTargetHours}h`"
                    >
                      {{ step.slaTargetHours }}j
                    </span>
                    <button
                      type="button"
                      class="rounded p-1.5 text-slate-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                      title="Remove step"
                      @click.stop="removeStep(index)"
                    >
                      <Trash2 class="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div
                  v-if="index < canvasSteps.length - 1"
                  class="mx-auto h-6 w-px bg-slate-300"
                  aria-hidden="true"
                />
              </template>

              <div
                v-show="dropIndex === canvasSteps.length"
                class="mt-1 h-1.5 rounded-full bg-teal-500 shadow-[0_0_0_3px_rgba(20,184,166,0.2)]"
              />
            </div>
          </div>
        </section>

        <aside class="rounded-lg border border-slate-200 bg-white shadow-xs">
          <div class="border-b border-slate-100 px-3 py-2.5">
            <h2 class="text-sm font-semibold text-slate-900">Step settings</h2>
            <p class="mt-0.5 text-xs text-slate-500">Select a step on the canvas</p>
          </div>

          <div v-if="!selectedStep" class="px-4 py-12 text-center text-sm text-slate-500">
            No step selected
          </div>

          <div v-else class="space-y-3 p-3">
            <div class="rounded-md bg-slate-50 px-2.5 py-2 text-xs text-slate-600">
              {{ actionDescription(selectedStep.actionKey) }}
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-medium text-slate-600">Step ID</label>
              <input
                v-model="selectedStep.id"
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-200"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-medium text-slate-600">Label</label>
              <input
                v-model="selectedStep.name"
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-200"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-medium text-slate-600">Action</label>
              <select
                v-model="selectedStep.actionKey"
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-200"
                @change="selectedStep && onActionChange(selectedStep)"
              >
                <option v-for="action in catalog" :key="action.key" :value="action.key">
                  {{ action.label }}
                </option>
              </select>
            </div>

            <div class="space-y-2 border-t border-slate-100 pt-3">
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">SLA</p>
              <p class="text-[11px] leading-relaxed text-slate-500">
                Piagam Pelanggan target for this step. Stored on the workflow definition; inbox countdown wiring
                will use this later.
              </p>
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-slate-600">Target hours</label>
                <input
                  class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-200"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="e.g. 4"
                  :value="slaInputValue(selectedStep)"
                  @input="setSlaTargetHours(selectedStep, ($event.target as HTMLInputElement).value)"
                />
              </div>
              <p v-if="selectedStep.slaTargetHours" class="text-[11px] text-slate-400">
                ≈ {{ (selectedStep.slaTargetHours / 24).toFixed(selectedStep.slaTargetHours % 24 === 0 ? 0 : 1) }} day(s)
              </p>
            </div>

            <div
              v-if="fieldDefsFor(selectedStep.actionKey).length"
              class="space-y-3 border-t border-slate-100 pt-3"
            >
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Parameters</p>
              <div
                v-for="field in fieldDefsFor(selectedStep.actionKey)"
                :key="field.key"
                class="space-y-1.5"
              >
                <label class="text-xs font-medium text-slate-600">
                  {{ field.label }}
                  <span v-if="field.required" class="text-red-500">*</span>
                </label>
                <select
                  v-if="field.type === 'select'"
                  class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-200"
                  :value="paramValue(selectedStep, field.key)"
                  @change="setParam(selectedStep, field.key, ($event.target as HTMLSelectElement).value, field.type)"
                >
                  <option v-for="opt in field.options ?? []" :key="opt" :value="opt">{{ opt }}</option>
                </select>
                <textarea
                  v-else-if="field.type === 'textarea'"
                  rows="3"
                  class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-200"
                  :placeholder="field.placeholder"
                  :value="paramValue(selectedStep, field.key)"
                  @input="setParam(selectedStep, field.key, ($event.target as HTMLTextAreaElement).value, field.type)"
                />
                <input
                  v-else
                  class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-200"
                  :type="field.type === 'number' ? 'number' : 'text'"
                  :placeholder="field.placeholder"
                  :value="paramValue(selectedStep, field.key)"
                  @input="setParam(selectedStep, field.key, ($event.target as HTMLInputElement).value, field.type)"
                />
                <button
                  v-if="isConditionAi(selectedStep.actionKey) && (field.key === 'naturalLanguage' || field.key === 'natural_language')"
                  type="button"
                  class="flex w-full items-center justify-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-medium text-teal-800 hover:bg-teal-100 disabled:cursor-not-allowed disabled:opacity-50"
                  :disabled="translating"
                  @click="translateSelectedCondition"
                >
                  <Sparkles class="h-4 w-4" />
                  {{ translating ? "Translating…" : "Translate with AI" }}
                </button>
              </div>
            </div>

            <div
              v-if="isHumanAction(selectedStep.actionKey) || selectedOutgoing.length"
              class="space-y-2 border-t border-slate-100 pt-3"
            >
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Outgoing transitions
              </p>
              <p class="text-[11px] leading-relaxed text-slate-500">
                After this step completes, the engine follows matching conditions. A target with no further
                transitions ends that path.
              </p>
              <div v-if="!selectedOutgoing.length" class="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-2 text-xs text-amber-800">
                No outgoing transitions defined — workflow stops after this step.
              </div>
              <ul v-else class="space-y-2">
                <li
                  v-for="(edge, ei) in selectedOutgoing"
                  :key="`out-${edge.from}-${edge.to}-${ei}`"
                  class="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2"
                >
                  <p class="text-xs font-semibold text-slate-800">{{ formatCondition(edge.condition) }}</p>
                  <p class="mt-1 flex items-start gap-1 text-xs text-slate-600">
                    <ArrowRight class="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-600" />
                    <span>
                      <span class="font-medium text-slate-800">{{ stepLabelById(edge.to) }}</span>
                      <span class="text-slate-400"> · {{ edge.to }}</span>
                      <span v-if="targetHint(edge.to)" class="ml-1 font-medium text-amber-700">
                        ({{ targetHint(edge.to) }})
                      </span>
                    </span>
                  </p>
                </li>
              </ul>
            </div>

            <button
              type="button"
              class="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              @click="selectedIndex !== null && removeStep(selectedIndex)"
            >
              <Trash2 class="h-4 w-4" />
              Remove step
            </button>
          </div>
        </aside>
      </div>
    </div>

    <WorkflowProcessDiagram
      v-model:open="showProcessView"
      :title="name || 'Workflow process'"
      :steps="canvasSteps"
      :transitions="transitions"
      :action-label="actionLabel"
    />
  </AdminLayout>
</template>
