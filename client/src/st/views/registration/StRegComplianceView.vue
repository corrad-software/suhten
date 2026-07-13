<script setup lang="ts">
import { computed, ref } from "vue";
import { ShieldAlert } from "lucide-vue-next";

import { useLocale } from "@/composables/useLocale";
import type { ComplianceStatus } from "../../mock/registration";
import { useStRegistrationStore } from "../../stores/registration";
import { useRegistrationModule } from "../../composables/useRegistrationModule";
import ComplianceBadge from "../../components/ComplianceBadge.vue";

const { ts, locale } = useLocale();
const regStore = useStRegistrationStore();
const { code, def, title } = useRegistrationModule();
const filter = ref<ComplianceStatus | "">("");

const rows = computed(() => {
  if (!code.value) return [];
  return regStore.entitiesFor(code.value).filter((e) => !filter.value || e.compliance === filter.value);
});

const counts = computed(() => {
  if (!code.value) return { active: 0, expiring_soon: 0, expired: 0, suspended: 0 };
  const all = regStore.entitiesFor(code.value);
  return {
    active: all.filter((e) => e.compliance === "active").length,
    expiring_soon: all.filter((e) => e.compliance === "expiring_soon").length,
    expired: all.filter((e) => e.compliance === "expired").length,
    suspended: all.filter((e) => e.compliance === "suspended").length,
  };
});

const categoryLabel = computed(() =>
  def.value?.domain === "ok" ? ts("st.common.category") : ts("st.common.class"),
);

function fmt(iso: string): string {
  return new Date(iso).toLocaleDateString(locale.value === "bi" ? "en-MY" : "ms-MY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const FILTERS: Array<{ key: ComplianceStatus | ""; labelKey: "st.common.filterAll" | "st.reg.complianceActive" | "st.reg.complianceExpiring" | "st.reg.complianceExpired" | "st.reg.complianceSuspended" }> = [
  { key: "", labelKey: "st.common.filterAll" },
  { key: "active", labelKey: "st.reg.complianceActive" },
  { key: "expiring_soon", labelKey: "st.reg.complianceExpiring" },
  { key: "expired", labelKey: "st.reg.complianceExpired" },
  { key: "suspended", labelKey: "st.reg.complianceSuspended" },
];
</script>

<template>
  <div v-if="code && def" class="space-y-5">
    <div class="flex items-start gap-3">
      <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-50)]">
        <ShieldAlert class="h-5 w-5 text-[var(--accent-700)]" />
      </div>
      <div>
        <div class="flex flex-wrap items-center gap-2">
          <h1 class="text-xl font-semibold text-slate-900">{{ ts("st.reg.compliance") }}</h1>
          <span class="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600">{{ code }}</span>
        </div>
        <p class="text-sm text-slate-500">{{ title }} · {{ ts("st.reg.complianceSubtitle") }}</p>
      </div>
    </div>

    <p class="text-xs text-slate-400">{{ ts("st.common.mockNote") }}</p>

    <div class="grid gap-3 sm:grid-cols-4">
      <button
        type="button"
        class="rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-left shadow-sm"
        @click="filter = 'active'"
      >
        <p class="text-2xl font-bold text-emerald-700">{{ counts.active }}</p>
        <p class="text-xs text-emerald-800/80">{{ ts("st.reg.complianceActive") }}</p>
      </button>
      <button
        type="button"
        class="rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-left shadow-sm"
        @click="filter = 'expiring_soon'"
      >
        <p class="text-2xl font-bold text-amber-700">{{ counts.expiring_soon }}</p>
        <p class="text-xs text-amber-800/80">{{ ts("st.reg.complianceExpiring") }}</p>
      </button>
      <button
        type="button"
        class="rounded-xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-left shadow-sm"
        @click="filter = 'expired'"
      >
        <p class="text-2xl font-bold text-rose-700">{{ counts.expired }}</p>
        <p class="text-xs text-rose-800/80">{{ ts("st.reg.complianceExpired") }}</p>
      </button>
      <button
        type="button"
        class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left shadow-sm"
        @click="filter = 'suspended'"
      >
        <p class="text-2xl font-bold text-slate-700">{{ counts.suspended }}</p>
        <p class="text-xs text-slate-600">{{ ts("st.reg.complianceSuspended") }}</p>
      </button>
    </div>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="f in FILTERS"
        :key="String(f.key)"
        type="button"
        :class="[
          'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
          filter === f.key ? 'bg-[var(--accent-600)] text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50',
        ]"
        @click="filter = f.key"
      >
        {{ ts(f.labelKey) }}
      </button>
    </div>

    <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-100 px-4 py-3">
        <h2 class="text-sm font-semibold text-slate-800">{{ ts("st.reg.complianceTitle") }}</h2>
      </div>
      <p v-if="rows.length === 0" class="px-4 py-12 text-center text-sm text-slate-400">{{ ts("st.common.noResults") }}</p>
      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr class="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400">
              <th class="px-4 py-2 font-medium">{{ ts("st.common.certificate") }}</th>
              <th class="px-4 py-2 font-medium">{{ ts("st.common.applicant") }}</th>
              <th class="px-4 py-2 font-medium">{{ categoryLabel }}</th>
              <th class="px-4 py-2 font-medium">{{ ts("st.common.cdp") }}</th>
              <th class="px-4 py-2 font-medium">{{ ts("st.common.expires") }}</th>
              <th class="px-4 py-2 font-medium">{{ ts("st.common.status") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.id" class="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
              <td class="px-4 py-3 font-mono text-xs text-slate-700">{{ row.certificateNo }}</td>
              <td class="px-4 py-3">
                <p class="font-medium text-slate-800">{{ row.holderName }}</p>
                <p class="text-xs text-slate-400">{{ row.identityNo }}</p>
                <p v-if="row.employerName && row.employerName !== '—'" class="text-xs text-slate-500">
                  {{ ts("st.common.employer") }}: {{ row.employerName }}
                </p>
              </td>
              <td class="px-4 py-3 font-medium text-slate-700">{{ row.categoryOrClass }}</td>
              <td class="px-4 py-3 text-slate-600">{{ row.cdpPoints }}</td>
              <td class="px-4 py-3 text-slate-500">{{ fmt(row.expiresAt) }}</td>
              <td class="px-4 py-3"><ComplianceBadge :status="row.compliance" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
