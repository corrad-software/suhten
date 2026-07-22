<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { Download } from "lucide-vue-next";

import { useLocale } from "@/composables/useLocale";
import type { StMessageKey } from "@/i18n/st-messages";
import {
  AIRR_STATS,
  AUDIT_EVENTS,
  SLA_MODULE_STATS,
  analyticsScreenKey,
} from "../../mock/workspace";
import type { SmartTableColumn } from "../../composables/useSmartTable";
import SmartTable from "../../components/SmartTable.vue";
import StPageHero from "../../components/StPageHero.vue";

const route = useRoute();
const { ts, locale } = useLocale();

const screen = computed(() => (route.meta.analyticsScreen as string) || analyticsScreenKey(route.path));

const titleKey = computed<StMessageKey>(() => {
  const map: Record<string, StMessageKey> = {
    "reports-airr": "st.ws.airr",
    "reports-sla": "st.ws.sla",
    "reports-export": "st.ws.export",
    "reports-audit": "st.ws.auditTrail",
  };
  return map[screen.value] ?? "st.ws.workspace";
});

function fmt(iso: string): string {
  return new Date(iso).toLocaleString(locale.value === "bi" ? "en-MY" : "ms-MY", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type SlaModuleRow = (typeof SLA_MODULE_STATS)[number];
const slaColumns = computed<SmartTableColumn<SlaModuleRow>[]>(() => [
  { key: "module", label: ts("st.common.module"), value: (row) => row.module },
  { key: "green", label: ts("st.inbox.slaGreen"), value: (row) => `${row.green}%` },
  { key: "yellow", label: ts("st.inbox.slaYellow"), value: (row) => `${row.yellow}%` },
  { key: "red", label: ts("st.inbox.slaRed"), value: (row) => `${row.red}%` },
  { key: "distribution", label: ts("st.ws.distribution"), value: () => "", filterable: false },
]);

type AuditRow = (typeof AUDIT_EVENTS)[number];
const auditColumns = computed<SmartTableColumn<AuditRow>[]>(() => [
  { key: "date", label: ts("st.common.date"), value: (e) => fmt(e.at) },
  { key: "actor", label: ts("st.ws.actor"), value: (e) => e.actor },
  { key: "action", label: ts("st.ws.action"), value: (e) => `${e.action} ${e.detail}` },
  { key: "refNo", label: ts("st.common.refNo"), value: (e) => e.refNo },
  { key: "module", label: ts("st.common.module"), value: (e) => e.moduleCode },
]);
</script>

<template>
  <div class="space-y-8">
    <StPageHero :title="ts(titleKey)" :subtitle="ts('st.ws.analyticsSubtitle')" />

    <p class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.common.mockNote") }}</p>

    <template v-if="screen === 'reports-airr'">
      <div class="grid grid-cols-2 gap-y-5 sm:grid-cols-4 sm:divide-x sm:divide-slate-200 dark:sm:divide-slate-700">
        <div
          v-for="(s, i) in AIRR_STATS"
          :key="i"
          class="px-0 sm:px-5 sm:first:pl-0"
        >
          <p class="text-xs text-slate-500 dark:text-slate-400">{{ locale === "bi" ? s.labelBi : s.labelBm }}</p>
          <p class="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">{{ s.value.toLocaleString() }}</p>
          <p :class="['mt-1 text-xs font-medium', s.delta >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400']">
            {{ s.delta >= 0 ? "+" : "" }}{{ s.delta }}% {{ ts("st.ws.vsPrev") }}
          </p>
        </div>
      </div>
      <article class="border-t border-slate-200 pt-6 dark:border-slate-700">
        <h2 class="text-sm font-semibold text-slate-800 dark:text-slate-200">{{ ts("st.ws.airrNote") }}</h2>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">{{ ts("st.ws.airrBody") }}</p>
      </article>
    </template>

    <template v-else-if="screen === 'reports-sla'">
      <SmartTable :rows="SLA_MODULE_STATS" :columns="slaColumns" :row-key="(row) => row.module">
        <template #cell-module="{ row }">
          <span class="font-mono text-xs font-semibold">{{ row.module }}</span>
        </template>
        <template #cell-green="{ row }">
          <span class="text-emerald-700 dark:text-emerald-400">{{ row.green }}%</span>
        </template>
        <template #cell-yellow="{ row }">
          <span class="text-amber-700 dark:text-amber-400">{{ row.yellow }}%</span>
        </template>
        <template #cell-red="{ row }">
          <span class="text-rose-700 dark:text-rose-400">{{ row.red }}%</span>
        </template>
        <template #cell-distribution="{ row }">
          <div class="w-48">
            <div class="flex h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
              <div class="bg-emerald-500" :style="{ width: `${row.green}%` }" />
              <div class="bg-amber-400" :style="{ width: `${row.yellow}%` }" />
              <div class="bg-rose-500" :style="{ width: `${row.red}%` }" />
            </div>
          </div>
        </template>
      </SmartTable>
    </template>

    <template v-else-if="screen === 'reports-export'">
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <button
          v-for="item in [
            { k: 'st.ws.exportApps', f: 'CSV / Excel' },
            { k: 'st.ws.exportPayments', f: 'CSV' },
            { k: 'st.ws.exportSla', f: 'PDF' },
            { k: 'st.ws.exportAudit', f: 'CSV' },
            { k: 'st.ws.exportAirr', f: 'Excel' },
            { k: 'st.ws.exportCompliance', f: 'Excel' },
          ]"
          :key="item.k"
          type="button"
          class="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-4 text-left shadow-sm hover:border-[var(--accent-300)] hover:bg-[var(--accent-50)]/40 dark:border-slate-700 dark:bg-slate-800"
        >
          <div>
            <p class="text-sm font-semibold text-slate-800 dark:text-slate-200">{{ ts(item.k as StMessageKey) }}</p>
            <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{{ item.f }} · {{ ts("st.ws.exportDemo") }}</p>
          </div>
          <Download class="h-4 w-4 text-slate-400 dark:text-slate-500" />
        </button>
      </div>
    </template>

    <template v-else>
      <SmartTable :rows="AUDIT_EVENTS" :columns="auditColumns" :row-key="(e) => e.id">
        <template #cell-date="{ row }">
          <span class="text-slate-600 dark:text-slate-400">{{ fmt(row.at) }}</span>
        </template>
        <template #cell-actor="{ row }">
          <span class="font-medium">{{ row.actor }}</span>
        </template>
        <template #cell-action="{ row }">
          <p class="font-mono text-xs text-slate-700 dark:text-slate-300">{{ row.action }}</p>
          <p class="text-xs text-slate-400 dark:text-slate-500">{{ row.detail }}</p>
        </template>
        <template #cell-refNo="{ row }">
          <span class="font-mono text-xs">{{ row.refNo }}</span>
        </template>
      </SmartTable>
    </template>
  </div>
</template>
