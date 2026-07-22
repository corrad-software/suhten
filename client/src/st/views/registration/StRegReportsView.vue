<script setup lang="ts">
import { computed } from "vue";
import { BarChart3 } from "lucide-vue-next";

import { useLocale } from "@/composables/useLocale";
import type { StMessageKey } from "@/i18n/st-messages";
import { useStRegistrationStore } from "../../stores/registration";
import { appTypeLabel, useRegistrationModule } from "../../composables/useRegistrationModule";
import { slaLevel } from "../../sla";

const { ts } = useLocale();
const regStore = useStRegistrationStore();
const { code, def, title, processTypes } = useRegistrationModule();

const apps = computed(() => (code.value ? regStore.applicationsFor(code.value) : []));

const byType = computed(() => {
  const map = new Map<string, number>();
  for (const a of apps.value) {
    map.set(a.appType, (map.get(a.appType) ?? 0) + 1);
  }
  const max = Math.max(1, ...map.values());
  return processTypes.value.map((t) => ({
    type: t,
    count: map.get(t) ?? 0,
    pct: ((map.get(t) ?? 0) / max) * 100,
  }));
});

const byStatus = computed(() => {
  const map = new Map<string, number>();
  for (const a of apps.value) {
    map.set(a.status, (map.get(a.status) ?? 0) + 1);
  }
  const max = Math.max(1, ...map.values());
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([status, count]) => ({
      status,
      count,
      pct: (count / max) * 100,
    }));
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

const volume = computed(() => apps.value.length);
</script>

<template>
  <div v-if="code && def" class="space-y-8">
    <div class="flex items-start gap-3">
      <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-50)]">
        <BarChart3 class="h-5 w-5 text-[var(--accent-700)]" />
      </div>
      <div>
        <div class="flex flex-wrap items-center gap-2">
          <h1 class="text-xl font-semibold text-slate-900">{{ ts("st.reg.reports") }}</h1>
          <span class="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600">{{ code }}</span>
        </div>
        <p class="text-sm text-slate-500">{{ title }} · {{ ts("st.reg.reportsSubtitle") }}</p>
      </div>
    </div>

    <p class="text-xs text-slate-400">{{ ts("st.common.mockNote") }}</p>

    <div class="grid gap-6 lg:grid-cols-3 lg:divide-x lg:divide-slate-200">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">{{ ts("st.reg.reportVolume") }}</p>
        <p class="mt-2 text-4xl font-bold text-slate-900">{{ volume }}</p>
        <p class="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">{{ ts("st.reg.reportSla") }}</p>
        <div class="mt-2 flex h-3 overflow-hidden rounded-full bg-slate-100">
          <div class="bg-emerald-500 transition-all" :style="{ width: `${(sla.green / sla.total) * 100}%` }" />
          <div class="bg-amber-400 transition-all" :style="{ width: `${(sla.yellow / sla.total) * 100}%` }" />
          <div class="bg-rose-500 transition-all" :style="{ width: `${(sla.red / sla.total) * 100}%` }" />
        </div>
        <div class="mt-2 flex flex-wrap gap-3 text-xs text-slate-600">
          <span>{{ ts("st.inbox.slaGreen") }} {{ sla.green }}</span>
          <span>{{ ts("st.inbox.slaYellow") }} {{ sla.yellow }}</span>
          <span>{{ ts("st.inbox.slaRed") }} {{ sla.red }}</span>
        </div>
        <p class="mt-3 text-sm text-slate-500">{{ sla.greenPct }}% {{ ts("st.inbox.slaGreen").toLowerCase() }}</p>
      </div>

      <div class="lg:pl-6">
        <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">{{ ts("st.reg.reportByType") }}</p>
        <ul class="space-y-2.5">
          <li v-for="row in byType" :key="row.type">
            <div class="mb-1 flex justify-between text-xs">
              <span class="text-slate-700">{{ appTypeLabel(row.type, ts) }}</span>
              <span class="font-semibold text-slate-900">{{ row.count }}</span>
            </div>
            <div class="h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div class="h-full rounded-full bg-[var(--accent-500)] transition-all" :style="{ width: `${row.pct}%` }" />
            </div>
          </li>
        </ul>
      </div>

      <div class="lg:pl-6">
        <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">{{ ts("st.reg.reportByStatus") }}</p>
        <ul class="space-y-2.5">
          <li v-for="row in byStatus" :key="row.status">
            <div class="mb-1 flex justify-between text-xs">
              <span class="text-slate-700">{{ ts(`st.status.${row.status}` as StMessageKey) }}</span>
              <span class="font-semibold text-slate-900">{{ row.count }}</span>
            </div>
            <div class="h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div class="h-full rounded-full bg-indigo-400 transition-all" :style="{ width: `${row.pct}%` }" />
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
