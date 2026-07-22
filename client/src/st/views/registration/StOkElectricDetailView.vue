<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft, GitBranch, History, UserCheck } from "lucide-vue-next";

import { useLocale } from "@/composables/useLocale";
import { useStRegistrationStore } from "../../stores/registration";
import { appTypeLabel } from "../../composables/useRegistrationModule";
import {
  PLACE_RESTRICTIONS,
  VOLTAGE_RESTRICTIONS,
} from "../../registration/ok-rules";
import RegStatusBadge from "../../components/RegStatusBadge.vue";
import StPageHero from "../../components/StPageHero.vue";
import SupportingDocumentsList from "../../components/SupportingDocumentsList.vue";

const route = useRoute();
const router = useRouter();
const { ts, locale } = useLocale();
const regStore = useStRegistrationStore();

const app = computed(() => regStore.byId(String(route.params.id ?? "")));

function fmt(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(locale.value === "bi" ? "en-MY" : "ms-MY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function voltageLabel(code?: string): string {
  const row = VOLTAGE_RESTRICTIONS.find((v) => v.code === code);
  if (!row) return code ?? "—";
  return locale.value === "bi" ? row.bi : row.bm;
}

function placeLabel(code?: string): string {
  const row = PLACE_RESTRICTIONS.find((v) => v.code === code);
  if (!row) return code ?? "—";
  return locale.value === "bi" ? row.bi : row.bm;
}

const portalBase = computed(() => (route.path.startsWith("/admin/st") ? "/admin/st" : "/st"));

function back() {
  router.push(`${portalBase.value}/registration/ok-electric/applications`);
}
</script>

<template>
  <div v-if="!app" class="space-y-4">
    <p class="text-sm text-slate-500 dark:text-slate-400">{{ ts("st.common.noResults") }}</p>
    <button type="button" class="text-sm font-medium text-[var(--accent-700)]" @click="back">
      ← {{ ts("st.okDetail.backList") }}
    </button>
  </div>

  <div v-else class="space-y-5">
    <div>
      <button
        type="button"
        class="mb-2 flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
        @click="back"
      >
        <ArrowLeft class="h-3.5 w-3.5" /> {{ ts("st.okDetail.backList") }}
      </button>
      <StPageHero :title="ts('st.okDetail.title')">
        <template #action>
          <RegStatusBadge :status="app.status" />
        </template>
        <div class="mt-2 flex flex-wrap items-center gap-2">
          <span class="rounded-md bg-slate-100 dark:bg-slate-700 px-2 py-0.5 font-mono text-xs text-slate-600 dark:text-slate-400">RG-KE</span>
        </div>
        <p class="mt-1 font-mono text-sm text-slate-600 dark:text-slate-400">{{ app.refNo }}</p>
        <p v-if="app.workflowInstanceId" class="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <GitBranch class="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
          <span>Workflow</span>
          <router-link
            v-if="portalBase.startsWith('/admin')"
            class="font-mono text-[var(--accent-700)] hover:underline"
            :to="{ path: '/admin/workflows/instances', query: { id: app.workflowInstanceId } }"
            :title="app.workflowInstanceId"
          >
            {{ app.workflowInstanceId.slice(0, 8) }}…
          </router-link>
          <span v-else class="font-mono text-slate-600 dark:text-slate-400" :title="app.workflowInstanceId">
            {{ app.workflowInstanceId.slice(0, 8) }}…
          </span>
        </p>
      </StPageHero>
    </div>

    <p class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.common.mockNote") }}</p>

    <div class="grid gap-6 lg:grid-cols-3 lg:divide-x lg:divide-slate-200 dark:lg:divide-slate-700">
      <section class="lg:col-span-2 lg:pr-6">
        <h2 class="mb-3 flex items-center gap-2 border-b border-slate-200 pb-2 text-sm font-semibold text-slate-900 dark:border-slate-700 dark:text-slate-100"><UserCheck class="h-4 w-4 text-slate-400 dark:text-slate-500" /> {{ app.applicantName }}</h2>
        <dl class="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <div>
            <dt class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.common.identity") }}</dt>
            <dd class="font-mono text-slate-800 dark:text-slate-200">{{ app.identityNo }}</dd>
          </div>
          <div>
            <dt class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.common.type") }}</dt>
            <dd class="text-slate-800 dark:text-slate-200">{{ appTypeLabel(app.appType, ts) }}</dd>
          </div>
          <div>
            <dt class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.common.category") }}</dt>
            <dd class="text-slate-800 dark:text-slate-200">{{ app.categoryOrClass }}</dd>
          </div>
          <div>
            <dt class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.common.employer") }}</dt>
            <dd class="text-slate-800 dark:text-slate-200">{{ app.employerName ?? "—" }}</dd>
          </div>
          <div v-if="app.detail?.certificate">
            <dt class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.okApply.certNo") }}</dt>
            <dd class="font-mono text-slate-800 dark:text-slate-200">{{ app.detail.certificate.certificateNo }}</dd>
          </div>
          <div v-if="app.detail?.periodYears">
            <dt class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.okApply.period") }}</dt>
            <dd class="text-slate-800 dark:text-slate-200">{{ ts("st.okApply.periodYear", { n: app.detail.periodYears }) }}</dd>
          </div>
          <div v-if="app.detail?.certificate">
            <dt class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.okApply.voltage") }}</dt>
            <dd class="text-slate-800 dark:text-slate-200">{{ voltageLabel(app.detail.certificate.voltageRestriction) }}</dd>
          </div>
          <div v-if="app.detail?.certificate">
            <dt class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.okApply.place") }}</dt>
            <dd class="text-slate-800 dark:text-slate-200">{{ placeLabel(app.detail.certificate.placeRestriction) }}</dd>
          </div>
          <div v-if="app.detail?.gender">
            <dt class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.okApply.gender") }}</dt>
            <dd class="text-slate-800 dark:text-slate-200">
              {{ app.detail.gender === "male" ? ts("st.okApply.genderMale") : ts("st.okApply.genderFemale") }}
            </dd>
          </div>
          <div v-if="app.cdpPoints != null">
            <dt class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.common.cdp") }}</dt>
            <dd class="text-slate-800 dark:text-slate-200">{{ app.cdpPoints }}</dd>
          </div>
          <div>
            <dt class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.common.submitted") }}</dt>
            <dd class="text-slate-800 dark:text-slate-200">{{ fmt(app.submittedAt) }}</dd>
          </div>
          <div v-if="app.assignedOfficer">
            <dt class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.common.officer") }}</dt>
            <dd class="text-slate-800 dark:text-slate-200">{{ app.assignedOfficer }}</dd>
          </div>
        </dl>
        <p v-if="app.note" class="mt-3 rounded-md bg-amber-50 dark:bg-amber-500/15 px-3 py-2 text-xs text-amber-800 dark:text-amber-400">{{ app.note }}</p>
      </section>

      <section class="lg:pl-6">
        <h2 class="mb-3 flex items-center gap-2 border-b border-slate-200 pb-2 text-sm font-semibold text-slate-900 dark:border-slate-700 dark:text-slate-100"><History class="h-4 w-4 text-slate-400 dark:text-slate-500" /> {{ ts("st.okDetail.timeline") }}</h2>
        <ol class="space-y-3">
          <li
            v-for="(ev, i) in app.detail?.timeline ?? [{ at: app.submittedAt, label: app.status, actor: 'Sistem' }]"
            :key="i"
            class="relative border-l-2 border-slate-200 dark:border-slate-700 pl-3"
          >
            <p class="text-sm font-medium text-slate-800 dark:text-slate-200">{{ ev.label }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">{{ ev.actor }} · {{ fmt(ev.at) }}</p>
          </li>
        </ol>
      </section>
    </div>

    <section class="border-t border-slate-200 dark:border-slate-700 pt-6">
      <SupportingDocumentsList
        :documents="app.detail?.documents ?? []"
        :title="ts('st.okDetail.documents')"
        empty-text="—"
      />
    </section>
  </div>
</template>
