<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft, FileText } from "lucide-vue-next";

import { useLocale } from "@/composables/useLocale";
import { useStRegistrationStore } from "../../stores/registration";
import { contractorKindMeta, type ContractorKind } from "../../registration/ce-rules";
import { appTypeLabel } from "../../composables/useRegistrationModule";
import RegStatusBadge from "../../components/RegStatusBadge.vue";

const route = useRoute();
const router = useRouter();
const { ts, locale } = useLocale();
const regStore = useStRegistrationStore();

const app = computed(() => regStore.byId(String(route.params.id ?? "")));
const ce = computed(() => (app.value?.detail?.ce ?? {}) as Record<string, unknown>);
const portalBase = computed(() => (route.path.startsWith("/admin/st") ? "/admin/st" : "/st"));

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

function kindLabel(code?: unknown): string {
  if (typeof code !== "string") return "—";
  const k = contractorKindMeta(code as ContractorKind);
  return locale.value === "bi" ? k.bi : k.bm;
}

function back() {
  router.push(`${portalBase.value}/registration/contractor-electric/applications`);
}

const directors = computed(() => (Array.isArray(ce.value.directors) ? ce.value.directors : []) as Array<Record<string, unknown>>);
const oks = computed(() => (Array.isArray(ce.value.appointedOks) ? ce.value.appointedOks : []) as Array<Record<string, unknown>>);
const skilled = computed(() => (Array.isArray(ce.value.skilledPersons) ? ce.value.skilledPersons : []) as Array<Record<string, unknown>>);
const engineers = computed(() => (Array.isArray(ce.value.professionalEngineers) ? ce.value.professionalEngineers : []) as Array<Record<string, unknown>>);
const equipment = computed(() => (Array.isArray(ce.value.equipment) ? ce.value.equipment : []) as Array<Record<string, unknown>>);
</script>

<template>
  <div v-if="!app" class="space-y-4">
    <p class="text-sm text-slate-500">{{ ts("st.common.noResults") }}</p>
    <button type="button" class="text-sm font-medium text-[var(--accent-700)]" @click="back">← {{ ts("st.ceDetail.backList") }}</button>
  </div>

  <div v-else class="space-y-5">
    <div>
      <button type="button" class="mb-2 flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800" @click="back">
        <ArrowLeft class="h-3.5 w-3.5" /> {{ ts("st.ceDetail.backList") }}
      </button>
      <div class="flex flex-wrap items-center gap-2">
        <h1 class="text-xl font-semibold text-slate-900">{{ ts("st.ceDetail.title") }}</h1>
        <span class="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600">RG-CE</span>
        <RegStatusBadge :status="app.status" />
      </div>
      <p class="mt-1 font-mono text-sm text-slate-600">{{ app.refNo }}</p>
    </div>

    <p class="text-xs text-slate-400">{{ ts("st.common.mockNote") }}</p>

    <div class="grid gap-6 lg:grid-cols-2 lg:divide-x lg:divide-slate-200">
      <section>
        <h2 class="mb-3 text-sm font-semibold text-slate-900">{{ ts("st.ceApply.stepA") }} / {{ ts("st.ceApply.stepB") }}</h2>
        <dl class="grid gap-2 text-sm sm:grid-cols-2">
          <div><dt class="text-xs text-slate-400">{{ ts("st.ceApply.kind") }}</dt><dd>{{ kindLabel(ce.contractorKind) }}</dd></div>
          <div><dt class="text-xs text-slate-400">{{ ts("st.ceApply.class") }}</dt><dd>{{ ce.contractorClass ?? "—" }}</dd></div>
          <div><dt class="text-xs text-slate-400">{{ ts("st.ceApply.voltage") }}</dt><dd>{{ ce.voltage ?? "—" }}</dd></div>
          <div><dt class="text-xs text-slate-400">{{ ts("st.ceApply.period") }}</dt><dd>{{ app.detail?.periodYears ?? "—" }}</dd></div>
          <div class="sm:col-span-2"><dt class="text-xs text-slate-400">{{ ts("st.ceApply.companyName") }}</dt><dd class="font-medium">{{ ce.companyName ?? app.applicantName }}</dd></div>
          <div><dt class="text-xs text-slate-400">{{ ts("st.ceApply.companyReg") }}</dt><dd class="font-mono text-xs">{{ ce.companyRegNo ?? app.identityNo }}</dd></div>
          <div><dt class="text-xs text-slate-400">{{ ts("st.common.type") }}</dt><dd>{{ appTypeLabel(app.appType, ts) }}</dd></div>
          <div class="sm:col-span-2"><dt class="text-xs text-slate-400">{{ ts("st.ceApply.companyAddress") }}</dt><dd>{{ ce.companyAddress }} · {{ ce.postcode }} {{ ce.city }}, {{ ce.state }}</dd></div>
          <div><dt class="text-xs text-slate-400">{{ ts("st.ceApply.companyPhone") }}</dt><dd>{{ ce.companyPhone }}</dd></div>
          <div><dt class="text-xs text-slate-400">{{ ts("st.ceApply.companyFax") }}</dt><dd>{{ ce.companyFax || "—" }}</dd></div>
          <div><dt class="text-xs text-slate-400">{{ ts("st.ceApply.repName") }}</dt><dd>{{ ce.representativeName }}</dd></div>
          <div><dt class="text-xs text-slate-400">{{ ts("st.ceApply.repIc") }}</dt><dd class="font-mono text-xs">{{ ce.representativeIc }}</dd></div>
        </dl>
      </section>

      <section class="lg:pl-6">
        <h2 class="mb-3 text-sm font-semibold text-slate-900">{{ ts("st.okDetail.timeline") }}</h2>
        <ol class="space-y-3">
          <li v-for="(ev, i) in app.detail?.timeline ?? []" :key="i" class="border-l-2 border-slate-200 pl-3">
            <p class="text-sm font-medium text-slate-800">{{ ev.label }}</p>
            <p class="text-xs text-slate-500">{{ ev.actor }} · {{ fmt(ev.at) }}</p>
          </li>
        </ol>
      </section>
    </div>

    <section class="border-t border-slate-200 pt-6">
      <h2 class="mb-2 text-sm font-semibold text-slate-900">{{ ts("st.ceApply.directors") }}</h2>
      <ul class="divide-y divide-slate-100 text-sm">
        <li v-for="(d, i) in directors" :key="i" class="py-2">
          <span class="font-medium">{{ d.name }}</span>
          <span class="ml-2 font-mono text-xs text-slate-500">{{ d.icNumber }}</span>
          <span class="ml-2 text-xs text-slate-400">{{ d.sharePercent }}%</span>
          <p class="text-xs text-slate-500">{{ d.address }}</p>
        </li>
        <li v-if="!directors.length" class="py-2 text-slate-400">—</li>
      </ul>
    </section>

    <div class="grid gap-6 border-t border-slate-200 pt-6 lg:grid-cols-2 lg:divide-x lg:divide-slate-200">
      <section>
        <h2 class="mb-3 text-sm font-semibold text-slate-900">{{ ts("st.ceApply.stepC") }}</h2>
        <ul class="divide-y divide-slate-100 text-sm">
          <li v-for="(o, i) in oks" :key="'ok'+i" class="py-2">
            <p class="font-medium">{{ o.name }} <span class="text-xs text-slate-500">({{ o.wirerType }})</span></p>
            <p class="font-mono text-xs text-slate-500">{{ o.mykad }} · {{ o.certificateNo }} · {{ o.periodYears }}y</p>
          </li>
          <li v-for="(s, i) in skilled" :key="'sk'+i" class="py-2">
            <p class="font-medium">{{ s.name }}</p>
            <p class="text-xs text-slate-500">{{ s.qualification }} · {{ s.field }}</p>
          </li>
          <li v-for="(e, i) in engineers" :key="'pe'+i" class="py-2">
            <p class="font-medium">{{ e.name }}</p>
            <p class="text-xs text-slate-500">{{ e.registrationNo }} · {{ e.icNumber }}</p>
          </li>
          <li v-if="!oks.length && !skilled.length && !engineers.length" class="py-2 text-slate-400">—</li>
        </ul>
      </section>

      <section class="lg:pl-6">
        <h2 class="mb-3 text-sm font-semibold text-slate-900">{{ ts("st.ceApply.equipment") }}</h2>
        <ul class="divide-y divide-slate-100 text-sm">
          <li v-for="(eq, i) in equipment" :key="i" class="py-2">
            <p class="font-medium">{{ eq.equipmentType }} · {{ eq.brand }}</p>
            <p class="text-xs text-slate-500">{{ eq.model }} · S/N {{ eq.serialNo }}</p>
          </li>
          <li v-if="!equipment.length" class="py-2 text-slate-400">—</li>
        </ul>
      </section>
    </div>

    <section class="border-t border-slate-200 pt-6">
      <h2 class="mb-2 text-sm font-semibold text-slate-900">{{ ts("st.okDetail.documents") }}</h2>
      <ul v-if="app.detail?.documents?.length">
        <li v-for="(doc, i) in app.detail.documents" :key="i" class="flex items-center gap-2 border-b border-slate-100 py-2 text-sm last:border-0">
          <FileText class="h-4 w-4 text-slate-400" />
          <span class="font-medium text-slate-700">{{ doc.label }}</span>
          <span class="text-xs text-slate-400">{{ doc.fileName }}</span>
        </li>
      </ul>
      <p v-else class="text-sm text-slate-400">—</p>
    </section>
  </div>
</template>
