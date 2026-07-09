<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft, FileText } from "lucide-vue-next";

import { useLocale } from "@/composables/useLocale";
import { useStRegistrationStore } from "../../stores/registration";
import { appTypeLabel } from "../../composables/useRegistrationModule";
import {
  PLACE_RESTRICTIONS,
  VOLTAGE_RESTRICTIONS,
} from "../../registration/ok-rules";
import RegStatusBadge from "../../components/RegStatusBadge.vue";

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
    <p class="text-sm text-slate-500">{{ ts("st.common.noResults") }}</p>
    <button type="button" class="text-sm font-medium text-[var(--accent-700)]" @click="back">
      ← {{ ts("st.okDetail.backList") }}
    </button>
  </div>

  <div v-else class="space-y-5">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <button
          type="button"
          class="mb-2 flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800"
          @click="back"
        >
          <ArrowLeft class="h-3.5 w-3.5" /> {{ ts("st.okDetail.backList") }}
        </button>
        <div class="flex flex-wrap items-center gap-2">
          <h1 class="text-xl font-semibold text-slate-900">{{ ts("st.okDetail.title") }}</h1>
          <span class="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600">RG-KE</span>
          <RegStatusBadge :status="app.status" />
        </div>
        <p class="mt-1 font-mono text-sm text-slate-600">{{ app.refNo }}</p>
      </div>
    </div>

    <p class="text-xs text-slate-400">{{ ts("st.common.mockNote") }}</p>

    <div class="grid gap-4 lg:grid-cols-3">
      <section class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">
        <h2 class="mb-3 text-sm font-semibold text-slate-800">{{ app.applicantName }}</h2>
        <dl class="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <div>
            <dt class="text-xs text-slate-400">{{ ts("st.common.identity") }}</dt>
            <dd class="font-mono text-slate-800">{{ app.identityNo }}</dd>
          </div>
          <div>
            <dt class="text-xs text-slate-400">{{ ts("st.common.type") }}</dt>
            <dd class="text-slate-800">{{ appTypeLabel(app.appType, ts) }}</dd>
          </div>
          <div>
            <dt class="text-xs text-slate-400">{{ ts("st.common.category") }}</dt>
            <dd class="text-slate-800">{{ app.categoryOrClass }}</dd>
          </div>
          <div>
            <dt class="text-xs text-slate-400">{{ ts("st.common.employer") }}</dt>
            <dd class="text-slate-800">{{ app.employerName ?? "—" }}</dd>
          </div>
          <div v-if="app.detail?.certificate">
            <dt class="text-xs text-slate-400">{{ ts("st.okApply.certNo") }}</dt>
            <dd class="font-mono text-slate-800">{{ app.detail.certificate.certificateNo }}</dd>
          </div>
          <div v-if="app.detail?.periodYears">
            <dt class="text-xs text-slate-400">{{ ts("st.okApply.period") }}</dt>
            <dd class="text-slate-800">{{ ts("st.okApply.periodYear", { n: app.detail.periodYears }) }}</dd>
          </div>
          <div v-if="app.detail?.certificate">
            <dt class="text-xs text-slate-400">{{ ts("st.okApply.voltage") }}</dt>
            <dd class="text-slate-800">{{ voltageLabel(app.detail.certificate.voltageRestriction) }}</dd>
          </div>
          <div v-if="app.detail?.certificate">
            <dt class="text-xs text-slate-400">{{ ts("st.okApply.place") }}</dt>
            <dd class="text-slate-800">{{ placeLabel(app.detail.certificate.placeRestriction) }}</dd>
          </div>
          <div v-if="app.detail?.gender">
            <dt class="text-xs text-slate-400">{{ ts("st.okApply.gender") }}</dt>
            <dd class="text-slate-800">
              {{ app.detail.gender === "male" ? ts("st.okApply.genderMale") : ts("st.okApply.genderFemale") }}
            </dd>
          </div>
          <div v-if="app.cdpPoints != null">
            <dt class="text-xs text-slate-400">{{ ts("st.common.cdp") }}</dt>
            <dd class="text-slate-800">{{ app.cdpPoints }}</dd>
          </div>
          <div>
            <dt class="text-xs text-slate-400">{{ ts("st.common.submitted") }}</dt>
            <dd class="text-slate-800">{{ fmt(app.submittedAt) }}</dd>
          </div>
          <div v-if="app.assignedOfficer">
            <dt class="text-xs text-slate-400">{{ ts("st.common.officer") }}</dt>
            <dd class="text-slate-800">{{ app.assignedOfficer }}</dd>
          </div>
        </dl>
        <p v-if="app.note" class="mt-3 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">{{ app.note }}</p>
      </section>

      <section class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 class="mb-3 text-sm font-semibold text-slate-800">{{ ts("st.okDetail.timeline") }}</h2>
        <ol class="space-y-3">
          <li
            v-for="(ev, i) in app.detail?.timeline ?? [{ at: app.submittedAt, label: app.status, actor: 'Sistem' }]"
            :key="i"
            class="relative border-l-2 border-slate-200 pl-3"
          >
            <p class="text-sm font-medium text-slate-800">{{ ev.label }}</p>
            <p class="text-xs text-slate-500">{{ ev.actor }} · {{ fmt(ev.at) }}</p>
          </li>
        </ol>
      </section>
    </div>

    <section class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 class="mb-3 text-sm font-semibold text-slate-800">{{ ts("st.okDetail.documents") }}</h2>
      <ul v-if="app.detail?.documents?.length" class="space-y-2">
        <li
          v-for="(doc, i) in app.detail.documents"
          :key="i"
          class="flex items-center gap-2 rounded-md border border-slate-100 px-3 py-2 text-sm"
        >
          <FileText class="h-4 w-4 text-slate-400" />
          <span class="font-medium text-slate-700">{{ doc.label }}</span>
          <span class="text-xs text-slate-400">{{ doc.fileName }}</span>
        </li>
      </ul>
      <p v-else class="text-sm text-slate-400">—</p>
    </section>
  </div>
</template>
