<script setup lang="ts">
import { computed, ref } from "vue";
import { FilePlus2, Filter } from "lucide-vue-next";

import { useLocale } from "@/composables/useLocale";
import type { StMessageKey } from "@/i18n/st-messages";
import type { ApplicationStatus } from "../../types";
import { useServiceModule } from "../../composables/useServiceModule";
import {
  appsForModule,
  entitiesForModule,
  type WorkspaceApplication,
  type WorkspaceEntity,
} from "../../mock/workspace";
import { slaLevel } from "../../sla";
import type { SmartTableColumn } from "../../composables/useSmartTable";
import RegStatusBadge from "../../components/RegStatusBadge.vue";
import ComplianceBadge from "../../components/ComplianceBadge.vue";
import SlaIndicator from "../../components/SlaIndicator.vue";
import SmartTable from "../../components/SmartTable.vue";

const { code, def, screen, title, actRef, processTypes, screenTitle, ts, locale } = useServiceModule();
const statusFilter = ref<ApplicationStatus | "">("");
const showGuide = ref(true);

const apps = computed(() => (code.value ? appsForModule(code.value) : []));
const entities = computed(() => (code.value ? entitiesForModule(code.value) : []));

const REVIEW_STATUSES = new Set([
  "sos_review",
  "technical_review",
  "pending_approval",
  "query_applicant",
]);

const filteredApps = computed(() => {
  let rows = apps.value;
  if (screen.value === "review") {
    rows = rows.filter((a) => REVIEW_STATUSES.has(a.status));
  }
  if (statusFilter.value) {
    rows = rows.filter((a) => a.status === statusFilter.value);
  }
  return rows;
});

const stats = computed(() => {
  const all = apps.value;
  const terminal = new Set(["certificate_issued", "rejected", "withdrawn"]);
  return {
    total: all.length,
    inProgress: all.filter((a) => !terminal.has(a.status) && a.status !== "query_applicant").length,
    query: all.filter((a) => a.status === "query_applicant").length,
    issued: all.filter((a) => a.status === "certificate_issued").length,
  };
});

const complianceCounts = computed(() => {
  const all = entities.value;
  return {
    active: all.filter((e) => e.compliance === "active").length,
    expiring_soon: all.filter((e) => e.compliance === "expiring_soon").length,
    expired: all.filter((e) => e.compliance === "expired").length,
    suspended: all.filter((e) => e.compliance === "suspended").length,
  };
});

const sla = computed(() => {
  const now = Date.now();
  const c = { green: 0, yellow: 0, red: 0 };
  for (const a of apps.value) {
    if (["certificate_issued", "rejected", "withdrawn"].includes(a.status)) continue;
    c[slaLevel(a.stageEnteredAt, a.slaTargetHours, now)]++;
  }
  const total = c.green + c.yellow + c.red || 1;
  return { ...c, total, greenPct: Math.round((c.green / total) * 100) };
});

const byStatus = computed(() => {
  const map = new Map<string, number>();
  for (const a of apps.value) map.set(a.status, (map.get(a.status) ?? 0) + 1);
  const max = Math.max(1, ...map.values());
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([status, count]) => ({ status, count, pct: (count / max) * 100 }));
});

function fmt(iso: string): string {
  return new Date(iso).toLocaleDateString(locale.value === "bi" ? "en-MY" : "ms-MY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function fmtDt(iso: string): string {
  return new Date(iso).toLocaleString(locale.value === "bi" ? "en-MY" : "ms-MY", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function processLabel(a: WorkspaceApplication): string {
  const key = `st.wsProc.${a.processType}` as StMessageKey;
  const translated = ts(key);
  return translated === key ? a.processType.replace(/_/g, " ") : translated;
}

const STATUS_OPTIONS: ApplicationStatus[] = [
  "sos_review",
  "technical_review",
  "pending_approval",
  "query_applicant",
  "awaiting_processing_payment",
  "certificate_issued",
];

const applicationColumns = computed<SmartTableColumn<WorkspaceApplication>[]>(() => [
  { key: "refNo", label: ts("st.common.refNo"), value: (row) => row.refNo },
  { key: "applicant", label: ts("st.common.applicant"), value: (row) => row.applicantName },
  { key: "type", label: ts("st.common.type"), value: (row) => processLabel(row) },
  { key: "date", label: ts("st.common.date"), value: (row) => fmt(row.submittedAt) },
  { key: "status", label: ts("st.common.status"), value: (row) => ts(`st.status.${row.status}` as StMessageKey) },
]);

const reviewColumns = computed<SmartTableColumn<WorkspaceApplication>[]>(() => [
  { key: "refNo", label: ts("st.common.refNo"), value: (row) => row.refNo },
  { key: "applicant", label: ts("st.common.applicant"), value: (row) => row.applicantName },
  { key: "status", label: ts("st.common.status"), value: (row) => ts(`st.status.${row.status}` as StMessageKey) },
  { key: "sla", label: "SLA", value: () => "", filterable: false },
  { key: "officer", label: ts("st.common.officer"), value: (row) => row.officer || "—" },
]);

const complianceColumns = computed<SmartTableColumn<WorkspaceEntity>[]>(() => [
  { key: "certificate", label: ts("st.common.certificate"), value: (row) => row.certificateNo },
  { key: "applicant", label: ts("st.common.applicant"), value: (row) => row.name },
  { key: "category", label: ts("st.common.category"), value: (row) => row.categoryOrClass },
  { key: "expires", label: ts("st.common.expires"), value: (row) => fmt(row.expiresAt) },
  { key: "status", label: ts("st.common.status"), value: (row) => ts(`st.compliance.${row.compliance}` as StMessageKey) },
]);
</script>

<template>
  <div v-if="code && def" class="space-y-8">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div class="flex items-start gap-3">
        <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-50)]">
          <component :is="def.icon" class="h-5 w-5 text-[var(--accent-700)]" />
        </div>
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <h1 class="text-xl font-semibold text-slate-900">{{ screenTitle }}</h1>
            <span class="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600">{{ code }}</span>
            <span
              v-if="def.phase === 2"
              class="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800"
            >{{ ts("st.ws.phase2") }}</span>
          </div>
          <p class="mt-0.5 text-sm text-slate-500">{{ title }}</p>
          <p class="mt-1 text-xs text-slate-400">{{ actRef }}</p>
        </div>
      </div>
      <button
        v-if="screen === 'applications'"
        type="button"
        class="flex items-center gap-2 rounded-md bg-[var(--accent-600)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-700)]"
        @click="showGuide = true"
      >
        <FilePlus2 class="h-4 w-4" /> {{ ts("st.reg.newApplication") }}
      </button>
    </div>

    <p class="text-xs text-slate-400">{{ ts("st.common.mockNote") }}</p>

    <!-- Applications -->
    <template v-if="screen === 'applications'">
      <div v-if="showGuide" class="rounded-xl border border-[var(--accent-200)] bg-[var(--accent-50)]/60 p-4">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 class="text-sm font-semibold text-slate-800">{{ ts("st.reg.guidedTitle") }}</h2>
            <p class="mt-1 text-sm text-slate-600">{{ ts("st.ws.guidedBody") }}</p>
          </div>
          <button type="button" class="text-xs text-slate-500 underline" @click="showGuide = false">
            {{ ts("st.ws.dismiss") }}
          </button>
        </div>
        <div class="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">{{ ts("st.reg.processTypes") }}</p>
            <ul class="mt-1 list-inside list-disc text-sm text-slate-700">
              <li v-for="p in processTypes" :key="p">{{ p }}</li>
            </ul>
          </div>
          <div>
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">{{ ts("st.ws.nextSteps") }}</p>
            <ul class="mt-1 list-inside list-disc text-sm text-slate-700">
              <li>{{ ts("st.ws.stepEligibility") }}</li>
              <li>{{ ts("st.ws.stepDocs") }}</li>
              <li>{{ ts("st.ws.stepPay") }}</li>
              <li>{{ ts("st.ws.stepReview") }}</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-y-4 sm:grid-cols-4 sm:divide-x sm:divide-slate-200">
        <div class="px-0 sm:px-5 sm:first:pl-0">
          <p class="text-2xl font-bold text-slate-900">{{ stats.total }}</p>
          <p class="text-xs text-slate-500">{{ ts("st.reg.statTotal") }}</p>
        </div>
        <div class="px-0 sm:px-5">
          <p class="text-2xl font-bold text-sky-700">{{ stats.inProgress }}</p>
          <p class="text-xs text-slate-500">{{ ts("st.reg.statInProgress") }}</p>
        </div>
        <div class="px-0 sm:px-5">
          <p class="text-2xl font-bold text-amber-700">{{ stats.query }}</p>
          <p class="text-xs text-slate-500">{{ ts("st.reg.statQuery") }}</p>
        </div>
        <div class="px-0 sm:px-5">
          <p class="text-2xl font-bold text-emerald-700">{{ stats.issued }}</p>
          <p class="text-xs text-slate-500">{{ ts("st.reg.statIssued") }}</p>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2 border-t border-slate-200 pt-6">
        <Filter class="h-4 w-4 text-slate-400" />
        <select v-model="statusFilter" class="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm">
          <option value="">{{ ts("st.common.filterAll") }}</option>
          <option v-for="s in STATUS_OPTIONS" :key="s" :value="s">{{ ts(`st.status.${s}` as StMessageKey) }}</option>
        </select>
      </div>

      <SmartTable
        :rows="filteredApps"
        :columns="applicationColumns"
        :row-key="(row) => row.id"
        :empty-text="ts('st.reg.emptyApps')"
      >
        <template #cell-refNo="{ row }">
          <span class="font-mono text-xs text-slate-700">{{ row.refNo }}</span>
        </template>
        <template #cell-applicant="{ row }">
          <p class="font-medium text-slate-800">{{ row.applicantName }}</p>
          <p class="text-xs text-slate-400">{{ row.identityNo }} · {{ row.location || "—" }}</p>
        </template>
        <template #cell-status="{ row }">
          <RegStatusBadge :status="row.status" />
        </template>
      </SmartTable>
    </template>

    <!-- Review -->
    <template v-else-if="screen === 'review'">
      <div class="flex flex-wrap gap-3 text-xs">
        <span class="rounded-md bg-emerald-50 px-2.5 py-1 text-emerald-800">{{ ts("st.inbox.slaGreen") }} {{ sla.green }}</span>
        <span class="rounded-md bg-amber-50 px-2.5 py-1 text-amber-800">{{ ts("st.inbox.slaYellow") }} {{ sla.yellow }}</span>
        <span class="rounded-md bg-rose-50 px-2.5 py-1 text-rose-800">{{ ts("st.inbox.slaRed") }} {{ sla.red }}</span>
      </div>
      <SmartTable
        :rows="filteredApps"
        :columns="reviewColumns"
        :row-key="(row) => row.id"
        :empty-text="ts('st.reg.reviewEmpty')"
      >
        <template #cell-refNo="{ row }">
          <span class="font-mono text-xs">{{ row.refNo }}</span>
        </template>
        <template #cell-applicant="{ row }">
          <p class="font-medium">{{ row.applicantName }}</p>
          <p class="text-xs text-slate-400">{{ fmtDt(row.stageEnteredAt) }}</p>
        </template>
        <template #cell-status="{ row }">
          <RegStatusBadge :status="row.status" />
        </template>
        <template #cell-sla="{ row }">
          <SlaIndicator :stage-entered-at="row.stageEnteredAt" :target-hours="row.slaTargetHours" />
        </template>
        <template #cell-officer="{ row }">
          <span class="text-slate-600">{{ row.officer || "—" }}</span>
        </template>
      </SmartTable>
    </template>

    <!-- Compliance -->
    <template v-else-if="screen === 'compliance'">
      <div class="grid gap-3 sm:grid-cols-4">
        <div class="rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3">
          <p class="text-2xl font-bold text-emerald-700">{{ complianceCounts.active }}</p>
          <p class="text-xs text-emerald-800/80">{{ ts("st.reg.complianceActive") }}</p>
        </div>
        <div class="rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3">
          <p class="text-2xl font-bold text-amber-700">{{ complianceCounts.expiring_soon }}</p>
          <p class="text-xs text-amber-800/80">{{ ts("st.reg.complianceExpiring") }}</p>
        </div>
        <div class="rounded-xl border border-rose-200 bg-rose-50/80 px-4 py-3">
          <p class="text-2xl font-bold text-rose-700">{{ complianceCounts.expired }}</p>
          <p class="text-xs text-rose-800/80">{{ ts("st.reg.complianceExpired") }}</p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p class="text-2xl font-bold text-slate-700">{{ complianceCounts.suspended }}</p>
          <p class="text-xs text-slate-600">{{ ts("st.reg.complianceSuspended") }}</p>
        </div>
      </div>
      <div class="border-t border-slate-200 pt-6">
        <SmartTable
          :rows="entities"
          :columns="complianceColumns"
          :row-key="(row) => row.id"
          :empty-text="ts('st.common.noResults')"
        >
          <template #cell-certificate="{ row }">
            <span class="font-mono text-xs">{{ row.certificateNo }}</span>
          </template>
          <template #cell-applicant="{ row }">
            <p class="font-medium">{{ row.name }}</p>
            <p class="text-xs text-slate-400">{{ row.identityNo }}</p>
          </template>
          <template #cell-status="{ row }">
            <ComplianceBadge :status="row.compliance" />
          </template>
        </SmartTable>
      </div>
    </template>

    <!-- Reports -->
    <template v-else>
      <div class="grid gap-6 lg:grid-cols-3 lg:divide-x lg:divide-slate-200">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">{{ ts("st.reg.reportVolume") }}</p>
          <p class="mt-2 text-4xl font-bold text-slate-900">{{ stats.total }}</p>
          <p class="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">{{ ts("st.reg.reportSla") }}</p>
          <div class="mt-2 flex h-3 overflow-hidden rounded-full bg-slate-100">
            <div class="bg-emerald-500" :style="{ width: `${(sla.green / sla.total) * 100}%` }" />
            <div class="bg-amber-400" :style="{ width: `${(sla.yellow / sla.total) * 100}%` }" />
            <div class="bg-rose-500" :style="{ width: `${(sla.red / sla.total) * 100}%` }" />
          </div>
          <p class="mt-3 text-sm text-slate-500">{{ sla.greenPct }}% {{ ts("st.inbox.slaGreen").toLowerCase() }}</p>
        </div>
        <div class="lg:col-span-2 lg:pl-6">
          <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">{{ ts("st.reg.reportByStatus") }}</p>
          <ul class="space-y-2.5">
            <li v-for="row in byStatus" :key="row.status">
              <div class="mb-1 flex justify-between text-xs">
                <span class="text-slate-700">{{ ts(`st.status.${row.status}` as StMessageKey) }}</span>
                <span class="font-semibold">{{ row.count }}</span>
              </div>
              <div class="h-1.5 rounded-full bg-slate-100">
                <div class="h-1.5 rounded-full bg-[var(--accent-500)]" :style="{ width: `${row.pct}%` }" />
              </div>
            </li>
            <li v-if="byStatus.length === 0" class="text-sm text-slate-400">{{ ts("st.common.noResults") }}</li>
          </ul>
        </div>
      </div>
    </template>
  </div>
</template>
