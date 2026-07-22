<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Check, Plus, Search, Trash2, X } from "lucide-vue-next";

import { useLocale } from "@/composables/useLocale";
import { useToast } from "@/composables/useToast";
import type { AppDocument, ContractorClass, Gender, RegistrationPeriod } from "../../types";
import { isAddressComplete, parseAddress, type StAddress } from "../../address";
import AddressFieldset from "../../components/AddressFieldset.vue";
import { CONTRACTOR_CLASSES } from "../../mock/competencies";
import { searchOks, okById, type RegisteredOk } from "../../mock/competent-persons";
import { useStSessionStore } from "../../stores/session";
import { useStEmployerStore } from "../../stores/employer";
import { useStRegistrationStore } from "../../stores/registration";
import { useStReferenceSettingsStore } from "../../stores/reference-settings";
import { DEMO_SUBMIT_PIN, useStWorkflowStore } from "../../stores/workflow";
import { employerById } from "../../mock/employers";
import DocumentUploadField from "../../components/DocumentUploadField.vue";
import StPageHero from "../../components/StPageHero.vue";
import {
  CONFIRMATION_CHECKS,
  CONTRACTOR_KINDS,
  CONTRACTOR_VOLTAGES,
  EQUIPMENT_BRANDS,
  PERIODS,
  TEST_EQUIPMENT_TYPES,
  classRequirementsLabel,
  contractorKindMeta,
  validateOkSet,
  type AppointedOkForm,
  type ContractorKind,
  type ContractorVoltage,
  type DirectorShareholder,
  type ProfessionalEngineer,
  type SkilledPerson,
  type TestEquipment,
} from "../../registration/ce-rules";
import { evaluateCdpGate } from "../../registration/cdp-rules";

const DRAFT_KEY_PREFIX = "st.rg-ce.apply.draft.v1";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const { ts, locale } = useLocale();
const session = useStSessionStore();
const employerStore = useStEmployerStore();
const regStore = useStRegistrationStore();
const workflow = useStWorkflowStore();
const refSettings = useStReferenceSettingsStore();
const portalBase = computed(() => (route.path.startsWith("/admin/st") ? "/admin/st" : "/st"));

function draftStorageKey(): string {
  const id = session.currentPersonaId || session.currentPersona?.email || "guest";
  return `${DRAFT_KEY_PREFIX}.${id}`;
}

const step = ref(0);
/** Highest step index the user has reached — enables jumping back/forward among visited tabs. */
const maxReachedStep = ref(0);
const STEPS = computed(() => [
  ts("st.ceApply.stepA"),
  ts("st.ceApply.stepB"),
  ts("st.ceApply.stepC"),
  ts("st.ceApply.stepD"),
  ts("st.ceApply.stepEF"),
  ts("st.ceApply.stepG"),
]);

let uid = 0;
function nid(prefix: string) {
  return `${prefix}-${++uid}-${Date.now()}`;
}

const form = reactive({
  representativeName: "",
  representativeIc: "",
  representativeGender: "male" as Gender,
  representativePhone: "012-3456789",
  representativeEmail: "",
  contractorKind: "electrical" as ContractorKind,
  contractorClass: "C" as ContractorClass,
  voltage: "415V" as ContractorVoltage,
  periodYears: 1 as RegistrationPeriod,
  companyName: "",
  companyRegNo: "201501012345 (1122334-A)",
  companyAddress: "Lot 8, Jalan Teknologi 3/5, 47810 Petaling Jaya, Selangor",
  postcode: "47810",
  city: "Petaling Jaya",
  state: "Selangor",
  companyEmail: "info@example.com",
  companyPhone: "03-12345678",
  companyFax: "03-12345679",
});

const directors = ref<DirectorShareholder[]>([
  { id: nid("dir"), name: "", icNumber: "", address: "", sharePercent: 100 },
]);
const appointedOks = ref<AppointedOkForm[]>([]);
const skilledPersons = ref<SkilledPerson[]>([]);
const professionalEngineers = ref<ProfessionalEngineer[]>([]);
const equipment = ref<TestEquipment[]>([]);
const confirmationChecks = ref<string[]>([]);
const documents = ref<AppDocument[]>([]);
const okSearch = ref("");
const declarations = reactive({ truthful: false, terms: false, consent: false });
const submitPin = ref("");

const kindMeta = computed(() => contractorKindMeta(form.contractorKind));
const okResults = computed(() => searchOks(okSearch.value));
const okValidation = computed(() =>
  kindMeta.value.needsClass
    ? validateOkSet(
        appointedOks.value.filter((o) => !o.employedElsewhere).map((o) => o.wirerType),
        form.contractorClass,
      )
    : { items: [], valid: appointedOks.value.length > 0 || kindMeta.value.needsSkilledPersons || kindMeta.value.needsProfessionalEngineers },
);

/** D11: each appointed OK must pass first-reg skip or renewal CDP table for their period. */
const appointedCdpRows = computed(() =>
  appointedOks.value.map((a) => {
    const ok = okById(a.okId);
    const category = a.competencyCategory ?? ok?.competencyCategory ?? "PW";
    const gate = evaluateCdpGate({
      isFirstRegistration: a.isFirstRegistration ?? ok?.isFirstRegistration ?? false,
      category,
      periodYears: a.periodYears,
      availablePoints: a.cdpPoints ?? ok?.cdpPoints ?? 0,
    });
    return { okId: a.okId, name: a.name, category, gate };
  }),
);
const appointedCdpOk = computed(() => appointedCdpRows.value.every((r) => r.gate.allowed));

const DOC_LABELS = computed(() =>
  refSettings.documentLabels("RG-CE", locale.value === "bi" ? "bi" : "bm", false),
);
const REQUIRED_DOC_LABELS = computed(() =>
  refSettings.requiredDocumentLabels("RG-CE", locale.value === "bi" ? "bi" : "bm", false),
);

/** Match uploaded docs to required labels only (workshop is optional). */
function hasRequiredDocs(): boolean {
  return REQUIRED_DOC_LABELS.value.every((required) => documents.value.some((d) => d.label === required));
}

function kindLabel(code: ContractorKind) {
  const k = contractorKindMeta(code);
  return locale.value === "bi" ? k.bi : k.bm;
}

function prefill() {
  const p = session.currentPersona;
  form.representativeName = p?.name ?? "";
  form.representativeIc = p?.icNumber ?? "800101105432";
  form.representativeEmail = p?.email ?? "";
  form.companyName = p?.organisation ?? "Syarikat Elektrik Maju Sdn Bhd";
  if (directors.value[0] && !directors.value[0].name) {
    directors.value[0].name = form.representativeName;
    directors.value[0].icNumber = form.representativeIc;
  }
}

// Structured address entry. Kept mapped onto the existing payload fields:
// line1+line2 → companyAddress (street), district → city, postcode, state.
const addressForm = ref<StAddress>(parseAddress("Lot 8, Jalan Teknologi 3/5, 47810 Petaling Jaya, Selangor"));
watch(
  addressForm,
  (a) => {
    form.companyAddress = [a.line1, a.line2].map((s) => s.trim()).filter(Boolean).join(", ");
    form.city = a.district;
    form.postcode = a.postcode;
    form.state = a.state;
  },
  { deep: true, immediate: true },
);

function loadDraft(): boolean {
  const raw = localStorage.getItem(draftStorageKey());
  if (!raw) return false;
  try {
    const d = JSON.parse(raw) as Record<string, unknown>;
    if (
      typeof d.personaId === "string" &&
      session.currentPersonaId &&
      d.personaId !== session.currentPersonaId
    ) {
      localStorage.removeItem(draftStorageKey());
      return false;
    }
    Object.assign(form, d.form ?? {});
    directors.value = (d.directors as DirectorShareholder[]) ?? directors.value;
    appointedOks.value = (d.appointedOks as AppointedOkForm[]) ?? [];
    skilledPersons.value = (d.skilledPersons as SkilledPerson[]) ?? [];
    professionalEngineers.value = (d.professionalEngineers as ProfessionalEngineer[]) ?? [];
    equipment.value = (d.equipment as TestEquipment[]) ?? [];
    confirmationChecks.value = (d.confirmationChecks as string[]) ?? [];
    documents.value = (d.documents as AppDocument[]) ?? [];
    if (typeof d.step === "number" && d.step >= 0) {
      step.value = Math.min(d.step as number, STEPS.value.length - 1);
    }
    if (typeof d.maxReachedStep === "number" && (d.maxReachedStep as number) >= 0) {
      maxReachedStep.value = Math.min(
        Math.max(d.maxReachedStep as number, step.value),
        STEPS.value.length - 1,
      );
    } else {
      maxReachedStep.value = step.value;
    }
    return true;
  } catch {
    return false;
  }
}

function persistDraft() {
  localStorage.setItem(
    draftStorageKey(),
    JSON.stringify({
      personaId: session.currentPersonaId ?? undefined,
      form: { ...form },
      directors: directors.value,
      appointedOks: appointedOks.value,
      skilledPersons: skilledPersons.value,
      professionalEngineers: professionalEngineers.value,
      equipment: equipment.value,
      confirmationChecks: confirmationChecks.value,
      documents: documents.value,
      step: step.value,
      maxReachedStep: maxReachedStep.value,
    }),
  );
}

/** Mirror draft into workflow so it appears under Permohonan & Pengesahan. */
function syncDraftToList() {
  const personaId = session.currentPersonaId;
  if (!personaId) return;
  const employer = employerStore.myEmployer ?? employerById("emp-tenaga-murni");
  const org = form.companyName || session.currentPersona?.organisation || employer?.name || "—";
  workflow.upsertLocalDraft({
    workflowType: "CE",
    applicantPersonaId: personaId,
    applicant: {
      fullName: form.representativeName || session.currentPersona?.name || org,
      icNumber: form.representativeIc || session.currentPersona?.icNumber || "",
      dob: "",
      age: 0,
      address: form.companyAddress || employer?.address || "",
      phone: form.representativePhone || form.companyPhone || "",
      email: form.representativeEmail || session.currentPersona?.email || "",
      gender: form.representativeGender,
    },
    contractorClass: kindMeta.value.needsClass ? form.contractorClass : undefined,
    contractorKind: form.contractorKind,
    registrationPeriodYears: form.periodYears,
    employer: employer
      ? { ...employer, name: org || employer.name }
      : {
          id: "emp-draft",
          name: org,
          registrationNo: form.companyRegNo || "",
          address: form.companyAddress || "",
          contactPerson: form.representativeName || "",
          confirmerPersonaId: personaId,
          category: "kontraktor",
          status: "active",
        },
    appointedOks: appointedOks.value.map((a) => ({
      registeredOkId: a.okId,
      personaId: okById(a.okId)?.linkedPersonaId,
      name: a.name,
      mykad: a.mykad,
      wirerType: a.wirerType,
      competencyCategory: a.competencyCategory,
      confirmed: false,
      isFirstRegistration: a.isFirstRegistration,
      cdpPoints: a.cdpPoints,
    })),
    documents: documents.value,
  });
}

function saveDraft(showToast = true) {
  persistDraft();
  syncDraftToList();
  if (showToast) {
    toast.info(ts("st.okApply.saveDraft"), ts("st.okApply.draftSaved"));
  }
}

onMounted(() => {
  // RG-CE apply is for Majikan (company wakil). Staff may open for support; Pemohon is redirected.
  if (session.role === "applicant") {
    toast.error("Akses", "Pendaftaran Kontraktor Elektrik hanya untuk akaun Majikan.");
    router.replace(session.homeRoute());
    return;
  }
  prefill();
  const restored = loadDraft();
  if (!restored) {
    prefill();
  } else if (session.currentPersona) {
    const p = session.currentPersona;
    form.representativeName = p.name;
    form.representativeIc = p.icNumber ?? form.representativeIc;
    form.representativeEmail = p.email;
    if (p.organisation) form.companyName = p.organisation;
  }
  // Re-hydrate the structured address from whatever the draft/prefill left behind.
  addressForm.value = {
    ...parseAddress(form.companyAddress),
    district: form.city || parseAddress(form.companyAddress).district,
    postcode: form.postcode || parseAddress(form.companyAddress).postcode,
    state: form.state || parseAddress(form.companyAddress).state,
  };
  // Existing device draft → ensure it also shows in Permohonan list.
  if (restored) syncDraftToList();
});

watch(
  [form, directors, appointedOks, skilledPersons, professionalEngineers, equipment, confirmationChecks, documents],
  () => {
    window.setTimeout(() => {
      persistDraft();
      syncDraftToList();
    }, 600);
  },
  { deep: true },
);

function addDirector() {
  directors.value.push({ id: nid("dir"), name: "", icNumber: "", address: "", sharePercent: 0 });
}
function removeDirector(id: string) {
  directors.value = directors.value.filter((d) => d.id !== id);
}

function toggleOk(ok: RegisteredOk) {
  if (ok.employedElsewhere) {
    toast.error(ts("st.ceApply.okBlocked"), ok.currentEmployerName ?? "");
    return;
  }
  const i = appointedOks.value.findIndex((a) => a.okId === ok.id);
  if (i >= 0) {
    appointedOks.value.splice(i, 1);
    return;
  }
  appointedOks.value.push({
    okId: ok.id,
    name: ok.name,
    mykad: ok.mykad,
    wirerType: ok.wirerType,
    certificateNo: ok.certificateNo,
    periodYears: form.periodYears,
    employedElsewhere: ok.employedElsewhere,
    competencyCategory: ok.competencyCategory,
    isFirstRegistration: ok.isFirstRegistration ?? false,
    cdpPoints: ok.cdpPoints ?? 0,
  });
}

function isOkSelected(id: string) {
  return appointedOks.value.some((a) => a.okId === id);
}

function addSkilled() {
  skilledPersons.value.push({ id: nid("sk"), name: "", icNumber: "", qualification: "", field: "" });
}
function addEngineer() {
  professionalEngineers.value.push({ id: nid("pe"), registrationNo: "", name: "", icNumber: "" });
}
function addEquipment() {
  equipment.value.push({
    id: nid("eq"),
    equipmentType: TEST_EQUIPMENT_TYPES[0].code,
    serialNo: "",
    brand: EQUIPMENT_BRANDS[0].code,
    model: "",
  });
}

function toggleCheck(id: string) {
  const i = confirmationChecks.value.indexOf(id);
  if (i >= 0) confirmationChecks.value.splice(i, 1);
  else confirmationChecks.value.push(id);
}

function canProceed(): boolean {
  switch (step.value) {
    case 0:
      return Boolean(
        form.representativeName &&
          form.representativeIc &&
          form.periodYears &&
          (!kindMeta.value.needsClass || form.contractorClass) &&
          (!kindMeta.value.needsVoltage || form.voltage),
      );
    case 1:
      return Boolean(
        form.companyName &&
          form.companyRegNo &&
          isAddressComplete(addressForm.value) &&
          form.companyEmail &&
          form.companyPhone &&
          directors.value.length > 0 &&
          directors.value.every((d) => d.name && d.icNumber),
      );
    case 2: {
      if (kindMeta.value.needsClass) return okValidation.value.valid && appointedCdpOk.value;
      if (kindMeta.value.needsSkilledPersons) {
        return skilledPersons.value.length > 0 && skilledPersons.value.every((s) => s.name && s.icNumber);
      }
      if (kindMeta.value.needsProfessionalEngineers) {
        return (
          professionalEngineers.value.length > 0 &&
          professionalEngineers.value.every((e) => e.name && e.registrationNo)
        );
      }
      return (
        (appointedOks.value.length > 0 || skilledPersons.value.length > 0 || professionalEngineers.value.length > 0) &&
        (appointedOks.value.length === 0 || appointedCdpOk.value)
      );
    }
    case 3:
      return equipment.value.length > 0 && equipment.value.every((e) => e.serialNo && e.model);
    case 4:
      return (
        CONFIRMATION_CHECKS.every((c) => confirmationChecks.value.includes(c.id)) &&
        hasRequiredDocs()
      );
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
    (appointedOks.value.length === 0 || appointedCdpOk.value),
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

async function submit() {
  if (!session.currentPersonaId || !canSubmit.value) return;
  if (submitPin.value !== DEMO_SUBMIT_PIN) {
    toast.error("PIN", ts("st.okApply.pinHint", { n: DEMO_SUBMIT_PIN }));
    return;
  }

  const id = await regStore.submitContractorElectric({
    applicantPersonaId: session.currentPersonaId,
    employerId: employerStore.myEmployer?.id,
    representativeName: form.representativeName,
    representativeIc: form.representativeIc,
    representativeGender: form.representativeGender,
    representativePhone: form.representativePhone,
    representativeEmail: form.representativeEmail,
    contractorKind: form.contractorKind,
    contractorClass: kindMeta.value.needsClass ? form.contractorClass : undefined,
    voltage: kindMeta.value.needsVoltage ? form.voltage : undefined,
    periodYears: form.periodYears,
    companyName: form.companyName,
    companyRegNo: form.companyRegNo,
    companyAddress: form.companyAddress,
    postcode: form.postcode,
    city: form.city,
    state: form.state,
    companyEmail: form.companyEmail,
    companyPhone: form.companyPhone,
    companyFax: form.companyFax,
    directors: directors.value,
    appointedOks: appointedOks.value,
    skilledPersons: skilledPersons.value,
    professionalEngineers: professionalEngineers.value,
    equipment: equipment.value,
    confirmationChecks: confirmationChecks.value,
    documents: documents.value.map((d) => ({ label: d.label, fileName: d.fileName })),
  });

  const app = regStore.byId(id);
  localStorage.removeItem(draftStorageKey());
  localStorage.removeItem(DRAFT_KEY_PREFIX);
  if (session.currentPersonaId) {
    workflow.discardLocalDraft("CE", session.currentPersonaId);
  }
  toast.success(ts("st.ceApply.title"), ts("st.ceApply.submitted", { n: app?.refNo ?? id }));
  router.push(`${portalBase.value}/registration/contractor-electric/applications/${id}`);
}
</script>

<template>
  <div class="space-y-5">
    <StPageHero :title="ts('st.ceApply.title')" :subtitle="ts('st.ceApply.subtitle')">
      <div class="mt-2 flex flex-wrap items-center gap-2">
        <span class="rounded-md bg-slate-100 dark:bg-slate-700 px-2 py-0.5 font-mono text-xs text-slate-600 dark:text-slate-400">RG-CE</span>
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
          <span :class="['hidden truncate lg:inline', i === step ? 'font-medium text-slate-700 dark:text-slate-300' : i <= maxReachedStep ? 'text-slate-600 dark:text-slate-400' : 'text-slate-400 dark:text-slate-500']">{{ s }}</span>
        </button>
        <span v-if="i < STEPS.length - 1" class="h-px flex-1 bg-slate-200 dark:bg-slate-600" />
      </li>
    </ol>

    <div class="border-t border-slate-200 dark:border-slate-700 pt-6">
      <!-- A: Jenis & Kelas -->
      <div v-if="step === 0" class="space-y-4">
        <div class="grid gap-4 sm:grid-cols-2">
          <label class="block">
            <span class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{{ ts("st.ceApply.repName") }}</span>
            <input v-model="form.representativeName" class="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm" />
          </label>
          <label class="block">
            <span class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{{ ts("st.ceApply.repIc") }}</span>
            <input v-model="form.representativeIc" class="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm" />
          </label>
          <label class="block">
            <span class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{{ ts("st.okApply.gender") }}</span>
            <select v-model="form.representativeGender" class="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm">
              <option value="male">{{ ts("st.okApply.genderMale") }}</option>
              <option value="female">{{ ts("st.okApply.genderFemale") }}</option>
            </select>
          </label>
          <label class="block">
            <span class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{{ ts("st.okApply.phone") }}</span>
            <input v-model="form.representativePhone" class="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm" />
          </label>
          <label class="block sm:col-span-2">
            <span class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{{ ts("st.okApply.email") }}</span>
            <input v-model="form.representativeEmail" type="email" class="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm" />
          </label>
        </div>

        <div>
          <span class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">{{ ts("st.ceApply.kind") }}</span>
          <div class="grid gap-2 sm:grid-cols-2">
            <button
              v-for="k in CONTRACTOR_KINDS"
              :key="k.code"
              type="button"
              :class="[
                'rounded-lg border px-3 py-2.5 text-left text-sm',
                form.contractorKind === k.code ? 'border-[var(--accent-500)] bg-[var(--accent-50)] font-medium' : 'border-slate-200 dark:border-slate-700',
              ]"
              @click="form.contractorKind = k.code"
            >
              {{ locale === "bi" ? k.bi : k.bm }}
            </button>
          </div>
        </div>

        <div v-if="kindMeta.needsClass">
          <span class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">{{ ts("st.ceApply.class") }}</span>
          <div class="grid gap-2 sm:grid-cols-2">
            <button
              v-for="c in CONTRACTOR_CLASSES"
              :key="c.code"
              type="button"
              :class="[
                'rounded-lg border px-3 py-2.5 text-left',
                form.contractorClass === c.code ? 'border-[var(--accent-500)] bg-[var(--accent-50)]' : 'border-slate-200 dark:border-slate-700',
              ]"
              @click="form.contractorClass = c.code"
            >
              <p class="text-sm font-semibold text-slate-800 dark:text-slate-200">{{ c.label }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">{{ c.ceilingLabel }}</p>
              <p class="mt-1 text-[11px] text-slate-400 dark:text-slate-500">{{ ts("st.ceApply.classReq") }}: {{ classRequirementsLabel(c.code) }}</p>
            </button>
          </div>
        </div>

        <label v-if="kindMeta.needsVoltage" class="block">
          <span class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{{ ts("st.ceApply.voltage") }}</span>
          <select v-model="form.voltage" class="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm">
            <option v-for="v in CONTRACTOR_VOLTAGES" :key="v.code" :value="v.code">{{ v.code }}</option>
          </select>
        </label>

        <label class="block">
          <span class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{{ ts("st.ceApply.period") }}</span>
          <select v-model.number="form.periodYears" class="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm">
            <option v-for="p in PERIODS" :key="p" :value="p">{{ ts("st.okApply.periodYear", { n: p }) }}</option>
          </select>
        </label>
      </div>

      <!-- B: Syarikat -->
      <div v-else-if="step === 1" class="space-y-4">
        <div class="grid gap-4 sm:grid-cols-2">
          <label class="block sm:col-span-2">
            <span class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{{ ts("st.ceApply.companyName") }}</span>
            <input v-model="form.companyName" class="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm" />
          </label>
          <label class="block">
            <span class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{{ ts("st.ceApply.companyReg") }}</span>
            <input v-model="form.companyRegNo" class="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm" />
          </label>
          <label class="block">
            <span class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{{ ts("st.ceApply.companyEmail") }}</span>
            <input v-model="form.companyEmail" type="email" class="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm" />
          </label>
          <div class="sm:col-span-2">
            <p class="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">{{ ts("st.ceApply.companyAddress") }}</p>
            <AddressFieldset v-model="addressForm" />
          </div>
          <label class="block">
            <span class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{{ ts("st.ceApply.companyPhone") }}</span>
            <input v-model="form.companyPhone" class="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm" />
          </label>
          <label class="block">
            <span class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{{ ts("st.ceApply.companyFax") }}</span>
            <input v-model="form.companyFax" class="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm" />
          </label>
        </div>

        <div>
          <div class="mb-2 flex items-center justify-between">
            <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ ts("st.ceApply.directors") }}</span>
            <button type="button" class="flex items-center gap-1 text-xs font-medium text-[var(--accent-700)]" @click="addDirector">
              <Plus class="h-3.5 w-3.5" /> {{ ts("st.ceApply.addDirector") }}
            </button>
          </div>
          <div class="space-y-3">
            <div v-for="d in directors" :key="d.id" class="grid gap-2 rounded-lg border border-slate-200 dark:border-slate-700 p-3 sm:grid-cols-2">
              <input v-model="d.name" :placeholder="ts('st.okApply.fullName')" class="rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm" />
              <input v-model="d.icNumber" :placeholder="ts('st.okApply.ic')" class="rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm" />
              <input v-model="d.address" :placeholder="ts('st.okApply.address')" class="rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm sm:col-span-2" />
              <div class="flex items-center gap-2 sm:col-span-2">
                <input v-model.number="d.sharePercent" type="number" min="0" max="100" class="w-28 rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm" />
                <span class="text-xs text-slate-500 dark:text-slate-400">{{ ts("st.ceApply.sharePercent") }}</span>
                <button v-if="directors.length > 1" type="button" class="ml-auto text-xs text-rose-600 dark:text-rose-400" @click="removeDirector(d.id)">
                  {{ ts("st.ceApply.remove") }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- C: Personel (OK) — PFD-RG-CE-NA-02 Carian OK when kindMeta.needsOkSearch -->
      <div v-else-if="step === 2" class="space-y-4">
        <template v-if="kindMeta.needsOkSearch">
          <div>
            <p class="text-sm font-semibold text-slate-800 dark:text-slate-200">{{ ts("st.ceApply.carianOkTitle") }}</p>
            <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{{ ts("st.ceApply.carianOkHint") }}</p>
          </div>

          <div v-if="kindMeta.needsClass" class="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-3">
            <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{{ ts("st.ceApply.classReq") }} {{ form.contractorClass }}</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="row in okValidation.items"
                :key="row.wirerType"
                :class="['inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium', row.ok ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400' : 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400']"
              >
                <Check v-if="row.ok" class="h-3.5 w-3.5" /><X v-else class="h-3.5 w-3.5" />
                {{ row.wirerType }}: {{ row.have }}/{{ row.need }}
              </span>
            </div>
          </div>

          <div class="relative">
            <Search class="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input v-model="okSearch" :placeholder="ts('st.ceApply.searchOk')" class="w-full rounded-md border border-slate-300 dark:border-slate-600 py-2 pl-9 pr-3 text-sm" />
          </div>
          <div class="max-h-64 space-y-2 overflow-y-auto">
            <button
              v-for="o in okResults"
              :key="o.id"
              type="button"
              :disabled="o.employedElsewhere && !isOkSelected(o.id)"
              :class="[
                'flex w-full items-start justify-between gap-2 rounded-lg border px-3 py-2.5 text-left text-sm',
                o.employedElsewhere ? 'border-rose-200 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-500/15 opacity-80' : isOkSelected(o.id) ? 'border-[var(--accent-500)] bg-[var(--accent-50)]' : 'border-slate-200 dark:border-slate-700',
              ]"
              @click="toggleOk(o)"
            >
              <span>
                <span class="block font-semibold text-slate-800 dark:text-slate-200">{{ o.name }}</span>
                <span class="block font-mono text-xs text-slate-500 dark:text-slate-400">{{ o.mykad }} · {{ o.certificateNo }}</span>
                <span class="block text-[11px] text-slate-400 dark:text-slate-500">{{ o.wirerType }} · {{ o.voltageRestriction }} · {{ o.placeRestriction }}</span>
                <span v-if="o.employedElsewhere" class="mt-1 block text-[11px] font-medium text-rose-600 dark:text-rose-400">{{ ts("st.ceApply.okBlocked") }} ({{ o.currentEmployerName }})</span>
              </span>
              <span v-if="isOkSelected(o.id)" class="rounded-full bg-[var(--accent-600)] p-1 text-white"><Check class="h-3 w-3" /></span>
            </button>
          </div>

          <div v-if="appointedOks.length" class="space-y-2">
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{{ appointedOks.length }} OK</p>
            <div v-for="a in appointedOks" :key="a.okId" class="space-y-1.5 rounded-md border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm">
              <div class="flex flex-wrap items-center gap-3">
                <span class="font-medium text-slate-800 dark:text-slate-200">{{ a.name }}</span>
                <label class="ml-auto flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  {{ ts("st.ceApply.okPeriod") }}
                  <select v-model.number="a.periodYears" class="rounded border border-slate-300 dark:border-slate-600 px-2 py-1">
                    <option v-for="p in PERIODS" :key="p" :value="p">{{ p }}</option>
                  </select>
                </label>
              </div>
              <p
                v-for="row in appointedCdpRows.filter((r) => r.okId === a.okId)"
                :key="`${a.okId}-cdp`"
                :class="[
                  'text-[11px]',
                  row.gate.isFirstRegistration
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : row.gate.allowed
                      ? 'text-slate-500 dark:text-slate-400'
                      : 'font-medium text-rose-600 dark:text-rose-400',
                ]"
              >
                <span v-if="row.gate.isFirstRegistration">{{ ts("st.ceApply.cdpFirst") }}</span>
                <span v-else-if="row.gate.allowed">{{ ts("st.ceApply.cdpOk", { have: row.gate.available, need: row.gate.required }) }}</span>
                <span v-else>{{ ts("st.ceApply.cdpFail", { have: row.gate.available, need: row.gate.required }) }}</span>
              </p>
            </div>
          </div>
        </template>

        <div v-if="kindMeta.needsSkilledPersons" class="space-y-2">
          <div class="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-500/15 px-3 py-2 text-xs text-amber-900 dark:text-amber-400">
            {{ ts("st.ceApply.skilledHint") }}
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ ts("st.ceApply.skilled") }}</span>
            <button type="button" class="flex items-center gap-1 text-xs font-medium text-[var(--accent-700)]" @click="addSkilled">
              <Plus class="h-3.5 w-3.5" /> {{ ts("st.ceApply.addSkilled") }}
            </button>
          </div>
          <div v-for="s in skilledPersons" :key="s.id" class="grid gap-2 rounded-lg border border-slate-200 dark:border-slate-700 p-3 sm:grid-cols-2">
            <input v-model="s.name" :placeholder="ts('st.okApply.fullName')" class="rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm" />
            <input v-model="s.icNumber" :placeholder="ts('st.okApply.ic')" class="rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm" />
            <input v-model="s.qualification" :placeholder="ts('st.ceApply.qualification')" class="rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm" />
            <input v-model="s.field" :placeholder="ts('st.ceApply.field')" class="rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm" />
            <button type="button" class="text-left text-xs text-rose-600 dark:text-rose-400" @click="skilledPersons = skilledPersons.filter((x) => x.id !== s.id)">{{ ts("st.ceApply.remove") }}</button>
          </div>
        </div>

        <div v-if="kindMeta.needsProfessionalEngineers" class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ ts("st.ceApply.engineers") }}</span>
            <button type="button" class="flex items-center gap-1 text-xs font-medium text-[var(--accent-700)]" @click="addEngineer">
              <Plus class="h-3.5 w-3.5" /> {{ ts("st.ceApply.addEngineer") }}
            </button>
          </div>
          <div v-for="e in professionalEngineers" :key="e.id" class="grid gap-2 rounded-lg border border-slate-200 dark:border-slate-700 p-3 sm:grid-cols-3">
            <input v-model="e.registrationNo" :placeholder="ts('st.ceApply.engReg')" class="rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm" />
            <input v-model="e.name" :placeholder="ts('st.okApply.fullName')" class="rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm" />
            <input v-model="e.icNumber" :placeholder="ts('st.okApply.ic')" class="rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm" />
            <button type="button" class="text-left text-xs text-rose-600 dark:text-rose-400 sm:col-span-3" @click="professionalEngineers = professionalEngineers.filter((x) => x.id !== e.id)">{{ ts("st.ceApply.remove") }}</button>
          </div>
        </div>
      </div>

      <!-- D: Peralatan -->
      <div v-else-if="step === 3" class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ ts("st.ceApply.equipment") }}</span>
          <button type="button" class="flex items-center gap-1 text-xs font-medium text-[var(--accent-700)]" @click="addEquipment">
            <Plus class="h-3.5 w-3.5" /> {{ ts("st.ceApply.addEquip") }}
          </button>
        </div>
        <p v-if="equipment.length === 0" class="py-6 text-center text-sm text-slate-400 dark:text-slate-500">{{ ts("st.ceApply.addEquip") }}</p>
        <div v-for="eq in equipment" :key="eq.id" class="grid gap-2 rounded-lg border border-slate-200 dark:border-slate-700 p-3 sm:grid-cols-2">
          <label class="block text-xs">
            <span class="mb-1 block text-slate-500 dark:text-slate-400">{{ ts("st.ceApply.equipType") }}</span>
            <select v-model="eq.equipmentType" class="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm">
              <option v-for="t in TEST_EQUIPMENT_TYPES" :key="t.code" :value="t.code">{{ locale === "bi" ? t.bi : t.bm }}</option>
            </select>
          </label>
          <label class="block text-xs">
            <span class="mb-1 block text-slate-500 dark:text-slate-400">{{ ts("st.ceApply.serial") }}</span>
            <input v-model="eq.serialNo" class="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm" />
          </label>
          <label class="block text-xs">
            <span class="mb-1 block text-slate-500 dark:text-slate-400">{{ ts("st.ceApply.brand") }}</span>
            <select v-model="eq.brand" class="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm">
              <option v-for="b in EQUIPMENT_BRANDS" :key="b.code" :value="b.code">{{ locale === "bi" ? b.bi : b.bm }}</option>
            </select>
          </label>
          <label class="block text-xs">
            <span class="mb-1 block text-slate-500 dark:text-slate-400">{{ ts("st.ceApply.model") }}</span>
            <input v-model="eq.model" class="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm" />
          </label>
          <button type="button" class="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400" @click="equipment = equipment.filter((x) => x.id !== eq.id)">
            <Trash2 class="h-3.5 w-3.5" /> {{ ts("st.ceApply.remove") }}
          </button>
        </div>
      </div>

      <!-- E+F: Checklist + Docs -->
      <div v-else-if="step === 4" class="space-y-5">
        <div>
          <p class="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">{{ ts("st.ceApply.confirmTitle") }}</p>
          <div class="space-y-2">
            <label v-for="c in CONFIRMATION_CHECKS" :key="c.id" class="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                class="mt-0.5 h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-[var(--accent-600)]"
                :checked="confirmationChecks.includes(c.id)"
                @change="toggleCheck(c.id)"
              />
              <span>{{ locale === "bi" ? c.bi : c.bm }}</span>
            </label>
          </div>
        </div>
        <div>
          <p class="mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">{{ ts("st.ceApply.docsTitle") }}</p>
          <p class="mb-2 text-xs text-slate-500 dark:text-slate-400">{{ ts("st.ceApply.docsHint") }}</p>
          <DocumentUploadField v-model="documents" :labels="DOC_LABELS" />
        </div>
      </div>

      <!-- G: Pengakuan -->
      <div v-else class="space-y-4">
        <dl class="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
          <div class="flex justify-between gap-4 py-2"><dt class="text-slate-500 dark:text-slate-400">{{ ts("st.ceApply.kind") }}</dt><dd class="text-right text-slate-800 dark:text-slate-200">{{ kindLabel(form.contractorKind) }}</dd></div>
          <div v-if="kindMeta.needsClass" class="flex justify-between gap-4 py-2"><dt class="text-slate-500 dark:text-slate-400">{{ ts("st.ceApply.class") }}</dt><dd class="text-slate-800 dark:text-slate-200">{{ form.contractorClass }}</dd></div>
          <div v-if="kindMeta.needsVoltage" class="flex justify-between gap-4 py-2"><dt class="text-slate-500 dark:text-slate-400">{{ ts("st.ceApply.voltage") }}</dt><dd class="text-slate-800 dark:text-slate-200">{{ form.voltage }}</dd></div>
          <div class="flex justify-between gap-4 py-2"><dt class="text-slate-500 dark:text-slate-400">{{ ts("st.ceApply.companyName") }}</dt><dd class="text-right text-slate-800 dark:text-slate-200">{{ form.companyName }}</dd></div>
          <div class="flex justify-between gap-4 py-2"><dt class="text-slate-500 dark:text-slate-400">{{ ts("st.ceApply.stepC") }}</dt><dd class="text-slate-800 dark:text-slate-200">{{ appointedOks.length + skilledPersons.length + professionalEngineers.length }}</dd></div>
          <div class="flex justify-between gap-4 py-2"><dt class="text-slate-500 dark:text-slate-400">{{ ts("st.ceApply.equipment") }}</dt><dd class="text-slate-800 dark:text-slate-200">{{ equipment.length }}</dd></div>
          <div class="flex justify-between gap-4 py-2"><dt class="text-slate-500 dark:text-slate-400">{{ ts("st.ceApply.docsTitle") }}</dt><dd class="text-slate-800 dark:text-slate-200">{{ documents.length }}</dd></div>
        </dl>

        <div class="space-y-2 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
          <label class="flex items-start gap-2 text-sm"><input v-model="declarations.truthful" type="checkbox" class="mt-0.5 h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-[var(--accent-600)]" /><span>{{ ts("st.okApply.decl1") }}</span></label>
          <label class="flex items-start gap-2 text-sm"><input v-model="declarations.terms" type="checkbox" class="mt-0.5 h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-[var(--accent-600)]" /><span>{{ ts("st.okApply.decl2") }}</span></label>
          <label class="flex items-start gap-2 text-sm"><input v-model="declarations.consent" type="checkbox" class="mt-0.5 h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-[var(--accent-600)]" /><span>{{ ts("st.okApply.decl3") }}</span></label>
        </div>

        <label class="block">
          <span class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{{ ts("st.okApply.pin") }}</span>
          <input v-model="submitPin" type="password" inputmode="numeric" maxlength="6" class="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm tracking-[0.3em]" />
          <span class="mt-1 block text-[11px] text-slate-400 dark:text-slate-500">{{ ts("st.okApply.pinHint", { n: DEMO_SUBMIT_PIN }) }}</span>
        </label>
      </div>

      <div class="mt-6 flex flex-wrap justify-between gap-2">
        <button type="button" class="rounded-md border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 disabled:opacity-50" :disabled="step === 0" @click="back">
          {{ ts("st.okApply.back") }}
        </button>
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="rounded-md border border-[var(--accent-600)] px-4 py-2 text-sm font-medium text-[var(--accent-700)] hover:bg-[var(--accent-50)] dark:border-[var(--accent-500)] dark:text-[var(--accent-400)] dark:hover:bg-[var(--accent-500)]/10"
            @click="saveDraft()"
          >
            {{ ts("st.okApply.saveDraft") }}
          </button>
          <button v-if="step < STEPS.length - 1" type="button" class="rounded-md bg-[var(--accent-600)] px-5 py-2 text-sm font-medium text-white hover:bg-[var(--accent-700)]" @click="next">
            {{ ts("st.okApply.next") }}
          </button>
          <button v-else type="button" class="rounded-md bg-[var(--accent-600)] px-5 py-2 text-sm font-medium text-white hover:bg-[var(--accent-700)] disabled:opacity-50" :disabled="!canSubmit" @click="submit">
            {{ ts("st.okApply.submit") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
