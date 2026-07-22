<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { FilePlus2 } from "lucide-vue-next";

import { useLocale } from "@/composables/useLocale";
import type { StMessageKey } from "@/i18n/st-messages";

import { useStSessionStore } from "../stores/session";
import { useStWorkflowStore } from "../stores/workflow";
import { workflowShort } from "../status";
import type { SmartTableColumn } from "../composables/useSmartTable";
import StatusBadge from "../components/StatusBadge.vue";
import StPageHero from "../components/StPageHero.vue";
import SmartTable from "../components/SmartTable.vue";

const router = useRouter();
const session = useStSessionStore();
const workflow = useStWorkflowStore();
const { ts } = useLocale();

const isEmployer = computed(() => session.role === "employer");

const rows = computed(() => {
  if (isEmployer.value) return session.currentPersonaId ? workflow.confirmationsFor(session.currentPersonaId) : [];
  return workflow.myApplications;
});

function fmt(iso: string): string {
  return new Date(iso).toLocaleDateString("ms-MY", { day: "2-digit", month: "short", year: "numeric" });
}

function open(id: string) {
  router.push(`/st/applications/${id}`);
}

type AppRow = (typeof rows.value)[number];

const columns = computed<SmartTableColumn<AppRow>[]>(() => {
  const cols: SmartTableColumn<AppRow>[] = [{ key: "refNo", label: "No. Rujukan", value: (a) => a.refNo }];
  if (isEmployer.value) cols.push({ key: "applicant", label: "Pemohon", value: (a) => a.applicant.fullName });
  cols.push(
    { key: "type", label: "Jenis", value: (a) => workflowShort(a.workflowType) },
    { key: "date", label: "Tarikh", value: (a) => fmt(a.createdAt) },
    { key: "status", label: "Status", value: (a) => ts(`st.status.${a.status}` as StMessageKey) },
    { key: "action", label: "Tindakan", value: () => "", filterable: false },
  );
  return cols;
});
</script>

<template>
  <div class="space-y-5">
    <StPageHero
      :title="isEmployer ? 'Pengesahan Lantikan' : 'Permohonan Saya'"
      :subtitle="`${rows.length} ${isEmployer ? 'menunggu pengesahan' : 'permohonan'}`"
    >
      <template v-if="!isEmployer" #action>
        <button
          class="flex shrink-0 items-center gap-1.5 rounded-md bg-[var(--accent-600)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-700)]"
          @click="router.push('/st/applications/new')"
        >
          <FilePlus2 class="h-4 w-4" /> Permohonan Baharu
        </button>
      </template>
    </StPageHero>

    <SmartTable
      :rows="rows"
      :columns="columns"
      :row-key="(a) => a.id"
      clickable-rows
      :empty-text="isEmployer ? 'Tiada lantikan menunggu pengesahan.' : 'Belum ada permohonan.'"
      @row-click="(a) => open(a.id)"
    >
      <template #cell-refNo="{ row }">
        <span class="font-mono text-xs text-slate-700">{{ row.refNo }}</span>
      </template>
      <template #cell-type="{ row }">
        <span class="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600">{{ workflowShort(row.workflowType) }}</span>
      </template>
      <template #cell-status="{ row }">
        <StatusBadge :status="row.status" />
      </template>
      <template #cell-action>
        <span class="text-xs font-medium text-[var(--accent-700)]">Lihat →</span>
      </template>
    </SmartTable>
  </div>
</template>
