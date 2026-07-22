<script setup lang="ts">
import { computed, ref } from "vue";

import { useLocale } from "@/composables/useLocale";
import type { StMessageKey } from "@/i18n/st-messages";
import type { ComplianceStatus } from "../../mock/registration";
import { useStRegistrationStore } from "../../stores/registration";
import { useRegistrationModule } from "../../composables/useRegistrationModule";
import type { SmartTableColumn } from "../../composables/useSmartTable";
import ComplianceBadge from "../../components/ComplianceBadge.vue";
import SmartTable from "../../components/SmartTable.vue";
import StPageHero from "../../components/StPageHero.vue";

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

type ComplianceRow = (typeof rows.value)[number];

const columns = computed<SmartTableColumn<ComplianceRow>[]>(() => [
  { key: "certificate", label: ts("st.common.certificate"), value: (row) => row.certificateNo },
  { key: "applicant", label: ts("st.common.applicant"), value: (row) => row.holderName },
  { key: "category", label: categoryLabel.value, value: (row) => row.categoryOrClass },
  { key: "cdp", label: ts("st.common.cdp"), value: (row) => String(row.cdpPoints) },
  { key: "expires", label: ts("st.common.expires"), value: (row) => fmt(row.expiresAt) },
  { key: "status", label: ts("st.common.status"), value: (row) => ts(`st.compliance.${row.compliance}` as StMessageKey) },
]);
</script>

<template>
  <div v-if="code && def" class="space-y-8">
    <StPageHero :title="ts('st.reg.compliance')" :subtitle="`${title} · ${ts('st.reg.complianceSubtitle')}`">
      <div class="mt-2 flex flex-wrap items-center gap-2">
        <span class="rounded-md bg-slate-100 dark:bg-slate-700 px-2 py-0.5 font-mono text-xs text-slate-600 dark:text-slate-400">{{ code }}</span>
      </div>
    </StPageHero>

    <p class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.common.mockNote") }}</p>

    <div class="grid grid-cols-2 gap-y-4 sm:grid-cols-4 sm:divide-x sm:divide-slate-200 dark:sm:divide-slate-700">
      <button type="button" class="px-0 text-left transition-opacity hover:opacity-70 sm:px-5 sm:first:pl-0" @click="filter = 'active'">
        <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ counts.active }}</p>
        <p class="text-xs text-slate-500 dark:text-slate-400">{{ ts("st.reg.complianceActive") }}</p>
      </button>
      <button type="button" class="px-0 text-left transition-opacity hover:opacity-70 sm:px-5" @click="filter = 'expiring_soon'">
        <p class="text-2xl font-bold text-amber-600 dark:text-amber-400">{{ counts.expiring_soon }}</p>
        <p class="text-xs text-slate-500 dark:text-slate-400">{{ ts("st.reg.complianceExpiring") }}</p>
      </button>
      <button type="button" class="px-0 text-left transition-opacity hover:opacity-70 sm:px-5" @click="filter = 'expired'">
        <p class="text-2xl font-bold text-rose-600 dark:text-rose-400">{{ counts.expired }}</p>
        <p class="text-xs text-slate-500 dark:text-slate-400">{{ ts("st.reg.complianceExpired") }}</p>
      </button>
      <button type="button" class="px-0 text-left transition-opacity hover:opacity-70 sm:px-5" @click="filter = 'suspended'">
        <p class="text-2xl font-bold text-slate-700 dark:text-slate-300">{{ counts.suspended }}</p>
        <p class="text-xs text-slate-500 dark:text-slate-400">{{ ts("st.reg.complianceSuspended") }}</p>
      </button>
    </div>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="f in FILTERS"
        :key="String(f.key)"
        type="button"
        :class="[
          'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
          filter === f.key ? 'bg-[var(--accent-600)] text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60',
        ]"
        @click="filter = f.key"
      >
        {{ ts(f.labelKey) }}
      </button>
    </div>

    <div class="border-t border-slate-200 dark:border-slate-700 pt-6">
      <h2 class="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{{ ts("st.reg.complianceTitle") }}</h2>
      <SmartTable :rows="rows" :columns="columns" :row-key="(row) => row.id" :empty-text="ts('st.common.noResults')">
        <template #cell-certificate="{ row }">
          <span class="font-mono text-xs text-slate-700 dark:text-slate-300">{{ row.certificateNo }}</span>
        </template>
        <template #cell-applicant="{ row }">
          <p class="font-medium text-slate-800 dark:text-slate-200">{{ row.holderName }}</p>
          <p class="text-xs text-slate-400 dark:text-slate-500">{{ row.identityNo }}</p>
          <p v-if="row.employerName && row.employerName !== '—'" class="text-xs text-slate-500 dark:text-slate-400">
            {{ ts("st.common.employer") }}: {{ row.employerName }}
          </p>
        </template>
        <template #cell-status="{ row }">
          <ComplianceBadge :status="row.compliance" />
        </template>
      </SmartTable>
    </div>
  </div>
</template>
