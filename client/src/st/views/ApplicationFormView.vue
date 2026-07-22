<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Check, Search, X } from "lucide-vue-next";

import { useToast } from "@/composables/useToast";

import { formatAddress, isAddressComplete, parseAddress, type StAddress } from "../address";
import AddressFieldset from "../components/AddressFieldset.vue";

import type {
  AppDocument,
  AppointedOk,
  CompetencyCategory,
  ContractorClass,
  EmployerRef,
  RegistrationPeriod,
  WirerType,
  WorkflowType,
} from "../types";
import { useStSessionStore } from "../stores/session";
import { useStWorkflowStore, DEMO_SUBMIT_PIN } from "../stores/workflow";
import { COMPETENCY_CATEGORIES, CONTRACTOR_CLASSES, validateOkSet } from "../mock/competencies";
import { employerById, searchEmployers, EMPLOYER_CATEGORY_LABEL } from "../mock/employers";
import { okById, searchOks } from "../mock/competent-persons";
import { workflowLabel } from "../status";
import DocumentUploadField from "../components/DocumentUploadField.vue";
import StPageHero from "../components/StPageHero.vue";

// Lead-confirmer priority: a higher-graded wirer accepts the appointment on behalf.
const WIRER_RANK: Record<WirerType, number> = { PW4: 6, PW5: 5, PW6: 4, PW3: 3, PW2: 2, PW1: 1 };

const route = useRoute();
const router = useRouter();
const toast = useToast();
const session = useStSessionStore();
const workflow = useStWorkflowStore();

const workflowType = computed<WorkflowType>(() => (route.query.type === "CE" ? "CE" : "OK"));
const isCE = computed(() => workflowType.value === "CE");

// Kontraktor Elektrik is Majikan-only — redirect legacy ?type=CE to the CE wizard (or home for Pemohon).
onMounted(() => {
  if (!isCE.value) return;
  if (session.role === "employer") {
    router.replace("/st/registration/contractor-electric/applications/new");
    return;
  }
  toast.error("Akses", "Pendaftaran Kontraktor Elektrik hanya untuk akaun Majikan.");
  router.replace(session.homeRoute());
});

const persona = computed(() => session.currentPersona);

// ── form state ────────────────────────────────────────────────────────────
const form = reactive({
  fullName: persona.value?.name ?? "",
  icNumber: persona.value?.icNumber ?? "850101-10-0000",
  dob: "1985-01-01",
  age: 41,
  address: "No. 1, Jalan Contoh, 40000 Shah Alam, Selangor",
  phone: "012-3456789",
  email: persona.value?.email ?? "",
  competencyCategory: "PW" as CompetencyCategory,
  contractorClass: "C" as ContractorClass,
  registrationPeriodYears: 1 as RegistrationPeriod,
  // OK: selected employer; CE: selected competent person + company info
  employerId: "",
  companyName: persona.value?.organisation ?? "",
  companyRegNo: "201101023456 (945678-K)",
  companyAddress: "Lot 8, Jalan Teknologi 3/5, 47810 Petaling Jaya, Selangor",
});

const documents = ref<AppDocument[]>([]);

// ── declaration + security PIN (submission) ──────────────────────────────────
const declarations = reactive({ truthful: false, terms: false, consent: false });
const allDeclared = computed(() => declarations.truthful && declarations.terms && declarations.consent);
const submitPin = ref("");

const DOC_LABELS = computed(() =>
  isCE.value
    ? ["Salinan SSM Syarikat", "Borang 9 / 49", "Senarai Orang Kompeten", "Penyata Kewangan Terkini"]
    : ["Salinan Kad Pengenalan", "Sijil Kekompetenan", "Gambar Berukuran Pasport", "Surat Sokongan Majikan"],
);

// ── employer search (OK) ─────────────────────────────────────────────────────
// "Elastic" employer search — fuzzy, multi-field, ranked, ACTIVE-only.
const search = ref("");
const employerHits = computed(() => searchEmployers(search.value));
const selectedEmployer = computed(() => employerById(form.employerId));

// ── appointed Orang Kompeten (CE): multi-select + class validation ────────────
const okSearch = ref("");
const selectedOkIds = ref<string[]>([]);
const okResults = computed(() => searchOks(okSearch.value));
const selectedOks = computed(() => selectedOkIds.value.map(okById).filter((o): o is NonNullable<typeof o> => Boolean(o)));

function toggleOk(id: string) {
  const i = selectedOkIds.value.indexOf(id);
  if (i >= 0) selectedOkIds.value.splice(i, 1);
  else selectedOkIds.value.push(id);
}

// Live check of the selected OK set against the chosen contractor class.
const okValidation = computed(() => validateOkSet(selectedOks.value.map((o) => o.wirerType), form.contractorClass));

// Structured address entry (Alamat Baris 1/2, Daerah, Poskod, Negeri).
// Maps to company address (CE) or personal address (OK); flattened on submit.
const addressForm = ref<StAddress>(parseAddress(form.address));
const companyAddressForm = ref<StAddress>(parseAddress(form.companyAddress));
const addressModel = computed({
  get: () => (isCE.value ? companyAddressForm.value : addressForm.value),
  set: (v: StAddress) => {
    if (isCE.value) companyAddressForm.value = v;
    else addressForm.value = v;
  },
});

// ── steps ─────────────────────────────────────────────────────────────────
const STEPS = computed(() =>
  isCE.value
    ? ["Maklumat Syarikat", "Kelas & Tempoh", "Orang Kompeten", "Dokumen", "Semakan"]
    : ["Maklumat Pemohon", "Kekompetenan & Tempoh", "Majikan", "Dokumen", "Semakan"],
);
const step = ref(0);
const periods: RegistrationPeriod[] = [1, 2, 3, 4, 5];

function canProceed(): boolean {
  switch (step.value) {
    case 0:
      return Boolean(
        form.fullName &&
          form.email &&
          (isCE.value ? form.companyName : form.icNumber) &&
          isAddressComplete(addressModel.value),
      );
    case 2:
      return isCE.value ? okValidation.value.valid : Boolean(form.employerId);
    case 3:
      return documents.value.length > 0;
    default:
      return true;
  }
}

// Final submit gate (Review step): valid OK set (CE), declarations + security PIN.
const canSubmit = computed(() => {
  if (isCE.value && !okValidation.value.valid) return false;
  return allDeclared.value && submitPin.value.length >= 4;
});

function next() {
  if (!canProceed()) {
    toast.error("Maklumat tidak lengkap", "Sila lengkapkan ruangan yang diperlukan sebelum meneruskan.");
    return;
  }
  if (step.value < STEPS.value.length - 1) step.value++;
}

function back() {
  if (step.value > 0) step.value--;
}

function submit() {
  if (!session.currentPersonaId) return;

  if (isCE.value && !okValidation.value.valid) {
    toast.error("Syarat kelas tidak dipenuhi", "Bilangan/kategori Orang Kompeten belum menepati syarat kelas kontraktor.");
    return;
  }
  if (!allDeclared.value) {
    toast.error("Pengakuan diperlukan", "Sila tandakan ketiga-tiga pengakuan sebelum menghantar.");
    return;
  }
  if (submitPin.value !== DEMO_SUBMIT_PIN) {
    toast.error("PIN keselamatan tidak sah", "Sila masukkan PIN keselamatan yang betul untuk menghantar.");
    return;
  }

  let employer: EmployerRef | undefined;
  let appointedOks: AppointedOk[] | undefined;

  if (isCE.value) {
    // Lead confirmer = highest-graded selected OK that is also a login persona.
    const lead = [...selectedOks.value]
      .filter((o) => o.linkedPersonaId)
      .sort((a, b) => WIRER_RANK[b.wirerType] - WIRER_RANK[a.wirerType])[0];

    appointedOks = selectedOks.value.map((o) => ({
      registeredOkId: o.id,
      personaId: o.linkedPersonaId,
      name: o.name,
      mykad: o.mykad,
      wirerType: o.wirerType,
      competencyCategory: o.competencyCategory,
      // Only the lead login-persona OK confirms in-app; the rest auto-accept (demo).
      confirmed: !(lead && o.id === lead.id),
      confirmedAt: !(lead && o.id === lead.id) ? new Date(workflow.now).toISOString() : undefined,
    }));

    const confirmerPersonaId = lead?.linkedPersonaId ?? session.currentPersonaId;
    employer = {
      id: `ce-${form.companyRegNo}`,
      name: form.companyName,
      registrationNo: form.companyRegNo,
      address: formatAddress(companyAddressForm.value),
      contactPerson: lead?.name ?? form.fullName,
      confirmerPersonaId,
    };
  }

  const id = workflow.submitNewApplication({
    workflowType: workflowType.value,
    applicantPersonaId: session.currentPersonaId,
    applicant: {
      fullName: form.fullName,
      icNumber: form.icNumber,
      dob: form.dob,
      age: Number(form.age),
      address: formatAddress(isCE.value ? companyAddressForm.value : addressForm.value),
      phone: form.phone,
      email: form.email,
    },
    competencyCategory: isCE.value ? undefined : form.competencyCategory,
    contractorClass: isCE.value ? form.contractorClass : undefined,
    registrationPeriodYears: form.registrationPeriodYears,
    employerId: isCE.value ? undefined : form.employerId,
    employer,
    appointedOks,
    declarationAccepted: true,
    documents: documents.value,
  });

  toast.success("Permohonan dihantar", "Permohonan anda menunggu pengesahan lantikan.");
  router.push(`/st/applications/${id}`);
}
</script>

<template>
  <div class="space-y-5">
    <StPageHero :title="workflowLabel(workflowType)" subtitle="Lengkapkan borang permohonan baharu" />

    <!-- step indicator -->
    <ol class="flex items-center gap-1 text-xs">
      <li v-for="(s, i) in STEPS" :key="s" class="flex flex-1 items-center gap-1">
        <span
          :class="[
            'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold',
            i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-[var(--accent-600)] text-white' : 'bg-slate-200 text-slate-500',
          ]"
        >
          <Check v-if="i < step" class="h-3.5 w-3.5" />
          <template v-else>{{ i + 1 }}</template>
        </span>
        <span :class="['hidden truncate sm:inline', i === step ? 'font-medium text-slate-700' : 'text-slate-400']">{{ s }}</span>
        <span v-if="i < STEPS.length - 1" class="h-px flex-1 bg-slate-200" />
      </li>
    </ol>

    <div class="border-t border-slate-200 pt-6">
      <!-- STEP 0: applicant / company -->
      <div v-if="step === 0" class="space-y-4">
        <div class="grid gap-4 sm:grid-cols-2">
          <label class="block">
            <span class="mb-1 block text-sm font-medium text-slate-700">{{ isCE ? "Nama Wakil Syarikat" : "Nama Penuh" }}</span>
            <input v-model="form.fullName" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[var(--accent-500)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)]/30" />
          </label>
          <label class="block">
            <span class="mb-1 block text-sm font-medium text-slate-700">No. Kad Pengenalan</span>
            <input v-model="form.icNumber" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[var(--accent-500)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)]/30" />
          </label>
          <template v-if="isCE">
            <label class="block sm:col-span-2">
              <span class="mb-1 block text-sm font-medium text-slate-700">Nama Syarikat</span>
              <input v-model="form.companyName" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[var(--accent-500)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)]/30" />
            </label>
            <label class="block">
              <span class="mb-1 block text-sm font-medium text-slate-700">No. Pendaftaran SSM</span>
              <input v-model="form.companyRegNo" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[var(--accent-500)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)]/30" />
            </label>
          </template>
          <template v-else>
            <label class="block">
              <span class="mb-1 block text-sm font-medium text-slate-700">Umur</span>
              <input v-model.number="form.age" type="number" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[var(--accent-500)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)]/30" />
            </label>
          </template>
          <label class="block">
            <span class="mb-1 block text-sm font-medium text-slate-700">Telefon</span>
            <input v-model="form.phone" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[var(--accent-500)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)]/30" />
          </label>
          <label class="block">
            <span class="mb-1 block text-sm font-medium text-slate-700">E-mel</span>
            <input v-model="form.email" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[var(--accent-500)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)]/30" />
          </label>
          <div class="sm:col-span-2">
            <p class="mb-2 text-sm font-medium text-slate-700">{{ isCE ? "Alamat Syarikat" : "Alamat" }}</p>
            <AddressFieldset v-model="addressModel" />
          </div>
        </div>
      </div>

      <!-- STEP 1: competency/class + period -->
      <div v-else-if="step === 1" class="space-y-4">
        <div v-if="!isCE">
          <span class="mb-2 block text-sm font-medium text-slate-700">Kategori Kekompetenan</span>
          <div class="grid gap-2 sm:grid-cols-2">
            <button
              v-for="c in COMPETENCY_CATEGORIES"
              :key="c.code"
              type="button"
              :class="['rounded-lg border px-3 py-2.5 text-left transition-colors', form.competencyCategory === c.code ? 'border-[var(--accent-500)] bg-[var(--accent-50)]' : 'border-slate-200 hover:border-[var(--accent-ring)]']"
              @click="form.competencyCategory = c.code"
            >
              <p class="text-sm font-semibold text-slate-800">{{ c.code }} — {{ c.label }}</p>
              <p class="text-xs text-slate-500">{{ c.description }} · had umur {{ c.maxAge }}</p>
            </button>
          </div>
        </div>
        <div v-else>
          <span class="mb-2 block text-sm font-medium text-slate-700">Kelas Kontraktor</span>
          <div class="grid gap-2 sm:grid-cols-2">
            <button
              v-for="c in CONTRACTOR_CLASSES"
              :key="c.code"
              type="button"
              :class="['rounded-lg border px-3 py-2.5 text-left transition-colors', form.contractorClass === c.code ? 'border-[var(--accent-500)] bg-[var(--accent-50)]' : 'border-slate-200 hover:border-[var(--accent-ring)]']"
              @click="form.contractorClass = c.code"
            >
              <p class="text-sm font-semibold text-slate-800">{{ c.label }}</p>
              <p class="text-xs text-slate-500">{{ c.ceilingLabel }} · min {{ c.minCompetentPersons }} O.K.</p>
            </button>
          </div>
        </div>

        <label class="block">
          <span class="mb-1 block text-sm font-medium text-slate-700">Tempoh Pendaftaran</span>
          <select v-model.number="form.registrationPeriodYears" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[var(--accent-500)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)]/30">
            <option v-for="p in periods" :key="p" :value="p">{{ p }} tahun</option>
          </select>
        </label>
      </div>

      <!-- STEP 2: employer (OK) / competent person (CE) -->
      <div v-else-if="step === 2" class="space-y-3">
        <template v-if="!isCE">
          <p class="text-sm text-slate-600">
            Cari majikan melalui carian pintar (nama, No. Pendaftaran SSM, No. Pendaftaran ST, bandar atau negeri). Hanya pendaftaran <span class="font-medium text-emerald-700">AKTIF</span> dipaparkan.
          </p>
          <div class="relative">
            <Search class="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              v-model="search"
              placeholder="Cth: elektrik, 1245678, ST-CE, Petaling Jaya…"
              class="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-[var(--accent-500)] focus:outline-hidden focus:ring-2 focus:ring-[var(--accent-ring)]/30"
            />
          </div>
          <div class="space-y-2">
            <button
              v-for="hit in employerHits"
              :key="hit.employer.id"
              type="button"
              :class="['block w-full rounded-lg border px-3 py-2.5 text-left transition-colors', form.employerId === hit.employer.id ? 'border-[var(--accent-500)] bg-[var(--accent-50)]' : 'border-slate-200 hover:border-[var(--accent-ring)]']"
              @click="form.employerId = hit.employer.id"
            >
              <div class="flex items-start justify-between gap-2">
                <p class="text-sm font-semibold text-slate-800">{{ hit.employer.name }}</p>
                <span class="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                  {{ hit.employer.category ? EMPLOYER_CATEGORY_LABEL[hit.employer.category] : "—" }}
                </span>
              </div>
              <p class="mt-0.5 text-xs text-slate-500">
                {{ hit.employer.registrationNo }}
                <template v-if="hit.employer.stRegNo"> · <span class="font-mono">{{ hit.employer.stRegNo }}</span></template>
              </p>
              <p class="text-xs text-slate-400">{{ hit.employer.contactPerson }} · {{ hit.employer.city }}, {{ hit.employer.state }}</p>
              <p v-if="search.trim() && hit.matchedField" class="mt-1 text-[11px] text-[var(--accent-700)]">
                dipadan pada: {{ hit.matchedField }}
              </p>
            </button>
            <p v-if="employerHits.length === 0" class="py-4 text-center text-sm text-slate-400">Tiada majikan sepadan.</p>
          </div>
        </template>
        <template v-else>
          <p class="text-sm text-slate-600">Cari Orang Kompeten berdaftar mengikut No. MyKad atau nama, kemudian lantik bilangan/kategori yang menepati syarat kelas.</p>

          <!-- Live class requirement checklist -->
          <div class="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Syarat Kelas {{ form.contractorClass }} — semakan automatik</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="row in okValidation.items"
                :key="row.wirerType"
                :class="['inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium', row.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700']"
              >
                <Check v-if="row.ok" class="h-3.5 w-3.5" /><X v-else class="h-3.5 w-3.5" />
                {{ row.wirerType }}: {{ row.have }}/{{ row.need }}
              </span>
            </div>
            <p :class="['mt-2 text-xs font-medium', okValidation.valid ? 'text-emerald-700' : 'text-rose-600']">
              {{ okValidation.valid ? "Syarat kelas dipenuhi — permohonan boleh dihantar." : "Syarat kelas belum dipenuhi — lantik lebih ramai Orang Kompeten." }}
            </p>
          </div>

          <div class="relative">
            <Search class="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input v-model="okSearch" placeholder="Cari nama atau No. MyKad Orang Kompeten..." class="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-[var(--accent-500)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)]/30" />
          </div>
          <div class="space-y-2">
            <button
              v-for="o in okResults"
              :key="o.id"
              type="button"
              :class="['flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left transition-colors', selectedOkIds.includes(o.id) ? 'border-[var(--accent-500)] bg-[var(--accent-50)]' : 'border-slate-200 hover:border-[var(--accent-ring)]']"
              @click="toggleOk(o.id)"
            >
              <span>
                <span class="block text-sm font-semibold text-slate-800">{{ o.name }}</span>
                <span class="block font-mono text-xs text-slate-500">{{ o.mykad }}</span>
              </span>
              <span class="flex items-center gap-2">
                <span class="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-600">{{ o.wirerType }}</span>
                <span v-if="selectedOkIds.includes(o.id)" class="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent-600)] text-white"><Check class="h-3 w-3" /></span>
              </span>
            </button>
            <p v-if="okResults.length === 0" class="py-4 text-center text-sm text-slate-400">Tiada Orang Kompeten sepadan.</p>
          </div>
          <p class="text-xs text-slate-500">{{ selectedOks.length }} Orang Kompeten dilantik.</p>
        </template>
      </div>

      <!-- STEP 3: documents -->
      <div v-else-if="step === 3" class="space-y-3">
        <p class="text-sm text-slate-600">Muat naik dokumen sokongan yang diperlukan. (Simulasi — klik untuk memuat naik fail contoh.)</p>
        <DocumentUploadField v-model="documents" :labels="DOC_LABELS" />
      </div>

      <!-- STEP 4: review -->
      <div v-else class="space-y-4">
        <h2 class="text-sm font-semibold text-slate-700">Semakan Permohonan</h2>
        <dl class="divide-y divide-slate-100 text-sm">
          <div class="flex justify-between py-2"><dt class="text-slate-500">Jenis</dt><dd class="font-medium text-slate-800">{{ workflowLabel(workflowType) }}</dd></div>
          <div class="flex justify-between py-2"><dt class="text-slate-500">{{ isCE ? "Wakil" : "Pemohon" }}</dt><dd class="text-slate-800">{{ form.fullName }}</dd></div>
          <div v-if="isCE" class="flex justify-between py-2"><dt class="text-slate-500">Syarikat</dt><dd class="text-slate-800">{{ form.companyName }}</dd></div>
          <div class="flex justify-between py-2">
            <dt class="text-slate-500">{{ isCE ? "Kelas" : "Kekompetenan" }}</dt>
            <dd class="text-slate-800">{{ isCE ? form.contractorClass : form.competencyCategory }}</dd>
          </div>
          <div class="flex justify-between py-2"><dt class="text-slate-500">Tempoh</dt><dd class="text-slate-800">{{ form.registrationPeriodYears }} tahun</dd></div>
          <div class="flex justify-between py-2">
            <dt class="text-slate-500">{{ isCE ? "Orang Kompeten Dilantik" : "Majikan" }}</dt>
            <dd class="text-right text-slate-800">{{ isCE ? (selectedOks.map((o) => `${o.name} (${o.wirerType})`).join(", ") || "—") : (selectedEmployer?.name ?? "—") }}</dd>
          </div>
          <div class="flex justify-between py-2"><dt class="text-slate-500">Dokumen</dt><dd class="text-slate-800">{{ documents.length }} fail</dd></div>
        </dl>

        <p v-if="isCE && !okValidation.valid" class="rounded-md bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
          Syarat kelas {{ form.contractorClass }} belum dipenuhi. Kembali ke langkah "Orang Kompeten" untuk melantik lebih ramai.
        </p>

        <!-- Declaration (Pengakuan) -->
        <div class="space-y-2 rounded-lg border border-slate-200 p-3">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Pengakuan Pemohon</p>
          <label class="flex items-start gap-2 text-sm text-slate-700">
            <input v-model="declarations.truthful" type="checkbox" class="mt-0.5 h-4 w-4 rounded border-slate-300 text-[var(--accent-600)] focus:ring-[var(--accent-ring)]" />
            <span>Saya mengaku bahawa semua maklumat yang diberikan adalah benar dan tepat.</span>
          </label>
          <label class="flex items-start gap-2 text-sm text-slate-700">
            <input v-model="declarations.terms" type="checkbox" class="mt-0.5 h-4 w-4 rounded border-slate-300 text-[var(--accent-600)] focus:ring-[var(--accent-ring)]" />
            <span>Saya memahami syarat-syarat pendaftaran yang ditetapkan oleh Suruhanjaya Tenaga.</span>
          </label>
          <label class="flex items-start gap-2 text-sm text-slate-700">
            <input v-model="declarations.consent" type="checkbox" class="mt-0.5 h-4 w-4 rounded border-slate-300 text-[var(--accent-600)] focus:ring-[var(--accent-ring)]" />
            <span>Saya bersetuju dengan terma penggunaan dan pemprosesan data peribadi.</span>
          </label>
        </div>

        <!-- Security PIN -->
        <label class="block">
          <span class="mb-1 block text-sm font-medium text-slate-700">PIN Keselamatan</span>
          <input
            v-model="submitPin"
            type="password"
            inputmode="numeric"
            maxlength="6"
            placeholder="Masukkan PIN keselamatan untuk menghantar"
            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm tracking-[0.3em] focus:border-[var(--accent-500)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)]/30"
          />
          <span class="mt-1 block text-[11px] text-slate-400">PIN demo: <span class="font-mono">{{ DEMO_SUBMIT_PIN }}</span></span>
        </label>

        <p class="rounded-md bg-[var(--accent-50)] px-3 py-2 text-xs text-slate-600">
          Selepas dihantar, {{ isCE ? "Orang Kompeten yang dilantik" : "majikan" }} akan menerima notifikasi untuk mengesahkan lantikan.
        </p>
      </div>

      <!-- nav -->
      <div class="mt-6 flex justify-between gap-2">
        <button
          class="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          :disabled="step === 0"
          @click="back"
        >
          Kembali
        </button>
        <button
          v-if="step < STEPS.length - 1"
          class="rounded-md bg-[var(--accent-600)] px-5 py-2 text-sm font-medium text-white hover:bg-[var(--accent-700)]"
          @click="next"
        >
          Seterusnya
        </button>
        <button
          v-else
          class="rounded-md bg-[var(--accent-600)] px-5 py-2 text-sm font-medium text-white hover:bg-[var(--accent-700)] disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="!canSubmit"
          @click="submit"
        >
          Hantar Permohonan
        </button>
      </div>
    </div>
  </div>
</template>
