<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { FilePlus2, Filter, Sparkles } from "lucide-vue-next";

import { useLocale } from "@/composables/useLocale";
import type { StMessageKey } from "@/i18n/st-messages";
import type { ApplicationStatus } from "../../types";
import type { RegistrationAppType, RegistrationApplication } from "../../mock/registration";
import { useStEmployerStore } from "../../stores/employer";
import { useStRegistrationStore } from "../../stores/registration";
import { useStSessionStore } from "../../stores/session";
import { appTypeLabel, useRegistrationModule } from "../../composables/useRegistrationModule";
import type { SmartTableColumn } from "../../composables/useSmartTable";
import RegStatusBadge from "../../components/RegStatusBadge.vue";
import SmartTable from "../../components/SmartTable.vue";

const route = useRoute();
const router = useRouter();
const { ts, locale } = useLocale();
const regStore = useStRegistrationStore();
const session = useStSessionStore();
const employerStore = useStEmployerStore();
const { code, def, title, subtitle, actRef, processTypes, docChecklist, eligibility } = useRegistrationModule();

const portalBase = computed(() => (route.path.startsWith("/admin/st") ? "/admin/st" : "/st"));
const statusFilter = ref<ApplicationStatus | "">("");
const typeFilter = ref<RegistrationAppType | "">("");
const showGuide = ref(true);

function norm(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

/** Majikan only sees contractor apps owned by their organisation / persona. */
function belongsToCurrentEmployer(a: RegistrationApplication): boolean {
  const persona = session.currentPersona;
  const mine = employerStore.myEmployer;
  if (!persona && !mine) return false;

  const org = norm(mine?.name ?? persona?.organisation);
  const personaId = persona?.id ?? null;
  const employerId = mine?.id ?? null;
  const ce = a.detail?.ce as { representativeName?: string; companyName?: string } | undefined;

  if (employerId && a.detail?.employerId === employerId) return true;
  if (personaId && a.detail?.applicantPersonaId === personaId) return true;
  if (org && (norm(a.applicantName) === org || norm(a.employerName) === org || norm(ce?.companyName) === org)) {
    return true;
  }
  if (persona?.name && ce?.representativeName && norm(ce.representativeName) === norm(persona.name)) {
    return true;
  }
  return false;
}

const scopedApps = computed(() => {
  if (!code.value) return [];
  const all = regStore.applicationsFor(code.value);
  // Fail closed for majikan — never show other employers' contractor apps.
  if (session.role === "employer") return all.filter(belongsToCurrentEmployer);
  return all;
});

const rows = computed(() => {
  return scopedApps.value.filter((a) => {
    if (statusFilter.value && a.status !== statusFilter.value) return false;
    if (typeFilter.value && a.appType !== typeFilter.value) return false;
    return true;
  });
});

const stats = computed(() => {
  const all = scopedApps.value;
  const terminal = new Set(["certificate_issued", "rejected", "withdrawn"]);
  return {
    total: all.length,
    inProgress: all.filter((a) => !terminal.has(a.status) && a.status !== "query_applicant").length,
    query: all.filter((a) => a.status === "query_applicant").length,
    issued: all.filter((a) => a.status === "certificate_issued").length,
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

function startNewApplication() {
  if (!def.value) return;
  if (code.value === "RG-KE") {
    router.push(`${portalBase.value}/registration/ok-electric/applications/new`);
    return;
  }
  if (code.value === "RG-CE") {
    router.push(`${portalBase.value}/registration/contractor-electric/applications/new`);
    return;
  }
  const type = def.value.domain === "contractor" ? "CE" : "OK";
  router.push({ path: `${portalBase.value}/applications/new`, query: { type } });
}

function openRow(id: string) {
  if (code.value === "RG-KE") {
    router.push(`${portalBase.value}/registration/ok-electric/applications/${id}`);
    return;
  }
  if (code.value === "RG-CE") {
    router.push(`${portalBase.value}/registration/contractor-electric/applications/${id}`);
  }
}

const STATUS_OPTIONS: ApplicationStatus[] = [
  "sos_review",
  "technical_review",
  "pending_approval",
  "query_applicant",
  "awaiting_employer_confirm",
  "awaiting_final_submit",
  "awaiting_processing_payment",
  "awaiting_registration_payment",
  "certificate_issued",
];

type RegAppRow = (typeof rows.value)[number];

const columns = computed<SmartTableColumn<RegAppRow>[]>(() => [
  { key: "refNo", label: ts("st.common.refNo"), value: (row) => row.refNo },
  { key: "applicant", label: ts("st.common.applicant"), value: (row) => row.applicantName },
  { key: "type", label: ts("st.common.type"), value: (row) => appTypeLabel(row.appType, ts) },
  { key: "category", label: categoryLabel.value, value: (row) => row.categoryOrClass },
  { key: "submitted", label: ts("st.common.submitted"), value: (row) => fmt(row.submittedAt) },
  { key: "status", label: ts("st.common.status"), value: (row) => ts(`st.status.${row.status}` as StMessageKey) },
  { key: "action", label: ts("st.common.action"), value: () => "", filterable: false },
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
            <h1 class="text-xl font-semibold text-slate-900">{{ title }}</h1>
            <span class="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600">{{ code }}</span>
          </div>
          <p class="mt-0.5 text-sm text-slate-500">{{ subtitle }}</p>
          <p class="mt-1 text-xs text-slate-400">{{ actRef }}</p>
        </div>
      </div>
      <button
        type="button"
        class="flex items-center gap-2 rounded-md bg-[var(--accent-600)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-700)]"
        @click="startNewApplication"
      >
        <FilePlus2 class="h-4 w-4" /> {{ ts("st.reg.newApplication") }}
      </button>
    </div>

    <p class="text-xs text-slate-400">{{ ts("st.common.mockNote") }}</p>

    <div class="grid grid-cols-2 gap-y-4 sm:grid-cols-4 sm:divide-x sm:divide-slate-200">
      <div class="px-0 sm:px-5 sm:first:pl-0">
        <p class="text-2xl font-bold text-slate-900">{{ stats.total }}</p>
        <p class="text-xs text-slate-500">{{ ts("st.reg.statTotal") }}</p>
      </div>
      <div class="px-0 sm:px-5">
        <p class="text-2xl font-bold text-amber-600">{{ stats.inProgress }}</p>
        <p class="text-xs text-slate-500">{{ ts("st.reg.statInProgress") }}</p>
      </div>
      <div class="px-0 sm:px-5">
        <p class="text-2xl font-bold text-orange-600">{{ stats.query }}</p>
        <p class="text-xs text-slate-500">{{ ts("st.reg.statQuery") }}</p>
      </div>
      <div class="px-0 sm:px-5">
        <p class="text-2xl font-bold text-emerald-600">{{ stats.issued }}</p>
        <p class="text-xs text-slate-500">{{ ts("st.reg.statIssued") }}</p>
      </div>
    </div>

    <section v-if="showGuide" class="overflow-hidden rounded-xl border border-[var(--accent-200)] bg-[var(--accent-50)]">
      <div class="flex items-start justify-between gap-3 border-b border-[var(--accent-100)] px-4 py-3">
        <div class="flex items-center gap-2">
          <Sparkles class="h-4 w-4 text-[var(--accent-700)]" />
          <h2 class="text-sm font-semibold text-slate-900">{{ ts("st.reg.guidedTitle") }}</h2>
        </div>
        <button type="button" class="text-xs text-slate-400 hover:text-slate-600" @click="showGuide = false">✕</button>
      </div>
      <div class="grid gap-4 p-4 lg:grid-cols-3">
        <p class="text-sm leading-relaxed text-slate-600 lg:col-span-1">{{ ts("st.reg.guidedBody") }}</p>
        <div>
          <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{{ ts("st.reg.eligibility") }}</p>
          <ul class="space-y-1.5 text-sm text-slate-700">
            <li v-for="(item, i) in eligibility" :key="i" class="flex gap-2">
              <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-500)]" />
              {{ item }}
            </li>
          </ul>
        </div>
        <div>
          <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{{ ts("st.reg.docChecklist") }}</p>
          <ul class="space-y-1.5 text-sm text-slate-700">
            <li v-for="(item, i) in docChecklist" :key="i" class="flex gap-2">
              <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
      <div class="border-t border-[var(--accent-100)] px-4 py-3">
        <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{{ ts("st.reg.processTypes") }}</p>
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="pt in processTypes"
            :key="pt"
            class="rounded-md bg-white px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200"
          >
            {{ appTypeLabel(pt, ts) }}
          </span>
        </div>
      </div>
    </section>

    <div class="flex flex-wrap items-center gap-3">
      <Filter class="h-4 w-4 text-slate-400" />
      <select v-model="typeFilter" class="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700">
        <option value="">{{ ts("st.reg.filterType") }} — {{ ts("st.common.filterAll") }}</option>
        <option v-for="pt in processTypes" :key="pt" :value="pt">{{ appTypeLabel(pt, ts) }}</option>
      </select>
      <select v-model="statusFilter" class="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700">
        <option value="">{{ ts("st.reg.filterStatus") }} — {{ ts("st.common.filterAll") }}</option>
        <option v-for="s in STATUS_OPTIONS" :key="s" :value="s">{{ ts(`st.status.${s}` as StMessageKey) }}</option>
      </select>
    </div>

    <div class="border-t border-slate-200 pt-6">
      <h2 class="mb-2 text-sm font-semibold text-slate-900">{{ ts("st.reg.applications") }}</h2>
      <SmartTable
        :rows="rows"
        :columns="columns"
        :row-key="(row) => row.id"
        clickable-rows
        :empty-text="ts('st.reg.emptyApps')"
        @row-click="(row) => openRow(row.id)"
      >
        <template #cell-refNo="{ row }">
          <span class="font-mono text-xs text-slate-700">{{ row.refNo }}</span>
        </template>
        <template #cell-applicant="{ row }">
          <p class="font-medium text-slate-800">{{ row.applicantName }}</p>
          <p class="text-xs text-slate-400">{{ row.identityNo }}</p>
        </template>
        <template #cell-type="{ row }">
          <span class="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600">
            {{ appTypeLabel(row.appType, ts) }}
          </span>
        </template>
        <template #cell-status="{ row }">
          <RegStatusBadge :status="row.status" />
        </template>
        <template #cell-action>
          <span class="text-xs font-medium text-[var(--accent-700)]">{{ ts("st.common.view") }} →</span>
        </template>
      </SmartTable>
    </div>
  </div>
</template>
