<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { AlertTriangle, Check, Download, Search, Sparkles } from "lucide-vue-next";

import { useLocale } from "@/composables/useLocale";
import { useToast } from "@/composables/useToast";
import type { AppDocument, CompetencyCategory, Gender, RegistrationPeriod } from "../../types";
import { formatAddress, parseAddress, type StAddress } from "../../address";
import AddressFieldset from "../../components/AddressFieldset.vue";
import { COMPETENCY_CATEGORIES } from "../../mock/competencies";
import { EMPLOYERS } from "../../mock/employers";
import { useStSessionStore } from "../../stores/session";
import { useStRegistrationStore } from "../../stores/registration";
import { DEMO_SUBMIT_PIN } from "../../stores/workflow";
import DocumentUploadField from "../../components/DocumentUploadField.vue";
import StPageHero from "../../components/StPageHero.vue";
import {
  PLACE_RESTRICTIONS,
  VOLTAGE_RESTRICTIONS,
  ageFromDob,
  canSelfEmploy,
  oshRequired,
  parseMyKadDob,
  type EmployerCategory,
  type PlaceRestriction,
  type VoltageRestriction,
} from "../../registration/ok-rules";
import {
  CDP_FIRST_REGISTRATION_BONUS,
  evaluateCdpGate,
  resolveOkRegistrationHistory,
} from "../../registration/cdp-rules";
import { useStReferenceSettingsStore } from "../../stores/reference-settings";

const DRAFT_KEY_PREFIX = "st.rg-ke.apply.draft.v1";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const { ts, locale } = useLocale();
const session = useStSessionStore();
const regStore = useStRegistrationStore();
const refSettings = useStReferenceSettingsStore();

const portalBase = computed(() => (route.path.startsWith("/admin/st") ? "/admin/st" : "/st"));

const step = ref(0);
/** Highest step index the user has reached — enables jumping back/forward among visited tabs. */
const maxReachedStep = ref(0);
const STEPS = computed(() => [
  ts("st.okApply.stepProfile"),
  ts("st.okApply.stepCompetency"),
  ts("st.okApply.stepEmployer"),
  ts("st.okApply.stepDocs"),
  ts("st.okApply.stepReview"),
]);

const persona = computed(() => session.currentPersona);

/** Drafts are per-persona so one Pemohon does not inherit another's form. */
function draftStorageKey(): string {
  const id = session.currentPersonaId || session.currentPersona?.email || "guest";
  return `${DRAFT_KEY_PREFIX}.${id}`;
}

const form = reactive({
  fullName: "",
  icNumber: "",
  dob: "1985-01-01",
  age: 41,
  gender: "male" as Gender,
  address: "No. 1, Jalan Contoh, 40000 Shah Alam, Selangor",
  phone: "012-3456789",
  email: "",
  certificateNo: "COMP/PW/2024/00821",
  competencyCategory: "PW" as CompetencyCategory,
  voltageRestriction: "lv" as VoltageRestriction,
  placeRestriction: "none" as PlaceRestriction,
  certificateActive: true,
  certificateSuspended: false,
  periodYears: 1 as RegistrationPeriod,
  employerCategory: "company" as EmployerCategory,
  employerId: "",
  oshDownloaded: false,
  oshUploaded: false,
});

const documents = ref<AppDocument[]>([]);
const employerSearch = ref("");
const declarations = reactive({ truthful: false, terms: false, consent: false });
const submitPin = ref("");

const periods = computed(() => refSettings.allowedPeriods(form.age, form.competencyCategory));
const maxPeriod = computed(() => refSettings.maxPeriodForAge(form.age, form.competencyCategory));
const needsOsh = computed(() => oshRequired(form.age, form.competencyCategory));
const selfOk = computed(() => canSelfEmploy(form.competencyCategory));

const employerResults = computed(() =>
  EMPLOYERS.filter((e) => e.name.toLowerCase().includes(employerSearch.value.toLowerCase())),
);
const selectedEmployer = computed(() => EMPLOYERS.find((e) => e.id === form.employerId));

const DOC_LABELS = computed(() =>
  refSettings.documentLabels("RG-KE", locale.value === "bi" ? "bi" : "bm", form.employerCategory === "self_employed"),
);

const eligibility = computed(() => {
  if (form.certificateSuspended) return { ok: false, key: "st.okApply.eligibilityFailSuspend" as const };
  if (!form.certificateActive) return { ok: false, key: "st.okApply.eligibilityFailCert" as const };
  return { ok: true, key: "st.okApply.eligibilityOk" as const };
});

/** D11: first lifetime ST registration skips CDP; renewal uses category × years table. */
const registrationHistory = computed(() =>
  resolveOkRegistrationHistory(form.icNumber, regStore.entities),
);
const cdpGate = computed(() =>
  evaluateCdpGate({
    isFirstRegistration: registrationHistory.value.isFirstRegistration,
    category: form.competencyCategory,
    periodYears: form.periodYears,
    availablePoints: registrationHistory.value.availablePoints,
  }),
);

watch(
  () => [form.age, form.competencyCategory] as const,
  () => {
    if (!periods.value.includes(form.periodYears)) {
      form.periodYears = periods.value[periods.value.length - 1] ?? 1;
    }
    if (!selfOk.value && form.employerCategory === "self_employed") {
      form.employerCategory = "company";
    }
  },
);

/** Set Tarikh Lahir + Umur from MyKad YYMMDD prefix. */
function applyDobFromMyKad() {
  const dob = parseMyKadDob(form.icNumber);
  if (!dob) return;
  form.dob = dob;
  form.age = ageFromDob(dob);
}

watch(() => form.icNumber, applyDobFromMyKad);

function voltageLabel(code: VoltageRestriction): string {
  const row = VOLTAGE_RESTRICTIONS.find((v) => v.code === code);
  return locale.value === "bi" ? (row?.bi ?? code) : (row?.bm ?? code);
}

function placeLabel(code: PlaceRestriction): string {
  const row = PLACE_RESTRICTIONS.find((v) => v.code === code);
  return locale.value === "bi" ? (row?.bi ?? code) : (row?.bm ?? code);
}

function prefill() {
  form.fullName = persona.value?.name ?? "";
  form.icNumber = persona.value?.icNumber ?? "";
  form.email = persona.value?.email ?? "";
  // Gender defaults female for new female personas when name hint is unavailable — leave male unless known.
  if (persona.value?.name && /binti|a\/p/i.test(persona.value.name)) {
    form.gender = "female";
  }
  applyDobFromMyKad();
}

type DraftPayload = Partial<typeof form> & {
  documents?: AppDocument[];
  step?: number;
  maxReachedStep?: number;
  personaId?: string;
};

function persistDraft() {
  if (typeof window === "undefined") return;
  const payload: DraftPayload = {
    ...form,
    documents: documents.value,
    step: step.value,
    maxReachedStep: maxReachedStep.value,
    personaId: session.currentPersonaId ?? undefined,
  };
  localStorage.setItem(draftStorageKey(), JSON.stringify(payload));
}

// Structured address entry; kept flattened in form.address so the draft and the
// submit payload (which expect a single string) stay unchanged.
const addressForm = ref<StAddress>(parseAddress("No. 1, Jalan Contoh, 40000 Shah Alam, Selangor"));
watch(
  addressForm,
  (a) => {
    form.address = formatAddress(a);
  },
  { deep: true },
);

/** Returns true when a draft for the current persona was restored. */
function loadDraft(): boolean {
  if (typeof window === "undefined") return false;
  const raw = localStorage.getItem(draftStorageKey());
  if (!raw) return false;
  try {
    const d = JSON.parse(raw) as DraftPayload;
    const currentId = session.currentPersonaId;
    // Reject drafts that belong to another persona (legacy shared key or stale data).
    if (d.personaId && currentId && d.personaId !== currentId) {
      localStorage.removeItem(draftStorageKey());
      return false;
    }
    if (d.email && persona.value?.email && d.email.toLowerCase() !== persona.value.email.toLowerCase()) {
      localStorage.removeItem(draftStorageKey());
      return false;
    }
    const { documents: docs, step: savedStep, maxReachedStep: savedMax, personaId: _pid, ...fields } = d;
    Object.assign(form, fields);
    if (docs) documents.value = docs;
    if (typeof savedStep === "number" && savedStep >= 0) {
      step.value = Math.min(savedStep, STEPS.value.length - 1);
    }
    if (typeof savedMax === "number" && savedMax >= 0) {
      maxReachedStep.value = Math.min(Math.max(savedMax, step.value), STEPS.value.length - 1);
    } else {
      maxReachedStep.value = step.value;
    }
    return true;
  } catch {
    return false;
  }
}

function saveDraft(showToast = true) {
  persistDraft();
  if (showToast) {
    toast.info(ts("st.okApply.saveDraft"), ts("st.okApply.draftSaved"));
  }
}

function clearDraft() {
  localStorage.removeItem(draftStorageKey());
  // Drop legacy shared draft from earlier builds.
  localStorage.removeItem(DRAFT_KEY_PREFIX);
}

onMounted(() => {
  // RG-KE apply is for Pemohon (Orang Kompeten). Staff may open for support; Majikan is redirected.
  if (session.role === "employer") {
    toast.error("Akses", "Pendaftaran Orang Kompeten hanya untuk akaun Pemohon.");
    router.replace(session.homeRoute());
    return;
  }
  void regStore.fetchFromApi();
  // Always start from the signed-in persona; only overlay a matching draft.
  prefill();
  const restored = loadDraft();
  if (!restored) {
    // Ensure profile fields stay tied to the current account when no draft exists.
    prefill();
  } else if (persona.value) {
    // Draft may have competency edits, but identity must match the signed-in account.
    form.fullName = persona.value.name;
    form.icNumber = persona.value.icNumber ?? form.icNumber;
    form.email = persona.value.email;
  }
  applyDobFromMyKad();
  // Re-hydrate the structured address from whatever the draft/prefill left behind.
  addressForm.value = parseAddress(form.address);
});

// Auto-save draft every change (debounced lightly via watch)
let draftTimer: number | null = null;
watch(
  [form, documents],
  () => {
    if (draftTimer) window.clearTimeout(draftTimer);
    draftTimer = window.setTimeout(() => {
      persistDraft();
    }, 800);
  },
  { deep: true },
);

function canProceed(): boolean {
  switch (step.value) {
    case 0:
      return Boolean(form.fullName && form.icNumber && form.email && form.gender && form.age > 0);
    case 1:
      return (
        eligibility.value.ok &&
        cdpGate.value.allowed &&
        Boolean(form.certificateNo) &&
        periods.value.includes(form.periodYears) &&
        (!needsOsh.value || form.oshUploaded)
      );
    case 2:
      if (form.employerCategory === "self_employed") return selfOk.value;
      return Boolean(form.employerId);
    case 3:
      return DOC_LABELS.value.every((l) => documents.value.some((d) => d.label === l));
    default:
      return true;
  }
}

const canSubmit = computed(
  () =>
    declarations.truthful &&
    declarations.terms &&
    declarations.consent &&
    submitPin.value.length >= 4 &&
    eligibility.value.ok &&
    cdpGate.value.allowed,
);

function next() {
  if (!canProceed()) {
    toast.error(ts("st.okApply.incomplete"), ts("st.okApply.incomplete"));
    return;
  }
  if (step.value < STEPS.value.length - 1) {
    step.value++;
    if (step.value > maxReachedStep.value) maxReachedStep.value = step.value;
  }
  saveDraft(true);
}

function back() {
  if (step.value > 0) {
    step.value--;
    persistDraft();
  }
}

function goToStep(target: number) {
  if (target < 0 || target > maxReachedStep.value || target === step.value) return;
  step.value = target;
  saveDraft(true);
}

function downloadOsh() {
  form.oshDownloaded = true;
  toast.success(ts("st.okApply.oshDownload"), "OSH-template-RG-KE.pdf");
}

function uploadOsh() {
  form.oshUploaded = true;
  const label = locale.value === "bi" ? "OSH medical report" : "Laporan OSH";
  const doc: AppDocument = {
    id: `osh-${Date.now()}`,
    label,
    fileName: "laporan-osh-ditandatangani.pdf",
    sizeKb: 380,
    mimeType: "application/pdf",
    uploadedAt: new Date().toISOString(),
    status: "pending",
  };
  documents.value = [...documents.value.filter((d) => d.label !== label), doc];
}

async function submit() {
  if (!session.currentPersonaId || !canSubmit.value) return;
  if (submitPin.value !== DEMO_SUBMIT_PIN) {
    toast.error("PIN", ts("st.okApply.pinHint", { n: DEMO_SUBMIT_PIN }));
    return;
  }

  const id = await regStore.submitOkElectric({
    applicantPersonaId: session.currentPersonaId,
    fullName: form.fullName,
    icNumber: form.icNumber,
    dob: form.dob,
    age: form.age,
    gender: form.gender,
    address: form.address,
    phone: form.phone,
    email: form.email,
    certificateNo: form.certificateNo,
    competencyCategory: form.competencyCategory,
    voltageRestriction: form.voltageRestriction,
    placeRestriction: form.placeRestriction,
    periodYears: form.periodYears,
    employerCategory: form.employerCategory,
    employerId: form.employerId || undefined,
    cdpPoints: registrationHistory.value.availablePoints,
    isFirstRegistration: registrationHistory.value.isFirstRegistration,
    appType: registrationHistory.value.isFirstRegistration ? "new_registration" : "renewal",
    oshRequired: needsOsh.value,
    oshUploaded: form.oshUploaded,
    documents: documents.value.map((d) => ({ label: d.label, fileName: d.fileName })),
  });

  const app = regStore.byId(id);
  clearDraft();
  toast.success(ts("st.okApply.submit"), ts("st.okApply.submitted", { n: app?.refNo ?? id }));
  router.push(`${portalBase.value}/registration/ok-electric/applications/${id}`);
}
</script>

<template>
  <div class="space-y-5">
    <StPageHero :title="ts('st.okApply.title')" :subtitle="ts('st.okApply.subtitle')">
      <div class="mt-2 flex flex-wrap items-center gap-2">
        <span class="rounded-md bg-slate-100 dark:bg-slate-700 px-2 py-0.5 font-mono text-xs text-slate-600 dark:text-slate-400">RG-KE</span>
      </div>
    </StPageHero>

    <ol class="flex items-center gap-1 text-xs">
      <li v-for="(s, i) in STEPS" :key="s" class="flex flex-1 items-center gap-1">
        <button
          type="button"
          class="flex min-w-0 items-center gap-1 rounded-md text-left transition-opacity"
          :class="i <= maxReachedStep && i !== step ? 'cursor-pointer hover:opacity-80' : i === step ? 'cursor-default' : 'cursor-not-allowed opacity-60'"
          :disabled="i > maxReachedStep"
          :aria-current="i === step ? 'step' : undefined"
          :title="i <= maxReachedStep ? s : undefined"
          @click="goToStep(i)"
        >
          <span
            :class="[
              'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold',
              i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-[var(--accent-600)] text-white' : i <= maxReachedStep ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-300 dark:ring-emerald-700' : 'bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-400',
            ]"
          >
            <Check v-if="i < step" class="h-3.5 w-3.5" />
            <template v-else>{{ i + 1 }}</template>
          </span>
          <span :class="['hidden truncate sm:inline', i === step ? 'font-medium text-slate-700 dark:text-slate-300' : i <= maxReachedStep ? 'text-slate-600 dark:text-slate-400' : 'text-slate-400 dark:text-slate-500']">{{ s }}</span>
        </button>
        <span v-if="i < STEPS.length - 1" class="h-px flex-1 bg-slate-200 dark:bg-slate-600" />
      </li>
    </ol>

    <div class="border-t border-slate-200 dark:border-slate-700 pt-6">
      <!-- Profile -->
      <div v-if="step === 0" class="space-y-4">
        <p class="flex items-start gap-2 rounded-lg bg-[var(--accent-50)] px-3 py-2 text-xs text-slate-600 dark:text-slate-400">
          <Sparkles class="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent-700)]" />
          {{ ts("st.okApply.prefillNote") }}
        </p>
        <div class="grid gap-4 sm:grid-cols-2">
          <label class="block sm:col-span-2">
            <span class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{{ ts("st.okApply.fullName") }}</span>
            <input v-model="form.fullName" class="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm focus:border-[var(--accent-500)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)]/30" />
          </label>
          <label class="block">
            <span class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{{ ts("st.okApply.ic") }}</span>
            <input v-model="form.icNumber" class="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm focus:border-[var(--accent-500)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)]/30" />
          </label>
          <label class="block">
            <span class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{{ ts("st.okApply.gender") }}</span>
            <select v-model="form.gender" class="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm">
              <option value="male">{{ ts("st.okApply.genderMale") }}</option>
              <option value="female">{{ ts("st.okApply.genderFemale") }}</option>
            </select>
          </label>
          <label class="block">
            <span class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{{ ts("st.okApply.dob") }}</span>
            <input v-model="form.dob" type="date" readonly class="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/60 px-3 py-2 text-sm text-slate-700 dark:text-slate-300" />
          </label>
          <label class="block">
            <span class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{{ ts("st.okApply.age") }}</span>
            <input v-model.number="form.age" type="number" min="18" max="90" readonly class="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/60 px-3 py-2 text-sm text-slate-700 dark:text-slate-300" />
          </label>
          <label class="block">
            <span class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{{ ts("st.okApply.phone") }}</span>
            <input v-model="form.phone" class="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm" />
          </label>
          <label class="block">
            <span class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{{ ts("st.okApply.email") }}</span>
            <input v-model="form.email" type="email" class="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm" />
          </label>
          <div class="sm:col-span-2">
            <p class="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">{{ ts("st.okApply.address") }}</p>
            <AddressFieldset v-model="addressForm" />
          </div>
        </div>
      </div>

      <!-- Competency -->
      <div v-else-if="step === 1" class="space-y-4">
        <div
          :class="[
            'rounded-lg px-3 py-2 text-sm',
            eligibility.ok ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400',
          ]"
        >
          {{ ts(eligibility.key) }}
        </div>

        <label class="block">
          <span class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{{ ts("st.okApply.certNo") }}</span>
          <input v-model="form.certificateNo" class="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm font-mono" />
        </label>

        <div>
          <span class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">{{ ts("st.common.category") }}</span>
          <div class="grid gap-2 sm:grid-cols-2">
            <button
              v-for="c in COMPETENCY_CATEGORIES"
              :key="c.code"
              type="button"
              :class="[
                'rounded-lg border px-3 py-2.5 text-left transition-colors',
                form.competencyCategory === c.code ? 'border-[var(--accent-500)] bg-[var(--accent-50)]' : 'border-slate-200 dark:border-slate-700 hover:border-[var(--accent-ring)]',
              ]"
              @click="form.competencyCategory = c.code"
            >
              <p class="text-sm font-semibold text-slate-800 dark:text-slate-200">{{ c.code }} — {{ c.label }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">{{ c.description }}</p>
            </button>
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <label class="block">
            <span class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{{ ts("st.okApply.voltage") }}</span>
            <select v-model="form.voltageRestriction" class="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm">
              <option v-for="v in VOLTAGE_RESTRICTIONS" :key="v.code" :value="v.code">
                {{ locale === "bi" ? v.bi : v.bm }}
              </option>
            </select>
          </label>
          <label class="block">
            <span class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{{ ts("st.okApply.place") }}</span>
            <select v-model="form.placeRestriction" class="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm">
              <option v-for="v in PLACE_RESTRICTIONS" :key="v.code" :value="v.code">
                {{ locale === "bi" ? v.bi : v.bm }}
              </option>
            </select>
          </label>
        </div>

        <label class="block">
          <span class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{{ ts("st.okApply.period") }}</span>
          <select v-model.number="form.periodYears" class="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm">
            <option v-for="p in periods" :key="p" :value="p">{{ ts("st.okApply.periodYear", { n: p }) }}</option>
          </select>
          <span class="mt-1 block text-xs text-slate-400 dark:text-slate-500">{{ ts("st.okApply.periodHint", { n: maxPeriod }) }}</span>
        </label>

        <p
          :class="[
            'rounded-lg border px-3 py-2.5 text-xs',
            cdpGate.isFirstRegistration
              ? 'border-emerald-200 bg-emerald-50/80 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300'
              : cdpGate.allowed
                ? 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300'
                : 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-800 dark:bg-rose-500/15 dark:text-rose-300',
          ]"
        >
          <span v-if="cdpGate.isFirstRegistration">
            {{ ts("st.okApply.cdpFirst", { n: CDP_FIRST_REGISTRATION_BONUS }) }}
          </span>
          <span v-else-if="cdpGate.allowed">
            {{ ts("st.okApply.cdpOk", { have: cdpGate.available, need: cdpGate.required }) }}
          </span>
          <span v-else>
            {{ ts("st.okApply.cdpFail", { have: cdpGate.available, need: cdpGate.required, short: cdpGate.shortfall }) }}
          </span>
        </p>

        <div v-if="needsOsh" class="space-y-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-500/15 p-4">
          <p class="flex items-start gap-2 text-sm text-amber-900 dark:text-amber-400">
            <AlertTriangle class="mt-0.5 h-4 w-4 shrink-0" />
            {{ ts("st.okApply.oshRequired") }}
          </p>
          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              class="flex items-center gap-1.5 rounded-md border border-amber-300 dark:border-amber-800 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-amber-900 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/15"
              @click="downloadOsh"
            >
              <Download class="h-3.5 w-3.5" /> {{ ts("st.okApply.oshDownload") }}
            </button>
            <button
              type="button"
              class="rounded-md bg-amber-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-800"
              :disabled="!form.oshDownloaded && !form.oshUploaded"
              @click="uploadOsh"
            >
              {{ form.oshUploaded ? ts("st.okApply.oshDone") : ts("st.okApply.oshUpload") }}
            </button>
          </div>
        </div>
      </div>

      <!-- Employer -->
      <div v-else-if="step === 2" class="space-y-4">
        <div>
          <span class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">{{ ts("st.okApply.employerCat") }}</span>
          <div class="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              :class="[
                'rounded-lg border px-3 py-3 text-left text-sm font-medium',
                form.employerCategory === 'company' ? 'border-[var(--accent-500)] bg-[var(--accent-50)]' : 'border-slate-200 dark:border-slate-700',
              ]"
              @click="form.employerCategory = 'company'"
            >
              {{ ts("st.okApply.company") }}
            </button>
            <button
              type="button"
              :disabled="!selfOk"
              :class="[
                'rounded-lg border px-3 py-3 text-left text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50',
                form.employerCategory === 'self_employed' ? 'border-[var(--accent-500)] bg-[var(--accent-50)]' : 'border-slate-200 dark:border-slate-700',
              ]"
              @click="form.employerCategory = 'self_employed'"
            >
              {{ ts("st.okApply.selfEmployed") }}
              <span class="mt-1 block text-xs font-normal text-slate-500 dark:text-slate-400">{{ ts("st.okApply.selfEmployedHint") }}</span>
            </button>
          </div>
          <p v-if="!selfOk" class="mt-2 text-xs text-amber-700 dark:text-amber-400">{{ ts("st.okApply.selfEmployedBlocked") }}</p>
        </div>

        <template v-if="form.employerCategory === 'company'">
          <div class="relative">
            <Search class="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input
              v-model="employerSearch"
              :placeholder="ts('st.okApply.searchEmployer')"
              class="w-full rounded-md border border-slate-300 dark:border-slate-600 py-2 pl-9 pr-3 text-sm"
            />
          </div>
          <div class="space-y-2">
            <button
              v-for="e in employerResults"
              :key="e.id"
              type="button"
              :class="[
                'block w-full rounded-lg border px-3 py-2.5 text-left',
                form.employerId === e.id ? 'border-[var(--accent-500)] bg-[var(--accent-50)]' : 'border-slate-200 dark:border-slate-700 hover:border-[var(--accent-ring)]',
              ]"
              @click="form.employerId = e.id"
            >
              <p class="text-sm font-semibold text-slate-800 dark:text-slate-200">{{ e.name }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">{{ e.registrationNo }} · {{ e.contactPerson }}</p>
            </button>
          </div>
        </template>
      </div>

      <!-- Documents -->
      <div v-else-if="step === 3" class="space-y-3">
        <DocumentUploadField v-model="documents" :labels="DOC_LABELS" />
      </div>

      <!-- Review -->
      <div v-else class="space-y-4">
        <dl class="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
          <div class="flex justify-between gap-4 py-2"><dt class="text-slate-500 dark:text-slate-400">{{ ts("st.okApply.fullName") }}</dt><dd class="text-right font-medium text-slate-800 dark:text-slate-200">{{ form.fullName }}</dd></div>
          <div class="flex justify-between gap-4 py-2"><dt class="text-slate-500 dark:text-slate-400">{{ ts("st.okApply.ic") }}</dt><dd class="font-mono text-slate-800 dark:text-slate-200">{{ form.icNumber }}</dd></div>
          <div class="flex justify-between gap-4 py-2"><dt class="text-slate-500 dark:text-slate-400">{{ ts("st.okApply.gender") }}</dt><dd class="text-slate-800 dark:text-slate-200">{{ form.gender === "male" ? ts("st.okApply.genderMale") : ts("st.okApply.genderFemale") }}</dd></div>
          <div class="flex justify-between gap-4 py-2"><dt class="text-slate-500 dark:text-slate-400">{{ ts("st.common.category") }}</dt><dd class="text-slate-800 dark:text-slate-200">{{ form.competencyCategory }}</dd></div>
          <div class="flex justify-between gap-4 py-2"><dt class="text-slate-500 dark:text-slate-400">{{ ts("st.okApply.certNo") }}</dt><dd class="font-mono text-slate-800 dark:text-slate-200">{{ form.certificateNo }}</dd></div>
          <div class="flex justify-between gap-4 py-2"><dt class="text-slate-500 dark:text-slate-400">{{ ts("st.okApply.voltage") }}</dt><dd class="text-slate-800 dark:text-slate-200">{{ voltageLabel(form.voltageRestriction) }}</dd></div>
          <div class="flex justify-between gap-4 py-2"><dt class="text-slate-500 dark:text-slate-400">{{ ts("st.okApply.place") }}</dt><dd class="text-slate-800 dark:text-slate-200">{{ placeLabel(form.placeRestriction) }}</dd></div>
          <div class="flex justify-between gap-4 py-2"><dt class="text-slate-500 dark:text-slate-400">{{ ts("st.okApply.period") }}</dt><dd class="text-slate-800 dark:text-slate-200">{{ ts("st.okApply.periodYear", { n: form.periodYears }) }}</dd></div>
          <div class="flex justify-between gap-4 py-2"><dt class="text-slate-500 dark:text-slate-400">{{ ts("st.common.cdp") }}</dt><dd class="text-right text-slate-800 dark:text-slate-200">
            <span v-if="cdpGate.isFirstRegistration">{{ ts("st.okApply.cdpFirst", { n: CDP_FIRST_REGISTRATION_BONUS }) }}</span>
            <span v-else>{{ cdpGate.available }} / {{ cdpGate.required }}</span>
          </dd></div>
          <div class="flex justify-between gap-4 py-2">
            <dt class="text-slate-500 dark:text-slate-400">{{ ts("st.common.employer") }}</dt>
            <dd class="text-right text-slate-800 dark:text-slate-200">
              {{ form.employerCategory === "self_employed" ? ts("st.okApply.selfEmployed") : (selectedEmployer?.name ?? "—") }}
            </dd>
          </div>
          <div class="flex justify-between gap-4 py-2"><dt class="text-slate-500 dark:text-slate-400">{{ ts("st.okDetail.documents") }}</dt><dd class="text-slate-800 dark:text-slate-200">{{ documents.length }}</dd></div>
        </dl>

        <div class="space-y-2 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
          <label class="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input v-model="declarations.truthful" type="checkbox" class="mt-0.5 h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-[var(--accent-600)]" />
            <span>{{ ts("st.okApply.decl1") }}</span>
          </label>
          <label class="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input v-model="declarations.terms" type="checkbox" class="mt-0.5 h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-[var(--accent-600)]" />
            <span>{{ ts("st.okApply.decl2") }}</span>
          </label>
          <label class="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input v-model="declarations.consent" type="checkbox" class="mt-0.5 h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-[var(--accent-600)]" />
            <span>{{ ts("st.okApply.decl3") }}</span>
          </label>
        </div>

        <label class="block">
          <span class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{{ ts("st.okApply.pin") }}</span>
          <input
            v-model="submitPin"
            type="password"
            inputmode="numeric"
            maxlength="6"
            class="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm tracking-[0.3em]"
          />
          <span class="mt-1 block text-[11px] text-slate-400 dark:text-slate-500">{{ ts("st.okApply.pinHint", { n: DEMO_SUBMIT_PIN }) }}</span>
        </label>
      </div>

      <div class="mt-6 flex justify-between gap-2">
        <button
          type="button"
          class="rounded-md border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 disabled:opacity-50"
          :disabled="step === 0"
          @click="back"
        >
          {{ ts("st.okApply.back") }}
        </button>
        <div class="flex gap-2">
          <button
            type="button"
            class="rounded-md border border-[var(--accent-600)] px-4 py-2 text-sm font-medium text-[var(--accent-700)] hover:bg-[var(--accent-50)]"
            @click="saveDraft()"
          >
            {{ ts("st.okApply.saveDraft") }}
          </button>
          <button
            v-if="step < STEPS.length - 1"
            type="button"
            class="rounded-md bg-[var(--accent-600)] px-5 py-2 text-sm font-medium text-white hover:bg-[var(--accent-700)]"
            @click="next"
          >
            {{ ts("st.okApply.next") }}
          </button>
          <button
            v-else
            type="button"
            class="rounded-md bg-[var(--accent-600)] px-5 py-2 text-sm font-medium text-white hover:bg-[var(--accent-700)] disabled:opacity-50"
            :disabled="!canSubmit"
            @click="submit"
          >
            {{ ts("st.okApply.submit") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
