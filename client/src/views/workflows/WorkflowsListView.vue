<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {
  GitBranch,
  Play,
  Plus,
  Search,
  Pencil,
  Trash2,
  ListOrdered,
} from "lucide-vue-next";

import AdminLayout from "@/layouts/AdminLayout.vue";
import { deleteWorkflow, listWorkflows, startWorkflow, type WorkflowDefinition } from "@/api/workflows";
import { useConfirmDialog } from "@/composables/useConfirmDialog";
import { useToast } from "@/composables/useToast";

const router = useRouter();
const toast = useToast();
const confirmDialog = useConfirmDialog();
const rows = ref<WorkflowDefinition[]>([]);
const q = ref("");
const loading = ref(false);

async function load() {
  loading.value = true;
  try {
    const params = new URLSearchParams({
      page: "1",
      limit: "50",
      ...(q.value ? { q: q.value } : {}),
    });
    const response = await listWorkflows(`?${params.toString()}`);
    rows.value = response.data;
  } catch (e) {
    toast.error("Load failed", e instanceof Error ? e.message : "Unable to load workflows.");
  } finally {
    loading.value = false;
  }
}

async function remove(id: number) {
  const allowed = await confirmDialog.confirm({
    title: "Delete workflow?",
    message: "This removes the configuration only. Running instances are not deleted.",
    confirmText: "Delete",
    destructive: true,
  });
  if (!allowed) return;
  try {
    await deleteWorkflow(id);
    await load();
    toast.success("Workflow deleted");
  } catch (e) {
    toast.error("Delete failed", e instanceof Error ? e.message : "Unable to delete workflow.");
  }
}

async function runTest(row: WorkflowDefinition) {
  try {
    const result = await startWorkflow(row.id, {
      user: { name: "Test User", email: "test@example.com" },
    });
    toast.success("Test run started", `Instance ${result.data.instanceId}`);
    router.push("/admin/workflows/instances");
  } catch (e) {
    toast.error("Start failed", e instanceof Error ? e.message : "Unable to start workflow.");
  }
}

onMounted(load);
</script>

<template>
  <AdminLayout>
    <div class="mx-auto max-w-7xl space-y-4">
      <div class="flex items-center justify-between gap-3">
        <div>
          <h1 class="page-title">Workflows</h1>
          <p class="mt-1 text-sm text-slate-500">
            Configure workflow definitions. RG-KE starts pfd-rg-ke-na; RG-CE starts pfd-rg-ce-na on application submit.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button
            class="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-xs hover:bg-slate-50"
            @click="router.push('/admin/workflows/instances')"
          >
            <ListOrdered class="h-4 w-4" />
            Instances
          </button>
          <button
            class="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-1.5 text-sm font-medium text-white shadow-xs hover:bg-slate-800"
            @click="router.push('/admin/workflows/new')"
          >
            <Plus class="h-4 w-4" />
            New Workflow
          </button>
        </div>
      </div>

      <article class="rounded-lg border border-slate-200 bg-white shadow-xs">
        <div class="border-b border-slate-100 px-4 py-2.5">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <GitBranch class="h-4 w-4 text-teal-700" />
              <h2 class="text-sm font-semibold text-slate-900">Definitions</h2>
              <span class="ml-1 text-xs text-slate-500">{{ rows.length }}</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="relative">
                <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  v-model="q"
                  placeholder="Search workflows..."
                  class="w-56 rounded-lg border border-slate-300 py-1.5 pl-9 pr-3 text-sm shadow-xs focus:border-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-200"
                  @keyup.enter="load"
                />
              </div>
              <button
                class="rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm font-medium text-slate-600 shadow-xs hover:bg-slate-50"
                @click="load"
              >
                Filter
              </button>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-slate-100 text-left">
                <th class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
                <th class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Slug</th>
                <th class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Version</th>
                <th class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Steps</th>
                <th class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                <th class="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-if="loading">
                <td colspan="6" class="px-4 py-8 text-center text-slate-500">Loading…</td>
              </tr>
              <tr v-else-if="rows.length === 0">
                <td colspan="6" class="px-4 py-8 text-center text-slate-500">
                  No workflows yet. Create one to get started.
                </td>
              </tr>
              <tr
                v-for="item in rows"
                :key="item.id"
                class="transition-colors hover:bg-slate-50"
              >
                <td class="px-4 py-2.5 font-medium text-slate-900">{{ item.name }}</td>
                <td class="px-4 py-2.5 text-slate-600">{{ item.slug }}</td>
                <td class="px-4 py-2.5 text-slate-600">{{ item.version }}</td>
                <td class="px-4 py-2.5 text-slate-600">{{ item.definition?.steps?.length ?? 0 }}</td>
                <td class="px-4 py-2.5">
                  <span
                    class="inline-flex rounded-md px-2 py-0.5 text-xs font-medium"
                    :class="item.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'"
                  >
                    {{ item.isActive ? "Active" : "Inactive" }}
                  </span>
                </td>
                <td class="px-4 py-2.5">
                  <div class="flex items-center justify-end gap-1">
                    <button
                      class="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      title="Test run"
                      @click="runTest(item)"
                    >
                      <Play class="h-4 w-4" />
                    </button>
                    <button
                      class="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      title="Edit"
                      @click="router.push(`/admin/workflows/${item.id}`)"
                    >
                      <Pencil class="h-4 w-4" />
                    </button>
                    <button
                      class="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-700"
                      title="Delete"
                      @click="remove(item.id)"
                    >
                      <Trash2 class="h-4 w-4" />
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
