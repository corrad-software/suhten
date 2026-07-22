<script setup lang="ts">
import { computed, ref } from "vue";
import { Search, Sparkles } from "lucide-vue-next";

import { useLocale } from "@/composables/useLocale";
import type { StMessageKey } from "@/i18n/st-messages";
import type { SearchHit } from "../mock/registration";
import { useStRegistrationStore } from "../stores/registration";
import { appTypeLabel } from "../composables/useRegistrationModule";
import RegStatusBadge from "../components/RegStatusBadge.vue";
import ComplianceBadge from "../components/ComplianceBadge.vue";
import StPageHero from "../components/StPageHero.vue";

const { ts, locale } = useLocale();
const regStore = useStRegistrationStore();
const query = ref("");
const submitted = ref("");

function searchHits(qRaw: string): SearchHit[] {
  const q = qRaw.trim().toLowerCase();
  if (!q) return [];
  const apps: SearchHit[] = regStore.applications
    .filter(
      (a) =>
        a.refNo.toLowerCase().includes(q) ||
        a.applicantName.toLowerCase().includes(q) ||
        a.identityNo.toLowerCase().includes(q),
    )
    .map((a) => ({ ...a, kind: "application" as const }));
  const ents: SearchHit[] = regStore.entities
    .filter(
      (e) =>
        e.certificateNo.toLowerCase().includes(q) ||
        e.holderName.toLowerCase().includes(q) ||
        e.identityNo.toLowerCase().includes(q),
    )
    .map((e) => ({ ...e, kind: "entity" as const }));
  return [...apps, ...ents];
}

const hits = computed(() => (submitted.value ? searchHits(submitted.value) : []));
const apps = computed(() => hits.value.filter((h): h is SearchHit & { kind: "application" } => h.kind === "application"));
const regs = computed(() => hits.value.filter((h): h is SearchHit & { kind: "entity" } => h.kind === "entity"));

function runSearch(q?: string) {
  submitted.value = (q ?? query.value).trim();
  if (q) query.value = q;
}

function fmt(iso: string): string {
  return new Date(iso).toLocaleDateString(locale.value === "bi" ? "en-MY" : "ms-MY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const quick = computed(() => [
  { label: ts("st.search.quick1"), q: "Ahmad" },
  { label: ts("st.search.quick2"), q: "ST/RG-CE/2026" },
  { label: ts("st.search.quick3"), q: "GasLink" },
]);
</script>

<template>
  <div class="space-y-5">
    <StPageHero :title="ts('st.search.title')" :subtitle="ts('st.search.subtitle')" />

    <p class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.common.mockNote") }}</p>

    <form
      class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-700 dark:bg-slate-800"
      @submit.prevent="runSearch()"
    >
      <label class="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {{ ts("st.common.search") }}
      </label>
      <div class="flex flex-col gap-3 sm:flex-row">
        <div class="relative flex-1">
          <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            v-model="query"
            type="search"
            :placeholder="ts('st.search.placeholder')"
            class="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[var(--accent-500)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)] dark:border-slate-600 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>
        <button
          type="submit"
          class="rounded-lg bg-[var(--accent-600)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--accent-700)]"
        >
          {{ ts("st.common.search") }}
        </button>
      </div>
      <p class="mt-2 text-xs text-slate-400 dark:text-slate-500">{{ ts("st.search.hint") }}</p>

      <div class="mt-4 flex flex-wrap items-center gap-2">
        <Sparkles class="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
        <span class="text-xs text-slate-500 dark:text-slate-400">{{ ts("st.search.quickTitle") }}:</span>
        <button
          v-for="item in quick"
          :key="item.q"
          type="button"
          class="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
          @click="runSearch(item.q)"
        >
          {{ item.label }}
        </button>
      </div>
    </form>

    <template v-if="submitted">
      <div class="flex items-baseline justify-between gap-2">
        <h2 class="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {{ ts("st.search.results") }}
          <span class="font-normal text-slate-400 dark:text-slate-500">({{ hits.length }})</span>
        </h2>
      </div>

      <p v-if="hits.length === 0" class="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-12 text-center text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500">
        {{ ts("st.search.noHit") }}
      </p>

      <div v-else class="grid gap-6 lg:grid-cols-2 lg:divide-x lg:divide-slate-200 dark:lg:divide-slate-700">
        <section>
          <div class="border-b border-slate-200 pb-2 dark:border-slate-700">
            <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {{ ts("st.search.applications") }}
              <span class="text-slate-400 dark:text-slate-500">({{ apps.length }})</span>
            </h3>
          </div>
          <p v-if="apps.length === 0" class="py-8 text-center text-sm text-slate-400 dark:text-slate-500">{{ ts("st.common.noResults") }}</p>
          <ul v-else class="divide-y divide-slate-100 dark:divide-slate-800">
            <li v-for="hit in apps" :key="hit.id" class="py-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/60">
              <div class="flex flex-wrap items-center gap-2">
                <span class="rounded bg-[var(--accent-50)] px-1.5 py-0.5 text-[10px] font-semibold uppercase text-[var(--accent-700)]">
                  {{ ts("st.search.kindApp") }}
                </span>
                <span class="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600 dark:bg-slate-700 dark:text-slate-400">{{ hit.moduleCode }}</span>
                <RegStatusBadge :status="hit.status" />
              </div>
              <p class="mt-1 font-mono text-xs text-slate-600 dark:text-slate-400">{{ hit.refNo }}</p>
              <p class="text-sm font-medium text-slate-900 dark:text-slate-100">{{ hit.applicantName }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                {{ appTypeLabel(hit.appType, ts) }} · {{ ts("st.common.submitted") }} {{ fmt(hit.submittedAt) }}
              </p>
            </li>
          </ul>
        </section>

        <section class="lg:pl-6">
          <div class="border-b border-slate-200 pb-2 dark:border-slate-700">
            <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {{ ts("st.search.registrations") }}
              <span class="text-slate-400 dark:text-slate-500">({{ regs.length }})</span>
            </h3>
          </div>
          <p v-if="regs.length === 0" class="py-8 text-center text-sm text-slate-400 dark:text-slate-500">{{ ts("st.common.noResults") }}</p>
          <ul v-else class="divide-y divide-slate-100 dark:divide-slate-800">
            <li v-for="hit in regs" :key="hit.id" class="py-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/60">
              <div class="flex flex-wrap items-center gap-2">
                <span class="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                  {{ ts("st.search.kindReg") }}
                </span>
                <span class="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600 dark:bg-slate-700 dark:text-slate-400">{{ hit.moduleCode }}</span>
                <ComplianceBadge :status="hit.compliance" />
              </div>
              <p class="mt-1 font-mono text-xs text-slate-600 dark:text-slate-400">{{ hit.certificateNo }}</p>
              <p class="text-sm font-medium text-slate-900 dark:text-slate-100">{{ hit.holderName }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                {{ ts(`st.mod.${hit.moduleCode}` as StMessageKey) }} · {{ ts("st.common.expires") }} {{ fmt(hit.expiresAt) }}
              </p>
            </li>
          </ul>
        </section>
      </div>
    </template>
  </div>
</template>
