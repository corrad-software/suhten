<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  Ban,
  ExternalLink,
  GitBranch,
  ListOrdered,
  RefreshCw,
} from "lucide-vue-next";

import AdminLayout from "@/layouts/AdminLayout.vue";
import {
  cancelWorkflowInstance,
  listWorkflowInstances,
  resumeWorkflowInstance,
  type WorkflowInstanceRow,
} from "@/api/workflows";
import { useConfirmDialog } from "@/composables/useConfirmDialog";
import { useToast } from "@/composables/useToast";
import {
  REGISTRATION_MODULES,
  type RegistrationModuleCode,
} from "@/st/registration/modules";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const confirmDialog = useConfirmDialog();
const rows = ref<WorkflowInstanceRow[]>([]);
const loading = ref(false);

const highlightId = computed(() => {
  const q = route.query.id;
  return typeof q === "string" && q.length > 0 ? q : "";
});

function applicationHref(row: WorkflowInstanceRow): string | null {
  const code = row.applicationCode;
  const moduleCode = row.moduleCode;
  if (!code || !moduleCode) return null;
  if (!(moduleCode in REGISTRATION_MODULES)) return null;
  const mod = REGISTRATION_MODULES[moduleCode as RegistrationModuleCode];
  return `/admin${mod.basePath}/applications/${encodeURIComponent(code)}`;
}

async function load() {
  loading.value = true;
  try {
    const response = await listWorkflowInstances("?limit=100");
    rows.value = response.data;
    await nextTick();
    scrollToHighlight();
  } catch (e) {
    toast.error("Load failed", e instanceof Error ? e.message : "Unable to load instances.");
  } finally {
    loading.value = false;
  }
}

function scrollToHighlight() {
  if (!highlightId.value) return;
  const el = document.getElementById(`wf-instance-${highlightId.value}`);
  el?.scrollIntoView({ behavior: "smooth", block: "center" });
}

async function cancel(row: WorkflowInstanceRow) {
  const allowed = await confirmDialog.confirm({
    title: "Cancel instance?",
    message: `Cancel workflow instance ${row.id}?`,
    confirmText: "Cancel instance",
    destructive: true,
  });
  if (!allowed) return;
  try {
    await cancelWorkflowInstance(row.id, "Cancelled from workflow admin");
    toast.success("Instance cancelled");
    await load();
  } catch (e) {
    toast.error("Cancel failed", e instanceof Error ? e.message : "Unable to cancel.");
  }
}

async function resume(row: WorkflowInstanceRow) {
  try {
    await resumeWorkflowInstance(row.id);
    toast.success("Instance resumed");
    await load();
  } catch (e) {
    toast.error("Resume failed", e instanceof Error ? e.message : "Unable to resume.");
  }
}

function stateClass(state: string) {
  const s = state.toLowerCase();
  if (s === "completed") return "bg-emerald-50 text-emerald-700";
  if (s === "failed") return "bg-red-50 text-red-700";
  if (s === "cancelled") return "bg-slate-100 text-slate-600";
  if (s === "running" || s === "pending") return "bg-sky-50 text-sky-700";
  if (s === "paused" || s === "waiting") return "bg-amber-50 text-amber-800";
  return "bg-slate-100 text-slate-700";
}

watch(highlightId, () => {
  nextTick(scrollToHighlight);
});

onMounted(load);
</script>

<template>
  <AdminLayout>
    <div class="mx-auto max-w-7xl space-y-4">
      <div class="flex items-center justify-between gap-3">
        <div>
          <h1 class="page-title">Workflow Instances</h1>
          <p class="mt-1 text-sm text-slate-500">
            Runtime runs from registration submissions and test starts.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button
            class="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-xs hover:bg-slate-50"
            @click="load"
          >
            <RefreshCw class="h-4 w-4" />
            Refresh
          </button>
          <button
            class="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-1.5 text-sm font-medium text-white shadow-xs hover:bg-slate-800"
            @click="router.push('/admin/workflows')"
          >
            <GitBranch class="h-4 w-4" />
            Definitions
          </button>
        </div>
      </div>

      <article class="rounded-lg border border-slate-200 bg-white shadow-xs">
        <div class="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
          <ListOrdered class="h-4 w-4 text-teal-700" />
          <h2 class="text-sm font-semibold text-slate-900">Recent instances</h2>
          <span class="ml-1 text-xs text-slate-500">{{ rows.length }}</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-slate-100 text-left">
                <th class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">ID</th>
                <th class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
                <th class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Application</th>
                <th class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">State</th>
                <th class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Progress</th>
                <th class="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-if="loading">
                <td colspan="6" class="px-4 py-8 text-center text-slate-500">Loading…</td>
              </tr>
              <tr v-else-if="rows.length === 0">
                <td colspan="6" class="px-4 py-8 text-center text-slate-500">
                  No instances yet. Submit an OK Electric application or use “Test run” on a workflow definition.
                </td>
              </tr>
              <tr
                v-for="item in rows"
                :id="`wf-instance-${item.id}`"
                :key="item.id"
                :class="[
                  'hover:bg-slate-50',
                  highlightId === item.id ? 'bg-sky-50 ring-1 ring-inset ring-sky-200' : '',
                ]"
              >
                <td class="px-4 py-2.5 font-mono text-xs text-slate-600">{{ item.id.slice(0, 8) }}…</td>
                <td class="px-4 py-2.5 font-medium text-slate-900">{{ item.name }}</td>
                <td class="px-4 py-2.5">
                  <router-link
                    v-if="applicationHref(item)"
                    :to="applicationHref(item)!"
                    class="group inline-flex max-w-[16rem] flex-col gap-0.5 text-left hover:underline"
                  >
                    <span class="truncate font-medium text-[var(--accent-700)]">
                      {{ item.applicantName || item.refNo || item.applicationCode }}
                      <ExternalLink class="ml-1 inline h-3 w-3 opacity-60 group-hover:opacity-100" />
                    </span>
                    <span v-if="item.refNo" class="truncate font-mono text-[11px] text-slate-500">{{ item.refNo }}</span>
                  </router-link>
                  <span v-else class="text-xs text-slate-400">—</span>
                </td>
                <td class="px-4 py-2.5">
                  <span class="inline-flex rounded-md px-2 py-0.5 text-xs font-medium" :class="stateClass(item.state)">
                    {{ item.state }}
                  </span>
                </td>
                <td class="px-4 py-2.5 text-slate-600">{{ Math.round(item.progress ?? 0) }}%</td>
                <td class="px-4 py-2.5">
                  <div class="flex items-center justify-end gap-1">
                    <button
                      v-if="['paused', 'waiting'].includes(item.state?.toLowerCase())"
                      class="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
                      title="Resume"
                      @click="resume(item)"
                    >
                      <RefreshCw class="h-4 w-4" />
                    </button>
                    <button
                      v-if="!['completed', 'cancelled', 'failed'].includes(item.state?.toLowerCase())"
                      class="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-700"
                      title="Cancel"
                      @click="cancel(item)"
                    >
                      <Ban class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </div>
  </AdminLayout>
</template>
