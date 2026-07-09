<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { Download, FileSearch, FileText, Gauge } from "lucide-vue-next";

import { useLocale } from "@/composables/useLocale";
import type { StMessageKey } from "@/i18n/st-messages";
import {
  AIRR_STATS,
  AUDIT_EVENTS,
  SLA_MODULE_STATS,
  analyticsScreenKey,
} from "../../mock/workspace";

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

const icon = computed(() => {
  if (screen.value === "reports-sla") return Gauge;
  if (screen.value === "reports-audit") return FileSearch;
  if (screen.value === "reports-export") return Download;
  return FileText;
});

function fmt(iso: string): string {
  return new Date(iso).toLocaleString(locale.value === "bi" ? "en-MY" : "ms-MY", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
</script>

<template>
  <div class="space-y-5">
    <div class="flex items-start gap-3">
      <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-50)]">
        <component :is="icon" class="h-5 w-5 text-[var(--accent-700)]" />
      </div>
      <div>
        <h1 class="text-xl font-semibold text-slate-900">{{ ts(titleKey) }}</h1>
        <p class="mt-0.5 text-sm text-slate-500">{{ ts("st.ws.analyticsSubtitle") }}</p>
      </div>
    </div>

    <p class="text-xs text-slate-400">{{ ts("st.common.mockNote") }}</p>

    <template v-if="screen === 'reports-airr'">
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="(s, i) in AIRR_STATS"
          :key="i"
          class="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
        >
          <p class="text-xs text-slate-500">{{ locale === "bi" ? s.labelBi : s.labelBm }}</p>
          <p class="mt-1 text-3xl font-bold text-slate-900">{{ s.value.toLocaleString() }}</p>
          <p :class="['mt-1 text-xs font-medium', s.delta >= 0 ? 'text-emerald-600' : 'text-rose-600']">
            {{ s.delta >= 0 ? "+" : "" }}{{ s.delta }}% {{ ts("st.ws.vsPrev") }}
          </p>
        </div>
      </div>
      <article class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 class="text-sm font-semibold text-slate-800">{{ ts("st.ws.airrNote") }}</h2>
        <p class="mt-2 text-sm text-slate-600">{{ ts("st.ws.airrBody") }}</p>
      </article>
    </template>

    <template v-else-if="screen === 'reports-sla'">
      <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table class="min-w-full text-left text-sm">
          <thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th class="px-4 py-3">{{ ts("st.common.module") }}</th>
              <th class="px-4 py-3">{{ ts("st.inbox.slaGreen") }}</th>
              <th class="px-4 py-3">{{ ts("st.inbox.slaYellow") }}</th>
              <th class="px-4 py-3">{{ ts("st.inbox.slaRed") }}</th>
              <th class="px-4 py-3">{{ ts("st.ws.distribution") }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="row in SLA_MODULE_STATS" :key="row.module">
              <td class="px-4 py-3 font-mono text-xs font-semibold">{{ row.module }}</td>
              <td class="px-4 py-3 text-emerald-700">{{ row.green }}%</td>
              <td class="px-4 py-3 text-amber-700">{{ row.yellow }}%</td>
              <td class="px-4 py-3 text-rose-700">{{ row.red }}%</td>
              <td class="px-4 py-3 w-48">
                <div class="flex h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div class="bg-emerald-500" :style="{ width: `${row.green}%` }" />
                  <div class="bg-amber-400" :style="{ width: `${row.yellow}%` }" />
                  <div class="bg-rose-500" :style="{ width: `${row.red}%` }" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
          class="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-4 text-left shadow-sm hover:border-[var(--accent-300)] hover:bg-[var(--accent-50)]/40"
        >
          <div>
            <p class="text-sm font-semibold text-slate-800">{{ ts(item.k as StMessageKey) }}</p>
            <p class="mt-0.5 text-xs text-slate-500">{{ item.f }} · {{ ts("st.ws.exportDemo") }}</p>
          </div>
          <Download class="h-4 w-4 text-slate-400" />
        </button>
      </div>
    </template>

    <template v-else>
      <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table class="min-w-full text-left text-sm">
          <thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th class="px-4 py-3">{{ ts("st.common.date") }}</th>
              <th class="px-4 py-3">{{ ts("st.ws.actor") }}</th>
              <th class="px-4 py-3">{{ ts("st.ws.action") }}</th>
              <th class="px-4 py-3">{{ ts("st.common.refNo") }}</th>
              <th class="px-4 py-3">{{ ts("st.common.module") }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="e in AUDIT_EVENTS" :key="e.id" class="hover:bg-slate-50/80">
              <td class="px-4 py-3 text-slate-600">{{ fmt(e.at) }}</td>
              <td class="px-4 py-3 font-medium">{{ e.actor }}</td>
              <td class="px-4 py-3">
                <p class="font-mono text-xs text-slate-700">{{ e.action }}</p>
                <p class="text-xs text-slate-400">{{ e.detail }}</p>
              </td>
              <td class="px-4 py-3 font-mono text-xs">{{ e.refNo }}</td>
              <td class="px-4 py-3">{{ e.moduleCode }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>
