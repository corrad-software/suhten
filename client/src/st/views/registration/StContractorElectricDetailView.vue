<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft, BadgeCheck, CreditCard, Send, Loader2 } from "lucide-vue-next";

import { useLocale } from "@/composables/useLocale";
import { useToast } from "@/composables/useToast";
import { useStRegistrationStore } from "../../stores/registration";
import { useStWorkflowStore } from "../../stores/workflow";
import { contractorKindMeta, type ContractorKind } from "../../registration/ce-rules";
import { appTypeLabel } from "../../composables/useRegistrationModule";
import RegStatusBadge from "../../components/RegStatusBadge.vue";
import StPageHero from "../../components/StPageHero.vue";
import SupportingDocumentsList from "../../components/SupportingDocumentsList.vue";

const route = useRoute();
const router = useRouter();
const { ts, locale } = useLocale();
const toast = useToast();
const regStore = useStRegistrationStore();
const workflow = useStWorkflowStore();

const app = computed(() => regStore.byId(String(route.params.id ?? "")));
const ce = computed(() => (app.value?.detail?.ce ?? {}) as Record<string, unknown>);
const portalBase = computed(() => (route.path.startsWith("/admin/st") ? "/admin/st" : "/st"));
const submitting = ref(false);

onMounted(() => {
  void workflow.syncFromApi();
  void regStore.fetchFromApi();
});

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

function viewCertificate() {
  if (!app.value) return;
  router.push(`${portalBase.value}/applications/${app.value.id}/certificate`);
}

function goPay(kind: "processing" | "registration") {
  if (!app.value) return;
  router.push(`${portalBase.value}/applications/${app.value.id}/pay/${kind}`);
}

async function ensureWorkflowApp(): Promise<boolean> {
  if (!app.value) return false;
  if (workflow.byId(app.value.id)) return true;
  await workflow.syncFromApi();
  return Boolean(workflow.byId(app.value.id));
}

async function submitFinal() {
  if (!app.value || submitting.value) return;
  submitting.value = true;
  try {
    const ok = await ensureWorkflowApp();
    if (!ok) {
      toast.error("Gagal", "Permohonan tidak dijumpai untuk penghantaran. Sila muat semula halaman.");
      return;
    }
    await workflow.transition(app.value.id, "submit_final");
    // Keep registration list/detail status in sync immediately.
    const twin = regStore.byId(app.value.id);
    if (twin) {
      twin.status = "awaiting_processing_payment";
      twin.stageEnteredAt = new Date().toISOString();
    }
    toast.success("Berjaya", "Permohonan telah dihantar. Sila buat bayaran fi proses.");
  } catch (e) {
    toast.error("Gagal", e instanceof Error ? e.message : "Penghantaran gagal.");
  } finally {
    submitting.value = false;
  }
}

const directors = computed(() => (Array.isArray(ce.value.directors) ? ce.value.directors : []) as Array<Record<string, unknown>>);
const oks = computed(() => (Array.isArray(ce.value.appointedOks) ? ce.value.appointedOks : []) as Array<Record<string, unknown>>);
const skilled = computed(() => (Array.isArray(ce.value.skilledPersons) ? ce.value.skilledPersons : []) as Array<Record<string, unknown>>);
const engineers = computed(() => (Array.isArray(ce.value.professionalEngineers) ? ce.value.professionalEngineers : []) as Array<Record<string, unknown>>);
const equipment = computed(() => (Array.isArray(ce.value.equipment) ? ce.value.equipment : []) as Array<Record<string, unknown>>);

const companyAddressLine = computed(() => {
  const street = typeof ce.value.companyAddress === "string" ? ce.value.companyAddress.trim() : "";
  const postcode = typeof ce.value.postcode === "string" ? ce.value.postcode.trim() : "";
  const city = typeof ce.value.city === "string" ? ce.value.city.trim() : "";
  const state = typeof ce.value.state === "string" ? ce.value.state.trim() : "";
  const locality = [postcode, city].filter(Boolean).join(" ");
  const parts = [street, [locality, state].filter(Boolean).join(", ")].filter(Boolean);
  return parts.length ? parts.join(" · ") : "—";
});
</script>

<template>
  <div v-if="!app" class="space-y-4">
    <p class="text-sm text-slate-500 dark:text-slate-400">{{ ts("st.common.noResults") }}</p>
    <button type="button" class="text-sm font-medium text-[var(--accent-700)]" @click="back">← {{ ts("st.ceDetail.backList") }}</button>
  </div>

  <div v-else class="space-y-5">
    <div>
      <button type="button" class="mb-2 flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200" @click="back">
        <ArrowLeft class="h-3.5 w-3.5" /> {{ ts("st.ceDetail.backList") }}
      </button>
      <StPageHero :title="ts('st.ceDetail.title')">
        <template #action>
          <RegStatusBadge :status="app.status" />
        </template>
        <div class="mt-2 flex flex-wrap items-center gap-2">
          <span class="rounded-md bg-slate-100 dark:bg-slate-700 px-2 py-0.5 font-mono text-xs text-slate-600 dark:text-slate-400">RG-CE</span>
        </div>
        <p class="mt-1 font-mono text-sm text-slate-600 dark:text-slate-400">{{ app.refNo }}</p>
      </StPageHero>
    </div>

    <div
      v-if="app.status === 'awaiting_final_submit'"
      class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-500/15 px-4 py-3"
    >
      <p class="text-sm text-amber-950 dark:text-amber-400">{{ ts("st.ceDetail.submitFinalHint") }}</p>
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-md bg-[var(--accent-600)] px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--accent-700)] disabled:opacity-60"
        :disabled="submitting"
        @click="submitFinal"
      >
        <Loader2 v-if="submitting" class="h-4 w-4 animate-spin" />
        <Send v-else class="h-4 w-4" />
        {{ ts("st.ceDetail.submitFinal") }}
      </button>
    </div>

    <div
      v-else-if="app.status === 'awaiting_processing_payment'"
      class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-500/15 px-4 py-3"
    >
      <p class="text-sm text-amber-950 dark:text-amber-400">{{ ts("st.ceDetail.payProcessingHint") }}</p>
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-md bg-[var(--accent-600)] px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--accent-700)]"
        @click="goPay('processing')"
      >
        <CreditCard class="h-4 w-4" />
        {{ ts("st.ceDetail.payProcessing") }}
      </button>
    </div>

    <div
      v-else-if="app.status === 'awaiting_registration_payment'"
      class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-500/15 px-4 py-3"
    >
      <p class="text-sm text-amber-950 dark:text-amber-400">{{ ts("st.ceDetail.payRegistrationHint") }}</p>
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-md bg-[var(--accent-600)] px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--accent-700)]"
        @click="goPay('registration')"
      >
        <CreditCard class="h-4 w-4" />
        {{ ts("st.ceDetail.payRegistration") }}
      </button>
    </div>

    <div
      v-else-if="app.status === 'certificate_issued'"
      class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/80 dark:bg-emerald-500/15 px-4 py-3"
    >
      <p class="text-sm text-emerald-900 dark:text-emerald-400">{{ ts("st.ceDetail.certIssuedHint") }}</p>
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-md bg-[var(--accent-600)] px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--accent-700)]"
        @click="viewCertificate"
      >
        <BadgeCheck class="h-4 w-4" />
        {{ ts("st.ceDetail.viewCert") }}
      </button>
    </div>

    <p class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.common.mockNote") }}</p>

    <div class="grid gap-6 lg:grid-cols-2 lg:divide-x lg:divide-slate-200 dark:lg:divide-slate-700">
      <section>
        <h2 class="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{{ ts("st.ceApply.stepA") }} / {{ ts("st.ceApply.stepB") }}</h2>
        <dl class="grid gap-2 text-sm sm:grid-cols-2">
          <div><dt class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.ceApply.kind") }}</dt><dd>{{ kindLabel(ce.contractorKind) }}</dd></div>
          <div><dt class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.ceApply.class") }}</dt><dd>{{ ce.contractorClass ?? "—" }}</dd></div>
          <div><dt class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.ceApply.voltage") }}</dt><dd>{{ ce.voltage ?? "—" }}</dd></div>
          <div><dt class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.ceApply.period") }}</dt><dd>{{ app.detail?.periodYears ?? "—" }}</dd></div>
          <div class="sm:col-span-2"><dt class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.ceApply.companyName") }}</dt><dd class="font-medium">{{ ce.companyName ?? app.applicantName }}</dd></div>
          <div><dt class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.ceApply.companyReg") }}</dt><dd class="font-mono text-xs">{{ ce.companyRegNo ?? app.identityNo }}</dd></div>
          <div><dt class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.common.type") }}</dt><dd>{{ appTypeLabel(app.appType, ts) }}</dd></div>
          <div class="sm:col-span-2">
            <dt class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.ceApply.companyAddress") }}</dt>
            <dd>{{ companyAddressLine }}</dd>
          </div>
          <div><dt class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.ceApply.companyPhone") }}</dt><dd>{{ ce.companyPhone || "—" }}</dd></div>
          <div><dt class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.ceApply.companyFax") }}</dt><dd>{{ ce.companyFax || "—" }}</dd></div>
          <div><dt class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.ceApply.repName") }}</dt><dd>{{ ce.representativeName || "—" }}</dd></div>
          <div><dt class="text-xs text-slate-400 dark:text-slate-500">{{ ts("st.ceApply.repIc") }}</dt><dd class="font-mono text-xs">{{ ce.representativeIc || "—" }}</dd></div>
        </dl>
      </section>

      <section class="lg:pl-6">
        <h2 class="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{{ ts("st.okDetail.timeline") }}</h2>
        <ol class="space-y-3">
          <li v-for="(ev, i) in app.detail?.timeline ?? []" :key="i" class="border-l-2 border-slate-200 dark:border-slate-700 pl-3">
            <p class="text-sm font-medium text-slate-800 dark:text-slate-200">{{ ev.label }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">{{ ev.actor }} · {{ fmt(ev.at) }}</p>
          </li>
        </ol>
      </section>
    </div>

    <section class="border-t border-slate-200 dark:border-slate-700 pt-6">
      <h2 class="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{{ ts("st.ceApply.directors") }}</h2>
      <ul class="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
        <li v-for="(d, i) in directors" :key="i" class="py-2">
          <span class="font-medium">{{ d.name }}</span>
          <span class="ml-2 font-mono text-xs text-slate-500 dark:text-slate-400">{{ d.icNumber }}</span>
          <span class="ml-2 text-xs text-slate-400 dark:text-slate-500">{{ d.sharePercent }}%</span>
          <p class="text-xs text-slate-500 dark:text-slate-400">{{ d.address }}</p>
        </li>
        <li v-if="!directors.length" class="py-2 text-slate-400 dark:text-slate-500">—</li>
      </ul>
    </section>

    <div class="grid gap-6 border-t border-slate-200 dark:border-slate-700 pt-6 lg:grid-cols-2 lg:divide-x lg:divide-slate-200 dark:lg:divide-slate-700">
      <section>
        <h2 class="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{{ ts("st.ceApply.stepC") }}</h2>
        <ul class="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
          <li v-for="(o, i) in oks" :key="'ok'+i" class="py-2">
            <p class="font-medium">{{ o.name }} <span class="text-xs text-slate-500 dark:text-slate-400">({{ o.wirerType }})</span></p>
            <p class="font-mono text-xs text-slate-500 dark:text-slate-400">{{ o.mykad }} · {{ o.certificateNo }} · {{ o.periodYears }}y</p>
          </li>
          <li v-for="(s, i) in skilled" :key="'sk'+i" class="py-2">
            <p class="font-medium">{{ s.name }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">{{ s.qualification }} · {{ s.field }}</p>
          </li>
          <li v-for="(e, i) in engineers" :key="'pe'+i" class="py-2">
            <p class="font-medium">{{ e.name }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">{{ e.registrationNo }} · {{ e.icNumber }}</p>
          </li>
          <li v-if="!oks.length && !skilled.length && !engineers.length" class="py-2 text-slate-400 dark:text-slate-500">—</li>
        </ul>
      </section>

      <section class="lg:pl-6">
        <h2 class="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{{ ts("st.ceApply.equipment") }}</h2>
        <ul class="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
          <li v-for="(eq, i) in equipment" :key="i" class="py-2">
            <p class="font-medium">{{ eq.equipmentType }} · {{ eq.brand }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">{{ eq.model }} · S/N {{ eq.serialNo }}</p>
          </li>
          <li v-if="!equipment.length" class="py-2 text-slate-400 dark:text-slate-500">—</li>
        </ul>
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
